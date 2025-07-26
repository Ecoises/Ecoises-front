import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [speciesName, setSpeciesName] = useState("");
  const [photoAuthor, setPhotoAuthor] = useState("");
  const toggleForm = () => setIsLogin(!isLogin);

  const fetchSpeciesImage = async () => {
    try {
      // Genera una página aleatoria para obtener un taxón aleatorio
      const randomPage = Math.floor(Math.random() * 10000) + 1;

      const res = await axios.get("https://api.inaturalist.org/v1/taxa", {
        params: {
          per_page: 1,
          rank: "species", // Solo un resultado
          page: randomPage, // Página aleatoria para simular aleatoriedad
          locale: "es", // Idioma español
          has_photos: true, // Filtra taxones con fotos (opcional, depende de la API)
          place_id: 7196, // ID de un lugar específico (opcional)
        },
      });

      const result = res.data.results[0];
      if (result && result.default_photo) {
        setImageUrl(result.default_photo.url.replace("square", "large"));
        setSpeciesName(result.preferred_common_name || result.name || "Especie desconocida");
        setPhotoAuthor(result.default_photo.attribution || "Autor desconocido");
      } else {
        // Si no hay imagen, reintenta con otra solicitud
        console.warn("No se encontró una imagen para la especie, reintentando...");
        fetchSpeciesImage(); // Reintenta hasta encontrar un taxón con imagen
      }
    } catch (err) {
      console.error("Error al obtener datos de iNaturalist", err);
      setImageUrl("");
      setSpeciesName("Error al cargar especie");
      setPhotoAuthor("Autor desconocido");
    }
  };

  useEffect(() => {
    fetchSpeciesImage();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Imagen decorativa (lado izquierdo) */}
      <div className="hidden lg:flex lg:w-1/2 bg-lime-50 relative">
        {imageUrl && (
          <>
            <img 
              src={imageUrl} 
              alt={speciesName} 
              className="object-cover w-full h-full"
            />
            {/* <div className="absolute bottom-8 left-8 bg-white/80 backdrop-blur-sm p-3 rounded-lg max-w-xs shadow-lg">
              <h2 className="text-lg font-heading font-bold text-forest-900 mb-0.5">{speciesName}</h2>
              <p className="text-xs text-forest-800">Foto por: {photoAuthor}</p>
            </div> */}
            {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                <h2 className="text-xl font-bold">{speciesName}</h2>
                <p className="text-xs ">Foto por: {photoAuthor}</p>
              </div> */}
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg max-w-xs">
              <p className="text-sm font-heading font-bold text mb-0.5 ">{speciesName}</p>
              <p className="text-xs text-gray-200">Foto por: {photoAuthor}</p>
            </div>
          </>
        )}
      </div>

      
      {/* Formulario de inicio de sesión (lado derecho) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <div className="bg-lime-400 h-10 w-10 rounded-lg flex items-center justify-center">
                <span className="text-forest-900 font-bold text-xl">A</span>
              </div>
              <h1 className="text-forest-900 font-bold text-2xl">Logo Here</h1>
            </div>
            <p className="text-forest-700">
              {isLogin 
                ? "Inicia sesión para continuar con tu aventura." 
                : "Crea una cuenta para comenzar tu aventura."}
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>{isLogin ? "Iniciar sesión" : "Crear cuenta"}</CardTitle>
              <CardDescription>
                {isLogin 
                  ? "Ingresa tus credenciales para acceder" 
                  : "Complete los datos para registrarte"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input id="name" placeholder="Ingresa tu nombre" />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="correo@ejemplo.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input id="password" type="password" placeholder="••••••••" />
                </div>
                
                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <Label htmlFor="remember" className="text-sm cursor-pointer">Recordarme</Label>
                    </div>
                    <a href="#" className="text-sm text-lime-600 hover:text-lime-700">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                )}
                
                <Button type="submit" className="w-full bg-lime-500 hover:bg-lime-600">
                  {isLogin ? "Iniciar sesión" : "Registrarse"}
                </Button>
                
                <div className="relative mt-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-muted-foreground">
                      O continúa con
                    </span>
                  </div>
                </div>
                
                <Button variant="outline" type="button" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" className="mr-2">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                  </svg>
                  Iniciar sesión con Google
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "¿No tienes una cuenta? " : "¿Ya tienes una cuenta? "}
                <button 
                  onClick={toggleForm} 
                  className="text-lime-600 hover:text-lime-700 font-medium"
                >
                  {isLogin ? "Regístrate" : "Inicia sesión"}
                </button>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
