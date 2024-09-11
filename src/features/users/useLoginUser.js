import { useMutation } from "@tanstack/react-query";
import { loginUser as LoginUserApi } from "../../services/apiUsers";
import { toast } from "react-hot-toast";

export function useLoginUser() {
  const { mutate: loginUser, isPending: isLoading } = useMutation({
    mutationFn: LoginUserApi,
    onSuccess: (user) => {},
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { loginUser, isLoading };
}
