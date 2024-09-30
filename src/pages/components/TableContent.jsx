import { useContext } from "react";
import SvgMarkup from "../../SvgMarkup";
import styles from "../Journal.module.css";
import RowHeadComponent from "./RowHeadComponent";
import { AuthContext } from "../../ProtectedRoute";
import BodyComponent from "./BodyComponent";

function TableContent({ body = false }) {
  return (
    <div className={styles["main-table-row"]}>
      <div role="tablerow" aria-label="Journals">
        <RowHeadComponent />
        <BodyComponent />
        {!body && <AdderComponent />}
      </div>
    </div>
  );
}

function AdderComponent() {
  const { handleAddBodyItem } = useContext(AuthContext);

  return (
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
              className={[styles["row-adder-text"], styles["color-dull"]].join(
                " ",
              )}
            >
              New
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableContent;
