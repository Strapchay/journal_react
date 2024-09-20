import { makeAPIRequest } from "../utils/helpers";
import { API } from "../utils/api";

export function createTag(token, payload) {
  return makeAPIRequest(
    API.APIEnum.TAG.CREATE,
    payload,
    "createTag",
    token,
    "POST",
  );
}

export function updateTag(token, payload) {
  return makeAPIRequest(
    API.APIEnum.TAG.PATCH(payload.id),
    payload,
    "updateTag",
    token,
    "PATCH",
  );
}

export function deleteTag(token, id) {
  return makeAPIRequest(
    API.APIEnum.TAG.DELETE(id),
    null,
    "deleteTag",
    token,
    "DELETE",
  );
}
