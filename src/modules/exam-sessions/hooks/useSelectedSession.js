import { useState, useEffect } from "react";
import useGetExamSession from "./query/useGetExamSession";

const STORAGE_KEY = "selected_exam_session_id";

export const useSelectedSession = () => {
  const { data: sessionData, isLoading, refetch } = useGetExamSession({ all: true });
  const sessions = sessionData?.data || [];

  const [selectedId, setSelectedId] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "";
  });

  useEffect(() => {
    if (sessions.length > 0) {
      // If stored id exists in sessions list, keep it
      const exists = sessions.find((s) => s._id === selectedId);
      if (!exists) {
        // Otherwise pick the active session or first one
        const active = sessions.find((s) => s.isActive) || sessions[0];
        if (active) {
          setSelectedId(active._id);
          localStorage.setItem(STORAGE_KEY, active._id);
        }
      }
    }
  }, [sessions, selectedId]);

  const selectSession = (id) => {
    setSelectedId(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  const currentSession = sessions.find((s) => s._id === selectedId) || null;

  return {
    sessions,
    selectedId,
    currentSession,
    selectSession,
    isLoading,
    refetch,
  };
};

export default useSelectedSession;
