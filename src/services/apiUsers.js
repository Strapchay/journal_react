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

export async function getUserInfo(token) {
  return makeAPIRequest(API.APIEnum.USER.GET, null, "getUser", token, "GET");
}

export async function updateUserInfo(token, user) {
  return makeAPIRequest(
    API.APIEnum.USER.UPDATE_INFO,
    user,
    "updateInfo",
    token,
    "PUT",
  );
}

export async function updateUserPwd(token, payload) {
  return makeAPIRequest(
    API.APIEnum.USER.UPDATE_PWD,
    payload,
    "updatePwd",
    token,
    "PUT",
  );
}

export async function getUserProfile() {
  // try {
  //   const url = API.APIEnum.USER.PROFILE;
  //   const res = await fetch(url, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   const data = await res.json();
  //   if (!res.ok || !successCodes.includes(res.status))
  //     throw new Error(getInitError(data));
  //   return data;
  // } catch (err) {
  //   throw new Error(err.message);
  // }
}

export async function updateUserProfiles(profile) {
  // try {
  //   //Get csrf cookie from server
  //   await setCsrfCookie();
  //   //get the csrf token from the browser cookie
  //   const csrfToken = getCookie("csrftoken");
  //   const url = API.APIEnum.USER.PROFILE;
  //   const res = await fetch(url, {
  //     method: "PATCH",
  //     body: JSON.stringify(profile),
  //     headers: {
  //       "Content-Type": "application/json",
  //       "X-CSRFToken": csrfToken,
  //     },
  //   });
  //   const data = await res.json();
  //   if (!res.ok || !successCodes.includes(res.status))
  //     throw new Error(getInitError(data));
  //   return data;
  // } catch (err) {
  //   throw new Error(err.message);
  // }
}

export async function updateUserDetails(updateObj) {
  // try {
  //   //Get csrf cookie from server
  //   await setCsrfCookie();
  //   //get the csrf token from the browser cookie
  //   const csrfToken = getCookie("csrftoken");
  //   const url = API.APIEnum.USER.UPDATE_INFO;
  //   const res = await fetch(url, {
  //     method: "PATCH",
  //     body: JSON.stringify(updateObj),
  //     headers: {
  //       "Content-Type": "application/json",
  //       "X-CSRFToken": csrfToken,
  //     },
  //   });
  //   const data = await res.json();
  //   if (!res.ok || !successCodes.includes(res.status))
  //     throw new Error(getInitError(data));
  //   return data;
  // } catch (err) {
  //   throw new Error(err.message);
  // }
}

export async function updateUsersPassword(updateObj) {
  // try {
  //   //Get csrf cookie from server
  //   await setCsrfCookie();
  //   //get the csrf token from the browser cookie
  //   const csrfToken = getCookie("csrftoken");
  //   const url = API.APIEnum.USER.UPDATE_PWD;
  //   const res = await fetch(url, {
  //     method: "PUT",
  //     body: JSON.stringify(updateObj),
  //     headers: {
  //       "Content-Type": "application/json",
  //       "X-CSRFToken": csrfToken,
  //     },
  //   });
  //   const data = await res.json();
  //   if (!res.ok || !successCodes.includes(res.status))
  //     throw new Error(getInitError(data));
  //   return data;
  // } catch (err) {
  //   throw new Error(err.message);
  // }
}

export async function logoutUser() {
  // try {
  //   //Get csrf cookie from server
  //   await setCsrfCookie();
  //   //get the csrf token from the browser cookie
  //   const csrfToken = getCookie("csrftoken");
  //   const url = API.APIEnum.USER.LOGOUT;
  //   const res = await fetch(url, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "X-CSRFToken": csrfToken,
  //     },
  //     credentials: "include",
  //   });
  //   const data = await res.json();
  //   if (!res.ok || !successCodes.includes(res.status))
  //     throw new Error(getInitError(data));
  //   return data;
  // } catch (err) {
  //   throw new Error(err.message);
  // }
}
