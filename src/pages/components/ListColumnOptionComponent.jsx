import { useColumnOptionActions } from "../../hooks/useColumnOptionActions";
import SvgMarkup from "../../SvgMarkup";
import styles from "../Journal.module.css";

function ListColumnOptionComponent({ table, onSubmit, hasParent = false }) {
  const {
    renameActive,
    tableNameInput,
    handleTableNameChange,
    setRenameActive,
    handleTableDuplicate,
    handleTableDelete,
  } = useColumnOptionActions({ table, onSubmit, hasParent });

  return (
    <div
      className={[
        styles["table-row-active--options"],
        styles["component-options"],
      ].join(" ")}
    >
      <div className={styles["table-options"]}>
        <RenameComponent
          renameActive={renameActive}
          setRenameActive={setRenameActive}
          tableNameInput={tableNameInput}
          handleTableNameChange={handleTableNameChange}
        />
        <div className={styles["table-options-actions--option"]}>
          <div className={styles["actions-content-container"]}>
            <div className={styles["actions-content-box"]}>
              <DuplicateComponent handleTableDuplicate={handleTableDuplicate} />
              <DeleteComponent handleTableDelete={handleTableDelete} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RenameComponent({
  renameActive,
  tableNameInput,
  handleTableNameChange,
  setRenameActive,
}) {
  return (
    <div className={styles["table-options-edits--option"]}>
      <div className={styles["edit-content-container"]}>
        <div className={styles["edit-content-box"]}>
          {renameActive && (
            <div className={[styles["edit-content-form"]].join(" ")}>
              <input
                type="text"
                placeholder=""
                className={[
                  styles["table-rename"],
                  styles["component-form"],
                ].join(" ")}
                name="table-rename"
                defaultValue={tableNameInput}
                onKeyUp={handleTableNameChange}
              />
            </div>
          )}
          <div
            className={styles["edit-content"]}
            onClick={() => setRenameActive((r) => !r)}
          >
            <div className={styles["edit-content-icon"]}>
              <SvgMarkup
                classList={styles["edit-icon"]}
                fragId="pen-to-square"
                styles={styles}
              />
            </div>
            <div className={styles["edit-text"]}>Rename</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DuplicateComponent({ handleTableDuplicate }) {
  return (
    <div
      className={[styles["action-content"], styles["action-duplicate"]].join(
        " ",
      )}
      onClick={handleTableDuplicate}
    >
      <div className={styles["action-content-icon"]}>
        <SvgMarkup
          classList={styles["action-icon"]}
          fragId="clone"
          styles={styles}
        />
      </div>
      <div className={styles["action-text"]}>Duplicate</div>
    </div>
  );
}

function DeleteComponent({ handleTableDelete }) {
  return (
    <div
      className={[styles["action-content"], styles["action-delete"]].join(" ")}
      onClick={handleTableDelete}
    >
      <div className={styles["action-icon"]}>
        <SvgMarkup
          classList={styles["action-icon"]}
          fragId="trashcan-icon"
          styles={styles}
        />
      </div>
      <div className={styles["action-text"]}>Delete</div>
    </div>
  );
}

export default ListColumnOptionComponent;
