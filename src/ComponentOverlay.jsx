import { useState } from "react";
import styles from "./pages/Journal.module.css";
import { createPortal } from "react-dom";
import { createContext } from "react";
import { useContext } from "react";
import { cloneElement } from "react";
import { AuthContext } from "./ProtectedRoute";

const OverlayContext = createContext();

function ComponentOverlay({ children }) {
  const [openName, setOpenName] = useState("");
  const close = () => setOpenName("");
  const open = setOpenName;
  return (
    <OverlayContext.Provider value={{ open, close, openName }}>
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
  const { close, openName } = useContext(OverlayContext);

  function handleCloseOverlay() {
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

function Open({ children, opens, click = true }) {
  const { open } = useContext(OverlayContext);
  const { increaseOverlayCountMap } = useContext(AuthContext);

  if (click)
    return cloneElement(children, {
      onClick: () => {
        increaseOverlayCountMap(opens);
        open(opens);
      },
    });
  if (!click) open(opens);
}

function Window({
  children,
  name,
  objectToOverlay = null,
  disableOverlayInterceptor = false,
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
          decreaseOverlayCountMap(name);
          close();
        },
      })}
    </Overlay>,
    overlayContainerRef.current,
  );
}

// return createPortal(children, objectToOverlay.current);
// function ComponentOverlay({
//   objectToOverlay,
//   type,
//   disableOverlayInterceptor,
// }) {
//   return (
//     <Overlay
//       objectToOverlay={objectToOverlay}
//       disableOverlayInterceptor={disableOverlayInterceptor}
//     >
//       {type === "input" && <InputOverlayComponent />}
//     </Overlay>
//   );
// }
ComponentOverlay.Open = Open;
ComponentOverlay.Window = Window;
export default ComponentOverlay;
