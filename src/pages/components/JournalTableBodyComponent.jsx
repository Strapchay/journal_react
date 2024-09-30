import { useContext } from "react";
import styles from "../Journal.module.css";
import { AuthContext } from "../../ProtectedRoute";
import {
  dateTimeFormat,
  formatAPIRequestTagPayload,
  formatAPIResp,
  formatAPITableItems,
  formatTagRenderedText,
  moveCursorToTextEnd,
} from "../../utils/helpers";
import {
  CUSTOMIZE_POSITION_DEFAULTS,
  NOTIFICATION_DELETE_MSG,
  TABLE_ROW_FILTER_PLACEHOLDER,
  TABLE_ROW_PLACEHOLDER,
} from "../../utils/constants";
import SvgMarkup from "../../SvgMarkup";
import ComponentOverlay from "../../ComponentOverlay";
import { useRef } from "react";
import { useState } from "react";
import { useUpdateTableItem } from "../../features/journals/useUpdateTableItem";
import { useEffect } from "react";
import { useScreenBreakpoints } from "../../hooks/useScreenBreakpoints";
import { OverlayNotificationComponent } from "../Journal";
import { useTagOptionActions } from "../../hooks/useTagOptionActions";
import { useTagOptionEditActions } from "../../hooks/useTagOptionEditActions";

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

function JournalTableBodyItemHoverComponent({ item }) {
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

export function JournalTableBodyItemTagOptionOverlayComponent({
  itemIds,
  itemTags = null, //NOTE:if the itemIds is > 1, no itemTags is supplied
  disableInput = false,
  onTagsFilter = null,
  onFilterComplete = null,
}) {
  const {
    handleCreateTag,
    handleSetOrCreateTagValue,
    onRemoveTag,
    onSelectTag,
    isMultipleItemIds,
    tagsExist,
    selectedTagsToRender,
    searchTagRef,
    searchTagValue,
    randomColorRef,
    renderedTags,
  } = useTagOptionActions({
    itemIds,
    itemTags,
    disableInput,
    onFilterComplete,
    onTagsFilter,
  });

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

export function JournalTableBodyItemSelectedTagsRenderComponent({
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

function JournalTableBodyItemTagsOptionsAvailableComponent({
  disableOptionsNudge = false,
  searchTags = "",
  onSelectTag,
  onCreateTag,
  randomColorRef,
  renderedTags,
}) {
  const { journalState } = useContext(AuthContext);
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

function JournalTableBodyItemTagsOptionsOptionIcon({ tag }) {
  const tagOptionRef = useRef(null);
  const { tabletBreakpointMatches } = useScreenBreakpoints();

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
          customizePosition={
            tabletBreakpointMatches
              ? { ...CUSTOMIZE_POSITION_DEFAULTS, adjustLeft: -200 }
              : { ...CUSTOMIZE_POSITION_DEFAULTS }
          }
        >
          <JournalTableBodyItemTagsOptionEditComponent tag={tag} key={tag.id} />
        </ComponentOverlay.Window>
      </ComponentOverlay>
    </div>
  );
}

function JournalTableBodyItemTagsOptionEditComponent({
  tag,
  onClick,
  onSubmit,
}) {
  const { handleTagDelete, handleColorSelect, handleTagNameUpdate, tagsColor } =
    useTagOptionEditActions({ tag, onSubmit });
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
  );
}

export default JournalTableBodyComponent;
