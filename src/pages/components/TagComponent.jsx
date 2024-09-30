import styles from "../Journal.module.css";
import { useTagActions } from "../../hooks/useTagActions";
import SvgMarkup from "../../SvgMarkup";
import { formatTagRenderedText } from "../../utils/helpers";
import { useTagEditActions } from "../../hooks/useTagEditActions";
import ComponentOverlay from "../../ComponentOverlay";
import {
  CUSTOMIZE_POSITION_DEFAULTS,
  NOTIFICATION_DELETE_MSG,
} from "../../utils/constants";
import NotificationComponent from "./NotificationComponent";
import { useContext } from "react";
import { AuthContext } from "../../ProtectedRoute";
import { useRef } from "react";
import { useScreenBreakpoints } from "../../hooks/useScreenBreakpoints";

function TagComponent({
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
  } = useTagActions({
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
                      <SelectedTagsComponent
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
            <SelectTagComponent
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

export function SelectedTagsComponent({
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

function TagEditComponent({ tag, onClick, onSubmit }) {
  const { handleTagDelete, handleColorSelect, handleTagNameUpdate, tagsColor } =
    useTagEditActions({ tag, onSubmit });
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
                <NotificationComponent
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

function SelectTagComponent({
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
            <SelectedTagsComponent tagProperty={tag} />
          </div>
          {!disableOptionsNudge ? <SelectTagIconComponent tag={tag} /> : ""}
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

function SelectTagIconComponent({ tag }) {
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
          <TagEditComponent tag={tag} key={tag.id} />
        </ComponentOverlay.Window>
      </ComponentOverlay>
    </div>
  );
}

export default TagComponent;
