import icons from "../public/icons.svg";

function SvgMarkup({ classList = "", fragId, styles, onClick }) {
  const classLists = classList.split(" ");
  const classListStyles =
    classLists.length > 1
      ? classLists.map((cls) => styles[cls])
      : classList.length === 1
        ? [styles[classList]]
        : [classList];
  console.log("the classList styles", classList);

  return (
    <div
      className={[styles["svg-icon-box"], ...classListStyles].join(" ")}
      onClick={() => onClick?.()}
    >
      <svg className={styles["svg-icon"]}>
        <use href={`${icons}#${fragId}`}></use>
      </svg>
    </div>
  );
}

export default SvgMarkup;
