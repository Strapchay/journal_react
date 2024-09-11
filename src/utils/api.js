export class API {
  static APIEnum = {
    USER: {
      CREATE: "user/create/",
      GET: "user/me/",
      PUT: "user/me/",
      PATCH: "user/me/",
      TOKEN: "user/token/",
      UPDATE_INFO: "user/update_info/",
      UPDATE_PWD: "user/change_password/",
      RESET_PWD: "user/password-reset/",
      RESET_PWD_CONFIRM: "user/password-reset-confirm/",
    },

    JOURNAL: {
      CREATE: "journal/journals/",
      LIST: "journal/journals/",
      // BATCH_CREATE: "todo/todos/batch_create/",
      GET: (journalId) => `journal/journals/${journalId}/`,
      PUT: (journalId) => `journal/journals/${journalId}/`,
      PATCH: (journalId) => `journal/journals/${journalId}/`,
      // BATCH_UPDATE_ORDERING: "todo/todos/batch_update_ordering/",
      // BATCH_UPDATE: "todo/todos/batch_update/",
      DELETE: (journalId) => `journal/journals/${journalId}/`,
      // BATCH_DELETE: "todo/todos/batch_delete",
    },

    JOURNAL_TABLES: {
      CREATE: "journal/journal-tables/",
      LIST: "journal/journal-tables/",
      // BATCH_CREATE: "todo/todos/batch_create/",
      GET: (tableId) => `journal/journal-tables/${tableId}/`,
      PUT: (tableId) => `journal/journal-tables/${tableId}/`,
      PATCH: (tableId) => `journal/journal-tables/${tableId}/`,
      // BATCH_UPDATE_ORDERING: "todo/todos/batch_update_ordering/",
      // BATCH_UPDATE: "todo/todos/batch_update/",
      DELETE: (tableId) => `journal/journal-tables/${tableId}/`,
    },

    TAG: {
      CREATE: "journal/tags/",
      CREATED: "journal/kljdaslkfjdl",
      LIST: "journal/tags/",
      BATCH_TAG: "journal/tags/batch_tag_processor/",
      // BATCH_CREATE: "todo/todos/batch_create/",
      GET: (tagId) => `journal/tags/${tagId}/`,
      PUT: (tagId) => `journal/tags/${tagId}/`,
      PATCH: (tagId) => `journal/tags/${tagId}/`,
      PATCHED: "journal/tags/lkdjiovjafdadf/",
      // BATCH_UPDATE_ORDERING: "todo/todos/batch_update_ordering/",
      // BATCH_UPDATE: "todo/todos/batch_update/",
      DELETE: (tagId) => `journal/tags/${tagId}/`,
      DELETED: "journal/tags/kldsjflkasdjfdfs/",
    },

    ACTIVITIES: {
      CREATE: "journal/activities/",
      LIST: "journal/activities/",
      // BATCH_CREATE: "todo/todos/batch_create/",
      GET: (activityId) => `journal/activities/${activityId}/`,
      PUT: (activityId) => `journal/activities/${activityId}/`,
      PATCH: (activityId) => `journal/activities/${activityId}/`,
      PATCHED: "journal/activities/kdjfalsdfasddf/",
      BATCH_UPDATE_ACTIVITIES: "journal/activities/batch_update_activities/",
      BATCH_DELETE_ACTIVITIES: "journal/activities/batch_delete_activities/",
      BATCH_DUPLICATE_ACTIVITIES:
        "journal/activities/batch_duplicate_activities/",
      DELETE: (activityId) => `journal/activities/${activityId}/`,
    },

    SUBMODEL: {
      CREATE: (subModel, subModelId) => `journal/${subModel}/`,
      LIST: (subModel, subModelId) => `journal/${subModel}/`,
      GET: (subModel, subModelId) => `journal/${subModel}/${subModelId}/`,
      PUT: (subModel, subModelId) => `journal/${subModel}/${subModelId}/`,
      PATCH: (subModel, subModelId) => `journal/${subModel}/${subModelId}/`,
      DELETE: (subModel, subModelId) => `journal/${subModel}/${subModelId}/`,
      DELETED: "journal/djfldsjflakdfsdfd/dsfkasdfjdsfdsfdf/",
    },
  };

  static getSubmodelEndpoint(subModel, method, subModelId = undefined) {
    return API.APIEnum.SUBMODEL[method](subModel, subModelId);
  }

  static getBatchEndpoint(type) {
    if (type === "selectTags")
      return API.APIEnum.ACTIVITIES.BATCH_UPDATE_ACTIVITIES;

    if (type === "deleteTableItems")
      return API.APIEnum.ACTIVITIES.BATCH_DELETE_ACTIVITIES;
  }
}
