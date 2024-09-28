import { API } from "../utils/api";
import { makeAPIRequest } from "../utils/helpers";

export async function createJournal(user, removeToken) {
  return makeAPIRequest(
    API.APIEnum.USER.CREATE,
    user,
    "create",
    null,
    "POST",
    removeToken,
  );
}

export async function updateJournal(token, journalId, payload, removeToken) {
  return makeAPIRequest(
    API.APIEnum.JOURNAL.PATCH(journalId),
    payload,
    "updateJournal",
    token,
    "PATCH",
    removeToken,
  );
}

export async function getJournalList(token, removeToken) {
  return makeAPIRequest(
    API.APIEnum.JOURNAL.LIST,
    null,
    "getJournal",
    token,
    "GET",
    removeToken,
  );
}

export async function getJournalTables(token, removeToken) {
  return makeAPIRequest(
    API.APIEnum.JOURNAL_TABLES.LIST,
    null,
    "getActiveTable",
    token,
    "GET",
    removeToken,
  );
}

export function createTable(token, payload, removeToken) {
  return makeAPIRequest(
    API.APIEnum.JOURNAL_TABLES.CREATE,
    payload,
    "createNewTable",
    token,
    "POST",
    removeToken,
  );
}

export function renameTable(token, payload, removeToken) {
  return makeAPIRequest(
    API.APIEnum.JOURNAL_TABLES.PATCH(payload.journal),
    payload,
    "updateTableName",
    token,
    "PATCH",
    removeToken,
  );
}

export function duplicateTable(token, payload, removeToken) {
  return makeAPIRequest(
    API.APIEnum.JOURNAL_TABLES.CREATE,
    payload,
    "duplicateTable",
    token,
    "POST",
    removeToken,
  );
}

export function deleteTable(token, tableId, removeToken) {
  return makeAPIRequest(
    API.APIEnum.JOURNAL_TABLES.DELETE(tableId),
    null,
    "deleteTable",
    token,
    "DELETE",
    removeToken,
  );
}

export async function updateJournalInfo(
  token,
  payload,
  journalsId,
  removeToken,
) {
  return makeAPIRequest(
    API.APIEnum.JOURNAL.PATCH(journalsId),
    payload,
    "updateJournalInfo",
    token,
    "PATCH",
    removeToken,
  );
}

export function createTableItem(token, payload, removeToken) {
  return makeAPIRequest(
    API.APIEnum.ACTIVITIES.CREATE,
    payload,
    "createTableItem",
    token,
    "POST",
    removeToken,
  );
}

export async function updateTableItem(
  token,
  payload,
  itemId,
  removeToken,
  payloadType,
) {
  return makeAPIRequest(
    payloadType === "selectTags"
      ? API.APIEnum.ACTIVITIES.BATCH_UPDATE_ACTIVITIES
      : API.APIEnum.ACTIVITIES.PATCH(itemId),
    payload,
    "updateTableItem",
    token,
    "PATCH",
    removeToken,
  );
}

export function deleteTableItems(token, payload, removeToken, type, typeId) {
  const url = type
    ? API.APIEnum.SUBMODEL.DELETE(type, typeId)
    : payload.delete_list.length > 1
      ? API.getBatchEndpoint("deleteTableItems")
      : API.APIEnum.ACTIVITIES.DELETE(payload.delete_list[0]);

  return makeAPIRequest(
    url,
    type || payload.delete_list.length > 1 ? payload : null,
    "deleteTableItem",
    token,
    "DELETE",
    removeToken,
  );
}

export function duplicateTableItems(token, payload, removeToken) {
  return makeAPIRequest(
    API.APIEnum.ACTIVITIES.BATCH_DUPLICATE_ACTIVITIES,
    payload,
    "duplicateTableItems",
    token,
    "POST",
    removeToken,
  );
}
