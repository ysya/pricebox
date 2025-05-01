import type { Unit } from '~/generated/prisma'
import { useApi } from './useApi'
import type { UnitDto } from '~/types/dto/unit.dto'

export const useUnitApi = () => {
  const api = useApi()

  const getUnits = async (page: number, limit: number) => {
    return api.getPaged<UnitDto>(`/api/units?page=${page}&limit=${limit}`)
  }

  const createUnit = async (data: { name: string; symbol: string }) => {
    return api.post<UnitDto>('/api/units', data)
  }

  const updateUnit = async (id: number, data: { name: string; symbol: string }) => {
    return api.put<UnitDto>(`/api/units/${id}`, data)
  }

  const deleteUnit = async (id: number) => {
    return api.delete(`/api/units/${id}`)
  }

  const createUnitConversion = async (data: { fromUnitId: number | null; toUnitId: number | null; rate: number }) => {
    return api.post('/api/unit_conversion', data)
  }

  return {
    getUnits,
    createUnit,
    updateUnit,
    deleteUnit,
    createUnitConversion
  }
} 