import { useContext } from "react";
import { AuthContext } from "../../ProtectedRoute";
import styles from "../Journal.module.css";
import { useState } from "react";
import { useEffect } from "react";
import SvgMarkup from "../../SvgMarkup";
import { capitalize } from "../../utils/helpers";

const ColumnHeadIcons = {
  name: "alphabet-icon",
  created: "clock",
  tags: "list-icon",
};

function RowHeadComponent() {
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
      <CheckboxOptionActivatorInputComponent
        checkedActive={checkedActive}
        handleSelectHead={handleSelectHead}
      />
      <RowGroupComponent />
    </div>
  );
}

function CheckboxOptionActivatorInputComponent({
  checkedActive,
  handleSelectHead,
}) {
  return (
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
  );
}

function RowGroupComponent() {
  const columnHeads = Object.keys(ColumnHeadIcons);

  return (
    <div role="rowgroup">
      <div role="row">
        {columnHeads.map((head) => (
          <span role="columnhead" key={head}>
            <div className={styles["action-filter-content"]}>
              <div className={styles["action-filter-icon"]}>
                <SvgMarkup
                  classList="filter-icon"
                  fragId={ColumnHeadIcons[head.toLowerCase()]}
                  styles={styles}
                />
              </div>
              <div className={styles["action-filter-text"]}>
                {capitalize(head)}
              </div>
            </div>
          </span>
        ))}
      </div>
    </div>
  );
}
export default RowHeadComponent;
