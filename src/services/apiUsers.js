import { API } from "../utils/api";
import { makeAPIRequest } from "../utils/helpers";

export async function createUser(user) {
  return makeAPIRequest(API.APIEnum.USER.CREATE, user, "create", null, "POST");
}

export async function loginUser(user) {
  return makeAPIRequest(API.APIEnum.USER.TOKEN, user, "login", null, "POST");
}

export async function sendResetPassword(payload) {
  return makeAPIRequest(
    API.APIEnum.USER.RESET_PWD,
    payload,
    "resetPwd",
    null,
    "POST",
  );
}

export async function resetPasswordConfirm(payload) {
  return makeAPIRequest(
    API.APIEnum.USER.RESET_PWD_CONFIRM,
    payload,
    "resetConfirmPwd",
    null,
    "POST",
  );
}

export async function getUserInfo(token, removeToken) {
  return makeAPIRequest(
    API.APIEnum.USER.GET,
    null,
    "getUser",
    token,
    "GET",
    removeToken,
  );
}

export async function updateUserInfo(token, user, removeToken) {
  return makeAPIRequest(
    API.APIEnum.USER.UPDATE_INFO,
    user,
    "updateInfo",
    token,
    "PUT",
    removeToken,
  );
}

export async function updateUserPwd(token, payload, removeToken) {
  return makeAPIRequest(
    API.APIEnum.USER.UPDATE_PWD,
    payload,
    "updatePwd",
    token,
    "PUT",
    removeToken,
  );
}
