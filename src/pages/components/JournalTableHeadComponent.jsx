import styles from "../Journal.module.css";
import { useScreenBreakpoints } from "../../hooks/useScreenBreakpoints";

import { useJournalTableHeadActions } from "../../hooks/useJournalTableHeadActions";
import SvgMarkup from "../../SvgMarkup";
import ComponentOverlay from "../../ComponentOverlay";
import {
  CUSTOMIZE_POSITION_DEFAULTS,
  SELECTED_COMPONENT_STATE_DEFAULTS,
  TABLE_ACTION_OPTIONS,
  TABLE_HEAD_LIMIT,
  TABLE_SORT_TYPE,
} from "../../utils/constants";
import { useContext } from "react";
import { AuthContext } from "../../ProtectedRoute";
import { capitalize, tableRowActivator } from "../../utils/helpers";
import { useRef } from "react";
import { useJournalTableOptionActions } from "../../hooks/useJournalTableOptionActions";
import { useState } from "react";
import { useJournalTableHeadActionActions } from "../../hooks/useJournalTableHeadActionActions";
import { useTableFilterRuleActions } from "../../hooks/useTableFilterRuleActions";
import { useTableSortRuleActions } from "../../hooks/useTableSortRuleActions";
import {
  JournalTableBodyItemSelectedTagsRenderComponent,
  JournalTableBodyItemTagOptionOverlayComponent,
} from "./JournalTableBodyComponent";
import {
  JournalTableBodyCheckboxOptionComponent,
  PropertyRuleConditionalsComponent,
} from "../Journal";
import { useJournalTableHeadActionOptionActions } from "../../hooks/useJournalTableHeadActionOptionActions";

function JournalTableHeadComponent() {
  const {
    handleAddTableEvent,
    switchTableAdd,
    tableItems,
    tableHeadRef,
    tables,
    selectedTableItemsLength,
  } = useJournalTableHeadActions();
  const { mobileBreakpointMatches } = useScreenBreakpoints();

  return (
    <div className={styles["main-table-head"]}>
      <div className={styles["main-table-head-box"]}>
        {!switchTableAdd && (
          <div className={styles["main-table-heading"]}>
            <JournalTableRowComponent journalItems={tableItems} />
            <div
              className={[
                styles["table-column-adder"],
                styles["table-row"],
              ].join(" ")}
              onClick={handleAddTableEvent}
            >
              <SvgMarkup
                classList={styles["table-icon"]}
                fragId="plus"
                styles={styles}
              />
            </div>
          </div>
        )}
        {switchTableAdd && (
          <div className={styles["main-table-heading"]}>
            <JournalTableRowComponent journalItems={tableItems} />

            <ComponentOverlay>
              <ComponentOverlay.Open opens="tableAction">
                <div
                  className={[
                    styles["table-column-options"],
                    styles["table-row"],
                  ].join(" ")}
                  ref={tableHeadRef}
                >
                  <div className={styles["table-row-text"]}>
                    {tables.length - TABLE_HEAD_LIMIT} more...
                  </div>
                </div>
              </ComponentOverlay.Open>
              <ComponentOverlay.Window
                name="tableAction"
                objectToOverlay={tableHeadRef}
              >
                <JournalTableActionOptionComponent tableItems={tableItems} />
              </ComponentOverlay.Window>
            </ComponentOverlay>
          </div>
        )}
        <JournalTableHeadActionComponent
          mobileBreakpointMatches={mobileBreakpointMatches}
        />
      </div>
      {selectedTableItemsLength ? (
        <JournalTableBodyCheckboxOptionComponent
          selectedItemsLength={selectedTableItemsLength}
        />
      ) : (
        ""
      )}
    </div>
  );
}

function JournalTableRowComponent({ journalItems }) {
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
              <JournalTableRowColumnComponent
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

function JournalTableRowColumnComponent({
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
        </ComponentOverlay.Open>
        <ComponentOverlay.Window
          name={activeTable ? "tableColumnOption" : null}
          objectToOverlay={tableHeadRef}
        >
          <JournalTableOptionComponent table={[journalName, journalId]} />
        </ComponentOverlay.Window>
        <ComponentOverlay.Window
          name="tableAction"
          objectToOverlay={tableHeadRef}
        >
          <JournalTableActionOptionComponent tableItems={tableItems} />
        </ComponentOverlay.Window>
      </ComponentOverlay>
    </div>
  );
}

function JournalTableOptionComponent({ table, onSubmit, hasParent = false }) {
  const {
    renameActive,
    tableNameInput,
    handleTableNameChange,
    setRenameActive,
    handleTableDuplicate,
    handleTableDelete,
  } = useJournalTableOptionActions({ table, onSubmit, hasParent });

  return (
    <div
      className={[
        styles["table-row-active--options"],
        styles["component-options"],
      ].join(" ")}
    >
      <div className={styles["table-options"]}>
        <div className={styles["table-options-edits--option"]}>
          <div className={styles["edit-content-container"]}>
            <div className={styles["edit-content-box"]}>
              {renameActive && (
                <div className={[styles["edit-content-form"]].join(" ")}>
                  <input
                    type="text"
                    placeholder=""
                    className={[
                      styles["table-rename"],
                      styles["component-form"],
                    ].join(" ")}
                    name="table-rename"
                    defaultValue={tableNameInput}
                    onKeyUp={handleTableNameChange}
                  />
                </div>
              )}
              <div
                className={styles["edit-content"]}
                onClick={() => setRenameActive((r) => !r)}
              >
                <div className={styles["edit-content-icon"]}>
                  <SvgMarkup
                    classList={styles["edit-icon"]}
                    fragId="pen-to-square"
                    styles={styles}
                  />
                </div>
                <div className={styles["edit-text"]}>Rename</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles["table-options-actions--option"]}>
          <div className={styles["actions-content-container"]}>
            <div className={styles["actions-content-box"]}>
              <div
                className={[
                  styles["action-content"],
                  styles["action-duplicate"],
                ].join(" ")}
                onClick={handleTableDuplicate}
              >
                <div className={styles["action-content-icon"]}>
                  <SvgMarkup
                    classList={styles["action-icon"]}
                    fragId="clone"
                    styles={styles}
                  />
                </div>
                <div className={styles["action-text"]}>Duplicate</div>
              </div>
              <div
                className={[
                  styles["action-content"],
                  styles["action-delete"],
                ].join(" ")}
                onClick={handleTableDelete}
              >
                <div className={styles["action-icon"]}>
                  <SvgMarkup
                    classList={styles["action-icon"]}
                    fragId="trashcan-icon"
                    styles={styles}
                  />
                </div>
                <div className={styles["action-text"]}>Delete</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JournalTableActionOptionComponent({ tableItems, onSubmit }) {
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
                  <JournalTableHeadOptionComponent
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

function JournalTableHeadOptionComponent({ tableItem, onSetCurrent }) {
  const { handleSetCurrentTable } = useContext(AuthContext);
  const { mobileBreakpointMatches } = useScreenBreakpoints();

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
              <div
                className={[
                  styles["table-row-icon"],
                  styles["hover-dull"],
                ].join(" ")}
              >
                <SvgMarkup
                  classList="table-icon icon-md"
                  fragId="ellipsis"
                  styles={styles}
                />
              </div>
            </ComponentOverlay.Open>
            <ComponentOverlay.Window
              name="tableOptionEdit"
              objectToOverlay={tableViewOptionRef}
              customizePosition={
                mobileBreakpointMatches
                  ? { ...CUSTOMIZE_POSITION_DEFAULTS, adjustLeft: -200 }
                  : { ...CUSTOMIZE_POSITION_DEFAULTS }
              }
            >
              <JournalTableOptionComponent table={tableItem} hasParent={true} />
            </ComponentOverlay.Window>
          </ComponentOverlay>
        </div>
      </div>
    </div>
  );
}

function JournalTableHeadActionComponent({ onClick, mobileBreakpointMatches }) {
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
  } = useJournalTableHeadActionActions();

  return (
    <div className={styles["main-table-actions"]} onClick={onClick}>
      <ComponentOverlay>
        <ComponentOverlay.Open opens="filterProperties">
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
        </ComponentOverlay.Open>
        {!currentTableFunc?.filter?.active && (
          <ComponentOverlay.Window
            name="filterProperties"
            objectToOverlay={
              mobileBreakpointMatches ? breakScreenOptionRef : filterRef
            }
            customizePosition={
              mobileBreakpointMatches
                ? { ...CUSTOMIZE_POSITION_DEFAULTS, adjustLeft: -50 }
                : { ...CUSTOMIZE_POSITION_DEFAULTS }
            }
          >
            <JournalTableHeadActionOptionComponent
              componentName="filter"
              form={true}
              properties={propertiesToRender}
              setSelectedComponentState={setSelectedComponentState}
            />
          </ComponentOverlay.Window>
        )}
        <ComponentOverlay.Open opens="sortProperties">
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
        </ComponentOverlay.Open>
        {!currentTableFunc?.sort?.active && (
          <ComponentOverlay.Window
            name="sortProperties"
            objectToOverlay={
              mobileBreakpointMatches ? breakScreenOptionRef : sortRef
            }
            customizePosition={
              mobileBreakpointMatches
                ? { ...CUSTOMIZE_POSITION_DEFAULTS, adjustLeft: -50 }
                : { ...CUSTOMIZE_POSITION_DEFAULTS }
            }
          >
            <JournalTableHeadActionOptionComponent
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
                <TableFilterRuleComponent
                  property={selectedComponentState?.property}
                  setSelectedComponentState={setSelectedComponentState}
                />
              )}

              {selectedComponentState?.componentName?.toLowerCase() ===
                "sort" && (
                <TableSortRuleComponent
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
          <JournalTableHeadActionOptionComponent
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

function JournalTableHeadActionOptionComponent({
  componentName,
  form,
  properties,
  setSelectedComponentState = null,
  switchSortProp = null,
  onSubmit,
  onOpenSidePeek = null,
}) {
  const {
    onSelectProperty,
    searchText,
    setSearchText,
    placeholder,
    renderedProperties,
  } = useJournalTableHeadActionOptionActions({
    onSubmit,
    componentName,
    properties,
    setSelectedComponentState,
    switchSortProp,
  });

  return (
    <div
      className={[
        styles[`${componentName}-add-action--options`],
        styles["property-add-action--options"],
        styles["component-options"],
      ].join(" ")}
    >
      <div className={styles["property-options"]}>
        <div className={styles["property-options-property--option"]}>
          <div className={styles["property-content-box"]}>
            {form && (
              <form action="" id="property-content-forms">
                <input
                  type="text"
                  name={`${componentName}-search property-search`}
                  className={[
                    styles[`${componentName}-search`],
                    styles["property-search"],
                    styles["component-form"],
                  ].join(" ")}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder={`${placeholder} by...`}
                />
              </form>
            )}
            <div className={styles["property-content"]}>
              <div
                className={[
                  styles[`${componentName}-content-search`],
                  styles["property-content-search"],
                ].join(" ")}
              >
                {renderedProperties?.map((property) => (
                  <ComponentOverlay.Open
                    key={property?.text}
                    opens={
                      form
                        ? `${property?.text?.toLowerCase()}Filter`
                        : `${property?.text?.toLowerCase()}Properties`
                    }
                    beforeRender={
                      property.text ===
                      TABLE_ACTION_OPTIONS.properties[
                        TABLE_ACTION_OPTIONS.properties.length - 1
                      ].text
                        ? onOpenSidePeek
                        : onSelectProperty.bind(
                            this,
                            property.text.toLowerCase(),
                          )
                    }
                  >
                    <div
                      className={[
                        styles[`${componentName}-property-content`],
                        styles["action-property-content"],
                      ].join(" ")}
                    >
                      <div className={styles["action-property-icon"]}>
                        <SvgMarkup
                          classList={styles["property-icon"]}
                          fragId={property.icon}
                          styles={styles}
                        />
                      </div>
                      <div className={styles["action-property-text"]}>
                        {property.text}
                      </div>
                    </div>
                  </ComponentOverlay.Open>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableFilterRuleComponent({
  property,
  onClick,
  setSelectedComponentState = null,
}) {
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
  } = useTableFilterRuleActions({ property });

  return (
    <div className={styles["filter-rule-input-box"]} onClick={onClick}>
      <div className={styles["filter-input-content"]}>
        <div className={styles["filter-input-content-box"]}>
          <div className={styles["filter-input-text"]}>{propertyName}</div>
          <ComponentOverlay>
            <ComponentOverlay.Open opens="filterConditionals">
              <div
                className={[
                  styles["filter-input-filter"],
                  styles["hover"],
                ].join(" ")}
                ref={prepositionRef}
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
            </ComponentOverlay.Open>
            <ComponentOverlay.Window
              name="filterConditionals"
              objectToOverlay={prepositionRef}
            >
              <PropertyRuleConditionalsComponent prepositions={prepositions} />
            </ComponentOverlay.Window>
            <div className={styles["div-filler"]}></div>
            <ComponentOverlay.Open opens="filterRuleOption">
              <div
                className={[
                  styles["filter-input-option"],
                  styles["hover"],
                ].join(" ")}
                ref={optionRef}
              >
                <SvgMarkup
                  classList="filter-added-icon icon-md nav-icon-active"
                  fragId="ellipsis"
                  styles={styles}
                />
              </div>
            </ComponentOverlay.Open>
            <ComponentOverlay.Window
              name="filterRuleOption"
              objectToOverlay={optionRef}
            >
              <TableFilterRuleOptionComponent
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
                    <JournalTableBodyItemSelectedTagsRenderComponent
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

function TableFilterRuleOptionComponent({
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
        {property.toLowerCase() === "tags" && (
          <ComponentOverlay>
            <ComponentOverlay.Open opens="tagOptions">
              <div
                className={[
                  styles["filter-option-action"],
                  styles["filter-option-tags"],
                  styles["hover"],
                ].join(" ")}
                ref={tagOptionRef}
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
            </ComponentOverlay.Open>
            <ComponentOverlay.Window
              name="tagOptions"
              objectToOverlay={tagOptionRef}
            >
              <JournalTableBodyItemTagOptionOverlayComponent
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

export function TableSortRuleComponent({
  property,
  setSelectedComponentState = null,
}) {
  const {
    handleDeleteSort,
    handleSortAction,
    propertyRef,
    propertiesToRender,
    sortTypeRef,
    currentTableFunc,
  } = useTableSortRuleActions({ setSelectedComponentState });

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
                  <div
                    className={[
                      styles["sort-select"],
                      styles["sort-property-options-box"],
                    ].join(" ")}
                  >
                    <div className={styles["sort-sort-icon"]}>
                      <SvgMarkup
                        classList="sort-icon icon-active icon-md"
                        fragId={property?.icon}
                        styles={styles}
                      />
                    </div>
                    <div className={styles["action-filter-text"]}>
                      {capitalize(property)}
                    </div>
                    <div className={styles["sort-dropdown-icon"]}>
                      <SvgMarkup
                        classList="sort-icon icon-active icon-sm"
                        fragId="arrow-down"
                        styles={styles}
                      />
                    </div>
                  </div>
                </ComponentOverlay.Open>
                <ComponentOverlay.Window
                  name="propertyOption"
                  objectToOverlay={propertyRef}
                >
                  <JournalTableHeadActionOptionComponent
                    componentName="sort"
                    form={true}
                    properties={propertiesToRender}
                    switchSortProp={true}
                  />
                </ComponentOverlay.Window>
              </div>
              <div className={styles["sort-type"]}>
                <ComponentOverlay.Open opens="sortTypeOption">
                  <div className={styles["sort-type-options"]}>
                    <div
                      className={[
                        styles["sort-type-options-box"],
                        styles["sort-select"],
                      ].join(" ")}
                      ref={sortTypeRef}
                    >
                      <div className={styles["action-filter-text"]}>
                        {currentTableFunc?.sort?.type ||
                          TABLE_SORT_TYPE[0].text}
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
                </ComponentOverlay.Open>
                <ComponentOverlay.Window
                  name="sortTypeOption"
                  objectToOverlay={sortTypeRef}
                >
                  <TableSortRuleOptionComponent onSelect={handleSortAction} />
                </ComponentOverlay.Window>
              </div>
            </ComponentOverlay>
          </div>
        </div>
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
      </div>
    </div>
  );
}

function TableSortRuleOptionComponent({ onSubmit, onSelect }) {
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

export default JournalTableHeadComponent;
