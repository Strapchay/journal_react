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
            <TagComponent itemIds={getSelectedItems(selectedTableItems)} />
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

export default CheckboxOptionComponent;
