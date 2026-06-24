-- ============================================================
-- FinControl — Schema (perfis, SaaS e domínio de finanças)
-- ============================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ── profiles ──────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text, full_name text, trial_ends_at timestamptz,
  plan_slug text default 'inicial', is_demo boolean default true,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
alter table public.profiles enable row level security;
drop policy if exists profiles_own on public.profiles;
create policy profiles_own on public.profiles for all using (id = auth.uid()) with check (id = auth.uid());

-- ── app_plans ─────────────────────────────────────────────
create table if not exists public.app_plans (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null, name text not null, description text,
  price_month integer not null default 0, price_year integer not null default 0,
  stripe_price_month text, stripe_price_year text,
  features jsonb not null default '[]'::jsonb, limits jsonb not null default '{}'::jsonb,
  highlighted boolean default false, active boolean default true, sort_order integer default 0
);
alter table public.app_plans enable row level security;
drop policy if exists app_plans_sel on public.app_plans;
create policy app_plans_sel on public.app_plans for select using (true);

-- ── app_subscriptions ─────────────────────────────────────
create table if not exists public.app_subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan_slug text not null default 'inicial', status text not null default 'trialing',
  cycle text default 'month', stripe_customer_id text, stripe_subscription_id text,
  current_period_end timestamptz, cancel_at_period_end boolean default false,
  refund_eligible_until timestamptz, created_at timestamptz default now(), updated_at timestamptz default now()
);
alter table public.app_subscriptions enable row level security;
drop policy if exists app_subs_own on public.app_subscriptions;
create policy app_subs_own on public.app_subscriptions for select using (user_id = auth.uid());

-- ── app_payment_events ─────────────────────────────────────
create table if not exists public.app_payment_events (
  id text primary key, type text, payload jsonb, created_at timestamptz default now()
);
alter table public.app_payment_events enable row level security;

-- ── Domínio: contas, categorias, transações (por usuário) ─
create table if not exists public.accounts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null, type text default 'carteira', -- carteira, banco, cartao, poupanca
  initial_balance numeric default 0, color text default '#10b981',
  created_at timestamptz default now(), updated_at timestamptz default now()
);
alter table public.accounts enable row level security;
drop policy if exists accounts_own on public.accounts;
create policy accounts_own on public.accounts for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create index if not exists idx_accounts_user on public.accounts(user_id);

create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null, kind text default 'despesa' check (kind in ('receita','despesa')),
  color text default '#64748b', created_at timestamptz default now()
);
alter table public.categories enable row level security;
drop policy if exists categories_own on public.categories;
create policy categories_own on public.categories for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create index if not exists idx_categories_user on public.categories(user_id);

create table if not exists public.transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid references public.accounts(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  kind text default 'despesa' check (kind in ('receita','despesa')),
  description text, amount numeric not null default 0, occurred_at date not null default current_date,
  notes text, created_at timestamptz default now(), updated_at timestamptz default now()
);
alter table public.transactions enable row level security;
drop policy if exists transactions_own on public.transactions;
create policy transactions_own on public.transactions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create index if not exists idx_transactions_user on public.transactions(user_id);
create index if not exists idx_transactions_date on public.transactions(user_id, occurred_at desc);

create table if not exists public.budgets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  amount numeric not null default 0, month date not null default date_trunc('month', current_date),
  created_at timestamptz default now()
);
alter table public.budgets enable row level security;
drop policy if exists budgets_own on public.budgets;
create policy budgets_own on public.budgets for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ── updated_at helper ─────────────────────────────────────
create or replace function public.app_touch_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists trg_app_subs on public.app_subscriptions;
create trigger trg_app_subs before update on public.app_subscriptions for each row execute function public.app_touch_updated_at();
drop trigger if exists trg_accounts on public.accounts;
create trigger trg_accounts before update on public.accounts for each row execute function public.app_touch_updated_at();
drop trigger if exists trg_transactions on public.transactions;
create trigger trg_transactions before update on public.transactions for each row execute function public.app_touch_updated_at();

-- ── handle_new_user: profile + trial 7d + subscription + dados base ─
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, trial_ends_at, is_demo, plan_slug)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name',''), now() + interval '7 days', true, 'inicial')
  on conflict (id) do nothing;
  insert into public.app_subscriptions (user_id, plan_slug, status, current_period_end)
  values (new.id, 'inicial', 'trialing', now() + interval '7 days')
  on conflict (user_id) do nothing;
  -- conta e categorias iniciais
  insert into public.accounts (user_id, name, type) values (new.id, 'Carteira', 'carteira');
  insert into public.categories (user_id, name, kind, color) values
    (new.id, 'Salário', 'receita', '#10b981'),
    (new.id, 'Alimentação', 'despesa', '#ef4444'),
    (new.id, 'Transporte', 'despesa', '#f59e0b'),
    (new.id, 'Moradia', 'despesa', '#6366f1'),
    (new.id, 'Lazer', 'despesa', '#ec4899');
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- ── Seed dos planos ───────────────────────────────────────
insert into public.app_plans (slug,name,description,price_month,price_year,stripe_price_month,stripe_price_year,features,limits,highlighted,sort_order) values
('inicial','Inicial','Começar / testar',0,0,null,null,
 '["2 contas","Até 50 transações/mês","5 categorias","Relatórios básicos","Suporte da comunidade"]'::jsonb,
 '{"accounts":2,"tx_month":50,"categories":5,"budgets":0,"goals":0,"reports":"basic","recurring":false,"export":"none","members":1}'::jsonb,
 false,0),
('starter','Starter','Controle pessoal',1200,11500,'price_1TlhVsJ6zI3LognzRiH52ZFH','price_1TlhVsJ6zI3Lognz9ITh2P0y',
 '["Até 5 contas","500 transações/mês","Categorias ilimitadas","5 orçamentos e 3 metas","Transações recorrentes","Lembretes por e-mail","Exportação CSV","Suporte por e-mail"]'::jsonb,
 '{"accounts":5,"tx_month":500,"categories":-1,"budgets":5,"goals":3,"reports":"mid","recurring":true,"export":"csv","members":1}'::jsonb,
 false,1),
('pro','Pro','Quem leva a sério',2400,23000,'price_1TlhVtJ6zI3LognzEsGzKHYS','price_1TlhVuJ6zI3LognzbG5umoMd',
 '["Contas ilimitadas","Transações ilimitadas","Orçamentos e metas ilimitados","Relatórios avançados","Exportação CSV/Excel","Transações recorrentes","Suporte prioritário"]'::jsonb,
 '{"accounts":-1,"tx_month":-1,"categories":-1,"budgets":-1,"goals":-1,"reports":"advanced","recurring":true,"export":"excel","members":1}'::jsonb,
 true,2),
('familia','Família','Casais e famílias',3900,37400,'price_1TlhVvJ6zI3LognzjDWxieef','price_1TlhVwJ6zI3LognzghHp29zU',
 '["Tudo do Pro","Até 5 membros / perfis","Orçamento compartilhado","Visão consolidada","Suporte prioritário"]'::jsonb,
 '{"accounts":-1,"tx_month":-1,"categories":-1,"budgets":-1,"goals":-1,"reports":"advanced","recurring":true,"export":"excel","members":5}'::jsonb,
 false,3)
on conflict (slug) do update set
  name=excluded.name, description=excluded.description, price_month=excluded.price_month, price_year=excluded.price_year,
  stripe_price_month=excluded.stripe_price_month, stripe_price_year=excluded.stripe_price_year,
  features=excluded.features, limits=excluded.limits, highlighted=excluded.highlighted, sort_order=excluded.sort_order;
