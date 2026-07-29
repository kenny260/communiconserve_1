import random
from datetime import date, timedelta
from decimal import Decimal
from urllib.parse import quote

import requests
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
from django.utils.text import slugify

from bookings.models import Booking
from communities.models import Community, CommunityImage
from conservation.models import ConservationProject, ProjectGallery, ProjectUpdate
from core.audit import log_action
from marketplace.models import Category, Product, ProductImage
from notifications.models import Notification
from orders.models import Order, OrderItem
from seller_applications.models import SellerApplication
from sellers.models import VerifiedSeller
from tourism.models import DestinationImage, TourismDestination

User = get_user_model()

DISTRICTS = ["Lubombo", "Hhohho", "Manzini", "Shiselweni"]

PRODUCT_IMAGE_KEYWORDS = {
    "Organic Honey": "honey,beekeeping",
    "Fresh Vegetables": "vegetables,farm",
    "Traditional Crafts": "african craft,handmade",
    "Basket Weaving": "woven basket",
    "Wood Carvings": "wood carving,sculpture",
    "Beadwork": "beads,jewelry",
    "Leather Products": "leather craft",
    "Handmade Jewelry": "handmade jewelry",
    "Organic Fruits": "fresh fruit,market",
    "Herbal Products": "herbal tea,dried herbs",
}
DESTINATION_KEYWORD_FALLBACK = "african savanna,wildlife"
CONSERVATION_KEYWORDS = {
    "restoration": "reforestation,nature restoration",
    "campaign": "environmental cleanup,volunteers",
    "community": "african community,volunteers",
}
COMMUNITY_KEYWORD = "african village,rural community"


def _fetch_image(stdout, keyword: str, width: int = 800, height: int = 600):
    """Downloads a topical stock photo from LoremFlickr (no API key required).
    Returns a Django ContentFile, or None if the request fails for any reason
    — image seeding is best-effort and should never abort the rest of the seed.
    """
    url = f"https://loremflickr.com/{width}/{height}/{quote(keyword)}"
    try:
        response = requests.get(url, timeout=8)
        response.raise_for_status()
        return ContentFile(response.content, name=f"{slugify(keyword)}-{random.randint(1000,9999)}.jpg")
    except Exception as exc:  # noqa: BLE001 — deliberately broad, this is best-effort
        stdout.write(f"  (image fetch skipped for '{keyword}': {exc})")
        return None

COMMUNITY_NAMES = [
    "Shewula", "Mlawula", "Hlane", "Mhlumeni", "Lomahasha", "Big Bend",
    "Siphofaneni", "Mahamba", "Nsoko", "Sithobela", "Lavumisa", "Tikhuba",
    "Mpaka", "Simunye", "Ka-Langa",
]

PRODUCT_TEMPLATES = [
    ("Organic Honey", "Raw Organic Honey {size}", ["250ml", "500ml", "1kg"]),
    ("Fresh Vegetables", "Seasonal Vegetable Basket {size}", ["Small", "Medium", "Large"]),
    ("Traditional Crafts", "Traditional Grass Mat {size}", ["Small", "Medium", "Large"]),
    ("Basket Weaving", "Handwoven Basket ({size})", ["Small", "Medium", "Large"]),
    ("Wood Carvings", "Carved Wooden {item}", ["Bowl", "Statue", "Spoon Set"]),
    ("Beadwork", "Beaded Necklace ({style})", ["Zulu", "Swazi", "Modern"]),
    ("Leather Products", "Leather {item}", ["Belt", "Sandals", "Bag"]),
    ("Handmade Jewelry", "Handmade {item}", ["Bracelet", "Earrings", "Ring Set"]),
    ("Organic Fruits", "Fresh {fruit}", ["Macadamia Nuts 1kg", "Mango Basket", "Avocado Pack"]),
    ("Herbal Products", "Herbal Tea Blend {size}", ["100g", "200g", "500g"]),
]

DESTINATION_NAMES = [
    "Mlawula Nature Reserve", "Malolotja Nature Reserve", "Mlilwane Wildlife Sanctuary",
    "Hlane Royal National Park", "Shewula Mountain Camp", "Nisela Safaris",
    "Mantenga Nature Reserve", "Phophonyane Falls", "Sibebe Rock", "Ngwenya Mine",
    "Mkhaya Game Reserve", "Simunye Country Club Trails", "Lubombo Conservancy Walk",
    "Siteki Cultural Village", "Lomahasha Border Market Tour", "Big Bend River Trail",
    "Tikhuba Community Craft Tour", "Mpaka Birdwatching Trail", "Sand River Dam",
    "Lavumisa Escarpment Hike", "Nsoko Wetlands Walk",
]

CONSERVATION_TITLES = [
    "Riverbank Restoration Project", "Indigenous Tree Planting", "Plastic Cleanup Campaign",
    "Wetland Protection Initiative", "Anti-Poaching Community Patrol", "Rhino Conservation Awareness",
    "Beehive Fencing for Elephant Corridors", "Community Nursery Programme", "Grassland Rehabilitation",
    "Clean Water Access Project", "Wildfire Prevention Training", "Vulture Safe Zone Campaign",
    "Solar Energy for Rangers", "Youth Conservation Ambassadors", "Alien Plant Removal Drive",
    "Soil Erosion Control", "Community Composting Programme", "Butterfly Habitat Restoration",
    "Sustainable Grazing Initiative", "River Health Monitoring", "Eco-Brick Building Project",
    "Medicinal Plant Garden", "Bird Nesting Box Programme", "Fireguard Maintenance Drive",
    "Wetland Bird Count", "Recycling Hub Launch", "Conservation Storytelling Archive",
    "School Environmental Clubs", "Honey Badger Monitoring", "Corridor Fence Repair",
]

FIRST_NAMES = [
    "Thandi", "Sipho", "Beauty", "Bongani", "Nomvula", "Nomsa", "Sanele", "Zanele",
    "Mduduzi", "Nokuthula", "Sibusiso", "Lindiwe", "Musa", "Phumzile", "Themba", "Precious",
]
LAST_NAMES = [
    "Dlamini", "Nxumalo", "Mabuza", "Zulu", "Dube", "Simelane", "Maseko", "Shongwe",
    "Nkambule", "Mamba", "Fakudze", "Gamedze",
]


def rand_name():
    return random.choice(FIRST_NAMES), random.choice(LAST_NAMES)


class Command(BaseCommand):
    help = "Populates the database with realistic demo data (spec section 19)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--skip-images", action="store_true",
            help="Skip downloading stock photos (faster, no network required).",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        random.seed(42)
        with_images = not options["skip_images"]

        admins = self._seed_admins()
        communities = self._seed_communities(with_images)
        categories = self._seed_categories()
        customers, tourists = self._seed_public_users(communities)
        sellers = self._seed_sellers(communities, admins)
        products = self._seed_products(sellers, categories, with_images)
        destinations = self._seed_destinations(communities, with_images)
        projects = self._seed_conservation(communities, admins, with_images)
        self._seed_bookings(destinations, customers + tourists)
        self._seed_orders(products, customers + tourists)
        self._seed_notifications(admins, customers + tourists)
        self._seed_audit_logs(admins)

        self.stdout.write(self.style.SUCCESS(
            f"Seeded {len(communities)} communities, {len(sellers)} sellers, "
            f"{len(products)} products, {len(destinations)} destinations, "
            f"{len(projects)} conservation projects, and supporting bookings/orders/"
            f"notifications/audit logs."
        ))

    # -- Users -----------------------------------------------------------

    def _seed_admins(self):
        admins = []
        for i in range(1, 3):
            u, _ = User.objects.get_or_create(
                username=f"ngo_coordinator_{i}",
                defaults=dict(
                    email=f"ngo.coordinator{i}@communiconserve.org",
                    role=User.Role.NGO_COORDINATOR,
                    first_name="NGO", last_name=f"Coordinator {i}",
                    is_staff=True,
                ),
            )
            u.set_password("Password123!")
            u.save()
            admins.append(u)
        for i in range(1, 3):
            u, _ = User.objects.get_or_create(
                username=f"conservation_officer_{i}",
                defaults=dict(
                    email=f"conservation.officer{i}@communiconserve.org",
                    role=User.Role.CONSERVATION_OFFICER,
                    first_name="Conservation", last_name=f"Officer {i}",
                    is_staff=True,
                ),
            )
            u.set_password("Password123!")
            u.save()
            admins.append(u)
        return admins

    def _seed_public_users(self, communities):
        customers, tourists = [], []
        for i in range(1, 11):
            fn, ln = rand_name()
            u, _ = User.objects.get_or_create(
                username=f"customer_{i}",
                defaults=dict(
                    email=f"customer{i}@example.com", first_name=fn, last_name=ln,
                    community=random.choice(communities),
                ),
            )
            u.set_password("Password123!")
            u.save()
            customers.append(u)
        for i in range(1, 11):
            fn, ln = rand_name()
            u, _ = User.objects.get_or_create(
                username=f"tourist_{i}",
                defaults=dict(email=f"tourist{i}@example.com", first_name=fn, last_name=ln),
            )
            u.set_password("Password123!")
            u.save()
            tourists.append(u)
        return customers, tourists

    # -- Core content ------------------------------------------------------

    def _seed_communities(self, with_images=True):
        communities = []
        for name in COMMUNITY_NAMES:
            c, created = Community.objects.get_or_create(
                slug=slugify(name),
                defaults=dict(
                    name=name,
                    district=random.choice(DISTRICTS),
                    overview=f"{name} is a community in the Lubombo Corridor working on conservation, "
                             f"local commerce, and eco-tourism initiatives.",
                    conservation_initiatives="Reforestation, anti-poaching patrols, and wetland protection.",
                    contact_email=f"{slugify(name)}@communiconserve.org",
                    contact_phone=f"+268 76{random.randint(100000,999999)}",
                ),
            )
            if with_images and (created or not c.cover_image):
                image = _fetch_image(self.stdout, COMMUNITY_KEYWORD)
                if image:
                    c.cover_image.save(image.name, image, save=True)
                    gallery_image = _fetch_image(self.stdout, COMMUNITY_KEYWORD)
                    if gallery_image:
                        CommunityImage.objects.create(community=c, image=gallery_image, caption=f"{name} community life")
            communities.append(c)
        return communities

    def _seed_categories(self):
        categories = []
        for name, *_ in PRODUCT_TEMPLATES:
            c, _ = Category.objects.get_or_create(name=name, defaults=dict(slug=slugify(name)))
            categories.append(c)
        return categories

    def _seed_sellers(self, communities, admins):
        sellers = []
        for i in range(1, 21):
            fn, ln = rand_name()
            community = random.choice(communities)
            application = SellerApplication.objects.create(
                full_name=f"{fn} {ln}",
                organization_name=f"{ln} {random.choice(['Crafts','Farm','Cooperative','Producers'])}",
                community=community,
                district=community.district,
                phone_number=f"+268 76{random.randint(100000,999999)}",
                email=f"seller{i}@example.com",
                business_type=random.choice(["Cooperative", "Sole Trader", "Family Business"]),
                products_to_sell="Assorted local produce and crafts",
                business_description=f"{ln} {random.choice(['Crafts','Farm','Cooperative'])} produces "
                                      f"locally-made goods from {community.name}.",
                status=SellerApplication.Status.APPROVED,
                reviewed_by=random.choice(admins),
                reviewed_at=timezone.now(),
            )
            seller, _ = VerifiedSeller.objects.get_or_create(
                application=application,
                defaults=dict(
                    business_name=application.organization_name,
                    community=community,
                    district=community.district,
                    phone_number=application.phone_number,
                    email=application.email,
                    business_type=application.business_type,
                    business_description=application.business_description,
                ),
            )
            sellers.append(seller)
        return sellers

    def _seed_products(self, sellers, categories, with_images=True):
        products = []
        cat_map = {c.name: c for c in categories}
        count = 0
        attempts = 0
        while count < 65 and attempts < 500:
            attempts += 1
            cat_name, name_template, variants = random.choice(PRODUCT_TEMPLATES)
            variant = random.choice(variants)
            name = name_template.format(size=variant, item=variant, style=variant, fruit=variant)
            seller = random.choice(sellers)
            slug_base = slugify(f"{name}-{seller.business_name}-{count}")[:200]
            if Product.objects.filter(slug=slug_base).exists():
                continue
            product = Product.objects.create(
                name=name,
                slug=slug_base,
                category=cat_map[cat_name],
                description=f"{name}, lovingly produced by {seller.business_name} in "
                             f"{seller.community.name}.",
                price=Decimal(str(random.choice([4.20, 6.50, 8.00, 12.00, 15.00, 18.00, 22.50, 35.00]))),
                seller=seller,
                community=seller.community,
                stock_quantity=random.randint(5, 200),
                is_available=True,
                status=Product.Status.PUBLISHED,
                average_rating=Decimal(str(random.choice([4.2, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9]))),
                ratings_count=random.randint(10, 130),
            )
            if with_images:
                keyword = PRODUCT_IMAGE_KEYWORDS.get(cat_name, "handmade,craft")
                image = _fetch_image(self.stdout, keyword)
                if image:
                    ProductImage.objects.create(product=product, image=image, is_primary=True, alt_text=name)
            products.append(product)
            count += 1
        return products

    def _seed_destinations(self, communities, with_images=True):
        destinations = []
        for name in DESTINATION_NAMES:
            slug = slugify(name)
            d, created = TourismDestination.objects.get_or_create(
                slug=slug,
                defaults=dict(
                    name=name,
                    description=f"{name} offers a memorable eco-tourism experience in the Lubombo Corridor.",
                    community=random.choice(communities),
                    location=random.choice(["Hlane", "Lobamba", "Malkerns", "Siteki", "Big Bend", "Mbabane"]),
                    facilities="Guided tours, parking, restrooms, refreshments",
                    price_per_person=Decimal(str(random.choice([15, 20, 25, 30, 35, 40]))),
                    opening_hours="08:00 - 17:00 daily",
                    contact_info=f"+268 24{random.randint(100000,999999)}",
                    status=TourismDestination.Status.PUBLISHED,
                ),
            )
            if with_images and (created or not d.cover_image):
                keyword = DESTINATION_KEYWORD_FALLBACK
                lowered = name.lower()
                if "falls" in lowered or "dam" in lowered:
                    keyword = "waterfall,river"
                elif "rock" in lowered:
                    keyword = "rock formation,mountain"
                elif "cultural" in lowered or "village" in lowered or "craft" in lowered:
                    keyword = "african craft market"
                elif "bird" in lowered or "wetland" in lowered:
                    keyword = "birdwatching,wetland"
                image = _fetch_image(self.stdout, keyword)
                if image:
                    d.cover_image.save(image.name, image, save=True)
                    gallery_image = _fetch_image(self.stdout, keyword)
                    if gallery_image:
                        DestinationImage.objects.create(destination=d, image=gallery_image, caption=name)
            destinations.append(d)
        return destinations

    def _seed_conservation(self, communities, admins, with_images=True):
        projects = []
        for title in CONSERVATION_TITLES:
            slug = slugify(title)
            start = date.today() - timedelta(days=random.randint(30, 700))
            status = random.choice([
                ConservationProject.Status.IN_PROGRESS,
                ConservationProject.Status.IN_PROGRESS,
                ConservationProject.Status.COMPLETED,
                ConservationProject.Status.PLANNED,
            ])
            category = random.choice(ConservationProject.Category.values)
            p, created = ConservationProject.objects.get_or_create(
                slug=slug,
                defaults=dict(
                    title=title,
                    community=random.choice(communities),
                    category=category,
                    description=f"{title} is a community-driven conservation effort in the Lubombo Corridor.",
                    status=status,
                    start_date=start,
                    end_date=start + timedelta(days=180) if status == ConservationProject.Status.COMPLETED else None,
                    impact_summary=f"Engaged {random.randint(20, 400)} community members so far.",
                    created_by=random.choice(admins),
                ),
            )
            if created:
                ProjectUpdate.objects.create(
                    project=p, title="Progress update",
                    content=f"{title} continues to make progress with strong community participation.",
                )
            if with_images and (created or not p.cover_image):
                keyword = CONSERVATION_KEYWORDS.get(category, "conservation,nature")
                image = _fetch_image(self.stdout, keyword)
                if image:
                    p.cover_image.save(image.name, image, save=True)
                    gallery_image = _fetch_image(self.stdout, keyword)
                    if gallery_image:
                        ProjectGallery.objects.create(project=p, image=gallery_image, caption=title)
            projects.append(p)
        return projects

    # -- Transactional data --------------------------------------------

    def _seed_bookings(self, destinations, users):
        for _ in range(45):
            destination = random.choice(destinations)
            adults = random.randint(1, 4)
            children = random.randint(0, 2)
            Booking.objects.create(
                customer=random.choice(users),
                destination=destination,
                visit_date=date.today() + timedelta(days=random.randint(-30, 60)),
                adults=adults,
                children=children,
                total_price=destination.price_per_person * (adults + children),
                status=random.choice(list(Booking.Status.values)),
            )

    def _seed_orders(self, products, users):
        for _ in range(55):
            order = Order.objects.create(
                customer=random.choice(users),
                shipping_address=f"P.O. Box {random.randint(1,999)}, {random.choice(DISTRICTS)}, Eswatini",
                status=random.choice(list(Order.Status.values)),
            )
            for product in random.sample(products, k=min(random.randint(1, 4), len(products))):
                OrderItem.objects.create(
                    order=order, product=product,
                    quantity=random.randint(1, 3), unit_price=product.price,
                )
            order.recalculate_total()

    def _seed_notifications(self, admins, users):
        templates = [
            ("seller_application", "New seller application", "A new seller application was submitted for review."),
            ("order", "New order placed", "A new order has been placed on the marketplace."),
            ("booking", "Tour booking confirmed", "A tour booking has been confirmed."),
            ("conservation", "Conservation project updated", "A conservation project has a new progress update."),
            ("system", "Welcome to CommuniConserve", "Thanks for joining CommuniConserve."),
        ]
        for _ in range(35):
            ntype, title, message = random.choice(templates)
            recipient = None if ntype == "seller_application" else random.choice(admins + users)
            Notification.objects.create(
                recipient=recipient, type=ntype, title=title, message=message,
                is_read=random.choice([True, False]),
            )

    def _seed_audit_logs(self, admins):
        actions = [
            "approve_seller_application", "reject_seller_application", "create_product",
            "update_product", "publish_conservation_project", "create_tourism_destination",
            "update_booking_status", "generate_report", "login",
        ]
        for _ in range(160):
            log_action(random.choice(admins), random.choice(actions))
