# 💸 FinControl — Planos, Preços e Funcionalidades

> Documento de produto e pricing do **FinControl** — o app de finanças pessoais que organiza
> contas, transações, categorias, orçamentos e metas num só painel.
> Moeda: **BRL (R$)**. Ciclos: **mensal** e **anual (−20%)**.
> Última atualização: 2026-06.

---

## 1) O que é o FinControl

FinControl é um SaaS de **gestão de finanças pessoais**. O usuário registra suas contas
(carteira, banco, cartão), lança receitas e despesas por categoria, define orçamentos mensais
e acompanha o saldo e os relatórios — tudo em português.

Funcionalidades já existentes no site/landing:
- Landing institucional (Hero, Recursos, Preços, FAQ, Newsletter, Download)
- Páginas de autenticação (login, registro, recuperação de senha, 2FA)

Novas funcionalidades adicionadas ao virar SaaS funcional (ver seção 7).

---

## 2) Análise de mercado (resumo)

### 2.1 Categoria e concorrência
FinControl está no mercado de **apps de finanças pessoais (PFM)**, muito consolidado no Brasil.
Referências de preço praticadas:

| Produto (referência) | Faixa mensal (BRL) | Observação |
|---|---|---|
| Mobills | ~R$ 14–20/mês (Premium) | anual mais barato |
| Organizze | ~R$ 13–18/mês | planos pessoal/família |
| Olá (ex-GuiaBolso) | gratuito + serviços | foco em open finance |
| YNAB (EUA) | ~US$ 14,99/mês | referência internacional |
| Mobills Família | ~R$ 25–35/mês | múltiplos usuários |

### 2.2 Posicionamento do FinControl
- **Finanças pessoais em português**, simples e completo, com foco em controle manual + relatórios.
- Plano de entrada **gratuito real** (freemium) para conquistar usuários.
- **Pro** como âncora (contas e transações ilimitadas, orçamentos, metas, relatórios avançados).
- **Família/Enterprise** para múltiplos membros (orçamento compartilhado, perfis).
- **Cobrança por recursos** (contas, transações/mês, orçamentos, membros) — **nunca por GB**.

### 2.3 Conformidade (uso regular)
FinControl é uma ferramenta de **organização financeira pessoal**. Os dados são do próprio
usuário, isolados por conta (RLS). **Não** é instituição financeira, não movimenta dinheiro,
não oferece crédito nem investimento — apenas registra e organiza. Em conformidade com a
**LGPD**. Sem promessas de rentabilidade ou práticas enganosas — o valor é **controle e clareza**
das finanças.

---

## 3) Os 4 planos

| | **Inicial** | **Starter** | **Pro** ⭐ | **Família** |
|---|---|---|---|---|
| **Preço mensal** | **R$ 0** | **R$ 12/mês** | **R$ 24/mês** | **R$ 39/mês** |
| **Preço anual (−20%)** | R$ 0 | R$ 115/ano (R$ 9,58/mês) | R$ 230/ano (R$ 19,17/mês) | R$ 374/ano (R$ 31,17/mês) |
| **Para quem** | Começar / testar | Controle pessoal | Quem leva a sério | Casais e famílias |
| **Contas (carteira/banco/cartão)** | 2 | 5 | Ilimitadas | Ilimitadas |
| **Transações por mês** | 50 | 500 | Ilimitadas | Ilimitadas |
| **Categorias personalizadas** | 5 | Ilimitadas | Ilimitadas | Ilimitadas |
| **Orçamentos mensais** | — | 5 | Ilimitados | Ilimitados |
| **Metas financeiras** | — | 3 | Ilimitadas | Ilimitadas |
| **Relatórios e gráficos** | Básico | Intermediário | Avançado | Avançado |
| **Transações recorrentes** | — | ✅ | ✅ | ✅ |
| **Lembretes de contas a pagar** | — | E-mail | E-mail | E-mail |
| **Exportação (CSV/Excel)** | — | CSV | CSV/Excel | CSV/Excel |
| **Membros / perfis** | 1 | 1 | 1 | Até 5 |
| **Orçamento compartilhado** | — | — | — | ✅ |
| **Suporte** | Comunidade | E-mail | Prioritário | Prioritário |

⭐ **Pro é o plano em destaque.**

---

## 4) Detalhe por plano

### 🆓 Inicial (Grátis) — R$ 0
- 2 contas
- Até 50 transações por mês
- 5 categorias personalizadas
- Relatórios básicos (saldo, receitas x despesas)
- Suporte da comunidade

### 🚀 Starter — R$ 12/mês (R$ 115/ano)
- Até 5 contas
- 500 transações/mês
- Categorias ilimitadas
- 5 orçamentos mensais e 3 metas
- Transações recorrentes
- Lembretes de contas a pagar (e-mail)
- Exportação CSV
- Suporte por e-mail

### ⭐ Pro — R$ 24/mês (R$ 230/ano) — DESTAQUE
- Contas **ilimitadas**
- Transações **ilimitadas**
- Orçamentos e metas **ilimitados**
- Relatórios **avançados** (fluxo de caixa, evolução, por categoria)
- Exportação CSV/Excel
- Transações recorrentes e lembretes
- Suporte prioritário

### 👨‍👩‍👧 Família — R$ 39/mês (R$ 374/ano)
- Tudo do **Pro**
- Até **5 membros / perfis**
- **Orçamento compartilhado** da família
- Visão consolidada das finanças
- Suporte prioritário

---

## 5) Trial, downgrade e reembolso

- **7 dias grátis**: toda conta nova começa com **acesso completo nível Pro** por 7 dias, sem cartão.
- **Após o trial**: sem plano pago, a conta passa para **Inicial** e os recursos/rotas são
  **reduzidos** (gating por plano).
- **Reembolso de 7 dias**: em qualquer plano pago, há **7 dias** após a 1ª cobrança para
  reembolso integral (`refund_eligible_until`).
- **Cancelamento**: a qualquer momento pelo portal Stripe; acesso mantido até o fim do período pago.

---

## 6) Ciclo anual

| Plano | Mensal × 12 | Anual (−20%) | Economia |
|---|---|---|---|
| Starter | R$ 144 | **R$ 115** | R$ 29 |
| Pro | R$ 288 | **R$ 230** | R$ 58 |
| Família | R$ 468 | **R$ 374** | R$ 94 |

---

## 7) Novas funcionalidades ao virar SaaS funcional

- **Contas de usuário** (Supabase Auth) com perfil, plano e trial de 7 dias.
- **Assinaturas Stripe** (checkout, portal, webhook, reembolso 7d).
- **Gating por plano** (contas, transações, orçamentos, metas, membros).
- **Dashboard funcional**: contas, lançamentos (receitas/despesas), categorias, saldo e relatórios — antes só havia landing.
- **Painel administrativo** (usuários, assinaturas, receita).
- **Isolamento por usuário** (RLS) e auditoria.

---

## 8) Resumo de preços (cola rápida)

```
Inicial   R$ 0
Starter   R$ 12/mês   ·  R$ 115/ano
Pro ⭐    R$ 24/mês   ·  R$ 230/ano   (destaque)
Família   R$ 39/mês   ·  R$ 374/ano

Trial: 7 dias (nível Pro)  ·  Reembolso: 7 dias  ·  Sem cobrança por GB.
```
