import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh });
          localStorage.setItem('access_token', data.access);
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data: { username: string; email: string; password: string; first_name: string; last_name: string }) =>
    api.post('/auth/register/', data),
  login: (data: { username: string; password: string }) =>
    api.post('/auth/login/', data),
  getProfile: () => api.get('/auth/profile/'),
};

// Products
export const productAPI = {
  getCategories: () => api.get('/categories/'),
  getProducts: (params?: { category?: number; search?: string; featured?: boolean; page?: number; page_size?: number }) =>
    api.get('/products/', { params }),
  getProduct: (id: number) => api.get(`/products/${id}/`),
};

// Cart
export const cartAPI = {
  getCart: () => api.get('/cart/'),
  addItem: (data: { product_id: number; quantity: number }) => api.post('/cart/add/', data),
  updateItem: (itemId: number, data: { quantity: number }) => api.put(`/cart/update/${itemId}/`, data),
  removeItem: (itemId: number) => api.delete(`/cart/remove/${itemId}/`),
  clearCart: () => api.delete('/cart/clear/'),
};

// Orders
export const orderAPI = {
  create: (data: { payment_method: string; customer_name: string; customer_phone: string; customer_email: string; special_instructions?: string }) =>
    api.post('/orders/create/', data),
  getOrders: () => api.get('/orders/'),
  getOrder: (orderNumber: string) => api.get(`/orders/${orderNumber}/`),
};

// Admin
export const adminAPI = {
  // Orders
  getOrders: () => api.get('/admin/orders/'),
  updateOrder: (orderNumber: string, data: { status?: string; payment_status?: string }) =>
    api.put(`/admin/orders/${orderNumber}/`, data),
  
  // Products
  createProduct: (data: FormData | object) => api.post('/admin/products/create/', data),
  updateProduct: (id: number, data: object) => api.put(`/admin/products/update/${id}/`, data),
  deleteProduct: (id: number) => api.delete(`/admin/products/delete/${id}/`),
  
  // Categories - ADD THESE MISSING METHODS
  createCategory: (data: { name: string; description: string; is_active: boolean }) =>
    api.post('/admin/categories/create/', data),
  
  updateCategory: (id: number, data: { name: string; description: string; is_active: boolean }) =>
    api.put(`/admin/categories/update/${id}/`, data),
  
  deleteCategory: (id: number) =>
    api.delete(`/admin/categories/delete/${id}/`),
  
  // Analytics
  getAnalytics: (params?: { period?: string; from?: string; to?: string }) =>
    api.get('/admin/analytics/', { params }),
};

export default api;