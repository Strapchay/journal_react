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
  persistTableFunc: false,
  // overlayCount: 0,
};

export function journalReducer(state, action) {
  switch (action.type) {
    case "createTable":
      return { ...state, tables: [...state.tables, action.payload] };
    case "updateTableName": {
      const currentTableIndex = state.tables.findIndex(
        (table) => table.id === state.currentTable,
      );
      state.tables[currentTableIndex] = {
        ...state.tables[currentTableIndex],
        tableTitle: action.payload,
      };
      return { ...state };
    }
    case "deleteTable": {
      //TODO: make sure to add checks from deleting last table
      state.tables = [
        ...state.tables.filter((table) => table.id !== action.payload),
      ];
      state.currentTable = state.tables[0].id;
      return { ...state };
    }
    case "updateState":
      if (!state.journalsLoaded || !state.journalTablesLoaded) {
        return { ...state, ...action.payload };
      }
      return state;
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
    case "updateTableItemTags": {
      const currentTableIndex = state.tables.findIndex(
        (table) => table.id === state.currentTable,
      );

      const itemIndex = state.tables[currentTableIndex].tableItems.findIndex(
        (item) => item.id === action.payload.id,
      );

      state.tables[currentTableIndex].tableItems[itemIndex] = {
        ...state.tables[currentTableIndex].tableItems[itemIndex],
        itemTags: [...action.payload.tags],
      };
      return { ...state };
    }
    case "updateMultipleTableItemTags": {
      const currentTableIndex = state.tables.findIndex(
        (table) => table.id === state.currentTable,
      );
      action.payload.ids.forEach((id) => {
        const itemIndex = state.tables[currentTableIndex].tableItems.findIndex(
          (item) => item.id === id,
        );

        state.tables[currentTableIndex].tableItems[itemIndex] = {
          ...state.tables[currentTableIndex].tableItems[itemIndex],
          itemTags: [...action.payload.tags],
        };
      });
      return { ...state };
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
    case "deleteTableItemType": {
      const currentTable = state.tables.find(
        (table) => table.id === state.currentTable,
      );
      const tableItemIndex = currentTable.tableItems.findIndex(
        (item) => action.payload.id === item.id,
      );
      const modTableItem = { ...currentTable.tableItems[tableItemIndex] };

      modTableItem[action.payload.type.type] = [
        ...modTableItem[action.payload.type.type].filter(
          (type) => type.id !== action.payload.type.id,
        ),
      ];
      currentTable.tableItems[tableItemIndex] = { ...modTableItem };
      return { ...state };
    }
    case "createTag": {
      return { ...state, tags: [...state.tags, action.payload] };
    }
    case "updateTag": {
      const tagIndex = state.tags.findIndex(
        (tag) => tag.id === action.payload.id,
      );
      const modTags = [...state.tags];
      modTags.splice(tagIndex, 1, action.payload);
      return { ...state, tags: [...modTags] };
    }
    case "deleteTag": {
      return {
        ...state,
        tags: [...state.tags.filter((tag) => tag.id !== action.payload)],
      };
    }
    case "updateTableFunc": {
      const currentTableFunc = state.tableFunc[state.currentTable];
      if (currentTableFunc) {
        return {
          ...state,
          tableFunc: {
            ...state.tableFunc,
            [state.currentTable]: {
              ...currentTableFunc,
              ...action.payload,
            },
          },
        };
      } else
        return {
          ...state,
          tableFunc: {
            ...state.tableFunc,
            [state.currentTable]: {
              ...action.payload,
            },
          },
        };
    }

    case "updateSidebarClosed":
      return { ...state, sideBarClosed: !state.sideBarClosed };
    case "updatePersistFunc":
      return { ...state, persistTableFunc: action.payload ?? false };

    default:
      throw new Error("Unknown action");
  }
}
