import { useContext } from "react";
import { AuthContext } from "../../ProtectedRoute";
import styles from "../Journal.module.css";
import { useState } from "react";
import { useEffect } from "react";
import SvgMarkup from "../../SvgMarkup";

function JournalTableRowHeadComponent() {
  const { selectAllSelectedTableItems, selectedTableItems } =
    useContext(AuthContext);
  const [checkedActive, setCheckedActive] = useState(false);
  const selectedTableItemsLength = Object.values(selectedTableItems).filter(
    (v) => v,
  ).length;

  useEffect(() => {
    if (checkedActive && !selectedTableItemsLength) setCheckedActive(false);
  }, [checkedActive, selectedTableItemsLength]);

  function handleSelectHead() {
    selectAllSelectedTableItems(!checkedActive); //use the old value since that would be the
    setCheckedActive((s) => !s);
  }

  return (
    <div role="tablehead">
      <div className={styles["tableInput-container"]}>
        <label className={styles["tableInput"]}>
          <input
            type="checkbox"
            name=""
            id="checkboxInput"
            checked={checkedActive}
            className={styles["checkboxInput"]}
            onChange={handleSelectHead}
          />
        </label>
      </div>
      <div role="rowgroup">
        <div role="row">
          <span role="columnhead">
            <div className={styles["action-filter-content"]}>
              <div className={styles["action-filter-icon"]}>
                <SvgMarkup
                  classList="filter-icon"
                  fragId="alphabet-icon"
                  styles={styles}
                />
              </div>
              <div className={styles["action-filter-text"]}>Name</div>
            </div>
          </span>
          <span role="columnhead">
            <div className={styles["action-filter-content"]}>
              <div className={styles["action-filter-icon"]}>
                <SvgMarkup
                  classList="filter-icon"
                  fragId="clock"
                  styles={styles}
                />
              </div>

              <div className={styles["action-filter-text"]}>Created</div>
            </div>
          </span>
          <span role="columnhead">
            <div className={styles["action-filter-content"]}>
              <div className={styles["action-filter-icon"]}>
                <SvgMarkup
                  classList="filter-icon"
                  fragId="list-icon"
                  styles={styles}
                />
              </div>
              <div className={styles["action-filter-text"]}>Tags</div>
            </div>
          </span>
        </div>
      </div>
    </div>
  );
}
export default JournalTableRowHeadComponent;
