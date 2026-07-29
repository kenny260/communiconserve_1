export interface Community {
  id: string;
  name: string;
  slug: string;
  district: string;
  cover_image: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  category_name: string;
  seller_name: string;
  community_name: string;
  price: string;
  average_rating: string;
  ratings_count: number;
  primary_image: string | null;
  is_available: boolean;
}

export interface TourismDestinationListItem {
  id: string;
  name: string;
  slug: string;
  community_name: string;
  location: string;
  price_per_person: string;
  cover_image: string | null;
}

export interface ConservationProjectListItem {
  id: string;
  title: string;
  slug: string;
  community_name: string;
  category: "restoration" | "campaign" | "community";
  status: "planned" | "in_progress" | "completed";
  cover_image: string | null;
}

export interface DashboardAnalytics {
  totals: {
    users: number;
    verified_sellers: number;
    products: number;
    bookings: number;
    orders: number;
    revenue: string;
    conservation_projects: number;
    communities: number;
  };
  recent_30_days: {
    new_users: number;
    new_orders: number;
    new_bookings: number;
  };
  top_communities: { name: string }[];
}
