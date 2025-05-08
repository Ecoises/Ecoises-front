
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Image, Search, Upload, Check, X, ChevronDown, List } from "lucide-react";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// Sample identification results
const identificationResults = [
  {
    id: 1,
    name: "Northern Cardinal",
    scientificName: "Cardinalis cardinalis",
    probability: 92,
    image: "https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=600&h=400",
    description: "El cardenal norteño es un ave cantora de tamaño mediano con un pico cónico corto y grueso. El macho es de color rojo brillante con la cara negra y cresta prominente.",
    habitat: "Bosques, jardines, parques urbanos",
    characteristics: [
      "Color rojo brillante (machos)",
      "Cresta prominente",
      "Canto melodioso",
      "Pico cónico fuerte"
    ]
  },
  {
    id: 2,
    name: "Scarlet Tanager",
    scientificName: "Piranga olivacea",
    probability: 74,
    image: "https://images.unsplash.com/photo-1572402230267-f3e267c1e5a2?auto=format&fit=crop&w=600&h=400",
    description: "La tangara escarlata es un ave mediana con un cuerpo compacto. Los machos son de color rojo brillante con alas y cola negras durante la época de reproducción.",
    habitat: "Bosques deciduos maduros, especialmente robledales",
    characteristics: [
      "Color rojo escarlata (machos en verano)",
      "Alas y cola negras",
      "Canto áspero distintivo",
      "Cambio estacional de plumaje"
    ]
  },
  {
    id: 3,
    name: "Summer Tanager",
    scientificName: "Piranga rubra",
    probability: 61,
    image: "https://images.unsplash.com/photo-1595262082988-8087d3b1716b?auto=format&fit=crop&w=600&h=400",
    description: "La tangara roja es un ave cantora de tamaño mediano donde el macho adulto es completamente rojo, sin alas ni cola negras como la tangara escarlata.",
    habitat: "Bosques abiertos de pino y roble, bordes de bosque",
    characteristics: [
      "Color rojo uniforme (machos)",
      "Sin contraste negro en alas o cola",
      "Pico más pálido y robusto",
      "Canto melodioso y repetitivo"
    ]
  },
];

const Identify = () => {
  const [step, setStep] = useState<"upload" | "results">("upload");
  const [uploadType, setUploadType] = useState<"image" | "characteristics">("image");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(identificationResults);

  const form = useForm({
    defaultValues: {
      color: 50,
      size: 50,
      beak: 50,
      habitat: "",
      region: "",
    }
  });

  const handleUpload = () => {
    setIsProcessing(true);
    // Simulate processing delay
    setTimeout(() => {
      setStep("results");
      setIsProcessing(false);
    }, 1500);
  };

  const handleCharacteristicSubmit = () => {
    setIsProcessing(true);
    // Simulate processing delay
    setTimeout(() => {
      setStep("results");
      setIsProcessing(false);
    }, 1500);
  };

  const resetIdentification = () => {
    setStep("upload");
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-forest-950 mb-2">Identificador de Especies</h1>
        <p className="text-forest-700">Identifica aves por imagen o características</p>
      </div>

      {step === "upload" && (
        <Card className="overflow-hidden border-lime-200">
          <div className="flex flex-col md:flex-row">
            {/* Tab selection */}
            <div className="flex md:flex-col border-b md:border-b-0 md:border-r border-lime-200 bg-lime-50/50">
              <button
                className={`flex items-center gap-2 p-4 md:py-6 flex-1 md:w-56 ${
                  uploadType === "image" ? "bg-white" : ""
                }`}
                onClick={() => setUploadType("image")}
              >
                <div className={`p-2 rounded-full ${
                  uploadType === "image" ? "bg-lime-100 text-lime-800" : "bg-gray-100 text-gray-500"
                }`}>
                  <Image className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className={`font-medium ${uploadType === "image" ? "text-forest-900" : "text-gray-500"}`}>
                    Subir Imagen
                  </p>
                  <p className="text-xs text-gray-500 hidden md:block">Identificación con foto</p>
                </div>
              </button>

              <button
                className={`flex items-center gap-2 p-4 md:py-6 flex-1 md:w-56 ${
                  uploadType === "characteristics" ? "bg-white" : ""
                }`}
                onClick={() => setUploadType("characteristics")}
              >
                <div className={`p-2 rounded-full ${
                  uploadType === "characteristics" ? "bg-lime-100 text-lime-800" : "bg-gray-100 text-gray-500"
                }`}>
                  <List className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className={`font-medium ${uploadType === "characteristics" ? "text-forest-900" : "text-gray-500"}`}>
                    Características
                  </p>
                  <p className="text-xs text-gray-500 hidden md:block">Identificación por rasgos</p>
                </div>
              </button>
            </div>

            <div className="p-6 flex-1">
              {uploadType === "image" ? (
                <div className="space-y-4">
                  <h2 className="text-xl font-medium text-forest-900">Sube una foto del ave</h2>
                  <p className="text-gray-500 text-sm">
                    Sube una imagen clara del ave para obtener los mejores resultados. 
                    Imágenes con buena luz y donde el ave es claramente visible funcionan mejor.
                  </p>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="mx-auto bg-lime-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                      <Upload className="h-8 w-8 text-lime-700" />
                    </div>
                    <h3 className="font-medium text-forest-800 mb-1">Arrastra aquí tu imagen</h3>
                    <p className="text-sm text-gray-500 mb-4">o haz click para seleccionar archivo</p>
                    <Button variant="secondary" size="sm">Seleccionar archivo</Button>
                    <input type="file" className="hidden" />
                  </div>

                  <div className="mt-8">
                    <Button 
                      className="w-full bg-lime-600 hover:bg-lime-700"
                      onClick={handleUpload}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Procesando..." : "Identificar Ave"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-xl font-medium text-forest-900">Describe las características del ave</h2>
                  <p className="text-gray-500 text-sm">
                    Ajusta los siguientes parámetros según las características del ave que observaste.
                  </p>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleCharacteristicSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Color predominante</FormLabel>
                            <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                              <div className="text-left text-gray-500">Marrón/gris</div>
                              <div className="text-center text-gray-500">Amarillo/verde</div>
                              <div className="text-right text-gray-500">Rojo/naranja</div>
                            </div>
                            <FormControl>
                              <Slider 
                                defaultValue={[50]} 
                                min={0} 
                                max={100} 
                                step={1} 
                                onValueChange={(vals) => field.onChange(vals[0])}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tamaño</FormLabel>
                            <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                              <div className="text-left text-gray-500">Pequeño (colibrí)</div>
                              <div className="text-center text-gray-500">Mediano (paloma)</div>
                              <div className="text-right text-gray-500">Grande (águila)</div>
                            </div>
                            <FormControl>
                              <Slider 
                                defaultValue={[50]} 
                                min={0} 
                                max={100} 
                                step={1} 
                                onValueChange={(vals) => field.onChange(vals[0])}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="beak"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de pico</FormLabel>
                            <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                              <div className="text-left text-gray-500">Corto y grueso</div>
                              <div className="text-center text-gray-500">Mediano</div>
                              <div className="text-right text-gray-500">Largo y delgado</div>
                            </div>
                            <FormControl>
                              <Slider 
                                defaultValue={[50]} 
                                min={0} 
                                max={100} 
                                step={1} 
                                onValueChange={(vals) => field.onChange(vals[0])}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="habitat"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hábitat</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Ej: bosque, lago, jardín"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="region"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Región geográfica</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Ej: norte de México, Yucatán"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-lime-600 hover:bg-lime-700 mt-4"
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Procesando..." : "Identificar Ave"}
                      </Button>
                    </form>
                  </Form>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {step === "results" && (
        <div className="space-y-6">
          <Card className="overflow-hidden border-lime-200">
            <div className="bg-lime-100 p-4 border-b border-lime-200 flex justify-between items-center">
              <div>
                <h2 className="font-medium text-forest-900">Resultados de identificación</h2>
                <p className="text-sm text-forest-700">Basados en {uploadType === "image" ? "la imagen" : "las características"} proporcionadas</p>
              </div>
              <Button variant="outline" size="sm" className="border-lime-200" onClick={resetIdentification}>
                Nueva búsqueda
              </Button>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-1 lg:col-span-1">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-forest-900">Posibles coincidencias</h3>
                    <div className="space-y-2">
                      {results.map((result) => (
                        <div 
                          key={result.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border ${
                            result.id === 1 ? "border-lime-500 bg-lime-50" : "border-gray-200 hover:bg-lime-50/50"
                          } cursor-pointer transition-colors`}
                        >
                          <img 
                            src={result.image} 
                            alt={result.name} 
                            className="h-12 w-12 object-cover rounded-lg" 
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-forest-900 truncate">{result.name}</h4>
                            <p className="text-xs text-gray-500 italic">{result.scientificName}</p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            result.probability > 90 ? "bg-lime-100 text-lime-800" :
                            result.probability > 70 ? "bg-amber-100 text-amber-800" :
                            "bg-orange-100 text-orange-800"
                          }`}>
                            {result.probability}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-span-1 lg:col-span-2 space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="text-2xl font-bold text-forest-900">{results[0].name}</h3>
                        <p className="text-forest-700 italic">{results[0].scientificName}</p>
                      </div>
                      <div className="bg-lime-100 text-lime-800 px-3 py-1 rounded-full text-sm font-medium">
                        {results[0].probability}% coincidencia
                      </div>
                    </div>

                    <div className="aspect-w-16 aspect-h-9 mb-4 rounded-xl overflow-hidden">
                      <img 
                        src={results[0].image} 
                        alt={results[0].name}
                        className="w-full h-full object-cover" 
                      />
                    </div>

                    <p className="text-gray-700 mb-4">{results[0].description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <h4 className="font-medium text-forest-900 mb-2">Características</h4>
                        <ul className="space-y-1">
                          {results[0].characteristics.map((char, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-lime-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{char}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-forest-900 mb-2">Hábitat</h4>
                        <p className="text-sm text-gray-700">{results[0].habitat}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link to={`/species/${results[0].id}`}>
                        <Button className="bg-forest-700 hover:bg-forest-800">Ver detalle completo</Button>
                      </Link>
                      <Button variant="outline" className="border-lime-200">Guardar identificación</Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-forest-900 mb-3">Imágenes de referencia</h4>
                    <Carousel className="w-full">
                      <CarouselContent>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                              <div className="overflow-hidden rounded-xl aspect-square bg-gray-100">
                                <img 
                                  src={results[0].image} 
                                  alt={`${results[0].name} ${index + 1}`}
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <div className="flex justify-center mt-4 gap-2">
                        <CarouselPrevious className="static relative translate-y-0" />
                        <CarouselNext className="static relative translate-y-0" />
                      </div>
                    </Carousel>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Identify;
