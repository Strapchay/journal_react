import { useContext } from "react";
import { AuthContext } from "../ProtectedRoute";
import { useState } from "react";
import { useUpdateTags } from "../features/tags/useUpdateTags";
import { useDeleteTags } from "../features/tags/useDeleteTags";
import { formatAPIRequestTagPayload } from "../utils/helpers";

export function useTagEditActions({ tag, onSubmit }) {
  const { journalState, dispatch } = useContext(AuthContext);
  const [tagName, setTagName] = useState(tag.text);
  const tagsColor = journalState.tagsColor;
  const { updateTag } = useUpdateTags();
  const { deleteTags } = useDeleteTags();

  function handleTagNameUpdate(e) {
    if (e.key === "Enter") {
      const tagToUpdate = { ...tag };
      tagToUpdate.text = tagName;
      const updateObj = formatAPIRequestTagPayload(
        { tag: tagToUpdate },
        "tagsValue",
      );
      updateTag(updateObj, {
        onSuccess: (data) => {
          onSubmit?.();
          dispatch({ type: "updateTag", payload: tagToUpdate });
        },
      });
    } else setTagName((t) => e.target.value);
  }

  function handleTagDelete() {
    deleteTags(tag.id, {
      onSuccess: () => {
        dispatch({ type: "deleteTag", payload: tag.id });
      },
    });
  }

  function handleColorSelect(colorValue) {
    const tagToUpdate = { ...tag };
    tagToUpdate.color = colorValue;
    const updateObj = formatAPIRequestTagPayload(
      { tag: tagToUpdate },
      "tagsValue",
    );
    updateTag(updateObj, {
      onSuccess: (data) => {
        dispatch({ type: "updateTag", payload: tagToUpdate });
      },
    });
  }
  return { handleTagDelete, handleColorSelect, handleTagNameUpdate, tagsColor };
}
