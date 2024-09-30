import { useContext } from "react";
import styles from "./pages/Journal.module.css";
import SvgMarkup from "./SvgMarkup";
import {
  capitalize,
  dateTimeFormat,
  formatTagRenderedText,
  moveCursorToTextEnd,
} from "./utils/helpers";
import { AuthContext } from "./ProtectedRoute";
import ComponentOverlay from "./ComponentOverlay";
import { useRef } from "react";
import {
  CUSTOMIZE_POSITION_DEFAULTS,
  INPUT_SELECTION_REF_DEFAULTS,
  SIDE_PEEK_DEFAULTS,
} from "./utils/constants";
import { useEffect } from "react";
import TagComponent from "./pages/components/TagComponent";
import { useSidePeekActions } from "./hooks/useSidePeekActions";
import { useSlideContentActions } from "./hooks/useSlideContentActions";
import { useSidePeekInputActions } from "./hooks/useSidePeekInputActions";

const SlideProperties = {
  intentions: {
    ordered: true,
    checkbox: false,
    style: "intentions",
    text: "intentions",
  },
  happenings: {
    ordered: false,
    checkbox: false,
    style: "happenings",
    text: "happenings",
  },
  gratefulFor: {
    ordered: true,
    checkbox: false,
    style: "grateful-for",
    text: "grateful for",
  },
  actionItems: {
    ordered: true,
    checkbox: true,
    style: "action-items",
    text: "action items",
  },
};

function ListType({ children, property }) {
  const orderedList = SlideProperties[property].ordered;

  if (orderedList)
    return (
      <ol
        className={[
          styles[`slide-${SlideProperties[property].style}-list`],
          styles["slide-list"],
        ].join(" ")}
      >
        {children}
      </ol>
    );

  return (
    <ul
      className={[
        styles[`slide-${SlideProperties[property].style}-list`],
        styles["slide-list"],
      ].join(" ")}
    >
      {children}
    </ul>
  );
}

function ContainerSidePeek({ itemId }) {
  const {
    setSidePeek,
    handleNavigateItems,
    shouldNext,
    shouldPrev,
    tableItem,
  } = useSidePeekActions({
    itemId,
  });

  return (
    <div className={styles["container-slide-template"]}>
      <div className={styles["container-slide"]}>
        <div className={styles["slide-nav"]}>
          <div className={styles["slide-nav-actions"]}>
            <SidePeekCloseComponent setSidePeek={setSidePeek} />
            <SidePeekNextComponent
              shouldNext={shouldNext}
              handleNavigateItems={handleNavigateItems}
            />
            <SidePeekPrevComponent
              shouldPrev={shouldPrev}
              handleNavigateItems={handleNavigateItems}
            />
          </div>
        </div>

        <SlideContent tableItem={tableItem} />
      </div>
    </div>
  );
}

function SidePeekCloseComponent({ setSidePeek }) {
  return (
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
  );
}

function SidePeekNextComponent({ shouldNext, handleNavigateItems }) {
  return (
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
  );
}

function SidePeekPrevComponent({ shouldPrev, handleNavigateItems }) {
  return (
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
  );
}

function SlideContent({ tableItem }) {
  const {
    title,
    handleTitleUpdate,
    tableItemTags,
    tagOptionRef,
    tagExists,
    mobileBreakpointMatches,
    textToCopyRef,
    handleCopyToClipboardEvent,
  } = useSlideContentActions({ tableItem });
  const customizePosition = mobileBreakpointMatches
    ? { ...CUSTOMIZE_POSITION_DEFAULTS, adjustLeft: -100 }
    : { ...CUSTOMIZE_POSITION_DEFAULTS };

  return (
    <div className={styles["slide-content"]}>
      <NameComponent title={title} handleTitleUpdate={handleTitleUpdate} />
      <div className={styles["slide-properties-box"]}>
        <div className={styles["slide-properties"]}>
          <div className={styles["slide-property-box"]}>
            <div
              className={[styles["slide-property"], styles["slide-tag"]].join(
                " ",
              )}
            >
              <TagLabelComponent />
              <ComponentOverlay>
                <ComponentOverlay.Open opens="tagOption">
                  <TagsListComponent
                    tableItemTags={tableItemTags}
                    tableItem={tableItem}
                    tagOptionRef={tagOptionRef}
                    tagExists={tagExists}
                  />
                </ComponentOverlay.Open>
                <ComponentOverlay.Window
                  name="tagOption"
                  objectToOverlay={tagOptionRef}
                  customizePosition={customizePosition}
                >
                  <TagComponent
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
              <CreatedLabelComponent />
              <DateCreatedComponent
                tableItem={tableItem}
                textToCopyRef={textToCopyRef}
                handleCopyToClipboardEvent={handleCopyToClipboardEvent}
              />
            </div>
          </div>
        </div>
      </div>
      <SliceContentProperties tableItem={tableItem} />
    </div>
  );
}

function NameComponent({ title, handleTitleUpdate }) {
  return (
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
  );
}

function TagLabelComponent() {
  return (
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
  );
}

function TagsListComponent({
  tableItemTags,
  tableItem,
  tagOptionRef,
  tagExists,
  onClick,
}) {
  return (
    <div className={styles["slide-tag-text--box"]} onClick={onClick}>
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
  );
}

function CreatedLabelComponent() {
  return (
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
  );
}

function DateCreatedComponent({
  tableItem,
  textToCopyRef,
  handleCopyToClipboardEvent,
}) {
  return (
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
          <div className={styles["tooltip-text"]}>Copy to Clipboard</div>
        </div>
      </div>
    </div>
  );
}

function SliceContentProperties({ tableItem }) {
  const inputSelectionExistRef = useRef(INPUT_SELECTION_REF_DEFAULTS);
  const properties = Object.keys(SlideProperties);

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
      {properties?.map((property) => (
        <div
          className={styles[`slide-${SlideProperties[property].style}`]}
          key={property}
        >
          <h1 className={styles["slide-headings"]}>
            {capitalize(SlideProperties[property].text)}
          </h1>
          <div
            className={[
              styles[`slide-${SlideProperties[property].style}-options`],
              styles["slide-options"],
            ].join(" ")}
          >
            <ListType property={property}>
              {tableItem?.[property]?.map((item, i) => (
                <InputContent
                  key={item.id}
                  checkbox={SlideProperties[property].checkbox}
                  type={item}
                  tableItem={tableItem}
                  typeIndex={i}
                  selectionRef={inputSelectionExistRef}
                  inputType={SlideProperties[property].style}
                />
              ))}
            </ListType>
          </div>
        </div>
      ))}
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
  const {
    checkboxRef,
    handleCheckboxChange,
    inputRef,
    handleInputContentEvent,
  } = useSidePeekInputActions({
    inputType,
    type,
    tableItem,
    checkbox,
    typeIndex,
    selectionRef,
  });

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
      ></div>
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

export default ContainerSidePeek;
