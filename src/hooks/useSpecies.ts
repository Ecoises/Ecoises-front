import { useState, useEffect } from 'react';
import { taxonService } from '../api/services/TaxonService';

const useSpecies = (placeId = 12731) => {
  const [species, setSpecies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 12,
    total: 0,
    totalPages: 1
  });

  const fetchSpecies = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await taxonService.getSpeciesByPlace(placeId, {
        page: pagination.page,
        per_page: pagination.perPage,
        ...params
      });
      
      setSpecies(response.data || []);
      
      if (response.meta) {
        setPagination(prev => ({
          ...prev,
          page: response.meta.current_page,
          total: response.meta.total,
          totalPages: response.meta.last_page
        }));
      }
      
      return response;
    } catch (err: any) {
      console.error('Error fetching species:', err);
      setError(err.message || 'Error al cargar las especies');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchSpecies = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await taxonService.searchTaxa(query, {
        per_page: pagination.perPage
      });
      
      setSpecies(response.data || []);
      
      if (response.meta) {
        setPagination(prev => ({
          ...prev,
          page: 1,
          total: response.meta.total,
          totalPages: response.meta.last_page
        }));
      }
      
      return response;
    } catch (err: any) {
      console.error('Error searching species:', err);
      setError(err.message || 'Error al buscar especies');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecies();
  }, [pagination.page, pagination.perPage]);

  const changePage = (page: number) => {
    setPagination(prev => ({
      ...prev,
      page
    }));
  };

  const changePerPage = (perPage: number) => {
    setPagination(prev => ({
      ...prev,
      perPage,
      page: 1 // Reset to first page when changing items per page
    }));
  };

  return {
    species,
    loading,
    error,
    pagination,
    fetchSpecies,
    searchSpecies,
    changePage,
    changePerPage
  };
};

export default useSpecies;
