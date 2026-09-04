import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "am";

type Dict = Record<string, { en: string; am: string }>;

export const strings: Dict = {
  "brand.name": { en: "Gospel for Generation Church", am: "ወንጌል ለትውልድ ቤተ ክርስቲያን" },
  "nav.home": { en: "Home", am: "መነሻ" },
  "nav.about": { en: "About", am: "ስለ እኛ" },
  "nav.events": { en: "Events", am: "ዝግጅቶች" },
  "nav.sermons": { en: "Sermons", am: "ስብከቶች" },
  "nav.give": { en: "Give", am: "ስጦታ" },
  "nav.portal": { en: "Member Portal", am: "የአባላት ገጽ" },

  "hero.badge": {
    en: "✨ We are eagerly looking forward to seeing you",
    am: "✨ ልናያችሁ ጉጉት አለን",
  },
  "hero.title": { en: "Growing Together in Christ’s Love", am: "በክርስቶስ ፍቅር አብረን እናድጋለን" },
  "hero.lede": {
    en: '"For where two or three gather in my name, there am I with them." Join us each week as we share in fellowship, prayer, and the Word of God.',
    am: '"ሁለት ወይም ሦስት በስሜ በሚሰበሰቡበት፥ በዚያ በመካከላቸው እሆናለሁ።" በኅብረት፣ በጸሎትና በእግዚአብሔር ቃል ለመካፈል በየሳምንቱ ይቀላቀሉን።',
  },
  "hero.cta1": { en: "Our Beliefs & History", am: "እምነታችንና ታሪካችን" },
  "hero.cta2": { en: "Get Directions", am: "አቅጣጫ ያግኙ" },

  "home.welcome.h": { en: "You're welcome here", am: "እንኳን ደህና መጡ" },
  "home.welcome.p": {
    en: "Whatever brought you here today, we're glad you came. Here's what to expect this week.",
    am: "ዛሬ ምንም ያመጣዎት ነገር ቢሆን፣ በመምጣትዎ ደስ ብሎናል። በዚህ ሳምንት የሚጠብቅዎት ይህ ነው።",
  },
  "home.sunday.h": { en: "Sunday Worship", am: "የእሁድ አምልኮ" },
  "home.sunday.p": {
    en: "9:00 AM and 11:00 AM — main sanctuary. Children's ministry runs during both services.",
    am: "ጠዋት 9:00 እና 11:00 — ዋናው ቤተ መቅደስ። የሕፃናት አገልግሎት በሁለቱም ስብሰባዎች ይካሄዳል።",
  },
  "home.wed.h": { en: "Wednesday Bible Study", am: "የረቡዕ የመጽሐፍ ቅዱስ ጥናት" },
  "home.wed.p": {
    en: "7:00 PM in the fellowship hall — open to all ages, no registration needed.",
    am: "ከቀኑ 7:00 በኅብረት አዳራሽ — ለሁሉም ዕድሜ ክፍት፣ ምዝገባ አያስፈልግም።",
  },
  "home.new.h": { en: "New Here?", am: "አዲስ ነዎት?" },
  "home.new.p": {
    en: "Stop by the welcome table before service — someone will walk you to your seat and answer any questions.",
    am: "ከአገልግሎት በፊት በአቀባበል ጠረጴዛ ያልፉ — አንድ ሰው ወደ መቀመጫዎ ይወስድዎታል፣ ጥያቄዎችንም ይመልስልዎታል።",
  },
  "home.thissun.h": { en: "This Sunday", am: "በዚህ እሁድ" },
  "home.thissun.p": {
    en: '"Rooted, Not Shaken" — Pastor James Okafor continues the series on Colossians.',
    am: '"ሥር የሰደደ፣ የማይናወጥ" — ፓስተር ጄምስ ኦካፎር በቆላስይስ ላይ ተከታታይ ትምህርቱን ይቀጥላል።',
  },
  "home.address.h": { en: "Address", am: "አድራሻ" },
  "home.address.p": { en: "Bole Sub-city, Addis Ababa, Ethiopia", am: "ቦሌ ክፍለ ከተማ፣ አዲስ አበባ፣ ኢትዮጵያ" },
  "home.contact.h": { en: "Contact", am: "ያግኙን" },
  "home.contact.p": { en: "+251 11 000 0000 · hello@gospelforgeneration.org", am: "+251 11 000 0000 · hello@gospelforgeneration.org" },
  "location.eyebrow": { en: "Come worship with us", am: "ከእኛ ጋር ያምልኩ" },
  "location.title": { en: "There’s a place for you here", am: "እዚህ ለእርስዎ ቦታ አለ" },
  "location.body": {
    en: "We gather in Addis Ababa as one family across generations. Open the map for the best route to our church.",
    am: "በአዲስ አበባ እንደ አንድ የትውልድ ቤተሰብ እንሰበሰባለን። ወደ ቤተ ክርስቲያናችን የሚወስደውን ቀላሉን መንገድ ለማየት ካርታውን ይክፈቱ።",
  },
  "location.mapLabel": { en: "Open church location", am: "የቤተ ክርስቲያኑን አድራሻ ይክፈቱ" },
  "home.verse.text": {
    en: '"For where two or three gather in my name, there am I with them."',
    am: '"ሁለት ወይም ሦስት በስሜ በሚሰበሰቡበት፥ በዚያ በመካከላቸው እሆናለሁ።"',
  },
  "home.verse.ref": { en: "Matthew 18:20", am: "ማቴዎስ 18:20" },

  "about.h": { en: "Our story and our faith", am: "ታሪካችንና እምነታችን" },
  "about.who.h": { en: "Who we are", am: "እኛ ማን ነን" },
  "about.who.p1": {
    en: "Gospel for Generation Church is an evangelical congregation built on the belief that the gospel is for every generation — from the youngest child in our nursery to the oldest saint in our pews.",
    am: "ወንጌል ለትውልድ ቤተ ክርስቲያን ወንጌል ለሁሉም ትውልድ ነው በሚል እምነት ላይ የተመሠረተ የወንጌላውያን ጉባኤ ነው — በሕፃናት ክፍል ካለው ትንሹ ልጅ ጀምሮ እስከ ትልቁ አማኝ ድረስ።",
  },
  "about.who.p2": {
    en: "We're a Bible-teaching church: our sermons, small groups, and children's classes all return to the same source — the Word of God, taught plainly and applied honestly.",
    am: "መጽሐፍ ቅዱስን የምናስተምር ቤተ ክርስቲያን ነን፤ ስብከቶቻችን፣ አነስተኛ ቡድኖቻችንና የሕፃናት ትምህርቶቻችን ሁሉ ወደ አንድ ምንጭ ይመለሳሉ — የእግዚአብሔር ቃል።",
  },
  "about.believe.h": { en: "What we believe", am: "የምናምነው" },
  "about.believe.p": {
    en: "We hold to the core convictions of historic evangelical faith: the authority of Scripture, salvation by grace through faith in Jesus Christ, and the call for every believer to live a life shaped by the gospel.",
    am: "የታሪካዊ ወንጌላዊ እምነት ዋና እምነቶችን እንይዛለን፦ የቅዱሳት መጻሕፍት ሥልጣን፣ በኢየሱስ ክርስቶስ በማመን በጸጋ መዳን፣ እና እያንዳንዱ አማኝ በወንጌል የተቀረጸ ሕይወት እንዲኖር መጠራት።",
  },
  "about.lead.h": { en: "Leadership", am: "አመራር" },
  "about.lead.p": {
    en: "Pastor James Okafor leads our congregation, supported by elders, deacons, and volunteers serving across worship, children's and youth ministry, outreach, and pastoral care.",
    am: "ፓስተር ጄምስ ኦካፎር ጉባኤያችንን ይመራል፤ በአምልኮ፣ በሕፃናትና ወጣቶች አገልግሎት፣ በተልእኮና በእረኝነት እንክብካቤ በሚያገለግሉ ሽማግሌዎች፣ ዲያቆናትና በጎ ፈቃደኞች ይደገፋል።",
  },

  "events.h": { en: "Upcoming events", am: "ቀጣይ ዝግጅቶች" },
  "events.p": { en: "Everything happening across the church family this season.", am: "በዚህ ወቅት በቤተ ክርስቲያን ቤተሰብ ውስጥ የሚካሄዱ ሁሉም ነገሮች።" },
  "events.empty": { en: "No events scheduled yet.", am: "እስካሁን የተያዘ ዝግጅት የለም።" },

  "sermons.h": { en: "Recent sermons", am: "የቅርብ ጊዜ ስብከቶች" },
  "sermons.p": { en: "Catch up on a message, or revisit one that stuck with you.", am: "ያመለጠዎትን መልእክት ያዳምጡ፣ ወይም የነካዎትን ይድገሙ።" },
  "sermons.note": {
    en: "Audio/video embed goes here once connected to your media host.",
    am: "ወደ ሚዲያ ማስተናገጃዎ ከተገናኘ በኋላ የድምጽ/ቪዲዮ ይዘት እዚህ ይታያል።",
  },
  "sermons.watch": { en: "Watch or listen", am: "ይመልከቱ ወይም ያዳምጡ" },

  "give.h": { en: "Give", am: "ስጦታ" },
  "give.p": {
    en: "Your giving supports our ministries, staff, missions partners, and building — thank you for your generosity.",
    am: "ስጦታዎ አገልግሎቶቻችንን፣ ሠራተኞቻችንን፣ የተልእኮ አጋሮቻችንንና ሕንፃችንን ይደግፋል — ስለ ልግስናዎ እናመሰግናለን።",
  },
  "give.makeagift": { en: "Make a Gift", am: "ስጦታ ያድርጉ" },
  "give.fund.general": { en: "General Fund", am: "አጠቃላይ ፈንድ" },
  "give.fund.missions": { en: "Missions", am: "ተልእኮ" },
  "give.fund.building": { en: "Building Fund", am: "የሕንፃ ፈንድ" },
  "give.fund.benevolence": { en: "Benevolence", am: "የበጎ አድራጎት" },
  "give.amount": { en: "Amount", am: "መጠን" },
  "give.custom": { en: "Other amount", am: "ሌላ መጠን" },
  "give.note": { en: "Note (optional)", am: "ማስታወሻ (አማራጭ)" },
  "give.now": { en: "Record my gift", am: "ስጦታዬን መዝግብ" },
  "give.signin": { en: "Sign in to record a gift", am: "ስጦታ ለመመዝገብ ይግቡ" },
  "give.thanks": { en: "Thank you! Your gift has been recorded in your giving history.", am: "እናመሰግናለን! ስጦታዎ በስጦታ ታሪክዎ ውስጥ ተመዝግቧል።" },
  "give.other.h": { en: "Other ways to give", am: "ሌሎች የመስጫ መንገዶች" },
  "give.other.p": {
    en: "Cash or check gifts can be placed in the offering box during any service, or brought to the church office.",
    am: "የገንዘብ ወይም የቼክ ስጦታዎች በማንኛውም አገልግሎት ጊዜ በመባ ሳጥን ውስጥ ሊቀመጡ ወይም ወደ ቤተ ክርስቲያኑ ጽ/ቤት ሊመጡ ይችላሉ።",
  },
  "give.processor": {
    en: "Card and mobile-money processing is not connected yet. Gifts recorded here are logged to your member giving history.",
    am: "የካርድና የሞባይል ገንዘብ ክፍያ እስካሁን አልተገናኘም። እዚህ የተመዘገቡ ስጦታዎች በአባልነት ስጦታ ታሪክዎ ውስጥ ይመዘገባሉ።",
  },

  "portal.h": { en: "Member Portal", am: "የአባላት ገጽ" },
  "portal.p": {
    en: "View your giving history, update your household info, and manage prayer requests.",
    am: "የስጦታ ታሪክዎን ይመልከቱ፣ የቤተሰብ መረጃዎን ያዘምኑ፣ የጸሎት ጥያቄዎችንም ያስተዳድሩ።",
  },
  "portal.welcome": { en: "Welcome back,", am: "እንኳን በደህና ተመለሱ፣" },
  "portal.giving": { en: "Giving this year", am: "የዘንድሮ ስጦታ" },
  "portal.groups": { en: "Recorded gifts", am: "የተመዘገቡ ስጦታዎች" },
  "portal.prayer": { en: "Open prayer requests", am: "ክፍት የጸሎት ጥያቄዎች" },
  "portal.household.h": { en: "Household", am: "ቤተሰብ" },
  "portal.household.save": { en: "Save details", am: "መረጃ አስቀምጥ" },
  "portal.saved": { en: "Saved.", am: "ተቀምጧል።" },
  "portal.name": { en: "Full name", am: "ሙሉ ስም" },
  "portal.phone": { en: "Phone", am: "ስልክ" },
  "portal.address": { en: "Address", am: "አድራሻ" },
  "portal.prayerreq.h": { en: "Prayer Requests", am: "የጸሎት ጥያቄዎች" },
  "portal.prayerreq.p": { en: "Submit a request and our pastoral team will follow up privately.", am: "ጥያቄ ያስገቡ፤ የእረኝነት ቡድናችን በግል ይከታተላል።" },
  "portal.prayer.placeholder": { en: "Share your request…", am: "ጥያቄዎን ያካፍሉ…" },
  "portal.prayer.submit": { en: "Submit request", am: "ጥያቄ አስገባ" },
  "portal.prayer.none": { en: "No prayer requests yet.", am: "እስካሁን የጸሎት ጥያቄ የለም።" },
  "portal.prayer.close": { en: "Mark answered", am: "እንደተመለሰ ምልክት አድርግ" },
  "portal.history.h": { en: "Giving history", am: "የስጦታ ታሪክ" },
  "portal.history.none": { en: "No gifts recorded yet.", am: "እስካሁን የተመዘገበ ስጦታ የለም።" },
  "portal.signout": { en: "Sign Out", am: "ውጣ" },

  "auth.h": { en: "Member sign in", am: "የአባል መግቢያ" },
  "auth.p": { en: "Sign in or create a member account to access the portal.", am: "ገጹን ለመጠቀም ይግቡ ወይም የአባልነት መለያ ይክፈቱ።" },
  "auth.email": { en: "Email", am: "ኢሜይል" },
  "auth.password": { en: "Password", am: "የይለፍ ቃል" },
  "auth.name": { en: "Full name", am: "ሙሉ ስም" },
  "auth.signin": { en: "Sign In", am: "ግባ" },
  "auth.signup": { en: "Create account", am: "መለያ ክፈት" },
  "auth.google": { en: "Continue with Google", am: "በGoogle ይቀጥሉ" },
  "auth.toSignup": { en: "New here? Create an account", am: "አዲስ ነዎት? መለያ ይክፈቱ" },
  "auth.toSignin": { en: "Already a member? Sign in", am: "አባል ነዎት? ይግቡ" },
  "auth.or": { en: "or", am: "ወይም" },

  "footer.times.h": { en: "Service Times", am: "የአገልግሎት ሰዓታት" },
  "footer.times.p": { en: "Sunday — 9:00 AM & 11:00 AM · Wednesday Bible Study — 7:00 PM", am: "እሁድ — ጠዋት 9:00 እና 11:00 · የረቡዕ ጥናት — ከቀኑ 7:00" },
  "footer.connect.h": { en: "Connect", am: "ይገናኙን" },
  "footer.copyright": {
    en: "© 2026 Gospel for Generation Church. Built with care for the whole family of faith.",
    am: "© 2026 ወንጌል ለትውልድ ቤተ ክርስቲያን። ለመላው የእምነት ቤተሰብ በጥንቃቄ የተሠራ።",
  },
  "common.loading": { en: "Loading…", am: "በመጫን ላይ…" },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof strings | string) => string;
  pick: (en: string | null | undefined, am: string | null | undefined) => string;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("gfg-lang");
    if (stored === "am" || stored === "en") setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("gfg-lang", l);
  }, []);

  const t = useCallback((key: string) => strings[key]?.[lang] ?? key, [lang]);
  const pick = useCallback(
    (en: string | null | undefined, am: string | null | undefined) => (lang === "am" ? am || en || "" : en || ""),
    [lang],
  );

  return <LanguageContext.Provider value={{ lang, setLang, t, pick }}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
