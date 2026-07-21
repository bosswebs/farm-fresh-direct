import { useState, useEffect } from "react";

export type Language = "en" | "rw";

const LANGUAGE_KEY = "deacomart.language.v1";

export const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.shop": "Shop",
    "nav.shop_desc": "Browse fresh produce & agricultural inputs",
    "nav.services": "Services",
    "nav.account": "Account",
    "nav.market_map": "Market Map",
    "nav.market_map_desc": "Find producers and market locations",
    "nav.academy": "Academy",
    "nav.academy_desc": "Explore practical agribusiness training",
    "nav.consultancy": "Consultancy",
    "nav.consultancy_desc": "Request professional advisory support",
    "nav.track_order": "Track Order",
    "nav.track_order_desc": "Check the progress of a delivery",
    "nav.about": "About Us",
    "nav.impact": "Impact",
    "nav.trust": "Trust Center",
    "nav.careers": "Careers",
    "nav.advertise": "Advertise",
    "nav.contact": "Contact Us",
    "nav.register": "Register",
    "nav.farmer_portal": "Farmer Portal",
    "nav.admin": "Admin",
    "nav.order_whatsapp": "Order via WhatsApp",

    // Common UI
    "common.english": "ENGLISH",
    "common.rwanda": "RWANDA",
    "common.cart": "Cart",
    "common.search": "Search products...",
    "common.all_categories": "All Categories",
    "common.add_to_cart": "Add to Cart",
    "common.view_details": "View Details",
    "common.checkout": "Proceed to Checkout",
    "common.subtotal": "Subtotal",
    "common.empty_cart": "Your cart is empty",
    "common.close": "Close",
    "common.price": "Price",
    "common.unit": "Unit",
    "common.submit": "Submit",
    "common.cancel": "Cancel",
    "common.location": "Location",
    "common.district": "District",
    "common.back": "Back",
    "common.learn_more": "Learn More",

    // Hero & Landing Page
    "hero.badge": "BE ECOWISE · RWANDA",
    "hero.title": "Fresh Agricultural Produce Direct from Rwanda's Farmers",
    "hero.subtitle": "Deacomart bridges rural smallholder farmers directly to markets, businesses, and households with certified quality assurance and reliable logistics.",
    "hero.shop_now": "Explore Marketplace",
    "hero.register_farmer": "Apply as Farmer",
    "hero.trust_farmers": "Partner Smallholder Farmers",
    "hero.districts": "Districts Covered",
    "hero.delivery": "Standard Delivery Time",

    // Services section
    "services.title": "Our Core Agribusiness Pillars",
    "services.subtitle": "Empowering sustainable farming and direct food distribution across Rwanda.",
    "services.marketplace": "Digital Marketplace",
    "services.marketplace_desc": "Direct access to fresh fruits, vegetables, grains, and beverages sourced from verified local cooperatives.",
    "services.advisory": "Expert Consultancy",
    "services.advisory_desc": "Agronomy advisory, post-harvest handling guidance, and business structuring for farmer groups.",
    "services.academy": "Agribusiness Academy",
    "services.academy_desc": "Practical hands-on training programs in financial management, sustainable farming, and market access.",

    // Footer
    "footer.tagline": "Be EcoWise — Empowering Rwandan farmers and supplying quality food and beverages across all Districts.",
    "footer.platform": "Platform",
    "footer.company": "Company",
    "footer.contact": "Contact",
    "footer.rights": "Deacomart Ltd — Be EcoWise · Kigali, Rwanda. All rights reserved.",

    // WhatsApp Widget
    "whatsapp.header_title": "Deacomart Support",
    "whatsapp.status": "Online · \"Be EcoWise\"",
    "whatsapp.greeting": "Hello! 👋 We are here to help you connect with Rwandan farms, get consultancy, or register for training. What would you like to do?",
    "whatsapp.quick_actions": "Quick Actions",
    "whatsapp.request_quote": "Request a Quote",
    "whatsapp.register_training": "Register for Training",
    "whatsapp.agribusiness_consulting": "Agribusiness Consulting",
    "whatsapp.track_delivery": "Track Delivery Status",
    "whatsapp.type_message": "Type your message...",

    // Shop / Browse Page
    "shop.badge": "Deacomart Marketplace",
    "shop.title": "Quality food & beverages, from Rwandan farms.",
    "shop.subtitle": "Filter by category and District. Place orders via WhatsApp or directly from any product page.",
    "shop.search_placeholder": "Search products, e.g. honey, hibiscus tea...",
    "shop.all_districts": "All Districts",
    "shop.categories": "Categories",
    "shop.all_products": "All Products",
    "shop.certified_organic": "Certified Organic",
    "shop.food_safety": "Food Safety Guaranteed",
    "shop.no_products": "No products match your search criteria",
    "shop.reset_filters": "Reset filters",

    // About Page
    "about.badge": "ABOUT DEACOMART",
    "about.title": "Empowering Farmers, Delivering Quality across Rwanda",
    "about.subtitle": "DEACOMART Limited is a Rwandan private limited company established and registered in accordance with Article 23 of Law Nº 007/2021 governing companies in Rwanda.",
    "about.mission_title": "Our Mission",
    "about.mission_desc": "To empower smallholder farmers by providing direct market access, modern agronomic training, and efficient supply chain logistics across Rwanda.",
    "about.vision_title": "Our Vision",
    "about.vision_desc": "To build Rwanda's most trusted, sustainable agribusiness ecosystem connecting rural producers to commercial markets.",

    // Impact Page
    "impact.badge": "IMPACT & RESULTS",
    "impact.title": "Empowering Rural Communities Across Rwanda",
    "impact.subtitle": "Transparent metric tracking showing economic growth, yield improvements, and income stabilization for smallholder farmers.",
    "impact.stat_farmers": "Farmers Empowered",
    "impact.stat_coops": "Partner Cooperatives",
    "impact.stat_districts": "Districts Active",
    "impact.stat_volume": "Produce Delivered (Tons)",

    // Market Map Page
    "map.badge": "PRODUCER & MARKET MAP",
    "map.title": "Rwanda Agricultural Direct Sourcing Map",
    "map.subtitle": "Locate verified farmer cooperatives, produce collection points, and distribution channels across all 30 Districts of Rwanda.",
    "map.search_placeholder": "Search producers, districts, or crop types...",

    // Training / Academy Page
    "training.badge": "FARMER ACADEMY",
    "training.title": "Deacomart Agribusiness Training & Academy",
    "training.subtitle": "Hands-on practical training in financial literacy, post-harvest handling, climate-smart agriculture, and cooperative governance.",
    "training.register_now": "Register for Course",

    // Consultancy Page
    "consultancy.badge": "AGRIBUSINESS CONSULTANCY",
    "consultancy.title": "Expert Agronomy & Agribusiness Advisory",
    "consultancy.subtitle": "Tailored advisory services for farmer cooperatives, agribusiness enterprises, and agricultural lenders.",
    "consultancy.request_btn": "Book Consultation",

    // Track Order Page
    "tracking.badge": "LOGISTICS TRACKING",
    "tracking.title": "Track Your Produce Delivery",
    "tracking.subtitle": "Enter your Order Reference Number or Phone Number to view real-time delivery status across Rwanda.",
    "tracking.placeholder": "Enter Order ID (e.g. ORD-8492) or Phone Number...",
    "tracking.btn": "Track Delivery",

    // Register Farmer Page
    "register.badge": "FARMER PORTAL APPLICATION",
    "register.title": "Apply to Become a Partner Producer",
    "register.subtitle": "Gain direct access to list and sell your fresh farm produce on Deacomart's marketplace.",
    "register.fullname": "Full Name",
    "register.phone": "Phone Number",
    "register.email": "Email Address",
    "register.district": "District",
    "register.sector": "Sector",
    "register.farm_name": "Farm / Cooperative Name",
    "register.farm_size": "Farm Size",
    "register.products": "Products Grown",
    "register.password": "Portal Password",
    "register.submit": "Submit Application",

    // Subscribe
    "subscribe.badge": "AGRI NEWSLETTER & PRICE ALERTS",
    "subscribe.title": "Subscribe to Deacomart Agri Updates",
    "subscribe.subtitle": "Receive weekly market price indices, harvest schedules, and special producer offers directly to your email or WhatsApp.",
    "subscribe.email": "Email Address",
    "subscribe.phone": "WhatsApp Number (Optional)",
    "subscribe.btn": "Subscribe Now",
    "subscribe.success": "Thank you for subscribing! You will receive our next agri bulletin.",

    // Careers
    "careers.badge": "JOIN OUR TEAM",
    "careers.title": "Build the Future of Agriculture in Rwanda",
    "careers.subtitle": "Explore rewarding career and internship opportunities at Deacomart Ltd — driving sustainable agribusiness, cold chain logistics, and data transformation.",
    "careers.openings": "Open Positions",
    "careers.apply": "Apply Now",
    "careers.department": "Department",
    "careers.location": "Location",

    // Trust Center
    "trust.badge": "TRUST & COMPLIANCE CENTER",
    "trust.title": "Verified Quality, Standards & Regulatory Compliance",
    "trust.subtitle": "Deacomart Ltd operates with strict regulatory approvals, food safety certifications, and transparent cooperative partnerships.",
    "trust.certifications": "Accreditations & Regulatory Partners",
    "trust.partners": "Verified Cooperative Ecosystem",
    "trust.become_partner": "Become a Verified Partner",

    // Advertise
    "advertise.badge": "AGRI-ADVERTISING & SPONSORSHIPS",
    "advertise.title": "Promote Your Agri-Products & Services",
    "advertise.subtitle": "Reach over 2,900+ registered farmer cooperatives, buyers, hotel chains, and distributors across Rwanda.",
    "advertise.packages": "Advertising Tier Packages",
    "advertise.request_btn": "Book Ad Campaign",

    // Contact Us Page
    "contact.badge": "GET IN TOUCH",
    "contact.title": "Contact Deacomart Headquarters",
    "contact.subtitle": "Have questions about produce orders, cooperative onboarding, or advisory services? Our team is here to assist you.",
    "contact.send_msg": "Send Us a Message",
    "contact.hours": "Operating Hours",
    "contact.address": "Headquarters Location",
  },
  rw: {
    // Navigation
    "nav.home": "Ahubanza",
    "nav.shop": "Isoko",
    "nav.shop_desc": "Shaka umusaruro w'ubuhinzi n'ibikoresho",
    "nav.services": "Serivisi",
    "nav.account": "Konte",
    "nav.market_map": "Ikarita y'Isoko",
    "nav.market_map_desc": "Shaka abahinzi n'ahantu n'amasoko",
    "nav.academy": "Ishuri ry'Ubuhinzi",
    "nav.academy_desc": "Wige uburyo bwiza bwo guhinga no gucunga umusaruro",
    "nav.consultancy": "Ubwunzi & Inama",
    "nav.consultancy_desc": "Subiza ibibazo by'ubuhinzi n'ubucuruzi buciriritse",
    "nav.track_order": "Gukurikirana Icyatumijwe",
    "nav.track_order_desc": "Reba uko icyo watumije kiri gutwarwa",
    "nav.about": "Turi Bamwe",
    "nav.impact": "Umusaruro",
    "nav.trust": "Ubuziranenge",
    "nav.careers": "Imyanya y'Akazi",
    "nav.advertise": "Kwamamaza",
    "nav.contact": "Tuvugishe",
    "nav.register": "Kwiyandikisha",
    "nav.farmer_portal": "Ikirenga cy'Umuhinzi",
    "nav.admin": "Ubuyobozi",
    "nav.order_whatsapp": "Tuma kuri WhatsApp",

    // Common UI
    "common.english": "CYONGEREZA",
    "common.rwanda": "RWANDA",
    "common.cart": "Igitebo",
    "common.search": "Shakisha umusaruro...",
    "common.all_categories": "Ibyiciro Byose",
    "common.add_to_cart": "Ongeramo mu Igitebo",
    "common.view_details": "Reba Birambuye",
    "common.checkout": "Komeza Kwishyura",
    "common.subtotal": "Igiteranyo",
    "common.empty_cart": "Igitebo cyawe ntakirimo",
    "common.close": "Funga",
    "common.price": "Igiciro",
    "common.unit": "Ingano",
    "common.submit": "Ohereza",
    "common.cancel": "Kanserera",
    "common.location": "Ahantu",
    "common.district": "Akarere",
    "common.back": "Subira Nyuma",
    "common.learn_more": "Soma Birambuye",

    // Hero & Landing Page
    "hero.badge": "BA ECOWISE · RWANDA",
    "hero.title": "Umusaruro Mwiza w'Ubuhinzi Uva Zikora ku Bahinzi b'i Rwanda",
    "hero.subtitle": "Deacomart ihuza abahinzi bato n'amasoko, ibigo n'ingo mu gihugu hose ku giciro cyiza n meza n'itwara ryo kwizerwa.",
    "hero.shop_now": "Sura Isoko ry'Umusaruro",
    "hero.register_farmer": "Kwiyandikishe nka Umuhinzi",
    "hero.trust_farmers": "Koperative z'Abahinzi",
    "hero.districts": "Uturere Dukoramo",
    "hero.delivery": "Igihe kyo Kugezaho Umusaruro",

    // Services section
    "services.title": "Inkingi Zacu z'Ubuhinzi n'Ubucuruzi",
    "services.subtitle": "Gushyigikira ubuhinzi burambye no kugeza ibiribwa ku baguzi mu Rwanda.",
    "services.marketplace": "Isoko rya Interineti",
    "services.marketplace_desc": "Umusaruro w'imbuto, imboga, ibinyampeke n'ibinyobwa biva mu koperative zizewe.",
    "services.advisory": "Inama z'Inzobere",
    "services.advisory_desc": "Ubwunzi mu buhinzi, gucunga umusaruro no kwegera abahinzi.",
    "services.academy": "Ishuri ry'Ubuhinzi",
    "services.academy_desc": "Amahugurwa y'ingirakamaro mu gucunga imari n'ubuhinzi bugezweho.",

    // Footer
    "footer.tagline": "Ba EcoWise — Gushyigikira abahinzi b'Abanyarwanda no gutanga ibiribwa n'ibinyobwa by'ubuziranenge mu Turere twose.",
    "footer.platform": "Urubuga",
    "footer.company": "Isosiyete",
    "footer.contact": "Twandikire",
    "footer.rights": "Deacomart Ltd — Ba EcoWise · Kigali, Rwanda. Uburenganzira bwose burabitswe.",

    // WhatsApp Widget
    "whatsapp.header_title": "Ufashanyo wa Deacomart",
    "whatsapp.status": "Arakora · \"Ba EcoWise\"",
    "whatsapp.greeting": "Muraho! 👋 Turi hano kugira ngo tubafashe kwegera abahinzi b'i Rwanda, kubona inama cyangwa kwiyandikisha mu mahugurwa. Ni iki mwakwifuza kumenya?",
    "whatsapp.quick_actions": "Ibyo Wajya stho",
    "whatsapp.request_quote": "Saba Igiciro cy'Umusaruro",
    "whatsapp.register_training": "Kwiyandikisha mu Mahugurwa",
    "whatsapp.agribusiness_consulting": "Inama z'Ubuhinzi n'Ubucuruzi",
    "whatsapp.track_delivery": "Gukurikirana Uko Icyatumijwe Kiri Gutwarwa",
    "whatsapp.type_message": "Andika ubutumwa bwawe...",

    // Shop / Browse Page
    "shop.badge": "Isoko rya Deacomart",
    "shop.title": "Ibiribwa n'ibinyobwa by'ubuziranenge biva mu mirima y'i Rwanda.",
    "shop.subtitle": "Shungura hakurikijwe icyiciro n'Akarere. Tuma ibintu biciye kuri WhatsApp cyangwa ku rupapuro rw'umusaruro.",
    "shop.search_placeholder": "Shakisha umusaruro, urugero: ubuki, icyayi...",
    "shop.all_districts": "Uturere Twose",
    "shop.categories": "Ibyiciro",
    "shop.all_products": "Umusaruro Wose",
    "shop.certified_organic": "Ibiribwa by'Umwimerere (Organic)",
    "shop.food_safety": "Ubuziranenge Bwemejwe",
    "shop.no_products": "Nta musaruro ugaragaye mu byo washakishije",
    "shop.reset_filters": "Siba ibyo washakishije",

    // About Page
    "about.badge": "IBYEREKEYE DEACOMART",
    "about.title": "Gushyigikira Abahinzi, Kugeza Umusaruro Mwiza mu Rwanda Hose",
    "about.subtitle": "DEACOMART Limited ni sosiyete y'ubucuruzi bwite yanditse mu mategeko y'u Rwanda ahana n'ingingo ya 23 y'Itegeko Nº 007/2021 rigenga isosiyete mu Rwanda.",
    "about.mission_title": "Intego Yacu",
    "about.mission_desc": "Gushyigikira abahinzi bato biciye mu kubaha amasoko aziguye, amahugurwa mu buhinzi n'itwara ry'umusaruro ryihuse mu Rwanda.",
    "about.vision_title": "Icyerekezo Ccyacu",
    "about.vision_desc": "Kuba urubuga rugari rw'ubuhinzi n'ubucuruzi rwesesa intego n'iterambere mu cyaro cy'u Rwanda.",

    // Impact Page
    "impact.badge": "UMUSARURO N'ITERAMBERE",
    "impact.title": "Gushyigikira Abahinzi n'Amasoko mu Rwanda Hose",
    "impact.subtitle": "Imibare igaragaza iterambere ry'ubworozi n'ubuhinzi ku bahinzi bato mu Rwanda.",
    "impact.stat_farmers": "Abahinzi Bashyigikiwe",
    "impact.stat_coops": "Koperative Zikorana Nacu",
    "impact.stat_districts": "Uturere Dukoreramo",
    "impact.stat_volume": "Ingano y'Umusaruro (Tani)",

    // Market Map Page
    "map.badge": "IKARITA Y'ABAHINZI N'AMASOKO",
    "map.title": "Ikarita y'Ubuhinzi n'Abahinzi mu Rwanda",
    "map.subtitle": "Shakisha koperative zemejwe, aho ikusanyirizo ry'umusaruro riri n'inzira z'itwara mu Rwanda.",
    "map.search_placeholder": "Shakisha abahinzi, uturere, cyangwa ubwoko bw'umusaruro...",

    // Training / Academy Page
    "training.badge": "ISHURI RY'UBUHINZI",
    "training.title": "Ishuri ry'Ubuhinzi n'Ubucuruzi rya Deacomart",
    "training.subtitle": "Amahugurwa y'ingirakamaro mu gucunga imari, kurengera umusaruro n'ubuhinzi bugezweho.",
    "training.register_now": "Kwiyandikisha mu Masomo",

    // Consultancy Page
    "consultancy.badge": "INAMA Z'INZOBERE",
    "consultancy.title": "Ubwunzi n'Inama z'Inzobere mu Buhinzi",
    "consultancy.subtitle": "Serivisi z'inama z'inzobere ku koperative, imirima migari n'abashoramari mu buhinzi.",
    "consultancy.request_btn": "Saba Inama z'Inzobere",

    // Track Order Page
    "tracking.badge": "GUKURIKIRANA ITWARA",
    "tracking.title": "Gukurikirana Uko Icyatumijwe Kiri Gutwarwa",
    "tracking.subtitle": "Shyiramo nimero y'icyatumijwe cyangwa nimero ya terefone urebe uko kiri gutwarwa.",
    "tracking.placeholder": "Shyiramo Nimero y'Icyatumijwe cyangwa Terefone...",
    "tracking.btn": "Reba Uko Kiri Gutwarwa",

    // Register Farmer Page
    "register.badge": "APULIKASIYO Y'UMUHINZI",
    "register.title": "Kwiyandikisha nka Umuhinzi Ukorana Nacu",
    "register.subtitle": "Bona uburenganzira bwo kugurisha umusaruro wimbi ku isoko rya Deacomart.",
    "register.fullname": "Izina Ryose",
    "register.phone": "Nimero ya Terefone",
    "register.email": "Imeri (Email)",
    "register.district": "Akarere",
    "register.sector": "Umurenge",
    "register.farm_name": "Izina ry'Umurima cyangwa Koperative",
    "register.farm_size": "Ingano y'Umurima",
    "register.products": "Umusaruro Uhingwa",
    "register.password": "Ijambo ry'Ibanga",
    "register.submit": "Ohereza Apulikasiyo",

    // Subscribe
    "subscribe.badge": "AMAKURU Y'ISOKO N'IBICIRO",
    "subscribe.title": "Iyandikishe Wabonamo Amakuru y'Ubuhinzi bwa Deacomart",
    "subscribe.subtitle": "Bona amakuru y'ibiciro ku isoko buri cyumweru, igihe cy'isarura, n'amahirwe y'isoko kuri imeri cyangwa WhatsApp.",
    "subscribe.email": "Aderesi y'Imeri (Email)",
    "subscribe.phone": "Nimero ya WhatsApp (Bihitamo)",
    "subscribe.btn": "Iyandikishe Nyine",
    "subscribe.success": "Murakoze kwiyandikisha! Muzajya mubona amakuru y'ubuhinzi abaho.",

    // Careers
    "careers.badge": "WINJIRE MU EKIPE YACU",
    "careers.title": "Wubake Ejo Hazaza h'Ubuhinzi mu Rwanda",
    "careers.subtitle": "Shaka imyanya y'akazi n'interinishi kuri Deacomart Ltd — uteza imbere ubuhinzi burambye, itwarwa ry'umusaruro n'ikoranabuhanga.",
    "careers.openings": "Imyanya y'Akazi Ipfunyitse",
    "careers.apply": "Saba Akazi Now",
    "careers.department": "Ishami",
    "careers.location": "Aho Gukorera",

    // Trust Center
    "trust.badge": "IBIGO N'IBIHAMYA BY'UBURANGBANJE",
    "trust.title": "Ubwitegure, Ibyangombwa n'Ubuziranenge Bwemejwe",
    "trust.subtitle": "Deacomart Ltd ikora ifite ibyangombwa bya Leta, ubuziranenge bw'ibiribwa n'imikoranire izira amakemwa na koperative.",
    "trust.certifications": "Ibyangombwa n'Ibigo Twemewe Na Byo",
    "trust.partners": "Koperative n'Ahabarizwa Abakorana Nacu",
    "trust.become_partner": "Ba Umu partner Wizewe",

    // Advertise
    "advertise.badge": "KWAMAMAZA N'UBUKORANIRE",
    "advertise.title": "Kwamamaza Ibyo Ukora n'Umusaruro mu Buhinzi",
    "advertise.subtitle": "Baza abahinzi barenga 2,900+, abaguzi bagari, amahoteli n'amasoko akomeye mu Rwanda.",
    "advertise.packages": "Uburyo bwo Kwamamaza",
    "advertise.request_btn": "Saba Kwamamaza",

    // Contact Us Page
    "contact.badge": "TUBIKUZE",
    "contact.title": "Twandikire ku Cwicaro Gikuru cya Deacomart",
    "contact.subtitle": "Niba ufite ibibazo ku bitumizwa, kwiyandikisha nka koperative cyangwa inama z'ubuhinzi, ikipe yacu iri hano kwitaba.",
    "contact.send_msg": "Tuyoherereze Ubutumwa",
    "contact.hours": "Amasaha y'Akazi",
    "contact.address": "Aho Icyicaro Gikuru Kiri",

    // Product Detail Page
    "product.back": "Subira mu Isoko",
    "product.producer": "Umuhinzi / Koperative",
    "product.location": "Akarere Aherereye",
    "product.organic": "Ubwimerere (Organic)",
    "product.safety": "Ubuziranenge Bwemejwe",
    "product.order_whatsapp": "Tuma kuri WhatsApp",
    "product.add_cart": "Ongeramo mu Igitebo",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function getLanguage(): Language {
  if (typeof window === "undefined") return "en";
  try {
    const saved = window.localStorage.getItem(LANGUAGE_KEY);
    return saved === "rw" ? "rw" : "en";
  } catch {
    return "en";
  }
}

export function setLanguage(lang: Language) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LANGUAGE_KEY, lang);
    window.dispatchEvent(new CustomEvent("agrimarket:language-changed", { detail: lang }));
  } catch (e) {
    console.error("Failed to save language preference", e);
  }
}

export function subscribeLanguage(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener("agrimarket:language-changed", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("agrimarket:language-changed", handler);
    window.removeEventListener("storage", handler);
  };
}

export function t(key: TranslationKey, fallback?: string): string {
  const currentLang = getLanguage();
  const dict = translations[currentLang] || translations.en;
  return dict[key] || fallback || translations.en[key] || key;
}

export function useLanguage() {
  const [language, setLangState] = useState<Language>(getLanguage());

  useEffect(() => {
    const update = () => setLangState(getLanguage());
    update();
    return subscribeLanguage(update);
  }, []);

  const changeLanguage = (newLang: Language) => {
    setLanguage(newLang);
    setLangState(newLang);
  };

  const translate = (key: TranslationKey, fallback?: string) => {
    const dict = translations[language] || translations.en;
    return dict[key] || fallback || translations.en[key] || key;
  };

  return {
    language,
    setLanguage: changeLanguage,
    t: translate,
  };
}
