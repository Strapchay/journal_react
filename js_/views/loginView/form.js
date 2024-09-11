import { CreateForm } from "./createForm.js"
import { LoginForm } from "./loginForm.js"
import { UpdateInfoForm } from "./updateInfoForm.js";
import { UpdatePasswordForm } from "./updatePasswordForm.js";
import { ResetPasswordForm } from "./resetPasswordForm.js";

export class Form {

    static form(formType) {
        switch (formType) {
            case "login":
                return new LoginForm()
                break;
            case "sign up":
                return new CreateForm()
                break;
            case "reset":
                return new ResetPasswordForm()
                break;
            case "updateInfo":
                return new UpdateInfoForm()
                break;
            case "updatePwd":
                return new UpdatePasswordForm()
                break;
        }
    }
}