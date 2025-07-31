import { useState, useEffect } from 'react';
import { iNaturalistService, SpeciesData } from '../api/iNaturalistService';

export const useSpeciesImage = () => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [speciesName, setSpeciesName] = useState<string>("");
  const [photoAttribution, setPhotoAttribution] = useState<string>("");
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [imageError, setImageError] = useState<boolean>(false);

  const fetchSpeciesImage = async () => {
    setImageLoading(true);
    setImageError(false);
    setImageUrl("");
    setSpeciesName("");
    setPhotoAttribution("");

    try {
      const speciesData: SpeciesData = await iNaturalistService.fetchRandomSpecies();
      setImageUrl(speciesData.imageUrl);
      setSpeciesName(speciesData.speciesName);
      setPhotoAttribution(speciesData.photoAttribution);
    } catch (err: any) {
      console.error("Error al obtener datos de iNaturalist", err);
      setImageError(true);
      setImageUrl("");
      setSpeciesName("Error al cargar imagen");
      setPhotoAttribution("No disponible");
    } finally {
      setImageLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeciesImage();
  }, []);

  return {
    imageUrl,
    speciesName,
    photoAttribution,
    imageLoading,
    imageError,
    refetchImage: fetchSpeciesImage,
  };
};