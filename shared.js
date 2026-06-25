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
    img: "industrial_uniforms_mockup.png",
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
    img: "corporate_uniforms_mockup.png",
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
    img: "hospitality_uniforms_mockup.png",
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
    img: "institutional_uniforms_mockup.png",
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
    img: "corporate_gifting_mockup.png",
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
    img: "corporate_gifting_mockup.png",
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
    featured: true,
    status: "Published"
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
    featured: false,
    status: "Published"
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
    featured: false,
    status: "Published"
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
    logoUrl: "corporate_blazer_detail.png",
    date: "2026-06-18",
    status: "In Prototyping"
  },
  {
    id: "UW-SMP-413",
    clientEmail: "client2@uniwear.co",
    productName: "Executive Wool Blazer",
    specs: "Silver embroidery on pocket crest with custom brand insignia.",
    logoUrl: "corporate_blazer_detail.png",
    date: "2026-06-15",
    status: "Approved"
  },
  {
    id: "UW-SMP-414",
    clientEmail: "client3@uniwear.co",
    productName: "Oxford Cotton Shirt",
    specs: "Button-down collar reinforcement, logo on cuffs.",
    logoUrl: "corporate_blazer_detail.png",
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
    --card-bg: #F9FAFB;
    --text-color: #111827;
    --muted-color: #4B5563;
    --border-color: rgba(0, 0, 0, 0.08);
  }

  html[data-theme="dark"] {
    --bg-color: #0B0F19;
    --card-bg: #111827;
    --text-color: #FFFFFF;
    --muted-color: #9CA3AF;
    --border-color: rgba(255, 255, 255, 0.08);
  }

  img {
    transition: filter 0.3s ease-in-out;
  }

  /* Dark mode overrides for Tailwind static colors */
  html[data-theme="dark"] body {
    background-color: var(--bg-color) !important;
    color: var(--text-color) !important;
  }
  
  html[data-theme="dark"] img:not([src*="logo-icon"]):not([src*="logo.svg"]) {
    filter: brightness(0.8) contrast(1.02);
  }
  
  html[data-theme="dark"] .bg-white {
    background-color: var(--card-bg) !important;
  }
  
  html[data-theme="dark"] .bg-lightBg {
    background-color: var(--bg-color) !important;
  }
  
  html[data-theme="dark"] .bg-lightCard {
    background-color: var(--card-bg) !important;
  }
  
  html[data-theme="dark"] .text-charcoal {
    color: var(--text-color) !important;
  }
  
  html[data-theme="dark"] .text-mutedText {
    color: var(--muted-color) !important;
  }
  
  html[data-theme="dark"] .border-lightBorder {
    border-color: var(--border-color) !important;
  }

  html[data-theme="dark"] input,
  html[data-theme="dark"] select,
  html[data-theme="dark"] textarea {
    background-color: #0B0F19 !important;
    color: #FFFFFF !important;
    border-color: rgba(255, 255, 255, 0.15) !important;
  }
  
  html[data-theme="dark"] input:focus,
  html[data-theme="dark"] select:focus,
  html[data-theme="dark"] textarea:focus {
    border-color: #B91C1C !important;
  }
  
  html[data-theme="dark"] .glass-nav {
    background: rgba(11, 15, 25, 0.85) !important;
    border-bottom-color: rgba(255, 255, 255, 0.08) !important;
  }
  
  html[data-theme="dark"] .glass-card {
    background: rgba(17, 24, 39, 0.7) !important;
    border-color: rgba(255, 255, 255, 0.08) !important;
  }

  /* Tables Dark Mode */
  html[data-theme="dark"] table thead tr {
    background-color: #0B0F19 !important;
  }
  html[data-theme="dark"] table tbody tr {
    border-bottom-color: rgba(255, 255, 255, 0.08) !important;
  }
  html[data-theme="dark"] table tbody tr:hover {
    background-color: rgba(255, 255, 255, 0.02) !important;
  }

  /* Chatbot window Dark Mode */
  html[data-theme="dark"] #demo-chatbot-window {
    background-color: #111827 !important;
    border-color: rgba(255, 255, 255, 0.08) !important;
  }
  html[data-theme="dark"] #demo-chatbot-messages {
    background-color: #0B0F19 !important;
  }
  html[data-theme="dark"] .chat-msg-bubble.bot {
    background-color: #111827 !important;
    color: #FFFFFF !important;
    border-color: rgba(255, 255, 255, 0.08) !important;
  }
  html[data-theme="dark"] .chat-chip {
    background-color: #111827 !important;
    border-color: rgba(255, 255, 255, 0.1) !important;
    color: #9CA3AF !important;
  }
  html[data-theme="dark"] .chat-chip:hover {
    background-color: rgba(185, 28, 28, 0.1) !important;
    border-color: #B91C1C !important;
    color: #FFFFFF !important;
  }
  html[data-theme="dark"] #demo-chatbot-window form,
  html[data-theme="dark"] #demo-chatbot-chips {
    background-color: #111827 !important;
    border-top-color: rgba(255, 255, 255, 0.08) !important;
  }
  html[data-theme="dark"] #demo-chatbot-input {
    background-color: #0B0F19 !important;
    color: #FFFFFF !important;
    border-color: rgba(255, 255, 255, 0.08) !important;
  }
  html[data-theme="dark"] .chatbot-product-card {
    background-color: #111827 !important;
    border-color: rgba(255, 255, 255, 0.08) !important;
  }
  html[data-theme="dark"] .chatbot-product-card h5 {
    color: #FFFFFF !important;
  }

  /* Portals sidebars, headers, cards */
  html[data-theme="dark"] aside, 
  html[data-theme="dark"] header {
    background-color: #111827 !important;
    border-color: rgba(255, 255, 255, 0.08) !important;
  }
  
  html[data-theme="dark"] .bg-gradient-to-r.from-red-50 {
    background-image: linear-gradient(to right, rgba(185, 28, 28, 0.1), transparent) !important;
    border-color: rgba(185, 28, 28, 0.25) !important;
  }

  /* Specific details cards & configuration sections */
  html[data-theme="dark"] .bg-lightCard .bg-white {
    background-color: #0B0F19 !important;
  }
  
  html[data-theme="dark"] select option {
    background-color: #111827 !important;
    color: #FFFFFF !important;
  }

  html[data-theme="dark"] #cust-notifications-popover,
  html[data-theme="dark"] #cust-notifications-popover .bg-lightCard {
    background-color: #111827 !important;
  }
  
  /* Ticket chat active screen */
  html[data-theme="dark"] #ticket-chat-active,
  html[data-theme="dark"] #ticket-chat-active form,
  html[data-theme="dark"] #ticket-chat-active .bg-lightCard {
    background-color: #111827 !important;
  }
  html[data-theme="dark"] #chat-messages-scroll-area {
    background-color: #0B0F19 !important;
  }


  /* Public Mobile navigation drawer background */
  html[data-theme="dark"] #mobile-nav {
    background-color: rgba(11, 15, 25, 0.98) !important;
  }

  /* Admin Dashboard cards */
  html[data-theme="dark"] .admin-portal-view .bg-white {
    background-color: #111827 !important;
  }

  /* Remove Page Transition Overlays */
  #transition-overlay {
    display: none !important;
  }
`;
document.head.appendChild(themeStyleEl);

function initTheme() {
  const currentSavedTheme = localStorage.getItem('uniwear_theme') || 'light';
  updateThemeUI(currentSavedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('uniwear_theme', newTheme);
  updateThemeUI(newTheme);
}

function updateThemeUI(theme) {
  const toggles = document.querySelectorAll('.theme-toggle-btn');
  toggles.forEach(btn => {
    if (theme === 'dark') {
      btn.innerHTML = '<i class="ri-sun-line text-lg"></i>';
      btn.title = 'Switch to Light Mode';
    } else {
      btn.innerHTML = '<i class="ri-moon-line text-lg"></i>';
      btn.title = 'Switch to Dark Mode';
    }
  });
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
    const cart = getStorage('uniwear_cart', []);
    badge.innerText = cart.length;
  }
}

function addToSampleCart(prodId) {
  let products = getStorage('uniwear_products', defaultProducts);
  let cart = getStorage('uniwear_cart', []);
  const prod = products.find(p => p.id === prodId);

  if (!prod) return;

  if (cart.some(item => item.id === prodId)) {
    alert("This product is already added to your sample request basket.");
    return;
  }

  cart.push(prod);
  setStorage('uniwear_cart', cart);
  updateCartCountBadge();

  // Update cart drawer if it is on the current page
  if (typeof renderCartDrawer === 'function') {
    renderCartDrawer();
  }
  toggleSampleDrawer(true);
}

function removeSampleCartItem(prodId) {
  let cart = getStorage('uniwear_cart', []);
  cart = cart.filter(item => item.id !== prodId);
  setStorage('uniwear_cart', cart);
  updateCartCountBadge();

  if (typeof renderCartDrawer === 'function') {
    renderCartDrawer();
  }
}

function toggleSampleDrawer(show) {
  const drawer = document.getElementById('sample-request-drawer');
  if (!drawer) return;
  if (show) {
    drawer.classList.remove('hidden');
    gsap.to(drawer, { x: 0, duration: 0.4, ease: "power2.out" });
  } else {
    gsap.to(drawer, { x: "100%", duration: 0.4, ease: "power2.in", onComplete: () => drawer.classList.add('hidden') });
  }
}

function handleSampleCheckout() {
  let cart = getStorage('uniwear_cart', []);
  if (cart.length === 0) {
    alert("Please add items to sample first.");
    return;
  }
  alert("Sample request successfully logged! Our design styling consultant will contact you shortly.");
  setStorage('uniwear_cart', []);
  updateCartCountBadge();
  if (typeof renderCartDrawer === 'function') {
    renderCartDrawer();
  }
  toggleSampleDrawer(false);
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
    document.querySelectorAll('img[src*="logo-icon.svg"]').forEach(el => {
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
    document.querySelectorAll('img[src*="logo-icon.svg"]').forEach(el => {
      el.src = "logo-icon.svg";
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
      el.href = settings.logoUrl || "logo-icon.svg";
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
          <button onclick="window.addToSampleCart(${p.id})" class="w-full bg-primary hover:bg-primaryHover text-white py-1.5 rounded-lg text-[9px] font-bold transition-all uppercase tracking-wider mt-3 flex items-center justify-center gap-1 select-all">
            <i class="ri-add-line"></i> Add Sample Basket
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


