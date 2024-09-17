import { useForm } from "react-hook-form";
import FormOverlay from "../../FormOverlay";
import styles from "../Landing.module.css";
import { useContext } from "react";
import { AuthContext } from "../../ProtectedRoute";
import { useUpdatePwd } from "../../features/journals/useUpdateUserPwd";
import { ModalContext } from "../../Modal";

function UpdatePwdForm() {
  const { token, removeTokenAndLogout } = useContext(AuthContext);
  const { close } = useContext(ModalContext);
  const { register, handleSubmit, reset, formState, getValues } = useForm();
  const { updateUserPwd, isLoading, error } = useUpdatePwd(token);

  function onSubmit(data) {
    updateUserPwd(data, {
      onSuccess: (data) => {
        reset();
        close?.();
        removeTokenAndLogout?.();
      },
    });
  }

  function onError() {}

  return (
    <FormOverlay formType="updatePwd">
      <div className="form-content-form">
        <form
          action=""
          encType="multipart/form-data"
          id="update-pwd-form"
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <div className={styles["form-div"]}>
            <label htmlFor="old_password">Old Password</label>
            <input
              type="password"
              className={styles["password"]}
              id="old_password"
              name="old_password"
              placeholder="Old Password"
              {...register("old_password", {
                required: "This field is required",
              })}
              disabled={isLoading}
            />
          </div>
          <div className={styles["form-div"]}>
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              className={styles["password"]}
              id="password"
              name="password"
              placeholder="New Password"
              {...register("password", {
                required: "This field is required",
                minLength: {
                  value: 9,
                  message: "Your password should be at least 9 characters long",
                },
                validate: (value) =>
                  value == getValues().password2 ||
                  "Password fields don't match",
              })}
              disabled={isLoading}
            />
          </div>
          <div className={styles["form-div"]}>
            <label htmlFor="password2">Confirm Password</label>
            <input
              type="password"
              name="password2"
              className={styles["password2"]}
              id="password2"
              placeholder="Re-type your password"
              {...register("password2", {
                required: "This field is required",
              })}
              disabled={isLoading}
            />
          </div>

          <button
            className={styles["form-submit"]}
            type="submit"
            disabled={isLoading}
          >
            Update Password
          </button>
        </form>
      </div>
    </FormOverlay>
  );
}

export default UpdatePwdForm;
