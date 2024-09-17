import { useMutation } from "@tanstack/react-query";
import { updateUserInfo as updateUserInfoApi } from "../../services/apiUsers";
import { toast } from "react-hot-toast";

export function useUpdateUserInfo(token) {
  const {
    isPending: isLoading,
    mutate: updateUserInfo,
    error,
  } = useMutation({
    mutationFn: (payload) => updateUserInfoApi(token?.token, payload),
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { updateUserInfo, isLoading, error };
}
