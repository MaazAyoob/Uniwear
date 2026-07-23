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
  }
];

const defaultLeads = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
    name: "Sunita Reddy",
    company: "Apollo Clinics",
    email: "client18@uniwear.co",
    phone: "+91 91234 56789",
    category: "Hospitality Uniforms",
    volume: 600,
    details: "Negotiating cotton blend ratios and custom sleeves.",
    stage: "Negotiation",
    date: "2026-06-13"
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
    statusStep: 3,
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
  }
];

const defaultNotifications = [
  { id: 1, recipient: "client@uniwear.co", title: "Quotation Approved", text: "UW-Quote-721 for 1,200 blazers approved. Sample production starting.", time: "2 hours ago" },
  { id: 2, recipient: "admin", title: "New Lead Captured", text: "Amit Sharma from Infosys Bengaluru registered as a corporate uniform inquiry.", time: "3 hours ago" }
];

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

const defaultCatalogs = [
  {
    title: "Safety Workwear Catalog",
    slug: "safety-workwear-catalog",
    category: "Industrial & Engineering",
    description: "Detailed specifications for flame-retardant aramid overalls, electrostatic discharge (ESD) shirts, high-visibility winter jackets, and tear-resistant mechanical trousers.",
    img: "industrial_uniforms_mockup.png",
    format: "PDF Brochure",
    pages: 48,
    size: "8.4 MB",
    displayOrder: 1,
    status: "Publish"
  },
  {
    title: "Bespoke Executive Weaves",
    slug: "bespoke-executive-weaves",
    category: "Corporate & Executive",
    description: "Executive suits, wool coordinate trousers, custom logo embroidery guidelines, breathability index sheets, and colorway customization guides.",
    img: "corporate_uniforms_mockup.png",
    format: "PDF Brochure",
    pages: 36,
    size: "6.2 MB",
    displayOrder: 2,
    status: "Publish"
  },
  {
    title: "Five-Star Culinary Outfits",
    slug: "five-star-culinary-outfits",
    category: "Hospitality & Culinary",
    description: "Ergonomic chef jackets, anti-stain canvas aprons, front-desk coordinates, housekeeping tunics, and thermoregulator backing systems.",
    img: "hospitality_uniforms_mockup.png",
    format: "PDF Brochure",
    pages: 42,
    size: "7.8 MB",
    displayOrder: 3,
    status: "Publish"
  },
  {
    title: "Collegiate Uniform Directory",
    slug: "collegiate-uniform-directory",
    category: "Institutional & Academy",
    description: "High-durability school blazers, sports coordinate tracksuits, kids playground-safe coordinates, and anti-pilling test certifications.",
    img: "institutional_uniforms_mockup.png",
    format: "PDF Brochure",
    pages: 32,
    size: "5.4 MB",
    displayOrder: 4,
    status: "Publish"
  },
  {
    title: "Executive Accessories Lookbook",
    slug: "executive-accessories-lookbook",
    category: "Corporate Gifting",
    description: "Luxury leather portfolio cases, customized binder planners, premium alloy charging units, and metal pens with customized box carvings.",
    img: "corporate_gifting_mockup.png",
    format: "PDF Brochure",
    pages: 24,
    size: "4.8 MB",
    displayOrder: 5,
    status: "Publish"
  }
];

const defaultClientLogos = [
  { name: 'Toyota Kirloskar', logoUrl: 'logo-full.png', industryCategory: 'Industrial & Automotive', featured: true, active: true, showOnHomepage: true, sortOrder: 1 },
  { name: 'Wipro Technologies', logoUrl: 'logo-full.png', industryCategory: 'Corporate & Tech', featured: true, active: true, showOnHomepage: true, sortOrder: 2 },
  { name: 'Taj Resorts & Hotels', logoUrl: 'logo-full.png', industryCategory: 'Hospitality', featured: true, active: true, showOnHomepage: true, sortOrder: 3 },
  { name: 'Schneider Electric', logoUrl: 'logo-full.png', industryCategory: 'Industrial & Energy', featured: true, active: true, showOnHomepage: true, sortOrder: 4 },
  { name: 'Sansera Engineering', logoUrl: 'logo-full.png', industryCategory: 'Industrial', featured: true, active: true, showOnHomepage: true, sortOrder: 5 },
  { name: 'Apollo Hospitals', logoUrl: 'logo-full.png', industryCategory: 'Healthcare', featured: true, active: true, showOnHomepage: true, sortOrder: 6 }
];

const defaultTestimonials = [
  {
    clientName: 'Siddharth Rao',
    company: 'Toyota Kirloskar Motor',
    role: 'Head of Plant Safety & Operations',
    quote: 'Uniwear has delivered heat-resistant and FR-certified workwear for 3,500+ plant technicians on exact delivery timelines. Superior durability under heavy workloads.',
    rating: 5,
    logoUrl: 'logo-full.png',
    featured: true,
    published: true,
    sortOrder: 1
  },
  {
    clientName: 'Meera Deshmukh',
    company: 'Taj Luxury Hotels',
    role: 'Corporate Sourcing Director',
    quote: 'The fabric finish and custom embroidery for our front-desk and culinary suites exceeded our global brand standards. Seamless sampling process.',
    rating: 5,
    logoUrl: 'logo-full.png',
    featured: true,
    published: true,
    sortOrder: 2
  }
];

const defaultCaseStudies = [
  {
    title: 'Precision Workwear Scaleup for Heavy Manufacturing',
    slug: 'precision-workwear-scaleup',
    industry: 'Industrial & Automotive',
    clientName: 'Toyota Kirloskar',
    requirement: 'Standardize safety overalls and flame-retardant suits across 3 assembly plants with custom anti-static properties.',
    products: 'AeroGuard Boiler Suits & Steel-Toe Safety Boots',
    customization: 'Triple needle reinforcement, reflex strips, and department color-coded collar badges.',
    deliveryChallenge: '3,500 units required within 18 working days across 4 locations.',
    solution: 'Dedicated cutting lines and pre-stocked fabric lots at JP Nagar manufacturing plant.',
    outcome: '100% on-time delivery with zero fitting defect returns.',
    testimonial: 'Uniwear is our primary workwear partner across all plant units in India.',
    featured: true,
    published: true,
    sortOrder: 1
  }
];

module.exports = {
  defaultUsers,
  defaultLeads,
  defaultQuotations,
  defaultOrders,
  defaultTickets,
  defaultNotifications,
  defaultCompanySettings,
  defaultProducts,
  defaultBlogs,
  defaultCatalogs,
  defaultClientLogos,
  defaultTestimonials,
  defaultCaseStudies
};

