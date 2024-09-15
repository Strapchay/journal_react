import {
  DEFAULT_JOURNAL_DESC,
  TABLE_TAGS,
  TAGS_COLORS,
} from "./utils/constants";

export const initialState = {
  name: "",
  description: "", //DEFAULT_JOURNAL_DESC,
  tables: [],
  tableHeads: [],
  tags: TABLE_TAGS.tags,
  tagsColor: TAGS_COLORS.colors,
};

export function journalReducer(state, action) {
  switch (action.type) {
    case "updateState":
      return { ...state, ...action.payload };
    case "updateJournalInfo":
      return { ...state, ...action.payload };
    default:
      throw new Error("Unknown action");
  }
}
