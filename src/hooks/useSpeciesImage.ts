import { useState, useEffect } from 'react';
import { iNaturalistService, SpeciesData } from '../api/iNaturalistService';

export const useSpeciesImage = () => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [speciesName, setSpeciesName] = useState<string>("");
  const [scientificName, setScientificName] = useState<string>(""); // Nuevo estado para el nombre científico
  const [photoAttribution, setPhotoAttribution] = useState<string>("");
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [imageError, setImageError] = useState<boolean>(false);

  const fetchSpeciesImage = async () => {
    setImageLoading(true);
    setImageError(false);
    setImageUrl("");
    setSpeciesName("");
    setScientificName(""); // Limpiar el nombre científico también
    setPhotoAttribution("");

    try {
      const speciesData: SpeciesData = await iNaturalistService.fetchRandomSpecies();
      setImageUrl(speciesData.imageUrl);
      setSpeciesName(speciesData.speciesName);
      setScientificName(speciesData.scientificName); // Asignar el nombre científico
      setPhotoAttribution(speciesData.photoAttribution);
    } catch (err: any) {
      console.error("Error al obtener datos de iNaturalist", err);
      setImageError(true);
      setImageUrl("");
      setSpeciesName("Error al cargar imagen");
      setScientificName(""); // Asegurarse de que esté vacío en caso de error
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
    scientificName, // ¡Incluirlo en el retorno del hook!
    photoAttribution,
    imageLoading,
    imageError,
    refetchImage: fetchSpeciesImage,
  };
};