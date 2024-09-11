import { useMutation } from "@tanstack/react-query";
import { createUser as CreateUserApi } from "../../services/apiUsers";
import { toast } from "react-hot-toast";

export function useCreateUser() {
  const { mutate: createUser, isPending: isCreating } = useMutation({
    mutationFn: CreateUserApi,
    onSuccess: (user) => {
      toast.success(`Account created successfully`);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { createUser, isCreating };
}
