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
                    <p className="text-muted-foreground">Última actualización: 8 de agosto de 2026</p>
                </div>

                <div className="prose prose-lime max-w-none text-forest-700">
                    <h3>1. Información que recopilamos</h3>
                    <p>
                        Recopilamos la información que proporcionas al registrarte, como nombre, correo electrónico y datos de perfil. También podemos tratar información relacionada con tus avistamientos y actividad dentro de Ecoises.
                    </p>

                    <h3>2. Ubicación y exploración local</h3>
                    <p>
                        La exploración cercana es opcional. Si autorizas la geolocalización o eliges un punto en el mapa, utilizamos sus coordenadas para consultar registros de biodiversidad alrededor de esa zona. La ubicación elegida se conserva en tu navegador durante un máximo de 24 horas y puedes eliminarla en cualquier momento con la opción “Dejar de usar ubicación”.
                    </p>
                    <p>
                        Para mostrar el nombre de un lugar y los mapas, las coordenadas o búsquedas de dirección pueden enviarse a servicios cartográficos de OpenStreetMap/Nominatim. Los datos de biodiversidad consultados provienen principalmente de GBIF y pueden enriquecerse con iNaturalist.
                    </p>

                    <h3>3. Uso de la información</h3>
                    <p>
                        Utilizamos la información para prestar, mantener y mejorar el servicio, personalizar la experiencia educativa y facilitar la exploración de biodiversidad. No utilizamos la ubicación del explorador para publicidad.
                    </p>

                    <h3>4. Información compartida</h3>
                    <p>
                        No vendemos información personal. Podemos compartir información agregada o anonimizada con fines educativos, científicos o de conservación. Los servicios externos mencionados procesan las solicitudes necesarias para proporcionar mapas, nombres de lugares y datos de biodiversidad conforme a sus propias políticas.
                    </p>

                    <h3>5. Seguridad y retención</h3>
                    <p>
                        Aplicamos medidas razonables para proteger la información contra acceso no autorizado, alteración o divulgación. Conservamos los datos únicamente durante el tiempo necesario para las finalidades descritas o para cumplir obligaciones aplicables.
                    </p>

                    <h3>6. Tus opciones y derechos</h3>
                    <p>
                        Puedes denegar el permiso de geolocalización y seleccionar manualmente una zona. También puedes borrar la ubicación guardada desde el explorador. Si tienes una cuenta, puedes solicitar acceso, corrección o eliminación de tu información personal.
                    </p>

                    <h3>7. Contacto</h3>
                    <p>
                        Si tienes preguntas sobre esta política o sobre el tratamiento de tus datos, puedes comunicarte a través de los canales de soporte de Ecoises.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;