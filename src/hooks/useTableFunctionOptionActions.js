import { useContext } from "react";
import {
  FILTER_FUNC_DEFAULTS,
  PREPOSITIONS,
  SORT_FUNC_DEFAULTS,
  TABLE_SORT_TYPE,
} from "../utils/constants";
import { AuthContext } from "../ProtectedRoute";
import { useState } from "react";

export function useTableFunctionOptionActions({
  onSubmit,
  componentName,
  properties,
  setSelectedComponentState,
  switchSortProp,
}) {
  const { currentTableFunc, dispatch } = useContext(AuthContext);
  const placeholder = componentName[0].toUpperCase() + componentName.slice(1);
  const [searchText, setSearchText] = useState("");
  const renderedProperties = properties.filter((property) =>
    property.text.toLowerCase().includes(searchText?.toLowerCase()),
  );
  const namePrepositions = PREPOSITIONS.filter((pre) => pre.name);
  const tagPrepositions = PREPOSITIONS.filter((pre) => pre.tags);

  function onSelectProperty(property) {
    if (setSelectedComponentState)
      setSelectedComponentState((v) => ({
        componentName,
        property,
      }));
    if (
      componentName.toLowerCase() === "filter" &&
      !currentTableFunc?.filter?.active
    )
      dispatch({
        type: "updateTableFunc",
        payload: {
          filter: {
            ...FILTER_FUNC_DEFAULTS,
            conditional:
              property.toLowerCase() === "name"
                ? namePrepositions[0].condition
                : property.toLowerCase() === "tags"
                  ? tagPrepositions[0].condition
                  : null,
            active: true,
            // tags: [],
            property: property.toLowerCase(),
            component: componentName.toLowerCase(),
          },
        },
      });
    if (
      componentName.toLowerCase() === "sort" &&
      !currentTableFunc?.sort?.active
    )
      dispatch({
        type: "updateTableFunc",
        payload: {
          sort: {
            ...SORT_FUNC_DEFAULTS,
            active: true,
            type: TABLE_SORT_TYPE[0].text,
            property: property.toLowerCase(),
            component: componentName.toLowerCase(),
          },
        },
      });

    if (switchSortProp && currentTableFunc?.sort?.active) {
      dispatch({
        type: "updateTableFunc",
        payload: {
          sort: { ...currentTableFunc.sort, property: property.toLowerCase() },
        },
      });
      onSubmit?.();
    }
  }

  return {
    onSelectProperty,
    searchText,
    setSearchText,
    placeholder,
    renderedProperties,
  };
}
