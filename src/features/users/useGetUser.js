import { useQuery } from "@tanstack/react-query";
import { getUserInfo as getUserInfoApi } from "../../services/apiUsers";

export function useGetUser(token, removeToken) {
  const {
    isPending: isLoading,
    data: user,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserInfoApi(token?.token, removeToken),
    staleTime: Infinity,
    refetchOnMount: false,
  });
  return { user, isLoading, error };
}
