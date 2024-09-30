import styles from "../Journal.module.css";
import HeadComponent from "./HeadComponent";
import RuleComponent from "./PropertyRuleComponent";
import TableContent from "./TableContent";

function TableComponent() {
  return (
    <div className={styles["table-container"]}>
      <div className={styles["main-table"]}>
        <div
          className={[styles["row"], styles["row-scroller-table"]].join(" ")}
        >
          <HeadComponent />
          <RuleComponent />
          <TableContent />
        </div>
      </div>
    </div>
  );
}

export default TableComponent;
