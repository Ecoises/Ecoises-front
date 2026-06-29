import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Loader2 } from "lucide-react";
import { observationService } from "@/api/services/ObservationService";
import { useToast } from "@/hooks/use-toast";

interface ReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  observationId: number | string;
  observationSpecies: string;
  onSuccess?: () => void;
}

export const ReportModal = ({
  open,
  onOpenChange,
  observationId,
  observationSpecies,
  onSuccess,
}: ReportModalProps) => {
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = comment.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      const response = await observationService.report(observationId, trimmed);
      if (response.success) {
        toast({
          title: "Reporte registrado",
          description: "Muchas gracias. El reporte ha sido registrado para revisión por el equipo administrador.",
        });
        setComment("");
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } else {
        throw new Error(response.message || "No se pudo registrar el reporte.");
      }
    } catch (err: any) {
      toast({
        title: "Error al enviar reporte",
        description: err?.message || "Hubo un problema de conexión al registrar el reporte.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white border-lime-100 rounded-3xl p-6">
        <DialogHeader className="space-y-2">
          <div className="mx-auto bg-amber-100 text-amber-700 h-12 w-12 rounded-full flex items-center justify-center shadow-sm">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl font-bold font-heading text-center text-forest-950">
            Reportar Avistamiento
          </DialogTitle>
          <DialogDescription className="text-sm text-center text-forest-750">
            Reportarás la observación de <span className="font-semibold text-forest-900">{observationSpecies}</span> (ID: {observationId}).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="text-xs font-bold text-forest-800 uppercase tracking-wider block mb-1.5">
              Motivo o explicación del reporte
            </label>
            <Textarea
              required
              placeholder="Explica detalladamente el problema (ej: Especie mal identificada, ubicación errónea, foto inapropiada, datos falsos...)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
              className="min-h-[120px] border-lime-200 focus:border-lime-400 bg-white rounded-xl resize-none text-sm text-forest-900"
            />
            <p className="text-[10px] text-right text-forest-600 mt-1">
              {comment.length}/1000 caracteres
            </p>
          </div>

          <DialogFooter className="flex sm:justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => onOpenChange(false)}
              className="border-lime-200 hover:bg-lime-50 text-forest-700 rounded-full px-5 h-10 text-sm font-semibold"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-5 h-10 text-sm font-semibold gap-1.5 shadow-sm"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Reporte"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
