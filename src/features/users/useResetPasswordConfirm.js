import { useMutation } from "@tanstack/react-query";
import { resetPasswordConfirm as ResetPasswordConfirmApi } from "../../services/apiUsers";
import { toast } from "react-hot-toast";

export function useResetPasswordConfirm() {
  const { mutate: resetPasswordConfirm, isPending: isLoading } = useMutation({
    mutationFn: ResetPasswordConfirmApi,
    onSuccess: (user) => {
      toast.success("Password Reset Completed Successfully");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { resetPasswordConfirm, isLoading };
}
