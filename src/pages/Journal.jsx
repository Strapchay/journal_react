import { useContext, useEffect, useRef, useState } from "react";
import { useUpdateJournalInfo } from "../features/journals/useUpdateJournalInfo";
import { AuthContext } from "../ProtectedRoute";
import SvgMarkup from "../SvgMarkup";
import {
  FILTER_FUNC_DEFAULTS,
  HEADER_JOURNAL_TITLE_LENGTH,
  NOTIFICATION_DELETE_MSG,
  PREPOSITIONS,
  SELECTED_COMPONENT_STATE_DEFAULTS,
  SIDE_PEEK_DEFAULTS,
  SIDEBAR_JOURNAL_TITLE_LENGTH,
  SORT_FUNC_DEFAULTS,
  TABLE_ACTION_OPTIONS,
  TABLE_HEAD_LIMIT,
  TABLE_PROPERTIES,
  TABLE_ROW_FILTER_PLACEHOLDER,
  TABLE_ROW_PLACEHOLDER,
  TABLE_SORT_TYPE,
  THROTTLE_TIMER,
} from "../utils/constants";
import {
  capitalize,
  dateTimeFormat,
  formatAPIRequestTagPayload,
  formatAPIResp,
  formatAPITableItems,
  formatJournalHeadingName,
  formatTagRenderedText,
  getCurrentTable,
  getSelectedItems,
  getTableItemWithMaxTags,
  moveCursorToTextEnd,
  swapItemIndexInPlace,
  tableRowActivator,
  valueEclipser,
} from "../utils/helpers";
import styles from "./Journal.module.css";
import ComponentOverlay, { OverlayContext } from "../ComponentOverlay";
import { useUpdateTableItem } from "../features/journals/useUpdateTableItem";
import toast from "react-hot-toast";
import { useCreateTable } from "../features/journals/useCreateTable";
import Modal from "../Modal";
import UpdatePwdForm from "./forms/UpdatePwdForm";
import UpdateInfoForm from "./forms/UpdateInfoForm";
import { useUpdateTags } from "../features/tags/useUpdateTags";
import { useDeleteTags } from "../features/tags/useDeleteTags";
import { useCreateTags } from "../features/tags/useCreateTags";
import ContainerSidePeek from "../ContainerSidePeek";

function Journal() {
  const { journalState, overlayContainerRef, sidePeek } =
    useContext(AuthContext);
  console.log("the jor state", journalState);

  return (
    <main>
      <div
        className={[
          styles["container"],
          styles[journalState?.sideBarClosed ? "nav-hide" : ""],
        ].join(" ")}
      >
        <JournalSidebar />
        <div className={styles["content-container"]}>
          <div className={styles["row"]}>
            <JournalInfoHeaderComponent />
            <div className={styles["container-main-content"]}>
              <div
                className={[styles["row"], styles["row-scroller"]].join(" ")}
              >
                <JournalInfoContentComponent />
                <div className={styles["table-container"]}>
                  <div className={styles["main-table"]}>
                    <div
                      className={[
                        styles["row"],
                        styles["row-scroller-table"],
                      ].join(" ")}
                    >
                      <JournalTableHeadComponent />

                      {/*<!-- start view option markup -->*/}

                      {/*<!-- end view option markup -->*/}

                      <PropertyRuleComponent />
                      <div className={styles["main-table-row"]}>
                        {/*<!-- swith table to div start -->*/}

                        <div role="tablerow" aria-label="Journals">
                          <JournalTableRowHeadComponent />
                          <JournalTableBodyComponent />
                        </div>

                        {/*<!-- table row adder -->
                        <!-- switch table to div end -->*/}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {sidePeek.isActive && <ContainerSidePeek itemId={sidePeek.itemId} />}
      </div>
      <div className={styles["overlay-container"]} ref={overlayContainerRef}>
        <div className={styles["overlay-container-base"]}>
          <div className={styles["overlay"]}>
            <div>
              <div className={styles["overlay-filler"]}></div>
              <div className={styles["overlay-content"]}>
                <div></div>
                <div className={styles["overlay-content-holder"]}>
                  <div className={styles["overlay-content-content"]}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function JournalSidebar() {
  return (
    <div className={styles["nav-sidebar"]}>
      <div className={styles["nav-sidebar-options"]}>
        <JournalSidebarHeadingMarkup />
        <JournalSidebarJournalMarkup />
        <JournalSidebarUserSettingsOption />
        <JournalSidebarLogout />
      </div>
    </div>
  );
}

function JournalSidebarHeadingMarkup() {
  const { user, journalState, dispatch } = useContext(AuthContext);
  const username = user?.username;

  return (
    <div className={styles["nav-options-heading"]}>
      <div className={styles["options-heading-icon"]}>
        {username?.[0] ?? ""}
      </div>
      <div className={styles["options-heading-title"]}>
        {formatJournalHeadingName(username)}
      </div>
      <SvgMarkup
        classList="angles-icon sidebar-open icon"
        fragId="angles-left"
        styles={styles}
        onClick={() => dispatch({ type: "updateSidebarClosed" })}
      />
    </div>
  );
}

function JournalSidebarJournalMarkup() {
  const { journalState, dispatch } = useContext(AuthContext);
  const [listTables, setListTables] = useState(false);
  const tables = journalState.tables.map((table) => [
    table.tableTitle,
    table.id,
  ]);
  const currentTableId = journalState.currentTable;

  function handleSidebarSwitchTableEvent(tableId) {
    if (tableId !== currentTableId)
      dispatch({ type: "updateCurrentTable", payload: tableId });
  }

  return (
    <div
      className={[styles["nav-option"], styles["nav-options-journal"]].join(
        " ",
      )}
    >
      <div
        className={styles["nav-group"]}
        onClick={() => setListTables((s) => !s)}
      >
        <div className={styles["nav-options-icon"]}>
          <SvgMarkup
            classList="table-list-arrow-render arrow-render arrow-right-icon icon icon-mid"
            fragId={listTables ? "arrow-down" : "arrow-right"}
            styles={styles}
          />
        </div>

        <div className={styles["nav-icon-text"]}>
          <div className={styles["nav-options-journal-icon"]}>
            <SvgMarkup
              classList="journal-icon icon"
              fragId="journal-icon"
              styles={styles}
            />
          </div>

          <div className={styles["nav-options-text"]}>
            {journalState?.name?.length > 0
              ? valueEclipser(journalState?.name, SIDEBAR_JOURNAL_TITLE_LENGTH)
              : "Untitled"}
          </div>
        </div>
      </div>
      <div className={styles["journal-tables-list"]}>
        <ul className={styles["tables-list"]}>
          {listTables &&
            tables.map((table) => (
              <div
                className={[
                  styles["tables-list-box"],
                  styles["hover"],
                  styles[table[1] === currentTableId ? "hover-bg-stay" : ""],
                ].join(" ")}
                data-id={table[1]}
                key={table[1]}
                onClick={() => handleSidebarSwitchTableEvent(table[1])}
              >
                <div className={styles["tables-list-disc"]}></div>
                <li className="tables-list-table">{table[0]}</li>
              </div>
            ))}
        </ul>
      </div>
    </div>
  );
}

function JournalSidebarUserSettingsOption() {
  const [listSettings, setListSettings] = useState(false);

  return (
    <div
      className={[styles["nav-option"], styles["nav-options-user"]].join(" ")}
    >
      <div
        className={styles["nav-group"]}
        onClick={() => setListSettings((s) => !s)}
      >
        <div className={styles["nav-options-icon"]}>
          <SvgMarkup
            classList="update-list-arrow-render arrow-render arrow-right-icon icon icon-mid"
            fragId={listSettings ? "arrow-down" : "arrow-right"}
            styles={styles}
          />
        </div>

        <div className={styles["nav-icon-text"]}>
          <div className={styles["nav-options-journal-icon"]}>
            <SvgMarkup
              classList={styles["icon"]}
              fragId="user-settings"
              styles={styles}
            />
          </div>
          <div className={styles["nav-options-text"]}>Update Info</div>
        </div>
      </div>
      <Modal>
        <div className={styles["journal-update-info-list"]}>
          {listSettings && (
            <ul className={styles["update-info-list"]}>
              <Modal.Open opens="update-info-form">
                <div
                  className={[styles["update-list-box"], styles["hover"]].join(
                    " ",
                  )}
                >
                  <div className={styles["update-list-disc"]}></div>
                  <li className={styles["update-option"]}>Update User Info</li>
                </div>
              </Modal.Open>
              <Modal.Window name="update-info-form">
                <UpdateInfoForm />
              </Modal.Window>
              <Modal.Open opens="update-pwd-form">
                <div
                  className={[styles["update-list-box"], styles["hover"]].join(
                    " ",
                  )}
                >
                  <div className={styles["update-list-disc"]}></div>
                  <li className={styles["update-option"]}>Update Password</li>
                </div>
              </Modal.Open>
              <Modal.Window name="update-pwd-form">
                <UpdatePwdForm />
              </Modal.Window>
            </ul>
          )}
        </div>
      </Modal>
    </div>
  );
}

function JournalSidebarLogout() {
  const { removeTokenAndLogout } = useContext(AuthContext);
  function handleLogoutEvent() {
    removeTokenAndLogout();
  }

  return (
    <div
      className={[styles["nav-option"], styles["nav-options-logout"]].join(" ")}
      onClick={handleLogoutEvent}
    >
      <div className={styles["nav-group"]}>
        <div className={styles["nav-icon-text"]}>
          <div className={styles["nav-options-journal-icon"]}>
            <SvgMarkup
              classList={styles["icon"]}
              fragId="logout"
              styles={styles}
            />
          </div>
          <div className={styles["nav-options-text"]}>Logout</div>
        </div>
      </div>
    </div>
  );
}

function JournalInfoHeaderComponent() {
  const { journalState, dispatch } = useContext(AuthContext);
  return (
    <div className={styles["container-header"]}>
      {journalState.sideBarClosed ? (
        <div
          className={[
            styles["sidebar-open"],
            styles["nav-options-sidebar-open-icon"],
          ].join(" ")}
          onClick={() => dispatch({ type: "updateSidebarClosed" })}
        >
          <SvgMarkup
            classList="angles-icon icon icon-lg"
            fragId="angles-right"
            styles={styles}
          />
        </div>
      ) : (
        ""
      )}
      <div className={styles["nav-options-journal-icon"]}>
        <SvgMarkup
          classList={[styles["journal-icon"], styles["icon"]].join(" ")}
          fragId="journal-icon"
          styles={styles}
        />
      </div>

      <div className={styles["nav-options-text"]}>
        {journalState?.name?.length > 0
          ? valueEclipser(journalState?.name, HEADER_JOURNAL_TITLE_LENGTH)
          : "Untitled"}
      </div>
    </div>
  );
}

function JournalInfoContentComponent() {
  const { journalState, dispatch } = useContext(AuthContext);
  const journalNameRef = useRef(null);
  const journalDescRef = useRef(null);
  const throttleTimerRef = useRef(null);
  const {
    updateJournalInfo,
    isLoading: isUpdating,
    error,
  } = useUpdateJournalInfo();

  useEffect(() => {
    if (!journalNameRef.current.textContent)
      journalNameRef.current.textContent = journalState?.name?.trim();
    if (!journalDescRef.current.textContent)
      journalDescRef.current.textContent = journalState?.description?.trim();
  }, [journalState]);

  function getRefTypeValue(type) {
    if (type === "name") return journalNameRef.current.textContent.trim();
    if (type === "description")
      return journalDescRef.current.textContent.trim();
  }

  function handleJournalInfoChange(type) {
    if (throttleTimerRef.current) {
      clearInterval(throttleTimerRef.current);
      throttleTimerRef.current = null;
    }

    dispatch({
      type: "updateJournalInfo",
      payload: {
        [type]: getRefTypeValue(type),
      },
    });
    throttleTimerRef.current = setTimeout(() => {
      const payload = {
        [`journal_${type}`]: getRefTypeValue(type),
      };
      updateJournalInfo(payload);
    }, THROTTLE_TIMER);
  }

  return (
    <div className={styles["main-content-info"]}>
      <div className={styles["main-content-heading"]}>
        <div className={styles["nav-options-journal-icon"]}>
          <SvgMarkup
            classList="journal-icon icon"
            fragId="journal-icon"
            styles={styles}
          />
        </div>

        <h2
          className={styles["journal-title-input"]}
          contentEditable={true}
          placeholder="Untitled"
          suppressContentEditableWarning={true}
          ref={journalNameRef}
          onKeyUp={(e) => handleJournalInfoChange("name")}
        >
          {/*journalState?.name?.trim()*/}
        </h2>
      </div>
      <div className={styles["main-content-description"]}>
        <div
          className={styles["content-description-input"]}
          contentEditable={true}
          ref={journalDescRef}
          suppressContentEditableWarning={true}
          onKeyUp={(e) => handleJournalInfoChange("description")}
        >
          {/*journalState?.description*/}
        </div>
      </div>
    </div>
  );
}

function JournalTableOptionComponent({ table, onSubmit, hasParent = false }) {
  const [renameActive, setRenameActive] = useState(false);
  const {
    renameTable,
    dispatch,
    token,
    journalState,
    duplicateTable,
    deleteTable,
  } = useContext(AuthContext);

  const [tableNameInput, setTableNameInput] = useState(table[0]);

  const toastInst = toast;

  function handleTableNameChange(e) {
    if (e.key === "Enter") {
      const data = {
        table_name: tableNameInput,
        journal: table[1],
      };

      renameTable(data, {
        onSuccess: () => {
          if (hasParent) onSubmit?.();
          dispatch({ type: "updateTableName", payload: tableNameInput });
          setRenameActive((v) => false);
        },
        onError: () => {
          if (hasParent) onSubmit?.();
        },
      });
    } else setTableNameInput((i) => e.target.value);
  }

  function handleTableDuplicate() {
    toastInst.loading("Duplicating table...");
    const payload = {
      journal_table: table[1],
      journal: journalState?.id,
      duplicate: true,
    };
    duplicateTable(payload, {
      onSuccess: (data) => {
        onSubmit?.();
        toastInst.remove();
        const res = formatAPIResp(data, "journalTables");
        dispatch({ type: "createTable", payload: res });
      },
      onError: (_) => {
        onSubmit?.();
        toastInst.remove();
      },
    });
  }

  function handleTableDelete() {
    deleteTable(table[1], {
      onSuccess: () => {
        onSubmit?.();
        dispatch({ type: "deleteTable", payload: table[1] });
      },
    });
  }

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

function JournalTableRowColumnComponent({
  journalName,
  activeTable,
  journalId,
}) {
  const tableHeadRef = useRef(null);
  const { journalState, dispatch, setSidePeek } = useContext(AuthContext);

  function handleSetCurrentTable(journalId) {
    if (journalId !== journalState.currentTable) {
      setSidePeek((_) => SIDE_PEEK_DEFAULTS);
      dispatch({ type: "updateCurrentTable", payload: journalId });
    }
  }

  return (
    <div
      className={[
        styles["table-row"],
        styles["table-journal"],
        styles[activeTable],
      ].join(" ")}
      // key={journalId}
      data-name={journalName}
      data-id={journalId}
      onClick={() => handleSetCurrentTable(journalId)}
      ref={tableHeadRef}
    >
      <ComponentOverlay key={journalId}>
        <ComponentOverlay.Open
          opens="tableColumnOption"
          conditional={activeTable}
        >
          <span
            className={styles["table-row-column-wrapper"]}
            // onClick={activeTable ? onClick : ""}
          >
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
      </ComponentOverlay>
    </div>
  );
}

function JournalTableRowComponent({ journalItems }) {
  const { dispatch, journalState } = useContext(AuthContext);

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
                key={journalId}
              />
            )
          );
        }
      })}
    </>
  );
}

function JournalTableHeadComponent() {
  const tableHeadRef = useRef(null);
  const { journalState, token, dispatch, selectedTableItems } =
    useContext(AuthContext);
  const { createTable } = useCreateTable(token);
  const tables = journalState.tables.map((table) => [
    table.tableTitle,
    table.id,
  ]);
  const currentTableId = journalState.currentTable;
  const switchTableAdd = tables?.length >= 5;
  const tableItems = swapItemIndexInPlace(tables, currentTableId);
  const selectedTableItemsLength = Object.values(selectedTableItems).filter(
    (v) => v,
  ).length;
  const [searchTable, setSearchTable] = useState("");
  const tableItemsToRender = searchTable.length
    ? tableItems?.filter((item) => item[0].toLowerCase().includes(searchTable))
    : tableItems;

  function handleAddTableEvent(e) {
    createTable(journalState.id, {
      onSuccess: (data) => {
        const formattedData = formatAPIResp(data, "journalTables");
        dispatch({ type: "createTable", payload: formattedData });
      },
    });
  }

  return (
    <div className={styles["main-table-head"]}>
      <div className={styles["main-table-head-box"]}>
        {!switchTableAdd && (
          <div className={styles["main-table-heading"]}>
            <JournalTableRowComponent
              journalItems={tableItems}
              // currentTableId={currentTableId}
            />
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
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ComponentOverlay.Window>
            </ComponentOverlay>
          </div>
        )}
        <JournalTableHeadActionComponent />
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

function JournalTableHeadOptionComponent({ tableItem }) {
  const tableViewOptionRef = useRef(null);
  return (
    <div className={[styles["table-list-content"], styles["hover"]].join(" ")}>
      <div className={styles["table-view-box"]}>
        <div className={styles["table-view-content"]}>
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
            >
              <JournalTableOptionComponent table={tableItem} hasParent={true} />
            </ComponentOverlay.Window>
          </ComponentOverlay>
        </div>
      </div>
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
}) {
  const { currentTableFunc, dispatch, journalState } = useContext(AuthContext);
  const placeholder = componentName[0].toUpperCase() + componentName.slice(1);
  const [searchText, setSearchText] = useState("");
  const renderedProperties = properties.filter((property) =>
    property.text.toLowerCase().includes(searchText?.toLowerCase()),
  );
  const namePrepositions = PREPOSITIONS.filter((pre) => pre.name);
  const tagPrepositions = PREPOSITIONS.filter((pre) => pre.tags);

  function onSelectProperty(property) {
    if (setSelectedComponentState)
      setSelectedComponentState((v) => ({
        componentName,
        property,
      }));
    if (
      componentName.toLowerCase() === "filter" &&
      !currentTableFunc?.filter?.active
    )
      dispatch({
        type: "updateTableFunc",
        payload: {
          filter: {
            ...FILTER_FUNC_DEFAULTS,
            conditional:
              property.toLowerCase() === "name"
                ? namePrepositions[0].condition
                : property.toLowerCase() === "tags"
                  ? tagPrepositions[0].condition
                  : null,
            active: true,
            // tags: [],
            property: property.toLowerCase(),
            component: componentName.toLowerCase(),
          },
        },
      });
    if (
      componentName.toLowerCase() === "sort" &&
      !currentTableFunc?.sort?.active
    )
      dispatch({
        type: "updateTableFunc",
        payload: {
          sort: {
            ...SORT_FUNC_DEFAULTS,
            active: true,
            type: TABLE_SORT_TYPE[0].text,
            property: property.toLowerCase(),
            component: componentName.toLowerCase(),
          },
        },
      });

    if (switchSortProp && currentTableFunc?.sort?.active) {
      dispatch({
        type: "updateTableFunc",
        payload: {
          sort: { ...currentTableFunc.sort, property: property.toLowerCase() },
        },
      });
      onSubmit?.();
    }
  }

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
                    opens={`${property?.text?.toLowerCase()}Filter`}
                    beforeRender={onSelectProperty.bind(
                      this,
                      property.text.toLowerCase(),
                    )}
                  >
                    <div
                      className={[
                        styles[`${componentName}-property-content`],
                        styles["action-property-content"],
                        // styles[property?.class ?? ""],
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

function PropertyRuleItemComponent({ rule, multipleRulesExist, index }) {
  const ruleItemRef = useRef(null);
  const { journalState } = useContext(AuthContext);

  function getRuleTextToRender(rule) {
    console.log("the rule val getruletextrend", rule);
    if (rule.component.toLowerCase() === "filter") {
      if (rule.tags.length > 0) {
        const tagValues = rule.tags.map(
          (tagId) => journalState.tags.find((tag) => tag.id === tagId).text,
        );
        return tagValues.join(", ");
      } else return rule.text;
    } else return rule.type;
  }

  return (
    <div
      className={[
        styles[index === 0 && multipleRulesExist && "first-action-container"],
        styles[`${rule?.component?.toLowerCase()}-action-container`],
        styles["property-action-container"],
      ].join(" ")}
      key={rule?.component}
    >
      <ComponentOverlay>
        <ComponentOverlay.Open opens={`${rule?.property}FilterRule`}>
          <div
            className={[
              styles[`${rule.component.toLowerCase()}-added-rule-box`],
              styles["property-added-rule-box"],
            ].join(" ")}
            ref={ruleItemRef}
          >
            <div className={styles["property-added-rule-property"]}>
              <div className={styles["property-rule-icon"]}>
                <SvgMarkup
                  classList={styles["property-added-rule-icon"]}
                  fragId={
                    TABLE_PROPERTIES.properties.find(
                      (prop) =>
                        prop.text.toLowerCase() === rule.property.toLowerCase(),
                    ).icon
                  }
                  styles={styles}
                />
              </div>
              <div
                className={[
                  styles[`${rule.component.toLowerCase()}-added-rule-name`],
                  styles["property-added-rule-name"],
                ].join(" ")}
              >
                {capitalize(rule.property)}:
              </div>
            </div>
            <div
              className={[
                styles[`${rule.component.toLowerCase()}-added-rule`],
                styles["added-rule"],
              ].join(" ")}
            >
              {getRuleTextToRender(rule)}
            </div>
            {/*rule.component.toLowerCase() === "filter" && (
            )*/}
            <div className={styles["added-rule-icon"]}>
              <SvgMarkup
                classList="rule-icon icon-sm"
                fragId="arrow-down"
                styles={styles}
              />
            </div>
          </div>
        </ComponentOverlay.Open>
        <ComponentOverlay.Window
          name={`${rule?.property}FilterRule`}
          objectToOverlay={ruleItemRef}
        >
          <>
            {rule?.component?.toLowerCase() === "filter" && (
              <TableFilterRuleComponent property={rule?.property} />
            )}

            {rule?.component?.toLowerCase() === "sort" && (
              <TableSortRuleComponent property={rule?.property} />
            )}
          </>
        </ComponentOverlay.Window>
      </ComponentOverlay>
    </div>
  );
}

function PropertyRuleComponent() {
  const { tableFuncPositionerRef, currentTableFunc } = useContext(AuthContext);
  const funcKeys = currentTableFunc ? Object.keys(currentTableFunc) : [];
  const rules = funcKeys
    .map((key) => currentTableFunc[key])
    .filter((func) => func.active);
  const multipleRulesExist = rules.length > 1;

  return (
    <div className={styles["property-container"]}>
      <div className={styles["property-actions"]} ref={tableFuncPositionerRef}>
        {rules.map((rule, i) => (
          <PropertyRuleItemComponent
            key={rule.component}
            rule={rule}
            multipleRulesExist={multipleRulesExist}
            index={i}
          />
        ))}
      </div>
      <div className={styles["div-filler"]}></div>
    </div>
  );
}

function PropertyRuleConditionalsComponent({ prepositions, onSubmit }) {
  const { currentTableFunc, dispatch } = useContext(AuthContext);

  function handlePrepositionSelect(e) {
    dispatch({
      type: "updateTableFunc",
      payload: {
        filter: {
          ...currentTableFunc.filter,
          conditional: e.target.textContent.trim(),
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

function TableFilterRuleOptionComponent({
  setSelectedComponentState,
  property,
  onSubmit,
  onTagsFilter,
}) {
  const { dispatch } = useContext(AuthContext);
  const tagOptionRef = useRef(null);

  function handleDeleteFilter() {
    dispatch({
      type: "updateTableFunc",
      payload: {
        filter: {},
      },
    });
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

function TableFilterRuleComponent({
  property,
  onClick,
  setSelectedComponentState = null,
}) {
  const { currentTableFunc, dispatch, journalState } = useContext(AuthContext);
  const optionRef = useRef(null);
  const prepositionRef = useRef(null);
  const selectedTagFiltersToRender = currentTableFunc?.filter?.tags
    ?.map((id) => journalState.tags.find((modelTag) => modelTag.id === id))
    .filter((tag) => tag);
  const tagFiltersExist = selectedTagFiltersToRender?.length;
  const propertyName = property?.[0].toUpperCase() + property?.slice(1);
  const prepositions = PREPOSITIONS.filter(
    (preposition) => preposition[property.toLowerCase()] === true,
  );
  const removeFilterInputOption = ["is empty", "is not empty"];
  const removeFilterInput = removeFilterInputOption.includes(
    currentTableFunc?.filter?.conditional?.toLowerCase(),
  );

  function handleFilterText(e) {
    dispatch({
      type: "updateTableFunc",
      payload: {
        filter: { ...currentTableFunc.filter, text: e.target.value },
      },
    });
  }

  function onRemoveTag(tagId) {
    dispatch({
      type: "updateTableFunc",
      payload: {
        filter: {
          ...currentTableFunc.filter,
          tags: [...currentTableFunc.filter.tags.filter((id) => id !== tagId)],
        },
      },
    });
    // setTagFilterIds((tagIds) => [...tagIds.filter((id) => id !== tagId)]);
  }

  function onTagsFilter(tagId) {
    // if (!remove) {
    const tagAlreadySelected = currentTableFunc?.filter?.tags?.find(
      (tId) => tId === tagId,
    );
    if (!tagAlreadySelected) {
      dispatch({
        type: "updateTableFunc",
        payload: {
          filter: {
            ...currentTableFunc.filter,
            tags: [...currentTableFunc.filter.tags, tagId],
          },
        },
      });
      // setTagFilterIds((tIds) => [...tIds, tagId]);}
    }
    // if (remove) onRemoveTag(tagId);
  }
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

function TableSortRuleComponent({
  property,
  setSelectedComponentState = null,
}) {
  const { currentTableFunc, dispatch } = useContext(AuthContext);
  const propertyRef = useRef(null);
  const sortTypeRef = useRef(null);
  const propertiesToRender = TABLE_PROPERTIES.properties.filter(
    (property) => property.text.toLowerCase() !== "created",
  );

  function handleSortAction(e) {
    dispatch({
      type: "updateTableFunc",
      payload: {
        sort: { ...currentTableFunc.sort, type: e.target.textContent.trim() },
      },
    });
  }

  function handleDeleteSort() {
    dispatch({
      type: "updateTableFunc",
      payload: {
        sort: {},
      },
    });
    if (setSelectedComponentState)
      setSelectedComponentState(SELECTED_COMPONENT_STATE_DEFAULTS);
  }

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

function JournalTableHeadActionComponent({ onClick }) {
  const {
    createTableItem,
    journalState,
    dispatch,
    setSidePeek,
    setSearchTableItemText,
    searchTableItemText,
    tableFuncPositionerRef,
    currentTableFunc,
  } = useContext(AuthContext);
  const filterRef = useRef(null);
  const sortRef = useRef(null);
  const [selectedComponentState, setSelectedComponentState] = useState(
    SELECTED_COMPONENT_STATE_DEFAULTS,
  );
  const propertiesToRender = TABLE_PROPERTIES.properties.filter(
    (property) => property.text.toLowerCase() !== "created",
  );
  const [allowSearch, setAllowSearch] = useState(false);

  function handleCreateAndOpenSidePeek() {
    createTableItem(
      { currentTableId: journalState.currentTable },
      {
        onSuccess: (data) => {
          const formatResp = formatAPITableItems([data]);
          dispatch({ type: "createTableItem", payload: formatResp });
          setSidePeek((_) => ({ isActive: true, itemId: formatResp[0].id }));
        },
      },
    );
  }

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
            objectToOverlay={filterRef}
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
            objectToOverlay={sortRef}
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
      </ComponentOverlay>
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
      <div
        className={[styles["table-row-options"], styles["table-row"]].join(" ")}
      >
        <div className={styles["table-row-icon"]}>
          <SvgMarkup
            classList={styles["table-icon"]}
            fragId="ellipsis"
            styles={styles}
          />
        </div>
      </div>
    </div>
  );
}

function JournalTableBodyCheckboxOptionComponent({ selectedItemsLength }) {
  const toastInst = toast;
  const toastRef = useRef(0);
  const checkboxTagOptionRef = useRef(null);
  const {
    unselectAllSelectedTableItems,
    deleteSelectedTableItems,
    duplicateSelectedTableItems,
    isDuplicatingTableItems,
    selectAllSelectedTableItems,
    selectedTableItems,
  } = useContext(AuthContext);

  if (isDuplicatingTableItems && toastRef.current === 0) {
    toastRef.current = 1;
    toastInst.loading("Duplicating items");
  }
  if (!isDuplicatingTableItems && toastRef.current > 0) {
    toastRef.current = 0;
    toastInst.remove();
  }
  return (
    <div className={styles["checkbox-options"]}>
      <div className={styles["checkbox-options-box"]}>
        <div
          className={[
            styles["checkbox-item"],
            styles["checkbox-total"],
            styles["hover"],
          ].join(" ")}
          onClick={unselectAllSelectedTableItems}
        >
          <div className={styles["checkbox-text"]}>
            {selectedItemsLength} selected
          </div>
        </div>
        <ComponentOverlay>
          <ComponentOverlay.Open opens="checkboxTags">
            <div
              className={[
                styles["checkbox-item"],
                styles["checkbox-tags"],
                styles["hover"],
              ].join(" ")}
              ref={checkboxTagOptionRef}
            >
              <SvgMarkup
                classList="icon-md icon-active"
                fragId="list-icon"
                styles={styles}
              />
              <div className={styles["checkbox-text"]}>Tags</div>
            </div>
          </ComponentOverlay.Open>
          <ComponentOverlay.Window
            name="checkboxTags"
            objectToOverlay={checkboxTagOptionRef}
          >
            <JournalTableBodyItemTagOptionOverlayComponent
              itemIds={getSelectedItems(selectedTableItems)}
            />
          </ComponentOverlay.Window>
        </ComponentOverlay>
        <div
          className={[
            styles["checkbox-item"],
            styles["checkbox-delete"],
            styles["hover"],
          ].join(" ")}
          onClick={deleteSelectedTableItems}
        >
          <SvgMarkup
            classList="icon-md icon-active"
            fragId="trashcan-icon"
            styles={styles}
          />
        </div>
        <div
          className={[
            styles["checkbox-item"],
            styles["checkbox-clone"],
            styles["hover"],
          ].join(" ")}
          onClick={duplicateSelectedTableItems}
        >
          <SvgMarkup
            classList="icon-md icon-active"
            fragId="clone"
            styles={styles}
          />
        </div>
      </div>
    </div>
  );
}

function JournalTableBodyComponent({ body = false, placeholder = false }) {
  const {
    createTableItem,
    journalState,
    dispatch,
    selectedTableItems,
    setSelectedTableItems,
    currentTableItems,
  } = useContext(AuthContext);

  function handleAddBodyItem() {
    createTableItem(
      { currentTableId: journalState.currentTable },
      {
        onSuccess: (data) => {
          const formatResp = formatAPITableItems([data]);
          dispatch({ type: "createTableItem", payload: formatResp });
        },
      },
    );
  }

  function onSelectTableItem(tableItemId) {
    setSelectedTableItems((s) => ({ ...s, [tableItemId]: !s[tableItemId] }));
  }

  return (
    <>
      <div role="tablebody">
        {!currentTableItems?.length && (
          <JournalTableBodyPlaceholder
            placeholder={placeholder}
            onClick={handleAddBodyItem}
          />
        )}
        {currentTableItems?.length
          ? currentTableItems.map((tableItem) => (
              <JournalTableBodyItemComponent
                item={tableItem}
                key={tableItem?.id}
                tableItemsMap={selectedTableItems}
                onSelectTableItem={onSelectTableItem}
              />
            ))
          : ""}
      </div>
      {!body && (
        <div role="tableadd">
          <div role="rowgroup" className={styles["rowfill"]}>
            <div role="row" className={styles["row-adder"]}>
              <div
                className={styles["row-adder-content"]}
                onClick={handleAddBodyItem}
              >
                <div className={styles["row-adder-icon"]}>
                  <SvgMarkup
                    classList={styles["row-icon"]}
                    fragId="plus"
                    styles={styles}
                  />
                </div>
                <div
                  className={[
                    styles["row-adder-text"],
                    styles["color-dull"],
                  ].join(" ")}
                >
                  New
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function JournalTableBodyPlaceholder({ placeholder, onClick }) {
  return (
    <div role="rowgroup" className={styles["rowfill"]}>
      <div role="row">
        <div
          className={
            styles[placeholder ? "row-adder-filter" : "row-adder-content"]
          }
          // ref={ref}
          onClick={onClick}
        >
          <div
            className={[styles["row-adder-text"], styles["color-dull"]].join(
              " ",
            )}
          >
            {placeholder ? TABLE_ROW_FILTER_PLACEHOLDER : TABLE_ROW_PLACEHOLDER}
          </div>
        </div>
      </div>
    </div>
  );
}

function JournalTableBodyItemInputOverlayComponent({ item, onSubmit }) {
  const [text, setText] = useState("");
  const inputRef = useRef(null);
  const { updateTableItem } = useUpdateTableItem(onSubmit);
  const { dispatch } = useContext(AuthContext);

  useEffect(() => {
    inputRef.current.textContent = item.itemTitle;
    moveCursorToTextEnd(inputRef.current);
  }, [item]);

  function handleInputEvent(e) {
    if (e.key !== "Enter") setText(e.target.textContent);
    else
      updateTableItem(
        {
          payload: {
            itemId: item?.id,
            title: text,
          },
          type: "title",
        },
        {
          onSuccess: (data) => {
            const res = formatAPITableItems([data]);
            dispatch({ type: "updateTableItem", payload: res });
            onSubmit?.();
          },
        },
      );
  }
  return (
    <div
      className={styles["row-actions-text-input"]}
      contentEditable={true}
      ref={inputRef}
      onKeyUp={handleInputEvent}
    ></div>
  );
}

function JournalTableBodyItemSelectedTagsRenderComponent({
  tagProperty,
  addXmark = false,
  onRemoveTag,
}) {
  return (
    <>
      <div
        className={[
          styles[addXmark ? "tag-tag" : "row-tag-tag"],
          styles[tagProperty.color],
        ].join(" ")}
        data-id={tagProperty.id}
      >
        {formatTagRenderedText(tagProperty?.text)}
        {addXmark ? (
          <div
            className={styles["row-tag-icon"]}
            onClick={() => onRemoveTag(tagProperty.id)}
          >
            <SvgMarkup
              classList={styles["tags-items-icon"]}
              fragId="xmark"
              styles={styles}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

function JournalTableBodyItemTagsOptionEditComponent({
  tag,
  onClick,
  onSubmit,
}) {
  const { journalState, dispatch } = useContext(AuthContext);
  const [tagName, setTagName] = useState(tag.text);
  const tagsColor = journalState.tagsColor;
  const { updateTag } = useUpdateTags();
  const { deleteTags } = useDeleteTags();

  function handleTagNameUpdate(e) {
    if (e.key === "Enter") {
      const tagToUpdate = { ...tag };
      tagToUpdate.text = tagName;
      const updateObj = formatAPIRequestTagPayload(
        { tag: tagToUpdate },
        "tagsValue",
      );
      updateTag(updateObj, {
        onSuccess: (data) => {
          onSubmit?.();
          dispatch({ type: "updateTag", payload: tagToUpdate });
        },
      });
    } else setTagName((t) => e.target.value);
  }

  function handleTagDelete() {
    deleteTags(tag.id, {
      onSuccess: () => {
        dispatch({ type: "deleteTag", payload: tag.id });
      },
    });
  }

  function handleColorSelect(colorValue) {
    const tagToUpdate = { ...tag };
    tagToUpdate.color = colorValue;
    const updateObj = formatAPIRequestTagPayload(
      { tag: tagToUpdate },
      "tagsValue",
    );
    updateTag(updateObj, {
      onSuccess: (data) => {
        dispatch({ type: "updateTag", payload: tagToUpdate });
      },
    });
  }

  return (
    <div className={styles["row-tag-options"]} onClick={onClick}>
      <div className={styles["row-tag-options-box"]}>
        <div className={styles["row-tag-edit-actions"]}>
          <input
            type="text"
            className={[styles["tag-edit"], styles["component-form"]].join(" ")}
            defaultValue={tag.text}
            onKeyUp={handleTagNameUpdate}
          />

          <ComponentOverlay>
            <ComponentOverlay.Open opens="deleteNotifier">
              <div className={styles["row-tag-delete"]}>
                <div className={styles["row-tag-icon"]}>
                  <SvgMarkup
                    classList={styles["row-icon"]}
                    fragId="trashcan-icon"
                    styles={styles}
                  />
                </div>
                <div className={styles["row-tag-text"]}>Delete</div>
              </div>
            </ComponentOverlay.Open>
            {
              <ComponentOverlay.Window name="deleteNotifier">
                <OverlayNotificationComponent
                  text={NOTIFICATION_DELETE_MSG}
                  type="deleteNotifier"
                  onComplete={handleTagDelete}
                />
              </ComponentOverlay.Window>
            }
          </ComponentOverlay>
        </div>
      </div>
      <div className={styles["row-tag-colors"]}>
        <div className={styles["colors-info"]}>COLORS</div>
        <div className={styles["colors-picker"]}>
          {tagsColor.map((color) => {
            const checkmark =
              color.color_value.toLowerCase() === tag.color.toLowerCase();
            return (
              <div
                className={styles["colors"]}
                key={color.color}
                onClick={() => handleColorSelect(color.color_value)}
              >
                <div
                  className={[styles["color"], styles[color.color_value]].join(
                    " ",
                  )}
                ></div>
                <div className={styles["color-text"]}>{color.color}</div>
                {checkmark ? (
                  <div className={styles["color-row-icon"]}>
                    <SvgMarkup
                      classList="row-icon icon-md"
                      fragId="checkmark"
                      styles={styles}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
    // </div>
  );
}

function JournalTableBodyItemTagsOptionsOptionIcon({ tag }) {
  const tagOptionRef = useRef(null);

  return (
    <div
      className={styles["row-option-icon"]}
      ref={tagOptionRef}
      data-id={tag?.id}
    >
      <ComponentOverlay>
        <ComponentOverlay.Open opens="tagOptionsEdit">
          <SvgMarkup
            classList="row-icon icon-md"
            fragId="ellipsis"
            styles={styles}
          />
        </ComponentOverlay.Open>
        <ComponentOverlay.Window
          name="tagOptionsEdit"
          objectToOverlay={tagOptionRef}
        >
          <JournalTableBodyItemTagsOptionEditComponent tag={tag} key={tag.id} />
        </ComponentOverlay.Window>
      </ComponentOverlay>
    </div>
  );
}

function JournalTableBodyItemTagsOptionsAvailableComponent({
  disableOptionsNudge = false,
  searchTags = "",
  onSelectTag,
  onCreateTag,
  randomColorRef,
  renderedTags,
}) {
  const { journalState, dispatch } = useContext(AuthContext);
  const tags = journalState?.tags;

  function getRandomColor() {
    const randomColor = Math.trunc(Math.random() * 9) + 1;
    randomColorRef.current = journalState.tagsColor[randomColor].color_value;
    return randomColorRef.current;
  }

  return (
    <>
      {renderedTags?.map((tag) => (
        <div className={styles["tags-option"]} key={tag?.id} data-id={tag?.id}>
          <div className={styles["row-drag-icon"]}>
            <SvgMarkup
              classList="row-icon icon-md"
              fragId="drag-icon"
              styles={styles}
            />
          </div>
          <div
            className={styles["row-option-tag"]}
            onClick={() => onSelectTag(tag.id)}
          >
            <JournalTableBodyItemSelectedTagsRenderComponent
              tagProperty={tag}
            />
          </div>
          {!disableOptionsNudge ? (
            <JournalTableBodyItemTagsOptionsOptionIcon tag={tag} />
          ) : (
            ""
          )}
        </div>
      ))}
      {renderedTags?.length === 0 && (
        <div className={styles["tag-create"]} onClick={onCreateTag}>
          Create
          <div
            className={[styles["tag-tag"], styles[getRandomColor()]].join(" ")}
          >
            {formatTagRenderedText(searchTags)}
          </div>
        </div>
      )}
    </>
  );
}

export function JournalTableBodyItemTagOptionOverlayComponent({
  itemIds,
  itemTags = null, //NOTE:if the itemIds is > 1, no itemTags is supplied
  disableInput = false,
  onTagsFilter = null,
  onFilterComplete = null,
}) {
  const { journalState, dispatch } = useContext(AuthContext);
  const { addExtraAction } = useContext(OverlayContext);
  const [searchTagValue, setSearchTagValue] = useState("");
  const searchTagRef = useRef(null);
  const randomColorRef = useRef("");
  const { createTag } = useCreateTags();
  const isMultipleItemIds = itemIds?.length > 1;
  const { updateTableItem } = useUpdateTableItem(
    null,
    isMultipleItemIds,
    itemIds,
  );
  const tagsValue = isMultipleItemIds
    ? getTableItemWithMaxTags(getCurrentTable(journalState), itemIds)?.itemTags
    : itemTags;
  const tagIds = tagsValue?.length ? tagsValue.map((v) => v.id) : [];
  const [selectedTagIds, setSelectedTagIds] = useState(tagIds);
  const selectedTagsToRender = selectedTagIds
    .map((id) => journalState.tags.find((modelTag) => modelTag.id === id))
    .filter((tag) => tag);
  const tagsExist = selectedTagsToRender?.length;
  const renderedTags = searchTagValue.length
    ? journalState?.tags?.filter((tag) =>
        tag.text.toLowerCase().includes(searchTagValue),
      )
    : journalState?.tags;

  useEffect(() => {
    function handleSelectedTagsSaveToTableItem() {
      const payload = {
        payload: {
          tags: selectedTagIds,
        },
      };
      if (isMultipleItemIds) {
        payload.payload.itemIds = itemIds;
        payload.type = "selectTags";
      }
      if (!isMultipleItemIds) {
        payload.payload.itemId = itemIds[0];
        payload.type = "tags";
      }

      updateTableItem(payload);
    }

    if (!disableInput) addExtraAction(handleSelectedTagsSaveToTableItem);
    if (disableInput) addExtraAction(onFilterComplete);
  }, [
    dispatch,
    disableInput,
    addExtraAction,
    isMultipleItemIds,
    itemIds,
    selectedTagIds,
    updateTableItem,
    selectedTagsToRender,
    onFilterComplete,
  ]);

  function onSelectTag(tagId) {
    const tagAlreadySelected = selectedTagIds.find((tId) => tId === tagId);
    if (!tagAlreadySelected && !disableInput)
      setSelectedTagIds((tagIds) => [...tagIds, tagId]);

    if (disableInput) onTagsFilter(tagId);
  }

  function onRemoveTag(tagId) {
    setSelectedTagIds((tagIds) => [...tagIds.filter((tId) => tId !== tagId)]);
  }

  function handleCreateTag() {
    searchTagRef.current.value = "";
    const tagColor = journalState.tagsColor.find(
      (color) => color.color_value === randomColorRef.current,
    );
    const payload = {
      tag_name: searchTagValue,
      tag_color: tagColor.color,
      tag_class: tagColor.color_value,
    };
    createTag(payload, {
      onSuccess: (data) => {
        const res = formatAPIResp(data, "apiTags");
        setSearchTagValue("");
        dispatch({ type: "createTag", payload: res });
        setSelectedTagIds((v) => [...v, res.id]);
      },
    });
  }

  function handleSetOrCreateTagValue(e) {
    if (e.key === "Enter") {
      if (!renderedTags?.length) {
        handleCreateTag();
      }
    } else if (e.key === "Backspace" && !searchTagValue.length) {
      setSelectedTagIds((ids) => [...ids.slice(0, ids.length - 1)]);
    } else setSearchTagValue((v) => e.target.value);
  }

  return (
    <div
      className={[styles["row-tag-popup"], styles["options-markup"]].join(" ")}
      data-id={!isMultipleItemIds ? itemIds[0] : ""}
    >
      <div className={styles["row-tag-box"]}>
        {!disableInput && (
          <div className={styles["tag-input-container"]}>
            <div className={styles["tag-input"]}>
              <div className={styles["tags-items"]}>
                {tagsExist
                  ? selectedTagsToRender.map((tag) => (
                      <JournalTableBodyItemSelectedTagsRenderComponent
                        tagProperty={tag}
                        addXmark={true}
                        onRemoveTag={onRemoveTag}
                        key={tag?.id}
                      />
                    ))
                  : ""}

                <input
                  type="text"
                  className={styles["tag-input-input"]}
                  placeholder="Search or create tag..."
                  defaultValue={searchTagValue}
                  ref={searchTagRef}
                  onKeyUp={handleSetOrCreateTagValue}
                />
              </div>
            </div>
          </div>
        )}
        <div className={styles["tags-box"]}>
          <div className={styles["tags-info"]}>
            Select an option or create one
          </div>
          <div className={styles["tags-available"]}>
            <JournalTableBodyItemTagsOptionsAvailableComponent
              disableOptionsNudge={disableInput}
              searchTags={searchTagValue}
              onSelectTag={onSelectTag}
              onCreateTag={handleCreateTag}
              randomColorRef={randomColorRef}
              renderedTags={renderedTags}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function JournalTableBodyItemHoverComponent({ item }) {
  const { setSidePeek, sidePeek } = useContext(AuthContext);

  return (
    <div
      className={[styles["row-actions-render"]].join(" ")}
      onClick={() =>
        setSidePeek((v) => ({ ...v, isActive: true, itemId: item?.id }))
      }
    >
      <div className={styles["row-actions-render-icon"]}>
        <SvgMarkup
          classList={styles["row-icon"]}
          fragId="arrow-open"
          styles={styles}
        />
      </div>
      <div className={styles["row-actions-render-text"]}>OPEN</div>
      <div className={styles["row-actions-tooltip"]}>
        <div className={styles["tooltip-text"]}>Open in side peek</div>
      </div>
    </div>
  );
}

function JournalTableBodyItemComponent({
  item,
  tableItemsMap,
  onSelectTableItem,
}) {
  const inputRef = useRef(null);
  const tagRef = useRef(null);
  const [hoverActive, setHoverActive] = useState(false);
  const textToCopyRef = useRef(null);
  const {
    createTableItem,
    journalState,
    dispatch,
    handleCopyToClipboardEvent,
  } = useContext(AuthContext);

  function handleAddRelativeTableBodyItemEvent(e) {
    const currentTableId = journalState.currentTable;
    const currentTableIndex = journalState.tables.findIndex(
      (table) => table.id === currentTableId,
    );

    createTableItem(
      {
        currentTableId,
        relativeItem: item.id,
        tableItems: journalState.tables[currentTableIndex].tableItems,
      },
      {
        onSuccess: (data) => {
          const formatResp = formatAPITableItems([data]);
          dispatch({
            type: "createRelativeTableItem",
            payload: formatResp,
            relativeItem: item.id,
            tableItemInputActive: formatResp[0].id,
          });
        },
      },
    );
  }

  return (
    <div
      role="tablecontent"
      className={tableItemsMap[item?.id] ? styles["highlight-rows"] : ""}
      onMouseOver={() => {
        if (
          !journalState.tableItemInputActive ||
          journalState.tableItemInputActive !== item.id
        )
          setHoverActive(true);
      }}
      onMouseOut={() => setHoverActive(false)}
    >
      <div className={styles["tableInput-container"]}>
        <label className={styles["tableInput"]}>
          <input
            type="checkbox"
            name=""
            className={[
              styles["checkboxInput"],
              tableItemsMap[item?.id] ? styles["visible"] : "",
            ].join(" ")}
            autoComplete="off"
            checked={tableItemsMap[item?.id] ?? false}
            onChange={() => onSelectTableItem(item?.id)}
          />
        </label>
      </div>
      <div role="rowgroup">
        <div
          role="row"
          className={styles["row-actions-handler-container"]}
          data-id={item.id}
        >
          <span
            role="cell"
            className={[styles["table-item"], styles["table-item-name"]].join(
              " ",
            )}
          >
            <div className={styles["row-actions-segment"]} ref={inputRef}>
              <ComponentOverlay>
                <ComponentOverlay.Open
                  opens="nameInput"
                  click={
                    journalState.tableItemInputActive &&
                    journalState.tableItemInputActive === item.id
                      ? false
                      : true
                  }
                >
                  <div
                    className={[
                      styles["name-actions-text"],
                      styles["row-actions-text"],
                      styles["highlight-column"],
                    ].join(" ")}
                  >
                    {item.itemTitle}
                  </div>
                </ComponentOverlay.Open>
                <ComponentOverlay.Window
                  name="nameInput"
                  objectToOverlay={inputRef}
                >
                  <JournalTableBodyItemInputOverlayComponent item={item} />
                </ComponentOverlay.Window>
              </ComponentOverlay>
              {hoverActive && (
                <JournalTableBodyItemHoverComponent item={item} />
              )}
            </div>
          </span>
          <span
            role="cell"
            className={[
              styles["table-item"],
              styles["table-item-created"],
            ].join(" ")}
          >
            <div className={styles["row-actions-segment"]}>
              <div
                className={[
                  styles["created-actions-text"],
                  styles["row-actions-text"],
                ].join(" ")}
                ref={textToCopyRef}
              >
                {dateTimeFormat(item.created ?? item.id)}
              </div>
              {hoverActive && (
                <div className={[styles["row-actions-render"]].join(" ")}>
                  <div
                    className={styles["row-actions-render-icon"]}
                    onClick={() => handleCopyToClipboardEvent(textToCopyRef)}
                  >
                    <SvgMarkup
                      classList={styles["row-icon"]}
                      fragId="copy"
                      styles={styles}
                    />
                  </div>
                  <div className={styles["row-actions-tooltip"]}>
                    <div className={styles["tooltip-text"]}>
                      Copy to Clipboard
                    </div>
                  </div>
                </div>
              )}
            </div>
          </span>
          <span
            role="cell"
            className={[styles["table-item"], styles["table-item-tags"]].join(
              " ",
            )}
            ref={tagRef}
          >
            <ComponentOverlay>
              <ComponentOverlay.Open opens="tagOption">
                <JournalTableBodyItemTagItem tags={item?.itemTags} />
              </ComponentOverlay.Open>
              <ComponentOverlay.Window
                name="tagOption"
                objectToOverlay={tagRef}
              >
                <JournalTableBodyItemTagOptionOverlayComponent
                  itemIds={[item?.id]}
                  itemTags={item?.itemTags}
                />
              </ComponentOverlay.Window>
            </ComponentOverlay>
          </span>
        </div>
        {hoverActive && (
          <div className={styles["row-actions-handler"]} data-id={item.id}>
            <div
              className={[
                styles["row-actions-icon"],
                styles["row-add-icon"],
                styles["hover"],
              ].join(" ")}
              onClick={handleAddRelativeTableBodyItemEvent}
            >
              <SvgMarkup
                classList={styles["row-icon"]}
                fragId="plus"
                styles={styles}
              />
            </div>
            <div className="row-actions-icon row-drag-icon hover">
              <SvgMarkup
                classList={styles["row-icon"]}
                fragId="drag-icon"
                styles={styles}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function JournalTableBodyItemTagItem({ tags, onClick }) {
  const { journalState } = useContext(AuthContext);
  const tagsExist = tags?.length > 0;
  const journalTags = [...journalState.tags];

  return (
    <div
      className={[styles["tags-actions-text"], styles["row-actions-text"]].join(
        " ",
      )}
      onClick={onClick}
    >
      {tagsExist &&
        tags.map((tag, i) => {
          const tagProperty = journalTags.find(
            (modelTag) => modelTag.id === tag.id,
          );

          return tagProperty ? (
            <div
              className={[styles["tag-tag"], styles[tagProperty.color]].join(
                " ",
              )}
              key={tagProperty?.id}
            >
              {tagProperty.text}
            </div>
          ) : (
            ""
          );
        })}
    </div>
  );
}

function OverlayNotificationComponent({
  text,
  onClick,
  onSubmit,
  type,
  onComplete = null,
}) {
  return (
    <div className={styles["notification-render"]} onClick={onClick}>
      <div className={styles["notification-render-box"]}>
        <div className={styles["notification-text"]}>{text}</div>
        {type === "deleteNotifier" && (
          <OverlayNotificationDeleteNotifierComponent
            onCancel={onSubmit}
            onComplete={onComplete}
          />
        )}
      </div>
    </div>
  );
}

function OverlayNotificationDeleteNotifierComponent({ onCancel, onComplete }) {
  return (
    <div className={styles["notification-action-container"]}>
      <div
        className={[
          styles["notification-btn"],
          styles["notification-cancel-btn"],
          styles["hover-deep-dull"],
        ].join(" ")}
        onClick={onCancel}
      >
        Cancel
      </div>
      <div
        className={[
          styles["notification-btn"],
          styles["notification-delete-btn"],
          styles["hover-tomato"],
        ].join(" ")}
        onClick={onComplete}
      >
        Remove
      </div>
    </div>
  );
}

export default Journal;
