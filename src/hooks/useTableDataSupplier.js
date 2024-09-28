import { queryConditional, querySort } from "../utils/helpers";

export function useTableDataSupllier({
  searchTableItemText,
  currentTable,
  journalState,
}) {
  const searchItemExists = searchTableItemText.length;
  const currentTableId = journalState?.currentTable;
  const tableFunc = journalState?.tableFunc;
  let filterMethod = null;
  let sortMethod = null;
  let results = currentTable?.tableItems;
  const currentTableFunc = tableFunc?.[currentTableId] ?? null;

  if (searchItemExists)
    results = results.filter((tableItem) =>
      tableItem.itemTitle.includes(searchTableItemText),
    );

  if (currentTableFunc?.filter?.active && currentTableFunc.filter.conditional) {
    filterMethod = queryConditional(currentTableFunc.filter);
    results = filterMethod?.(results);
  }
  if (currentTableFunc?.sort?.active && currentTableFunc.sort.type) {
    sortMethod = querySort(currentTableFunc.sort);
    results = sortMethod?.(results);
  }
  return { currentTableItems: results, currentTableFunc };
}
