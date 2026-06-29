import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, ArrowRight, Eye, Camera, Edit, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { observationService } from "@/api/services/ObservationService";
import type { ApiObservation } from "@/types/observation";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import ReportModal from "@/components/observations/ReportModal";

interface RecentObservationsProps {
  taxonId?: number;
  speciesName?: string;
}

export const RecentObservations = ({ taxonId, speciesName = "esta especie" }: RecentObservationsProps) => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [observationToDelete, setObservationToDelete] = useState<ApiObservation | null>(null);
  const [observationToReport, setObservationToReport] = useState<ApiObservation | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch latest 4 observations for the given taxon or overall
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["recent-observations", taxonId],
    queryFn: async () => {
      const response = await observationService.getAll({
        taxon_id: taxonId,
        per_page: 4,
      });
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const handleDelete = async () => {
    if (!observationToDelete || deleting) return;
    setDeleting(true);
    try {
      const response = await observationService.delete(observationToDelete.id);
      if (response.success) {
        toast({
          title: "Observación eliminada",
          description: "La observación ha sido eliminada correctamente.",
        });
        refetch();
      } else {
        throw new Error(response.message || "Error al eliminar");
      }
    } catch (err: any) {
      toast({
        title: "Error al eliminar",
        description: err?.message || "No se pudo eliminar el registro.",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
      setDeleteConfirmOpen(false);
      setObservationToDelete(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Fecha no registrada";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatLocation = (obs: ApiObservation) => {
    if (obs.location_name) return obs.location_name;
    if (obs.latitude != null && obs.longitude != null) {
      return `${obs.latitude.toFixed(4)}, ${obs.longitude.toFixed(4)}`;
    }
    return "Ubicación no registrada";
  };

  if (isLoading) {
    return (
      <div className="mt-12 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-forest-950 font-heading">Observaciones Recientes</h2>
          <div className="h-5 w-20 bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border border-lime-100 rounded-2xl overflow-hidden shadow-sm bg-white">
              <div className="h-44 bg-gray-150 animate-pulse" />
              <CardContent className="pt-7 pb-4 px-4 space-y-3">
                <div className="h-5 w-2/3 bg-gray-200 animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-gray-100 animate-pulse rounded" />
                <div className="h-4 w-1/3 bg-gray-100 animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const observations = data || [];

  return (
    <div className="mt-12 mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-forest-950 font-heading">Observaciones Recientes</h2>
        <Link 
          to="/sightings" 
          className="text-lime-600 hover:text-lime-700 text-sm font-semibold flex items-center gap-1 group transition-colors"
        >
          Ver todas
          <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {observations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {observations.map((observation) => {
            const primaryPhoto = observation.photos?.find((p) => p.is_primary) ?? observation.photos?.[0];
            const imageUrl = primaryPhoto?.photo_url ?? "https://images.unsplash.com/photo-1550159930-40066082a4fc?w=800";
            const userName = observation.user?.name ?? "Usuario";
            const userAvatar = observation.user?.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=84cc16&color=fff`;

            return (
              <Link key={observation.id} to={`/observations/${observation.id}`}>
                <Card className="group cursor-pointer border border-lime-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white h-full flex flex-col">
                  <div className="relative h-44 overflow-hidden bg-lime-50">
                    <img
                      src={imageUrl}
                      alt={`Observación de ${userName}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                  </div>

                  <CardContent className="pt-7 pb-4 px-4 flex-1 flex flex-col justify-between relative">
                    {/* Floating overlapping Avatar */}
                    <Avatar className="absolute -top-5 left-4 h-10 w-10 border-4 border-white shadow-md z-10 bg-lime-100">
                      <AvatarImage src={userAvatar} alt={userName} />
                      <AvatarFallback className="font-bold text-xs text-lime-700 bg-lime-50">
                        {userName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-forest-950 text-base mb-2 group-hover:text-lime-600 transition-colors line-clamp-1">
                        {userName}
                      </h3>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-forest-750 font-medium">
                          <MapPin className="h-3.5 w-3.5 text-lime-600 flex-shrink-0" />
                          <span className="truncate">{formatLocation(observation)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-forest-700 font-normal">
                          <Calendar className="h-3.5 w-3.5 text-lime-650 flex-shrink-0" />
                          <span>{formatDate(observation.observed_at || observation.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Botones de acción contextuales en la tarjeta */}
                    {currentUser && (
                      <div className="mt-4 pt-3 border-t border-lime-50/50 flex justify-end gap-2 z-20">
                        {observation.user_id === currentUser.id ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate(`/observations/edit/${observation.id}`);
                              }}
                              className="h-7 text-[10px] font-semibold text-blue-600 border-blue-200 hover:bg-blue-50 px-2.5 rounded-full"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setObservationToDelete(observation);
                                setDeleteConfirmOpen(true);
                              }}
                              className="h-7 text-[10px] font-semibold text-red-655 border-red-200 hover:bg-red-50 px-2.5 rounded-full"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Eliminar
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setObservationToReport(observation);
                              setReportModalOpen(true);
                            }}
                            className="h-7 text-[10px] font-semibold text-amber-600 border-amber-200 hover:bg-amber-50 px-2.5 rounded-full ml-auto"
                          >
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Reportar
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card className="border border-dashed border-lime-200 text-center py-12 bg-lime-50/20 rounded-2xl">
          <div className="max-w-md mx-auto space-y-4 px-4">
            <div className="bg-lime-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Camera className="h-8 w-8 text-lime-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-forest-950 mb-1">Sin observaciones aún</h3>
              <p className="text-sm text-forest-700 mb-6">
                Sé la primera persona en compartir una observación de {speciesName} en nuestro campus.
              </p>
              <Link to="/observations/create">
                <Button className="bg-lime-500 hover:bg-lime-600 text-white rounded-full px-6 font-medium shadow-sm transition-all hover:scale-102">
                  Registrar Avistamiento
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Modal de Reporte */}
      {observationToReport && (
        <ReportModal
          open={reportModalOpen}
          onOpenChange={setReportModalOpen}
          observationId={observationToReport.id}
          observationSpecies={observationToReport.taxon?.common_name || observationToReport.taxon?.scientific_name || "Especie"}
        />
      )}

      {/* Diálogo de Confirmación de Eliminación */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md bg-white border-red-150 rounded-3xl p-6">
          <DialogHeader className="space-y-2">
            <div className="mx-auto bg-red-100 text-red-700 h-12 w-12 rounded-full flex items-center justify-center shadow-sm">
              <Trash2 className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl font-bold font-heading text-center text-forest-950">
              ¿Estás seguro de eliminar este avistamiento?
            </DialogTitle>
            <DialogDescription className="text-sm text-center text-forest-750">
              Esta acción eliminará de forma permanente el avistamiento junto con todas sus imágenes.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex sm:justify-end gap-2.5 pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={deleting}
              onClick={() => setDeleteConfirmOpen(false)}
              className="border-lime-200 hover:bg-lime-50 text-forest-700 rounded-full px-5 h-10 text-sm font-semibold"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={deleting}
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full px-5 h-10 text-sm font-semibold gap-1.5 shadow-sm"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar Registro"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecentObservations;