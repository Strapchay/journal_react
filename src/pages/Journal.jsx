import { useEffect } from "react";
import SvgMarkup from "../SvgMarkup";
import styles from "./Journal.module.css";
import { useGetJournals } from "../features/journals/useGetJournals";
import { useGetJournalTables } from "../features/journals/useGetJournalTables";
import {
  dateTimeFormat,
  formatJournalHeadingName,
  swapItemIndexInPlace,
  tableRowActivator,
  valueEclipser,
} from "../utils/helpers";
import {
  SIDEBAR_JOURNAL_TITLE_LENGTH,
  TABLE_HEAD_LIMIT,
  TABLE_ROW_FILTER_PLACEHOLDER,
  TABLE_ROW_PLACEHOLDER,
} from "../utils/constants";
import { useRef } from "react";

function Journal() {
  const { journals, isLoading: journalsLoading } = useGetJournals();
  const { journalTables, isLoading: journalTablesLoading } =
    useGetJournalTables();
  // const tableBodyRef = useRef(null);

  useEffect(() => {
    document.body.classList.add("journal-template");

    return () => {
      document.body.classList.remove("journal-template");
    };
  }, []);

  return (
    <main>
      <div className={styles["container"]}>
        <JournalSidebar />
        <div className={styles["content-container"]}>
          <div className={styles["row"]}>
            <JournalInfoHeaderComponent journalName="sdfdsfsdf" />
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
                          <JournalTableHeadComponent
                            journals={journals}
                            currentTableId={2}
                          />
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
                          <JournalTableBodyComponent
                            body={true}
                            placeholder={true}
                          />
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
  const username = "Strapchay";
  return (
    <div className={styles["nav-options-heading"]}>
      <div className={styles["options-heading-icon"]}>{username[0]}</div>
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

function JournalSidebarJournalMarkup(journalName) {
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
            {journalName.length > 0
              ? valueEclipser(journalName, SIDEBAR_JOURNAL_TITLE_LENGTH)
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

function JournalInfoHeaderComponent({ journalName }) {
  return (
    <div className={styles["container-header"]}>
      <div className={styles["nav-options-journal-icon"]}>
        {/* <SvgMarkup classList="journal-icon icon" fragId="journal-icon" /> */}
      </div>

      <div className={styles["nav-options-text"]}>
        {journalName.length > 0 ? journalName : "Untitled"}
      </div>
    </div>
  );
}

function JournalInfoContentComponent({ journal }) {
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
        >
          {journal?.name?.trim()}
        </h2>
      </div>
      <div className={styles["main-content-description"]}>
        <div
          className={styles["content-description-input"]}
          contentEditable={true}
        >
          {journal?.description}
        </div>
      </div>
    </div>
  );
}

function JournalTableRowComponent({ journalItems }) {
  const currentTableId = 2;
  return (
    <>
      {journalItems?.map((journal, i) => {
        const [journalName, journalId] = journal;
        const activeTable = tableRowActivator(currentTableId, journalId, i);

        {
          i < 4 && (
            <div
              className={[
                styles["table-row"],
                styles["table-journal"],
                styles[activeTable],
              ].join(" ")}
              data-name={journalName}
              data-id={journalId}
            >
              <div className={styles["table-row-icon"]}>
                <SvgMarkup
                  classList="table-icon"
                  fragId="list-icon"
                  styles={styles}
                />
                $
              </div>
              <div className={styles["table-row-text"]}>{journalName}</div>$
              <SvgMarkup
                classList="table-icon table-head-selector"
                fragId="arrow-down"
                styles={styles}
              />
            </div>
          );
        }
      })}
    </>
  );
}

function JournalTableHeadComponent({ journals, currentTableId }) {
  const switchTableAdd = journals?.length >= 5;
  const journalItems = swapItemIndexInPlace(journals, currentTableId);

  return (
    <>
      {!switchTableAdd && (
        <div className={styles["main-table-heading"]}>
          <JournalTableRowComponent journalItems={journalItems} />
          <div
            className={[styles["table-column-adder"], styles["table-row"]].join(
              " ",
            )}
          >
            <SvgMarkup classList="table-icon" fragId="plus" styles={styles} />
          </div>
        </div>
      )}
      {switchTableAdd && (
        <div className={styles["main-table-heading"]}>
          <JournalTableRowComponent journalItems={journalItems} />
          <div
            className={[
              styles["table-column-options"],
              styles["table-row"],
            ].join(" ")}
          >
            <div className={styles["table-row-text"]}>
              {journals.length - TABLE_HEAD_LIMIT} more...
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
            classList="table-icon"
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
          <SvgMarkup classList="table-icon" fragId="ellipsis" styles={styles} />
        </div>
      </div>
    </div>
  );
}

function JournalTableBodyComponent({ body, placeholder }) {
  //TODO: use ref to hold tablebody element
  return (
    <>
      <div role="tablebody">
        <JournalTableBodyPlaceholder placeholder={placeholder} />
      </div>
      {body && (
        <div role="tableadd">
          <div role="rowgroup" className={styles["rowfill"]}>
            <div role="row" className={styles["row-adder"]}>
              <div className={styles["row-adder-content"]}>
                <div className={styles["row-adder-icon"]}>
                  <SvgMarkup
                    classList="row-icon"
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

function JournalTableBodyPlaceholder({ placeholder }) {
  return (
    <div role="rowgroup" className={styles["rowfill"]}>
      <div role="row">
        <div
          className={
            styles[placeholder ? "row-adder-filter" : "row-adder-content"]
          }
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
            className="checkboxInput"
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
              <JournalTableBodyItemTagItem tags={item.itemTags} />
            </div>
          </span>
        </div>
      </div>
    </div>
  );
}

function JournalTableBodyItemTagItem({ journal, tags }) {
  const tagsExist = tags.length > 0;
  const journalTags = journal.tags;
  const journalTagColors = journal.tagColors;
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
