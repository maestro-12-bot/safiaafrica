export interface Language {
  code: string;
  label: string;
  native: string;
}

export const LANGUAGES: Language[] = [
  { code: "en", label: "English", native: "English" },
  { code: "rw", label: "Kinyarwanda", native: "Ikinyarwanda" },
  { code: "sw", label: "Kiswahili", native: "Kiswahili" },
  { code: "fr", label: "French", native: "Français" },
  { code: "ar", label: "Arabic", native: "العربية" },
  { code: "pt", label: "Portuguese", native: "Português" },
  { code: "am", label: "Amharic", native: "አማርኛ" },
  { code: "ha", label: "Hausa", native: "Hausa" },
  { code: "yo", label: "Yoruba", native: "Yorùbá" },
  { code: "ig", label: "Igbo", native: "Igbo" },
  { code: "zu", label: "Zulu", native: "isiZulu" },
  { code: "xh", label: "Xhosa", native: "isiXhosa" },
  { code: "so", label: "Somali", native: "Soomaali" },
  { code: "wo", label: "Wolof", native: "Wolof" },
];

export const RTL_LANGUAGES = ["ar"];

/**
 * Key-major translation table. Every key lists `en` first (the fallback) and
 * then any language that has a translation. Missing entries fall back to `en`,
 * so adding a language never breaks the UI.
 */
const T = {
  "nav.home": {
    en: "Home", rw: "Ahabanza", sw: "Nyumbani", fr: "Accueil", ar: "الرئيسية", pt: "Início",
    am: "መነሻ", ha: "Gida", yo: "Ilé", ig: "Ụlọ", zu: "Ikhaya", xh: "Ikhaya", so: "Guriga", wo: "Kër",
  },
  "nav.about": {
    en: "About", rw: "Abo turi bo", sw: "Kuhusu", fr: "À propos", ar: "من نحن", pt: "Sobre",
    am: "ስለ እኛ", ha: "Game da mu", yo: "Nípa wa", ig: "Banyere anyị", zu: "Mayelana", xh: "Malunga", so: "Ku saabsan", wo: "Ci sunu mbir",
  },
  "nav.luxury": {
    en: "Luxury", rw: "Ubukire", sw: "Anasa", fr: "Luxe", ar: "الفخامة", pt: "Luxo",
    am: "ቅንጦት", ha: "Alfarma", yo: "Ọlá", ig: "Ọkaibe", zu: "Ubukhazikhazi", xh: "Ubunewunewu", so: "Raaxo", wo: "Néewal",
  },
  "nav.collections": {
    en: "Collections", rw: "Ibicuruzwa", sw: "Mikusanyo", fr: "Collections", ar: "المجموعات", pt: "Coleções",
    am: "ስብስቦች", ha: "Tarin", yo: "Àkójọpọ̀", ig: "Nchịkọta", zu: "Amaqoqo", xh: "Iingqokelela", so: "Ururin", wo: "Mboolem",
  },
  "nav.countries": {
    en: "Countries", rw: "Ibihugu", sw: "Nchi", fr: "Pays", ar: "الدول", pt: "Países",
    am: "አገሮች", ha: "Ƙasashe", yo: "Àwọn orílẹ̀-èdè", ig: "Mba", zu: "Amazwe", xh: "Amazwe", so: "Wadamada", wo: "Réew yi",
  },
  "nav.heritage": {
    en: "Heritage", rw: "Umurage", sw: "Urithi", fr: "Patrimoine", ar: "التراث", pt: "Património",
    am: "ቅርስ", ha: "Gado", yo: "Ogún", ig: "Ihe nketa", zu: "Amagugu", xh: "Ilifa", so: "Hidaha", wo: "Cosaan",
  },
  "nav.gallery": {
    en: "Gallery", rw: "Imurikagurisha", sw: "Jumba la sanaa", fr: "Galerie", ar: "المعرض", pt: "Galeria",
    am: "ማዕከለ ስዕል", ha: "Gidan zane", yo: "Gbọ̀ngàn iṣẹ́ ọnà", ig: "Ụlọ ihe nkiri", zu: "Igalari", xh: "Igalari", so: "Bandhig", wo: "Galeri",
  },
  "nav.order": {
    en: "Order", rw: "Gutumiza", sw: "Agiza", fr: "Commander", ar: "اطلب", pt: "Encomendar",
    am: "ማዘዝ", ha: "Yi oda", yo: "Bèèrè", ig: "Nye iwu", zu: "Oda", xh: "Odola", so: "Dalbo", wo: "Komande",
  },
  "nav.track": {
    en: "Track Order", rw: "Kurikirana", sw: "Fuatilia", fr: "Suivi", ar: "تتبع الطلب", pt: "Rastrear",
    am: "ትዕዛዝ ይከታተሉ", ha: "Bibiyar oda", yo: "Tọpa", ig: "Soro", zu: "Landelela", xh: "Landelela", so: "Raadraac", wo: "Topatoo",
  },
  "nav.contact": {
    en: "Contact", rw: "Twandikire", sw: "Wasiliana", fr: "Contact", ar: "اتصل بنا", pt: "Contacto",
    am: "ያግኙን", ha: "Tuntuɓe", yo: "Kàn sí wa", ig: "Kpọtụrụ", zu: "Xhumana", xh: "Qhagamshelana", so: "Nala soo xiriir", wo: "Jokkoo",
  },
  "nav.artisan": {
    en: "Artisan Portal", rw: "Umuhanga", sw: "Mlango wa fundi", fr: "Espace artisan", ar: "بوابة الحرفيين", pt: "Portal do artesão",
    am: "የባለሙያ በር", ha: "Ƙofar masana", yo: "Ẹnu-ọ̀nà oníṣẹ́-ọnà", ig: "Ọnụ ụzọ ǹka", zu: "Isango sengcweti", xh: "Isango legcisa", so: "Bogga farshaxanka", wo: "Buntu boroom liggéey",
  },
  "nav.admin": {
    en: "Admin", rw: "Ubuyobozi", sw: "Msimamizi", fr: "Admin", ar: "الإدارة", pt: "Admin",
    am: "አስተዳደር", ha: "Gudanarwa", yo: "Alábòójútó", ig: "Nchịkwa", zu: "Umlawuli", xh: "Umlawuli", so: "Maamul", wo: "Jiite",
  },
  "cta.order": {
    en: "Order Artwork", rw: "Tumiza ubuhanzi", sw: "Agiza sanaa", fr: "Commander une œuvre", ar: "اطلب عملاً فنياً", pt: "Encomendar obra",
    am: "ሥዕል ያዙ", ha: "Yi odar zane", yo: "Bèèrè iṣẹ́ ọnà", ig: "Nye iwu nka", zu: "Oda umsebenzi wobuciko", xh: "Odola umsebenzi wobugcisa", so: "Dalbo farshaxan", wo: "Komande liggéey",
  },
  "cta.explore": {
    en: "Explore Collections", rw: "Reba ibyegeranyo", sw: "Chunguza mikusanyo", fr: "Voir les collections", ar: "استكشف المجموعات", pt: "Explorar coleções",
    am: "ስብስቦችን ይመልከቱ", ha: "Bincika tarin", yo: "Ṣàwárí àkójọpọ̀", ig: "Nyochaa nchịkọta", zu: "Hlola amaqoqo", xh: "Hlola iingqokelela", so: "Sahamin ururinta", wo: "Xool mboolem yi",
  },
  "cta.custom": {
    en: "Request Custom Artwork", rw: "Saba ubuhanzi bwihariye", sw: "Omba sanaa maalum", fr: "Demander une œuvre sur mesure", ar: "اطلب عملاً مخصصاً", pt: "Pedir obra personalizada",
  },
  "cta.gallery": {
    en: "Virtual Gallery", rw: "Imurikagurisha rya interineti", sw: "Jumba la sanaa mtandaoni", fr: "Galerie virtuelle", ar: "المعرض الافتراضي", pt: "Galeria virtual",
  },
  "cta.consultation": {
    en: "Book Consultation", rw: "Fata igihe cyo kubaza", sw: "Weka miadi", fr: "Réserver une consultation", ar: "احجز استشارة", pt: "Marcar consulta",
  },
  "label.language": {
    en: "Language", rw: "Ururimi", sw: "Lugha", fr: "Langue", ar: "اللغة", pt: "Idioma",
    am: "ቋንቋ", ha: "Harshe", yo: "Èdè", ig: "Asụsụ", zu: "Ulimi", xh: "Ulwimi", so: "Luqad", wo: "Làkk",
  },
  "label.currency": {
    en: "Currency", rw: "Ifaranga", sw: "Sarafu", fr: "Devise", ar: "العملة", pt: "Moeda",
    am: "ገንዘብ", ha: "Kuɗi", yo: "Owó", ig: "Ego", zu: "Imali", xh: "Imali", so: "Lacag", wo: "Xaalis",
  },
  "label.from": {
    en: "From", rw: "Guhera kuri", sw: "Kuanzia", fr: "À partir de", ar: "من", pt: "A partir de",
    am: "ከ", ha: "Daga", yo: "Láti", ig: "Site", zu: "Kusuka", xh: "Ukusuka", so: "Laga bilaabo", wo: "Dale",
  },
  "home.eyebrow": {
    en: "Sustainable African Fashion, Innovation & Arts",
    rw: "Imyambarire, Udushya n'Ubugeni bya Afurika birambye",
    sw: "Mitindo, Ubunifu na Sanaa Endelevu ya Afrika",
    fr: "Mode, innovation et arts africains durables",
    ar: "الأزياء والابتكار والفنون الأفريقية المستدامة",
    pt: "Moda, Inovação e Artes Africanas Sustentáveis",
  },
  "home.title": {
    en: "Preserving Africa's Heritage",
    rw: "Kubungabunga Umurage wa Afurika",
    sw: "Kuhifadhi Urithi wa Afrika",
    fr: "Préserver le patrimoine africain",
    ar: "الحفاظ على تراث أفريقيا",
    pt: "Preservando o património de África",
  },
  "home.titleAccent": {
    en: "Through Innovation.",
    rw: "Binyuze mu Udushya.",
    sw: "Kupitia Ubunifu.",
    fr: "Par l'innovation.",
    ar: "من خلال الابتكار.",
    pt: "Através da inovação.",
  },
  "home.sub": {
    en: "SAFIA Africa is a Pan-African company dedicated to preserving, documenting, licensing and promoting Africa's cultural and historical heritage — transforming it into museum-grade luxury artwork and sustainable economic opportunity.",
    rw: "SAFIA Africa ni ikigo cya Afurika yose gikora ku kubungabunga, kwandika no guteza imbere umurage w'umuco na amateka ya Afurika — bikorwamo ubuhanzi bw'agaciro n'amahirwe y'ubukungu arambye.",
    sw: "SAFIA Africa ni kampuni ya Afrika nzima inayojitolea kuhifadhi, kuandika na kukuza urithi wa kitamaduni na kihistoria wa Afrika — na kuubadilisha kuwa sanaa ya kifahari na fursa endelevu za kiuchumi.",
    fr: "SAFIA Africa est une entreprise panafricaine dédiée à la préservation, la documentation, la licence et la promotion du patrimoine culturel et historique africain, transformé en œuvres de luxe de qualité muséale et en opportunités économiques durables.",
    ar: "سافيا أفريقيا شركة عموم أفريقية مكرسة للحفاظ على التراث الثقافي والتاريخي لأفريقيا وتوثيقه وترويجه، وتحويله إلى أعمال فنية فاخرة بمستوى المتاحف وفرص اقتصادية مستدامة.",
    pt: "A SAFIA Africa é uma empresa pan-africana dedicada a preservar, documentar, licenciar e promover o património cultural e histórico de África — transformando-o em obras de luxo de nível museológico e em oportunidades económicas sustentáveis.",
  },
  "home.pillars": {
    en: "What we do", rw: "Ibyo dukora", sw: "Tunachofanya", fr: "Ce que nous faisons", ar: "ما نقوم به", pt: "O que fazemos",
  },
  "home.collections": {
    en: "Signature collections", rw: "Ibyegeranyo byihariye", sw: "Mikusanyo maalum", fr: "Collections signature", ar: "المجموعات المميزة", pt: "Coleções exclusivas",
  },
  "home.pricing": {
    en: "Transparent pricing", rw: "Ibiciro bigaragara", sw: "Bei wazi", fr: "Tarifs transparents", ar: "أسعار شفافة", pt: "Preços transparentes",
  },
  "footer.tagline": {
    en: "Sustainable African Fashion, Innovation and Arts. Preserving, documenting and licensing Africa's heritage through technology-driven luxury craft.",
    rw: "Imyambarire, Udushya n'Ubugeni bya Afurika birambye. Kubungabunga no kwandika umurage wa Afurika binyuze mu bukorikori bwo ku rwego rwo hejuru.",
    sw: "Mitindo, Ubunifu na Sanaa Endelevu ya Afrika. Kuhifadhi, kuandika na kutoa leseni ya urithi wa Afrika kupitia ufundi wa kifahari.",
    fr: "Mode, innovation et arts africains durables. Préserver, documenter et concéder le patrimoine africain grâce à un artisanat de luxe.",
    ar: "الأزياء والابتكار والفنون الأفريقية المستدامة. الحفاظ على تراث أفريقيا وتوثيقه وترخيصه عبر حرف فاخرة مدفوعة بالتقنية.",
    pt: "Moda, Inovação e Artes Africanas Sustentáveis. Preservar, documentar e licenciar o património de África através do artesanato de luxo.",
  },
  "footer.explore": {
    en: "Explore", rw: "Shakisha", sw: "Chunguza", fr: "Explorer", ar: "استكشف", pt: "Explorar",
  },
  "footer.clients": {
    en: "Clients", rw: "Abakiriya", sw: "Wateja", fr: "Clients", ar: "العملاء", pt: "Clientes",
  },
  "footer.atelier": {
    en: "Atelier", rw: "Uruganda", sw: "Karakana", fr: "Atelier", ar: "الورشة", pt: "Ateliê",
  },
  "countries.title": {
    en: "54 nations, one continental atelier.",
    rw: "Ibihugu 54, atelier imwe y'umugabane.",
    sw: "Mataifa 54, karakana moja ya bara.",
    fr: "54 nations, un atelier continental.",
    ar: "٥٤ دولة، ورشة قارية واحدة.",
    pt: "54 nações, um ateliê continental.",
  },
  "countries.subtitle": {
    en: "Every African nation has its own SAFIA experience — dress, languages, crafts, heritage sites and festivals, with commissions inspired by each culture.",
    rw: "Buri gihugu cya Afurika gifite uburambe bwacyo bwa SAFIA — imyambarire, indimi, ubukorikori, ahantu h'umurage n'iminsi mikuru.",
    sw: "Kila taifa la Afrika lina uzoefu wake wa SAFIA — mavazi, lugha, ufundi, maeneo ya urithi na sherehe.",
    fr: "Chaque nation africaine possède son expérience SAFIA — tenues, langues, artisanats, sites patrimoniaux et festivals.",
    ar: "لكل دولة أفريقية تجربتها الخاصة مع سافيا — الأزياء واللغات والحرف ومواقع التراث والمهرجانات.",
    pt: "Cada nação africana tem a sua experiência SAFIA — trajes, línguas, artesanato, sítios patrimoniais e festivais.",
  },
  "countries.search": {
    en: "Search a country", rw: "Shakisha igihugu", sw: "Tafuta nchi", fr: "Rechercher un pays", ar: "ابحث عن دولة", pt: "Procurar um país",
  },
  "countries.all": {
    en: "All regions", rw: "Uturere twose", sw: "Mikoa yote", fr: "Toutes les régions", ar: "كل المناطق", pt: "Todas as regiões",
  },
  "countries.explore": {
    en: "Explore", rw: "Reba", sw: "Chunguza", fr: "Explorer", ar: "استكشف", pt: "Explorar",
    am: "ያስሱ", ha: "Bincika", yo: "Ṣàwárí", ig: "Nyochaa", zu: "Hlola", xh: "Hlola", so: "Sahamin", wo: "Xool",
  },
  "portal.dashboard": {
    en: "Dashboard", rw: "Ikibaho", sw: "Dashibodi", fr: "Tableau de bord", ar: "لوحة التحكم", pt: "Painel",
  },
  "portal.products": {
    en: "Products", rw: "Ibikoresho", sw: "Bidhaa", fr: "Produits", ar: "المنتجات", pt: "Produtos",
  },
  "portal.earnings": {
    en: "Earnings", rw: "Inyungu", sw: "Mapato", fr: "Revenus", ar: "الأرباح", pt: "Ganhos",
  },
  "portal.advertising": {
    en: "Advertising", rw: "Ikwamamaza", sw: "Matangazo", fr: "Publicité", ar: "الإعلانات", pt: "Publicidade",
  },
  "portal.profile": {
    en: "Profile", rw: "Umwirondoro", sw: "Wasifu", fr: "Profil", ar: "الملف الشخصي", pt: "Perfil",
  },
  "portal.overview": {
    en: "Overview", rw: "Irebera", sw: "Muhtasari", fr: "Aperçu", ar: "نظرة عامة", pt: "Visão geral",
  },
  "portal.orders": {
    en: "Orders", rw: "Amabwiriza", sw: "Maagizo", fr: "Commandes", ar: "الطلبات", pt: "Encomendas",
  },
  "portal.artisans": {
    en: "Artisans", rw: "Abahanga", sw: "Mafundi", fr: "Artisans", ar: "الحرفيون", pt: "Artesãos",
  },
  "portal.artworks": {
    en: "Artworks", rw: "Ubuhanzi", sw: "Sanaa", fr: "Œuvres", ar: "الأعمال الفنية", pt: "Obras",
  },
  "portal.visitors": {
    en: "Visitors", rw: "Abasuye", sw: "Wageni", fr: "Visiteurs", ar: "الزوار", pt: "Visitantes",
  },
  "portal.withdrawals": {
    en: "Withdrawals", rw: "Gukura amafaranga", sw: "Uondoaji", fr: "Retraits", ar: "السحوبات", pt: "Levantamentos",
  },
  "portal.signout": {
    en: "Sign out", rw: "Sohoka", sw: "Toka", fr: "Déconnexion", ar: "تسجيل الخروج", pt: "Sair",
  },
  "portal.welcome": {
    en: "Welcome", rw: "Murakaza neza", sw: "Karibu", fr: "Bienvenue", ar: "مرحباً", pt: "Bem-vindo",
  },
} satisfies Record<string, { en: string } & Record<string, string>>;

export type TranslationKey = keyof typeof T;

export const TRANSLATIONS = T;

export function translate(lang: string, key: TranslationKey) {
  const entry = T[key] as Record<string, string>;
  return entry[lang] ?? entry["en"]!;
}
