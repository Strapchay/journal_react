import {
  BASE_API_URL,
  LOCALE_TIME,
  successCodes,
  TAG_TEXT_RENDER_LENGTH,
  TAGS_COLORS,
} from "./constants";

export const valueEclipser = (value, len) => {
  if (value.length < len) return value;
  if (value.length === len) return value + "...";
  if (value.length > len) return value.slice(0, len) + "...";
};

export const capitalize = (value) => {
  return value.slice(0, 1).toUpperCase() + value.slice(1);
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
  const headingName = `${username?.slice(0, 1).toUpperCase() + username?.slice(1)}'s Journal`;
  return `${headingName?.slice(0, 15)}...`;
};

export const formatAPIRequestTagPayload = function (payload, type) {
  let formattedRequest;
  if (type === "tagsValue") {
    formattedRequest = {
      tag_class: payload.tag.color,
      tag_name: payload.tag.text,
      tag_color: TAGS_COLORS.colors.find(
        (color) => color.color_value == payload.tag.color,
      ).color,
    };

    if (payload.tag.id) formattedRequest["id"] = payload.tag.id;
  }
  return formattedRequest;
};

export const formatTagRenderedText = (tagText) => {
  if (tagText?.length > TAG_TEXT_RENDER_LENGTH)
    return tagText.slice(0, TAG_TEXT_RENDER_LENGTH) + "...";
  return tagText;
};

export function getInitError(data) {
  if (typeof data === "object") {
    const errorKeys = Object.keys(data);
    if (errorKeys.length === 1) return `${errorKeys}:${data[errorKeys]}`;
    else return `${errorKeys[0]}:${data[errorKeys[0]]}`;
  }
  return data;
}

async function getDeleteRes(data, requestType) {
  if (requestType.includes("batch")) {
    let res;
    try {
      res = await data.json();
    } catch (_) {
      res = null;
    }
  } else {
    if ((await data?.status) === 201) return "Item(s) deleted successfully";
  }
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
      timeout(100, action),
    ]);
    const data =
      method !== "DELETE" ? await res.json() : await getDeleteRes(res, action);
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
  // if (type === "apiTags")
  if (
    ["apiTags", "actionItems", "intentions", "happenings", "gratefulFor"].find(
      (opt) => opt === type,
    )
  )
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
        created: Date.parse(resp.created),
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

export const formatInputTypeCamelCase = function (inputType) {
  const shouldFormatInput = inputType?.includes("-");
  const formatInput = inputType?.split("-");
  return shouldFormatInput
    ? formatInput[0] +
        (formatInput[1][0].toUpperCase() +
          formatInput[1].slice(1).toLowerCase())
    : inputType;
};

export const tableItemOrdering = function (relativeItem, tableItems) {
  //TODO: switch functionality implementation
  let incrementOrderingIndex = false;
  let createItemOrdering = null;
  const itemsOrdering = tableItems.map((item, i) => {
    if (relativeItem && Number(item.id) === relativeItem) {
      incrementOrderingIndex = true;
      createItemOrdering = i + 2;
      return { id: Number(item.id), ordering: i + 1 };
    }
    return {
      id: Number(item.id),
      ordering: incrementOrderingIndex ? i + 2 : i + 1,
    };
  });

  return {
    create_item_ordering: createItemOrdering,
    table_items_ordering: itemsOrdering,
  };
};

export const getCurrentTable = (state) => {
  //returns current table or tableId passed into it
  const currentTable = state.tables.find(
    (table) => table.id === state.currentTable,
  );
  return currentTable;
};

export const getSelectedItems = function (items) {
  //majorly for calculating selected checkbox items
  const keys = Object.keys(items);
  const selectedItems = keys
    .map((key) => (!items[key] ? null : key))
    .filter((key) => key)
    .map((key) => +key);
  return selectedItems;
};

export const getTableItemWithMaxTags = function (table, itemsId) {
  const filteredTableItems = [];

  itemsId.forEach((itemId) => {
    const item = table.tableItems.find((item) => item.id === Number(itemId));
    if (item) filteredTableItems.push(item);
  });

  return filteredTableItems.reduce(
    (acc, item) => (acc.itemTags.length > item.itemTags.length ? acc : item),
    filteredTableItems[0],
  );
};

export const createTableItemAPIRequestPayload = function (
  currentTableId,
  relativeItem = false,
  tableItems = null,
) {
  const payload = {
    name: "",
    journal_table: currentTableId,
  };

  if (relativeItem)
    payload["ordering_list"] = tableItemOrdering(relativeItem, tableItems);

  return payload;
};

const getSubModelField = (submodel) => {
  if (submodel !== "grateful_for")
    return submodel.slice(0, submodel.length - 1);
  return submodel;
};

const createSubModelPayload = function (payload, submodel) {
  let formattedRequest = {};
  const subModelField = getSubModelField(submodel);

  //submodel value
  formattedRequest[submodel] = {
    activity: payload.itemId,
    update_and_create: payload?.modelProperty?.property?.updateAndAddProperty,
    update_only: payload?.modelProperty?.updateProperty,
    type: submodel,
    delete_only: payload?.modelProperty?.property?.delete ? true : false,
  };

  //add update value
  payload?.modelProperty?.property?.update
    ? (formattedRequest[submodel].update = {
        id: payload?.modelProperty?.property?.update?.propertyId ?? null,
      })
    : null;

  //add subfield value
  if (formattedRequest[submodel].update)
    formattedRequest[submodel].update[subModelField] =
      payload?.modelProperty?.property?.update?.value ?? null;

  //add create value
  payload?.modelProperty?.property?.create
    ? (formattedRequest[submodel].create = {
        relative_item:
          payload?.modelProperty?.property?.create?.relativeProperty,
        ordering: payload?.modelProperty?.property?.create?.ordering,
      })
    : (formattedRequest[submodel].create = null);

  if (formattedRequest[submodel]?.create) {
    formattedRequest[submodel].create[subModelField] =
      payload?.modelProperty?.property?.create?.value;
  }

  //add ordering list value
  if (payload?.modelProperty?.property?.orderingList)
    formattedRequest[submodel].ordering_list =
      payload.modelProperty.property.orderingList;

  //add action item checkbox
  if (payload?.modelProperty?.property?.updateActionItem) {
    formattedRequest[submodel].update_action_item_checked = {
      checked: payload?.modelProperty.property.updateActionItem.checked,
      key: payload?.modelProperty.property.updateActionItem.key,
      id: Number(payload?.modelProperty.property.updateActionItem.propertyId),
      update_checked: true,
      type: "action_items",
    };
  }

  if (payload?.modelProperty?.property?.delete) {
    formattedRequest[submodel].delete = {
      id: payload.modelProperty.property.delete.propertyId,
    };
  }

  return formattedRequest;
};

const getIdsFromTagsDiv = (tags) => {
  //TODO: switch logic
  const tagsWithId = tags
    .map((tag) => (tag?.dataset?.id ? +tag.dataset.id : {}))
    .filter((tag) => tag);
  return tagsWithId;
};

export const formatAPIRequestUpdateTableItemPayload = function (payload, type) {
  let formattedRequest;
  if (type === "title") {
    formattedRequest = {
      name: payload?.title ?? "",
    };
  }

  if (type === "tags") {
    formattedRequest = {
      tags: payload?.tags ?? [],
    };
  }

  if (type === "selectTags") {
    formattedRequest = {
      activities_list: [
        {
          ids: payload.itemIds,
          tags: payload.tags ?? [],
        },
      ],
    };
  }

  if (type === "deleteTableItems") {
    formattedRequest = {
      delete_list: payload.items.map((id) => +id),
    };
  }

  if (type === "duplicateTableItems") {
    formattedRequest = {
      duplicate_list: [{ ids: payload.items.map((id) => +id) }],
    };
  }

  if (type === "intentions")
    formattedRequest = createSubModelPayload(payload, "intentions");

  if (type === "happenings")
    formattedRequest = createSubModelPayload(payload, "happenings");

  if (type === "actionItems")
    formattedRequest = createSubModelPayload(payload, "action_items");

  if (type === "gratefulFor")
    formattedRequest = createSubModelPayload(payload, "grateful_for");

  return formattedRequest;
};

export function moveCursorToTextEnd(textContainer) {
  const selection = document.getSelection();
  selection.selectAllChildren(textContainer);
  selection.collapseToEnd();
}

export function getItemsOrdering(tableItem, inputType, createRelativeProperty) {
  let incrementOrderingIndex = false;
  let createItemOrdering = null;
  const itemsOrdering = tableItem[inputType].map((item, i) => {
    if (createRelativeProperty && item.id === createRelativeProperty) {
      incrementOrderingIndex = true;
      createItemOrdering = i + 2;
      return { id: item.id, ordering: i + 1 };
    }
    return {
      id: item.id,
      ordering: incrementOrderingIndex ? i + 2 : i + 1,
    };
  });

  return { createItemOrdering: createItemOrdering, itemsOrdering };
}

export function setInputUpdateTextContent(
  inputSelectionExists,
  selectionAnchorOffset,
  inputRef,
) {
  if (inputSelectionExists && selectionAnchorOffset > 0)
    inputRef.current.textContent = inputRef.current.textContent
      .slice(0, selectionAnchorOffset)
      .trim();

  if (!inputSelectionExists)
    inputRef.current.textContent = inputRef.current.textContent.trim();

  if (inputSelectionExists && selectionAnchorOffset === 0)
    inputRef.current.textContent = "";
}

export function setCreatePayloadValue(
  inputSelectionExists,
  selectionAnchorOffset,
  textContent,
) {
  if (inputSelectionExists && selectionAnchorOffset > 0)
    return textContent.slice(selectionAnchorOffset).trim();
  if (
    inputSelectionExists &&
    selectionAnchorOffset === 0 &&
    textContent?.length > 0
  )
    return textContent.slice(selectionAnchorOffset).trim();
  return "";
}

export function getConditionalAction(conditional) {
  const createEmptyItemConditional = [
    "Is not",
    "Does not contain",
    "Is empty",
    "Is not empty",
  ];

  const action = createEmptyItemConditional.find(
    (condition) => condition.toLowerCase() === conditional,
  )
    ? "createEmpty"
    : "createFromInput";

  return action;
}

function getPropertyValue(value) {
  if (value.toLowerCase() === "name") return "itemTitle";
  if (value.toLowerCase() === "tags") return "itemTags";
}

export function queryConditionalName(filterDict) {
  let filterMethod;
  if (filterDict.conditional.toLowerCase() === "contains") {
    filterMethod = (property, input, tableItems) =>
      tableItems.filter((items) =>
        items[getPropertyValue(property)].includes(input),
      );
  }

  if (filterDict.conditional.toLowerCase() === "does not contain") {
    filterMethod = (property, input, tableItems) =>
      tableItems.filter(
        (items) => !items[getPropertyValue(property)].includes(input),
      );
  }

  if (filterDict.conditional.toLowerCase() === "is empty") {
    filterMethod = (property, input, tableItems) =>
      tableItems.filter(
        (items) => items[getPropertyValue(property)].length === 0,
      );
  }

  if (filterDict.conditional.toLowerCase() === "is not empty") {
    filterMethod = (property, input, tableItems) =>
      tableItems.filter(
        (items) =>
          items[getPropertyValue(property)] !== null &&
          items[getPropertyValue(property)] !== "" &&
          items[getPropertyValue(property)].length > 0,
      );
  }

  if (filterDict.conditional.toLowerCase() === "is") {
    filterMethod = (property, input, tableItems) =>
      tableItems.filter((items) => items[getPropertyValue(property)] === input);
  }

  if (filterDict.conditional.toLowerCase() === "is not") {
    filterMethod = (property, input, tableItems) =>
      tableItems.filter((items) => items[getPropertyValue(property)] !== input);
  }

  if (filterDict.conditional.toLowerCase() === "starts with") {
    filterMethod = (property, input, tableItems) =>
      tableItems.filter((items) =>
        items[getPropertyValue(property)].startsWith(input),
      );
  }

  if (filterDict.conditional.toLowerCase() === "ends with") {
    filterMethod = (property, input, tableItems) =>
      tableItems.filter((items) =>
        items[getPropertyValue(property)].endsWith(input),
      );
  }

  //bind the property and input search and return the bound method
  return filterMethod.bind(null, filterDict.property, filterDict.text);
}

export function queryConditionalTags(filterDict) {
  function getInputVal(input) {
    return input ? input : [];
  }

  let filterMethod;
  if (filterDict.conditional.toLowerCase() === "contains") {
    filterMethod = (property, input, tableItems) =>
      tableItems.filter((items) =>
        items[getPropertyValue(property)].find((tag) =>
          getInputVal(input).find((filteredTagId) => filteredTagId === tag.id),
        ),
      );
  }

  if (filterDict.conditional.toLowerCase() === "does not contain") {
    filterMethod = (property, input, tableItems) =>
      tableItems.filter(
        (items) =>
          !items[getPropertyValue(property)].find((tag) =>
            getInputVal(input).find(
              (filteredTagId) => filteredTagId === tag.id,
            ),
          ),
      );
  }

  if (filterDict.conditional.toLowerCase() === "is empty") {
    filterMethod = (property, input, tableItems) =>
      tableItems.filter(
        (items) => items[getPropertyValue(property)].length === 0,
      );
  }

  if (filterDict.conditional.toLowerCase() === "is not empty") {
    filterMethod = (property, input, tableItems) =>
      tableItems.filter(
        (items) => items[getPropertyValue(property)].length > 0,
      );
  }

  //bind the property and input search and return the bound method
  return filterMethod.bind(null, filterDict.property, filterDict.tags);
}

export function queryConditional(filterDict) {
  if (filterDict.property.toLowerCase() === "name")
    return queryConditionalName(filterDict);

  if (filterDict.property.toLowerCase() === "tags")
    return queryConditionalTags(filterDict);
}

export function querySort(sortDict) {
  let sortMethod;
  if (sortDict.property.toLowerCase() === "tags") {
    sortMethod = (sortType, tableItems) =>
      tableItems.sort((a, d) => {
        if (sortType.toLowerCase() === "ascending") {
          if (a.itemTags[0] && d.itemTags[0]) {
            if (a.itemTags[0].tag_name < d.itemTags[0].tag_name) return -1;
            else return 1;
          } else return -1;
        }

        if (sortType.toLowerCase() === "descending") {
          if (a.itemTags[0] && d.itemTags[0]) {
            if (a.itemTags[0].tag_name > d.itemTags[0].tag_name) return -1;
            else return 1;
          } else return 1;
        }
      });
  }

  if (sortDict.property.toLowerCase() === "name") {
    sortMethod = (sortType, tableItems) =>
      tableItems.sort((a, d) => {
        return sortType.toLowerCase() === "ascending"
          ? a.itemTitle < d.itemTitle
            ? -1
            : 1
          : a.itemTitle > d.itemTitle
            ? -1
            : 1;
      });
  }

  return sortMethod.bind(this, sortDict.type);
}
