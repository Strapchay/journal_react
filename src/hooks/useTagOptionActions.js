import { useContext } from "react";
import { AuthContext } from "../ProtectedRoute";
import { OverlayContext } from "../ComponentOverlay";
import { useState } from "react";
import { useRef } from "react";
import { useCreateTags } from "../features/tags/useCreateTags";
import { useUpdateTableItem } from "../features/journals/useUpdateTableItem";
import {
  formatAPIResp,
  getCurrentTable,
  getTableItemWithMaxTags,
} from "../utils/helpers";
import { useEffect } from "react";

export function useTagOptionActions({
  itemIds,
  itemTags,
  disableInput,
  onFilterComplete,
  onTagsFilter,
}) {
  const { journalState, dispatch } = useContext(AuthContext);
  const { addExtraAction } = useContext(OverlayContext);
  const [searchTagValue, setSearchTagValue] = useState("");
  const searchTagRef = useRef(null);
  const randomColorRef = useRef("");
  const { createTag } = useCreateTags();
  const isMultipleItemIds = itemIds?.length > 1;
  const { updateTableItem } = useUpdateTableItem(
    null,
    isMultipleItemIds,
    itemIds,
  );
  const tagsValue = isMultipleItemIds
    ? getTableItemWithMaxTags(getCurrentTable(journalState), itemIds)?.itemTags
    : itemTags;
  const tagIds = tagsValue?.length ? tagsValue.map((v) => v.id) : [];
  const [selectedTagIds, setSelectedTagIds] = useState(tagIds);
  const selectedTagsToRender = selectedTagIds
    .map((id) => journalState.tags.find((modelTag) => modelTag.id === id))
    .filter((tag) => tag);
  const tagsExist = selectedTagsToRender?.length;
  const renderedTags = searchTagValue.length
    ? journalState?.tags?.filter((tag) =>
        tag.text.toLowerCase().includes(searchTagValue),
      )
    : journalState?.tags;

  useEffect(() => {
    function handleSelectedTagsSaveToTableItem() {
      const payload = {
        payload: {
          tags: selectedTagIds,
        },
      };
      if (isMultipleItemIds) {
        payload.payload.itemIds = itemIds;
        payload.type = "selectTags";
      }
      if (!isMultipleItemIds) {
        payload.payload.itemId = itemIds[0];
        payload.type = "tags";
      }

      updateTableItem(payload);
    }

    if (!disableInput) addExtraAction(handleSelectedTagsSaveToTableItem);
    if (disableInput) addExtraAction(onFilterComplete);
  }, [
    dispatch,
    disableInput,
    addExtraAction,
    isMultipleItemIds,
    itemIds,
    selectedTagIds,
    updateTableItem,
    selectedTagsToRender,
    onFilterComplete,
  ]);

  function onSelectTag(tagId) {
    const tagAlreadySelected = selectedTagIds.find((tId) => tId === tagId);
    if (!tagAlreadySelected && !disableInput)
      setSelectedTagIds((tagIds) => [...tagIds, tagId]);

    if (disableInput) onTagsFilter(tagId);
  }

  function onRemoveTag(tagId) {
    setSelectedTagIds((tagIds) => [...tagIds.filter((tId) => tId !== tagId)]);
  }

  function handleCreateTag() {
    searchTagRef.current.value = "";
    const tagColor = journalState.tagsColor.find(
      (color) => color.color_value === randomColorRef.current,
    );
    const payload = {
      tag_name: searchTagValue,
      tag_color: tagColor.color,
      tag_class: tagColor.color_value,
    };
    createTag(payload, {
      onSuccess: (data) => {
        const res = formatAPIResp(data, "apiTags");
        setSearchTagValue("");
        dispatch({ type: "createTag", payload: res });
        setSelectedTagIds((v) => [...v, res.id]);
      },
    });
  }

  function handleSetOrCreateTagValue(e) {
    if (e.key === "Enter") {
      if (!renderedTags?.length) {
        handleCreateTag();
      }
    } else if (e.key === "Backspace" && !searchTagValue.length) {
      setSelectedTagIds((ids) => [...ids.slice(0, ids.length - 1)]);
    } else setSearchTagValue((v) => e.target.value);
  }

  return {
    handleSetOrCreateTagValue,
    handleCreateTag,
    onRemoveTag,
    onSelectTag,
    isMultipleItemIds,
    tagsExist,
    selectedTagsToRender,
    searchTagRef,
    searchTagValue,
    randomColorRef,
    renderedTags,
  };
}
