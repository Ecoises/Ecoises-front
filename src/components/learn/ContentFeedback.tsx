import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, MessageSquareText, Star } from "lucide-react";
import { submitContentFeedback } from "@/api/services/educationalContentService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ContentFeedbackProps {
  contentId: number;
  initialRating?: number;
  initialComment?: string;
}

export const ContentFeedback = ({ contentId, initialRating = 0, initialComment = "" }: ContentFeedbackProps) => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [expanded, setExpanded] = useState(Boolean(initialComment));
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!rating && !comment.trim()) return;

    setSubmitting(true);
    try {
      const response = await submitContentFeedback(contentId, {
        rating: rating || undefined,
        comment: comment.trim() || undefined,
      });
      setSubmitted(true);
      toast({ title: "Gracias por tu opinión", description: response.message });
    } catch (error: any) {
      toast({
        title: "No pudimos guardar tu opinión",
        description: error?.response?.data?.message || "Inténtalo nuevamente en unos segundos.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto mt-10 max-w-3xl rounded-2xl border border-lime-100 bg-lime-50/40 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-white p-2 text-lime-700 shadow-sm">
            <MessageSquareText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-forest-950">¿Te resultó útil este contenido?</h2>
            <p className="text-sm text-forest-700">Tu opinión ayuda a mejorar las próximas experiencias.</p>
          </div>
        </div>

        {isAuthenticated ? (
          <div className="flex gap-1" aria-label="Calificación del contenido">
            {[1, 2, 3, 4, 5].map(value => (
              <button
                key={value}
                type="button"
                aria-label={`${value} ${value === 1 ? "estrella" : "estrellas"}`}
                aria-pressed={rating === value}
                onClick={() => {
                  setRating(value);
                  setExpanded(true);
                  setSubmitted(false);
                }}
                className="rounded-full p-1.5 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500"
              >
                <Star className={`h-6 w-6 ${value <= rating ? "fill-amber-400 text-amber-400" : "text-forest-300"}`} />
              </button>
            ))}
          </div>
        ) : (
          <Button asChild variant="outline" size="sm" className="rounded-full border-lime-300">
            <Link to="/login">Inicia sesión para opinar</Link>
          </Button>
        )}
      </div>

      {isAuthenticated && expanded && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 border-t border-lime-100 pt-4">
          <Textarea
            value={comment}
            onChange={event => {
              setComment(event.target.value);
              setSubmitted(false);
            }}
            maxLength={3000}
            rows={3}
            placeholder="Opcional: cuéntanos qué aprendiste o qué podríamos explicar mejor."
            className="resize-none border-lime-200 bg-white"
          />
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-forest-600">
              {submitted ? "Tu opinión quedó guardada." : `${comment.length}/3000`}
            </span>
            <Button type="submit" size="sm" disabled={submitting || (!rating && !comment.trim())} className="rounded-full">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitted ? "Actualizar opinión" : "Enviar opinión"}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
};
