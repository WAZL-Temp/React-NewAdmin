import { useBaseService } from "../sharedBase/baseService";
import { BaseModel } from "../sharedBase/modelInterface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export type UseItemQueryResult<T> = {
  data: T | null;
  id: number | undefined;
  isLoading: boolean;
  error: Error | null;
  getItem: (id: number) => Promise<T>;
  clearItem: () => void;
  addItem: (item: T) => void;
  updateItem: (item: T) => void;
  deleteItem: (id: number) => void;
  resetStatus: () => void;
  load: () => void;
};

export const useItemQuery = <T extends BaseModel>(
  service: ReturnType<typeof useBaseService>
): UseItemQueryResult<T> => {
  const queryClient = useQueryClient();
  const [currentId, setCurrentId] = useState<number | undefined>(undefined);

  const getItem = async (id: number): Promise<T> => {
    const queryKey = [`item-${service.type}`, id];
    const result = await queryClient.fetchQuery({
      queryKey,
      queryFn: () => service.get(id) as Promise<T>,
      staleTime: 1000 * 60 * 5,
    });
    setCurrentId(id);
    return result;
  };

  const {
    data,
    isLoading,
    error,
  } = useQuery<T>({
    queryKey: [`item-${service.type}`, currentId],
    queryFn: () => {
      if (currentId === undefined) throw new Error("ID is undefined");
      return service.get(currentId) as Promise<T>;
    },
    enabled: currentId !== undefined,
    staleTime: 1000 * 60 * 5,
  });

  const addItem = useMutation<T, Error, T>({
    mutationFn: async (item: T) => service.add(item) as Promise<T>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`item-${service.type}`] });
    },
  });

  const updateItem = useMutation<T, Error, T>({
    mutationFn: async (item: T) => service.update(item) as Promise<T>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`item-${service.type}`] });
    },
  });

  const deleteItem = useMutation<void, Error, number>({
    mutationFn: async (id: number) => service.handleDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`item-${service.type}`] });
    },
  });

  const clearItem = () => {
    setCurrentId(undefined);
    queryClient.removeQueries({ queryKey: [`item-${service.type}`] });
  };

  return {
    data: data ?? null,
    id: currentId,
    isLoading,
    error,
    getItem,
    addItem: addItem.mutate,
    updateItem: updateItem.mutate,
    deleteItem: deleteItem.mutate,
    clearItem,
    resetStatus: () => {},
    load: () => queryClient.invalidateQueries({ queryKey: [`item-${service.type}`] }),
  };
};
