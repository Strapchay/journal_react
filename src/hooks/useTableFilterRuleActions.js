import { useContext } from "react";
import { useEffect } from "react";
import { OverlayContext } from "../ComponentOverlay";
import { AuthContext } from "../ProtectedRoute";
import { useRef } from "react";
import { PREPOSITIONS } from "../utils/constants";

export function useTableFilterRuleActions({ property }) {
  const { currentTableFunc, dispatch, journalState, activateTableFuncPersist } =
    useContext(AuthContext);
  const { addExtraAction } = useContext(OverlayContext);
  const optionRef = useRef(null);
  const prepositionRef = useRef(null);
  const selectedTagFiltersToRender = currentTableFunc?.filter?.tags
    ?.map((id) => journalState.tags.find((modelTag) => modelTag.id === id))
    .filter((tag) => tag);
  const tagFiltersExist = selectedTagFiltersToRender?.length;
  const propertyName = property?.[0].toUpperCase() + property?.slice(1);
  const prepositions = PREPOSITIONS.filter(
    (preposition) => preposition[property.toLowerCase()] === true,
  );
  const removeFilterInputOption = ["is empty", "is not empty"];
  const removeFilterInput = removeFilterInputOption.includes(
    currentTableFunc?.filter?.conditional?.toLowerCase(),
  );

  useEffect(() => {
    addExtraAction(activateTableFuncPersist);
  }, [activateTableFuncPersist, addExtraAction]);

  function handleFilterText(e) {
    dispatch({
      type: "updateTableFunc",
      payload: {
        filter: { ...currentTableFunc.filter, text: e.target.value },
      },
    });
  }

  function onRemoveTag(tagId) {
    dispatch({
      type: "updateTableFunc",
      payload: {
        filter: {
          ...currentTableFunc.filter,
          tags: [...currentTableFunc.filter.tags.filter((id) => id !== tagId)],
        },
      },
    });
  }

  function onTagsFilter(tagId) {
    const tagAlreadySelected = currentTableFunc?.filter?.tags?.find(
      (tId) => tId === tagId,
    );
    if (!tagAlreadySelected) {
      dispatch({
        type: "updateTableFunc",
        payload: {
          filter: {
            ...currentTableFunc.filter,
            tags: [...currentTableFunc.filter.tags, tagId],
          },
        },
      });
    }
  }

  return {
    onTagsFilter,
    onRemoveTag,
    handleFilterText,
    propertyName,
    prepositionRef,
    prepositions,
    optionRef,
    currentTableFunc,
    removeFilterInput,
    tagFiltersExist,
    selectedTagFiltersToRender,
  };
}
