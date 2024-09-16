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

function InputOverlayComponent() {
  const [text, setText] = useState("");
  console.log("the input got rend");
  return (
    <div
      className={styles["row-actions-text-input"]}
      contentEditable={true}
      onInput={(e) => setText(e.target.textContent)}
    ></div>
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

function Open({ children, opens }) {
  const { open } = useContext(OverlayContext);
  return cloneElement(children, {
    onClick: () => {
      open(opens);
    },
  });
}

function Window({
  name,
  objectToOverlay,
  disableOverlayInterceptor = false,
  type,
}) {
  const { openName } = useContext(OverlayContext);
  const { overlayContainerRef } = useContext(AuthContext);
  if (name != openName) return null;
  return createPortal(
    <Overlay
      objectToOverlay={objectToOverlay}
      disableOverlayInterceptor={disableOverlayInterceptor}
    >
      {type === "input" && <InputOverlayComponent />}
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
