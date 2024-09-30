import { useContext } from "react";
import styles from "../Journal.module.css";
import { AuthContext } from "../../ProtectedRoute";
import { useTableFunctionActions } from "../../hooks/useTableFunctionActions";
import ComponentOverlay from "../../ComponentOverlay";
import {
  CUSTOMIZE_POSITION_DEFAULTS,
  TABLE_ACTION_OPTIONS,
} from "../../utils/constants";
import SvgMarkup from "../../SvgMarkup";
import TableFunctionOptionComponent from "./TableFunctionOptionComponent";
import FilterComponent from "./FilterComponent";
import SortComponent from "./SortComponent";
import { useScreenBreakpoints } from "../../hooks/useScreenBreakpoints";

function TableFunctions({ onClick }) {
  const {
    setSearchTableItemText,
    searchTableItemText,
    tableFuncPositionerRef,
    currentTableFunc,
  } = useContext(AuthContext);
  const {
    handleCreateAndOpenSidePeek,
    filterRef,
    sortRef,
    breakScreenOptionRef,
    propertiesToRender,
    setSelectedComponentState,
    selectedComponentState,
    setAllowSearch,
    allowSearch,
  } = useTableFunctionActions();
  const { mobileBreakpointMatches } = useScreenBreakpoints();
  const customizePosition = mobileBreakpointMatches
    ? { ...CUSTOMIZE_POSITION_DEFAULTS, adjustLeft: -50 }
    : { ...CUSTOMIZE_POSITION_DEFAULTS };

  return (
    <div className={styles["main-table-actions"]} onClick={onClick}>
      <ComponentOverlay>
        <ComponentOverlay.Open opens="filterProperties">
          <FilterTextComponent filterRef={filterRef} />
        </ComponentOverlay.Open>
        {!currentTableFunc?.filter?.active && (
          <ComponentOverlay.Window
            name="filterProperties"
            objectToOverlay={
              mobileBreakpointMatches ? breakScreenOptionRef : filterRef
            }
            customizePosition={customizePosition}
          >
            <TableFunctionOptionComponent
              componentName="filter"
              form={true}
              properties={propertiesToRender}
              setSelectedComponentState={setSelectedComponentState}
            />
          </ComponentOverlay.Window>
        )}
        <ComponentOverlay.Open opens="sortProperties">
          <SortTextComponent sortRef={sortRef} />
        </ComponentOverlay.Open>
        {!currentTableFunc?.sort?.active && (
          <ComponentOverlay.Window
            name="sortProperties"
            objectToOverlay={
              mobileBreakpointMatches ? breakScreenOptionRef : sortRef
            }
            customizePosition={customizePosition}
          >
            <TableFunctionOptionComponent
              componentName="sort"
              form={true}
              properties={propertiesToRender}
              setSelectedComponentState={setSelectedComponentState}
            />
          </ComponentOverlay.Window>
        )}
        {selectedComponentState?.componentName && (
          <ComponentOverlay.Window
            name={`${selectedComponentState.property.toLowerCase()}Filter`}
            objectToOverlay={tableFuncPositionerRef}
          >
            <>
              {selectedComponentState?.componentName?.toLowerCase() ===
                "filter" && (
                <FilterComponent
                  property={selectedComponentState?.property}
                  setSelectedComponentState={setSelectedComponentState}
                />
              )}

              {selectedComponentState?.componentName?.toLowerCase() ===
                "sort" && (
                <SortComponent
                  property={selectedComponentState?.property}
                  setSelectedComponentState={setSelectedComponentState}
                />
              )}
            </>
          </ComponentOverlay.Window>
        )}
        <div
          className={[
            styles["table-row"],
            styles["table-action-row"],
            styles["table-row-search"],
          ].join(" ")}
          onClick={() => {
            setAllowSearch((v) => !v);
            setSearchTableItemText((_) => "");
          }}
        >
          <div className={styles["table-row-icon"]}>
            <SvgMarkup
              classList={styles["table-icon"]}
              fragId="search-icon"
              styles={styles}
            />
          </div>
        </div>
        <div
          className={[
            styles["table-row-search--form"],
            styles["table-action-row"],
          ].join(" ")}
        >
          <input
            type="text"
            className={[
              styles["search-input"],
              styles[!allowSearch ? "hide-search-input" : ""],
            ].join(" ")}
            value={searchTableItemText}
            onChange={(e) => setSearchTableItemText(e.target.value)}
            placeholder="Type to search..."
          />
        </div>
        <div
          className={[
            styles["table-row-button"],
            styles["table-action-row"],
          ].join(" ")}
        >
          <div
            className={styles["table-button"]}
            onClick={handleCreateAndOpenSidePeek}
          >
            <div className={styles["table-button-content"]}>
              <div
                className={[
                  styles["table-button-text"],
                  styles["table-row-text"],
                ].join(" ")}
              >
                New
              </div>
            </div>
          </div>
        </div>

        <ComponentOverlay.Open opens="breakScreenOption">
          <div
            className={[styles["table-row-options"], styles["table-row"]].join(
              " ",
            )}
            ref={breakScreenOptionRef}
          >
            <div className={styles["table-row-icon"]}>
              <SvgMarkup
                classList={styles["table-icon"]}
                fragId="ellipsis"
                styles={styles}
              />
            </div>
          </div>
        </ComponentOverlay.Open>
        <ComponentOverlay.Window
          name="breakScreenOption"
          objectToOverlay={breakScreenOptionRef}
          customizePosition={{
            ...CUSTOMIZE_POSITION_DEFAULTS,
            adjustLeft: -50,
          }}
        >
          <TableFunctionOptionComponent
            form={false}
            properties={TABLE_ACTION_OPTIONS.properties}
            componentName="table-head-actions"
            setSelectedComponentState={setSelectedComponentState}
            onOpenSidePeek={handleCreateAndOpenSidePeek}
          />
        </ComponentOverlay.Window>
      </ComponentOverlay>
    </div>
  );
}

function FilterTextComponent({ filterRef }) {
  return (
    <div
      className={[
        styles["table-row"],
        styles["table-action-row"],
        styles["table-filter"],
      ].join(" ")}
      ref={filterRef}
    >
      <div className={styles["table-row-text"]}>Filter</div>
    </div>
  );
}

function SortTextComponent({ sortRef }) {
  return (
    <div
      className={[
        styles["table-row"],
        styles["table-action-row"],
        styles["table-sort"],
      ].join(" ")}
      ref={sortRef}
    >
      <div className={styles["table-row-text"]}>Sort</div>
    </div>
  );
}

function SelectedFunctionProperties({
  customizePosition,
  propertiesToRender,
  setSelectedComponentState,
  mobileBreakpointMatches,
  functionRef,
}) {
  <ComponentOverlay.Window
    name="filterProperties"
    objectToOverlay={mobileBreakpointMatches ? breakScreenOptionRef : filterRef}
    customizePosition={customizePosition}
  >
    <TableFunctionOptionComponent
      componentName="filter"
      form={true}
      properties={propertiesToRender}
      setSelectedComponentState={setSelectedComponentState}
    />
  </ComponentOverlay.Window>;
}

export default TableFunctions;
