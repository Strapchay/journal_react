import { API } from "../utils/api";
import { makeAPIRequest } from "../utils/helpers";

export async function createJournal(user) {
  return makeAPIRequest(API.APIEnum.USER.CREATE, user, "create", null, "POST");
}

export async function getJournalList(token) {
  return makeAPIRequest(
    API.APIEnum.JOURNAL.LIST,
    null,
    "getJournal",
    token,
    "GET",
  );
}

export async function getJournalTables(token) {
  return makeAPIRequest(
    API.APIEnum.JOURNAL_TABLES.LIST,
    null,
    "getActiveTable",
    token,
    "GET",
  );
}

export function createTable(token, payload) {
  return makeAPIRequest(
    API.APIEnum.JOURNAL_TABLES.CREATE,
    payload,
    "createNewTable",
    token,
    "POST",
  );
}

export function renameTable(token, payload) {
  return makeAPIRequest(
    API.APIEnum.JOURNAL_TABLES.PATCH(payload.journal),
    payload,
    "updateTableName",
    token,
    "PATCH",
  );
}

export function duplicateTable(token, payload) {
  return makeAPIRequest(
    API.APIEnum.JOURNAL_TABLES.CREATE,
    payload,
    "duplicateTable",
    token,
    "POST",
  );
}

export function deleteTable(token, tableId) {
  return makeAPIRequest(
    API.APIEnum.JOURNAL_TABLES.DELETE(tableId),
    null,
    "deleteTable",
    token,
    "DELETE",
  );
}

export async function updateJournalInfo(token, payload, journalsId) {
  return makeAPIRequest(
    API.APIEnum.JOURNAL.PATCH(journalsId),
    payload,
    "updateJournalInfo",
    token,
    "PATCH",
  );
}

export function createTableItem(token, payload) {
  return makeAPIRequest(
    API.APIEnum.ACTIVITIES.CREATE,
    payload,
    "createTableItem",
    token,
    "POST",
  );
}

export async function updateTableItem(token, payload, itemId) {
  return makeAPIRequest(
    API.APIEnum.ACTIVITIES.PATCH(itemId),
    payload,
    "updateTableItem",
    token,
    "PATCH",
  );
}

export function deleteTableItems(token, payload) {
  return makeAPIRequest(
    payload.delete_list.length > 1
      ? API.getBatchEndpoint("deleteTableItems")
      : API.APIEnum.ACTIVITIES.DELETE(payload.delete_list[0]),
    payload.delete_list.length > 1 ? payload : null,
    "deleteTableItem",
    token,
    "DELETE",
  );
}

export function duplicateTableItems(token, payload) {
  return makeAPIRequest(
    API.APIEnum.ACTIVITIES.BATCH_DUPLICATE_ACTIVITIES,
    payload,
    "duplicateTableItems",
    token,
    "POST",
  );
}
