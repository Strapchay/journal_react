import { useContext } from "react";
import styles from "./pages/Journal.module.css";
import SvgMarkup from "./SvgMarkup";
import {
  dateTimeFormat,
  formatAPIRequestUpdateTableItemPayload,
  formatAPITableItems,
  formatInputTypeCamelCase,
  formatTagRenderedText,
  getItemsOrdering,
  moveCursorToTextEnd,
  setCreatePayloadValue,
  setInputUpdateTextContent,
} from "./utils/helpers";
import { AuthContext } from "./ProtectedRoute";
import ComponentOverlay from "./ComponentOverlay";
import { useRef } from "react";

import { useState } from "react";
import { useUpdateTableItem } from "./features/journals/useUpdateTableItem";
import {
  CUSTOMIZE_POSITION_DEFAULTS,
  INPUT_SELECTION_REF_DEFAULTS,
  SIDE_PEEK_DEFAULTS,
  THROTTLE_TIMER,
} from "./utils/constants";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useScreenBreakpoints } from "./hooks/useScreenBreakpoints";
import { JournalTableBodyItemTagOptionOverlayComponent } from "./pages/components/JournalTableBodyComponent";

function ContainerSidePeek({ itemId }) {
  const { journalState, setSidePeek, sidePeek } = useContext(AuthContext);
  const currentTable = journalState.tables.find(
    (table) => table.id === journalState.currentTable,
  );
  const [currentItemId, setCurrentItemId] = useState(itemId);
  const tableItem = currentTable.tableItems.find(
    (item) => item.id === currentItemId,
  );
  const tableItemIndex = currentTable.tableItems.findIndex(
    (item) => item.id === currentItemId,
  );
  const shouldPrev = tableItemIndex > 0;
  const shouldNext = tableItemIndex < currentTable.tableItems.length - 1;

  useEffect(() => {
    if (sidePeek.itemId !== currentItemId)
      setCurrentItemId((v) => sidePeek.itemId);
  }, [sidePeek, currentItemId]);

  function handleNavigateItems(type = "") {
    if (type === "prev" && shouldPrev) {
      const prevTableItemId = currentTable.tableItems[tableItemIndex - 1].id;
      setCurrentItemId((_) => prevTableItemId);
      setSidePeek((v) => ({ ...v, itemId: prevTableItemId }));
    }
    if (type === "next" && shouldNext) {
      const nextTableItemId = currentTable.tableItems[tableItemIndex + 1].id;
      setCurrentItemId((_) => nextTableItemId);
      setSidePeek((v) => ({ ...v, itemId: nextTableItemId }));
    }
  }

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
              onClick={() => setSidePeek((_) => SIDE_PEEK_DEFAULTS)}
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
              onClick={() => handleNavigateItems("next")}
            >
              <SvgMarkup
                classList={`icon-md ${!shouldNext ? "nav-icon-inactive" : "nav-icon-active"}`}
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
              onClick={() => handleNavigateItems("prev")}
            >
              <SvgMarkup
                classList={`icon-md ${!shouldPrev ? "nav-icon-inactive" : "nav-icon-active"}`}
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
  const { handleCopyToClipboardEvent, dispatch } = useContext(AuthContext);
  const { mobileBreakpointMatches } = useScreenBreakpoints();
  const [title, setTitle] = useState(tableItem?.itemTitle);
  const throttleTimerRef = useRef(null);
  const textToCopyRef = useRef(null);
  const tagOptionRef = useRef(null);
  const { updateTableItem } = useUpdateTableItem();
  const tableItemTags = "Empty";
  const tagExists = tableItem?.itemTags?.length > 0;

  useEffect(() => {
    setTitle((_) => tableItem?.itemTitle);
  }, [tableItem]);

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
                  customizePosition={
                    mobileBreakpointMatches
                      ? { ...CUSTOMIZE_POSITION_DEFAULTS, adjustLeft: -100 }
                      : { ...CUSTOMIZE_POSITION_DEFAULTS }
                  }
                >
                  <JournalTableBodyItemTagOptionOverlayComponent
                    itemIds={[tableItem?.id]}
                    itemTags={tableItem?.itemTags}
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
                    styles[tableItem?.id ? "active" : ""],
                  ].join(" ")}
                  ref={textToCopyRef}
                >
                  {dateTimeFormat(tableItem?.created ?? "Empty")}
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
  const inputSelectionExistRef = useRef(INPUT_SELECTION_REF_DEFAULTS);

  useEffect(() => {
    const { active, index, inputType, next } = inputSelectionExistRef.current;
    if (active) {
      const indexValue = next ? index + 1 : index - 1;
      const inputElItem = tableItem[inputType][indexValue];
      const inputTypeEl = document
        .querySelector(
          `.${styles["slide-list"]} li[data-id='${inputElItem.id}'
            `,
        )
        .querySelector(`.${styles["slide-input"]}`);
      inputTypeEl.focus();
      moveCursorToTextEnd(inputTypeEl);
      inputSelectionExistRef.current = INPUT_SELECTION_REF_DEFAULTS;
    }
  }, [tableItem]);

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
            {tableItem?.intentions?.map((item, i) => (
              <InputContent
                key={item.id}
                checkbox={false}
                type={item}
                tableItem={tableItem}
                typeIndex={i}
                selectionRef={inputSelectionExistRef}
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
            {tableItem?.happenings?.map((item, i) => (
              <InputContent
                key={item.id}
                checkbox={false}
                type={item}
                typeIndex={i}
                selectionRef={inputSelectionExistRef}
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
            {tableItem?.gratefulFor?.map((item, i) => (
              <InputContent
                key={item.id}
                checkbox={false}
                type={item}
                typeIndex={i}
                selectionRef={inputSelectionExistRef}
                tableItem={tableItem}
                inputType="grateful-for"
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
            {tableItem?.actionItems?.map((item, i) => (
              <InputContent
                key={item.id}
                checkbox={true}
                type={item}
                typeIndex={i}
                selectionRef={inputSelectionExistRef}
                tableItem={tableItem}
                inputType="action-items"
              />
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function InputContent({
  checkbox,
  type,
  tableItem,
  typeIndex, //to get the index of the type to allow selecting the next input if necessary
  inputType,
  selectionRef,
}) {
  const { dispatch, deleteTableItems } = useContext(AuthContext);
  const throttleTimerRef = useRef(null);
  const inputRef = useRef(null);
  const checkboxRef = useRef(null);
  const inputModelKey = formatInputTypeCamelCase(inputType);
  const { updateTableItem } = useUpdateTableItem();

  useEffect(() => {
    if (!inputRef.current.textContent)
      inputRef.current.textContent = type?.text?.trim() ?? "";
  }, [type]);

  function handleCheckboxChange(e) {
    const payload = {
      itemId: tableItem.id,
      modelProperty: {
        property: {
          updateActionItem: {
            checked: checkboxRef.current.checked,
            propertyId: type.id,
            value: inputRef.current.textContent,
            key: inputModelKey,
          },
        },
      },
    };

    updateTableItem(
      { payload, type: inputModelKey },
      {
        onSuccess: (data) => {
          const res = formatAPITableItems([data]);
          dispatch({ type: "updateTableItem", payload: res });
        },
      },
    );
  }

  function handleItemDelete() {
    clearThrottle();
    const payload = {
      itemId: tableItem.id,
      modelProperty: {
        property: {
          delete: {
            propertyId: type.id,
            key: inputModelKey,
          },
        },
      },
    };

    deleteTableItems(
      {
        payload: formatAPIRequestUpdateTableItemPayload(payload, inputModelKey),
        type: inputType,
        typeId: type.id,
      },
      {
        onSuccess: (_) => {
          selectionRef.current = {
            active: true,
            index: typeIndex,
            inputType: inputModelKey,
            next: false,
          };
          dispatch({
            type: "deleteTableItemType",
            payload: {
              id: tableItem.id,
              type: { type: inputModelKey, id: type.id },
            },
          });
        },
      },
    );
  }

  function handleInputContentEvent(e) {
    if (e.key === "Enter") return handleInputContentUpdateAndCreate(e);
    if (e.key === "Backspace" && !inputRef.current?.textContent?.length) {
      if (tableItem[inputModelKey].length > 1) return handleItemDelete();
      else {
        toast.error("You can't delete the only item relating to an activity");
        clearThrottle();
        return;
      }
    } else return handleInputContentUpdate(e);
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
      ?.startContainer?.data;
    const currentInputTextContent = inputRef.current.textContent;
    const inputSelectionExists = inputSelection?.length > 0;
    const nextItemExists = tableItem[inputModelKey][typeIndex + 1] ?? null;
    const createRelativeProperty =
      inputSelectionExists || nextItemExists ? type.id : null;

    setInputUpdateTextContent(
      inputSelectionExists,
      selectionAnchorOffset,
      inputRef,
    );

    const { createItemOrdering, itemsOrdering } = getItemsOrdering(
      tableItem,
      inputModelKey,
      createRelativeProperty,
    );
    const payload = {
      itemId: tableItem.id,
      modelProperty: {
        property: {
          create: {
            value: setCreatePayloadValue(
              inputSelectionExists,
              selectionAnchorOffset,
              currentInputTextContent,
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

    updateTableItem(
      { payload, type: inputModelKey },
      {
        onSuccess: (data) => {
          const res = formatAPITableItems([data]);
          selectionRef.current = {
            active: true,
            index: typeIndex,
            inputType: inputModelKey,
            next: true,
          };
          dispatch({ type: "updateTableItem", payload: res });
        },
      },
    );
  }

  function clearThrottle() {
    if (throttleTimerRef.current) {
      clearInterval(throttleTimerRef.current);
      throttleTimerRef.current = null;
    }
  }

  function handleInputContentUpdate(e) {
    clearThrottle();
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
        { payload, type: inputModelKey },
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
        onKeyDown={handleInputContentEvent}
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
