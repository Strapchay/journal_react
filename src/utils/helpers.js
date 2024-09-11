import { BASE_API_URL, successCodes } from "./constants";

export function formatToFormType(string) {
  if (string === "login-form") return "login";
  if (string === "signup-form") return "create";
  if (string === "reset-form") return "reset";
}

export function formRenderingHeading(formType) {
  if (formType === "reset") return "Reset Password";

  if (formType === "create") return "Create Account";

  if (formType === "login")
    return formType.slice(0, 1).toUpperCase() + formType.slice(1);

  if (formType === "updateInfo") return "Update Your Info";

  if (formType === "updatePwd") return "Update Your Password";
}

export function formRenderInfo(formType) {
  const requestType = {
    login: "account",
    create: "account",
    reset: "password",
    updateInfo: "information",
    updatePwd: "password",
  };

  if (formType === "login")
    return `${formType} to your ${requestType[formType]}`;
  if (formType === "create") return `${formType} an ${requestType[formType]}`;
  if (formType === "reset") return `${formType} your ${requestType[formType]}`;
  if (formType === "updateInfo") return `update your ${requestType[formType]}`;
  if (formType === "updatePwd") return `update your ${requestType[formType]}`;
}

export function getInitError(data) {
  if (typeof data === "object") {
    const errorKeys = Object.keys(data);
    if (errorKeys.length === 1) return `${errorKeys}:${data[errorKeys]}`;
    else return `${errorKeys[0]}:${data[errorKeys[0]]}`;
  }
  return data;
}

export async function makeAPIRequest(
  url,
  payload = null,
  action = null,
  token = null,
  method = "GET",
  removeToken = null,
  extraActions = null,
) {
  try {
    const prepare = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (payload) prepare.body = JSON.stringify(payload);
    if (token) prepare.headers.Authorization = `Token ` + token;

    // const res = await fetch(url, prepare);
    const res = await Promise.race([
      fetch(BASE_API_URL + url, prepare),
      timeout(20, action),
    ]);
    const data = await res.json();
    if (!res.ok || !successCodes.includes(res.status)) {
      if (res.status === 401) removeToken?.();
      throw new Error(getInitError(data));
    }
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
}

export const timeout = (sec = 20, actionType, fn = undefined) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      const error = new Error(
        `Could not ${actionType} at this moment, Please try again later!`,
      );
      reject(fn ? fn() && error : error);
    }, sec * 1000);
  });
};

export const timeoutWithoutPromise = (sec, fn) => {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      resolve(fn());
    }, sec * 1000);
  });
};
