import axios from 'axios';
import type { Product, ProductsResponse } from '../types';

const API_BASE_URL = 'https://dummyjson.com';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const api = {
  // Get all products with pagination and optional sorting
  getProducts: async (skip = 0, limit = 30, sortBy?: 'name' | 'price' | '', order?: 'asc' | 'desc'): Promise<ProductsResponse> => {
    try {
      // Map frontend sort key to API field
      let sortParams = '';
      if (sortBy) {
        const apiSortBy = sortBy === 'name' ? 'title' : sortBy; // 'name' -> 'title'
        sortParams = `&sortBy=${encodeURIComponent(apiSortBy)}${order ? `&order=${encodeURIComponent(order)}` : ''}`;
      }

      const response = await apiClient.get<ProductsResponse>(
        `/products?skip=${skip}&limit=${limit}${sortParams}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.response?.data?.message || error.message || 'Failed to fetch products',
          error.response?.status
        );
      }
      throw new ApiError('Network error: Unknown error occurred');
    }
  },

  // Get a single product by ID
  getProduct: async (id: number): Promise<Product> => {
    try {
      const response = await apiClient.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.response?.data?.message || error.message || 'Failed to fetch product',
          error.response?.status
        );
      }
      throw new ApiError('Network error: Unknown error occurred');
    }
  },

  // Search products (supports pagination & optional sorting via limit, skip, sortBy & order)
  searchProducts: async (query: string, limit = 30, skip = 0, sortBy?: 'name' | 'price' | '', order?: 'asc' | 'desc'): Promise<ProductsResponse> => {
    try {
      let sortParams = '';
      if (sortBy) {
        const apiSortBy = sortBy === 'name' ? 'title' : sortBy;
        sortParams = `&sortBy=${encodeURIComponent(apiSortBy)}${order ? `&order=${encodeURIComponent(order)}` : ''}`;
      }

      const response = await apiClient.get<ProductsResponse>(
        `/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}${sortParams}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.response?.data?.message || error.message || 'Search failed',
          error.response?.status
        );
      }
      throw new ApiError('Network error: Unknown error occurred');
    }
  },

  // Get all categories (returns array of category slug strings)
  getCategories: async (): Promise<string[]> => {
    try {
      const response = await apiClient.get<string[]>(`/products/category-list`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.response?.data?.message || error.message || 'Failed to fetch categories',
          error.response?.status
        );
      }
      throw new ApiError('Network error: Unknown error occurred');
    }
  },

  // Get products by category (supports pagination & optional sorting via limit, skip, sortBy & order)
  getProductsByCategory: async (category: string, limit = 30, skip = 0, sortBy?: 'name' | 'price' | '', order?: 'asc' | 'desc'): Promise<ProductsResponse> => {
    try {
      let sortParams = '';
      if (sortBy) {
        const apiSortBy = sortBy === 'name' ? 'title' : sortBy;
        sortParams = `&sortBy=${encodeURIComponent(apiSortBy)}${order ? `&order=${encodeURIComponent(order)}` : ''}`;
      }

      const response = await apiClient.get<ProductsResponse>(
        `/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}${sortParams}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.response?.data?.message || error.message || 'Failed to fetch products by category',
          error.response?.status
        );
      }
      throw new ApiError('Network error: Unknown error occurred');
    }
  },
};
