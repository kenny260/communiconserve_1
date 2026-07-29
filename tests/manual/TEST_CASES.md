# Manual Test Cases

## Authentication
| # | Case | Steps | Expected |
|---|---|---|---|
| 1 | Register as visitor | Fill /auth/register, submit | Account created with role=visitor |
| 2 | Login redirects by role | Login as ngo_coordinator_1 | Redirected to /admin |
| 3 | Login redirects by role | Login as customer_1 | Redirected to / |
| 4 | Invalid credentials | Submit wrong password | Error message shown, no redirect |

## Become a Seller
| # | Case | Steps | Expected |
|---|---|---|---|
| 5 | Submit application | Fill and submit /become-a-seller | Confirmation screen shown, SellerApplication row created (status=pending) |
| 6 | Admin approves | Admin > Seller Applications > Approve | Status becomes approved, VerifiedSeller created, applicant's is_verified_seller=true |
| 7 | Admin rejects | Admin > Seller Applications > Reject | Status becomes rejected, no VerifiedSeller created |

## Marketplace
| # | Case | Steps | Expected |
|---|---|---|---|
| 8 | Browse products | Visit /marketplace | Published products listed with price, rating, seller |
| 9 | Search products | Type into search box | List filters to matching products |
| 10 | Filter by category | Select a category | List filters to that category only |
| 11 | View product detail | Click a product | Detail page shows description, images, reviews |
| 12 | Non-admin cannot create product | POST /marketplace/products/ as visitor | 403 Forbidden |

## Tourism & Bookings
| # | Case | Steps | Expected |
|---|---|---|---|
| 13 | Browse destinations | Visit /tourism | Published destinations listed |
| 14 | Book a destination (logged out) | Click "Book Experience" | Redirected to /auth/login |
| 15 | Book a destination (logged in) | Fill date/guests, submit | Booking created with computed total_price |

## Admin Dashboard
| # | Case | Steps | Expected |
|---|---|---|---|
| 16 | Dashboard loads stats | Login as admin, visit /admin | Stat cards + chart populated from /analytics/dashboard/ |
| 17 | Non-admin blocked | Visit /admin as customer (with valid token) | API returns 403 on admin-only endpoints |
| 18 | Generate report | Admin > Reports > pick dates > Generate | New Report row appears with computed totals |
| 19 | Audit log records action | Approve a seller application | New AuditLog row appears in Admin > Audit Logs |

## Regression checklist before release
- [ ] `pytest tests/` passes
- [ ] `python manage.py migrate` runs clean on an empty database
- [ ] `python manage.py seed_demo_data` completes without error
- [ ] `npm run build` succeeds
- [ ] All 22 frontend routes render without a client-side error
