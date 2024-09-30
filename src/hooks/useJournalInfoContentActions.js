import { useContext } from "react";
import { AuthContext } from "../ProtectedRoute";
import { useRef } from "react";
import { useUpdateJournalInfo } from "../features/journals/useUpdateJournalInfo";
import { useEffect } from "react";
import { THROTTLE_TIMER } from "../utils/constants";

export function useJournalInfoContentActions() {
  const { journalState, dispatch } = useContext(AuthContext);
  const journalNameRef = useRef(null);
  const journalDescRef = useRef(null);
  const throttleTimerRef = useRef(null);
  const { updateJournalInfo } = useUpdateJournalInfo();

  useEffect(() => {
    if (!journalNameRef.current.textContent)
      journalNameRef.current.textContent = journalState?.name?.trim();
    if (!journalDescRef.current.textContent)
      journalDescRef.current.textContent = journalState?.description?.trim();
  }, [journalState]);

  function getRefTypeValue(type) {
    if (type === "name") return journalNameRef.current.textContent.trim();
    if (type === "description")
      return journalDescRef.current.textContent.trim();
  }

  function handleJournalInfoChange(type) {
    if (throttleTimerRef.current) {
      clearInterval(throttleTimerRef.current);
      throttleTimerRef.current = null;
    }

    dispatch({
      type: "updateJournalInfo",
      payload: {
        [type]: getRefTypeValue(type),
      },
    });
    throttleTimerRef.current = setTimeout(() => {
      const payload = {
        [`journal_${type}`]: getRefTypeValue(type),
      };
      updateJournalInfo(payload);
    }, THROTTLE_TIMER);
  }

  return { handleJournalInfoChange, journalNameRef, journalDescRef };
}
