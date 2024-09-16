import { useContext, useEffect, useRef } from "react";
import { useUpdateJournalInfo } from "../features/journals/useUpdateJournalInfo";
import { AuthContext } from "../ProtectedRoute";
import SvgMarkup from "../SvgMarkup";
import {
  HEADER_JOURNAL_TITLE_LENGTH,
  SIDEBAR_JOURNAL_TITLE_LENGTH,
  TABLE_HEAD_LIMIT,
  TABLE_ROW_FILTER_PLACEHOLDER,
  TABLE_ROW_PLACEHOLDER,
  THROTTLE_TIMER,
} from "../utils/constants";
import {
  dateTimeFormat,
  formatAPITableItems,
  formatJournalHeadingName,
  swapItemIndexInPlace,
  tableRowActivator,
  valueEclipser,
} from "../utils/helpers";
import styles from "./Journal.module.css";

function Journal() {
  const { journalState, dispatch } = useContext(AuthContext);
  console.log("the jor state", journalState);
  // console.log("the journals value", journals, journalsLoading);
  // const tableBodyRef = useRef(null);

  return (
    <main>
      <div className={styles["container"]}>
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
                      <div className={styles["main-table-head"]}>
                        <div className={styles["main-table-head-box"]}>
                          <JournalTableHeadComponent />
                        </div>
                      </div>

                      {/*<!-- start view option markup -->*/}

                      {/*<!-- end view option markup -->*/}

                      <div className={styles["property-container"]}>
                        <div className={styles["property-actions"]}></div>
                        <div className={styles["div-filler"]}></div>
                      </div>
                      <div className={styles["main-table-row"]}>
                        {/*<!-- swith table to div start -->*/}

                        <div role="tablerow" aria-label="Journals">
                          <div role="tablehead">
                            <div className={styles["tableInput-container"]}>
                              <label className={styles["tableInput"]}>
                                <input
                                  type="checkbox"
                                  name=""
                                  id="checkboxInput"
                                  className={styles["checkboxInput"]}
                                />
                              </label>
                            </div>
                            <div role="rowgroup">
                              <div role="row">
                                <span role="columnhead">
                                  <div
                                    className={styles["action-filter-content"]}
                                  >
                                    <div
                                      className={styles["action-filter-icon"]}
                                    >
                                      <SvgMarkup
                                        classList="filter-icon"
                                        fragId="alphabet-icon"
                                        styles={styles}
                                      />
                                    </div>
                                    <div
                                      className={styles["action-filter-text"]}
                                    >
                                      Name
                                    </div>
                                  </div>
                                </span>
                                <span role="columnhead">
                                  <div
                                    className={styles["action-filter-content"]}
                                  >
                                    <div
                                      className={styles["action-filter-icon"]}
                                    >
                                      <SvgMarkup
                                        classList="filter-icon"
                                        fragId="clock"
                                        styles={styles}
                                      />
                                    </div>

                                    <div
                                      className={styles["action-filter-text"]}
                                    >
                                      Created
                                    </div>
                                  </div>
                                </span>
                                <span role="columnhead">
                                  <div
                                    className={styles["action-filter-content"]}
                                  >
                                    <div
                                      className={styles["action-filter-icon"]}
                                    >
                                      <SvgMarkup
                                        classList="filter-icon"
                                        fragId="list-icon"
                                        styles={styles}
                                      />
                                    </div>
                                    <div
                                      className={styles["action-filter-text"]}
                                    >
                                      Tags
                                    </div>
                                  </div>
                                </span>
                              </div>
                            </div>
                          </div>
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
      </div>
      <div className={styles["overlay-container"]}>
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
      {/* <!-- <div className="alert-box">
        <div className={styles["alert-msg"]}>ksdlfjsldf</div>
      </div> --> */}
    </main>
  );
}

function JournalSidebar() {
  //TODO: get username from journals
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
  const { journalState } = useContext(AuthContext);
  const username = journalState.username;

  return (
    <div className={styles["nav-options-heading"]}>
      <div className={styles["options-heading-icon"]}>
        {username?.[0] ?? ""}
      </div>
      <div className={styles["options-heading-title"]}>
        {formatJournalHeadingName(username)}
      </div>
      <SvgMarkup
        classList="angles-icon sidebar-close icon"
        fragId="angles-left"
        styles={styles}
      />
    </div>
  );
}

function JournalSidebarJournalMarkup() {
  const { journalState } = useContext(AuthContext);
  return (
    <div
      className={[styles["nav-option"], styles["nav-options-journal"]].join(
        " ",
      )}
    >
      <div className={styles["nav-group"]}>
        <div className={styles["nav-options-icon"]}>
          <SvgMarkup
            classList="table-list-arrow-render arrow-render arrow-right-icon icon icon-mid"
            fragId="arrow-right"
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
        <ul className={styles["tables-list"]}></ul>
      </div>
    </div>
  );
}

function JournalSidebarUserSettingsOption() {
  return (
    <div
      className={[styles["nav-option"], styles["nav-options-user"]].join(" ")}
    >
      <div className={styles["nav-group"]}>
        <div className={styles["nav-options-icon"]}>
          <SvgMarkup
            classList="update-list-arrow-render arrow-render arrow-right-icon icon icon-mid"
            fragId="arrow-right"
            styles={styles}
          />
        </div>

        <div className={styles["nav-icon-text"]}>
          <div className={styles["nav-options-journal-icon"]}>
            <SvgMarkup
              classList="icon"
              fragId="user-settings"
              styles={styles}
            />
          </div>
          <div className={styles["nav-options-text"]}>Update Info</div>
        </div>
      </div>
      <div className={styles["journal-update-info-list"]}>
        <ul className={styles["update-info-list"]}></ul>
      </div>
    </div>
  );
}

function JournalSidebarLogout() {
  return (
    <div
      className={[styles["nav-option"], styles["nav-options-logout"]].join(" ")}
    >
      <div className={styles["nav-group"]}>
        <div className={styles["nav-icon-text"]}>
          <div className={styles["nav-options-journal-icon"]}>
            <SvgMarkup classList="icon" fragId="logout" styles={styles} />
          </div>
          <div className="nav-options-text">Logout</div>
        </div>
      </div>
    </div>
  );
}

function JournalInfoHeaderComponent() {
  const { journalState } = useContext(AuthContext);
  return (
    <div className={styles["container-header"]}>
      <div className={styles["nav-options-journal-icon"]}>
        <SvgMarkup
          classList="journal-icon icon"
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

function JournalTableRowComponent({ journalItems, currentTableId }) {
  return (
    <>
      {journalItems?.map((journal, i) => {
        const [journalName, journalId] = journal;
        const activeTable = tableRowActivator(currentTableId, journalId, i);

        {
          return (
            i < 4 && (
              <div
                className={[
                  styles["table-row"],
                  styles["table-journal"],
                  styles[activeTable],
                ].join(" ")}
                key={journalId}
                data-name={journalName}
                data-id={journalId}
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
              </div>
            )
          );
        }
      })}
    </>
  );
}

function JournalTableHeadComponent() {
  const { journalState } = useContext(AuthContext);
  const tables = journalState.tables.map((table) => [
    table.tableTitle,
    table.id,
  ]);
  const currentTableId = journalState.currentTable;
  const switchTableAdd = tables?.length >= 5;
  const tableItems = swapItemIndexInPlace(tables, currentTableId);

  return (
    <>
      {!switchTableAdd && (
        <div className={styles["main-table-heading"]}>
          <JournalTableRowComponent
            journalItems={tableItems}
            currentTableId={currentTableId}
          />
          <div
            className={[styles["table-column-adder"], styles["table-row"]].join(
              " ",
            )}
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
          <div
            className={[
              styles["table-column-options"],
              styles["table-row"],
            ].join(" ")}
          >
            <div className={styles["table-row-text"]}>
              {tables.length - TABLE_HEAD_LIMIT} more...
            </div>
          </div>
        </div>
      )}
      <JournalTableHeadActionComponent />
    </>
  );
}

function JournalTableHeadActionComponent() {
  return (
    <div className={styles["main-table-actions"]}>
      <div
        className={[
          styles["table-row"],
          styles["table-action-row"],
          styles["table-filter"],
        ].join(" ")}
      >
        <div className={styles["table-row-text"]}>Filter</div>
      </div>
      <div
        className={[
          styles["table-row"],
          styles["table-action-row"],
          styles["table-sort"],
        ].join(" ")}
      >
        <div className={styles["table-row-text"]}>Sort</div>
      </div>
      <div
        className={[
          styles["table-row"],
          styles["table-action-row"],
          styles["table-row-search"],
        ].join(" ")}
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
          className={[styles["search-input"], styles["hide-search-input"]].join(
            " ",
          )}
          placeholder="Type to search..."
        />
      </div>
      <div
        className={[
          styles["table-row-button"],
          styles["table-action-row"],
        ].join(" ")}
      >
        <div className={styles["table-button"]}>
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

function JournalTableBodyComponent({ body = false, placeholder = false }) {
  const { createTableItem, createTableItemError, journalState, dispatch } =
    useContext(AuthContext);
  const currentTableIndex = journalState.tables.findIndex(
    (table) => table.id === journalState.currentTable,
  );
  const currentTable = journalState?.tables?.[currentTableIndex];
  const currentTableItems = currentTable?.tableItems;
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
  return (
    <>
      <div role="tablebody">
        {!currentTableItems?.length && (
          <JournalTableBodyPlaceholder
            placeholder={placeholder}
            onClick={handleAddBodyItem}
          />
        )}
        {currentTableItems?.length &&
          currentTableItems.map((tableItem) => (
            <JournalTableBodyItemComponent
              item={tableItem}
              key={tableItem?.id}
            />
          ))}
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

function JournalTableBodyItemComponent({ item }) {
  return (
    <div role="tablecontent">
      <div className={styles["tableInput-container"]}>
        <label className={styles["tableInput"]}>
          <input
            type="checkbox"
            name=""
            className={styles["checkboxInput"]}
            autoComplete="off"
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
            <div className={styles["row-actions-segment"]}>
              <div
                className={[
                  styles["name-actions-text"],
                  styles["row-actions-text"],
                  styles["highlight-column"],
                ].join(" ")}
              >
                {item.itemTitle}
              </div>
              <div
                className={[
                  styles["row-actions-render"],
                  styles["hidden"],
                ].join(" ")}
              >
                <div className={styles["row-actions-render-icon"]}>
                  <SvgMarkup
                    classList="row-icon"
                    fragId="arrow-open"
                    styles={styles}
                  />
                </div>
                <div className={styles["row-actions-render-text"]}>OPEN</div>
                <div className={styles["row-actions-tooltip"]}>
                  <div className={styles["tooltip-text"]}>
                    Open in side peek
                  </div>
                </div>
              </div>
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
              >
                {dateTimeFormat(item.created ?? item.id)}
              </div>
              <div
                className={[
                  styles["row-actions-render"],
                  styles["hidden"],
                ].join(" ")}
              >
                <div className={styles["row-actions-render-icon"]}>
                  <SvgMarkup
                    classList="row-icon"
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
            </div>
          </span>
          <span
            role="cell"
            className={[styles["table-item"], styles["table-item-tags"]].join(
              " ",
            )}
          >
            <div
              className={[
                styles["tags-actions-text"],
                styles["row-actions-text"],
              ].join(" ")}
            >
              <JournalTableBodyItemTagItem tags={item?.itemTags} />
            </div>
          </span>
        </div>
      </div>
    </div>
  );
}

function JournalTableBodyItemTagItem({ journal, tags }) {
  const tagsExist = tags?.length > 0;
  const journalTags = journal?.tags;
  const journalTagColors = journal?.tagColors;
  return (
    <>
      {tagsExist &&
        tags.map((tag, i) => {
          const tagProperty = tags.find((modelTag) => modelTag.id === tag); //tag is an id
          if (!tagProperty || tagProperty === -1) {
            tags.splice(i, 1);
          }
          {
            tagProperty ||
              (tagProperty > 0 && (
                <div
                  className={[
                    styles["tag-tag"],
                    styles[tagProperty.color],
                  ].join(" ")}
                >
                  {tagProperty.text}
                </div>
              ));
          }
        })}
    </>
  );
}

export default Journal;
