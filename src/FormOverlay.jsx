import { useContext } from "react";
import CloseFormNudge from "./CloseFormButton";
import styles from "./pages/Landing.module.css";
import { formRenderInfo, formRenderingHeading } from "./utils/helpers";
import { ModalContext } from "./Modal";

function FormOverlay({ children, formType }) {
  const { refObj, close } = useContext(ModalContext);
  return (
    <div className={styles["login-overlay"]} ref={refObj}>
      <div className={styles["login-overlay-bkg"]}></div>
      <div className={styles["form-container"]}>
        <div className={styles[`${formType}-form-container`]}>
          <CloseFormNudge onCloseModal={close} />
          <h1 className={styles["form-heading"]}>
            {formRenderingHeading(formType)}
          </h1>
          <div className={styles["form-content"]}>
            <div className={styles["form-content-info"]}>
              Enter your information below to {formRenderInfo(formType)}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormOverlay;
