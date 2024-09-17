import { useForm } from "react-hook-form";
import FormOverlay from "../../FormOverlay";
import styles from "../Landing.module.css";
import { useUpdateUserInfo } from "../../features/journals/useUpdateUserInfo";
import { useContext } from "react";
import { AuthContext } from "../../ProtectedRoute";
import { useGetUser } from "../../features/users/useGetUser";
import { ModalContext } from "../../Modal";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

function UpdateInfoForm() {
  const queryClient = useQueryClient();
  const { token, removeTokenAndLogout } = useContext(AuthContext);
  const { close } = useContext(ModalContext);
  const { user } = useGetUser(token);
  const { register, handleSubmit, reset, formState, getValues } = useForm({
    defaultValues: {
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email,
      username: user?.username,
    },
  });
  const { updateUserInfo, isLoading, error } = useUpdateUserInfo(token);

  function onSubmit(data) {
    updateUserInfo(data, {
      onSuccess: (data) => {
        reset();
        close?.();
        if (user.email !== data.email) {
          toast.success("Your email has changed, please login again");
          removeTokenAndLogout();
        }
        toast.success("User info updated successfully");
        queryClient.invalidateQueries({ queryKey: ["user"] });
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
              {...register("email", {
                required: false,
                pattern: {
                  value: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
                  message: "The entered email value is invalid",
                },
              })}
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
