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
  tags: [],
  tagsColor: TAGS_COLORS.colors,
  journalsLoaded: false,
  journalTablesLoaded: false,
  tableItemInputActive: null,
  sideBarClosed: false,
};

export function journalReducer(state, action) {
  switch (action.type) {
    case "createTable":
      return { ...state, tables: [...state.tables, action.payload] };
    case "updateState":
      return { ...state, ...action.payload };
    case "updateCurrentTable":
      return { ...state, currentTable: action.payload };
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
    case "createRelativeTableItem": {
      const currentTableIndex = state.tables.findIndex(
        (table) => table.id === state.currentTable,
      );
      const relativeTableItemIndex = state.tables[
        currentTableIndex
      ].tableItems.findIndex((item) => item.id === action.relativeItem);
      if (relativeTableItemIndex > -1) {
        const itemIsDuplicate = state.tables[currentTableIndex].tableItems.find(
          (item) => item.id === action.payload[0].id,
        );
        if (!itemIsDuplicate)
          state.tables[currentTableIndex].tableItems.splice(
            relativeTableItemIndex + 1,
            0,
            ...action.payload,
          );
      }

      return { ...state, tableItemInputActive: action.tableItemInputActive };
    }
    case "updateTableItem": {
      const currentTableIndex = state.tables.findIndex(
        (table) => table.id === state.currentTable,
      );

      const itemIndex = state.tables[currentTableIndex].tableItems.findIndex(
        (item) => item.id === action.payload[0].id,
      );
      if (itemIndex > -1) {
        state.tables[currentTableIndex].tableItems.splice(
          itemIndex,
          1,
          ...action.payload,
        );
      }

      return { ...state, tableItemInputActive: null };
    }
    case "deleteTableItems": {
      const currentTableIndex = state.tables.findIndex(
        (table) => table.id === state.currentTable,
      );
      const filteredValues = [
        ...state.tables[currentTableIndex].tableItems.filter(
          (item) => action.payload.some((i) => +i === item.id) === false,
        ),
      ];
      state.tables[currentTableIndex].tableItems = [...filteredValues];

      return { ...state };
    }
    case "duplicateTableItems": {
      const currentTableIndex = state.tables.findIndex(
        (table) => table.id === state.currentTable,
      );
      const payloadIds = action.payload.map((i) => i.id);
      const tableItems = state.tables[currentTableIndex].tableItems;
      if (!tableItems.some((item) => item.id === payloadIds[0]))
        state.tables[currentTableIndex].tableItems = [
          ...state.tables[currentTableIndex].tableItems,
          ...action.payload,
        ];

      return { ...state };
    }
    case "updateSidebarClosed":
      return { ...state, sideBarClosed: !state.sideBarClosed };
    default:
      throw new Error("Unknown action");
  }
}
