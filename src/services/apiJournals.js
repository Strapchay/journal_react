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
