import { createContext, useContext, useMemo, useState } from "react";
import { mockTrainees } from "../data/mockTrainees";

const TraineesContext = createContext(null);

function today() {
  return new Date().toISOString().slice(0, 10);
}

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

    function updateTrainee(id, updates) {
      updateTraineeState(id, (t) => ({ ...t, ...updates }));
    }

    return {
      trainees,
      getTraineeById,
      markAsPaid,
      addSession,
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
