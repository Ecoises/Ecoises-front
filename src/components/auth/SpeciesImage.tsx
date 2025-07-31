import React from 'react';
import { useSpeciesImage } from '../../hooks/useSpeciesImage';

const SpeciesImage: React.FC = () => {
  const { imageUrl, speciesName, photoAttribution, imageLoading, imageError } = useSpeciesImage();

  return (
    <div className="hidden lg:flex lg:w-1/2 bg-lime-50 relative overflow-hidden">
      {/* Indicador de carga */}
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-lime-100 text-gray-700 text-lg animate-pulse">
          Cargando imagen...
        </div>
      )}

      {/* Indicador de error */}
      {imageError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-100 text-red-700 p-4 text-center">
          <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p>Error al cargar la imagen. Inténtalo de nuevo.</p>
        </div>
      )}

      {/* Imagen real */}
      {imageUrl && !imageLoading && !imageError && (
        <>
          <img
            src={imageUrl}
            alt={speciesName || "Imagen de especie"}
            className="object-cover w-full h-full transition-opacity duration-500 ease-in-out opacity-0"
            onLoad={(e) => {
              e.currentTarget.classList.add('opacity-100');
            }}
            onError={() => {
              // Este error se maneja en el hook
            }}
          />
          
          {/* Información de la imagen */}
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg max-w-xs">
            <p className="text-sm font-heading font-bold text mb-0.5">{speciesName}</p>
            <p className="text-xs text-gray-200">Foto: (c) {photoAttribution}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default SpeciesImage;