import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useLanguageStore = () => {
  const queryClient = useQueryClient();

  const { data: selectedLanguage = "en" } = useQuery({
    queryKey: ["selectedLanguage"],
    queryFn: () => localStorage.getItem("app_language") || "en",
    staleTime: Infinity,
  });

  const setLanguageMutation = useMutation({
    mutationFn: async (language: string) => {
      localStorage.setItem("app_language", language);
      return Promise.resolve(language);
    },
    onSuccess: (language) => {
      queryClient.setQueryData(["selectedLanguage"], language);
    },
  });

  const setLanguage = (language: string) => {
    setLanguageMutation.mutate(language);
  };

  return { selectedLanguage, setLanguage };
};
