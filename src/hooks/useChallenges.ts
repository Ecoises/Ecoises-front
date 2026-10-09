import { useQuery } from "@tanstack/react-query";
import { challengeService } from "@/api/services/challengeService";
import { useAuth } from "@/contexts/AuthContext";

/** Retos activos. La clave incluye al usuario porque la respuesta trae su progreso. */
export const useChallenges = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["challenges", user?.id ?? "guest"],
    queryFn: () => challengeService.list(),
    staleTime: 60 * 1000,
  });
};

export const useChallenge = (id?: string | number | null) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["challenge", String(id), user?.id ?? "guest"],
    queryFn: () => challengeService.get(id as string | number),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
};
