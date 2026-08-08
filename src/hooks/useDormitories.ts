import { useQuery } from '@tanstack/react-query';
import { authAPI } from '../services/api';
import type { Dormitory } from '../types';

export function useDormitories() {
  return useQuery({
    queryKey: ['dormitories'],
    queryFn: async () => {
      const response = await authAPI.getDormitories();
      return (response.results || response) as Dormitory[];
    },
    staleTime: 60_000,
  });
}

export function useUniversities() {
  return useQuery({
    queryKey: ['universities'],
    queryFn: () => authAPI.getUniversities(),
    staleTime: 5 * 60_000,
  });
}

export function useProvinces() {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: () => authAPI.getProvinces(),
    staleTime: 5 * 60_000,
  });
}
