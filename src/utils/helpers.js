import { BASE_API_URL, LOCALE_TIME, successCodes } from "./constants";

export const valueEclipser = (value, len) => {
  if (value.length < len) return value;
  if (value.length === len) return value + "...";
  if (value.length > len) return value.slice(0, len) + "...";
};

export const swapItemIndexInPlace = (items, itemToSwapId) => {
  const itemLength = items?.length;
  if (itemLength > 4) {
    const itemToSwapIndex = items.findIndex((item) => item[1] === itemToSwapId);
    if (itemToSwapIndex > 3) {
      const itemToSwap = items.splice(itemToSwapIndex, 1)[0];
      items.splice(3, 0, itemToSwap);
    }
  }
  return items;
};

export const swapItemIndex = (items, itemToAdd) => {
  items.splice(3, 0, itemToAdd);
  items.reverse();
  const valueIndex = items.findIndex((item) => item[1] === itemToAdd[1]);
  items.splice(valueIndex, 1);
  items.reverse();
  return items;
};

export const dateTimeFormat = (date) => {
  const dateTimeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    month: "long",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  };
  const formattedDate = new Intl.DateTimeFormat(
    LOCALE_TIME,
    dateTimeOptions,
  ).format(date);
  return formattedDate.replace("at", ",");
};

export const tableRowActivator = (currentTableId, itemId, i) => {
  if (!currentTableId & (i < 1)) return "table-row-active";

  if (currentTableId)
    return currentTableId && itemId === currentTableId
      ? "table-row-active"
      : "";
};

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

export const formatJournalHeadingName = (username) => {
  const headingName = `${username.slice(0, 1).toUpperCase() + username.slice(1)}'s Journal`;
  return `${headingName.slice(0, 15)}...`;
};

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

export const formatAPISub = function (APIResp, type) {
  let formatList = [];
  if (APIResp.length > 1 || APIResp.length === 1) {
    APIResp.forEach((resp) => formatList.push(formatAPIResp(resp, type)));
    return formatList;
  }
  return APIResp;
};

export const formatAPITableItems = function (APIResp, type) {
  let formattedData = [];
  if (APIResp.length > 0) {
    APIResp.forEach((resp) => {
      let formatAPITableItem = {
        id: resp.id,
        itemTitle: resp.name,
        itemTags: formatAPISub(resp.tags, "tags"),
        actionItems: formatAPISub(resp.action_items, "actionItems"),
        intentions: formatAPISub(resp.intentions, "intentions"),
        happenings: formatAPISub(resp.happenings, "happenings"),
        gratefulFor: formatAPISub(resp.grateful_for, "gratefulFor"),
        created: Date.now(resp.created),
      };
      formattedData.push(formatAPITableItem);
    });
    return formattedData;
  }
  if (!APIResp.length > 0) return APIResp;
};

export const formatAPIResp = function (APIResp, type) {
  let formattedData;
  if (type === "journal") {
    formattedData = {
      id: APIResp.id,
      name: APIResp.journal_name,
      description: APIResp.journal_description,
      tableHeads: APIResp.journal_tables,
      currentTable: APIResp.current_table,
      tags: formatAPISub(APIResp.tags, "apiTags"),
      tableFunc: APIResp.journal_table_func,
      username: APIResp.username,
    };
  }

  if (type === "apiTags") {
    formattedData = {
      id: APIResp.id,
      text: APIResp.tag_name,
      color: APIResp.tag_class,
    };
  }

  if (type === "journalTables") {
    formattedData = {
      id: APIResp.id,
      tableTitle: APIResp.table_name,
      tableItems: formatAPITableItems(APIResp.activities, "activities"),
    };
  }

  if (type === "actionItems") {
    formattedData = {
      id: APIResp.id,
      text: APIResp.action_item,
      checkbox: true,
      checked: APIResp.checked,
    };
  }

  if (type === "intentions") {
    formattedData = {
      id: APIResp.id,
      text: APIResp.intention,
    };
  }

  if (type === "happenings") {
    formattedData = {
      id: APIResp.id,
      text: APIResp.happening,
    };
  }

  if (type === "gratefulFor") {
    formattedData = {
      id: APIResp.id,
      text: APIResp.grateful_for,
    };
  }

  if (type === "tags") {
    formattedData = APIResp.id;
  }

  return formattedData;
};
