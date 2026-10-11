import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { BookOpen, Clock, FileText, GraduationCap, Images, Leaf, Loader2, Search, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, getStorageUrl } from "@/lib/utils";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { getEducationalContents, EducationalContent, LearnFilters } from "@/api/services/educationalContentService";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&h=400";

const TYPES = {
  course: { label: "Cursos", single: "Curso", icon: GraduationCap },
  article: { label: "Artículos", single: "Artículo", icon: FileText },
  resource: { label: "Recursos", single: "Recurso multimedia", icon: Images },
} as const;

const LEVELS = {
  principiante: { label: "Principiante", className: "bg-green-100 text-green-800" },
  intermedio: { label: "Intermedio", className: "bg-yellow-100 text-yellow-800" },
  avanzado: { label: "Avanzado", className: "bg-orange-100 text-orange-800" },
} as const;

const detailLink = (content: EducationalContent) =>
  content.content_type === "article"
    ? `/learn/article/${content.slug}`
    : content.content_type === "resource"
      ? `/learn/resource/${content.slug}`
      : `/learn/course/${content.slug}`;

const CourseCard = ({ content }: { content: EducationalContent }) => {
  const type = TYPES[content.content_type] ?? TYPES.course;
  const level = LEVELS[content.difficulty_level];
  const TypeIcon = type.icon;

  return (
    <Link to={detailLink(content)} className="block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500">
      <Card className="flex h-full flex-col overflow-hidden border-lime-100 transition-shadow duration-200 hover:shadow-lg">
        <div className="relative aspect-[16/10] bg-lime-50">
          <img
            src={getStorageUrl(content.thumbnail_url) ?? FALLBACK_IMAGE}
            alt={content.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            onError={(e) => ((e.target as HTMLImageElement).src = FALLBACK_IMAGE)}
          />
          {level && <Badge className={cn("absolute right-3 top-3", level.className)}>{level.label}</Badge>}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-forest-600">
            <BookOpen className="h-3 w-3" aria-hidden="true" />
            <span>{content.categories?.[0]?.name || "General"}</span>
            {content.estimated_duration > 0 && (
              <>
                <span aria-hidden="true">•</span>
                <Clock className="h-3 w-3" aria-hidden="true" />
                <span>{content.estimated_duration} min</span>
              </>
            )}
          </div>
          <h3 className="font-heading text-lg font-bold leading-tight text-forest-900">{content.title}</h3>
          <p className="line-clamp-2 flex-1 text-sm text-forest-700">{content.description}</p>
          <div className="flex items-center justify-between border-t border-lime-100 pt-2 text-xs text-forest-600">
            <span className="inline-flex items-center gap-1.5">
              <TypeIcon className="h-3.5 w-3.5" aria-hidden="true" /> {type.single}
            </span>
            {content.content_type === "course" && !!content.lessons_count && (
              <span>{content.lessons_count} lecciones</span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

const CardSkeleton = () => (
  <Card className="overflow-hidden border-lime-100">
    <div className="aspect-[16/10] animate-pulse bg-lime-50" />
    <div className="space-y-2 p-4">
      <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200" />
      <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
      <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
    </div>
  </Card>
);

const chip = (active: boolean) =>
  cn(
    "inline-flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-sm transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500",
    active ? "border-lime-600 bg-lime-600 text-white" : "border-lime-200 bg-white text-forest-800 hover:bg-lime-50"
  );

const Learn = () => {
  const [params, setParams] = useSearchParams();
  const filters: LearnFilters = useMemo(
    () => ({
      q: params.get("q") || undefined,
      type: (params.get("type") as LearnFilters["type"]) || undefined,
      level: (params.get("level") as LearnFilters["level"]) || undefined,
      category: params.get("category") || undefined,
    }),
    [params]
  );

  // Se parte de la última URL escrita para que dos clics seguidos no se pisen.
  const latest = useRef(params);
  useEffect(() => {
    latest.current = params;
  }, [params]);
  const update = (changes: Partial<LearnFilters>) => {
    const next = new URLSearchParams(latest.current);
    Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
    latest.current = next;
    setParams(next, { replace: true });
  };

  // Búsqueda en el servidor, 400 ms después de dejar de escribir.
  const [term, setTerm] = useState(filters.q ?? "");
  useEffect(() => {
    if (term.trim() === (filters.q ?? "")) return;
    const timer = setTimeout(() => update({ q: term.trim() || undefined }), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  const query = useInfiniteQuery({
    queryKey: ["learn", filters],
    queryFn: ({ pageParam }) => getEducationalContents(filters, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.meta.pagination.current_page < last.meta.pagination.last_page ? last.meta.pagination.current_page + 1 : undefined,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });

  const contents = query.data?.pages.flatMap((page) => page.data) ?? [];
  const facets = query.data?.pages[0]?.meta.facets;
  const total = query.data?.pages[0]?.meta.pagination.total ?? 0;
  const hasFilters = !!(filters.q || filters.type || filters.level || filters.category);
  const catalogIsEmpty = facets?.total === 0;
  const sentinel = useInfiniteScroll(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) query.fetchNextPage();
  }, !!query.hasNextPage);

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="font-heading text-3xl font-bold text-forest-950 md:text-4xl">Centro de Aprendizaje</h1>
        <p className="text-forest-700">Cursos, artículos y recursos para conocer y conservar la biodiversidad de Colombia.</p>
      </header>

      {query.isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : query.isError ? (
        <Card className="border-red-200 p-6 text-center text-red-700">No pudimos cargar los contenidos. Revisa tu conexión e intenta de nuevo.</Card>
      ) : catalogIsEmpty ? (
        // Aún no se ha publicado nada: sin buscador ni filtros que no llevarían a ningún lado.
        <Card className="flex flex-col items-center gap-3 border-dashed border-lime-200 bg-lime-50/40 px-6 py-16 text-center">
          <Leaf className="h-10 w-10 text-lime-500" aria-hidden="true" />
          <h2 className="font-heading text-xl font-bold text-forest-900">Muy pronto habrá contenidos aquí</h2>
          <p className="max-w-md text-forest-700">
            El equipo de EcoIses está preparando cursos y artículos. Mientras tanto, explora las especies de Colombia.
          </p>
          <Link to="/explorer">
            <Button className="rounded-full bg-lime-600 text-white hover:bg-lime-700">Ir al explorador</Button>
          </Link>
        </Card>
      ) : (
        <>
          {/* Buscador y filtros: solo aparecen las opciones que tienen contenido */}
          <div className="space-y-3">
            <label htmlFor="learn-search" className="relative block">
              <span className="sr-only">Buscar contenidos</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-500" aria-hidden="true" />
              <Input
                id="learn-search"
                type="search"
                placeholder="Buscar por título o descripción..."
                className="h-11 rounded-xl border-lime-200 bg-white pl-10 pr-9 text-base md:text-sm"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              />
              {term && (
                <button
                  type="button"
                  onClick={() => setTerm("")}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full hover:bg-lime-50"
                  aria-label="Borrar búsqueda"
                >
                  <X className="h-4 w-4 text-forest-500" aria-hidden="true" />
                </button>
              )}
            </label>

            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] md:flex-wrap">
              <button type="button" className={chip(!filters.type)} aria-pressed={!filters.type} onClick={() => update({ type: undefined })}>
                Todo <span className="opacity-70">{facets?.total}</span>
              </button>
              {(Object.keys(TYPES) as Array<keyof typeof TYPES>)
                .filter((type) => (facets?.types[type] ?? 0) > 0)
                .map((type) => {
                  const Icon = TYPES[type].icon;
                  return (
                    <button
                      key={type}
                      type="button"
                      className={chip(filters.type === type)}
                      aria-pressed={filters.type === type}
                      onClick={() => update({ type: filters.type === type ? undefined : type })}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" /> {TYPES[type].label}
                      <span className="opacity-70">{facets?.types[type]}</span>
                    </button>
                  );
                })}
              {(Object.keys(LEVELS) as Array<keyof typeof LEVELS>)
                .filter((level) => (facets?.levels[level] ?? 0) > 0)
                .map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={chip(filters.level === level)}
                    aria-pressed={filters.level === level}
                    onClick={() => update({ level: filters.level === level ? undefined : level })}
                  >
                    {LEVELS[level].label}
                  </button>
                ))}
              {facets?.categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={chip(filters.category === category.slug)}
                  aria-pressed={filters.category === category.slug}
                  onClick={() => update({ category: filters.category === category.slug ? undefined : category.slug })}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-forest-700" aria-live="polite">
            {total} {total === 1 ? "contenido" : "contenidos"}
            {query.isFetching && !query.isFetchingNextPage && <Loader2 className="ml-2 inline h-4 w-4 animate-spin text-lime-600" aria-label="Actualizando" />}
          </p>

          {contents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {contents.map((content) => <CourseCard key={content.id} content={content} />)}
              </div>
              <div ref={sentinel} className="flex justify-center py-4">
                {query.isFetchingNextPage && <Loader2 className="h-6 w-6 animate-spin text-lime-600" aria-label="Cargando más" />}
              </div>
            </>
          ) : (
            <Card className="border-lime-200 p-8 text-center">
              <h2 className="font-medium text-forest-900">No encontramos contenidos con esos filtros</h2>
              {hasFilters && (
                <Button
                  variant="outline"
                  className="mt-4 border-lime-200"
                  onClick={() => {
                    setTerm("");
                    update({ q: undefined, type: undefined, level: undefined, category: undefined });
                  }}
                >
                  Quitar filtros
                </Button>
              )}
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Learn;
