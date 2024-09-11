import icons from "../public/icons.svg";

function SvgMarkup({ classList, fragId, styles, onCloseModal }) {
  return (
    <div
      className={[styles["svg-icon-box"], styles[`${classList}`]].join(" ")}
      onClick={onCloseModal}
    >
      <svg className={styles["svg-icon"]}>
        <use href={`${icons}#${fragId}`}></use>
      </svg>
    </div>
  );
}

export default SvgMarkup;
