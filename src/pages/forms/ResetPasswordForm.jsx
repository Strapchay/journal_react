import { useState } from "react";
import FormOverlay from "../../FormOverlay";
import styles from "../Landing.module.css";
import { useForm } from "react-hook-form";
import { useSendResetPassword } from "../../features/users/useSendResetPassword";
import { useResetPasswordConfirm } from "../../features/users/useResetPasswordConfirm";
import { useEffect } from "react";

function ResetPasswordForm({ onCloseModal }) {
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { register, handleSubmit, reset, formState } = useForm();
  const { sendResetPassword, isLoading: isSending } = useSendResetPassword();
  const { resetPasswordConfirm, isLoading: isResetting } =
    useResetPasswordConfirm();

  function onSubmit(data) {
    if (!resetEmailSent) {
      sendResetPassword(data, {
        onSuccess: () => {
          setResetEmailSent((_) => true);
        },
      });
    } else {
      resetPasswordConfirm(data, {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      });
    }
  }

  function onError() {}

  return (
    <div className={styles["form-content-form"]}>
      <form
        action=""
        id="reset-pwd-form"
        className={styles["form-class"]}
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        {!resetEmailSent && (
          <SendResetPasswordForm register={register} formEvent={isSending} />
        )}
        {resetEmailSent && (
          <ResetPasswordConfirmForm
            register={register}
            formEvent={isResetting}
          />
        )}
        <button
          className={styles["form-submit"]}
          disabled={!resetEmailSent ? isSending : isResetting}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
function SendResetPasswordForm({ register, formEvent }) {
  return (
    <div className={styles["reset-reset"]}>
      <div className={styles["form-div"]}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="email"
          className={styles["bd-radius"]}
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
              message: "The entered email value is invalid",
            },
          })}
          disabled={formEvent}
        />
      </div>
    </div>
  );
}

function ResetPasswordConfirmForm({ register, formEvent }) {
  return (
    <div className={styles["reset-confirm"]}>
      <div className={styles["form-div"]}>
        <label htmlFor="token">Token</label>
        <input
          type="text"
          name="token"
          className={styles["token"]}
          placeholder="eg. df93fa-vdsa23-klvadf32..."
          id="token"
          required
          {...register("token", {
            required: "This field is required",
          })}
          disabled={formEvent}
        />
      </div>
      <div className="form-div">
        <label htmlFor="uid">UID</label>
        <input
          type="text"
          name="uid"
          placeholder="eg. MQT"
          className={styles["uid"]}
          id="uid"
          {...register("uid", {
            required: "This field is required",
          })}
          disabled={formEvent}
        />
      </div>
      <div className="form-div">
        <label htmlFor="new_password1">New Password</label>
        <input
          type="password"
          name="new_password1"
          placeholder="Create a strong password"
          className={styles["new_password1"]}
          id="new_password1"
          required
        />
        disabled={formEvent}
      </div>
      <div className="form-div">
        <label htmlFor="new_password2">Confirm Password</label>
        <input
          type="password"
          name="new_password2"
          placeholder="Re-type your password"
          className={styles["new_password2"]}
          id="new_password2"
          required
          disabled={formEvent}
        />
      </div>
    </div>
  );
}

export default ResetPasswordForm;
