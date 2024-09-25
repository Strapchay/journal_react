import { useContext } from "react";
import styles from "./pages/Journal.module.css";
import SvgMarkup from "./SvgMarkup";
import {
  dateTimeFormat,
  formatAPITableItems,
  formatInputTypeCamelCase,
  formatTagRenderedText,
} from "./utils/helpers";
import { AuthContext } from "./ProtectedRoute";
import ComponentOverlay from "./ComponentOverlay";
import { useRef } from "react";
import { JournalTableBodyItemTagOptionOverlayComponent } from "./pages/Journal";
import { useState } from "react";
import { useUpdateTableItem } from "./features/journals/useUpdateTableItem";
import { THROTTLE_TIMER } from "./utils/constants";
import { useEffect } from "react";
import { updateTableItem } from "./services/apiJournals";

function ContainerSidePeek({ itemId }) {
  const { journalState } = useContext(AuthContext);
  const currentTable = journalState.tables.find(
    (table) => table.id === journalState.currentTable,
  );
  const tableItem = currentTable.tableItems.find((item) => item.id === itemId);
  const position = 0;
  return (
    <div className={styles["container-slide-template"]}>
      <div className={styles["container-slide"]}>
        <div className={styles["slide-nav"]}>
          <div className={styles["slide-nav-actions"]}>
            <div
              className={[
                styles["nav-nav-icon"],
                styles["slide-nav-close"],
                styles["hover"],
              ].join(" ")}
            >
              <SvgMarkup
                classList="icon-md nav-icon nav-icon-active"
                fragId="angles-right"
                styles={styles}
              />
            </div>

            <div
              className={[
                styles["nav-nav-icon"],
                styles["slide-nav-next"],
                styles["hover"],
              ].join(" ")}
            >
              <SvgMarkup
                classList={`icon-md ${position === -1 || position === 0 || position === "only" ? "nav-icon-inactive" : "nav-icon-active"}`}
                fragId="arrow-down"
                styles={styles}
              />
            </div>
            <div
              className={[
                styles["nav-nav-icon"],
                styles["slide-nav-prev"],
                styles["hover"],
              ].join(" ")}
            >
              <SvgMarkup
                classList={`icon-md ${position === 1 || position === "only" ? "nav-icon-inactive" : "nav-icon-active"}`}
                fragId="arrow-up"
                styles={styles}
              />
            </div>
          </div>
        </div>

        <div className={styles["slide-content"]}>
          <SlideContent tableItem={tableItem} />
        </div>
      </div>
    </div>
  );
}

function SlideContent({ tableItem }) {
  const tableItemTags = "Empty";
  const tagExists = tableItem.itemTags.length > 0;
  const tagOptionRef = useRef(null);
  const throttleTimerRef = useRef(null);
  const { handleCopyToClipboardEvent, dispatch } = useContext(AuthContext);
  const textToCopyRef = useRef(null);
  const [title, setTitle] = useState(tableItem.itemTitle);
  const { updateTableItem } = useUpdateTableItem();

  function handleTitleUpdate(e) {
    setTitle((_) => e.target.value);
    if (throttleTimerRef.current) {
      clearInterval(throttleTimerRef.current);
      throttleTimerRef.current = null;
    }

    throttleTimerRef.current = setTimeout(() => {
      updateTableItem(
        {
          payload: {
            itemId: tableItem.id,
            title,
          },
          type: "title",
        },
        {
          onSuccess: (data) => {
            const res = formatAPITableItems([data]);
            dispatch({ type: "updateTableItem", payload: res });
          },
        },
      );
    }, THROTTLE_TIMER);
  }

  return (
    <>
      <div className={styles["slide-title-box"]}>
        <h1 className={styles["slide-title"]}>
          <input
            type="text"
            placeholder="Untitled"
            className={styles["slide-title-input"]}
            value={title ?? ""}
            onChange={handleTitleUpdate}
          />
        </h1>
      </div>
      <div className={styles["slide-properties-box"]}>
        <div className={styles["slide-properties"]}>
          <div className={styles["slide-property-box"]}>
            <div
              className={[styles["slide-property"], styles["slide-tag"]].join(
                " ",
              )}
            >
              <div
                className={[
                  styles["slide-property-content"],
                  styles["slide-tag-content"],
                  styles["hover"],
                ].join(" ")}
              >
                <div className={styles["slide-tag-icon"]}>
                  <SvgMarkup
                    classList={styles["slide-icon"]}
                    fragId="list-icon"
                    styles={styles}
                  />
                </div>
                <div className={styles["slide-tag-text--box"]}>
                  <div
                    className={[
                      styles["slide-property-text"],
                      styles["slide-tag-text"],
                    ].join(" ")}
                  >
                    Tags
                  </div>
                </div>
              </div>
              <ComponentOverlay>
                <ComponentOverlay.Open opens="tagOption">
                  <div className={styles["slide-tag-text--box"]}>
                    <div
                      className={[
                        styles["slide-property-text"],
                        styles["slide-tag-text"],
                        styles["hover"],
                        styles[tableItemTags !== "Empty" ? "active" : ""],
                      ].join(" ")}
                      ref={tagOptionRef}
                    >
                      {tagExists &&
                        tableItem.itemTags.map((tag) => (
                          <SlideTagsContent key={tag.id} tagId={tag.id} />
                        ))}
                    </div>
                  </div>
                </ComponentOverlay.Open>
                <ComponentOverlay.Window
                  name="tagOption"
                  objectToOverlay={tagOptionRef}
                >
                  <JournalTableBodyItemTagOptionOverlayComponent
                    itemIds={[tableItem?.id]}
                    itemTags={tableItem.itemTags}
                  />
                </ComponentOverlay.Window>
              </ComponentOverlay>
            </div>
          </div>
          <div className={styles["slide-property-box"]}>
            <div
              className={[
                styles["slide-property"],
                styles["slide-created"],
              ].join(" ")}
            >
              <div
                className={[
                  styles["slide-property-content"],
                  styles["slide-created-content"],
                  styles["hover"],
                ].join(" ")}
              >
                <div className={styles["slide-property-icon"]}>
                  <SvgMarkup
                    classList={styles["slide-icon"]}
                    fragId="clock"
                    styles={styles}
                  />
                </div>
                <div className={styles["slide-created-text--box"]}>
                  <div
                    className={[
                      styles["slide-property-text"],
                      styles["slide-created-text"],
                    ].join(" ")}
                  >
                    Created
                  </div>
                </div>
              </div>
              <div className={styles["slide-created-text--box"]}>
                <div
                  className={[
                    styles["slide-property-text"],
                    styles["slide-created-text"],
                    styles[tableItem.id ? "active" : ""],
                  ].join(" ")}
                  ref={textToCopyRef}
                >
                  {dateTimeFormat(tableItem.created ?? "Empty")}
                </div>
                <div className={styles["row-actions-render"]}>
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <SliceContentProperties tableItem={tableItem} />
    </>
  );
}

function SliceContentProperties({ tableItem }) {
  return (
    <div className={styles["container-slide-content"]}>
      <div className={styles["slide-intentions"]}>
        <h1 className={styles["slide-headings"]}>Intentions</h1>
        <div
          className={[
            styles["slide-intentions-options"],
            styles["slide-options"],
          ].join(" ")}
        >
          <ol
            className={[
              styles["slide-intentions-list"],
              styles["slide-list"],
            ].join(" ")}
          >
            {tableItem?.intentions?.map((item) => (
              <InputContent
                key={item.id}
                checkbox={false}
                type={item}
                tableItem={tableItem}
                inputType="intentions"
              />
            ))}
          </ol>
        </div>
      </div>
      <div className={styles["slide-happenings"]}>
        <h1 className={styles["slide-headings"]}>Happenings</h1>
        <div
          className={[
            styles["slide-happenings-options"],
            styles["slide-options"],
          ].join(" ")}
        >
          <ul
            className={[
              styles["slide-happenings-list"],
              styles["slide-list"],
            ].join(" ")}
          >
            {tableItem?.happenings?.map((item) => (
              <InputContent
                key={item.id}
                checkbox={false}
                type={item}
                tableItem={tableItem}
                inputType="happenings"
              />
            ))}
          </ul>
        </div>
      </div>

      <div className={styles["slide-grateful-for"]}>
        <h1 className={styles["slide-headings"]}>Grateful for</h1>
        <div
          className={[
            styles["slide-grateful-for-options"],
            styles["slide-options"],
          ].join(" ")}
        >
          <ol
            className={[
              styles["slide-grateful-for-list"],
              styles["slide-list"],
            ].join(" ")}
          >
            {tableItem?.gratefulFor?.map((item) => (
              <InputContent
                key={item.id}
                checkbox={false}
                type={item}
                tableItem={tableItem}
                inputType="gratefulFor"
              />
            ))}
          </ol>
        </div>
      </div>
      <div className={styles["slide-action-items"]}>
        <h1 className={styles["slide-headings"]}>Action items</h1>
        <div
          className={[
            styles["slide-action-items-options"],
            styles["slide-options"],
          ].join(" ")}
        >
          <ol
            className={[
              styles["slide-action-items-list"],
              styles["slide-list"],
            ].join(" ")}
          >
            {tableItem?.actionItems?.map((item) => (
              <InputContent
                key={item.id}
                checkbox={true}
                type={item}
                tableItem={tableItem}
                inputType="actionItems"
              />
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function InputContent({ checkbox, type, tableItem, inputType }) {
  const { dispatch } = useContext(AuthContext);
  const throttleTimerRef = useRef(null);
  const inputRef = useRef(null);
  const checkboxRef = useRef(null);
  const inputModelKey = formatInputTypeCamelCase(inputType);
  const { updateTableItem } = useUpdateTableItem();

  useEffect(() => {
    if (!inputRef.current.textContent)
      inputRef.current.textContent = type?.text?.trim() ?? "";
  }, [type]);

  function handleCheckboxChange(e) {}

  function handleInputContentEvent(e) {
    if (e.key === "Enter") handleInputContentUpdateAndCreate(e);
    else handleInputContentUpdate(e);
  }

  function setInputUpdateTextContent(
    inputSelection,
    inputSelectionExists,
    selectionAnchorOffset,
  ) {
    if (inputSelectionExists && selectionAnchorOffset === 0)
      inputRef.current.textContent = inputRef.current.textContent
        .split(inputSelection)[0]
        .trim();
  }

  function getItemsOrdering(inputType, createRelativeProperty) {
    let incrementOrderingIndex = false;
    let createItemOrdering = null;
    const itemsOrdering = tableItem[inputType].map((item, i) => {
      if (createRelativeProperty && item.id === createRelativeProperty) {
        incrementOrderingIndex = true;
        createItemOrdering = i + 2;
        return { id: item.id, ordering: i + 1 };
      }
      return {
        id: item.id,
        ordering: incrementOrderingIndex ? i + 2 : i + 1,
      };
    });

    return { createItemOrdering: createItemOrdering, itemsOrdering };
  }

  function setCreatePayloadValue(
    inputSelection,
    inputSelectionExists,
    selectionAnchorOffset,
  ) {
    if (
      (inputSelectionExists && selectionAnchorOffset > 0) ||
      !inputSelectionExists
    )
      return "";
    if (inputSelectionExists && selectionAnchorOffset === 0)
      return inputSelection.trim();
  }

  function handleInputContentUpdateAndCreate(e) {
    const checkedPayload = {
      checkbox,
      checked: checkboxRef.current?.checked ?? false,
    };

    if (throttleTimerRef.current) {
      clearInterval(throttleTimerRef.current);
      throttleTimerRef.current = null;
    }

    const selectionAnchorOffset = document.getSelection().anchorOffset;
    const inputSelection = document.getSelection().getRangeAt(0)
      .startContainer?.data;
    const inputSelectionExists = inputSelection?.length > 0;
    const createRelativeProperty = inputSelectionExists ? type.id : null;

    setInputUpdateTextContent(
      inputSelection,
      inputSelectionExists,
      selectionAnchorOffset,
    );

    const { createItemOrdering, itemsOrdering } = getItemsOrdering(
      inputType,
      createRelativeProperty,
    );

    const payload = {
      itemId: tableItem.id,
      modelProperty: {
        property: {
          create: {
            value: setCreatePayloadValue(
              inputSelection,
              inputSelectionExists,
              selectionAnchorOffset,
            ),
            relativeProperty: createRelativeProperty,
            ordering: createItemOrdering,
          },
          update: {
            value: inputRef.current.textContent,
            key: inputModelKey,
            propertyId: type.id,
          },
          orderingList: itemsOrdering,
          key: inputModelKey,
          updateAndAddProperty: true,
        },
      },
    };

    if (checkbox)
      payload.modelProperty = { ...payload.modelProperty, checkedPayload };

    throttleTimerRef.current = setTimeout(() => {
      updateTableItem(
        { payload, type: inputType },
        {
          onSuccess: (data) => {
            const res = formatAPITableItems([data]);
            dispatch({ type: "updateTableItem", payload: res });
          },
        },
      );
    }, THROTTLE_TIMER);
  }

  function handleInputContentUpdate(e) {
    if (throttleTimerRef.current) {
      clearInterval(throttleTimerRef.current);
      throttleTimerRef.current = null;
    }

    const checkedPayload = {
      checkbox,
      checked: checkboxRef.current?.checked ?? false,
    };

    const payload = {
      itemId: tableItem.id,
      modelProperty: {
        property: {
          update: {
            value: inputRef.current.textContent,
            key: inputModelKey,
            propertyId: type.id,
          },
        },
        updateProperty: true,
      },
    };

    if (checkbox)
      payload.modelProperty = { ...payload.modelProperty, checkedPayload };

    throttleTimerRef.current = setTimeout(() => {
      updateTableItem(
        { payload, type: inputType },
        {
          onSuccess: (data) => {
            const res = formatAPITableItems([data]);
            dispatch({ type: "updateTableItem", payload: res });
          },
        },
      );
    }, THROTTLE_TIMER);
  }

  return (
    <li data-id={type?.id ?? ""}>
      {checkbox && (
        <div className={styles["slide-action-item"]}>
          <input
            type="checkbox"
            className={styles["slide-action-items-checkbox"]}
            ref={checkboxRef}
            checked={type?.checked ? "checked" : ""}
            onChange={handleCheckboxChange}
          />
        </div>
      )}
      <div
        className={[
          styles[`slide-${type}-input`],
          styles["slide-input"],
          styles[type?.checked && "add-strikethrough"],
        ].join(" ")}
        placeholder="List"
        suppressContentEditableWarning={true}
        contentEditable={true}
        ref={inputRef}
        onKeyUp={handleInputContentEvent}
      >
        {/*type?.text ?? ""*/}
      </div>
    </li>
  );
}

function SlideTagsContent({ tagId }) {
  const { journalState } = useContext(AuthContext);
  const tag = journalState.tags.find((tag) => tag.id === tagId);

  return (
    <div
      className={[styles["row-tag-tag"], styles[tag.color]].join(" ")}
      data-id={tag.id}
    >
      {formatTagRenderedText(tag.text)}
    </div>
  );
}
// ${this._generateSlideContentProperties(tableItem)}

export default ContainerSidePeek;
