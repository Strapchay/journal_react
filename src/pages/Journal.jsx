import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../ProtectedRoute";
import SvgMarkup from "../SvgMarkup";
import { getSelectedItems } from "../utils/helpers";
import styles from "./Journal.module.css";
import ComponentOverlay, { OverlayContext } from "../ComponentOverlay";
import toast from "react-hot-toast";
import ContainerSidePeek from "../ContainerSidePeek";
import JournalSidebarComponent from "./components/JournalSidebarComponent";
import JournalMainComponent from "./components/JournalMainComponent";
import { JournalTableBodyItemTagOptionOverlayComponent } from "./components/JournalTableBodyComponent";

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
          styles[sidePeek.isActive ? "side-peek" : ""],
        ].join(" ")}
      >
        <JournalSidebarComponent />
        <JournalMainComponent />
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

export function PropertyRuleConditionalsComponent({ prepositions, onSubmit }) {
  const { currentTableFunc, dispatch } = useContext(AuthContext);

  function handlePrepositionSelect(e) {
    const tagsValue =
      e.target.textContent.toLowerCase() === "is empty"
        ? []
        : [...currentTableFunc.filter.tags];

    dispatch({
      type: "updateTableFunc",
      payload: {
        filter: {
          ...currentTableFunc.filter,
          conditional: e.target.textContent,
          tags: tagsValue,
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

export function JournalTableBodyCheckboxOptionComponent({
  selectedItemsLength,
}) {
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

export function OverlayNotificationComponent({
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
