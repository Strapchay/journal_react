import toast from "react-hot-toast";
import FormOverlay from "../../FormOverlay";
import { useForm } from "react-hook-form";
import styles from "../Landing.module.css";
import { useNavigate } from "react-router-dom";
import { useLoginUser } from "../../features/users/useLoginUser";
import ResetPasswordForm from "./ResetPasswordForm";
import Modal from "../../Modal";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import { useState } from "react";
import { useEffect } from "react";
import SpinnerMini from "../../SpinnerMini";

function LoginForm({ onCloseModal, switchForm }) {
  const { setToken } = useLocalStorageState({}, "token");
  const navigate = useNavigate();
  const { loginUser, isLoading } = useLoginUser();
  const { register, handleSubmit, reset, formState } = useForm();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard", { replace: true });
      onCloseModal?.();
    }
  }, [isLoggedIn, navigate, onCloseModal]);

  function onSubmit(data) {
    const formattedData = {
      email: data.login_email,
      password: data.login_password,
    };
    loginUser(formattedData, {
      onSuccess: (data) => {
        reset();
        setToken(data);
        setIsLoggedIn((_) => true);
      },
    });
  }

  function onError(errors) {}

  return (
    <FormOverlay formType="login">
      <div className="form-content-form">
        <form
          action=""
          id="login-form"
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <div className={styles["form-div"]}>
            <label htmlFor="login_email">Email</label>
            <input
              type="email"
              className={styles["login_email"]}
              id="login_email"
              name="login_email"
              placeholder="eg. johndoe@example.com"
              disabled={isLoading}
              {...register("login_email", {
                required: "This field is required",
                pattern: {
                  value: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
                  message: "The entered email value is invalid",
                },
              })}
              required
            />
          </div>
          <div className={styles["form-div"]}>
            <label htmlFor="login_password">Password</label>
            <input
              type="password"
              className={styles["login_password"]}
              name="login_password"
              id="login_password"
              placeholder="Create a strong password"
              disabled={isLoading}
              {...register("login_password", {
                required: "This field is required",
              })}
              required
            />
          </div>
          <button
            className={styles["form-submit"]}
            type="submit"
            disabled={isLoading}
          >
            {!isLoading ? "Login" : <SpinnerMini />}
          </button>
        </form>
      </div>
      <a
        className={styles["btn-reset"]}
        onClick={() => switchForm("reset-form")}
      >
        Forgot Password?
      </a>
    </FormOverlay>
  );
}

export default LoginForm;
