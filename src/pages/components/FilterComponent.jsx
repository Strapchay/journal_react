import { useContext } from "react";
import ComponentOverlay from "../../ComponentOverlay";
import { useFilterActions } from "../../hooks/useFilterActions";
import SvgMarkup from "../../SvgMarkup";
import styles from "../Journal.module.css";
import { AuthContext } from "../../ProtectedRoute";
import { useRef } from "react";
import { SELECTED_COMPONENT_STATE_DEFAULTS } from "../../utils/constants";
import TagComponent, { SelectedTagsComponent } from "./TagComponent";

function FilterComponent({ property, setSelectedComponentState = null }) {
  const {
    onTagsFilter,
    onRemoveTag,
    handleFilterText,
    propertyName,
    prepositionRef,
    prepositions,
    optionRef,
    currentTableFunc,
    removeFilterInput,
    tagFiltersExist,
    selectedTagFiltersToRender,
  } = useFilterActions({ property });

  return (
    <div className={styles["filter-rule-input-box"]}>
      <div className={styles["filter-input-content"]}>
        <div className={styles["filter-input-content-box"]}>
          <div className={styles["filter-input-text"]}>{propertyName}</div>
          <ComponentOverlay>
            <ComponentOverlay.Open opens="filterConditionals">
              <ConditionalTextComponent
                prepositionRef={prepositionRef}
                currentTableFunc={currentTableFunc}
              />
            </ComponentOverlay.Open>
            <ComponentOverlay.Window
              name="filterConditionals"
              objectToOverlay={prepositionRef}
            >
              <ConditionalsComponent prepositions={prepositions} />
            </ComponentOverlay.Window>
            <div className={styles["div-filler"]}></div>
            <ComponentOverlay.Open opens="filterRuleOption">
              <OptionIconComponent optionRef={optionRef} />
            </ComponentOverlay.Open>
            <ComponentOverlay.Window
              name="filterRuleOption"
              objectToOverlay={optionRef}
            >
              <FilterOptionComponent
                setSelectedComponentState={setSelectedComponentState}
                property={property}
                onTagsFilter={onTagsFilter}
              />
            </ComponentOverlay.Window>
          </ComponentOverlay>
        </div>
        {!removeFilterInput && property.toLowerCase() === "name" && (
          <div className={styles["filter-input-container"]}>
            <input
              type="text"
              className={[
                styles["filter-value"],
                styles["component-form"],
              ].join(" ")}
              placeholder="Type a Value..."
              value={currentTableFunc?.filter?.text ?? ""}
              onChange={handleFilterText}
            />
          </div>
        )}
        {!removeFilterInput && property.toLowerCase() === "tags" && (
          <div className={styles["filter-input-container"]}>
            <div
              contentEditable={false}
              className={styles["filter-value-tags"]}
              aria-placeholder="Add Tags To Filter By"
            >
              {tagFiltersExist
                ? selectedTagFiltersToRender.map((tag) => (
                    <SelectedTagsComponent
                      tagProperty={tag}
                      addXmark={true}
                      onRemoveTag={onRemoveTag}
                      key={tag?.id}
                    />
                  ))
                : ""}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ConditionalTextComponent({
  prepositionRef,
  currentTableFunc,
  onClick,
}) {
  return (
    <div
      className={[styles["filter-input-filter"], styles["hover"]].join(" ")}
      ref={prepositionRef}
      onClick={onClick}
    >
      <div className={styles["filter-input-filter-text"]}>
        {currentTableFunc?.filter?.conditional}
      </div>
      <div className={styles["added-rule-icon"]}>
        <SvgMarkup
          classList="filter-added-icon icon-sm nav-icon-active"
          fragId="arrow-down"
          styles={styles}
        />
      </div>
    </div>
  );
}

function ConditionalsComponent({ prepositions, onSubmit }) {
  const { currentTableFunc, dispatch } = useContext(AuthContext);

  function handlePrepositionSelect(e) {
    const tagsValue =
      e.target.textContent.toLowerCase() === "is empty"
        ? []
        : [...currentTableFunc.filter.tags];

    dispatch({
      type: "updateTableFunc",
      payload: {
        filter: {
          ...currentTableFunc.filter,
          conditional: e.target.textContent,
          tags: tagsValue,
        },
      },
    });
    onSubmit?.();
  }

  return (
    <div
      className={[
        styles["filter-pre-action--options"],
        styles["component-options"],
      ].join(" ")}
    >
      <div className={styles["filter-options"]}>
        <div className={styles["filter-pre-filter--option"]}>
          <div className={styles["filter-content-box"]}>
            <div className={styles["filter-content"]}>
              <div className={styles["add-action-filters"]}>
                {prepositions.map((preposition) => (
                  <div
                    key={preposition.condition}
                    className={styles["action-filter-content"]}
                    onClick={handlePrepositionSelect}
                  >
                    <div className={styles["action-filter-text"]}>
                      {preposition.condition}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OptionIconComponent({ optionRef, onClick }) {
  return (
    <div
      className={[styles["filter-input-option"], styles["hover"]].join(" ")}
      ref={optionRef}
      onClick={onClick}
    >
      <SvgMarkup
        classList="filter-added-icon icon-md nav-icon-active"
        fragId="ellipsis"
        styles={styles}
      />
    </div>
  );
}

function FilterOptionComponent({
  setSelectedComponentState,
  property,
  onSubmit,
  onTagsFilter,
}) {
  const { dispatch, activateTableFuncPersist } = useContext(AuthContext);
  const tagOptionRef = useRef(null);

  function handleDeleteFilter() {
    dispatch({
      type: "updateTableFunc",
      payload: {
        filter: {},
      },
    });
    activateTableFuncPersist();
    if (setSelectedComponentState)
      setSelectedComponentState(SELECTED_COMPONENT_STATE_DEFAULTS);
  }

  return (
    <div className={styles["filter-input-option-option"]}>
      <div className={styles["filter-option-option"]}>
        <DeleteFilterComponent
          handleDeleteFilter={handleDeleteFilter}
          tagOptionRef={tagOptionRef}
        />
        {property.toLowerCase() === "tags" && (
          <ComponentOverlay>
            <ComponentOverlay.Open opens="tagOptions">
              <SelectTagTextComponent tagOptionRef={tagOptionRef} />
            </ComponentOverlay.Open>
            <ComponentOverlay.Window
              name="tagOptions"
              objectToOverlay={tagOptionRef}
            >
              <TagComponent
                itemIds={[]}
                disableInput={true}
                onTagsFilter={onTagsFilter}
                onFilterComplete={onSubmit}
              />
            </ComponentOverlay.Window>
          </ComponentOverlay>
        )}
      </div>
    </div>
  );
}

function DeleteFilterComponent({ tagOptionRef, handleDeleteFilter }) {
  return (
    <div
      className={[
        styles["filter-option-action"],
        styles["filter-option-delete"],
        styles["hover"],
      ].join(" ")}
      onClick={handleDeleteFilter}
    >
      <div className={styles["filter-option-icon"]} ref={tagOptionRef}>
        <SvgMarkup
          classList="filter-icon icon-md nav-icon-active"
          fragId="trashcan-icon"
          styles={styles}
        />
      </div>
      <div className={styles["filter-option-text"]}>Delete Filter</div>
    </div>
  );
}

function SelectTagTextComponent({ tagOptionRef, onClick }) {
  return (
    <div
      className={[
        styles["filter-option-action"],
        styles["filter-option-tags"],
        styles["hover"],
      ].join(" ")}
      ref={tagOptionRef}
      onClick={onClick}
    >
      <div className={styles["filter-option-icon"]}>
        <SvgMarkup
          classList="filter-icon icon-md nav-icon-active"
          fragId="list-icon"
          styles={styles}
        />
      </div>
      <div className={styles["filter-option-text"]}>Select Tags</div>
    </div>
  );
}

export default FilterComponent;
