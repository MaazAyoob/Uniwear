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

module.exports = {
  defaultUsers,
  defaultLeads,
  defaultQuotations,
  defaultOrders,
  defaultTickets,
  defaultNotifications,
  defaultCompanySettings
};
