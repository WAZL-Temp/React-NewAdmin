import { useBaseService } from "../sharedBase/baseService";
import { BaseModel } from "../sharedBase/modelInterface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export type UseItemQueryResult<T> = {
  data: T | null;
  id: number | undefined;
  slug: string;
  dataStatus: string;
  loading: boolean;
  status: string;
  error: object | undefined;
  condition: Record<string, unknown> | undefined;
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
):UseItemQueryResult<T> => {
  const queryClient = useQueryClient();

  const [data, setData] = useState<T | null>(null);
  const [id, setId] = useState<number | undefined>(undefined);
  const [slug, setSlug] = useState<string>('');
  const [dataStatus, setDataStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<object | undefined>(undefined);
  const [condition, setCondition] = useState<Record<string, unknown> | undefined>(undefined);

  const getItem = async (id: number): Promise<T> => {
    if (loading) return data as T;

    if (id === id && dataStatus === 'Loaded') {
      return data as T;
    }

    try {
      clearItem();
      resetStatus();
      setLoading(true);
      setDataStatus('Loading');

      const item = await service.get(id) as T;
      setData(item);
      setSlug(item?.slug || '');
      setDataStatus('Loaded');
      setLoading(false);
      return item;
    } catch (error) {
      setError(error as object);
      setLoading(false);
      setDataStatus('error');
      throw error;
    }
  };

  const addItem = useMutation<T, Error, T>({
    mutationFn: async (item: T) => service.add(item) as Promise<T>,
    onSuccess: (data) => {
      setData(data);
      setDataStatus('loaded');
      setLoading(false);
      setError(undefined);
    },
    onError: (error) => {
      setError(error);
      setLoading(false);
    },
  });

  const updateItem = useMutation<T, Error, T>({
    mutationFn: async (item: T) => service.update(item) as Promise<T>,
    onSuccess: (data) => {
      setData(data);
      setDataStatus('loaded');
      setLoading(false);
      setError(undefined);
    },
    onError: (error) => {
      setError(error);
      setLoading(false);
    },
  });

  useQuery({
    queryKey: [`item-${service.type}`],
    queryFn: () => Promise.resolve([]),
    enabled: false,
    staleTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      await service.handleDelete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`item-${service.type}`] });
    },
  });

  const load = async () => {
    queryClient.invalidateQueries({ queryKey: [`item-${service.type}`] });
  };

  const clearItem = () => {
    setData(null);
    setId(undefined);
    setSlug('');
    setDataStatus('');
    setLoading(false);
    setError(undefined);
    setCondition(undefined);
  };

  const resetStatus = () => {
    setStatus('');
  };

  return {
    data: data,
    id,
    slug,
    dataStatus,
    loading,
    status,
    error,
    condition,
    getItem,
    addItem: addItem.mutate,
    updateItem: updateItem.mutate,
    deleteItem: deleteMutation.mutate,
    load,
    clearItem,
    resetStatus,
  };
};
