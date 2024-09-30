import { useContext } from "react";
import styles from "../Journal.module.css";
import { AuthContext } from "../../ProtectedRoute";
import { formatJournalHeadingName, valueEclipser } from "../../utils/helpers";
import SvgMarkup from "../../SvgMarkup";
import { useState } from "react";
import { SIDEBAR_JOURNAL_TITLE_LENGTH } from "../../utils/constants";
import Modal from "../../Modal";
import UpdateInfoForm from "../forms/UpdateInfoForm";
import UpdatePwdForm from "../forms/UpdatePwdForm";

function JournalSidebarComponent() {
  return (
    <div className={styles["nav-sidebar"]}>
      <div className={styles["nav-sidebar-options"]}>
        <JournalSidebarHeadingMarkup />
        <JournalSidebarJournalMarkup />
        <JournalSidebarUserSettingsOption />
        <JournalSidebarLogout />
      </div>
    </div>
  );
}

function JournalSidebarHeadingMarkup() {
  const { user, dispatch } = useContext(AuthContext);
  const username = user?.username;

  return (
    <div className={styles["nav-options-heading"]}>
      <div className={styles["options-heading-icon"]}>
        {username?.[0] ?? ""}
      </div>
      <div className={styles["options-heading-title"]}>
        {formatJournalHeadingName(username)}
      </div>
      <SvgMarkup
        classList="angles-icon sidebar-open icon"
        fragId="angles-left"
        styles={styles}
        onClick={() => dispatch({ type: "updateSidebarClosed" })}
      />
    </div>
  );
}

function JournalSidebarJournalMarkup() {
  const { journalState, dispatch } = useContext(AuthContext);
  const [listTables, setListTables] = useState(false);
  const tables = journalState.tables.map((table) => [
    table.tableTitle,
    table.id,
  ]);
  const currentTableId = journalState.currentTable;

  function handleSidebarSwitchTableEvent(tableId) {
    if (tableId !== currentTableId)
      dispatch({ type: "updateCurrentTable", payload: tableId });
  }

  return (
    <div
      className={[styles["nav-option"], styles["nav-options-journal"]].join(
        " ",
      )}
    >
      <div
        className={styles["nav-group"]}
        onClick={() => setListTables((s) => !s)}
      >
        <div className={styles["nav-options-icon"]}>
          <SvgMarkup
            classList="table-list-arrow-render arrow-render arrow-right-icon icon icon-mid"
            fragId={listTables ? "arrow-down" : "arrow-right"}
            styles={styles}
          />
        </div>

        <div className={styles["nav-icon-text"]}>
          <div className={styles["nav-options-journal-icon"]}>
            <SvgMarkup
              classList="journal-icon icon"
              fragId="journal-icon"
              styles={styles}
            />
          </div>

          <div className={styles["nav-options-text"]}>
            {journalState?.name?.length > 0
              ? valueEclipser(journalState?.name, SIDEBAR_JOURNAL_TITLE_LENGTH)
              : "Untitled"}
          </div>
        </div>
      </div>
      <div className={styles["journal-tables-list"]}>
        <ul className={styles["tables-list"]}>
          {listTables &&
            tables.map((table) => (
              <div
                className={[
                  styles["tables-list-box"],
                  styles["hover"],
                  styles[table[1] === currentTableId ? "hover-bg-stay" : ""],
                ].join(" ")}
                data-id={table[1]}
                key={table[1]}
                onClick={() => handleSidebarSwitchTableEvent(table[1])}
              >
                <div className={styles["tables-list-disc"]}></div>
                <li className="tables-list-table">{table[0]}</li>
              </div>
            ))}
        </ul>
      </div>
    </div>
  );
}

function JournalSidebarUserSettingsOption() {
  const [listSettings, setListSettings] = useState(false);

  return (
    <div
      className={[styles["nav-option"], styles["nav-options-user"]].join(" ")}
    >
      <div
        className={styles["nav-group"]}
        onClick={() => setListSettings((s) => !s)}
      >
        <div className={styles["nav-options-icon"]}>
          <SvgMarkup
            classList="update-list-arrow-render arrow-render arrow-right-icon icon icon-mid"
            fragId={listSettings ? "arrow-down" : "arrow-right"}
            styles={styles}
          />
        </div>

        <div className={styles["nav-icon-text"]}>
          <div className={styles["nav-options-journal-icon"]}>
            <SvgMarkup
              classList={styles["icon"]}
              fragId="user-settings"
              styles={styles}
            />
          </div>
          <div className={styles["nav-options-text"]}>Update Info</div>
        </div>
      </div>
      <Modal>
        <div className={styles["journal-update-info-list"]}>
          {listSettings && (
            <ul className={styles["update-info-list"]}>
              <Modal.Open opens="update-info-form">
                <div
                  className={[styles["update-list-box"], styles["hover"]].join(
                    " ",
                  )}
                >
                  <div className={styles["update-list-disc"]}></div>
                  <li className={styles["update-option"]}>Update User Info</li>
                </div>
              </Modal.Open>
              <Modal.Window name="update-info-form">
                <UpdateInfoForm />
              </Modal.Window>
              <Modal.Open opens="update-pwd-form">
                <div
                  className={[styles["update-list-box"], styles["hover"]].join(
                    " ",
                  )}
                >
                  <div className={styles["update-list-disc"]}></div>
                  <li className={styles["update-option"]}>Update Password</li>
                </div>
              </Modal.Open>
              <Modal.Window name="update-pwd-form">
                <UpdatePwdForm />
              </Modal.Window>
            </ul>
          )}
        </div>
      </Modal>
    </div>
  );
}

function JournalSidebarLogout() {
  const { removeTokenAndLogout } = useContext(AuthContext);

  return (
    <div
      className={[styles["nav-option"], styles["nav-options-logout"]].join(" ")}
      onClick={removeTokenAndLogout}
    >
      <div className={styles["nav-group"]}>
        <div className={styles["nav-icon-text"]}>
          <div className={styles["nav-options-journal-icon"]}>
            <SvgMarkup
              classList={styles["icon"]}
              fragId="logout"
              styles={styles}
            />
          </div>
          <div className={styles["nav-options-text"]}>Logout</div>
        </div>
      </div>
    </div>
  );
}

export default JournalSidebarComponent;
