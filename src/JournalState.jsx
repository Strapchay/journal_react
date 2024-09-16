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
  journalsLoaded: false,
  journalTablesLoaded: false,
};

export function journalReducer(state, action) {
  switch (action.type) {
    case "updateState":
      return { ...state, ...action.payload };
    case "updateJournalInfo":
      return { ...state, ...action.payload };
    case "createTableItem": {
      const currentTableIndex = state.tables.findIndex(
        (table) => table.id === state.currentTable,
      );
      const payloadExist = state.tables[currentTableIndex].tableItems.find(
        (item) => item.id === action.payload[0].id,
      );
      if (!payloadExist)
        state.tables[currentTableIndex].tableItems.push(...action.payload);

      return { ...state };
    }
    default:
      throw new Error("Unknown action");
  }
}

function createTableItem(state, tableItem) {
  console.log("about creating table item", tableItem);
}
