import type { ProductDto } from "~/types/dto/product.dto";
import type { UnitDto } from "~/types/dto/unit.dto";

export const useProductApi = () => {
  const api = useApi()

  const getProducts = async (page: number, limit: number) => {
    return api.getPaged<ProductDto>(`/api/products?page=${page}&limit=${limit}`)
  }

  const createProduct = async (product: ProductDto) => {
    return api.post<ProductDto>('/api/products', product)
  }

  const updateProduct = async (product: ProductDto) => {
    return api.put<ProductDto>(`/api/products/${product.id}`, product)
  }

  const deleteProduct = async (id: number) => {
    return api.delete(`/api/products/${id}`)
  }

  const getProductById = async (id: number) => {
    return api.get<ProductDto>(`/api/products/${id}`)
  }

  const getProductUnits = async (productId: number) => {
    return api.getPaged<UnitDto>(`/api/products/${productId}/units`)
  }

  const addProductUnit = async (productId: number, unitId: number) => {
    return api.post(`/api/products/${productId}/units`, { unitId })
  }

  const removeProductUnit = async (productId: number, unitId: number) => {
    return api.delete(`/api/products/${productId}/units/${unitId}`)
  }

  return {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductUnits,
    addProductUnit,
    removeProductUnit,
  }
}
