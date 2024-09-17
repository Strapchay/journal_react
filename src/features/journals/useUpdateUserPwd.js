import { useMutation } from "@tanstack/react-query";
import { updateUserPwd as updateUserPwdApi } from "../../services/apiUsers";
import { toast } from "react-hot-toast";

export function useUpdatePwd(token) {
  const {
    isPending: isLoading,
    mutate: updateUserPwd,
    error,
  } = useMutation({
    mutationFn: (payload) => updateUserPwdApi(token?.token, payload),
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { updateUserPwd, isLoading, error };
}
