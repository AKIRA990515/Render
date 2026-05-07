import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'instructor';
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'admin' | 'member' | 'instructor';
  phone?: string;
  avatar?: string;
  isActive?: boolean;
  password?: string;
  currentPassword?: string;
}

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[AUTH] Token enviado en request:', config.url);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;
    console.log('[AUTH] Response error:', error.response?.status, originalRequest?.url);

    if (error.response?.status === 401 && originalRequest) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        console.log('[AUTH] 🔄 Token expirado, intentando refresh...');
        try {
          console.log('[AUTH] 📡 Enviando refresh token al servidor...');
          const res = await axios.post<{ accessToken: string }>(`${API_URL}/auth/refresh`, { refreshToken });
          console.log('[AUTH] ✅ Refresh exitoso, nuevo accessToken recibido');

          localStorage.setItem('accessToken', res.data.accessToken);
          console.log('[AUTH] 💾 Nuevo accessToken guardado en localStorage');

          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          console.log('[AUTH] 🔁 Reintentando request original:', originalRequest.url);

          return api(originalRequest);
        } catch (refreshError) {
          console.error('[AUTH] ❌ Refresh fallido, cerrando sesión...');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          console.log('[AUTH] 🗑️ Tokens y usuario eliminados del localStorage');
          window.location.href = '/login';
        }
      } else {
        console.log('[AUTH] ⚠️ No hay refreshToken disponible');
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data: LoginRequest) => api.post<AuthResponse>('/auth/login', data),
  register: (data: RegisterRequest) => api.post<AuthResponse>('/auth/register', data),
  refresh: (refreshToken: string) => api.post<{ accessToken: string }>('/auth/refresh', { refreshToken }),
  logout: () => api.post('/auth/logout'),
};

export const usersApi = {
  getAll: () => api.get<User[]>('/users'),
  getOne: (id: string) => api.get<User>(`/users/${id}`),
  create: (data: Omit<User, 'id' | 'createdAt'> & { password: string }) => api.post<User>('/users', data),
  update: (id: string, data: Partial<UpdateUserRequest>) => api.patch<User>(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
  changePassword: (id: string, currentPassword: string, newPassword: string) => 
    api.patch<User>(`/users/${id}/password`, { currentPassword, password: newPassword }),
};

export default api;