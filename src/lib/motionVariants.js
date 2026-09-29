// קבועי אנימציה משותפים לכניסת רשימות/רשתות בגלילה (stagger), כדי שלא לשכפל
// אותם בכל מסך. שימוש: <motion.div variants={staggerContainer} initial="hidden"
// animate="show"> מסביב, ו-<motion.div variants={staggerItem}> על כל פריט.
// רק transform (y) ו-opacity, כדי שזה ירוץ חלק גם בטלפון.

export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.02 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: "easeOut" },
  },
};
