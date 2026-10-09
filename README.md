# EcoIses · Frontend

Interfaz web de **EcoIses**, la plataforma de educación y divulgación de la biodiversidad colombiana.
Consume la API de `biodiversidad-api` (Laravel). El panel de administración vive en el backend (`/admin`).

**Stack:** React 18 · TypeScript · Vite · Tailwind + shadcn/ui · TanStack Query · React Router · Leaflet.

## Puesta en marcha

```bash
npm install
cp .env.example .env     # VITE_APP_API_URL=http://biodiversidad-api.test
npm run dev              # http://localhost:8080
```

El backend debe estar corriendo (Laragon) y con su worker de colas encendido; ver el README del backend.

```bash
npm run build            # compila a dist/
npm run lint
npx tsc -p tsconfig.app.json --noEmit   # chequeo de tipos
```

## Cómo está organizado

```
src/
├── App.tsx               Rutas. Cada página se carga bajo demanda (React.lazy).
├── api/
│   ├── apiClient.ts      Único cliente HTTP (axios): base /api y token Bearer automático.
│   └── services/         Un archivo por recurso de la API (retos, avistamientos, contenidos…)
├── hooks/                Hooks de datos con TanStack Query (useSpecies, useChallenges…)
├── contexts/             Sesión del usuario (AuthContext)
├── pages/                Una carpeta por módulo
│   ├── species/          Explorador geográfico, catálogo y ficha de especie
│   ├── challenges/       Retos de campo
│   ├── observations/     Subir, ver y editar avistamientos (evidencia de retos)
│   ├── learn/            Cursos, artículos, recursos y reproductor de lecciones
│   ├── auth/             Login y recuperación de contraseña
│   └── legal/            Términos y privacidad
├── components/           Componentes por módulo (home, species, learn, activities…) y ui/ (shadcn)
├── lib/                  Utilidades (utils.ts, taxon.ts)
└── types/                Tipos compartidos de la API
```

Reglas para mantenerlo ordenado:

- Toda llamada al backend pasa por `src/api/apiClient.ts`; las rutas se escriben sin `/api`.
- Los datos remotos se piden con TanStack Query (en `hooks/` o en el servicio), no con `useEffect` + `fetch`.
- Nada de llamadas directas a iNaturalist o GBIF desde el navegador: el backend ya las hace y las cachea.

## Módulos y rutas

| Ruta | Página |
|---|---|
| `/` | Inicio: anuncios, especie del día, curiosidades y ecosistemas |
| `/explorer` | Catálogo geográfico (nacional o cerca de ti) |
| `/taxa/:id` | Ficha de especie |
| `/retos` · `/retos/:id` | Retos de campo y progreso del usuario |
| `/observations/create?reto=ID` | Subir la evidencia de un reto |
| `/observations/:id` | Detalle de un avistamiento |
| `/learn` y subrutas | Área educativa y reproductor de lecciones |
| `/profile` | Progreso, puntos, nivel y certificados |

Las rutas antiguas `/sightings` redirigen a `/retos`.
