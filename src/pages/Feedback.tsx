import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Lightbulb, Loader2, MessageSquareText } from "lucide-react";
import { FeedbackCategory, submitGeneralFeedback } from "@/api/services/feedbackService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Feedback = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState<FeedbackCategory>("suggestion");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await submitGeneralFeedback({
        subject: subject.trim(),
        comment: comment.trim(),
        category,
        context: { page: window.location.pathname },
      });
      setSent(true);
      setSubject("");
      setComment("");
      toast({ title: "Mensaje enviado", description: response.message });
    } catch (error: any) {
      toast({
        title: "No pudimos enviar el mensaje",
        description: error?.response?.data?.message || "Inténtalo nuevamente en unos segundos.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl py-8">
      <header className="mb-7 space-y-3 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-100 text-lime-700">
          <MessageSquareText className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold text-forest-950">Ayúdanos a mejorar Ecoises</h1>
        <p className="text-forest-700">Comparte una sugerencia, una dificultad o una idea. El equipo podrá darle seguimiento desde la bandeja de moderación.</p>
      </header>

      {!isAuthenticated ? (
        <div className="rounded-2xl border border-lime-100 bg-white p-7 text-center shadow-sm">
          <Lightbulb className="mx-auto mb-3 h-7 w-7 text-amber-500" />
          <p className="mb-4 text-sm text-forest-700">Inicia sesión para enviar el mensaje y evitar reportes anónimos o duplicados.</p>
          <Button asChild className="rounded-full"><Link to="/login">Iniciar sesión</Link></Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-lime-100 bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <label htmlFor="feedback-category" className="text-sm font-semibold text-forest-900">Tipo de mensaje</label>
            <select
              id="feedback-category"
              value={category}
              onChange={event => setCategory(event.target.value as FeedbackCategory)}
              className="flex h-10 w-full rounded-md border border-lime-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500"
            >
              <option value="suggestion">Sugerencia</option>
              <option value="improvement">Idea de mejora</option>
              <option value="technical_issue">Problema técnico</option>
              <option value="accessibility">Accesibilidad</option>
              <option value="other">Otro</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="feedback-subject" className="text-sm font-semibold text-forest-900">Asunto</label>
            <Input id="feedback-subject" value={subject} onChange={event => setSubject(event.target.value)} maxLength={255} required />
          </div>
          <div className="space-y-2">
            <label htmlFor="feedback-comment" className="text-sm font-semibold text-forest-900">Cuéntanos un poco más</label>
            <Textarea id="feedback-comment" value={comment} onChange={event => setComment(event.target.value)} maxLength={3000} rows={7} required className="resize-none" />
            <p className="text-right text-xs text-muted-foreground">{comment.length}/3000</p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-forest-600">{sent ? "Tu mensaje anterior fue recibido." : "Solo el equipo autorizado podrá verlo."}</span>
            <Button type="submit" disabled={submitting || !subject.trim() || !comment.trim()} className="rounded-full">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar mensaje
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Feedback;
