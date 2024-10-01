import { useContext } from "react";
import styles from "../Journal.module.css";
import { AuthContext } from "../../ProtectedRoute";
import {
  dateTimeFormat,
  formatAPITableItems,
  moveCursorToTextEnd,
} from "../../utils/helpers";
import {
  TABLE_ROW_FILTER_PLACEHOLDER,
  TABLE_ROW_PLACEHOLDER,
} from "../../utils/constants";
import SvgMarkup from "../../SvgMarkup";
import ComponentOverlay from "../../ComponentOverlay";
import { useRef } from "react";
import { useState } from "react";
import { useUpdateTableItem } from "../../features/journals/useUpdateTableItem";
import { useEffect } from "react";
import TagComponent from "./TagComponent";

function BodyComponent({ placeholder = false }) {
  const {
    selectedTableItems,
    setSelectedTableItems,
    currentTableItems,
    handleAddBodyItem,
  } = useContext(AuthContext);

  function onSelectTableItem(tableItemId) {
    setSelectedTableItems((s) => ({ ...s, [tableItemId]: !s[tableItemId] }));
  }

  return (
    <>
      <div role="tablebody">
        {!currentTableItems?.length && (
          <Placeholder placeholder={placeholder} onClick={handleAddBodyItem} />
        )}
        {currentTableItems?.length
          ? currentTableItems.map((tableItem) => (
              <BodyItemComponent
                item={tableItem}
                key={tableItem?.id}
                tableItemsMap={selectedTableItems}
                onSelectTableItem={onSelectTableItem}
              />
            ))
          : ""}
      </div>
    </>
  );
}

function Placeholder({ placeholder, onClick }) {
  return (
    <div role="rowgroup" className={styles["rowfill"]}>
      <div role="row">
        <div
          className={
            styles[placeholder ? "row-adder-filter" : "row-adder-content"]
          }
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

function BodyItemComponent({ item, tableItemsMap, onSelectTableItem }) {
  const inputRef = useRef(null);
  const tagRef = useRef(null);
  const [hoverActive, setHoverActive] = useState(false);
  const textToCopyRef = useRef(null);
  const { createTableItem, journalState, dispatch } = useContext(AuthContext);
  const inputAutoClick =
    journalState.tableItemInputActive &&
    journalState.tableItemInputActive === item.id
      ? false
      : true;

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
      <CheckboxInputComponent
        tableItemsMap={tableItemsMap}
        item={item}
        onSelectTableItem={onSelectTableItem}
      />
      <div role="rowgroup">
        <div
          role="row"
          className={styles["row-actions-handler-container"]}
          data-id={item.id}
        >
          <NameTextComponent
            inputRef={inputRef}
            inputAutoClick={inputAutoClick}
            item={item}
            hoverActive={hoverActive}
          />
          <DateCreatedTextComponent
            textToCopyRef={textToCopyRef}
            item={item}
            hoverActive={hoverActive}
          />
          <TagTextComponent item={item} tagRef={tagRef} />
        </div>
        {hoverActive && (
          <HoverActionsComponent
            item={item}
            handleAddRelativeTableBodyItemEvent={
              handleAddRelativeTableBodyItemEvent
            }
          />
        )}
      </div>
    </div>
  );
}

function CheckboxInputComponent({ tableItemsMap, item, onSelectTableItem }) {
  return (
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
  );
}

function NameTextComponent({ inputRef, inputAutoClick, item, hoverActive }) {
  return (
    <span
      role="cell"
      className={[styles["table-item"], styles["table-item-name"]].join(" ")}
    >
      <div className={styles["row-actions-segment"]} ref={inputRef}>
        <ComponentOverlay>
          <ComponentOverlay.Open opens="nameInput" click={inputAutoClick}>
            <NameTextRenderComponent item={item} />
          </ComponentOverlay.Open>
          <ComponentOverlay.Window name="nameInput" objectToOverlay={inputRef}>
            <InputOverlayComponent item={item} />
          </ComponentOverlay.Window>
        </ComponentOverlay>
        {hoverActive && <HoverComponent item={item} />}
      </div>
    </span>
  );
}

function NameTextRenderComponent({ item, onClick }) {
  return (
    <div
      className={[
        styles["name-actions-text"],
        styles["row-actions-text"],
        styles["highlight-column"],
      ].join(" ")}
      onClick={onClick}
    >
      {item.itemTitle}
    </div>
  );
}

function DateCreatedTextComponent({ textToCopyRef, item, hoverActive }) {
  const { handleCopyToClipboardEvent } = useContext(AuthContext);
  return (
    <span
      role="cell"
      className={[styles["table-item"], styles["table-item-created"]].join(" ")}
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
              <div className={styles["tooltip-text"]}>Copy to Clipboard</div>
            </div>
          </div>
        )}
      </div>
    </span>
  );
}

function TagTextComponent({ item, tagRef }) {
  return (
    <span
      role="cell"
      className={[styles["table-item"], styles["table-item-tags"]].join(" ")}
      ref={tagRef}
    >
      <ComponentOverlay>
        <ComponentOverlay.Open opens="tagOption">
          <ListTagItems tags={item?.itemTags} />
        </ComponentOverlay.Open>
        <ComponentOverlay.Window name="tagOption" objectToOverlay={tagRef}>
          <TagComponent itemIds={[item?.id]} itemTags={item?.itemTags} />
        </ComponentOverlay.Window>
      </ComponentOverlay>
    </span>
  );
}

function InputOverlayComponent({ item, onSubmit }) {
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

function HoverComponent({ item }) {
  const { setSidePeek } = useContext(AuthContext);

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

function ListTagItems({ tags, onClick }) {
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

function HoverActionsComponent({ item, handleAddRelativeTableBodyItemEvent }) {
  return (
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
  );
}

export default BodyComponent;
