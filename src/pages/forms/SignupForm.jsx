import { useForm } from "react-hook-form";
import FormOverlay from "../../FormOverlay";
import styles from "../Landing.module.css";
import { useCreateUser } from "../../features/users/useCreateUser";

function SignupForm({ onCloseModal }) {
  const { register, handleSubmit, reset, formState, getValues } = useForm();
  const { createUser, isCreating } = useCreateUser();

  function onSubmit(data) {
    createUser(data, {
      onSuccess: (data) => {
        reset();
        onCloseModal?.();
      },
    });
  }

  function onError() {}
  return (
    <FormOverlay formType="create">
      <div className="form-content-form">
        <form
          action=""
          encType="multipart/form-data"
          id="create-form"
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
              {...register("first_name", {
                required: "This field is required",
              })}
              disabled={isCreating}
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
                required: "This field is required",
              })}
              disabled={isCreating}
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
              {...register("email", {
                required: "This field is required",
                pattern: {
                  value: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
                  message: "The entered email value is invalid",
                },
              })}
              disabled={isCreating}
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
              {...register("username", {
                required: "This field is required",
              })}
              disabled={isCreating}
            />
          </div>
          <div className={styles["form-div"]}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className={styles["password"]}
              id="password"
              name="password"
              placeholder="Create a strong password"
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
              disabled={isCreating}
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
              disabled={isCreating}
            />
          </div>

          <button
            className={styles["form-submit"]}
            type="submit"
            disabled={isCreating}
          >
            Create account
          </button>
        </form>
      </div>
    </FormOverlay>
  );
}

export default SignupForm;
