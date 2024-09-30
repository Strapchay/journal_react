import toast from "react-hot-toast";
import styles from "../Journal.module.css";
import { useRef } from "react";
import { useContext } from "react";
import { AuthContext } from "../../ProtectedRoute";
import ComponentOverlay from "../../ComponentOverlay";
import SvgMarkup from "../../SvgMarkup";
import TagComponent from "./TagComponent";
import { getSelectedItems } from "../../utils/helpers";

function CheckboxOptionComponent({ selectedItemsLength }) {
  const toastInst = toast;
  const toastRef = useRef(0);
  const checkboxTagOptionRef = useRef(null);
  const {
    unselectAllSelectedTableItems,
    deleteSelectedTableItems,
    duplicateSelectedTableItems,
    isDuplicatingTableItems,
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
        <ParentCheckboxComponent
          unselectAllSelectedTableItems={unselectAllSelectedTableItems}
          selectedItemsLength={selectedItemsLength}
        />
        <ComponentOverlay>
          <ComponentOverlay.Open opens="checkboxTags">
            <TagTextComponent checkboxTagOptionRef={checkboxTagOptionRef} />
          </ComponentOverlay.Open>
          <ComponentOverlay.Window
            name="checkboxTags"
            objectToOverlay={checkboxTagOptionRef}
          >
            <TagComponent itemIds={getSelectedItems(selectedTableItems)} />
          </ComponentOverlay.Window>
        </ComponentOverlay>
        <DeleteTextComponent
          deleteSelectedTableItems={deleteSelectedTableItems}
        />
        <DuplicateTextComponent
          duplicateSelectedTableItems={duplicateSelectedTableItems}
        />
      </div>
    </div>
  );
}

function ParentCheckboxComponent({
  unselectAllSelectedTableItems,
  selectedItemsLength,
}) {
  return (
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
  );
}

function TagTextComponent({ checkboxTagOptionRef, onClick }) {
  return (
    <div
      className={[
        styles["checkbox-item"],
        styles["checkbox-tags"],
        styles["hover"],
      ].join(" ")}
      ref={checkboxTagOptionRef}
      onClick={onClick}
    >
      <SvgMarkup
        classList="icon-md icon-active"
        fragId="list-icon"
        styles={styles}
      />
      <div className={styles["checkbox-text"]}>Tags</div>
    </div>
  );
}

function DeleteTextComponent({ deleteSelectedTableItems }) {
  return (
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
  );
}

function DuplicateTextComponent({ duplicateSelectedTableItems }) {
  return (
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
  );
}

export default CheckboxOptionComponent;
