import { createContext, useContext, useMemo, useState } from "react";
import { mockTrainees } from "../data/mockTrainees";
import { todayISO } from "../lib/traineeSelectors";

const TraineesContext = createContext(null);

// הדמו של אזור המתאמן רץ תמיד כיובל כהן. כשיהיה לוגין אמיתי, זה המקום להחליף.
export const DEMO_TRAINEE_ID = 1;

const today = todayISO;

export function TraineesProvider({ children }) {
  const [trainees, setTrainees] = useState(mockTrainees);

  const value = useMemo(() => {
    function getTraineeById(id) {
      return trainees.find((t) => String(t.id) === String(id));
    }

    function updateTraineeState(id, updater) {
      setTrainees((prev) =>
        prev.map((t) => (String(t.id) === String(id) ? updater(t) : t))
      );
    }

    function markAsPaid(id) {
      const date = today();
      updateTraineeState(id, (t) => ({
        ...t,
        paymentStatus: "paid",
        lastPaymentDate: date,
        paymentHistory: [...t.paymentHistory, { date, amount: t.price }],
      }));
    }

    function addSession(id) {
      const date = today();
      updateTraineeState(id, (t) => ({
        ...t,
        sessionsRemaining: Math.max(0, t.sessionsRemaining - 1),
        lastSessionDate: date,
        sessionHistory: [...t.sessionHistory, { date }],
      }));
    }

    // כניסה עצמית של מתאמן ("צ'ק-אין לאימון") - כמו addSession, ובנוסף מזכה
    // ב-10 נק' Refaeli Cash (לפי EARNING_RULES), כדי שהדגמת הצבירה תהיה חיה.
    function checkIn(id) {
      const date = today();
      updateTraineeState(id, (t) => ({
        ...t,
        sessionsRemaining: Math.max(0, t.sessionsRemaining - 1),
        lastSessionDate: date,
        sessionHistory: [...t.sessionHistory, { date }],
        points: t.points + 10,
      }));
    }

    // מימוש פרס מהחנות: מוריד נקודות ושומר ב"הפרסים שלי" - בזיכרון בלבד, מתאפס ברענון
    function redeem(id, reward) {
      updateTraineeState(id, (t) => ({
        ...t,
        points: t.points - reward.cost,
        purchasedRewards: [
          ...(t.purchasedRewards ?? []),
          { id: reward.id, name: reward.name, cost: reward.cost, date: today() },
        ],
      }));
    }

    function updateTrainee(id, updates) {
      updateTraineeState(id, (t) => ({ ...t, ...updates }));
    }

    return {
      trainees,
      getTraineeById,
      markAsPaid,
      addSession,
      checkIn,
      redeem,
      updateTrainee,
    };
  }, [trainees]);

  return (
    <TraineesContext.Provider value={value}>
      {children}
    </TraineesContext.Provider>
  );
}

export function useTrainees() {
  const ctx = useContext(TraineesContext);
  if (!ctx) {
    throw new Error("useTrainees must be used within a TraineesProvider");
  }
  return ctx;
}

export function useCurrentTrainee() {
  const { getTraineeById } = useTrainees();
  return getTraineeById(DEMO_TRAINEE_ID);
}
