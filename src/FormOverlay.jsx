import CloseFormNudge from "./CloseFormButton";
import styles from "./pages/Landing.module.css";
import { formRenderInfo, formRenderingHeading } from "./utils/helpers";

function FormOverlay({ children, onCloseModal, formType, refObj }) {
  return (
    <div className={styles["login-overlay"]}>
      <div className={styles["login-overlay-bkg"]} ref={refObj}></div>
      <div className={styles["form-container"]}>
        <div className={styles[`${formType}-form-container`]}>
          <CloseFormNudge onCloseModal={onCloseModal} />
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
