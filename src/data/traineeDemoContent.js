// תוכן דמו סטטי לאזור המתאמן (הודעות, ארוחות) - לא נתוני מתאמן אמיתיים, רק להדגמת הקונספט.

export const COACH_MESSAGE = {
  text: 'שיפור יפה במשקל החודש! בוא נשמור על הרצף גם השבוע 💪 — עמית',
  date: null, // מוצג כ"היום"
};

export const NOTIFICATIONS = [
  { icon: "🏆", text: "קיבלת 10 נק' על אימון שהושלם", time: "היום" },
  { icon: "🔥", text: "שמרת על רצף של 4 שבועות רצופים!", time: "אתמול" },
  { icon: "🎁", text: "פרס חדש נוסף לחנות: אימון פרטי מתנה", time: "לפני 3 ימים" },
  { icon: "📈", text: "עדכון מדידה חדש נשמר בהצלחה", time: "לפני שבוע" },
];

export const MEAL_PLAN = [
  { key: "breakfast", label: "בוקר", suggestion: "שייק חלבון + שיבולת שועל" },
  { key: "lunch", label: "צהריים", suggestion: "חזה עוף + אורז מלא + ירקות" },
  { key: "dinner", label: "ערב", suggestion: "סלט טונה + ביצה קשה" },
];
