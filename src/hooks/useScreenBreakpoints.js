import { useState } from "react";
import {
  LAYOUT_BREAKPOINT,
  LAYOUT_MOBILE_BREAKPOINT,
  LAYOUT_SMALLER_DESKTOP_BREAKPOINT,
} from "../utils/constants";
import { useEffect } from "react";

export function useScreenBreakpoints() {
  const [mobileBreakpointMatches, setMobileBreakpointMatches] = useState(
    window.matchMedia(LAYOUT_MOBILE_BREAKPOINT).matches,
  );
  const [largeScreenBreakpointMatches, setLargeScreenBreakpointMatches] =
    useState(window.matchMedia(LAYOUT_BREAKPOINT).matches);
  const [tabletBreakpointMatches, setTableBreakpointMatches] = useState(
    window.matchMedia(LAYOUT_SMALLER_DESKTOP_BREAKPOINT).matches,
  );

  useEffect(() => {
    function handleMatchEvent(e) {
      if (e.matches && !mobileBreakpointMatches) {
        setMobileBreakpointMatches((_) => true);
      }
      if (!e.matches && mobileBreakpointMatches)
        setMobileBreakpointMatches((_) => false);
    }

    const layoutBreakpointTrigger = window.matchMedia(LAYOUT_MOBILE_BREAKPOINT);

    layoutBreakpointTrigger.addEventListener("change", handleMatchEvent);

    return () => {
      layoutBreakpointTrigger.removeEventListener("change", handleMatchEvent);
    };
  }, [mobileBreakpointMatches]);

  useEffect(() => {
    function handleMatchEvent(e) {
      if (e.matches && !largeScreenBreakpointMatches)
        setLargeScreenBreakpointMatches((_) => true);
      if (!e.matches && largeScreenBreakpointMatches)
        setLargeScreenBreakpointMatches((_) => false);
    }

    const layoutBreakpointTrigger = window.matchMedia(LAYOUT_BREAKPOINT);

    layoutBreakpointTrigger.addEventListener("change", handleMatchEvent);

    return () => {
      layoutBreakpointTrigger.removeEventListener("change", handleMatchEvent);
    };
  }, [largeScreenBreakpointMatches]);

  useEffect(() => {
    function handleMatchEvent(e) {
      if (e.matches && !tabletBreakpointMatches)
        setTableBreakpointMatches((_) => true);
      if (!e.matches && tabletBreakpointMatches)
        setTableBreakpointMatches((_) => false);
    }

    const layoutBreakpointTrigger = window.matchMedia(
      LAYOUT_SMALLER_DESKTOP_BREAKPOINT,
    );

    layoutBreakpointTrigger.addEventListener("change", handleMatchEvent);

    return () => {
      layoutBreakpointTrigger.removeEventListener("change", handleMatchEvent);
    };
  }, [tabletBreakpointMatches]);

  return {
    mobileBreakpointMatches,
    largeScreenBreakpointMatches,
    tabletBreakpointMatches,
  };
}
