import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../ProtectedRoute";
import { toast } from "react-hot-toast";
import { updateTag as updateTagApi } from "../../services/apiTableItems";

export function useUpdateTags() {
  const { token } = useContext(AuthContext);
  const {
    isPending: isLoading,
    mutate: updateTag,
    error,
  } = useMutation({
    mutationFn: (payload) => updateTagApi(token.token, payload),
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { updateTag, isLoading, error };
}
