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

const ComponentSelector = {
  filter: FilterComponent,
  sort: SortComponent,
};

function TableFunctions({ onClick }) {
  const {
    setSearchTableItemText,
    searchTableItemText,
    tableFuncPositionerRef,
    currentTableFunc,
  } = useContext(AuthContext);
  const {
    handleCreateAndOpenSidePeek,
    actionRefDictRef,
    breakScreenOptionRef,
    setSelectedComponentState,
    selectedComponentState,
    setAllowSearch,
    allowSearch,
  } = useTableFunctionActions();
  const allowedActions = TABLE_ACTION_OPTIONS.properties
    .filter((prop) => prop.text.toLowerCase() !== "new")
    .map((prop) => prop.text.toLowerCase());
  const { mobileBreakpointMatches } = useScreenBreakpoints();
  const customizePosition = mobileBreakpointMatches
    ? { ...CUSTOMIZE_POSITION_DEFAULTS, adjustLeft: -50 }
    : { ...CUSTOMIZE_POSITION_DEFAULTS };

  const SelectedComponent =
    ComponentSelector[selectedComponentState?.componentName?.toLowerCase()];

  return (
    <div className={styles["main-table-actions"]} onClick={onClick}>
      <ComponentOverlay>
        <ComponentOverlay.Open opens="filterProperties">
          <FilterTextComponent filterRef={actionRefDictRef.current.filter} />
        </ComponentOverlay.Open>
        <ComponentOverlay.Open opens="sortProperties">
          <SortTextComponent sortRef={actionRefDictRef.current.sort} />
        </ComponentOverlay.Open>
        {allowedActions.map(
          (action) =>
            !currentTableFunc?.[action]?.active && (
              <ComponentOverlay.Window
                key={action}
                name={`${action}Properties`}
                objectToOverlay={
                  mobileBreakpointMatches
                    ? breakScreenOptionRef
                    : actionRefDictRef.current?.[action]
                }
                customizePosition={customizePosition}
              >
                <TableFunctionOptionComponent
                  componentName={action}
                  form={true}
                  setSelectedComponentState={setSelectedComponentState}
                />
              </ComponentOverlay.Window>
            ),
        )}

        {selectedComponentState?.componentName && (
          <ComponentOverlay.Window
            name={`${selectedComponentState.property.toLowerCase()}Filter`}
            objectToOverlay={tableFuncPositionerRef}
          >
            <SelectedComponent
              property={selectedComponentState?.property}
              setSelectedComponentState={setSelectedComponentState}
            />
          </ComponentOverlay.Window>
        )}
        <SearchComponent
          allowSearch={allowSearch}
          setAllowSearch={setAllowSearch}
          setSearchTableItemText={setSearchTableItemText}
          searchTableItemText={searchTableItemText}
        />
        <ButtonAddComponent
          handleCreateAndOpenSidePeek={handleCreateAndOpenSidePeek}
        />
        <ComponentOverlay.Open opens="breakScreenOption">
          <MobileFunctionOptionComponent
            breakScreenOptionRef={breakScreenOptionRef}
          />
        </ComponentOverlay.Open>
        <ComponentOverlay.Window
          name="breakScreenOption"
          objectToOverlay={breakScreenOptionRef}
          customizePosition={customizePosition}
        >
          <TableFunctionOptionComponent
            form={false}
            componentName="table-head-actions"
            setSelectedComponentState={setSelectedComponentState}
            onOpenSidePeek={handleCreateAndOpenSidePeek}
          />
        </ComponentOverlay.Window>
      </ComponentOverlay>
    </div>
  );
}

function FilterTextComponent({ filterRef, onClick }) {
  return (
    <div
      className={[
        styles["table-row"],
        styles["table-action-row"],
        styles["table-filter"],
      ].join(" ")}
      onClick={onClick}
      ref={filterRef}
    >
      <div className={styles["table-row-text"]}>Filter</div>
    </div>
  );
}

function SortTextComponent({ sortRef, onClick }) {
  return (
    <div
      className={[
        styles["table-row"],
        styles["table-action-row"],
        styles["table-sort"],
      ].join(" ")}
      ref={sortRef}
      onClick={onClick}
    >
      <div className={styles["table-row-text"]}>Sort</div>
    </div>
  );
}

function SearchComponent({
  setAllowSearch,
  setSearchTableItemText,
  allowSearch,
  searchTableItemText,
}) {
  return (
    <>
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
    </>
  );
}

function ButtonAddComponent({ handleCreateAndOpenSidePeek }) {
  return (
    <div
      className={[styles["table-row-button"], styles["table-action-row"]].join(
        " ",
      )}
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
  );
}

function MobileFunctionOptionComponent({ breakScreenOptionRef, onClick }) {
  return (
    <div
      className={[styles["table-row-options"], styles["table-row"]].join(" ")}
      ref={breakScreenOptionRef}
      onClick={onClick}
    >
      <div className={styles["table-row-icon"]}>
        <SvgMarkup
          classList={styles["table-icon"]}
          fragId="ellipsis"
          styles={styles}
        />
      </div>
    </div>
  );
}

export default TableFunctions;
