/** Nombre legible de una fuente: "wikipedia ES" → "Wikipedia". */
export const providerName = (provider: string) => (/wikipedia/i.test(provider) ? "Wikipedia" : provider);
