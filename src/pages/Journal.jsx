import { useContext } from "react";
import { AuthContext } from "../ProtectedRoute";
import styles from "./Journal.module.css";
import ContainerSidePeek from "../ContainerSidePeek";
import InfoComponent from "./components/InfoComponent";
import TableComponent from "./components/TableComponent";
import SidebarComponent from "./components/SidebarComponent";

function Journal() {
  const { journalState, overlayContainerRef, sidePeek } =
    useContext(AuthContext);

  return (
    <main>
      <div
        className={[
          styles["container"],
          styles[journalState?.sideBarClosed ? "nav-hide" : ""],
          styles[sidePeek.isActive ? "side-peek" : ""],
        ].join(" ")}
      >
        <SidebarComponent />
        <InfoComponent>
          <TableComponent />
        </InfoComponent>
        {sidePeek.isActive && <ContainerSidePeek itemId={sidePeek.itemId} />}
      </div>
      <div
        className={styles["overlay-container"]}
        ref={overlayContainerRef}
      ></div>
    </main>
  );
}

export default Journal;
