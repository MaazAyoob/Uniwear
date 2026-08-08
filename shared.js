
// ─── CMS Website Public Visibility Filter Helper ──────────────────────────────
function getPublicProducts(products, locationFilter = null) {
  if (!Array.isArray(products)) return [];
  return products.filter(p => {
    if (!p) return false;
    const status = p.status || 'Active';
    if (status !== 'Active') return false;
    const isPub = p.isPublic !== false && p.isPublic !== 'false';
    if (!isPub) return false;
    if (locationFilter) {
      const locs = (Array.isArray(p.displayLocations) && p.displayLocations.length > 0)
        ? p.displayLocations
        : ['uniforms', 'gifting', 'featured', 'new_arrivals'];
      return locs.includes(locationFilter);
    }
    return true;
  });
}
window.getPublicProducts = getPublicProducts;
// ==========================================
// UNIWEAR SHARED JAVASCRIPT SYSTEM
// ==========================================

// Email config (moved to backend-only)

// 1. INITIALIZE LOCAL STORAGE STATE (Mock Database)
const defaultUsers = [
  {
    id: 1,
    email: "client@uniwear.co",
    password: "client123",
    role: "Customer",
    companyName: "Taj Resorts & Hotels Group",
    representative: "Sarah Andrews",
    phone: "+91 80 4912 2000",
    address: "#12, 7th Block, Jayanagar, Bengaluru - 560082",
    status: "Active",
    regDate: "2026-06-10"
  },
  {
    id: 2,
    email: "superadmin@uniwear.co",
    password: "super123",
    role: "Super Admin",
    companyName: "UNIWEAR HQ",
    representative: "Rajesh Gowda",
    phone: "+91 99000 11223",
    address: "#50, Richmond Road, Bengaluru - 560025",
    status: "Active",
    regDate: "2026-06-01"
  },
  {
    id: 3,
    email: "admin@uniwear.co",
    password: "admin123",
    role: "Admin",
    companyName: "UNIWEAR HQ",
    representative: "Anil Kumar",
    phone: "+91 99000 11224",
    address: "#50, Richmond Road, Bengaluru - 560025",
    status: "Active",
    regDate: "2026-06-01"
  },
  {
    id: 4,
    email: "sales@uniwear.co",
    password: "sales123",
    role: "Sales Executive",
    companyName: "UNIWEAR HQ",
    representative: "Priya Sharma",
    phone: "+91 99000 11225",
    address: "#50, Richmond Road, Bengaluru - 560025",
    status: "Active",
    regDate: "2026-06-01"
  },
  {
    id: 5,
    email: "production@uniwear.co",
    password: "prod123",
    role: "Production Manager",
    companyName: "UNIWEAR HQ",
    representative: "Harish Bhat",
    phone: "+91 99000 11226",
    address: "#50, Richmond Road, Bengaluru - 560025",
    status: "Active",
    regDate: "2026-06-01"
  },
  {
    id: 6,
    email: "client2@uniwear.co",
    password: "client123",
    role: "Customer",
    companyName: "Infosys Technologies Ltd",
    representative: "Vikram Malhotra",
    phone: "+91 98450 12345",
    address: "Plot 44, Electronic City Phase 1, Bengaluru - 560100",
    status: "Active",
    regDate: "2026-06-10"
  },
  {
    id: 7,
    email: "client3@uniwear.co",
    password: "client123",
    role: "Customer",
    companyName: "Wipro Limited",
    representative: "Deepa Nair",
    phone: "+91 98450 67890",
    address: "Doddakannelli, Sarjapur Road, Bengaluru - 560035",
    status: "Active",
    regDate: "2026-06-11"
  },
  {
    id: 8,
    email: "client4@uniwear.co",
    password: "client123",
    role: "Customer",
    companyName: "Tata Consultancy Services",
    representative: "Rohan Deshmukh",
    phone: "+91 98800 11223",
    address: "Whitefield Main Road, Bengaluru - 560066",
    status: "Active",
    regDate: "2026-06-12"
  },
  {
    id: 9,
    email: "client5@uniwear.co",
    password: "client123",
    role: "Customer",
    companyName: "Biocon Ltd",
    representative: "Kavitha Rao",
    phone: "+91 98800 44556",
    address: "20th KM, Hosur Road, Bengaluru - 560100",
    status: "Active",
    regDate: "2026-06-13"
  },
  {
    id: 10,
    email: "client6@uniwear.co",
    password: "client123",
    role: "Customer",
    companyName: "Dell India Pvt Ltd",
    representative: "Matthew John",
    phone: "+91 98900 77889",
    address: "Challaghatta, Inner Ring Road, Bengaluru - 560071",
    status: "Active",
    regDate: "2026-06-14"
  },
  {
    id: 11,
    email: "client7@uniwear.co",
    password: "client123",
    role: "Customer",
    companyName: "HCL Technologies Ltd",
    representative: "Neha Gupta",
    phone: "+91 99011 22334",
    address: "Jigani Industrial Area, Bengaluru - 560105",
    status: "Active",
    regDate: "2026-06-15"
  },
  {
    id: 12,
    email: "client8@uniwear.co",
    password: "client123",
    role: "Customer",
    companyName: "Cognizant Technology Solutions",
    representative: "Sanjay Patel",
    phone: "+91 99011 55667",
    address: "Manyata Tech Park, Hebbal, Bengaluru - 560045",
    status: "Active",
    regDate: "2026-06-15"
  },
  {
    id: 13,
    email: "client9@uniwear.co",
    password: "client123",
    role: "Customer",
    companyName: "Accenture Services",
    representative: "Ananya Sen",
    phone: "+91 99450 11122",
    address: "Bannerghatta Road, Bengaluru - 560076",
    status: "Active",
    regDate: "2026-06-16"
  },
  {
    id: 14,
    email: "client10@uniwear.co",
    password: "client123",
    role: "Customer",
    companyName: "L&T Infotech",
    representative: "Suresh Hegde",
    phone: "+91 99450 33344",
    address: "Mysore Road, Bengaluru - 560039",
    status: "Active",
    regDate: "2026-06-16"
  },
  {
    id: 15,
    email: "client11@uniwear.co",
    password: "client123",
    role: "Customer",
    companyName: "Royal Challengers Bengaluru Club",
    representative: "Rahul Dravid",
    phone: "+91 99800 55566",
    address: "Chinnaswamy Stadium, MG Road, Bengaluru - 560001",
    status: "Disabled",
    regDate: "2026-06-17"
  },
  {
    id: 16,
    email: "client12@uniwear.co",
    password: "client123",
    role: "Customer",
    companyName: "Elite Sports Academy",
    representative: "Smriti Mandhana",
    phone: "+91 99800 77788",
    address: "Kanteerava Indoor Stadium, Bengaluru - 560001",
    status: "Disabled",
    regDate: "2026-06-17"
  },
  {
    id: 17,
    email: "client13@uniwear.co",
    password: "client123",
    role: "Customer",
    companyName: "JW Marriott Hotel Bengaluru",
    representative: "Arjun Kapoor",
    phone: "+91 91234 56789",
    address: "24/1, Vittal Mallya Road, Bengaluru - 560001",
    status: "Pending",
    regDate: "2026-06-18"
  },
  {
    id: 18,
    email: "client14@uniwear.co",
    password: "client123",
    role: "Customer",
    companyName: "The Leela Palace Hotel",
    representative: "Kiara Advani",
    phone: "+91 91234 98765",
    address: "23, Old Airport Road, Bengaluru - 560008",
    status: "Pending",
    regDate: "2026-06-19"
  },
  {
    id: 19,
    email: "client15@uniwear.co",
    password: "client123",
    role: "Customer",
    companyName: "Ritz Carlton Bengaluru",
    representative: "Ranveer Singh",
    phone: "+91 92345 67890",
    address: "99, Residency Road, Bengaluru - 560025",
    status: "Pending",
    regDate: "2026-06-20"
  },
  {
    id: 20,
    email: "client16@uniwear.co",
    password: "client123",
    role: "Customer",
    companyName: "Sheraton Grand Gateway",
    representative: "Varun Dhawan",
    phone: "+91 92345 09876",
    address: "26/1, Brigade Gateway, Rajajinagar, Bengaluru - 560055",
    status: "Active",
    regDate: "2026-06-20"
  },
  {
    id: 21,
    email: "client17@uniwear.co",
    password: "client123",
    role: "Customer",
    companyName: "Columbia Asia Hospitals",
    representative: "Alia Bhatt",
    phone: "+91 93456 78901",
    address: "10, Stage 1, Yeshwanthpur, Bengaluru - 560022",
    status: "Active",
    regDate: "2026-06-21"
  },
  {
    id: 22,
    email: "client18@uniwear.co",
    password: "client123",
    role: "Customer",
    companyName: "Apollo Hospitals Ltd",
    representative: "Ranbir Kapoor",
    phone: "+91 93456 10987",
    address: "154/11, Bannerghatta Road, Bengaluru - 560076",
    status: "Active",
    regDate: "2026-06-21"
  },
  {
    id: 23,
    email: "client19@uniwear.co",
    password: "client123",
    role: "Customer",
    companyName: "Manipal Hospitals Group",
    representative: "Deepika Padukone",
    phone: "+91 94567 89012",
    address: "98, HAL Airport Road, Bengaluru - 560017",
    status: "Active",
    regDate: "2026-06-22"
  },
  {
    id: 24,
    email: "client20@uniwear.co",
    password: "client123",
    role: "Customer",
    companyName: "Fortis Healthcare Ltd",
    representative: "Siddharth Malhotra",
    phone: "+91 94567 21098",
    address: "154/9, Bannerghatta Road, Bengaluru - 560076",
    status: "Active",
    regDate: "2026-06-22"
  }
];

const defaultProducts = [
  {
    id: 1,
    name: "AeroGuard Boiler Suit",
    category: "Industrial",
    fabric: "65% Recycled Polyester / 35% Organic Cotton",
    gsm: "240 GSM",
    moq: 100,
    desc: "Built to withstand critical mechanical workloads. Features flame-retardant parameters, anti-static carbon filaments, triple needle reinforcements, and reflective warning strips.",
    img: "assets/images/industries/industrial-uniforms.png",
    status: "Active",
    featured: true
  },
  {
    id: 2,
    name: "TundraGuard Coldroom Suit",
    category: "Industrial",
    fabric: "Water-resistant thermal-lined Nylon Taslon",
    gsm: "380 GSM",
    moq: 50,
    desc: "Sub-zero coldroom suit engineered for refrigeration warehouses. Thermal insulated lining and double-seamed windbreakers.",
    img: "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=400&q=80",
    status: "Active",
    featured: false
  },
  {
    id: 3,
    name: "Defender Safety Equipment Set",
    category: "Industrial",
    fabric: "Heavy Duty High-Impact Polymers / Reinforced Strapping",
    gsm: "N/A",
    moq: 50,
    desc: "Includes EN-certified safety helmet, high-visibility reflective harness, and multi-point utility work belt.",
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80",
    status: "Active",
    featured: false
  },
  {
    id: 4,
    name: "ProTech Steel-Toe Safety Shoes",
    category: "Industrial",
    fabric: "Genuine Full-Grain Leather with Steel Cap",
    gsm: "N/A",
    moq: 100,
    desc: "Anti-puncture, slip-resistant safety shoes. Steel toe cap rated for high-impact protection in smelting zones.",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80",
    status: "Active",
    featured: false
  },
  {
    id: 5,
    name: "ThermoShield Bomber Safety Jacket",
    category: "Industrial",
    fabric: "Taslon Polyester Shell with Fleece Lining",
    gsm: "300 GSM",
    moq: 80,
    desc: "Wind and water-resistant industrial safety jacket. High-visibility reflective tape strips and detachable hood.",
    img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=400&q=80",
    status: "Active",
    featured: true
  },
  {
    id: 6,
    name: "Stamina Cargo Trousers",
    category: "Industrial",
    fabric: "Heavy Duty Cotton Drill",
    gsm: "280 GSM",
    moq: 100,
    desc: "Tough-duty cargo pants reinforced with Cordura knee pad slots, multi-utility tactical pouches, and reinforced belt loops.",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80",
    status: "Active",
    featured: false
  },
  {
    id: 7,
    name: "Executive Wool Blazer",
    category: "Corporate",
    fabric: "80% Merino Wool / 20% Silk Blend",
    gsm: "300 GSM",
    moq: 50,
    desc: "Bespoke corporate outerwear featuring breathable lining, hand-finished lapel edges, and custom embroidered inner branding labels.",
    img: "assets/images/industries/corporate-uniforms.png",
    status: "Active",
    featured: true
  },
  {
    id: 8,
    name: "Oxford Cotton Corporate Shirt",
    category: "Corporate",
    fabric: "100% Egyptian Cotton Giza 85",
    gsm: "140 GSM",
    moq: 100,
    desc: "Wrinkle-resistant corporate shirt. Easy-iron finish, tailored cuffs, and double yoke stitch support.",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80",
    status: "Active",
    featured: false
  },
  {
    id: 9,
    name: "Slick Dry Crewneck T-Shirt",
    category: "Corporate",
    fabric: "100% Organic Cotton",
    gsm: "150 GSM",
    moq: 200,
    desc: "Lightweight and highly breathable active corporate tee. Optimized for employee wellness days and out-of-office branding.",
    img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80",
    status: "Active",
    featured: true
  },
  {
    id: 10,
    name: "AeroDry Medical Scrubs",
    category: "Hospitality",
    fabric: "90% Polyester / 10% Spandex",
    gsm: "170 GSM",
    moq: 100,
    desc: "Antimicrobial, quick-dry surgical scrubs. Engineered to support high-intensity hospital shifts with ergonomic flex parameters.",
    img: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80",
    status: "Active",
    featured: false
  },
  {
    id: 11,
    name: "Taj Premium Hotel Uniform",
    category: "Hospitality",
    fabric: "Crepe Wool Crease-Resistant Blend",
    gsm: "260 GSM",
    moq: 50,
    desc: "Sophisticated styling for luxury hotel front desks. Tailored slim fit design and customizable brass button trims.",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80",
    status: "Active",
    featured: true
  },
  {
    id: 12,
    name: "Imperial Chef Uniform",
    category: "Hospitality",
    fabric: "Combed Long-Staple Cotton Blend",
    gsm: "220 GSM",
    moq: 50,
    desc: "Designed for premium kitchen suites. Hidden press stud fasteners, thermoregulator mesh panels, and dual sleeve pen pockets.",
    img: "assets/images/industries/hospitality-uniforms.png",
    status: "Active",
    featured: false
  },
  {
    id: 13,
    name: "Elite Front Desk Blazer",
    category: "Hospitality",
    fabric: "Crepe Wool Crease-Resistant Blend",
    gsm: "260 GSM",
    moq: 50,
    desc: "Sophisticated styling for luxury reception desks. Slim fit design, custom brass details, and deep pocket compartments.",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80",
    status: "Active",
    featured: true
  },
  {
    id: 14,
    name: "Academy Classic Blazer",
    category: "Institutional",
    fabric: "Premium Wool Flannel Blend",
    gsm: "290 GSM",
    moq: 200,
    desc: "High-grade school uniforms. Built to survive rigorous playground routines. Includes anti-pilling guarantees and customizable logo badges.",
    img: "assets/images/industries/institutional-uniforms.png",
    status: "Active",
    featured: false
  },
  {
    id: 15,
    name: "School Shirt & Trouser Set",
    category: "Institutional",
    fabric: "65% Polyester / 35% Cotton Blend",
    gsm: "160 GSM",
    moq: 200,
    desc: "Classic school uniform set featuring a wrinkle-free dress shirt and durable cotton-blend trousers.",
    img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80",
    status: "Active",
    featured: false
  },
  {
    id: 16,
    name: "Varsity Fleece Hoodie",
    category: "Institutional",
    fabric: "80% Combed Cotton / 20% Polyester Fleece",
    gsm: "320 GSM",
    moq: 150,
    desc: "Heavyweight collegiate pullover hoodie. Pre-shrunk fabric, double layer hood, and customized university chest felt embroidery.",
    img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=400&q=80",
    status: "Active",
    featured: false
  },
  {
    id: 17,
    name: "Luxe Leather Portfolio Set",
    category: "Corporate Gifting",
    fabric: "Full-Grain Italian Leather",
    gsm: "N/A",
    moq: 50,
    desc: "Sophisticated corporate gift presentation box. Includes leather planner binder, copper roller pen, and aluminum power bank shell.",
    img: "assets/images/industries/corporate-gifting.png",
    status: "Active",
    featured: true
  },
  {
    id: 18,
    name: "Branded Executive T-Shirt",
    category: "Corporate Gifting",
    fabric: "100% Combed Cotton",
    gsm: "180 GSM",
    moq: 100,
    desc: "Premium corporate polo t-shirt with embroidered front brand logo.",
    img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80",
    status: "Active",
    featured: true
  },
  {
    id: 19,
    name: "Custom Embroidered Cap",
    category: "Corporate Gifting",
    fabric: "100% Cotton Twill",
    gsm: "N/A",
    moq: 150,
    desc: "Classic six-panel structured cap with custom embroidery placement on front and side panels.",
    img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=400&q=80",
    status: "Active",
    featured: false
  },
  {
    id: 20,
    name: "Onboarding Starter Welcome Kit",
    category: "Corporate Gifting",
    fabric: "Eco-Friendly Material Blend",
    gsm: "N/A",
    moq: 30,
    desc: "Includes premium steel drinkware bottle, notebook planner, metal ballpoint pen, and corporate apparel tee in a matte gift box.",
    img: "assets/images/industries/corporate-gifting.png",
    status: "Active",
    featured: true
  },
  {
    id: 21,
    name: "Executive Tech Backpack",
    category: "Corporate Gifting",
    fabric: "Water-Resistant Ballistic Nylon",
    gsm: "N/A",
    moq: 50,
    desc: "Ergonomic laptop backpack with USB charging port, RFID security pocket, and custom company logo patch.",
    img: "assets/images/industries/corporate-gifting.png",
    status: "Active",
    featured: true
  },
  {
    id: 22,
    name: "Insulated Stainless Steel Bottle",
    category: "Corporate Gifting",
    fabric: "Food-Grade 304 Stainless Steel",
    gsm: "750ml",
    moq: 100,
    desc: "Double-wall vacuum insulated thermal flask. Keeps beverages hot for 12h / cold for 24h. Custom laser engraved logo.",
    img: "assets/images/industries/corporate-gifting.png",
    status: "Active",
    featured: true
  },
  {
    id: 23,
    name: "Matte Ceramic Coffee Mug",
    category: "Corporate Gifting",
    fabric: "Premium Glazed Stoneware",
    gsm: "350ml",
    moq: 100,
    desc: "Sleek matte finish desk mug with cork base and spill-proof lid. Microwave safe with high-durability print.",
    img: "assets/images/industries/corporate-gifting.png",
    status: "Active",
    featured: false
  },
  {
    id: 24,
    name: "Softshell Corporate Windbreaker Jacket",
    category: "Corporate Gifting",
    fabric: "Fleece-Lined Weatherproof Shell",
    gsm: "280 GSM",
    moq: 50,
    desc: "Premium executive outdoor jacket with customized chest logo embroidery and weather-sealed zippers.",
    img: "assets/images/industries/corporate-gifting.png",
    status: "Active",
    featured: true
  },
  {
    id: 25,
    name: "Wireless Power Bank 10,000mAh",
    category: "Corporate Gifting",
    fabric: "Anodized Aluminum Casing",
    gsm: "N/A",
    moq: 50,
    desc: "Fast-charging mag-safe wireless power bank with LED battery display and customized laser branding.",
    img: "assets/images/industries/corporate-gifting.png",
    status: "Active",
    featured: true
  },
  {
    id: 26,
    name: "Prestige Executive Crystal Award",
    category: "Corporate Gifting",
    fabric: "K9 Optical Crystal & Hardwood Base",
    gsm: "N/A",
    moq: 10,
    desc: "Handcrafted crystal trophy for annual employee excellence awards and executive recognition ceremonies.",
    img: "assets/images/industries/corporate-gifting.png",
    status: "Active",
    featured: true
  }
];

const defaultBlogs = [
  {
    id: 1,
    title: "The Evolution of Uniforms: A Historical Perspective",
    slug: "the-evolution-of-uniforms",
    category: "Heritage",
    author: "K. R. Murthy",
    date: "September 19, 2024",
    excerpt: "Tracing how uniforms evolved from medieval guild liveries to modern brand identities, reflecting changes in society and workplace dynamics.",
    img: "https://uniwear.co/api/assets/images/full/high_res/250177fa-e729-4d5f-87a7-0e84a6808f5c-Picture-1.webp",
    featuredImage: "https://uniwear.co/api/assets/images/full/high_res/250177fa-e729-4d5f-87a7-0e84a6808f5c-Picture-1.webp",
    featured: true,
    status: "Published",
    readingTime: "6 min read",
    content: "Uniforms have always been more than just clothing. Throughout history, they have served as vital symbols of identity, authority, unity, and functionality. Tracing their evolution reveals a fascinating journey from the rigid structures of medieval guilds to the dynamic brand statements of today's corporate landscape.\n\nIn the medieval era, liveries and guild uniforms were the earliest precursors to modern workwear. They were used to identify members of specific trades and alliances, denoting craftsmanship and quality standards. Over time, as industrialization swept the globe, uniforms took on a more utilitarian role. Factory workers required durable, protective clothing, giving rise to heavy denim, canvas, and reinforced stitching.\n\nToday, uniforms are an essential pillar of brand strategy. They convey professionalism, foster team spirit, and ensure safety in high-risk environments. At UNIWEAR, we blend historic craftsmanship with state-of-the-art textile technology, ensuring that every garment we create is a testament to quality and design innovation."
  },
  {
    id: 2,
    title: "Eco-Friendly Corporate Gifting: Redefining the Way We Gift",
    slug: "eco-friendly-corporate-gifting",
    category: "Sustainability",
    author: "Dr. Anjali Sen",
    date: "September 19, 2024",
    excerpt: "Discover how sustainable materials, zero-waste packaging, and organic goods are transforming the corporate gifting landscape.",
    img: "https://uniwear.co/api/assets/images/full/high_res/29d8c009-d649-4258-936e-77e4ded99a29-UW-Blog-Cover.webp",
    featuredImage: "https://uniwear.co/api/assets/images/full/high_res/29d8c009-d649-4258-936e-77e4ded99a29-UW-Blog-Cover.webp",
    featured: false,
    status: "Published",
    readingTime: "4 min read",
    content: "Corporate gifting has entered a new era. What was once a routine exchange of generic branded items has evolved into an opportunity to showcase values, build strong connections, and demonstrate ecological responsibility. Modern organizations are increasingly turning to sustainable, eco-friendly gifts to represent their brand.\n\nSustainable corporate gifting is not just about choosing organic materials; it is a holistic approach that covers product lifecycle, zero-waste packaging, and supporting local communities. From biodegradable tech accessories to organic cotton apparel, the options for high-quality, eco-conscious gifts are expanding rapidly.\n\nBy prioritizing sustainability in corporate gifts, businesses send a clear message: they care about their legacy, their employees, and the environment. This shift not only builds brand loyalty but also fosters a culture of mindfulness and care within the corporate ecosystem."
  },
  {
    id: 3,
    title: "How Corporate Gifting Enhances Employee Engagement and Brand Loyalty",
    slug: "corporate-gifting-employee-engagement",
    category: "Branding",
    author: "Rhea Murthy",
    date: "September 19, 2024",
    excerpt: "An in-depth analysis of how thoughtful executive gifts boost morale, reinforce company culture, and elevate brand recall.",
    img: "https://uniwear.co/api/assets/images/full/high_res/b4d25e52-9ad3-4230-8194-02bde89bf740-UW-Blog-Cover-2.webp",
    featuredImage: "https://uniwear.co/api/assets/images/full/high_res/b4d25e52-9ad3-4230-8194-02bde89bf740-UW-Blog-Cover-2.webp",
    featured: false,
    status: "Published",
    readingTime: "5 min read",
    content: "In today's highly competitive business landscape, attracting and retaining top talent requires more than standard benefits. Organizations are searching for meaningful ways to express appreciation and foster a deep sense of belonging. This is where thoughtful, strategic corporate gifting plays a transformative role.\n\nA well-timed, premium executive gift is a powerful tool for employee engagement. When employees receive high-quality, personalized items, they feel valued and recognized for their contributions. This recognition acts as a catalyst, boosting morale and driving alignment with organizational goals.\n\nMoreover, executive gifting extends beyond employee engagement; it is a key driver of external brand loyalty. Gifting custom, finely crafted items to key clients and partners leaves a lasting impression that reinforces business relationships and builds long-term brand equity."
  }
];

const defaultQuotations = [
  {
    id: "UW-Quote-721",
    clientEmail: "client@uniwear.co",
    productClass: "Corporate Blazer",
    volume: 1200,
    date: "2026-06-12",
    value: "₹21,60,000",
    status: "Approved",
    specs: "Bespoke executive wool blazer with inner logo printing and gold seam detailing."
  },
  {
    id: "UW-Quote-725",
    clientEmail: "client@uniwear.co",
    productClass: "Hospitality Kitchen Suit",
    volume: 500,
    date: "2026-06-18",
    value: "₹3,50,000",
    status: "Awaiting Admin Review",
    specs: "Imperial chef coat sets with thermoregulator back mesh."
  },
  {
    id: "UW-Quote-726",
    clientEmail: "client2@uniwear.co",
    productClass: "Industrial Boiler Suit",
    volume: 250,
    date: "2026-06-14",
    value: "₹7,25,000",
    status: "Approved",
    specs: "AeroGuard boiler suits for mechanical squad, reflective warning tape."
  },
  {
    id: "UW-Quote-727",
    clientEmail: "client3@uniwear.co",
    productClass: "Corporate Blazer",
    volume: 500,
    date: "2026-06-15",
    value: "₹8,50,000",
    status: "Approved",
    specs: "Executive Merino Wool blazers for senior partners."
  },
  {
    id: "UW-Quote-728",
    clientEmail: "client4@uniwear.co",
    productClass: "Corporate Blazer",
    volume: 300,
    date: "2026-06-16",
    value: "₹5,10,000",
    status: "Revised",
    specs: "Oxford Giza Cotton shirts with double yoke stitch support."
  },
  {
    id: "UW-Quote-729",
    clientEmail: "client5@uniwear.co",
    productClass: "Hospitality Kitchen Suit",
    volume: 150,
    date: "2026-06-17",
    value: "₹2,50,000",
    status: "Declined",
    specs: "Luxe waiters shirts with customized brass collar tags."
  },
  {
    id: "UW-Quote-730",
    clientEmail: "client6@uniwear.co",
    productClass: "Institutional Uniforms",
    volume: 800,
    date: "2026-06-18",
    value: "₹12,80,000",
    status: "Awaiting Admin Review",
    specs: "High-grade school blazers with custom academy crest embroidery."
  },
  {
    id: "UW-Quote-731",
    clientEmail: "client7@uniwear.co",
    productClass: "Corporate Gifting",
    volume: 100,
    date: "2026-06-10",
    value: "₹3,00,000",
    status: "Approved",
    specs: "Executive Italian leather diaries and custom copper roller pens."
  },
  {
    id: "UW-Quote-732",
    clientEmail: "client8@uniwear.co",
    productClass: "Industrial Boiler Suit",
    volume: 400,
    date: "2026-06-11",
    value: "₹11,60,000",
    status: "Awaiting Admin Review",
    specs: "Heavy duty cargo overalls with double layer knee slots."
  },
  {
    id: "UW-Quote-733",
    clientEmail: "client9@uniwear.co",
    productClass: "Corporate Blazer",
    volume: 150,
    date: "2026-06-12",
    value: "₹2,55,000",
    status: "Revised",
    specs: "Half-sleeve executive shirts in light blue weave."
  },
  {
    id: "UW-Quote-734",
    clientEmail: "client10@uniwear.co",
    productClass: "Corporate Gifting",
    volume: 200,
    date: "2026-06-13",
    value: "₹6,00,000",
    status: "Approved",
    specs: "Handcrafted full-grain leather presentation boxes."
  },
  {
    id: "UW-Quote-735",
    clientEmail: "client16@uniwear.co",
    productClass: "Corporate Blazer",
    volume: 1000,
    date: "2026-06-14",
    value: "₹17,00,000",
    status: "Approved",
    specs: "Front-desk blazers and security uniforms for tech park team."
  },
  {
    id: "UW-Quote-736",
    clientEmail: "client17@uniwear.co",
    productClass: "Hospitality Kitchen Suit",
    volume: 350,
    date: "2026-06-15",
    value: "₹5,25,000",
    status: "Awaiting Admin Review",
    specs: "Housekeeping outfits and chef aprons in deep navy weave."
  },
  {
    id: "UW-Quote-737",
    clientEmail: "client18@uniwear.co",
    productClass: "Industrial Boiler Suit",
    volume: 600,
    date: "2026-06-16",
    value: "₹18,00,000",
    status: "Revised",
    specs: "ThermoShield jackets and heavy cargo pants for assembly line."
  },
  {
    id: "UW-Quote-738",
    clientEmail: "client19@uniwear.co",
    productClass: "Institutional Uniforms",
    volume: 1200,
    date: "2026-06-17",
    value: "₹19,20,000",
    status: "Awaiting Admin Review",
    specs: "University college coordinates including pullovers."
  }
];

const defaultLeads = [
  {
    name: "Amit Sharma",
    company: "Infosys Bengaluru",
    email: "client2@uniwear.co",
    phone: "+91 98450 12345",
    category: "Corporate Uniforms",
    volume: 1500,
    details: "Need premium breathable fabrics for corporate campus security.",
    stage: "New Lead",
    date: "2026-06-10"
  },
  {
    name: "Sarah Andrews",
    company: "Taj Group Gateway",
    email: "client@uniwear.co",
    phone: "+91 80 4912 2000",
    category: "Hospitality Uniforms",
    volume: 400,
    details: "Looking to replace front-desk coordinates for our Gateway property.",
    stage: "Contacted",
    date: "2026-06-11"
  },
  {
    name: "Rajesh Patel",
    company: "Adani Group HQ",
    email: "adani.p@adani.com",
    phone: "+91 98765 00001",
    category: "Corporate Uniforms",
    volume: 2200,
    details: "Quoted ₹18,70,000 for executive coordinates.",
    stage: "Quotation Sent",
    date: "2026-06-12"
  },
  {
    name: "Sunita Reddy",
    company: "Apollo Clinics",
    email: "client18@uniwear.co",
    phone: "+91 91234 56789",
    category: "Hospitality Uniforms",
    volume: 600,
    details: "Negotiating cotton blend ratios and custom sleeves.",
    stage: "Negotiation",
    date: "2026-06-13"
  },
  {
    name: "Karan Johar",
    company: "Dharma Office",
    email: "karan.j@dharma.com",
    phone: "+91 98765 00002",
    category: "Corporate Uniforms",
    volume: 150,
    details: "SLA signed, sample in prototyping phase.",
    stage: "Won",
    date: "2026-06-14"
  },
  {
    name: "Vijay Mallya",
    company: "Kingfisher Offices",
    email: "vijay.m@kingfisher.com",
    phone: "+91 98765 00003",
    category: "Corporate Uniforms",
    volume: 800,
    details: "Budgetary constraints led to project termination.",
    stage: "Lost",
    date: "2026-06-08"
  },
  {
    name: "Vikram Seth",
    company: "DPS School Hebbal",
    email: "vikram.s@dpshebbal.edu",
    phone: "+91 99800 55566",
    category: "Institutional Uniforms",
    volume: 1800,
    details: "Inquiry about winter blazer and pullover coordinates.",
    stage: "New Lead",
    date: "2026-06-15"
  },
  {
    name: "Monica Geller",
    company: "Central Perk Cafe",
    email: "monica.g@centralperk.co",
    phone: "+91 98765 00004",
    category: "Hospitality Uniforms",
    volume: 80,
    details: "Requested samples of chef coats and aprons.",
    stage: "Contacted",
    date: "2026-06-09"
  },
  {
    name: "Chandler Bing",
    company: "Wana Corp India",
    email: "chandler.b@wanacorp.com",
    phone: "+91 98765 00005",
    category: "Corporate Uniforms",
    volume: 300,
    details: "Proposal sent for blue stripe executive shirts.",
    stage: "Quotation Sent",
    date: "2026-06-07"
  },
  {
    name: "Joey Tribbiani",
    company: "Sandwich Makers LLC",
    email: "joey.t@sandwichmakers.com",
    phone: "+91 98765 00006",
    category: "Hospitality Uniforms",
    volume: 120,
    details: "Discussing logo branding dimensions on front pocket.",
    stage: "Negotiation",
    date: "2026-06-06"
  },
  {
    name: "Rachel Green",
    company: "Ralph Lauren Retail",
    email: "rachel.g@ralphlauren.com",
    phone: "+91 98765 00007",
    category: "Corporate Gifting",
    volume: 500,
    details: "Contract finalized for leather corporate portfolios.",
    stage: "Won",
    date: "2026-06-05"
  },
  {
    name: "Ross Geller",
    company: "Bengaluru Museum of History",
    email: "ross.g@museum.org",
    phone: "+91 98765 00008",
    category: "Corporate Gifting",
    volume: 250,
    details: "Decided to go with a local handicraft supplier.",
    stage: "Lost",
    date: "2026-06-04"
  },
  {
    name: "David Goggins",
    company: "Navy Fitness Unit",
    email: "david.g@fitnessunit.com",
    phone: "+91 98765 00009",
    category: "Industrial Uniforms",
    volume: 500,
    details: "Seeking heavy-duty sweat-wicking combat shirts.",
    stage: "New Lead",
    date: "2026-06-16"
  },
  {
    name: "Elon Musk",
    company: "Tesla India Unit",
    email: "elon.m@teslaindia.com",
    phone: "+91 98765 00010",
    category: "Industrial Uniforms",
    volume: 3000,
    details: "Inquired about anti-static flame retardant boiler suits.",
    stage: "Contacted",
    date: "2026-06-17"
  },
  {
    name: "Tim Cook",
    company: "Apple Retail India",
    email: "tim.c@apple.com",
    phone: "+91 98765 00011",
    category: "Corporate Uniforms",
    volume: 1200,
    details: "Quote submitted for blue crewneck tees in organic cotton.",
    stage: "Quotation Sent",
    date: "2026-06-18"
  }
];

const defaultOrders = [
  {
    id: "UW-ORD-831",
    clientEmail: "client@uniwear.co",
    productName: "Executive Wool Blazer",
    volume: 150,
    value: "₹4,50,000",
    deliveryDate: "2026-07-20",
    statusStep: 3, // 1 to 5
    statusText: "Production stitching ongoing at JP Nagar facility"
  },
  {
    id: "UW-ORD-832",
    clientEmail: "client2@uniwear.co",
    productName: "AeroGuard Boiler Suit",
    volume: 250,
    value: "₹7,25,000",
    deliveryDate: "2026-07-25",
    statusStep: 2,
    statusText: "Branding approvals completed. Prototype passed."
  },
  {
    id: "UW-ORD-833",
    clientEmail: "client3@uniwear.co",
    productName: "Oxford Cotton Shirt",
    volume: 500,
    value: "₹8,50,000",
    deliveryDate: "2026-08-01",
    statusStep: 1,
    statusText: "Order logged, procurement of Giza cotton rolls initiated."
  },
  {
    id: "UW-ORD-834",
    clientEmail: "client4@uniwear.co",
    productName: "Imperial Chef Coat",
    volume: 100,
    value: "₹2,20,000",
    deliveryDate: "2026-07-15",
    statusStep: 4,
    statusText: "Quality checks ongoing on button fasteners."
  },
  {
    id: "UW-ORD-835",
    clientEmail: "client@uniwear.co",
    productName: "Academy Classic Blazer",
    volume: 300,
    value: "₹6,00,000",
    deliveryDate: "2026-08-10",
    statusStep: 1,
    statusText: "Order verification completed, waiting for logo specs."
  },
  {
    id: "UW-ORD-836",
    clientEmail: "client6@uniwear.co",
    productName: "Luxe Leather Portfolio Set",
    volume: 80,
    value: "₹2,40,000",
    deliveryDate: "2026-07-30",
    statusStep: 3,
    statusText: "Leather cutting and printing layout check."
  },
  {
    id: "UW-ORD-837",
    clientEmail: "client7@uniwear.co",
    productName: "Stamina Cargo Trousers",
    volume: 150,
    value: "₹3,75,000",
    deliveryDate: "2026-07-18",
    statusStep: 5,
    statusText: "Dispatched via logistics partner. Handover scheduled tomorrow."
  },
  {
    id: "UW-ORD-838",
    clientEmail: "client8@uniwear.co",
    productName: "Elite Front Desk Blazer",
    volume: 60,
    value: "₹1,80,000",
    deliveryDate: "2026-08-05",
    statusStep: 2,
    statusText: "Fabric dye color match completed."
  },
  {
    id: "UW-ORD-839",
    clientEmail: "client9@uniwear.co",
    productName: "Oxford Cotton Shirt",
    volume: 200,
    value: "₹3,40,000",
    deliveryDate: "2026-08-12",
    statusStep: 1,
    statusText: "Awaiting initial bank payment clearance."
  },
  {
    id: "UW-ORD-840",
    clientEmail: "client10@uniwear.co",
    productName: "AeroGuard Boiler Suit",
    volume: 120,
    value: "₹3,60,000",
    deliveryDate: "2026-08-20",
    statusStep: 3,
    statusText: "Reflective warning strip vulcanization ongoing."
  }
];

const defaultSamples = [
  {
    id: "UW-SMP-412",
    clientEmail: "client@uniwear.co",
    productName: "AeroGuard Boiler Suit",
    specs: "Embossed client corporate logo on back shoulders in gold stitching.",
    logoUrl: "assets/images/products/corporate-blazer-detail.png",
    date: "2026-06-18",
    status: "In Prototyping"
  },
  {
    id: "UW-SMP-413",
    clientEmail: "client2@uniwear.co",
    productName: "Executive Wool Blazer",
    specs: "Silver embroidery on pocket crest with custom brand insignia.",
    logoUrl: "assets/images/products/corporate-blazer-detail.png",
    date: "2026-06-15",
    status: "Approved"
  },
  {
    id: "UW-SMP-414",
    clientEmail: "client3@uniwear.co",
    productName: "Oxford Cotton Shirt",
    specs: "Button-down collar reinforcement, logo on cuffs.",
    logoUrl: "assets/images/products/corporate-blazer-detail.png",
    date: "2026-06-17",
    status: "Awaiting Review"
  }
];

const defaultTickets = [
  {
    id: "UW-TCK-921",
    clientEmail: "client@uniwear.co",
    subject: "Sizing variance in sample blazers",
    category: "Sampling Fit",
    status: "Open",
    date: "2026-06-18",
    messages: [
      { sender: "client", text: "We noticed the sample size 40 blazer feels slightly narrower in the shoulders.", time: "10:30 AM" },
      { sender: "admin", text: "Thanks for reporting. We will review our shoulder allowance templates in JP Nagar and submit a revision plan.", time: "11:45 AM" }
    ]
  },
  {
    id: "UW-TCK-922",
    clientEmail: "client2@uniwear.co",
    subject: "Delayed shipping of refinery boiler suits",
    category: "Logistics",
    status: "Open",
    date: "2026-06-17",
    messages: [
      { sender: "client", text: "The logistics company states they have not received the customs paperwork.", time: "09:15 AM" },
      { sender: "admin", text: "We are expediting the customs clearance with our logistics partner at Bengaluru Port.", time: "02:30 PM" }
    ]
  },
  {
    id: "UW-TCK-923",
    clientEmail: "client3@uniwear.co",
    subject: "Embroidery colors mismatch on pocket crest",
    category: "Sampling Fit",
    status: "Closed",
    date: "2026-06-16",
    messages: [
      { sender: "client", text: "The gold thread has a copper sheen. Can we use a brighter gold?", time: "11:00 AM" },
      { sender: "admin", text: "Certainly. We will switch to thread spec #G402 and resubmit prototype photo.", time: "03:45 PM" },
      { sender: "client", text: "Thank you, that looks excellent. Closing ticket.", time: "04:15 PM" }
    ]
  },
  {
    id: "UW-TCK-924",
    clientEmail: "client4@uniwear.co",
    subject: "Invoice formatting change request",
    category: "Billing & SLA",
    status: "Open",
    date: "2026-06-18",
    messages: [
      { sender: "client", text: "Please split the billing into our regional hubs in Delhi and Pune.", time: "08:30 AM" },
      { sender: "admin", text: "Noted. We will generate split invoices and send them over by evening.", time: "10:00 AM" }
    ]
  },
  {
    id: "UW-TCK-925",
    clientEmail: "client5@uniwear.co",
    subject: "Thread fraying after initial wash cycle",
    category: "Stitching Status",
    status: "Open",
    date: "2026-06-18",
    messages: [
      { sender: "client", text: "Some of the chef coats show thread fraying on the pocket corners.", time: "12:15 PM" },
      { sender: "admin", text: "We will inspect the reinforcing bar-tack machines at Jayanagar. Please send photos.", time: "01:30 PM" }
    ]
  },
  {
    id: "UW-TCK-926",
    clientEmail: "client@uniwear.co",
    subject: "Delivery schedule adjustment",
    category: "Logistics",
    status: "Closed",
    date: "2026-06-15",
    messages: [
      { sender: "client", text: "Can we delay delivery by 3 days since our warehouse is undergoing remodeling?", time: "02:00 PM" },
      { sender: "admin", text: "No problem. We will shift your delivery date to July 23.", time: "04:00 PM" },
      { sender: "client", text: "Perfect, thank you!", time: "05:00 PM" }
    ]
  }
];

const defaultProfile = {
  companyName: "Taj Resorts & Hotels Group",
  representative: "Sarah Andrews",
  email: "client@uniwear.co",
  phone: "+91 80 4912 2000",
  address: "#12, 7th Block, Jayanagar, Bengaluru - 560082"
};

// Helper to initialize and retrieve database
function getStorage(key, defaultVal) {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(defaultVal));
  }
  return JSON.parse(localStorage.getItem(key));
}

function setStorage(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

// NEW SAFE MIGRATION & SEEDING BLOCK (v8)
const defaultCompanySettings = {
  companyName: "UNIWEAR",
  supportEmail: "connect@uniwear.co",
  salesEmail: "sales@uniwear.co",
  phone: "91087 65831, 98459 32201",
  address: "No 121/A, 1st Floor, 27th Cross Road, 7th Block, Jayanagar, Bengaluru – 560070",
  logoUrl: "",
  faviconUrl: "",
  notificationEmail: "connect@uniwear.co",
  ccEmail: ""
};

// 1. Initial Seeding of items that do not exist yet
if (!localStorage.getItem('uniwear_users')) {
  localStorage.setItem('uniwear_users', JSON.stringify(defaultUsers));
}
if (!localStorage.getItem('uniwear_products')) {
  localStorage.setItem('uniwear_products', JSON.stringify(defaultProducts));
}
if (!localStorage.getItem('uniwear_blogs')) {
  localStorage.setItem('uniwear_blogs', JSON.stringify(defaultBlogs));
}
if (!localStorage.getItem('uniwear_quotations')) {
  localStorage.setItem('uniwear_quotations', JSON.stringify(defaultQuotations));
}
if (!localStorage.getItem('uniwear_leads')) {
  localStorage.setItem('uniwear_leads', JSON.stringify(defaultLeads));
}
if (!localStorage.getItem('uniwear_orders')) {
  localStorage.setItem('uniwear_orders', JSON.stringify(defaultOrders));
}
if (!localStorage.getItem('uniwear_samples')) {
  localStorage.setItem('uniwear_samples', JSON.stringify(defaultSamples));
}
if (!localStorage.getItem('uniwear_tickets')) {
  localStorage.setItem('uniwear_tickets', JSON.stringify(defaultTickets));
}
if (!localStorage.getItem('uniwear_profile')) {
  localStorage.setItem('uniwear_profile', JSON.stringify(defaultProfile));
}
if (!localStorage.getItem('uniwear_cart')) {
  localStorage.setItem('uniwear_cart', JSON.stringify([]));
}
if (!localStorage.getItem('uniwear_notifications')) {
  localStorage.setItem('uniwear_notifications', JSON.stringify([
    { id: 1, recipient: "client@uniwear.co", title: "Quotation Approved", text: "UW-Quote-721 for 1,200 blazers approved. Sample production starting.", time: "2 hours ago" },
    { id: 2, recipient: "admin", title: "New Lead Captured", text: "Amit Sharma from Infosys Bengaluru registered as a corporate uniform inquiry.", time: "3 hours ago" }
  ]));
}
if (!localStorage.getItem('uniwear_company_settings')) {
  localStorage.setItem('uniwear_company_settings', JSON.stringify(defaultCompanySettings));
}

// 2. Run Safe Migration to v8 if not already performed
let migrationLog = { productsAdded: [], blogsAdded: [], settingsUpdated: false };
if (localStorage.getItem('uniwear_seeded_v8') !== 'true') {
  // A. Update Company Settings
  let currentSettings = JSON.parse(localStorage.getItem('uniwear_company_settings')) || {};
  // Only fill missing fields & update/overwrite contact fields for production content
  for (const key in defaultCompanySettings) {
    if (!currentSettings[key] || currentSettings[key] === defaultCompanySettings[key] ||
      key === 'phone' || key === 'address' || key === 'salesEmail' || key === 'supportEmail') {
      currentSettings[key] = defaultCompanySettings[key];
    }
  }
  localStorage.setItem('uniwear_company_settings', JSON.stringify(currentSettings));
  migrationLog.settingsUpdated = true;

  // B. Merge missing UNIWEAR products
  let currentProducts = JSON.parse(localStorage.getItem('uniwear_products')) || [];
  defaultProducts.forEach(newProd => {
    const exists = currentProducts.some(p => p.name.trim().toLowerCase() === newProd.name.trim().toLowerCase());
    if (!exists) {
      const maxId = currentProducts.reduce((max, p) => p.id > max ? p.id : max, 0);
      newProd.id = maxId + 1;
      currentProducts.push(newProd);
      migrationLog.productsAdded.push(newProd.name);
    }
  });
  localStorage.setItem('uniwear_products', JSON.stringify(currentProducts));

  // C. Merge missing UNIWEAR blogs
  let currentBlogs = JSON.parse(localStorage.getItem('uniwear_blogs')) || [];
  defaultBlogs.forEach(newBlog => {
    const exists = currentBlogs.some(b => b.title.trim().toLowerCase() === newBlog.title.trim().toLowerCase() ||
      (b.slug && b.slug.trim().toLowerCase() === newBlog.slug.trim().toLowerCase()));
    if (!exists) {
      const maxId = currentBlogs.reduce((max, b) => b.id > max ? b.id : max, 0);
      newBlog.id = maxId + 1;
      currentBlogs.push(newBlog);
      migrationLog.blogsAdded.push(newBlog.title);
    }
  });
  localStorage.setItem('uniwear_blogs', JSON.stringify(currentBlogs));

  // D. Save migration log in localStorage so we can display/read it
  localStorage.setItem('uniwear_migration_log', JSON.stringify(migrationLog));

  // E. Mark v8 migration as complete
  localStorage.setItem('uniwear_seeded_v8', 'true');
  console.log("UNIWEAR safe content migration v8 executed successfully.", migrationLog);
}

// Initializing Storage Keys
let stateUsers = getStorage('uniwear_users', defaultUsers);
let stateProducts = getStorage('uniwear_products', defaultProducts);
let stateBlogs = getStorage('uniwear_blogs', defaultBlogs);

// Self-healing migration for blog fields
let blogsModified = false;
stateBlogs = stateBlogs.map(b => {
  const match = defaultBlogs.find(db => db.id === b.id || db.title.trim().toLowerCase() === b.title.trim().toLowerCase());
  
  if (!b.slug) {
    b.slug = b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    blogsModified = true;
  }
  
  if (!b.featuredImage) {
    b.featuredImage = b.img || (match ? match.featuredImage : '');
    blogsModified = true;
  }
  
  if (!b.content) {
    b.content = (match ? match.content : b.excerpt) || "";
    blogsModified = true;
  }
  
  if (!b.readingTime) {
    if (match && match.readingTime) {
      b.readingTime = match.readingTime;
    } else {
      const words = b.content ? b.content.split(/\s+/).length : 0;
      const mins = Math.max(1, Math.ceil(words / 200));
      b.readingTime = `${mins} min read`;
    }
    blogsModified = true;
  }
  
  return b;
});
if (blogsModified) {
  localStorage.setItem('uniwear_blogs', JSON.stringify(stateBlogs));
}

let stateQuotations = getStorage('uniwear_quotations', defaultQuotations);
let stateLeads = getStorage('uniwear_leads', defaultLeads);
let stateOrders = getStorage('uniwear_orders', defaultOrders);
let stateSamples = getStorage('uniwear_samples', defaultSamples);
let stateTickets = getStorage('uniwear_tickets', defaultTickets);
let stateProfile = getStorage('uniwear_profile', defaultProfile);
let stateCart = getStorage('uniwear_cart', []);
let stateNotifications = getStorage('uniwear_notifications', []);
let stateCompanySettings = getStorage('uniwear_company_settings', defaultCompanySettings);
const kKey = ['a', 'c', 'c', 'e', 's', 's', 'K', 'e', 'y'].join('');
if (stateCompanySettings[kKey] !== undefined) {
  delete stateCompanySettings[kKey];
  setStorage('uniwear_company_settings', stateCompanySettings);
}
if (stateCompanySettings.notificationEmail === undefined) {
  stateCompanySettings.notificationEmail = defaultCompanySettings.notificationEmail || "connect@uniwear.co";
  stateCompanySettings.ccEmail = defaultCompanySettings.ccEmail || "";
  setStorage('uniwear_company_settings', stateCompanySettings);
}

// ==========================================
// 1.5. COMPLETE THEME SWITCHING SYSTEM
// ==========================================

// Initialize theme instantly to prevent visual flashes
const savedTheme = localStorage.getItem('uniwear_theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

const themeStyleEl = document.createElement('style');
themeStyleEl.textContent = `
  :root {
    --bg-color: #FFFFFF;
  }

  /* True Obsidian Dark Mode Overrides */
  html[data-theme="dark"] body,
  html[data-theme="dark"] footer,
  html[data-theme="dark"] #global-footer,
  html[data-theme="dark"] .bg-darkBg {
    background-color: #09090b !important;
    color: #FAFAFA !important;
  }

  /* UNIVERSAL DARK MODE HEADER SYSTEM */
  html[data-theme="dark"] #global-header,
  html[data-theme="dark"] header {
    background-color: rgba(9, 9, 11, 0.96) !important;
    border-bottom-color: rgba(255, 255, 255, 0.12) !important;
    color: #FFFFFF !important;
  }

  html[data-theme="dark"] #global-header img,
  html[data-theme="dark"] header img {
    filter: brightness(0) invert(1) !important;
  }

  html[data-theme="dark"] #global-header nav,
  html[data-theme="dark"] header nav {
    background-color: rgba(24, 24, 27, 0.92) !important;
    border-color: rgba(255, 255, 255, 0.15) !important;
  }

  html[data-theme="dark"] #global-header a:not(.bg-primary),
  html[data-theme="dark"] header a:not(.bg-primary),
  html[data-theme="dark"] #global-header .nav-link,
  html[data-theme="dark"] header .nav-link,
  html[data-theme="dark"] #global-header i,
  html[data-theme="dark"] header i {
    color: #FFFFFF !important;
  }
  
  /* KEEP IMAGES 100% BRIGHT & VISIBLE IN DARK MODE */
  html[data-theme="dark"] img {
    filter: none !important;
    opacity: 1 !important;
  }
  
  html[data-theme="dark"] div[class*="bg-white"],
  html[data-theme="dark"] div[class*="bg-lightCard"],
  html[data-theme="dark"] div[class*="bg-slate-50"],
  html[data-theme="dark"] div[class*="bg-gray-50"],
  html[data-theme="dark"] article[class*="bg-"],
  html[data-theme="dark"] .bg-white,
  html[data-theme="dark"] .bg-lightCard,
  html[data-theme="dark"] .bg-slate-50,
  html[data-theme="dark"] .bg-slate-50\/60,
  html[data-theme="dark"] .bg-slate-50\/50,
  html[data-theme="dark"] .bg-slate-100,
  html[data-theme="dark"] .bg-gray-50,
  html[data-theme="dark"] .bg-gray-100 {
    background-color: #141416 !important;
    border-color: rgba(255, 255, 255, 0.12) !important;
  }

  html[data-theme="dark"] .bg-lightBg {
    background-color: #09090b !important;
  }
  
  html[data-theme="dark"] .bg-gray-50\/80,
  html[data-theme="dark"] .bg-slate-50\/80 {
    background-color: rgba(20, 20, 22, 0.8) !important;
  }

  html[data-theme="dark"] .bg-white\/95,
  html[data-theme="dark"] .bg-white\/90,
  html[data-theme="dark"] .bg-white\/85,
  html[data-theme="dark"] .bg-white\/80,
  html[data-theme="dark"] .bg-white\/75 {
    background-color: rgba(20, 20, 22, 0.92) !important;
  }

  /* HIGH-CONTRAST TEXT VISIBILITY SYSTEM IN DARK MODE */
  html[data-theme="dark"] h1,
  html[data-theme="dark"] h2,
  html[data-theme="dark"] h3,
  html[data-theme="dark"] h4,
  html[data-theme="dark"] h5,
  html[data-theme="dark"] h6,
  html[data-theme="dark"] [class*="text-slate-900"],
  html[data-theme="dark"] [class*="text-slate-800"],
  html[data-theme="dark"] [class*="text-slate-700"],
  html[data-theme="dark"] [class*="text-gray-900"],
  html[data-theme="dark"] [class*="text-gray-800"],
  html[data-theme="dark"] [class*="text-gray-700"],
  html[data-theme="dark"] .hero-trust-value,
  html[data-theme="dark"] .text-charcoal {
    color: #FFFFFF !important;
  }
  
  html[data-theme="dark"] p,
  html[data-theme="dark"] li,
  html[data-theme="dark"] [class*="text-slate-600"],
  html[data-theme="dark"] [class*="text-slate-500"],
  html[data-theme="dark"] [class*="text-gray-600"],
  html[data-theme="dark"] [class*="text-gray-500"],
  html[data-theme="dark"] [class*="text-gray-400"],
  html[data-theme="dark"] .hero-trust-label,
  html[data-theme="dark"] .text-mutedText {
    color: #E4E4E7 !important;
  }

  html[data-theme="dark"] .border-lightBorder,
  html[data-theme="dark"] .border-slate-200,
  html[data-theme="dark"] .border-slate-200\/80,
  html[data-theme="dark"] .border-slate-100,
  html[data-theme="dark"] .border-gray-200 {
    border-color: rgba(255, 255, 255, 0.12) !important;
  }

  html[data-theme="dark"] input,
  html[data-theme="dark"] select,
  html[data-theme="dark"] textarea {
    background-color: #09090b !important;
    color: #FFFFFF !important;
    border-color: rgba(255, 255, 255, 0.18) !important;
  }
  
  html[data-theme="dark"] input:focus,
  html[data-theme="dark"] select:focus,
  html[data-theme="dark"] textarea:focus {
    border-color: #B91C1C !important;
  }
  
  html[data-theme="dark"] input::placeholder,
  html[data-theme="dark"] textarea::placeholder {
    color: #A1A1AA !important;
    opacity: 0.7 !important;
  }
  
  html[data-theme="dark"] .glass-nav {
    background: rgba(9, 9, 11, 0.92) !important;
    border-bottom-color: rgba(255, 255, 255, 0.1) !important;
  }
  
  html[data-theme="dark"] .glass-card {
    background: rgba(20, 20, 22, 0.85) !important;
    border-color: rgba(255, 255, 255, 0.12) !important;
  }

  /* Tables Dark Mode */
  html[data-theme="dark"] table thead tr {
    background-color: #09090b !important;
  }
  html[data-theme="dark"] table tbody tr {
    border-bottom-color: rgba(255, 255, 255, 0.1) !important;
  }
  html[data-theme="dark"] table tbody tr:hover {
    background-color: rgba(255, 255, 255, 0.04) !important;
  }

  /* Chatbot window Dark Mode */
  html[data-theme="dark"] #demo-chatbot-window {
    background-color: #141416 !important;
    border-color: rgba(255, 255, 255, 0.12) !important;
  }
  html[data-theme="dark"] #demo-chatbot-messages {
    background-color: #09090b !important;
  }
  html[data-theme="dark"] .chat-msg-bubble.bot {
    background-color: #141416 !important;
    color: #FFFFFF !important;
    border-color: rgba(255, 255, 255, 0.12) !important;
  }
  html[data-theme="dark"] .chat-chip {
    background-color: #141416 !important;
    border-color: rgba(255, 255, 255, 0.12) !important;
    color: #D4D4D8 !important;
  }
  html[data-theme="dark"] .chat-chip:hover {
    background-color: rgba(185, 28, 28, 0.15) !important;
    border-color: #B91C1C !important;
    color: #FFFFFF !important;
  }
  html[data-theme="dark"] #demo-chatbot-window form,
  html[data-theme="dark"] #demo-chatbot-chips {
    background-color: #141416 !important;
    border-top-color: rgba(255, 255, 255, 0.12) !important;
  }
  html[data-theme="dark"] #demo-chatbot-input {
    background-color: #09090b !important;
    color: #FFFFFF !important;
    border-color: rgba(255, 255, 255, 0.12) !important;
  }
  html[data-theme="dark"] .chatbot-product-card {
    background-color: #141416 !important;
    border-color: rgba(255, 255, 255, 0.12) !important;
  }
  html[data-theme="dark"] .chatbot-product-card h5 {
    color: #FFFFFF !important;
  }

  /* Portals sidebars, headers, cards */
  html[data-theme="dark"] aside, 
  html[data-theme="dark"] header {
    background-color: #09090b !important;
    border-color: rgba(255, 255, 255, 0.12) !important;
  }
  
  html[data-theme="dark"] .bg-gradient-to-r.from-red-50 {
    background-image: linear-gradient(to right, rgba(185, 28, 28, 0.15), transparent) !important;
    border-color: rgba(185, 28, 28, 0.3) !important;
  }

  /* Specific details cards & configuration sections */
  html[data-theme="dark"] .bg-lightCard .bg-white {
    background-color: #09090b !important;
  }
  
  html[data-theme="dark"] select option {
    background-color: #141416 !important;
    color: #FFFFFF !important;
  }

  html[data-theme="dark"] #cust-notifications-popover,
  html[data-theme="dark"] #cust-notifications-popover .bg-lightCard {
    background-color: #141416 !important;
  }
  
  /* Ticket chat active screen */
  html[data-theme="dark"] #ticket-chat-active,
  html[data-theme="dark"] #ticket-chat-active form,
  html[data-theme="dark"] #ticket-chat-active .bg-lightCard {
    background-color: #141416 !important;
  }
  html[data-theme="dark"] #chat-messages-scroll-area {
    background-color: #09090b !important;
  }

  /* Public Mobile navigation drawer background */
  html[data-theme="dark"] #mobile-nav {
    background-color: rgba(9, 9, 11, 0.98) !important;
  }

  /* Admin Dashboard cards */
  html[data-theme="dark"] .admin-portal-view .bg-white {
    background-color: #141416 !important;
  }

  /* Remove Page Transition Overlays */
  .theme-toggle-btn {
    display: none !important;
  }
`;
document.head.appendChild(themeStyleEl);

function applyUniversalHeaderTheme() {
  const header = document.getElementById('global-header');
  if (!header) return;

  // Force light mode theme
  const currentTheme = 'light';
  document.documentElement.setAttribute('data-theme', 'light');
  const isHomepage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname === '';
  const isScrolled = window.scrollY > 30;

  const innerDiv = header.querySelector('div.max-w-7xl');
  if (innerDiv) {
    innerDiv.className = 'max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between';
  }

  const logoImg = header.querySelector('a[href="index.html"] img, #header-logo-img, img[alt*="Logo"]');
  const navPill = header.querySelector('nav');
  const navLinks = header.querySelectorAll('.nav-link');
  const portalLink = document.getElementById('header-client-portal') || header.querySelector('a[href="login.html"]');
  const mobileMenuIcon = document.getElementById('menu-icon') || header.querySelector('#mobile-menu-btn i');

  if (!isScrolled) {
    // Top of Page: Transparent Header over Dark Hero Overlay for ALL pages
    header.className = 'fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-transparent text-white';
    if (logoImg) logoImg.style.filter = 'brightness(0) invert(1)';
    if (navPill) navPill.className = 'hidden lg:flex items-center lg:gap-3 xl:gap-6 bg-black/40 backdrop-blur-md py-2 lg:px-4 xl:px-6 rounded-full border border-white/20 shadow-lg';
    navLinks.forEach(l => { l.style.color = 'rgba(255, 255, 255, 0.95)'; });
    if (portalLink) portalLink.style.color = 'rgba(255, 255, 255, 0.95)';
    if (mobileMenuIcon) mobileMenuIcon.style.color = '#FFFFFF';
  } else {
    // Scrolled Down: White Backdrop Glass Navbar for ALL pages
    header.className = 'fixed top-0 left-0 w-full z-50 transition-all duration-300 shadow-md bg-white/95 backdrop-blur-md border-b border-slate-200/80 text-slate-900';
    if (logoImg) logoImg.style.filter = 'none';
    if (navPill) navPill.className = 'hidden lg:flex items-center lg:gap-3 xl:gap-6 bg-slate-100/90 backdrop-blur-md py-2 lg:px-4 xl:px-6 rounded-full border border-slate-200/80 shadow-inner';
    navLinks.forEach(l => { l.style.color = '#334155'; });
    if (portalLink) portalLink.style.color = '#334155';
    if (mobileMenuIcon) mobileMenuIcon.style.color = '#0f172a';
  }
}

window.addEventListener('scroll', applyUniversalHeaderTheme, { passive: true });
document.addEventListener('DOMContentLoaded', applyUniversalHeaderTheme);

function initTheme() {
  document.documentElement.setAttribute('data-theme', 'light');
  localStorage.setItem('uniwear_theme', 'light');
  applyUniversalHeaderTheme();
}

function toggleTheme() {
  document.documentElement.setAttribute('data-theme', 'light');
  localStorage.setItem('uniwear_theme', 'light');
  applyUniversalHeaderTheme();
}

function updateThemeUI(theme) {
  document.documentElement.setAttribute('data-theme', 'light');
  applyUniversalHeaderTheme();
}

function bindThemeToggles() {
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.removeEventListener('click', toggleTheme);
    btn.addEventListener('click', toggleTheme);
  });
}

// Observe dynamic additions
const themeObserver = new MutationObserver(() => {
  bindThemeToggles();
});
themeObserver.observe(document.documentElement, { childList: true, subtree: true });


// ==========================================
// 2. SHARED ANIMATIONS SYSTEM
// ==========================================
let lenisInstance;

function initScrollEngine() {
  // Check if Lenis is loaded
  if (typeof Lenis !== 'undefined') {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Sync GSAP ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      lenisInstance.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  // Header background control
  const nav = document.getElementById('global-header');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('glass-nav', 'shadow-md');
      } else {
        nav.classList.remove('glass-nav', 'shadow-md');
      }
    });
  }
}

// Custom Cursor Setup removed (standard browser cursor restored)
window.refreshHoverables = () => { };

// Multi-Page Router Transition Sweep (Disabled for direct navigation)
function initPageTransitions() {
  const overlay = document.getElementById('transition-overlay');
  if (overlay) {
    overlay.style.display = 'none';
    overlay.classList.add('hidden', 'pointer-events-none');
  }
}

// ==========================================
// 3. CART / SAMPLE BASKET CORE
// ==========================================
function updateCartCountBadge() {
  const badge = document.getElementById('cart-badge-count');
  if (badge) {
    badge.style.display = 'none';
  }
}

function addToSampleCart(prodId) {
  console.log("addToSampleCart disabled as per client revision");
}

function removeSampleCartItem(prodId) {
  console.log("removeSampleCartItem disabled as per client revision");
}

function toggleSampleDrawer(show) {
  console.log("toggleSampleDrawer disabled as per client revision");
}

function handleSampleCheckout() {
  console.log("handleSampleCheckout disabled as per client revision");
}

// FAQ Accordion Toggler
function toggleFaq(num) {
  const ans = document.getElementById(`faq-ans-${num}`);
  const icon = document.getElementById(`faq-icon-${num}`);
  if (!ans) return;

  ans.classList.toggle('hidden');
  if (ans.classList.contains('hidden')) {
    icon.style.transform = "rotate(0deg)";
  } else {
    icon.style.transform = "rotate(45deg)";
  }
}

// Mobile Menu Drawer Toggler
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const menuIcon = document.getElementById('menu-icon');
  const header = document.getElementById('global-header');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const isOpen = !mobileNav.classList.contains('translate-x-full');
      if (isOpen) {
        mobileNav.classList.add('translate-x-full');
        menuIcon.className = "ri-menu-line text-2xl";
        document.body.classList.remove('overflow-hidden');
        if (lenisInstance) lenisInstance.start();

        if (header) {
          header.classList.remove('h-screen', 'bg-transparent');
          if (window.scrollY > 50) {
            header.classList.add('glass-nav', 'shadow-md');
          }
        }
      } else {
        mobileNav.classList.remove('translate-x-full');
        menuIcon.className = "ri-close-line text-2xl";
        document.body.classList.add('overflow-hidden');
        if (lenisInstance) lenisInstance.stop();

        if (header) {
          header.classList.add('h-screen', 'bg-transparent');
          header.classList.remove('glass-nav', 'shadow-md');
        }
      }
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.add('translate-x-full');
        menuIcon.className = "ri-menu-line text-2xl";
        document.body.classList.remove('overflow-hidden');
        if (lenisInstance) lenisInstance.start();

        if (header) {
          header.classList.remove('h-screen', 'bg-transparent');
          if (window.scrollY > 50) {
            header.classList.add('glass-nav', 'shadow-md');
          }
        }
      });
    });
  }
}

// Global Dynamic Branding Application
function applyCompanySettings() {
  const settings = JSON.parse(localStorage.getItem('uniwear_company_settings')) || {
    companyName: "UNIWEAR",
    supportEmail: "connect@uniwear.co",
    salesEmail: "sales@uniwear.co",
    phone: "91087 65831, 98459 32201",
    address: "No 121/A, 1st Floor, 27th Cross Road, 7th Block, Jayanagar, Bengaluru – 560070",
    logoUrl: "",
    faviconUrl: ""
  };

  // Update website logo images dynamically
  if (settings.logoUrl) {
    document.querySelectorAll('img[src*="assets/logos/logo-icon.svg"]').forEach(el => {
      el.src = settings.logoUrl;
      el.classList.remove('filter', 'brightness-0', 'invert', 'w-8', 'h-8', 'w-6', 'h-6');
      if (el.closest('aside')) {
        el.classList.add('h-6', 'w-auto', 'object-contain');
      } else {
        el.classList.add('h-8', 'w-auto', 'object-contain');
      }
    });
    // Hide text next to logo
    document.querySelectorAll('.company-logo-text, .company-portal-logo-text').forEach(el => {
      el.classList.add('hidden');
    });
  } else {
    document.querySelectorAll('img[src*="assets/logos/logo-icon.svg"]').forEach(el => {
      el.src = "assets/logos/logo-icon.svg";
      el.classList.remove('h-8', 'w-auto', 'object-contain');
      if (el.closest('aside')) {
        el.classList.add('w-6', 'h-6');
      } else {
        el.classList.add('w-8', 'h-8');
      }
      if (el.classList.contains('brightness-0') || el.closest('footer')) {
        el.classList.add('filter', 'brightness-0', 'invert');
      }
    });
    // Show text next to logo
    document.querySelectorAll('.company-logo-text, .company-portal-logo-text').forEach(el => {
      el.classList.remove('hidden');
    });
  }

  // Update favicon separately
  if (settings.faviconUrl) {
    document.querySelectorAll('link[rel*="icon"]').forEach(el => {
      el.href = settings.faviconUrl;
    });
  } else {
    document.querySelectorAll('link[rel*="icon"]').forEach(el => {
      el.href = settings.logoUrl || "assets/logos/logo-icon.svg";
    });
  }

  // Update document title suffixes containing UNIWEAR
  const title = document.title;
  if (title.toUpperCase().includes('UNIWEAR')) {
    document.title = title.replace(/UNIWEAR/gi, settings.companyName);
  }

  // Update company name text elements
  document.querySelectorAll('.company-name').forEach(el => {
    el.innerText = settings.companyName;
  });

  // Update logo wordmark text elements dynamically
  const logoTextHtml = (() => {
    const name = settings.companyName;
    if (name.toUpperCase() === 'UNIWEAR') {
      return `UNI<span class="text-primary">WEAR</span>`;
    }
    const len = name.length;
    if (len <= 3) return name;
    const mid = Math.ceil(len / 2);
    return `${name.substring(0, mid)}<span class="text-primary">${name.substring(mid)}</span>`;
  })();

  document.querySelectorAll('.company-logo-text').forEach(el => {
    el.innerHTML = logoTextHtml;
  });

  // Update portal brand text elements dynamically (e.g. UNIPORTAL)
  const portalLogoTextHtml = (() => {
    const name = settings.companyName;
    if (name.toUpperCase() === 'UNIWEAR') {
      return `UNI<span class="text-primary">PORTAL</span>`;
    }
    if (name.toUpperCase().endsWith('WEAR')) {
      const base = name.substring(0, name.length - 4);
      return `${base}<span class="text-primary">PORTAL</span>`;
    }
    return `${name}<span class="text-primary">PORTAL</span>`;
  })();

  document.querySelectorAll('.company-portal-logo-text').forEach(el => {
    el.innerHTML = portalLogoTextHtml;
  });

  // Update support emails
  document.querySelectorAll('.company-support-email').forEach(el => {
    if (el.tagName === 'A') {
      el.href = `mailto:${settings.supportEmail}`;
    }
    el.innerText = settings.supportEmail;
  });

  // Update sales emails
  document.querySelectorAll('.company-sales-email').forEach(el => {
    if (el.tagName === 'A') {
      el.href = `mailto:${settings.salesEmail}`;
    }
    el.innerText = settings.salesEmail;
  });

  // Update telephone numbers
  document.querySelectorAll('.company-phone').forEach(el => {
    if (el.tagName === 'A') {
      el.href = `tel:${settings.phone.replace(/[^0-9+]/g, '')}`;
    }
    el.innerText = settings.phone;
  });

  // Update offices addresses
  document.querySelectorAll('.company-address').forEach(el => {
    el.innerText = settings.address;
  });
}

// Email Helper removed (moved to Nodemailer backend)

// Portal Mobile Sidebar Navigation Drawer Toggler
function toggleSidebar(show) {
  const sidebar = document.getElementById('portal-sidebar') || document.getElementById('admin-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar || !overlay) return;

  if (show) {
    overlay.classList.remove('hidden');
    // Force DOM layout reflow
    sidebar.offsetHeight;
    sidebar.classList.remove('-translate-x-full');
    setTimeout(() => {
      overlay.classList.remove('opacity-0');
    }, 10);

    // Add scroll lock
    document.body.classList.add('overflow-hidden');
    if (typeof lenisInstance !== 'undefined' && lenisInstance) lenisInstance.stop();
  } else {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('opacity-0');
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 300);

    // Remove scroll lock
    document.body.classList.remove('overflow-hidden');
    if (typeof lenisInstance !== 'undefined' && lenisInstance) lenisInstance.start();
  }
}

// Global Init Load
window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  bindThemeToggles();
  initScrollEngine();
  initPageTransitions();
  updateCartCountBadge();
  initMobileMenu();
  applyCompanySettings();
  initAIChatbot();
  initPremiumBlogModal();
});

// ==========================================
// UNIWEAR SMART ASSISTANT 3.0 CHATBOT SYSTEM
// ==========================================

// Inject Chatbot styles dynamically to ensure they are available on all pages
const styleEl = document.createElement('style');
styleEl.textContent = `
  .chat-msg-row {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    margin-bottom: 12px;
  }
  .chat-msg-row.user {
    justify-content: flex-end;
  }
  .chat-msg-bubble {
    max-width: 80%;
    padding: 10px 14px;
    font-size: 11px;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .chat-msg-bubble.user {
    background-color: #B91C1C;
    color: #FFFFFF;
    border-radius: 16px 16px 0px 16px;
    box-shadow: 0 2px 8px rgba(185, 28, 28, 0.15);
  }
  .chat-msg-bubble.bot {
    background-color: #FFFFFF;
    color: #111827;
    border: 1px solid rgba(0,0,0,0.06);
    border-radius: 16px 16px 16px 0px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  }
  .chat-chip {
    background-color: #F9FAFB;
    border: 1px solid rgba(0,0,0,0.08);
    color: #4B5563;
    padding: 6px 12px;
    font-size: 10px;
    font-weight: 600;
    border-radius: 9999px;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    white-space: nowrap;
    display: inline-block;
  }
  .chat-chip:hover {
    background-color: rgba(185, 28, 28, 0.05);
    border-color: #B91C1C;
    color: #B91C1C;
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(185, 28, 28, 0.1);
  }
  #demo-chatbot-window.minimized {
    height: 52px !important;
    max-height: 52px !important;
  }
  #demo-chatbot-window.minimized #demo-chatbot-messages,
  #demo-chatbot-window.minimized #demo-chatbot-chips,
  #demo-chatbot-window.minimized form {
    display: none !important;
  }
  .chatbot-product-card {
    background: #FFFFFF;
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 12px;
    overflow: hidden;
    margin-top: 8px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  }
  .chatbot-card-img {
    height: 90px;
    width: 100%;
    object-cover: cover;
  }
`;
document.head.appendChild(styleEl);

// State Memory & Storage Variables
let chatMemory = {
  name: "",
  company: "",
  email: "",
  phone: "",
  industry: "",
  product: "",
  quantity: "",
  location: "",
  timeline: "",
  branding: ""
};

let chatState = {
  mode: "chat", // 'chat', 'quote_flow', 'handoff_flow'
  quoteStep: 0,
  handoffStep: 0,
  interactionCount: 0
};

// Retrieve client profile settings for pre-filling
function getProfileInfo() {
  const role = localStorage.getItem('uniwear_auth_role');
  if (role === 'client') {
    const profile = JSON.parse(localStorage.getItem('uniwear_profile'));
    if (profile) {
      return {
        name: profile.representative || "",
        company: profile.companyName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        location: profile.address || ""
      };
    }
  }
  return {};
}

function loadChatState() {
  const savedMemory = sessionStorage.getItem('uniwear_chat_memory');
  const savedState = sessionStorage.getItem('uniwear_chat_state');

  if (savedMemory) {
    chatMemory = JSON.parse(savedMemory);
  } else {
    Object.assign(chatMemory, getProfileInfo());
  }

  if (savedState) {
    chatState = JSON.parse(savedState);
  }
}

function saveChatState() {
  sessionStorage.setItem('uniwear_chat_memory', JSON.stringify(chatMemory));
  sessionStorage.setItem('uniwear_chat_state', JSON.stringify(chatState));
}

// Conversation Steps Configuration
const quoteSteps = [
  {
    field: "company",
    prompt: "Let's prepare your customized quotation. First, what is your **Company Name**?",
    validate: (val) => val.trim().length > 1
  },
  {
    field: "name",
    prompt: "Thank you. What is the **Contact Person's Name**?",
    validate: (val) => val.trim().length > 1
  },
  {
    field: "email",
    prompt: "What is your corporate **Email Address**?",
    validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
  },
  {
    field: "phone",
    prompt: "Got it. What is your **Mobile / Phone Number**?",
    validate: (val) => /^[0-9+\s-]{8,15}$/.test(val.trim())
  },
  {
    field: "product",
    prompt: "Which category of uniforms do you require?",
    type: "select",
    options: ["Industrial Uniforms", "Corporate Uniforms", "Hospitality Uniforms", "Institutional Uniforms", "Corporate Gifting"],
    validate: (val) => val.trim().length > 1
  },
  {
    field: "quantity",
    prompt: "What is the expected **Quantity / Volume** needed? (Minimum order is 50-100 sets)",
    validate: (val) => !isNaN(val) && parseInt(val) > 0
  },
  {
    field: "location",
    prompt: "What is the **Delivery Location / Address**?",
    validate: (val) => val.trim().length > 1
  },
  {
    field: "branding",
    prompt: "Do you have any **Custom Branding Requirements** (e.g. Embroidery logo, Screen printing)? Details:",
    validate: (val) => val.trim().length > 1
  },
  {
    field: "timeline",
    prompt: "What is your expected **Delivery Timeline** (e.g. 30 days, urgent)?",
    validate: (val) => val.trim().length > 1
  }
];

const handoffSteps = [
  {
    field: "name",
    prompt: "To connect you with our sales representative, what is your **Name**?",
    validate: (val) => val.trim().length > 1
  },
  {
    field: "company",
    prompt: "What is your **Company Name**?",
    validate: (val) => val.trim().length > 1
  },
  {
    field: "email",
    prompt: "What is your **Email Address**?",
    validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
  },
  {
    field: "phone",
    prompt: "What is your **Phone Number**?",
    validate: (val) => /^[0-9+\s-]{8,15}$/.test(val.trim())
  },
  {
    field: "branding",
    prompt: "Please provide a brief description of your **Requirement** (e.g. callback time or query):",
    validate: (val) => val.trim().length > 1
  }
];

// Context Aware Suggested Chips
function getContextChips() {
  const path = window.location.pathname;
  const role = localStorage.getItem('uniwear_auth_role');

  if (role === 'admin') {
    return [
      { text: "📊 Dashboard Insights", value: "Dashboard Insights" },
      { text: "📈 View Blog Stats", value: "View Blog Stats" },
      { text: "❓ Chatbot Help", value: "Help" }
    ];
  }

  if (role === 'client') {
    return [
      { text: "📦 Track My Order", value: "Track My Order" },
      { text: "📄 Quotation Review", value: "Quotation Review" },
      { text: "🔔 View Notifications", value: "View Notifications" },
      { text: "❓ Chatbot Help", value: "Help" }
    ];
  }

  if (path.includes('uniforms.html')) {
    return [
      { text: "👕 Product Recommendations", value: "Product Recommendations" },
      { text: "❓ Category Help", value: "Category Help" },
      { text: "💰 Request Quotation", value: "Request Quotation" },
      { text: "📞 Talk to Sales", value: "Talk to Sales" }
    ];
  }

  if (path.includes('catalog.html')) {
    return [
      { text: "📁 Download Catalog", value: "Download Catalog" },
      { text: "💰 Request Quotation", value: "Request Quotation" },
      { text: "📞 Talk to Sales", value: "Talk to Sales" }
    ];
  }

  if (path.includes('contact.html')) {
    return [
      { text: "💬 Enquiry Assistance", value: "Enquiry Assistance" },
      { text: "👥 Request Callback", value: "Request Callback" },
      { text: "💰 Request Quotation", value: "Request Quotation" }
    ];
  }

  // Default (Homepage, About, Blog, etc.)
  return [
    { text: "📂 View Categories", value: "View Categories" },
    { text: "💰 Request Quotation", value: "Request Quotation" },
    { text: "📞 Talk to Sales", value: "Talk to Sales" },
    { text: "👥 Request Callback", value: "Request Callback" }
  ];
}

// Intent Classification Engine
function detectIntent(text) {
  const val = text.toLowerCase().trim();

  // Human handoff matches
  if (/human|sales|callback|call me|representative|agent|speak|talk to|contact us|contact uniwear/i.test(val)) {
    return "human_handoff";
  }

  // Quotation matches
  if (/quote|quotation|price|pricing|cost|estimate|how much/i.test(val)) {
    return "quotation_request";
  }

  // Recommendation matches
  if (/recommend|suggest|choose|choice|selection|industry|hotel|hospital|school|factory|office|wear/i.test(val)) {
    return "recommendation";
  }

  // Catalog matches
  if (/catalog|library|download|brochure|pdf/i.test(val)) {
    return "catalog_access";
  }

  // Contact matches
  if (/phone|email|address|reach|call|hq|location|office/i.test(val)) {
    return "contact_info";
  }

  // Delivery matches
  if (/timeline|delivery|ship|lead time|how long/i.test(val)) {
    return "delivery_timeline";
  }

  // Order tracking matches
  if (/track|order status|stitching|progress/i.test(val)) {
    return "order_tracking";
  }

  // Support tickets matches
  if (/support|ticket|issue|problem|complain|help/i.test(val)) {
    return "support_request";
  }

  // Blog matches
  if (/blog|article|news|fabric research|read/i.test(val)) {
    return "blog_inquiry";
  }

  // FAQs
  if (/moq|minimum/i.test(val)) {
    return "faq_moq";
  }
  if (/embroidery|printing|logo|brand/i.test(val)) {
    return "faq_branding";
  }
  if (/fabric|material|cotton|polyester|linen|wool/i.test(val)) {
    return "faq_fabric";
  }
  if (/sample|prototype|approval/i.test(val)) {
    return "faq_sample";
  }
  if (/hello|hi|hey|greetings/i.test(val)) {
    return "greeting";
  }

  return "fallback";
}

// Chatbot UI Initialization
function initAIChatbot() {
  if (document.getElementById('demo-chatbot-container')) return;

  // Load state and messages from sessionStorage
  loadChatState();

  const container = document.createElement('div');
  container.id = "demo-chatbot-container";
  container.className = "fixed bottom-6 right-6 z-[9998] font-body flex flex-col items-end";
  container.innerHTML = `
    <!-- Chat Window -->
    <div id="demo-chatbot-window" class="hidden w-96 max-w-[calc(100vw-2rem)] h-[460px] bg-white border border-lightBorder rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-4 transition-all duration-300 transform scale-95 opacity-0 origin-bottom-right">
      <!-- Chat Header -->
      <div class="bg-charcoal text-white p-4 flex items-center justify-between shrink-0 select-none">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white"><i class="ri-robot-2-line text-lg"></i></div>
          <div>
            <h4 class="font-heading font-bold text-xs">UNIWEAR Smart Assistant</h4>
            <span class="text-[8px] text-green-400 font-mono flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-ping"></span> ONLINE</span>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button onclick="minimizeChatbot()" class="text-gray-400 hover:text-white transition-colors" title="Minimize"><i class="ri-subtract-line text-lg"></i></button>
          <button onclick="toggleChatbot(false)" class="text-gray-400 hover:text-white transition-colors" title="Close"><i class="ri-close-line text-lg"></i></button>
        </div>
      </div>

      <!-- Messages Body -->
      <div id="demo-chatbot-messages" class="flex-1 p-4 overflow-y-auto space-y-3 bg-lightCard">
        <!-- Messages Injected Here -->
      </div>

      <!-- Suggestion Chips -->
      <div id="demo-chatbot-chips" class="p-2 border-t border-lightBorder bg-white flex flex-wrap gap-1.5 shrink-0 max-h-24 overflow-y-auto">
        <!-- Suggestions Injected Here -->
      </div>

      <!-- Chat Input Footer -->
      <form onsubmit="sendTypedMessage(event)" class="p-2 border-t border-lightBorder flex gap-2 bg-white shrink-0">
        <div class="flex-1 relative">
          <textarea id="demo-chatbot-input" placeholder="Type a message..." rows="1" maxlength="250" class="w-full bg-lightCard border border-lightBorder rounded-2xl px-4 py-2 text-xs focus:outline-none focus:border-primary resize-none pr-12" style="max-height: 80px; min-height: 32px; line-height: 1.5;"></textarea>
          <span id="chatbot-char-count" class="absolute right-3.5 bottom-2 text-[8px] text-gray-400 hidden">0/250</span>
        </div>
        <button type="submit" class="w-9 h-9 rounded-2xl bg-primary hover:bg-primaryHover text-white flex items-center justify-center transition-colors shrink-0"><i class="ri-send-plane-fill text-sm"></i></button>
      </form>
    </div>

    <!-- Floating Chat Trigger Button -->
    <button id="demo-chatbot-trigger" onclick="toggleChatbot(true)" class="w-14 h-14 rounded-full bg-primary hover:bg-primaryHover text-white flex items-center justify-center shadow-xl shadow-primary/30 transition-all hover:scale-105 border-2 border-white">
      <i class="ri-chat-smile-3-line text-2xl" id="demo-chatbot-icon"></i>
    </button>
  `;
  document.body.appendChild(container);

  // Load and render persistent messages
  renderMessages();
  renderContextChips();

  // Setup input key listeners
  const inputEl = document.getElementById('demo-chatbot-input');
  if (inputEl) {
    inputEl.addEventListener('input', () => {
      const charCount = document.getElementById('chatbot-char-count');
      if (charCount) {
        charCount.innerText = `${inputEl.value.length}/250`;
        if (inputEl.value.length > 0) charCount.classList.remove('hidden');
        else charCount.classList.add('hidden');
      }
    });

    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendTypedMessage(e);
      }
    });
  }

  // Keep open/close state persistent
  if (sessionStorage.getItem('uniwear_chat_open') === 'true') {
    toggleChatbot(true, false);
  }
}

window.toggleChatbot = function (show, animate = true) {
  const win = document.getElementById('demo-chatbot-window');
  const trigger = document.getElementById('demo-chatbot-trigger');
  if (!win || !trigger) return;

  // Clear minimized state on toggle
  win.classList.remove('minimized');

  if (show) {
    win.classList.remove('hidden');
    sessionStorage.setItem('uniwear_chat_open', 'true');
    if (animate) {
      setTimeout(() => {
        win.classList.remove('scale-95', 'opacity-0');
        win.classList.add('scale-100', 'opacity-100');
      }, 10);
      trigger.classList.add('scale-0');
    } else {
      win.classList.remove('scale-95', 'opacity-0');
      win.classList.add('scale-100', 'opacity-100');
      trigger.classList.style = "display: none";
    }
    // Auto-focus input
    setTimeout(() => {
      const input = document.getElementById('demo-chatbot-input');
      if (input) input.focus();
    }, 200);
  } else {
    sessionStorage.setItem('uniwear_chat_open', 'false');
    win.classList.remove('scale-100', 'opacity-100');
    win.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      win.classList.add('hidden');
    }, 300);
    trigger.classList.remove('scale-0');
    trigger.removeAttribute('style');
  }
}

window.minimizeChatbot = function () {
  const win = document.getElementById('demo-chatbot-window');
  if (win) {
    win.classList.toggle('minimized');
  }
}

// Messages Render & Add Helper Functions
function renderMessages() {
  const msgContainer = document.getElementById('demo-chatbot-messages');
  if (!msgContainer) return;
  msgContainer.innerHTML = "";

  let msgs = JSON.parse(sessionStorage.getItem('uniwear_chat_messages'));
  if (!msgs) {
    msgs = [{
      sender: "bot",
      text: "Hello! I am the UNIWEAR Smart Assistant. How can I help you coordinate your enterprise uniform requirements today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }];
    sessionStorage.setItem('uniwear_chat_messages', JSON.stringify(msgs));
  }

  msgs.forEach(m => {
    const isUser = (m.sender === 'user');
    const row = document.createElement('div');
    row.className = isUser ? "chat-msg-row user" : "chat-msg-row";
    row.innerHTML = isUser ? `
      <div>
        <div class="chat-msg-bubble user">${m.text}</div>
        <span class="text-[8px] text-gray-400 mt-1 block text-right">${m.time}</span>
      </div>
    ` : `
      <div class="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[9px] shrink-0 select-none"><i class="ri-robot-2-line"></i></div>
      <div>
        <div class="chat-msg-bubble bot">${m.text}</div>
        <span class="text-[8px] text-gray-400 mt-1 block">${m.time}</span>
      </div>
    `;
    msgContainer.appendChild(row);
  });
  msgContainer.scrollTop = msgContainer.scrollHeight;
}

function addUserMessage(text) {
  let msgs = JSON.parse(sessionStorage.getItem('uniwear_chat_messages')) || [];
  msgs.push({
    sender: "user",
    text: text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  sessionStorage.setItem('uniwear_chat_messages', JSON.stringify(msgs));
  renderMessages();
}

function addBotMessage(text) {
  let msgs = JSON.parse(sessionStorage.getItem('uniwear_chat_messages')) || [];
  msgs.push({
    sender: "bot",
    text: text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  sessionStorage.setItem('uniwear_chat_messages', JSON.stringify(msgs));
  renderMessages();
}

// Chips Renderer
function renderChips(chips) {
  const chipsContainer = document.getElementById('demo-chatbot-chips');
  if (!chipsContainer) return;
  chipsContainer.innerHTML = "";
  if (chips.length === 0) {
    chipsContainer.classList.add('hidden');
    return;
  }
  chipsContainer.classList.remove('hidden');
  chips.forEach(c => {
    const btn = document.createElement('button');
    btn.className = "chat-chip";
    btn.innerText = c.text;
    btn.onclick = () => handleQuickAction(c.value);
    chipsContainer.appendChild(btn);
  });
}

function renderContextChips() {
  const chips = getContextChips();
  renderChips(chips);
}

// Form Submission Actions
window.sendTypedMessage = function (e) {
  if (e) e.preventDefault();
  const input = document.getElementById('demo-chatbot-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  addUserMessage(text);
  input.value = "";

  const charCount = document.getElementById('chatbot-char-count');
  if (charCount) charCount.classList.add('hidden');

  showBotTyping(() => {
    processUserResponse(text);
  });
}

// Quick action buttons click handler
window.handleQuickAction = function (value) {
  addUserMessage(value);
  showBotTyping(() => {
    processUserResponse(value);
  });
}

// Bot typing animation handler
function showBotTyping(callback) {
  const msgContainer = document.getElementById('demo-chatbot-messages');
  if (!msgContainer) return;
  const div = document.createElement('div');
  div.id = "demo-chatbot-typing";
  div.className = "chat-msg-row";
  div.innerHTML = `
    <div class="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[9px] shrink-0 select-none"><i class="ri-robot-2-line"></i></div>
    <div class="bg-white p-2.5 rounded-2xl border border-lightBorder text-charcoal leading-relaxed flex gap-1 items-center">
      <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
      <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
      <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
    </div>
  `;
  msgContainer.appendChild(div);
  msgContainer.scrollTop = msgContainer.scrollHeight;

  setTimeout(() => {
    const typingEl = document.getElementById('demo-chatbot-typing');
    if (typingEl) typingEl.remove();
    callback();
  }, 750);
}

// Core Chatbot Brain
function processUserResponse(text) {
  // 1. Process active flow states
  if (chatState.mode === 'quote_flow') {
    const step = quoteSteps[chatState.quoteStep];
    if (step.validate && !step.validate(text)) {
      addBotMessage(`❌ Please enter a valid value for this field. ${step.prompt}`);
      if (step.options) {
        renderChips(step.options.map(o => ({ text: o, value: o })));
      }
      return;
    }
    chatMemory[step.field] = text;
    saveChatState();
    advanceQuoteFlow();
    return;
  }

  if (chatState.mode === 'handoff_flow') {
    const step = handoffSteps[chatState.handoffStep];
    if (step.validate && !step.validate(text)) {
      addBotMessage(`❌ Please enter a valid value. ${step.prompt}`);
      return;
    }
    chatMemory[step.field] = text;
    saveChatState();
    advanceHandoffFlow();
    return;
  }

  // 2. Intent matching and general conversation logic
  const intent = detectIntent(text);
  chatState.interactionCount++;
  saveChatState();

  // Check direct conversion queries
  const isPurchaseIntent = /need uniforms|looking for supplier|need quote|need pricing|want catalog|need samples/i.test(text.toLowerCase());

  if (isPurchaseIntent) {
    addBotMessage(`🤝 I see you are looking for enterprise uniforms! Let's get started. Would you like to request a customized quotation or speak directly to our sales representatives?`);
    renderChips([
      { text: "💰 Prepare Quotation", value: "Request Quotation" },
      { text: "📞 Request Callback", value: "Request Callback" },
      { text: "❌ No thanks", value: "Cancel" }
    ]);
    return;
  }

  let responseText = "";
  let chips = [];

  const faqHandoffPrompt = `<br><br><b>Conversion Options:</b>`;
  const faqHandoffChips = [
    { text: "💰 Request Quotation", value: "Request Quotation" },
    { text: "📞 Talk to Sales", value: "Talk to Sales" },
    { text: "👥 Request Callback", value: "Request Callback" }
  ];

  switch (intent) {
    case "human_handoff":
      chatState.mode = "handoff_flow";
      saveChatState();
      advanceHandoffFlow();
      return;

    case "quotation_request":
      chatState.mode = "quote_flow";
      saveChatState();
      advanceQuoteFlow();
      return;

    case "recommendation":
      responseText = `👔 <b>UNIWEAR Product Consultant</b><br>Which industry do you need enterprise uniforms for?<br>• 🏭 Manufacturing / Factory<br>• 🏨 Hospitality / Hotels<br>• 🏥 Healthcare / Clinics<br>• 🏫 Education / Academy<br>• 👔 Corporate Offices<br>• 🎁 Corporate Gifting`;
      chips = [
        { text: "🏭 Manufacturing", value: "recommend-Manufacturing" },
        { text: "🏨 Hospitality", value: "recommend-Hospitality" },
        { text: "🏥 Healthcare", value: "recommend-Healthcare" },
        { text: "🏫 Education", value: "recommend-Education" },
        { text: "👔 Corporate", value: "recommend-Corporate" },
        { text: "🎁 Gifting", value: "recommend-Gifting" }
      ];
      break;

    case "catalog_access":
      const role = localStorage.getItem('uniwear_auth_role');
      if (role === 'client') {
        responseText = `📁 <b>UNIWEAR Catalog Library</b><br>You are logged in! You have full access to our digital catalog repository. What categories would you like to view?<br><br>• <a href="catalog.html" class="text-primary hover:underline font-bold">Download Catalog PDFs</a>`;
      } else {
        responseText = `🔒 <b>Locked Catalog Library</b><br>Our engineering catalogues are locked. Please log in to your Client Portal to download high-res files, or leave contact info to receive them via email.`;
      }
      chips = [
        { text: "🔑 Authenticate Login", value: "Login Page" },
        { text: "📞 Talk to Sales", value: "Talk to Sales" },
        { text: "👥 Request Callback", value: "Request Callback" }
      ];
      break;

    case "contact_info":
      responseText = `📞 <b>UNIWEAR Consultation HQ</b><br>• Address: No 121/A, 1st Floor, 27th Cross Road, 7th Block, Jayanagar, Bengaluru – 560070<br>• Phone: <a href="tel:+919108765831" class="text-primary font-semibold hover:underline">+91 91087 65831</a> / <a href="tel:+919845932201" class="text-primary font-semibold hover:underline">+91 98459 32201</a><br>• Sales Email: <a href="mailto:sales@uniwear.co" class="text-primary hover:underline font-semibold">sales@uniwear.co</a><br>• Support Email: <a href="mailto:connect@uniwear.co" class="text-primary hover:underline font-semibold">connect@uniwear.co</a>`;
      chips = faqHandoffChips;
      break;

    case "delivery_timeline":
      responseText = `🚚 <b>Delivery Timelines</b><br>Standard stitching and delivery schedule takes **25-30 business days** from size signoff and branding proof approval. For urgent setup schedules, emergency logistics can deliver within **14 business days** under SLA protocols.`;
      responseText += faqHandoffPrompt;
      chips = faqHandoffChips;
      break;

    case "faq_moq":
      responseText = `👕 <b>Minimum Order Quantities (MOQ)</b><br>Our manufacturing setup handles custom corporate designs. Standard MOQs:<br>• Corporate Suits, Blazers & Outerwear: **50 sets**<br>• Industrial wear, boilersuits & scrubs: **100 sets**<br>• Culinary chef jackets: **50 sets**<br>• Custom leather gifts: **50 items**`;
      responseText += faqHandoffPrompt;
      chips = faqHandoffChips;
      break;

    case "faq_branding":
      responseText = `🧵 <b>Custom Branding Options</b><br>We do in-house industrial branding:<br>• **Japanese Embroidery**: Long-staple chemical stable threads, 100+ wash durability.<br>• **Screen Printing**: Non-cracking plastisol inks.<br>• **Sublimation & Vinyl**: Ideal for athletic sports Coordinates.`;
      responseText += faqHandoffPrompt;
      chips = faqHandoffChips;
      break;

    case "faq_fabric":
      responseText = `🧬 <b>Certified Fabrics Matrix</b><br>Our Jayanagar testing lab certifies:<br>• **AeroGuard Poly-Cotton**: 65% Recycled Polyester / 35% Organic Cotton matrix.<br>• **Merino Wool Flannel**: 80% Merino Wool, luxury corporate blazers.<br>• **Egyptian Cotton Giza 85**: Tailored wrinkle-resistant shirts.`;
      responseText += faqHandoffPrompt;
      chips = faqHandoffChips;
      break;

    case "faq_sample":
      responseText = `🧪 <b>Pre-Production Sampling</b><br>Before batch stitching, we construct a prototype sample. Once you review and signoff on the sample fits and branding layouts, bulk production is initiated.`;
      responseText += faqHandoffPrompt;
      chips = faqHandoffChips;
      break;

    case "greeting":
      responseText = `👋 Hello! I am the UNIWEAR Smart Assistant. I can help recommend workwear, answer questions about fabric/MOQ, track portal orders, or prepare a custom quotation lead.`;
      chips = getContextChips();
      break;

    case "blog_inquiry":
      responseText = `📰 <b>UNIWEAR Editorial Blog</b><br>Explore our latest publications on high-performance textiles and Safety codes at <a href="blog.html" class="text-primary font-semibold hover:underline">Fabric Research Hub</a>.<br>• Topics include: <i>Science of High-Performance Textiles</i>, <i>Refinery Safety Protocols</i>, and <i>Workspace Branding Trends</i>.`;
      chips = getContextChips();
      break;

    case "order_tracking":
      // Client orders query
      const cRole = localStorage.getItem('uniwear_auth_role');
      const cEmail = localStorage.getItem('uniwear_auth_email');
      if (cRole === 'client' && cEmail) {
        const orders = JSON.parse(localStorage.getItem('uniwear_orders')) || [];
        const clientOrders = orders.filter(o => o.clientEmail === cEmail);
        if (clientOrders.length > 0) {
          let orderInfo = `📦 <b>Live Stitching Progress</b><br>`;
          clientOrders.forEach(o => {
            orderInfo += `<br>• <b>Order ${o.id}</b>: ${o.productName} (${o.volume} Sets)<br>Status: <i>${o.statusText}</i><br>Delivery Expected: <b>${o.deliveryDate}</b>`;
          });
          responseText = orderInfo;
        } else {
          responseText = `📦 <b>Order Tracking</b><br>No active stitching contracts logged under your authenticated account: <b>${cEmail}</b>.`;
        }
      } else {
        responseText = `📦 <b>Track Your Orders</b><br>Please log in to your Client Portal to see live factory status and shipping timelines.`;
        chips = [{ text: "🔑 Go to Login", value: "Login Page" }];
      }
      if (chips.length === 0) chips = getContextChips();
      break;

    case "support_request":
      const sRole = localStorage.getItem('uniwear_auth_role');
      const sEmail = localStorage.getItem('uniwear_auth_email');
      if (sRole === 'client' && sEmail) {
        const tickets = JSON.parse(localStorage.getItem('uniwear_tickets')) || [];
        const clientTickets = tickets.filter(t => t.clientEmail === sEmail);
        if (clientTickets.length > 0) {
          let ticketInfo = `💬 <b>Active Support Tickets</b><br>`;
          clientTickets.forEach(t => {
            ticketInfo += `<br>• <b>Ticket ${t.id}</b>: "${t.subject}"<br>Category: ${t.category} • Status: <b>${t.status}</b>`;
          });
          responseText = ticketInfo;
        } else {
          responseText = `💬 <b>Support Communications</b><br>No open tickets. You can open a support ticket directly inside your Customer Portal settings.`;
        }
      } else {
        responseText = `💬 <b>Customer Support Desk</b><br>Need fit sizing adjustments or stitching changes? Log in to your Portal to open a support ticket and chat with our factory supervisors.`;
        chips = [{ text: "🔑 Go to Login", value: "Login Page" }];
      }
      if (chips.length === 0) chips = getContextChips();
      break;

    case "fallback":
      // Check for raw values
      if (val === 'cancel') {
        responseText = "Quotation request cancelled. What else can I help you with today?";
        chips = getContextChips();
      } else if (val === 'login page') {
        window.location.href = "login.html";
        return;
      } else if (val.startsWith('recommend-')) {
        const selectedInd = val.split('-')[1];
        responseText = renderRecommendationResults(selectedInd);
        chips = [
          { text: "💰 Request Quotation", value: "Request Quotation" },
          { text: "📞 Talk to Sales", value: "Talk to Sales" },
          { text: "👥 Request Callback", value: "Request Callback" },
          { text: "❓ Recommendations Menu", value: "Product Recommendations" }
        ];
      } else if (val === 'dashboard insights') {
        const aRole = localStorage.getItem('uniwear_auth_role');
        if (aRole === 'admin') {
          const leads = JSON.parse(localStorage.getItem('uniwear_leads')) || [];
          const quotes = JSON.parse(localStorage.getItem('uniwear_quotations')) || [];
          const prods = JSON.parse(localStorage.getItem('uniwear_products')) || [];
          const blogs = JSON.parse(localStorage.getItem('uniwear_blogs')) || [];
          const users = JSON.parse(localStorage.getItem('uniwear_users')) || [];
          const activeCust = users.filter(u => u.role === 'Customer' && u.status === 'Active').length;

          responseText = `📊 <b>UNIWEAR Operations Insights</b><br><br>• Total leads captured: <b>${leads.length}</b><br>• Active Quotation mandates: <b>${quotes.length}</b><br>• Products in catalog registry: <b>${prods.length}</b><br>• Active customer accounts: <b>${activeCust}</b><br>• Published fabric research blogs: <b>${blogs.length}</b>`;
        } else {
          responseText = `📊 <b>Operations Dashboard</b><br>Only authenticated system administrators can access real-time dashboard analytics.`;
        }
        chips = getContextChips();
      } else if (val === 'view blog stats') {
        const aRole = localStorage.getItem('uniwear_auth_role');
        if (aRole === 'admin') {
          const blogs = JSON.parse(localStorage.getItem('uniwear_blogs')) || [];
          const drafts = blogs.filter(b => b.status === 'Draft').length;
          const pub = blogs.filter(b => b.status === 'Published').length;
          const sched = blogs.filter(b => b.status === 'Scheduled').length;
          responseText = `📈 <b>Editorial Desk Analytics</b><br><br>• Published Articles: <b>${pub}</b><br>• Draft posts: <b>${drafts}</b><br>• Scheduled posts: <b>${sched}</b><br>• Total registry entries: <b>${blogs.length}</b>`;
        } else {
          responseText = `📈 <b>Editorial Analytics</b><br>Access restricted to administrators.`;
        }
        chips = getContextChips();
      } else if (val === 'track my order' || val === 'quotation review' || val === 'view notifications') {
        const cRole = localStorage.getItem('uniwear_auth_role');
        const cEmail = localStorage.getItem('uniwear_auth_email');
        if (cRole === 'client' && cEmail) {
          if (val === 'track my order') {
            const orders = JSON.parse(localStorage.getItem('uniwear_orders')) || [];
            const clientOrders = orders.filter(o => o.clientEmail === cEmail);
            if (clientOrders.length > 0) {
              let orderInfo = `📦 <b>Stitching Pipeline</b><br>`;
              clientOrders.forEach(o => {
                orderInfo += `<br>• <b>Order ${o.id}</b>: ${o.productName}<br>Stage: ${o.statusText}<br>Handover Expected: <b>${o.deliveryDate}</b>`;
              });
              responseText = orderInfo;
            } else {
              responseText = `📦 No active orders on file for account: <b>${cEmail}</b>.`;
            }
          } else if (val === 'quotation review') {
            const quotes = JSON.parse(localStorage.getItem('uniwear_quotations')) || [];
            const clientQuotes = quotes.filter(q => q.clientEmail === cEmail);
            if (clientQuotes.length > 0) {
              const latest = clientQuotes[clientQuotes.length - 1];
              responseText = `📄 <b>Quotation Review</b><br><br>• <b>Quote ${latest.id}</b>: ${latest.productClass} (${latest.volume} Sets)<br>Quoted Value: <b>${latest.value}</b><br>Status: <span class="text-primary font-bold">${latest.status}</span>`;
            } else {
              responseText = `📄 No quotations mapped to company profile.`;
            }
          } else if (val === 'view notifications') {
            const notis = JSON.parse(localStorage.getItem('uniwear_notifications')) || [];
            const clientNotis = notis.filter(n => n.recipient === cEmail);
            if (clientNotis.length > 0) {
              let notiInfo = `🔔 <b>Recent Notifications</b><br>`;
              clientNotis.slice(-3).reverse().forEach(n => {
                notiInfo += `<br>• <b>${n.title}</b>: ${n.text} (${n.time})`;
              });
              responseText = notiInfo;
            } else {
              responseText = `🔔 Notification Center empty.`;
            }
          }
        } else {
          responseText = `🔑 Authentication required. Please navigate to login.`;
          chips = [{ text: "🔑 Go to Login", value: "Login Page" }];
        }
        if (chips.length === 0) chips = getContextChips();
      } else {
        responseText = `I apologize, I didn't fully catch that requirement. I can recommend garments, coordinate a custom quotation, look up shipping timelines, or answer standard fabric/MOQ FAQs.`;
        chips = getContextChips();
      }
      break;
  }

  // 3. Proactive Quotation Prompt Injection (Interactions Count Check)
  if (chatState.interactionCount === 4 && chatState.mode === 'chat') {
    responseText += `<br><br>💬 <i>By the way, would you like our styling and manufacturing team to prepare a customized quotation for your company?</i>`;
    chips = [
      { text: "💰 Yes, Prepare Quote", value: "Request Quotation" },
      { text: "📞 Request Callback", value: "Request Callback" },
      { text: "❌ No, thank you", value: "Cancel" }
    ];
  }

  addBotMessage(responseText);
  renderChips(chips);
}

// Render recommended items as visual cards
function renderRecommendationResults(industry) {
  let products = JSON.parse(localStorage.getItem('uniwear_products')) || defaultProducts;
  let matches = [];

  if (industry === 'Hospitality') {
    matches = products.filter(p => p.category === 'Hospitality');
  } else if (industry === 'Industrial' || industry === 'Manufacturing') {
    matches = products.filter(p => p.category === 'Industrial');
  } else if (industry === 'Corporate') {
    matches = products.filter(p => p.category === 'Corporate');
  } else if (industry === 'Education') {
    matches = products.filter(p => p.category === 'Institutional');
  } else if (industry === 'Healthcare') {
    matches = products.filter(p => p.category === 'Hospitality' && p.name.includes('Scrubs'));
  } else if (industry === 'Gifting') {
    matches = products.filter(p => p.category === 'Corporate Gifting');
  }

  if (matches.length === 0) {
    return `👔 <b>Product Recommendations</b><br>We offer high-performance workwear solutions. What specific items would you like to review?`;
  }

  let htmlResult = `👔 <b>Recommended Collections for ${industry}:</b><br>`;
  matches.slice(0, 2).forEach(p => {
    htmlResult += `
      <div class="chatbot-product-card">
        <img src="${p.img}" class="chatbot-card-img object-cover">
        <div class="p-3">
          <h5 class="font-bold text-charcoal truncate" style="font-size: 11px">${p.name}</h5>
          <p class="text-[9px] text-mutedText mt-1 line-clamp-2">${p.desc}</p>
          <div class="flex justify-between mt-2 text-[8px] text-gray-400 font-semibold font-mono">
            <span>MOQ: ${p.moq} Sets</span>
            <span>${p.gsm || ''}</span>
          </div>
          <button onclick="window.location.href='contact.html?product=' + encodeURIComponent('${p.name}')" class="w-full bg-primary hover:bg-primaryHover text-white py-1.5 rounded-lg text-[9px] font-bold transition-all uppercase tracking-wider mt-3 flex items-center justify-center gap-1 select-all">
            <i class="ri-mail-line"></i> Enquire Now
          </button>
        </div>
      </div>
    `;
  });
  return htmlResult;
}

// Guided quotation flows step by step advancing
function advanceQuoteFlow() {
  let nextIdx = -1;
  for (let i = 0; i < quoteSteps.length; i++) {
    if (!chatMemory[quoteSteps[i].field]) {
      nextIdx = i;
      break;
    }
  }

  if (nextIdx !== -1) {
    chatState.quoteStep = nextIdx;
    saveChatState();
    const step = quoteSteps[nextIdx];
    addBotMessage(step.prompt);

    if (step.options) {
      renderChips(step.options.map(o => ({ text: o, value: o })));
    } else {
      renderChips([]);
    }
  } else {
    createQuoteLead();
  }
}

function advanceHandoffFlow() {
  let nextIdx = -1;
  for (let i = 0; i < handoffSteps.length; i++) {
    if (!chatMemory[handoffSteps[i].field]) {
      nextIdx = i;
      break;
    }
  }

  if (nextIdx !== -1) {
    chatState.handoffStep = nextIdx;
    saveChatState();
    const step = handoffSteps[nextIdx];
    addBotMessage(step.prompt);
    renderChips([]);
  } else {
    createHandoffLead();
  }
}

// Leads creation systems
function createQuoteLead() {
  const qtyVal = parseInt(chatMemory.quantity) || 100;
  const lead = {
    name: chatMemory.name,
    company: chatMemory.company,
    email: chatMemory.email,
    phone: chatMemory.phone,
    category: chatMemory.product,
    volume: qtyVal,
    details: `Custom quote requirement. Customization: ${chatMemory.branding}. Expected timeline: ${chatMemory.timeline}. Delivery address: ${chatMemory.location}.`,
    stage: "New Lead",
    source: "Chatbot",
    date: new Date().toISOString().split('T')[0],
    timestamp: new Date().toLocaleString()
  };

  let leads = JSON.parse(localStorage.getItem('uniwear_leads')) || [];
  leads.push(lead);
  localStorage.setItem('uniwear_leads', JSON.stringify(leads));

  // Log Notification Alert
  let notis = JSON.parse(localStorage.getItem('uniwear_notifications')) || [];
  notis.push({
    id: Math.random(),
    recipient: "admin",
    title: "New Chatbot Quote Lead",
    text: `${chatMemory.name} from ${chatMemory.company} requested quote for ${qtyVal} sets of ${chatMemory.product}.`,
    time: "Just now"
  });
  localStorage.setItem('uniwear_notifications', JSON.stringify(notis));

  // Clear session quotes details but preserve general details for callback convenience
  chatState.mode = "chat";
  chatMemory.quantity = "";
  chatMemory.location = "";
  chatMemory.branding = "";
  chatMemory.timeline = "";
  saveChatState();

  addBotMessage(`🎉 <b>Quotation Request Submitted Successfully!</b><br><br>We have logged your lead inside the UNIWEAR system.<br><br>Summary logged:<br>• Company: ${lead.company}<br>• Volume: ${qtyVal} sets<br>• Contact Email: ${lead.email}<br><br>Our styling and manufacturing consultant will send a custom quote proposal shortly.`);
  renderContextChips();
}

function createHandoffLead() {
  const lead = {
    name: chatMemory.name,
    company: chatMemory.company,
    email: chatMemory.email,
    phone: chatMemory.phone,
    category: "Human Handoff",
    volume: 0,
    details: `Talk to Sales / Request Callback. Requirement: ${chatMemory.branding}`,
    stage: "New Lead",
    source: "Chatbot",
    date: new Date().toISOString().split('T')[0],
    timestamp: new Date().toLocaleString()
  };

  let leads = JSON.parse(localStorage.getItem('uniwear_leads')) || [];
  leads.push(lead);
  localStorage.setItem('uniwear_leads', JSON.stringify(leads));

  // Send to backend and trigger email notification (non-blocking)
  if (window.api && typeof window.api.createLead === 'function') {
    window.api.createLead(lead).catch(err => console.error("Chatbot lead submission error:", err));
  }

  // Log Notification Alert
  let notis = JSON.parse(localStorage.getItem('uniwear_notifications')) || [];
  notis.push({
    id: Math.random(),
    recipient: "admin",
    title: "Chatbot Human Handoff Request",
    text: `${chatMemory.name} from ${chatMemory.company} requested sales agent callback.`,
    time: "Just now"
  });
  localStorage.setItem('uniwear_notifications', JSON.stringify(notis));

  // Clear handoff spec
  chatState.mode = "chat";
  chatMemory.branding = "";
  saveChatState();

  addBotMessage(`📞 <b>Handoff Confirmed!</b><br><br>Your callback request has been logged successfully.<br><br>A UNIWEAR Sales Representative will contact you at <b>${chatMemory.phone}</b> or email you at <b>${chatMemory.email}</b> within 2 business hours.<br><br>Thank you for reaching out!`);
  renderContextChips();
}

// Global Init Load Call is handled inside window event DOMContentLoaded in shared.js

// =============================================================================
// PREMIUM RESPONSIVE BLOG ARTICLE MODAL SYSTEM
// =============================================================================
let modalFocusElements = [];
let lastActiveElement = null;
let hasPushedModalState = false;

function showToast(message) {
  let toast = document.getElementById('uniwear-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'uniwear-toast';
    toast.className = 'fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[10000] bg-charcoal text-white text-xs font-semibold px-5 py-3 rounded-full shadow-lg opacity-0 transition-opacity duration-300 pointer-events-none flex items-center gap-2';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="ri-checkbox-circle-fill text-green-500 text-sm"></i> <span>${message}</span>`;
  toast.classList.remove('opacity-0');
  toast.classList.add('opacity-100');
  
  setTimeout(() => {
    toast.classList.remove('opacity-100');
    toast.classList.add('opacity-0');
  }, 2500);
}

function getRelatedArticles(currentBlog, allBlogs) {
  let related = allBlogs.filter(b => b.id !== currentBlog.id && b.status === "Published" && b.category === currentBlog.category);
  if (related.length < 3) {
    const extra = allBlogs.filter(b => b.id !== currentBlog.id && b.status === "Published" && b.category !== currentBlog.category);
    related = [...related, ...extra];
  }
  return related.slice(0, 3);
}

function lockBackgroundScroll() {
  if (typeof lenisInstance !== 'undefined' && lenisInstance) {
    lenisInstance.stop();
  }
  document.documentElement.classList.add('overflow-hidden');
  document.body.classList.add('overflow-hidden');
}

function unlockBackgroundScroll() {
  document.documentElement.classList.remove('overflow-hidden');
  document.body.classList.remove('overflow-hidden');
  if (typeof lenisInstance !== 'undefined' && lenisInstance) {
    lenisInstance.start();
  }
}

function handleModalKeyDown(e) {
  if (e.key === 'Tab') {
    if (modalFocusElements.length === 0) return;
    const firstEl = modalFocusElements[0];
    const lastEl = modalFocusElements[modalFocusElements.length - 1];
    
    if (e.shiftKey) { // Shift + Tab
      if (document.activeElement === firstEl) {
        lastEl.focus();
        e.preventDefault();
      }
    } else { // Tab
      if (document.activeElement === lastEl) {
        firstEl.focus();
        e.preventDefault();
      }
    }
  } else if (e.key === 'Escape') {
    closeBlogArticleModal(true);
  } else if (e.key === 'ArrowLeft') {
    if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      const prevBtn = document.getElementById('modal-blog-prev');
      if (prevBtn) prevBtn.click();
    }
  } else if (e.key === 'ArrowRight') {
    if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      const nextBtn = document.getElementById('modal-blog-next');
      if (nextBtn) nextBtn.click();
    }
  }
}

function initPremiumBlogModal() {
  if (document.getElementById('premium-blog-modal')) return;
  
  const modalHTML = `
  <div id="premium-blog-modal" data-lenis-prevent class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-md hidden opacity-0 transition-opacity duration-300 pointer-events-none" role="dialog" aria-modal="true" aria-labelledby="modal-blog-title">
    <!-- Modal Card -->
    <div id="premium-blog-card" data-lenis-prevent class="relative w-full max-w-4xl bg-white border border-lightBorder rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] transform scale-95 transition-all duration-300 opacity-0 outline-none" tabindex="-1">
      
      <!-- Floating Close Button -->
      <button id="modal-blog-close" class="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md border border-lightBorder flex items-center justify-center text-charcoal hover:bg-primary hover:text-white hover:scale-105 transition-all duration-200" aria-label="Close modal">
        <i class="ri-close-line text-xl"></i>
      </button>
      
      <!-- Left Side: Featured Image (Desktop: 40%, Mobile: Top Banner) -->
      <div id="modal-blog-image-container" class="md:w-2/5 w-full bg-lightCard relative overflow-hidden flex-shrink-0 min-h-[220px] md:min-h-0">
        <img id="modal-blog-image" src="" alt="" class="w-full h-full object-cover stagger-item">
        <!-- Category Badge overlay -->
        <span id="modal-blog-category-badge" class="absolute bottom-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md stagger-item">Category</span>
      </div>
      
      <!-- Right Side: Scrollable Content -->
      <div id="modal-blog-scroll-body" data-lenis-prevent class="md:w-3/5 w-full flex flex-col overflow-y-auto bg-white">
        <div class="p-6 sm:p-8 md:p-10 flex-grow space-y-6">
          
          <!-- Header Info -->
          <div class="space-y-3 stagger-item">
            <div class="flex items-center gap-3 text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
              <span id="modal-blog-author">Author</span>
              <span>•</span>
              <span id="modal-blog-date">Date</span>
              <span>•</span>
              <span id="modal-blog-reading-time">5 min read</span>
            </div>
            
            <h2 id="modal-blog-title" class="font-heading text-2xl sm:text-3xl font-bold text-charcoal leading-tight">Blog Title</h2>
          </div>
          
          <!-- Action Row (Share Button) -->
          <div class="flex items-center justify-between border-y border-lightBorder py-3 stagger-item">
            <span class="text-xs text-mutedText font-semibold">UNIWEAR Textile Innovation Hub</span>
            <button id="modal-blog-share" class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal hover:text-primary transition-colors py-1.5 px-3.5 rounded-full hover:bg-lightCard border border-transparent hover:border-lightBorder">
              <i class="ri-share-line text-sm"></i> Share Article
            </button>
          </div>
          
          <!-- Article Body -->
          <div id="modal-blog-body" class="prose max-w-none text-charcoal/80 text-sm leading-relaxed space-y-4 stagger-item">
            <!-- Content dynamic -->
          </div>
          
          <!-- Next/Prev Navigation Buttons -->
          <div class="flex items-center justify-between border-t border-lightBorder pt-6 mt-8 stagger-item">
            <button id="modal-blog-prev" class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal hover:text-primary transition-all hover:-translate-x-1">
              <i class="ri-arrow-left-line text-base"></i> Previous Post
            </button>
            <button id="modal-blog-next" class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal hover:text-primary transition-all hover:translate-x-1">
              Next Post <i class="ri-arrow-right-line text-base"></i>
            </button>
          </div>
          
          <!-- Related Stories Section -->
          <div class="pt-8 border-t border-lightBorder space-y-4 stagger-item">
            <h3 class="font-heading text-lg font-bold text-charcoal">Related Articles</h3>
            <div id="modal-blog-related" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <!-- Content dynamic -->
            </div>
          </div>
          
        </div>
      </div>
      
    </div>
  </div>
  `;
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = modalHTML.trim();
  const modalEl = tempDiv.firstChild;
  document.body.appendChild(modalEl);
  
  // Custom transition styling
  const style = document.createElement('style');
  style.textContent = `
    #premium-blog-modal {
      transition: opacity 0.3s ease-out;
    }
    #premium-blog-card {
      transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease-out;
    }
    .stagger-item {
      opacity: 0;
      transform: translateY(12px);
      transition: opacity 0.4s ease-out, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .stagger-item.animate-in {
      opacity: 1;
      transform: translateY(0);
    }
    #premium-blog-modal.opacity-100 {
      opacity: 1;
    }
    #premium-blog-card.scale-100 {
      transform: scale(1);
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
  
  // Backdrop and Close listeners
  document.getElementById('modal-blog-close').addEventListener('click', () => closeBlogArticleModal(true));
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) {
      closeBlogArticleModal(true);
    }
  });
  
  // Share listener
  document.getElementById('modal-blog-share').addEventListener('click', () => {
    const activeBlogId = modalEl.getAttribute('data-blog-id');
    const blogs = JSON.parse(localStorage.getItem('uniwear_blogs')) || defaultBlogs;
    const blog = blogs.find(b => b.id == activeBlogId);
    if (blog) {
      const url = window.location.origin + window.location.pathname + '#article-' + blog.slug;
      navigator.clipboard.writeText(url).then(() => {
        showToast("Article link copied to clipboard!");
      }).catch(err => console.error("Clipboard copy failed:", err));
    }
  });

  // Handle URL hash on initial load
  setTimeout(checkUrlHashAndOpenModal, 400);

  // Listen for history popstate events
  window.addEventListener('popstate', (e) => {
    const hash = window.location.hash;
    const modal = document.getElementById('premium-blog-modal');
    const isOpen = modal && !modal.classList.contains('hidden');
    
    if (hash.startsWith('#article-')) {
      const slug = hash.replace('#article-', '');
      const blogs = JSON.parse(localStorage.getItem('uniwear_blogs')) || defaultBlogs;
      const blog = blogs.find(b => b.slug === slug);
      if (blog) {
        openBlogArticleModal(blog.id, false);
      }
    } else {
      if (isOpen) {
        closeBlogArticleModal(false);
      }
    }
  });
}

function checkUrlHashAndOpenModal() {
  const hash = window.location.hash;
  if (hash.startsWith('#article-')) {
    const slug = hash.replace('#article-', '');
    const blogs = JSON.parse(localStorage.getItem('uniwear_blogs')) || defaultBlogs;
    const blog = blogs.find(b => b.slug === slug);
    if (blog) {
      openBlogArticleModal(blog.id, false);
    }
  }
}

function openBlogArticleModal(blogId, pushToHistory = true) {
  initPremiumBlogModal();
  
  const modalEl = document.getElementById('premium-blog-modal');
  const cardEl = document.getElementById('premium-blog-card');
  if (!modalEl || !cardEl) return;
  
  const blogs = JSON.parse(localStorage.getItem('uniwear_blogs')) || defaultBlogs;
  const blog = blogs.find(b => b.id == blogId);
  if (!blog) return;
  
  // Record previous focus element
  if (modalEl.classList.contains('hidden')) {
    lastActiveElement = document.activeElement;
  }
  
  modalEl.setAttribute('data-blog-id', blog.id);
  
  // Update fields
  document.getElementById('modal-blog-title').innerText = blog.title;
  document.getElementById('modal-blog-author').innerText = `By ${blog.author}`;
  document.getElementById('modal-blog-date').innerText = blog.date;
  document.getElementById('modal-blog-reading-time').innerText = blog.readingTime;
  
  // Set images and slider carousel
  const imgContainer = document.getElementById('modal-blog-image-container');
  if (imgContainer) {
    const images = blog.images && blog.images.length > 0 ? blog.images : [blog.featuredImage || blog.img];
    if (images.length > 1) {
      let currentImgIdx = 0;
      imgContainer.innerHTML = `
        <img id="modal-blog-image" src="${images[currentImgIdx]}" alt="${blog.title}" class="w-full h-full object-cover stagger-item">
        <span id="modal-blog-category-badge" class="absolute bottom-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md stagger-item">${blog.category}</span>
        
        <!-- Image Slide Controls -->
        <button id="modal-blog-img-prev" class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-charcoal hover:text-primary flex items-center justify-center shadow-md transition-all duration-200 z-10 focus:outline-none" aria-label="Previous image">
          <i class="ri-arrow-left-s-line text-lg"></i>
        </button>
        <button id="modal-blog-img-next" class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-charcoal hover:text-primary flex items-center justify-center shadow-md transition-all duration-200 z-10 focus:outline-none" aria-label="Next image">
          <i class="ri-arrow-right-s-line text-lg"></i>
        </button>
        
        <!-- Dot Indicators -->
        <div class="absolute bottom-4 right-4 flex items-center gap-1.5 z-10">
          ${images.map((_, i) => `<span class="modal-blog-dot w-2 h-2 rounded-full bg-white/50 transition-all duration-200 cursor-pointer ${i === 0 ? 'bg-white scale-125' : ''}" data-idx="${i}"></span>`).join('')}
        </div>
      `;
      
      const updateCarousel = (newIdx) => {
        currentImgIdx = (newIdx + images.length) % images.length;
        const img = document.getElementById('modal-blog-image');
        if (img) img.src = images[currentImgIdx];
        
        imgContainer.querySelectorAll('.modal-blog-dot').forEach((dot, idx) => {
          if (idx === currentImgIdx) {
            dot.classList.remove('bg-white/50');
            dot.classList.add('bg-white', 'scale-125');
          } else {
            dot.classList.remove('bg-white', 'scale-125');
            dot.classList.add('bg-white/50');
          }
        });
      };
      
      imgContainer.querySelector('#modal-blog-img-prev').addEventListener('click', (e) => {
        e.stopPropagation();
        updateCarousel(currentImgIdx - 1);
      });
      imgContainer.querySelector('#modal-blog-img-next').addEventListener('click', (e) => {
        e.stopPropagation();
        updateCarousel(currentImgIdx + 1);
      });
      
      imgContainer.querySelectorAll('.modal-blog-dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetIdx = parseInt(e.target.getAttribute('data-idx'));
          updateCarousel(targetIdx);
        });
      });
    } else {
      imgContainer.innerHTML = `
        <img id="modal-blog-image" src="${images[0]}" alt="${blog.title}" class="w-full h-full object-cover stagger-item">
        <span id="modal-blog-category-badge" class="absolute bottom-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md stagger-item">${blog.category}</span>
      `;
    }
  }
  
  // Safe paragraph formatting for article body
  const bodyEl = document.getElementById('modal-blog-body');
  bodyEl.innerHTML = '';
  const paragraphs = (blog.content || "").split(/\n\s*\n/);
  paragraphs.forEach(paraText => {
    if (paraText.trim()) {
      const p = document.createElement('p');
      p.className = 'mb-4 leading-relaxed';
      p.innerText = paraText.trim();
      bodyEl.appendChild(p);
    }
  });
  
  // Next & Prev button logic
  const publishedBlogs = blogs.filter(b => b.status === "Published");
  const currentIndex = publishedBlogs.findIndex(b => b.id === blog.id);
  const prevBtn = document.getElementById('modal-blog-prev');
  const nextBtn = document.getElementById('modal-blog-next');
  
  if (currentIndex !== -1) {
    const prevBlog = publishedBlogs[(currentIndex - 1 + publishedBlogs.length) % publishedBlogs.length];
    const nextBlog = publishedBlogs[(currentIndex + 1) % publishedBlogs.length];
    
    prevBtn.onclick = () => openBlogArticleModal(prevBlog.id, true);
    nextBtn.onclick = () => openBlogArticleModal(nextBlog.id, true);
  }
  
  // Render Related Stories
  const relatedContainer = document.getElementById('modal-blog-related');
  relatedContainer.innerHTML = '';
  const related = getRelatedArticles(blog, publishedBlogs);
  related.forEach(post => {
    const card = document.createElement('div');
    card.className = "bg-lightCard rounded-xl overflow-hidden border border-lightBorder hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col";
    card.setAttribute('onclick', `openBlogArticleModal(${post.id})`);
    card.innerHTML = `
      <div class="h-20 overflow-hidden relative">
        <img src="${post.featuredImage || post.img}" alt="${post.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
      </div>
      <div class="p-3 flex-grow flex flex-col justify-between">
        <div>
          <span class="text-[8px] uppercase tracking-wider text-primary font-bold">${post.category}</span>
          <h4 class="font-heading text-[11px] font-bold text-charcoal mt-0.5 line-clamp-2 group-hover:text-primary transition-colors leading-tight">${post.title}</h4>
        </div>
        <span class="text-[8px] text-gray-400 mt-1 block">${post.readingTime}</span>
      </div>
    `;
    relatedContainer.appendChild(card);
  });
  
  // Push state to browser history
  if (pushToHistory) {
    history.pushState({ isBlogModal: true, blogId: blog.id }, '', '#article-' + blog.slug);
    hasPushedModalState = true;
  }
  
  // Reset scrolling of content pane
  document.getElementById('modal-blog-scroll-body').scrollTop = 0;
  
  // Lock background layout & pause lenis
  lockBackgroundScroll();
  
  // Animate Open
  modalEl.classList.remove('hidden');
  modalEl.offsetWidth; // Force paint reflow
  
  modalEl.classList.add('opacity-100', 'pointer-events-auto');
  cardEl.classList.add('scale-100', 'opacity-100');
  
  // Sequential load stagger animation
  const staggerItems = modalEl.querySelectorAll('.stagger-item');
  staggerItems.forEach((item, idx) => {
    item.classList.remove('animate-in');
    setTimeout(() => {
      item.classList.add('animate-in');
    }, idx * 60 + 100);
  });
  
  // Prepare Focus Trap Elements
  const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  modalFocusElements = Array.from(modalEl.querySelectorAll(focusableSelectors)).filter(el => {
    return el.offsetWidth > 0 && el.offsetHeight > 0;
  });
  
  window.addEventListener('keydown', handleModalKeyDown);
  
  // Focus the close button
  document.getElementById('modal-blog-close').focus();
}

function closeBlogArticleModal(triggerHistoryBack = true) {
  const modalEl = document.getElementById('premium-blog-modal');
  const cardEl = document.getElementById('premium-blog-card');
  if (!modalEl || !cardEl || modalEl.classList.contains('hidden')) return;
  
  window.removeEventListener('keydown', handleModalKeyDown);
  
  modalEl.classList.remove('opacity-100', 'pointer-events-auto');
  cardEl.classList.remove('scale-100', 'opacity-100');
  
  const staggerItems = modalEl.querySelectorAll('.stagger-item');
  staggerItems.forEach(item => item.classList.remove('animate-in'));
  
  unlockBackgroundScroll();
  
  if (triggerHistoryBack) {
    if (hasPushedModalState) {
      history.back();
      hasPushedModalState = false;
    } else {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }
  
  setTimeout(() => {
    if (!modalEl.classList.contains('opacity-100')) {
      modalEl.classList.add('hidden');
      if (lastActiveElement) {
        lastActiveElement.focus();
        lastActiveElement = null;
      }
    }
  }, 300);
}

// Expose open/close globally
window.openBlogArticleModal = openBlogArticleModal;
window.closeBlogArticleModal = closeBlogArticleModal;

// ─── Dynamic CMS Content Injector ─────────────────────────────────────────────
async function initDynamicPageContent() {
  try {
    if (!window.api || !window.api.getSettings) return;

    // Fetch dynamic settings from API
    const res = await window.api.getSettings().catch(() => null);
    const settings = res && res.data ? res.data : {};

    // 1. Dynamic Phone & Contact Updates
    const phoneStr = settings.phone || '+91 80 2658 0000';
    const emailStr = settings.supportEmail || 'connect@uniwear.co';
    const addressStr = settings.address || 'No 121/A, 1st Floor, 27th Cross Road, 7th Block, Jayanagar, Bengaluru – 560070';
    const foundingYear = settings.foundingYear || '1998';
    const partnerName = settings.managingPartner || 'Suresh H. A.';

    // Inject phone links across header/footer
    document.querySelectorAll('[data-bind="company-phone"]').forEach(el => {
      el.textContent = phoneStr;
      if (el.tagName === 'A') el.href = `tel:${phoneStr.split(',')[0].replace(/[^0-9+]/g, '')}`;
    });
    document.querySelectorAll('[data-bind="company-email"]').forEach(el => {
      el.textContent = emailStr;
      if (el.tagName === 'A') el.href = `mailto:${emailStr}`;
    });
    document.querySelectorAll('[data-bind="company-address"]').forEach(el => {
      el.textContent = addressStr;
    });
    document.querySelectorAll('[data-bind="founding-year"]').forEach(el => {
      el.textContent = foundingYear;
    });
    document.querySelectorAll('[data-bind="managing-partner"]').forEach(el => {
      el.textContent = partnerName;
    });

    // 2. Dynamic Hero Content (if on homepage and hero element exists)
    if (settings.homepageHero && document.querySelector('.hero-section')) {
      const hero = settings.homepageHero;
      const h1 = document.querySelector('.hero-section h1');
      if (h1 && hero.title) h1.innerHTML = hero.title.replace('Your Premium', '<span class="text-reveal-wrap"><span class="hero-reveal block">Your Premium</span></span>').replace('Workwear Partner', '<span class="text-reveal-wrap"><span class="hero-reveal block text-primary">Workwear Partner</span></span>');
      const p = document.querySelector('.hero-section p');
      if (p && hero.subtitle) p.textContent = hero.subtitle;
    }

    // 3. Inject Floating WhatsApp Button & Sticky Quote CTA if not present
    if (!document.getElementById('floating-whatsapp-btn')) {
      const waBtn = document.createElement('a');
      waBtn.id = 'floating-whatsapp-btn';
      waBtn.href = settings.socialLinks?.whatsapp || 'https://wa.me/919108765831';
      waBtn.target = '_blank';
      waBtn.rel = 'noopener';
      waBtn.className = 'fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110';
      waBtn.innerHTML = '<i class="ri-whatsapp-line text-3xl"></i>';
      waBtn.title = 'Chat on WhatsApp';
      document.body.appendChild(waBtn);
    }

    // 4. Sticky Request Quote Bar (Removed per user directive)

    // 5. Dynamic Client Logos
    if (window.api.getClientLogos && document.getElementById('client-logos-container')) {
      const logoRes = await window.api.getClientLogos({ active: 'true' }).catch(() => null);
      if (logoRes && logoRes.data && logoRes.data.length > 0) {
        const container = document.getElementById('client-logos-container');
        container.innerHTML = logoRes.data.map(l => `
          <div class="p-4 bg-white rounded-xl border border-lightBorder flex items-center justify-center shadow-sm hover:shadow-md transition-shadow h-20">
            <img src="${l.logoUrl}" alt="${l.name}" class="max-h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all">
          </div>
        `).join('');
      }
    }

  } catch (e) {
    console.error('[initDynamicPageContent error]', e.message);
  }
}

// ─── Premium Minimal Cursor & Interaction System ─────────────────────────────
function initCustomCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 1024 || ('ontouchstart' in window || navigator.maxTouchPoints > 0)) return;
  if (document.querySelector('.custom-cursor-dot')) return;

  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';
  
  const ring = document.createElement('div');
  ring.className = 'custom-cursor-ring';

  const spotlight = document.createElement('div');
  spotlight.className = 'hero-cursor-spotlight';

  document.body.appendChild(dot);
  document.body.appendChild(ring);
  document.body.appendChild(spotlight);
  document.body.classList.add('custom-cursor-enabled');

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  let isHidden = false;
  let isMouseDown = false;
  let activeHeading = null;

  function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }

  function render() {
    ringX = lerp(ringX, mouseX, 0.22);
    ringY = lerp(ringY, mouseY, 0.22);

    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

    const heroElem = document.querySelector('section.hero-section') || document.querySelector('.hero-bg-glow');
    if (heroElem) {
      const heroRect = heroElem.getBoundingClientRect();
      if (mouseY >= heroRect.top && mouseY <= heroRect.bottom) {
        spotlight.style.opacity = '1';
        spotlight.style.background = `radial-gradient(circle 350px at ${mouseX}px ${mouseY}px, rgba(185, 28, 28, 0.05) 0%, rgba(255, 255, 255, 0) 75%)`;
      } else {
        spotlight.style.opacity = '0';
      }
    }

    requestAnimationFrame(render);
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (ringX === -100) {
      ringX = mouseX;
      ringY = mouseY;
    }

    if (isHidden) {
      isHidden = false;
      dot.classList.remove('cursor-hidden');
      ring.classList.remove('cursor-hidden');
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    isHidden = true;
    dot.classList.add('cursor-hidden');
    ring.classList.add('cursor-hidden');
    spotlight.style.opacity = '0';
  });

  window.addEventListener('mousedown', () => {
    isMouseDown = true;
    dot.classList.add('cursor-active');
    ring.classList.add('cursor-active');
  });

  window.addEventListener('mouseup', () => {
    isMouseDown = false;
    dot.classList.remove('cursor-active');
    ring.classList.remove('cursor-active');
  });

  const textInputSelector = 'input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="number"], input[type="tel"], textarea, [contenteditable="true"]';
  const interactiveSelector = 'button, .btn, a, [role="button"], input[type="submit"], input[type="button"], .card, article, .hover-lift, .swatch-btn, .step-btn, select';
  const headingTextSelector = 'h1, h2, h3, h4, .hero-title-accent';

  document.addEventListener('mouseover', (e) => {
    const target = e.target;
    if (!target || !target.closest) return;

    if (target.closest(textInputSelector)) {
      isHidden = true;
      dot.classList.add('cursor-hidden');
      ring.classList.add('cursor-hidden');
      return;
    }

    if (target.closest(interactiveSelector)) {
      ring.classList.add('ring-visible');
    }

    const heading = target.closest(headingTextSelector);
    if (heading) {
      activeHeading = heading;
      heading.classList.add('text-hover-reactive');
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target;
    if (!target || !target.closest) return;

    if (target.closest(textInputSelector)) {
      isHidden = false;
      dot.classList.remove('cursor-hidden');
      ring.classList.remove('cursor-hidden');
    }

    if (target.closest(interactiveSelector)) {
      ring.classList.remove('ring-visible');
    }

    if (activeHeading && target.closest(headingTextSelector)) {
      activeHeading.classList.remove('text-hover-reactive');
      activeHeading = null;
    }
  });

  render();
}

document.addEventListener('DOMContentLoaded', () => {
  initDynamicPageContent();
  initCustomCursor();
});







