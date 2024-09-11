import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { useContext } from "react";
// import { ModalContext } from "../../ModalN";
import { useEffect } from "react";
import ResetPasswordForm from "./ResetPasswordForm";
import { ModalContext } from "../../Modal";
import FormOverlay from "../../FormOverlay";
import { formatToFormType } from "../../utils/helpers";

function AuthForm({ formType, onCloseModal, refObj }) {
  const [currentForm, setCurrentForm] = useState("");
  const { setOpenName } = useContext(ModalContext);
  useEffect(() => {
    console.log("the formtype val", formType);
    setCurrentForm(formType);
  }, [formType]);
  function switchForm(toForm) {
    console.log("the current to form", toForm);
    setOpenName(toForm);
    setCurrentForm(toForm);
  }

  return (
    <FormOverlay
      refObj={refObj}
      onCloseModal={onCloseModal}
      formType={formatToFormType(formType)}
    >
      {currentForm === "login-form" && (
        <LoginForm onCloseModal={onCloseModal} switchForm={switchForm} />
      )}
      {currentForm === "signup-form" && (
        <SignupForm onCloseModal={onCloseModal} />
      )}
      {currentForm === "reset-form" && (
        <ResetPasswordForm onCloseModal={onCloseModal} />
      )}
    </FormOverlay>
  );
}

export default AuthForm;
