import apiClient from '../apiClient';
import { AxiosResponse } from 'axios';

export default class BaseService<T> {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  // Obtener todos los registros
  async getAll(params?: any): Promise<T[]> {
    try {
      const response: AxiosResponse<{ data: T[] }> = await apiClient.get(`/${this.endpoint}`, { params });
      return response.data.data || [];
    } catch (error) {
      console.error(`Error al obtener los registros de ${this.endpoint}:`, error);
      throw error;
    }
  }

  // Obtener un registro por ID
  async getById(id: number | string): Promise<T | null> {
    try {
      const response: AxiosResponse<{ data: T }> = await apiClient.get(`/${this.endpoint}/${id}`);
      return response.data.data || null;
    } catch (error) {
      console.error(`Error al obtener el registro ${id} de ${this.endpoint}:`, error);
      throw error;
    }
  }

  // Crear un nuevo registro
  async create(data: Partial<T>): Promise<T> {
    try {
      const response: AxiosResponse<{ data: T }> = await apiClient.post(`/${this.endpoint}`, data);
      return response.data.data;
    } catch (error) {
      console.error(`Error al crear un registro en ${this.endpoint}:`, error);
      throw error;
    }
  }

  // Actualizar un registro existente
  async update(id: number | string, data: Partial<T>): Promise<T> {
    try {
      const response: AxiosResponse<{ data: T }> = await apiClient.put(`/${this.endpoint}/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error(`Error al actualizar el registro ${id} en ${this.endpoint}:`, error);
      throw error;
    }
  }

  // Eliminar un registro
  async delete(id: number | string): Promise<boolean> {
    try {
      await apiClient.delete(`/${this.endpoint}/${id}`);
      return true;
    } catch (error) {
      console.error(`Error al eliminar el registro ${id} de ${this.endpoint}:`, error);
      throw error;
    }
  }
}
