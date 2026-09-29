export const EARNING_RULES = [
  { label: "הגעה לאימון", points: 10 },
  { label: "עמידה ביעד משקל חודשי", points: 50 },
  { label: "רצף של 4 שבועות רצופים", points: 30 },
  { label: "עדכון תמונת התקדמות", points: 15 },
  { label: "הזמנת חבר/ה חדש/ה למועדון", points: 100 },
];

// נשאר לשימוש לשונית ה-Cash של המנהל (RefaeliCashTab) - לא לגעת בלי לבדוק את שני המקומות
export const REWARDS = [
  { icon: "🏷️", name: "10% הנחה על החודש הבא", cost: 200 },
  { icon: "🥤", name: "מוצר חלבון מתנה", cost: 350 },
  { icon: "🎁", name: "אימון פרטי מתנה", cost: 500 },
  { icon: "👕", name: "חולצת Refaeli Fitness", cost: 400 },
];

// קטלוג החנות של אזור המתאמן - מרחיב את REWARDS עם קטגוריה/סוג/תיאור/אייקון תלת-ממדי
export const STORE_CATALOG = [
  {
    id: "discount-month",
    name: "10% הנחה על החודש הבא",
    description: "מופעל אוטומטית בחיוב הבא",
    cost: 200,
    category: "הנחות ומנוי",
    type: "digital",
    icon3d: "medal",
  },
  {
    id: "protein",
    name: "מוצר חלבון מתנה",
    description: "לבחירה מהמקרר בסטודיו",
    cost: 350,
    category: "מוצרים",
    type: "pickup",
    icon3d: "drink",
  },
  {
    id: "private-session",
    name: "אימון פרטי מתנה",
    description: "מפגש אישי עם עמית, 45 דק'",
    cost: 500,
    category: "אימונים",
    type: "pickup",
    icon3d: "trophy",
  },
  {
    id: "tshirt",
    name: "חולצת Refaeli Fitness",
    description: "מידות S–XXL, איסוף מהסטודיו",
    cost: 400,
    category: "מוצרים",
    type: "pickup",
    icon3d: "tshirt",
  },
  {
    id: "shaker",
    name: "בקבוק שייקר ממותג",
    description: "עיצוב מיוחד Refaeli Fitness",
    cost: 150,
    category: "מוצרים",
    type: "pickup",
    icon3d: "waterdrop",
  },
  {
    id: "free-month",
    name: "חודש מנוי נוסף מתנה",
    description: "מתווסף בסוף המנוי הנוכחי",
    cost: 900,
    category: "הנחות ומנוי",
    type: "digital",
    icon3d: "gift",
  },
  {
    id: "nutrition",
    name: "ליווי תזונתי אישי",
    description: "מפגש בודד עם תזונאי הסטודיו",
    cost: 600,
    category: "אימונים",
    type: "pickup",
    icon3d: "salad",
  },
  {
    id: "referral",
    name: "כניסת אורח/ת חינם",
    description: "הביאו חבר/ה לאימון ניסיון",
    cost: 250,
    category: "הנחות ומנוי",
    type: "digital",
    icon3d: "handshake",
  },
];

export const STORE_CATEGORIES = [
  "הכל",
  ...Array.from(new Set(STORE_CATALOG.map((r) => r.category))),
];
