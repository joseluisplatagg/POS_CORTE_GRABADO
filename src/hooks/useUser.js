import { useQuery } from "@tanstack/react-query";

export default function useUser(){
    return useQuery({
        queryKey:['current-user'],
        queryFn:fetchUser,
        staleTime: 1000 * 60 * 5
    });
}