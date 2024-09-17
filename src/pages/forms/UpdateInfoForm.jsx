import { useForm } from "react-hook-form";
import FormOverlay from "../../FormOverlay";
import styles from "../Landing.module.css";
import { useUpdateUserInfo } from "../../features/journals/useUpdateUserInfo";
import { useContext } from "react";
import { AuthContext } from "../../ProtectedRoute";

function UpdateInfoForm({ onCloseModal }) {
  const { token } = useContext(AuthContext);
  const { register, handleSubmit, reset, formState, getValues } = useForm();
  const { updateUserInfo, isLoading, error } = useUpdateUserInfo(token);

  function onSubmit(data) {
    //   pattern: {
    //     value: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
    //     message: "The entered email value is invalid",
    //   },
    // }
    //TODO: check and validate the email field if supplied
    const emailValue = data.email;

    updateUserInfo(data, {
      onSuccess: (data) => {
        reset();
      },
    });
  }

  function onError() {}

  return (
    <FormOverlay formType="updateInfo">
      <div className="form-content-form">
        <form
          action=""
          encType="multipart/form-data"
          id="update-info-form"
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <div className={styles["form-div"]}>
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              className={styles["first_name"]}
              id="first_name"
              name="first_name"
              placeholder="eg. John"
              {...register("first_name")}
              disabled={isLoading}
            />
          </div>
          <div className={styles["form-div"]}>
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              className={styles["last_name"]}
              id="last_name"
              name="last_name"
              placeholder="eg. Doe"
              {...register("last_name", {
                required: false,
              })}
              disabled={isLoading}
            />
          </div>
          <div className={styles["form-div"]}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className={styles["email"]}
              name="email"
              id="email"
              placeholder="eg. johndoe@example.com"
              {...register("email")}
              disabled={isLoading}
            />
          </div>
          <div className={styles["form-div"]}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className={styles["username"]}
              id="username"
              name="username"
              placeholder="johndoe"
              {...register("username")}
              disabled={isLoading}
            />
          </div>

          <button
            className={styles["form-submit"]}
            type="submit"
            disabled={isLoading}
          >
            Update Info
          </button>
        </form>
      </div>
    </FormOverlay>
  );
}

export default UpdateInfoForm;
