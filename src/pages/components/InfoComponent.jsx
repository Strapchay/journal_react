import { useContext } from "react";
import styles from "../Journal.module.css";
import { AuthContext } from "../../ProtectedRoute";
import SvgMarkup from "../../SvgMarkup";
import { valueEclipser } from "../../utils/helpers";
import { HEADER_JOURNAL_TITLE_LENGTH } from "../../utils/constants";
import { useInfoActions } from "../../hooks/useInfoActions";

function InfoComponent({ children }) {
  return (
    <div className={styles["content-container"]}>
      <div className={styles["row"]}>
        <HeaderComponent />
        <div className={styles["container-main-content"]}>
          <div className={[styles["row"], styles["row-scroller"]].join(" ")}>
            <ContentComponent />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeaderComponent() {
  const { journalState, dispatch } = useContext(AuthContext);

  return (
    <div className={styles["container-header"]}>
      {journalState.sideBarClosed ? (
        <div
          className={[
            styles["sidebar-open"],
            styles["nav-options-sidebar-open-icon"],
          ].join(" ")}
          onClick={() => dispatch({ type: "updateSidebarClosed" })}
        >
          <SvgMarkup
            classList="angles-icon icon icon-lg"
            fragId="angles-right"
            styles={styles}
          />
        </div>
      ) : (
        ""
      )}
      <div className={styles["nav-options-journal-icon"]}>
        <SvgMarkup
          classList={[styles["journal-icon"], styles["icon"]].join(" ")}
          fragId="journal-icon"
          styles={styles}
        />
      </div>

      <div className={styles["nav-options-text"]}>
        {journalState?.name?.length > 0
          ? valueEclipser(journalState?.name, HEADER_JOURNAL_TITLE_LENGTH)
          : "Untitled"}
      </div>
    </div>
  );
}

function ContentComponent() {
  const { handleJournalInfoChange, journalNameRef, journalDescRef } =
    useInfoActions();

  return (
    <div className={styles["main-content-info"]}>
      <div className={styles["main-content-heading"]}>
        <div className={styles["nav-options-journal-icon"]}>
          <SvgMarkup
            classList="journal-icon icon"
            fragId="journal-icon"
            styles={styles}
          />
        </div>

        <h2
          className={styles["journal-title-input"]}
          contentEditable={true}
          placeholder="Untitled"
          suppressContentEditableWarning={true}
          ref={journalNameRef}
          onKeyUp={(e) => handleJournalInfoChange("name")}
        ></h2>
      </div>
      <div className={styles["main-content-description"]}>
        <div
          className={styles["content-description-input"]}
          contentEditable={true}
          ref={journalDescRef}
          suppressContentEditableWarning={true}
          onKeyUp={(e) => handleJournalInfoChange("description")}
        ></div>
      </div>
    </div>
  );
}

export default InfoComponent;
