import styles from "../Journal.module.css";
import { useContext } from "react";
import { AuthContext } from "../../ProtectedRoute";
import { useRef } from "react";
import { useScreenBreakpoints } from "../../hooks/useScreenBreakpoints";
import ComponentOverlay from "../../ComponentOverlay";
import SvgMarkup from "../../SvgMarkup";
import { tableRowActivator } from "../../utils/helpers";
import { useState } from "react";

import ListOverviewComponent from "./ListOverViewComponent";
import ListColumnOptionComponent from "./ListColumnOptionComponent";

function TablesListComponent({ journalItems }) {
  const { journalState } = useContext(AuthContext);

  return (
    <>
      {journalItems?.map((journal, i) => {
        const [journalName, journalId] = journal;
        const activeTable = tableRowActivator(
          journalState.currentTable,
          journalId,
          i,
        );

        {
          return (
            i < 4 && (
              <ListColumnComponent
                journalName={journalName}
                activeTable={activeTable}
                journalId={journalId}
                tableItems={journalItems}
                key={journalId}
              />
            )
          );
        }
      })}
    </>
  );
}

function ListColumnComponent({
  journalName,
  activeTable,
  journalId,
  tableItems,
}) {
  const tableHeadRef = useRef(null);
  const { handleSetCurrentTable } = useContext(AuthContext);
  const { largeScreenBreakpointMatches } = useScreenBreakpoints();
  return (
    <div
      className={[
        styles["table-row"],
        styles["table-journal"],
        styles[activeTable],
      ].join(" ")}
      data-name={journalName}
      data-id={journalId}
      onClick={() =>
        largeScreenBreakpointMatches ? {} : handleSetCurrentTable(journalId)
      }
      ref={tableHeadRef}
    >
      <ComponentOverlay key={journalId}>
        <ComponentOverlay.Open
          opens={
            largeScreenBreakpointMatches ? "tableAction" : "tableColumnOption"
          }
          conditional={activeTable}
        >
          <ColumnText journalName={journalName} />
        </ComponentOverlay.Open>
        <ComponentOverlay.Window
          name={activeTable ? "tableColumnOption" : null}
          objectToOverlay={tableHeadRef}
        >
          <ListColumnOptionComponent table={[journalName, journalId]} />
        </ComponentOverlay.Window>
        <ComponentOverlay.Window
          name="tableAction"
          objectToOverlay={tableHeadRef}
        >
          <ListOverviewComponent tableItems={tableItems} />
        </ComponentOverlay.Window>
      </ComponentOverlay>
    </div>
  );
}

function ColumnText({ journalName }) {
  return (
    <span className={styles["table-row-column-wrapper"]}>
      <div className={styles["table-row-icon"]}>
        <SvgMarkup
          classList={styles["table-icon"]}
          fragId="list-icon"
          styles={styles}
        />
      </div>
      <div className={styles["table-row-text"]}>{journalName}</div>
      <SvgMarkup
        classList="table-icon table-head-selector"
        fragId="arrow-down"
        styles={styles}
      />
    </span>
  );
}

export default TablesListComponent;
