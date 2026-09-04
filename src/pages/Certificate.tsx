import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Award, CheckCircle2, Leaf, Printer } from "lucide-react";
import { CertificateData, getCertificate } from "@/api/services/learningDashboardService";
import { Button } from "@/components/ui/button";

const Certificate = () => {
  const { verificationCode } = useParams<{ verificationCode: string }>();
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!verificationCode) return;
    getCertificate(verificationCode).then(setCertificate).catch(() => setCertificate(null)).finally(() => setLoading(false));
  }, [verificationCode]);

  if (loading) return <div className="py-24 text-center text-muted-foreground">Verificando certificado…</div>;
  if (!certificate) return <div className="py-24 text-center"><h1 className="text-2xl font-bold">Certificado no encontrado</h1></div>;

  return (
    <div className="mx-auto max-w-4xl py-8">
      <div className="mb-5 flex justify-end gap-2 print:hidden">
        <Button asChild variant="outline"><Link to="/profile">Volver al perfil</Link></Button>
        <Button onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Imprimir o guardar PDF</Button>
      </div>
      <article className="relative overflow-hidden rounded-3xl border-8 border-double border-lime-700 bg-[#fbfdf5] px-8 py-14 text-center shadow-xl print:shadow-none">
        <Leaf className="absolute -left-8 -top-8 h-40 w-40 rotate-12 text-lime-100" />
        <Leaf className="absolute -bottom-8 -right-8 h-40 w-40 -rotate-12 text-lime-100" />
        <div className="relative">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-lime-700 text-white"><Award className="h-9 w-9" /></div>
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-lime-700">Ecoises certifica que</p>
          <h1 className="my-6 text-4xl font-bold text-forest-950 sm:text-5xl">{certificate.learner_name}</h1>
          <p className="mx-auto max-w-2xl text-lg text-forest-700">completó satisfactoriamente el contenido educativo</p>
          <h2 className="my-5 text-2xl font-bold text-lime-800 sm:text-3xl">{certificate.content_title}</h2>
          {certificate.final_score && <p className="text-forest-700">Resultado final: <strong>{certificate.final_score}%</strong></p>}
          <div className="mt-10 flex items-center justify-center gap-2 text-sm text-forest-700">
            {certificate.is_valid ? <CheckCircle2 className="h-5 w-5 text-lime-600" /> : null}
            {certificate.is_valid ? "Certificado válido" : "Certificado revocado"} · {new Date(certificate.issued_at).toLocaleDateString("es-CO")}
          </div>
          <p className="mt-4 break-all font-mono text-xs text-muted-foreground">Código: {certificate.verification_code}</p>
        </div>
      </article>
    </div>
  );
};

export default Certificate;
