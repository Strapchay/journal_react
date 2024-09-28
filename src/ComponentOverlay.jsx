import { useState } from "react";
import styles from "./pages/Journal.module.css";
import { createPortal } from "react-dom";
import { createContext } from "react";
import { useContext } from "react";
import { cloneElement } from "react";
import { AuthContext } from "./ProtectedRoute";
import { useRef } from "react";

export const OverlayContext = createContext();

function ComponentOverlay({ children }) {
  const [openName, setOpenName] = useState("");
  const close = () => setOpenName("");
  const open = setOpenName;
  const extraActionRef = useRef(null);

  function addExtraAction(extraAction) {
    extraActionRef.current = extraAction;
  }

  function executeExtraAction() {
    extraActionRef.current?.();
    console.log("completed execution");
    extraActionRef.current = null;
  }

  return (
    <OverlayContext.Provider
      value={{ open, close, openName, addExtraAction, executeExtraAction }}
    >
      {children}
    </OverlayContext.Provider>
  );
}

function Overlay({
  children,
  objectToOverlay,
  disableOverlayInterceptor,
  overlayState,
  decreaseOverlayState,
}) {
  const { top, left, width, height } =
    objectToOverlay?.current?.getBoundingClientRect() ?? {};
  const { close, openName, executeExtraAction } = useContext(OverlayContext);

  function handleCloseOverlay() {
    executeExtraAction?.();
    close();
    decreaseOverlayState(openName);
  }

  return (
    <div
      className={styles["overlay"]}
      style={{ zIndex: overlayState[openName] }}
    >
      <div>
        <div
          className={[
            styles["overlay-filler"],
            !disableOverlayInterceptor ? styles["fill"] : "",
          ].join(" ")}
          onClick={handleCloseOverlay}
          style={
            !objectToOverlay?.current
              ? { backgroundColor: "rgba(15,15,15,0.6)" }
              : {}
          }
        ></div>
        <div
          className={styles["overlay-content"]}
          style={
            objectToOverlay?.current
              ? {
                  top: `${top}px`,
                  left: `${left}px`,
                }
              : { top: "40%", left: "40%" }
          }
        >
          <div
            className={styles["overlay-content-fill"]}
            style={
              objectToOverlay?.current
                ? {
                    width: `${width}px`,
                    height: `${overlayState[openName] > 1 ? height : "0"}px`,
                  }
                : {}
            }
          ></div>
          <div className={styles["overlay-content-holder"]}>
            <div className={styles["overlay-content-content"]}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Open({
  children,
  opens,
  click = true,
  conditional = null,
  beforeRender = null,
}) {
  const { open } = useContext(OverlayContext);
  const { increaseOverlayCountMap } = useContext(AuthContext);

  if (click)
    return cloneElement(children, {
      onClick: () => {
        if (conditional === null || conditional) {
          if (beforeRender) beforeRender?.();
          increaseOverlayCountMap(opens);
          open(opens);
        }
      },
    });
  if (!click) open(opens);
}

function Window({
  children,
  name,
  objectToOverlay = null,
  disableOverlayInterceptor = false,
  beforeUnmount = null,
}) {
  const { openName, close } = useContext(OverlayContext);
  const { overlayContainerRef, overlayCountMap, decreaseOverlayCountMap } =
    useContext(AuthContext);
  if (name != openName) return null;

  return createPortal(
    <Overlay
      objectToOverlay={objectToOverlay}
      disableOverlayInterceptor={disableOverlayInterceptor}
      overlayState={overlayCountMap}
      decreaseOverlayState={decreaseOverlayCountMap}
    >
      {cloneElement(children, {
        onSubmit: () => {
          //might have to rename to onUnMount
          decreaseOverlayCountMap(name);
          beforeUnmount?.();
          close();
        },
      })}
    </Overlay>,
    overlayContainerRef.current,
  );
}

ComponentOverlay.Open = Open;
ComponentOverlay.Window = Window;
export default ComponentOverlay;
