import styles from "../Journal.module.css";
import SvgMarkup from "../../SvgMarkup";
import ComponentOverlay from "../../ComponentOverlay";
import { TABLE_HEAD_LIMIT } from "../../utils/constants";
import ListOverviewComponent from "./ListOverViewComponent";
import TablesListComponent from "./TableListComponent";
import TableFunctions from "./TableFunctions";
import TableFunctionOptionComponent from "./TableFunctionOptionComponent";
import CheckboxOptionComponent from "./CheckboxOptionComponent";
import { useTableHeadActions } from "../../hooks/useTableHeadActions";
import { useContext } from "react";
import { AuthContext } from "../../ProtectedRoute";

function HeadComponent() {
  const {
    switchTableAdd,
    tableItems,
    tableHeadRef,
    selectedTableItemsLength,
    tables,
  } = useTableHeadActions();

  return (
    <div className={styles["main-table-head"]}>
      <div className={styles["main-table-head-box"]}>
        {!switchTableAdd && (
          <div className={styles["main-table-heading"]}>
            <TablesListComponent journalItems={tableItems} />
            <TableAdder />
          </div>
        )}
        {switchTableAdd && (
          <div className={styles["main-table-heading"]}>
            <TablesListComponent journalItems={tableItems} />
            <ComponentOverlay>
              <ComponentOverlay.Open opens="tableAction">
                <ListViewInitComponent tables={tables} />
              </ComponentOverlay.Open>
              <ComponentOverlay.Window
                name="tableAction"
                objectToOverlay={tableHeadRef}
              >
                <ListOverviewComponent tableItems={tableItems} />
              </ComponentOverlay.Window>
            </ComponentOverlay>
          </div>
        )}
        <TableFunctions />
      </div>
      {selectedTableItemsLength ? (
        <CheckboxOptionComponent
          selectedItemsLength={selectedTableItemsLength}
        />
      ) : (
        ""
      )}
    </div>
  );
}

function ListViewInitComponent({ tables }) {
  const { tableHeadRef } = useContext(AuthContext);
  return (
    <div
      className={[styles["table-column-options"], styles["table-row"]].join(
        " ",
      )}
      ref={tableHeadRef}
    >
      <div className={styles["table-row-text"]}>
        {tables?.length - TABLE_HEAD_LIMIT} more...
      </div>
    </div>
  );
}

function TableAdder() {
  const { handleAddTableEvent } = useContext(AuthContext);
  return (
    <div
      className={[styles["table-column-adder"], styles["table-row"]].join(" ")}
      onClick={handleAddTableEvent}
    >
      <SvgMarkup
        classList={styles["table-icon"]}
        fragId="plus"
        styles={styles}
      />
    </div>
  );
}

export default HeadComponent;
