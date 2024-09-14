import styles from "./pages/Landing.module.css";
import SvgMarkup from "./SvgMarkup";

function CloseFormNudge({ onCloseModal }) {
  return (
    <div className={styles["form-icon-box"]}>
      <SvgMarkup
        classList="close-form"
        fragId="xmark"
        styles={styles}
        onClick={onCloseModal}
      />
    </div>
  );
}

export default CloseFormNudge;
