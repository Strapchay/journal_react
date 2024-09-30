import styles from "../Journal.module.css";
import JournalMainInfoComponent from "./JournalMainInfoComponent";
import JournalMainTableComponent from "./JournalMainTableComponent";

function JournalMainComponent() {
  return (
    <JournalMainInfoComponent>
      <JournalMainTableComponent />
    </JournalMainInfoComponent>
  );
}

export default JournalMainComponent;
