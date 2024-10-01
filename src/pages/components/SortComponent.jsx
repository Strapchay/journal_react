import { useContext } from "react";
import ComponentOverlay from "../../ComponentOverlay";
import { useSortActions } from "../../hooks/useSortActions";
import SvgMarkup from "../../SvgMarkup";
import {
  CUSTOMIZE_POSITION_DEFAULTS,
  TABLE_SORT_TYPE,
} from "../../utils/constants";
import { capitalize } from "../../utils/helpers";
import styles from "../Journal.module.css";
import TableFunctionOptionComponent from "./TableFunctionOptionComponent";
import { AuthContext } from "../../ProtectedRoute";
import { useScreenBreakpoints } from "../../hooks/useScreenBreakpoints";

function SortComponent({ property, setSelectedComponentState = null }) {
  const {
    handleDeleteSort,
    handleSortAction,
    propertyRef,
    sortTypeRef,
    currentTableFunc,
  } = useSortActions({ setSelectedComponentState });
  const { mobileBreakpointMatches } = useScreenBreakpoints();
  const customizePosition = mobileBreakpointMatches
    ? { ...CUSTOMIZE_POSITION_DEFAULTS, adjustLeft: 100 }
    : { ...CUSTOMIZE_POSITION_DEFAULTS };

  return (
    <div className={styles["sort-rules"]}>
      <div className={styles["sort-rules-container"]}>
        <div className={styles["sort-action-form"]}>
          <div className={styles["add-sort-rules-box"]}>
            <ComponentOverlay>
              <div
                className={styles["sort-property-options"]}
                ref={propertyRef}
              >
                <ComponentOverlay.Open opens="propertyOption">
                  <SelectedPropertyTextComponent property={property} />
                </ComponentOverlay.Open>
                <ComponentOverlay.Window
                  name="propertyOption"
                  objectToOverlay={propertyRef}
                  customizePosition={customizePosition}
                >
                  <TableFunctionOptionComponent
                    componentName="sort"
                    form={true}
                    switchSortProp={true}
                  />
                </ComponentOverlay.Window>
              </div>
              <div className={styles["sort-type"]}>
                <ComponentOverlay.Open opens="sortTypeOption">
                  <SelectedSortTypeTextComponent
                    sortTypeRef={sortTypeRef}
                    currentTableFunc={currentTableFunc}
                  />
                </ComponentOverlay.Open>
                <ComponentOverlay.Window
                  name="sortTypeOption"
                  objectToOverlay={sortTypeRef}
                  customizePosition={customizePosition}
                >
                  <SortOptionComponent onSelect={handleSortAction} />
                </ComponentOverlay.Window>
              </div>
            </ComponentOverlay>
          </div>
        </div>
        <DeleteSortComponent handleDeleteSort={handleDeleteSort} />
      </div>
    </div>
  );
}

function SelectedPropertyTextComponent({ property, onClick }) {
  const { currentTableFunc } = useContext(AuthContext);
  return (
    <div
      className={[
        styles["sort-select"],
        styles["sort-property-options-box"],
      ].join(" ")}
      onClick={onClick}
    >
      <div className={styles["sort-sort-icon"]}>
        <SvgMarkup
          classList="sort-icon icon-active icon-md"
          fragId={property?.icon}
          styles={styles}
        />
      </div>
      <div className={styles["action-filter-text"]}>
        {capitalize(currentTableFunc?.sort?.property) ?? capitalize(property)}
      </div>
      <div className={styles["sort-dropdown-icon"]}>
        <SvgMarkup
          classList="sort-icon icon-active icon-sm"
          fragId="arrow-down"
          styles={styles}
        />
      </div>
    </div>
  );
}

function SelectedSortTypeTextComponent({
  sortTypeRef,
  currentTableFunc,
  onClick,
}) {
  return (
    <div className={styles["sort-type-options"]} onClick={onClick}>
      <div
        className={[
          styles["sort-type-options-box"],
          styles["sort-select"],
        ].join(" ")}
        ref={sortTypeRef}
      >
        <div className={styles["action-filter-text"]}>
          {currentTableFunc?.sort?.type || TABLE_SORT_TYPE[0].text}
        </div>
        <div className={styles["sort-dropdown-icon"]}>
          <SvgMarkup
            classList="sort-icon icon-active icon-sm"
            fragId="arrow-down"
            styles={styles}
          />
        </div>
      </div>
    </div>
  );
}

function SortOptionComponent({ onSubmit, onSelect }) {
  function handleSelection(e) {
    onSelect?.(e);
    onSubmit?.();
  }

  return (
    <>
      {TABLE_SORT_TYPE.map((type) => (
        <div className={styles["filter-input-option-option"]} key={type.text}>
          <div className={styles["filter-option-option"]}>
            <div
              className={[
                styles["filter-option-action"],
                styles[`filter-option-${type.text.toLowerCase()}`],
                styles["hover"],
              ].join(" ")}
              onClick={handleSelection}
            >
              <div className={styles["filter-option-icon"]}>
                <SvgMarkup
                  classList="filter-icon icon-md icon-active"
                  fragId={type.icon}
                  styles={styles}
                />
              </div>
              <div className={styles["filter-option-text"]}>{type.text}</div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function DeleteSortComponent({ handleDeleteSort }) {
  return (
    <div className={styles["sort-delete-container"]}>
      <div className={styles["sort-action-box"]} onClick={handleDeleteSort}>
        <div className={styles["sort-delete-icon"]}>
          <div className={styles["sort-sort-icon"]}>
            <SvgMarkup
              classList="icon-active icon-md"
              fragId="trashcan-icon"
              styles={styles}
            />
          </div>
        </div>
        <div className={styles["sort-delete-text"]}>Delete Sort</div>
      </div>
    </div>
  );
}

export default SortComponent;
