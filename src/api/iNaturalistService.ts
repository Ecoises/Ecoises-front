import axios from 'axios';
import { INatResponse } from '../types/api';

export interface SpeciesData {
  imageUrl: string;
  speciesName: string; // Este será el nombre común
  scientificName: string; // ¡Nuevo! Para el nombre científico
  photoAttribution: string;
}

class INaturalistService {
  private readonly BASE_URL = 'https://api.inaturalist.org/v1/taxa';
  private readonly MAX_RETRIES = 5;

  async fetchRandomSpecies(retryCount: number = 0): Promise<SpeciesData> {
    if (retryCount >= this.MAX_RETRIES) {
      throw new Error('Máximo de reintentos alcanzado para la imagen.');
    }

    const randomPage = Math.floor(Math.random() * 10000) + 1;

    const response = await axios.get<INatResponse>(this.BASE_URL, {
      params: {
        per_page: 1,
        rank: 'species',
        page: randomPage,
        locale: 'es',
        has_photos: true,
        place_id: 7196, // Codazzi, Cesar, Colombia
      },
    });

    const result = response.data.results[0];

    if (!result || !result.default_photo) {
      console.warn('No se encontró una imagen para la especie, reintentando...', retryCount + 1);
      return this.fetchRandomSpecies(retryCount + 1);
    }

    const imageUrl = result.default_photo.url.replace('square', 'large');
    const speciesName = result.preferred_common_name || result.name || 'Especie desconocida';
    const scientificName = result.name; // El nombre científico suele estar en 'name'

    const fullAttribution = result.default_photo.attribution || 'Autor desconocido';
    let author = 'Autor desconocido';
    let license = '';

    const match = fullAttribution.match(/\(c\)\s*([^,]+),\s*some rights reserved\s*\((.+?)\)/);
    if (match) {
      author = match[1].trim();
      license = match[2].trim();
    } else if (fullAttribution.includes('(c)')) {
      const simpleAuthorMatch = fullAttribution.match(/\(c\)\s*([^\(]+?)(?:,|$|\()/);
      if (simpleAuthorMatch && simpleAuthorMatch[1]) {
        author = simpleAuthorMatch[1].trim();
      }
    }

    const photoAttribution = `${author}${license ? ` (${license})` : ''}`;

    return {
      imageUrl,
      speciesName,
      scientificName, // Incluimos el nombre científico
      photoAttribution,
    };
  }
}

export const iNaturalistService = new INaturalistService();