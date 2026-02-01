import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-background py-16 px-4">
            <div className="container max-w-3xl mx-auto space-y-8">
                <Link to="/">
                    <Button variant="ghost" className="mb-4">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Volver
                    </Button>
                </Link>

                <div className="space-y-4">
                    <h1 className="text-3xl font-bold font-heading text-forest-900">Términos y Condiciones</h1>
                    <p className="text-muted-foreground">Última actualización: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="prose prose-lime max-w-none text-forest-700">
                    <h3>1. Aceptación de los Términos</h3>
                    <p>
                        Al acceder y utilizar Ecoises, aceptas estar sujeto a estos términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder al servicio.
                    </p>

                    <h3>2. Uso del Servicio</h3>
                    <p>
                        Te comprometes a utilizar la plataforma únicamente para fines legales y de una manera que no infrinja los derechos de, restrinja o inhiba el uso y disfrute de la plataforma por parte de cualquier tercero.
                    </p>

                    <h3>3. Contenido del Usuario</h3>
                    <p>
                        Eres responsable de cualquier contenido que publiques en Ecoises, incluyendo avistamientos, comentarios y fotos. Al publicar contenido, garantizas que tienes los derechos necesarios para hacerlo y otorgas a Ecoises una licencia para mostrar dicho contenido.
                    </p>

                    <h3>4. Propiedad Intelectual</h3>
                    <p>
                        El servicio y su contenido original (excluyendo el contenido proporcionado por los usuarios), características y funcionalidad son y seguirán siendo propiedad exclusiva de Ecoises y sus licenciantes.
                    </p>

                    <h3>5. Modificaciones</h3>
                    <p>
                        Nos reservamos el derecho de modificar o reemplazar estos términos en cualquier momento. Es tu responsabilidad revisar estos términos periódicamente.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
