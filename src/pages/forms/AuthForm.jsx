import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import ResetPasswordForm from "./ResetPasswordForm";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { ModalContext } from "../../Modal";

function AuthForm({ formType }) {
  const [currentForm, setCurrentForm] = useState("");
  const { setOpenName } = useContext(ModalContext);

  useEffect(() => {
    setCurrentForm(formType);
  }, [formType]);

  function switchForm(toForm) {
    setOpenName(toForm);
    setCurrentForm(toForm);
  }

  return (
    <>
      {currentForm === "login-form" && <LoginForm switchForm={switchForm} />}
      {currentForm === "signup-form" && <SignupForm />}
      {currentForm === "reset-form" && <ResetPasswordForm />}
    </>
  );
}

export default AuthForm;
