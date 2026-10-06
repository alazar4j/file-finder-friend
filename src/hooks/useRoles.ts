import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";

export function useRoles() {
  const { user, loading } = useSession();
  const q = useQuery({
    queryKey: ["my-roles", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", user!.id);
      if (error) throw error;
      return data.map((r) => r.role as string);
    },
  });
  const roles = q.data ?? [];
  const isAdmin = roles.includes("admin");
  return {
    user,
    loading: loading || (!!user && q.isLoading),
    isAdmin,
    canPost: isAdmin || roles.includes("poster"),
  };
}
