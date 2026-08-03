# Deacomart Ltd — Product Requirements Document (PRD)

| | |
|---|---|
| **Product** | Deacomart Digital Marketplace & Agribusiness Management Platform |
| **Codename** | farm-fresh-direct |
| **Motto** | "Be EcoWise" |
| **Market** | Rwanda (national, all districts) |
| **Document version** | 1.0 |
| **Last updated** | 2026-08-02 |
| **Status** | Admin back-office live in production; public marketplace experience is a demo/prototype layer (see §5) |

---

## 1. Executive Summary

Deacomart is a digital agribusiness platform for Rwanda connecting farmers directly to buyers (individual consumers, hotels, restaurants, supermarkets, institutions), while also running farmer training, agricultural consultancy, food & beverage distribution, and logistics operations. The goal is to cut out unnecessary middlemen, raise farmer incomes, reduce post-harvest losses, and strengthen food safety standards nationwide.

As of this document, the product exists as two distinct layers that are **not yet connected**:

1. **A real, database-backed operational back-office** (`/admin/*`) — staff and management actually use this to run farmers, buyers, orders, training, consultancy, logistics, partnerships, and the blog. This layer has genuine authentication, RBAC, and audit logging.
2. **A public-facing website** (home, browse, product pages, cart, training/consultancy/careers pages) that currently runs on **seeded demo data stored in the visitor's browser (localStorage)**, not the real database. A product created in the real admin panel does not appear on the public site, and an order placed on the public site never reaches the real `orders` table.

This PRD documents the product vision, the current implementation reality (clearly distinguishing real vs. demo functionality), and the prioritized path to close that gap.

---

## 2. Problem Statement

Rwanda's agricultural value chain is fragmented: farmers sell through multiple middlemen who capture most of the margin, post-harvest losses are high due to poor storage and cold-chain access, buyers (especially hotels/supermarkets/institutions) struggle to source consistent quality produce, and farmers lack structured access to modern agricultural training, food safety certification support, and business consultancy.

## 3. Vision & Goals

- Eliminate unnecessary middlemen between farmers and buyers.
- Improve farmer incomes and reduce post-harvest losses.
- Increase market access across all of Rwanda's districts.
- Strengthen food safety standards and traceability.
- Provide a transparent, trustworthy agricultural marketplace.
- Support farmer capacity-building through structured training and consultancy.
- Digitize Rwanda's agricultural value chain end to end.

## 4. Target Users / Personas

| Persona | Description |
|---|---|
| **Farmer** | Registers, lists produce, receives training, tracks sales and performance. |
| **Buyer — Individual** | Consumer purchasing fresh produce or F&B products. |
| **Buyer — Institutional** | Hotels, restaurants, supermarkets, retailers, institutions sourcing at volume. |
| **Staff — Trainer / Consultant / Driver / Support** | Internal operational staff delivering training, consultancy, and logistics. |
| **Platform Admin** | One of nine back-office roles (§7) managing day-to-day operations. |
| **Partner Organization** | Cooperatives, NGOs, government bodies, hotels, supermarkets in formal partnership. |
| **Guest / Visitor** | Browses public content (blog, careers, about, courses) before registering. |

---

## 5. Product Scope — Current State at a Glance

This is the single most important table in this document. **Status** reflects what the code actually does today, verified against the codebase — not the original wishlist.

| Module | Status | Notes |
|---|---|---|
| Admin dashboard, KPIs, reports | 🟢 Real (DB) | Live Postgres aggregate queries. |
| Farmer / buyer / staff directories | 🟢 Real (DB) | Full CRUD against `farmers`, `buyers`, `staff`. |
| **Real** product catalog (admin) | 🟢 Real (DB) | `admin/marketplace/products.tsx` — approve/reject/feature workflow against the `products` table. |
| Order & payment management (admin) | 🟢 Real (DB) | `admin/marketplace/orders.tsx`, `payments.tsx`. |
| Training course management (admin) | 🟢 Real (DB) | `admin/training.tsx` against `training_courses`. |
| Consultancy request management (admin) | 🟢 Real (DB) | `admin/consultancy.tsx` against `consultancy_requests`. |
| Logistics (deliveries, vehicles) | 🟢 Real (DB) | `admin/logistics.tsx`. |
| Partnerships, geographic stats, F&B inventory | 🟢 Real (DB) | Read/write via `admin-data.server.ts`. |
| Blog / Updates (admin + public) | 🟢 Real (DB) | `content_pages` table; admin CRUD, public list + detail pages. |
| Team member profiles (About page) | 🟢 Real (DB) | `team_members` table. |
| Farmer registration & login | 🟢 Real (DB) | Writes to `application_users` + `farmers`, real password hashing. |
| Authentication & session security | 🟢 Real | Custom system: hashed sessions, lockout, CSRF, audit log (§9). |
| **Public** product catalog (browse/product page) | 🟡 Demo data | `products-store.ts` — seeds fake products into the visitor's **localStorage**. Entirely disconnected from the real `products` table above. |
| Shopping cart | 🟡 Demo data | localStorage only; no checkout, no payment flow. |
| Farmer self-service dashboard (`/dashboard`) | 🟡 Mixed | Login is real; every tab's *data* (products, training, consultancy, content) is the same localStorage demo layer. |
| Public training course catalog & registration | 🟡 Demo data | Hardcoded course list; registrations write to localStorage, not the real `training_registrations` table (which already exists and is unused by this page). |
| Public consultancy booking | 🟡 Demo data | Hardcoded packages/calendar; bookings write to localStorage, not the real `consultancy_bookings` table (which already exists and is unused by this page). |
| Careers (public + admin) | 🟡 Demo data | Both the public job board and the **admin** careers page run on localStorage — the one admin surface not backed by Postgres. |
| Homepage content (services, partners, contact info) | 🟡 Demo data | `content-store.ts`, localStorage with a draft/publish toggle. A `site_content` table exists in the schema but is not read by this code. |
| Contact form | 🔴 Non-functional | Shows a fake "sent" success state after a timer; no email, no DB write, no notification of any kind. |
| Order tracking | 🔴 Non-functional | Three hardcoded fake order IDs; not connected to the real `orders`/`deliveries` tables. |
| Impact dashboard | 🔴 Non-functional | All KPIs and charts are hardcoded constants. |
| Trust/Certifications page | 🔴 Non-functional | Static badges; "become a partner" form doesn't submit anywhere. |
| Advertise page | 🔴 Non-functional | Static pricing/packages, no booking or checkout. |
| Admin: System Settings | 🔴 Non-functional | Payment gateway toggles, branding fields — nothing persists; pure UI. |
| Admin: Communication Center (SMS/email/push) | 🔴 Non-functional | "Send campaign" shows a toast; no real SMS/email provider integration. |
| WhatsApp Commerce | 🟡 Partial | Real `whatsapp_orders` table + admin viewer exist, but there is no actual WhatsApp Business API integration — orders would need to be entered manually today. |
| Payment gateways (MoMo, Airtel Money, card) | 🔴 Not integrated | No payment provider SDK/API wired up anywhere in the code. |

**Legend:** 🟢 Real and DB-backed · 🟡 Functional demo, not connected to the real database · 🔴 UI-only stub, does not persist or transmit anything.

---

## 6. Detailed Feature Inventory

### 6.1 Admin Back-Office (`/admin/*`) — Real, DB-backed

| Route | Manages |
|---|---|
| `admin/index.tsx` | KPI dashboard: farmers/buyers/products/orders/revenue, charts, recent orders. |
| `admin/users/farmers.tsx` | Farmer directory, KYC/status approval workflow. |
| `admin/users/buyers.tsx` | Buyer directory. |
| `admin/users/staff.tsx` | Staff directory, role assignment, login credential management. |
| `admin/marketplace/products.tsx` | Product CRUD, approve/reject/feature workflow — the real catalog. |
| `admin/marketplace/orders.tsx` | Order status pipeline. |
| `admin/marketplace/payments.tsx` | Payment records, revenue charts. |
| `admin/fnb.tsx` | Deacomart-branded Food & Beverage inventory (categories/products). |
| `admin/training.tsx` | Training course CRUD (separate from the public page's hardcoded list). |
| `admin/consultancy.tsx` | Consultancy request CRUD, staff assignment, invoicing status. |
| `admin/logistics.tsx` | Deliveries and vehicle fleet management. |
| `admin/partnerships.tsx` | Partner organization directory. |
| `admin/geographic.tsx` | Farmer distribution by district. |
| `admin/reports.tsx` | Revenue and impact reporting (CSV/PDF export buttons are UI-only today). |
| `admin/content.tsx` | Team member CRUD (real) + homepage content draft/publish (localStorage). |
| `admin/blog.tsx` | Full blog post CRUD — title, slug, excerpt, body (with inline image/link support), thumbnail, status, publish workflow. |
| `admin/whatsapp.tsx` | WhatsApp order queue viewer. |
| `admin/careers.tsx` | Job posting + application management (localStorage — inconsistent with the rest of admin). |
| `admin/communication.tsx` | SMS/email/push campaign composer (UI-only, no send integration). |
| `admin/settings.tsx` | Company/branding/payment settings (UI-only, does not persist). |
| `admin/image-viewer.tsx` | Static utility for browsing files in `/public/images`. |

### 6.2 Public-Facing Site

| Route | Feature |
|---|---|
| `index.tsx` (home) | Landing page, services, partners, contact info — demo content. |
| `browse.tsx` / `product.$id.tsx` | Product catalog and detail pages — demo data, add-to-cart. |
| `dashboard.tsx` | Farmer self-service dashboard — real login, demo data. |
| `training.tsx` | Course catalog and registration — demo data. |
| `consultancy.tsx` | Service packages, booking calendar and form — demo data. |
| `careers.tsx` | Job board and application form — demo data. |
| `about.tsx` | Company story + real team member list. |
| `blog/index.tsx`, `blog/$slug.tsx` | Blog listing and post detail — real, with Open Graph tags for link previews. |
| `register-farmer.tsx` | Farmer registration — real DB write. |
| `contact.tsx`, `tracking.tsx`, `impact.tsx`, `trust.tsx`, `advertise.tsx` | Static/non-functional (see §5). |

### 6.3 Authentication & Security — Real

- Custom-built auth system (no third-party auth provider): `application_users` table, bcrypt-style password hashing (Postgres `pgcrypto`), opaque session tokens (SHA-256 hashed at rest, 8-hour expiry, `__Host-` cookie in production).
- Brute-force lockout after repeated failed logins, timing-attack mitigation on login, same-origin/CSRF checks, security event audit log.
- Password reset currently uses a single shared static code (`ADMIN_PASSWORD_RESET_CODE`) rather than a per-user emailed token — a `password_reset_tokens` table exists in the schema but isn't used by the current flow (see §10).

---

## 7. Roles & Permissions (RBAC)

Ten roles exist in `application_users.role`. All nine non-farmer roles pass the general `requireAdmin()` gate used across `admin-data.server.ts`; finer-grained per-role restriction is not yet enforced beyond that (any of the nine can access any admin data function today).

| Role | Intended scope |
|---|---|
| `super_admin` | Full platform control. |
| `manager` | General management oversight. |
| `marketplace_manager` | Products, orders, payments. |
| `finance_manager` | Payments, invoicing, financial reporting. |
| `training_manager` | Training courses and registrations. |
| `consultancy_manager` | Consultancy requests and bookings. |
| `logistics_manager` | Deliveries, vehicles, fleet. |
| `content_manager` | Blog, team profiles, site content. |
| `support_officer` | Support/communication functions. |
| `farmer` | Public-facing self-service dashboard login only (not an admin role). |

---

## 8. Data Model (Neon Postgres)

| Domain | Tables |
|---|---|
| Auth & security | `application_users`, `application_sessions`, `authentication_attempts`, `password_reset_tokens`, `security_events` |
| Marketplace | `farmers`, `buyers`, `products`, `orders`, `payments` |
| Training | `training_courses`, `training_registrations` |
| Consultancy | `consultancy_requests`, `consultancy_bookings` |
| Logistics | `vehicles`, `deliveries` |
| Partnerships | `partners`, `partnership_applications` |
| Food & Beverage | `fnb_categories`, `fnb_products` |
| Channels | `whatsapp_orders` |
| Content | `content_pages` (pages/blog/news/events/testimonials), `team_members`, `site_content` (appears unused — see §10) |
| Operations | `staff`, `activity_feed` (audit/activity log), `schema_migrations` |

Full column-level detail lives in `migrations/001_initial_neon_schema.sql` through `007_blog_posts.sql`.

---

## 9. Technical Architecture

| Layer | Technology |
|---|---|
| Framework | TanStack Start (React 19) — file-based routing, SSR, Vite 8 build, Nitro runtime |
| Database | Neon (serverless Postgres), accessed via raw `pg` — no ORM |
| Auth | Hand-rolled (§6.3) — no third-party auth provider |
| Styling / UI | Tailwind CSS 4, Radix UI primitives (shadcn-style components), `lucide-react`, `recharts`, `sonner` |
| Forms | `react-hook-form` + `zod` |
| File storage | Supabase Storage (optional) — falls back to base64-in-database if not configured; used for admin-uploaded images (thumbnails, team photos, product images) |
| Hosting | Vercel |
| CI | GitHub Actions (currently: a scheduled Supabase keep-alive ping) |

**Not integrated:** payment gateways (MTN MoMo, Airtel Money, card), SMS provider, email provider, WhatsApp Business API — all referenced in the UI but not wired to a real provider.

---

## 10. Known Gaps & Risks

Ordered roughly by severity:

1. **Two disconnected product catalogs.** The real, admin-managed `products` table and the localStorage-seeded public catalog never interact. A product approved in the admin panel is invisible to real buyers; nothing a visitor "buys" on the public site reaches the `orders` table. This is the single biggest blocker to the platform functioning as an actual marketplace.
2. **No payment processing.** Despite UI for MoMo/Airtel/card, there is no real payment gateway integration anywhere — no order can currently be paid for online.
3. **Contact form sends nothing.** Visitors who submit it believe their message was sent; it is discarded.
4. **Admin Settings and Communication Center don't function.** Settings never persist; SMS/email/push campaigns are not sent anywhere.
5. **Training and consultancy bookings don't reach the real tables** (`training_registrations`, `consultancy_bookings` already exist in the schema and are simply unused by the current public pages).
6. **`admin/careers.tsx` is the one admin surface on localStorage**, inconsistent with the rest of the (real) admin panel.
7. **Order tracking is fully mocked** (three hardcoded order IDs), disconnected from `orders`/`deliveries`.
8. **`site_content` DB table appears unused** — homepage content is actually managed via a parallel localStorage system (`content-store.ts`). Likely dead schema or an unfinished migration.
9. **Password reset is a shared static code**, not a per-user emailed token, despite a `password_reset_tokens` table existing for that purpose.
10. **Migration 006 seeds a hardcoded farmer password** (`Password12345!`) directly in a committed SQL file — a credential hygiene issue worth remediating (rotate and remove from history if this ever ran against a real environment with real users).
11. **Image hosting depends on Supabase Storage being configured**; if the environment variables are ever unset again, uploads silently fall back to storing images as base64 text in Postgres (functional but not ideal — bloats the DB and breaks social link previews, as encountered and fixed for the blog feature).
12. **No automated test suite was found** in this codebase pass — verification currently relies on manual/agent-driven browser testing.

## 11. Roadmap — Recommended Next Steps

**P0 — required before the site can function as a real marketplace**
- Retire `products-store.ts` (localStorage) and point `browse.tsx`/`product.$id.tsx`/`dashboard.tsx` at the real `products`/`orders` tables via server functions, mirroring the pattern already used by `admin/marketplace/products.tsx`.
- Integrate a real payment gateway (MTN MoMo and/or Airtel Money are the natural first choices for the Rwandan market) and wire it to the real `orders`/`payments` tables.
- Wire the contact form to actually deliver (email send, or at minimum a DB-backed support ticket/inbox).

**P1 — close the loop on existing back-office investment**
- Point the public training and consultancy pages at the real `training_registrations`/`consultancy_bookings` tables (schema already supports this).
- Migrate `admin/careers.tsx` to Postgres for consistency with the rest of admin.
- Replace mocked order tracking with a real lookup against `orders`/`deliveries`.
- Persist `admin/settings.tsx`; implement real send integration for `admin/communication.tsx` (SMS/email provider).
- Decide the fate of `site_content` (retire the table, or migrate `content-store.ts` onto it) to remove the duplication.

**P2 — hardening and platform maturity**
- Move password reset to a real per-user emailed token flow using the existing `password_reset_tokens` table.
- Introduce automated tests (unit + at least smoke-level integration for the admin CRUD flows and public purchase flow once real).
- Implement the CSV/PDF export buttons in `admin/reports.tsx`.
- WhatsApp Business API integration for `whatsapp_orders` (currently a manual-entry table).
- Longer-term, per original platform vision: multi-campus/branding support, subscription plans, richer analytics/AI features, accreditation/certification workflows.

## 12. Success Metrics (once P0 is complete)

| Metric | What it measures |
|---|---|
| GMV (Gross Merchandise Value) | Total value of orders transacted through the platform. |
| Active farmers / buyers | Registered and transacting users, by district. |
| Order fulfillment rate | % of orders delivered successfully and on time. |
| Post-harvest loss reduction | Self-reported/derived reduction among trained farmers. |
| Training completion rate | % of registered farmers completing a course. |
| Consultancy conversion rate | % of consultancy requests resulting in a closed engagement. |
| Payment success rate | % of initiated payments completed successfully. |
| Support response time | Time to first response/resolution once a real ticketing flow exists. |

---

## Appendix: Reference

- Original business requirements: `knowledge.md` (project vision document).
- Database migrations: `migrations/001_initial_neon_schema.sql` – `007_blog_posts.sql`.
- Server-side data layer: `src/lib/admin-data.server.ts` (real), `src/lib/*-store.ts` (localStorage demo layers — `products-store.ts`, `careers-store.ts`, `cart-store.ts`, `content-store.ts`).
- Auth implementation: `src/lib/auth.server.ts`.
