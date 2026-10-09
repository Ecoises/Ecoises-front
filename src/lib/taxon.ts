type Photo = { url?: string | null; medium_url?: string | null; square_url?: string | null } | string | null | undefined;

/** Devuelve la mejor URL disponible de la foto de una especie. */
export const taxonPhotoUrl = (photo: Photo): string | null => {
  if (!photo) return null;
  if (typeof photo === "string") return photo;
  return photo.medium_url || photo.url || photo.square_url || null;
};

/** Nombre para mostrar: común si existe, si no el científico. */
export const taxonDisplayName = (taxon: { common_name?: string | null; scientific_name: string }): string =>
  taxon.common_name || taxon.scientific_name;
