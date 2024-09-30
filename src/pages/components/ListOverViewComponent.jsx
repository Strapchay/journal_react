import { useContext } from "react";
import styles from "../Journal.module.css";
import { useState } from "react";
import { AuthContext } from "../../ProtectedRoute";
import { useScreenBreakpoints } from "../../hooks/useScreenBreakpoints";
import { useRef } from "react";
import SvgMarkup from "../../SvgMarkup";
import ComponentOverlay from "../../ComponentOverlay";
import { CUSTOMIZE_POSITION_DEFAULTS } from "../../utils/constants";
import ListColumnOptionComponent from "./ListColumnOptionComponent";

function ListOverviewComponent({ tableItems, onSubmit }) {
  const [searchTable, setSearchTable] = useState("");
  const tableItemsToRender = searchTable.length
    ? tableItems?.filter((item) => item[0].toLowerCase().includes(searchTable))
    : tableItems;

  return (
    <div
      className={[
        styles["table-view-list--options"],
        styles["component-options"],
      ].join(" ")}
    >
      <div className={styles["table-options"]}>
        <div className={styles["table-list--option"]}>
          <div className={styles["table-list-content-box"]}>
            <div className={styles["table-search-input"]}>
              <input
                type="text"
                name="table-search"
                className={[
                  styles["table-search"],
                  styles["component-form"],
                ].join(" ")}
                value={searchTable}
                placeholder="Search for a View..."
                onChange={(e) => setSearchTable(e.target.value)}
              />
            </div>
            <div className={styles["table-content"]}>
              <div className={styles["add-table-content"]}>
                {tableItemsToRender.map((item) => (
                  <ListOverviewItemComponent
                    tableItem={item}
                    key={item[1]}
                    onSetCurrent={onSubmit}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListOverviewItemComponent({ tableItem, onSetCurrent }) {
  const { handleSetCurrentTable } = useContext(AuthContext);
  const { mobileBreakpointMatches } = useScreenBreakpoints();
  const customizePosition = mobileBreakpointMatches
    ? { ...CUSTOMIZE_POSITION_DEFAULTS, adjustLeft: -200 }
    : { ...CUSTOMIZE_POSITION_DEFAULTS };

  const tableViewOptionRef = useRef(null);

  function onSetCurrentTable(journalId) {
    handleSetCurrentTable(journalId);
    onSetCurrent?.();
  }

  return (
    <div className={[styles["table-list-content"], styles["hover"]].join(" ")}>
      <div className={styles["table-view-box"]}>
        <div
          className={styles["table-view-content"]}
          onClick={() => onSetCurrentTable(tableItem[1])}
        >
          <div className={styles["table-row-icon"]}>
            <SvgMarkup
              classList={styles["icon-active"]}
              fragId="list-icon"
              styles={styles}
            />
          </div>
          <div
            className={[styles["table-row-text"], styles["color-active"]].join(
              " ",
            )}
          >
            {tableItem[0]}
          </div>
        </div>

        <div
          className={styles["table-view-options"]}
          data-name={tableItem[0]}
          data-id={tableItem[1]}
          ref={tableViewOptionRef}
        >
          <ComponentOverlay>
            <ComponentOverlay.Open opens="tableOptionEdit">
              <IconComponent />
            </ComponentOverlay.Open>
            <ComponentOverlay.Window
              name="tableOptionEdit"
              objectToOverlay={tableViewOptionRef}
              customizePosition={customizePosition}
            >
              <ListColumnOptionComponent table={tableItem} hasParent={true} />
            </ComponentOverlay.Window>
          </ComponentOverlay>
        </div>
      </div>
    </div>
  );
}

function IconComponent() {
  return (
    <div className={[styles["table-row-icon"], styles["hover-dull"]].join(" ")}>
      <SvgMarkup
        classList="table-icon icon-md"
        fragId="ellipsis"
        styles={styles}
      />
    </div>
  );
}

export default ListOverviewComponent;
