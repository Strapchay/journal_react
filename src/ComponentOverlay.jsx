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

function Overlay({ children, objectToOverlay, disableOverlayInterceptor }) {
  const { top, left, width, height } =
    objectToOverlay.current.getBoundingClientRect();
  const { close } = useContext(OverlayContext);

  return (
    <div className={styles["overlay"]}>
      <div>
        <div
          className={[
            styles["overlay-filler"],
            !disableOverlayInterceptor ? styles["fill"] : "",
          ].join(" ")}
          onClick={close}
        ></div>
        <div
          className={styles["overlay-content"]}
          style={{
            top: `${top}px`,
            left: `${left}px`,
          }}
        >
          <div
            className={styles["overlay-content-fill"]}
            style={{
              width: `${width}px`,
              height: `${height}px`,
            }}
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

  if (click)
    return cloneElement(children, {
      onClick: () => open(opens),
    });
  if (!click) open(opens);
}

function Window({
  children,
  name,
  objectToOverlay,
  disableOverlayInterceptor = false,
}) {
  const { openName, close } = useContext(OverlayContext);
  const { overlayContainerRef } = useContext(AuthContext);
  if (name != openName) return null;

  return createPortal(
    <Overlay
      objectToOverlay={objectToOverlay}
      disableOverlayInterceptor={disableOverlayInterceptor}
    >
      {cloneElement(children, {
        onSubmit: () => {
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
