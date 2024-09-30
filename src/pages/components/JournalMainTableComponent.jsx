import styles from "../Journal.module.css";
import JournalTableBodyComponent from "./JournalTableBodyComponent";
import JournalTableHeadComponent from "./JournalTableHeadComponent";
import JournalTableRowHeadComponent from "./JournalTableRowHeadComponent";
import PropertyRuleComponent from "./PropertyRuleComponent";

function JournalMainTableComponent() {
  return (
    <div className={styles["table-container"]}>
      <div className={styles["main-table"]}>
        <div
          className={[styles["row"], styles["row-scroller-table"]].join(" ")}
        >
          <JournalTableHeadComponent />

          <PropertyRuleComponent />
          <div className={styles["main-table-row"]}>
            {/*<!-- swith table to div start -->*/}

            <div role="tablerow" aria-label="Journals">
              <JournalTableRowHeadComponent />
              <JournalTableBodyComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JournalMainTableComponent;
