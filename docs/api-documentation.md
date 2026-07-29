# API Documentation

Base URL: `/api/v1/`
Auth: JWT bearer tokens (`Authorization: Bearer <access_token>`), issued by
`POST /api/v1/auth/login/`.

Every response follows the standard envelope (spec section 16):
```json
{ "status": "success", "message": "...", "data": { ... } }
```

## Auth — `/auth/`
| Method | Path | Access | Notes |
|---|---|---|---|
| POST | `/auth/register/` | Public | Creates a `visitor` (customer/tourist) account |
| POST | `/auth/login/` | Public | Returns `access` + `refresh`, role embedded in the JWT |
| POST | `/auth/login/refresh/` | Public | Refreshes the access token |
| GET/PATCH | `/auth/me/` | Authenticated | Current user's profile |
| GET | `/auth/users/` | Admin | User directory (search, filter by role) |

## Seller Applications — `/seller-applications/`
| Method | Path | Access |
|---|---|---|
| POST | `/seller-applications/` | Public — submit an application |
| GET | `/seller-applications/` | Authenticated (own applications) / Admin (all) |
| POST | `/seller-applications/{id}/review/` | Admin — `{"action": "approve"｜"reject"}` |

Approving auto-creates a `sellers.VerifiedSeller` and flips
`user.is_verified_seller`.

## Marketplace — `/marketplace/`
- `GET/POST /marketplace/categories/`, `GET/PATCH/DELETE /marketplace/categories/{slug}/` (write = admin)
- `GET/POST /marketplace/products/`, `GET/PATCH/DELETE /marketplace/products/{slug}/` (write = admin)
- `POST /marketplace/products/{slug}/review/` — authenticated users rate/review a product

Supports `?search=`, `?category=`, `?community=`, ordering via `?ordering=price,-average_rating`.

## Tourism — `/tourism/`
`GET/POST /tourism/`, `GET/PATCH/DELETE /tourism/{slug}/` (write = admin).

## Bookings — `/bookings/`
`GET/POST/PATCH /bookings/` — authenticated; customers see only their own
bookings, admins see all. `total_price` is computed server-side from the
destination price × headcount.

## Orders — `/orders/`
`GET/POST /orders/` — authenticated; accepts nested `items: [{product, quantity, unit_price}]`.

## Conservation — `/conservation/`
`GET/POST /conservation/`, `GET/PATCH/DELETE /conservation/{slug}/` (write = admin).

## Communities — `/communities/`
`GET/POST /communities/`, `GET/PATCH/DELETE /communities/{slug}/` (write = admin).

## Notifications — `/notifications/`
`GET /notifications/` — scoped to the current user (or broadcast).
`POST /notifications/{id}/mark_read/`.

## Reports — `/reports/`
`GET/POST /reports/` (admin). `POST /reports/generate/` —
`{"report_type": "monthly", "period_start": "YYYY-MM-DD", "period_end": "YYYY-MM-DD"}`
computes live order/booking totals into a stored `Report`.

## Analytics — `/analytics/`
- `GET /analytics/dashboard/` (admin) — powers the admin dashboard stat
  cards + charts.
- `GET /analytics/top-products/` (authenticated).

## Audit Logs — `/audit-logs/`
`GET /audit-logs/` (admin, read-only) — every administrative action, filterable
by `?action=` and `?actor=`.

## Errors
Non-2xx responses use the same envelope with `"status": "error"` and a
`message`; validation errors are surfaced under `data`.
