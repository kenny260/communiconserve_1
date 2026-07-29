# Database Documentation

PostgreSQL, managed through Django ORM migrations (`backend/*/migrations/`).
`database/schema.sql` and `database/seed.sql` are human-readable references —
the migrations are the source of truth.

## Core tables

| Table (app.Model) | Purpose | Key relationships |
|---|---|---|
| accounts.User | Custom user with `role` (visitor / ngo_coordinator / conservation_officer) | FK → communities.Community |
| communities.Community | Community profile | — |
| communities.CommunityImage | Gallery images | FK → Community |
| seller_applications.SellerApplication | "Become a Seller" workflow | FK → Community, FK → User (applicant, reviewed_by) |
| sellers.VerifiedSeller | Approved seller profile | O2O → SellerApplication, FK → Community, FK → User |
| marketplace.Category | Product categories | — |
| marketplace.Product | Marketplace listings | FK → Category, VerifiedSeller, Community |
| marketplace.ProductImage | Product gallery | FK → Product |
| marketplace.ProductReview | Star ratings + comments | FK → Product, User (unique together) |
| tourism.TourismDestination | Eco-tourism destinations | FK → Community |
| tourism.DestinationImage | Destination gallery | FK → TourismDestination |
| bookings.Booking | Tour bookings | FK → TourismDestination, User |
| orders.Order / orders.OrderItem | Marketplace orders | FK → User, Product |
| conservation.ConservationProject | Conservation projects/campaigns | FK → Community, User (created_by) |
| conservation.ProjectGallery / ProjectUpdate | Project media + progress log | FK → ConservationProject |
| notifications.Notification | In-app notifications | FK → User (nullable = broadcast) |
| reports.Report | Generated monthly/annual reports | FK → User (generated_by) |
| core.AuditLog | Every administrative action | FK → User (actor) |

## Conventions
- All domain models inherit `core.models.TimeStampedModel`: UUID primary key,
  `created_at`, `updated_at`.
- Foreign keys use `PROTECT` where deleting the parent would orphan business
  records (e.g. a Community with published Products), and `CASCADE` for
  strictly-owned child records (images, gallery items, order items).
- Money fields are `DecimalField(max_digits=10, decimal_places=2)` — never
  floats.
- Status fields are `TextChoices` enums, not free text, to keep filtering and
  the admin dashboard reliable.

## Regenerating schema.sql
```bash
pg_dump --schema-only communiconserve > database/schema.sql
pg_dump --data-only --inserts communiconserve > database/seed.sql
```
