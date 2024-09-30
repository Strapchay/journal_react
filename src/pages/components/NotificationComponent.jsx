import styles from "../Journal.module.css";

function NotificationComponent({
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
          <DeleteComponent onCancel={onSubmit} onComplete={onComplete} />
        )}
      </div>
    </div>
  );
}

function DeleteComponent({ onCancel, onComplete }) {
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

export default NotificationComponent;
