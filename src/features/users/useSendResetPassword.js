import { useMutation } from "@tanstack/react-query";
import { sendResetPassword as SendResetPasswordApi } from "../../services/apiUsers";
import { toast } from "react-hot-toast";

export function useSendResetPassword() {
  const { mutate: sendResetPassword, isPending: isLoading } = useMutation({
    mutationFn: SendResetPasswordApi,
    onSuccess: (user) => {
      toast.success("Reset Password Sent, Please fill out the form");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { sendResetPassword, isLoading };
}
