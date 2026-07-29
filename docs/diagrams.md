# UML & Architecture Diagrams

Rendered with Mermaid — view on GitHub, in VS Code (Mermaid extension), or
at https://mermaid.live by pasting a block.

## 1. Class diagram — core domain

```mermaid
classDiagram
    class User {
      +UUID id
      +string username
      +string role
      +bool is_verified_seller
    }
    class Community {
      +UUID id
      +string name
      +string district
    }
    class SellerApplication {
      +string status
      +string business_type
    }
    class VerifiedSeller {
      +string business_name
      +bool is_active
    }
    class Product {
      +string name
      +decimal price
      +string status
    }
    class TourismDestination {
      +string name
      +decimal price_per_person
    }
    class Booking {
      +string reference
      +date visit_date
      +string status
    }
    class Order {
      +string order_number
      +decimal total_amount
    }
    class ConservationProject {
      +string title
      +string category
      +string status
    }

    User "1" -- "0..1" VerifiedSeller : becomes
    User "1" -- "*" SellerApplication : submits
    User "1" -- "*" Booking : makes
    User "1" -- "*" Order : places
    Community "1" -- "*" Product : hosts
    Community "1" -- "*" TourismDestination : hosts
    Community "1" -- "*" ConservationProject : hosts
    SellerApplication "1" -- "0..1" VerifiedSeller : approved into
    VerifiedSeller "1" -- "*" Product : sells
    TourismDestination "1" -- "*" Booking : receives
    Order "1" -- "*" Product : contains (via OrderItem)
```

## 2. Sequence — seller application → verified seller

```mermaid
sequenceDiagram
    participant V as Visitor
    participant FE as Next.js Frontend
    participant API as Django REST API
    participant DB as PostgreSQL
    participant A as Administrator

    V->>FE: Fill "Become a Seller" form
    FE->>API: POST /seller-applications/
    API->>DB: INSERT SellerApplication (status=pending)
    API-->>FE: 201 Created

    A->>FE: Open Seller Applications (admin)
    FE->>API: GET /seller-applications/?status=pending
    API-->>FE: list of pending applications

    A->>FE: Click "Approve"
    FE->>API: POST /seller-applications/{id}/review/ {action: approve}
    API->>DB: UPDATE SellerApplication SET status=approved
    API->>DB: INSERT VerifiedSeller
    API->>DB: UPDATE User SET is_verified_seller=true
    API->>DB: INSERT AuditLog
    API-->>FE: 200 OK (application + linked seller)
```

## 3. Sequence — authentication & role-based redirect

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Next.js
    participant API as Django REST API

    U->>FE: Submit login form
    FE->>API: POST /auth/login/
    API-->>FE: {access, refresh} (JWT contains role)
    FE->>API: GET /auth/me/ (Bearer access)
    API-->>FE: {role: "ngo_coordinator" | "visitor" | ...}
    alt role is administrator
        FE->>U: redirect to /admin
    else role is visitor
        FE->>U: redirect to /
    end
```

## 4. High-level architecture

```mermaid
flowchart LR
    subgraph Client
      Browser
    end
    subgraph Frontend [Next.js]
      Public[Public Website]
      Admin[Admin Dashboard]
    end
    subgraph Backend [Django REST Framework]
      Auth[Auth / JWT]
      Apps[Domain Apps]
    end
    DB[(PostgreSQL)]

    Browser --> Public
    Browser --> Admin
    Public --> Auth
    Admin --> Auth
    Public --> Apps
    Admin --> Apps
    Auth --> DB
    Apps --> DB
```
