import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const PrivacyPolicy = () => {
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
                    <h1 className="text-3xl font-bold font-heading text-forest-900">Política de Privacidad</h1>
                    <p className="text-muted-foreground">Última actualización: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="prose prose-lime max-w-none text-forest-700">
                    <h3>1. Recopilación de Información</h3>
                    <p>
                        Recopilamos la información que nos proporcionas directamente al registrarte, como tu nombre, dirección de correo electrónico y datos de perfil. También recopilamos datos sobre tus avistamientos y actividad en la plataforma.
                    </p>

                    <h3>2. Uso de la Información</h3>
                    <p>
                        Utilizamos la información recopilada para proporcionar, mantener y mejorar nuestros servicios, así como para comunicarnos contigo y personalizar tu experiencia de aprendizaje y exploración.
                    </p>

                    <h3>3. Compartir Información</h3>
                    <p>
                        No vendemos tu información personal a terceros. Podemos compartir información agregada o anonimizada con fines de investigación científica o conservación.
                    </p>

                    <h3>4. Seguridad de los Datos</h3>
                    <p>
                        Implementamos medidas de seguridad razonables para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.
                    </p>

                    <h3>5. Tus Derechos</h3>
                    <p>
                        Tienes derecho a acceder, corregir o eliminar tu información personal. Puedes gestionar tus preferencias de privacidad desde la configuración de tu cuenta.
                    </p>

                    <h3>6. Contacto</h3>
                    <p>
                        Si tienes preguntas sobre esta política de privacidad, puedes contactarnos a través de nuestro soporte.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
