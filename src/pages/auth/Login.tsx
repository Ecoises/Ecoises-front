import React, { useEffect, useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import authService from "../../services/authService";
import axios, { AxiosError } from "axios";
import { INatResponse, LaravelValidationError } from '../../types/api';
import { useNavigate } from 'react-router-dom';

// Si usas un router (ej. react-router-dom) para la navegación, impórtalo:
// import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [speciesName, setSpeciesName] = useState<string>("");
  const [photoAttribution, setPhotoAttribution] = useState<string>("");
  const [imageLoading, setImageLoading] = useState<boolean>(true); // Estado de carga para la imagen
  const [imageError, setImageError] = useState<boolean>(false);     // Estado de error para la imagen
  const navigate = useNavigate();

  // --- ESTADO PARA LOS CAMPOS DEL FORMULARIO ---
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  // --- ESTADO PARA LA INTERACCIÓN CON LA API DE AUTENTICACIÓN ---
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // const navigate = useNavigate();

  const toggleForm = (): void => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setFullName("");
    setConfirmPassword("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  // --- Lógica para obtener la imagen de especie ---
  const fetchSpeciesImage = async (retryCount: number = 0): Promise<void> => {
    setImageLoading(true); // Se inicia la carga
    setImageError(false);
    setImageUrl("");
    setSpeciesName("");
    setPhotoAttribution("");
    // setImageFullyLoaded(false); // Eliminado

    try {
      const MAX_RETRIES = 5;
      if (retryCount >= MAX_RETRIES) {
        console.error("Máximo de reintentos alcanzado para la imagen.");
        throw new Error("Máximo de reintentos alcanzado para la imagen.");
      }

      const randomPage: number = Math.floor(Math.random() * 10000) + 1;

      const res = await axios.get<INatResponse>("https://api.inaturalist.org/v1/taxa", {
        params: {
          per_page: 1,
          rank: "species",
          page: randomPage,
          locale: "es",
          has_photos: true,
          place_id: 7196, // Codazzi, Cesar, Colombia
        },
      });

      const result = res.data.results[0];
      if (result && result.default_photo) {
        setImageUrl(result.default_photo.url.replace("square", "large"));
        setSpeciesName(result.preferred_common_name || result.name || "Especie desconocida");

        const fullAttribution: string = result.default_photo.attribution || "Autor desconocido";
        let author: string = "Autor desconocido";
        let license: string = "";
        const match = fullAttribution.match(/\(c\)\s*([^,]+),\s*some rights reserved\s*\((.+?)\)/);
        if (match) {
            author = match[1].trim();
            license = match[2].trim();
        } else if (fullAttribution.includes("(c)")) {
            const simpleAuthorMatch = fullAttribution.match(/\(c\)\s*([^\(]+?)(?:,|$|\()/);
            if (simpleAuthorMatch && simpleAuthorMatch[1]) {
                author = simpleAuthorMatch[1].trim();
            }
        }
        setPhotoAttribution(`${author}${license ? ` (${license})` : ''}`);

      } else {
        console.warn("No se encontró una imagen para la especie, reintentando...", retryCount + 1);
        fetchSpeciesImage(retryCount + 1);
      }
    } catch (err: any) {
      console.error("Error al obtener datos de iNaturalist", err);
      setImageError(true);
      setImageUrl("");
      setSpeciesName("Error al cargar imagen");
      setPhotoAttribution("No disponible");
    } finally {
      setImageLoading(false); // La carga finaliza, el indicador desaparecerá
    }
  };

  useEffect(() => {
    fetchSpeciesImage();
  }, []);

  // --- Lógica para el envío del formulario de autenticación ---
  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (isLogin) {
        await authService.login({ email, password });
        console.log("Login exitoso. Usuario autenticado.");
        navigate('/home');
      } else {
        await authService.register({
            full_name: fullName,
            email: email,
            password: password,
            password_confirmation: confirmPassword
        });
        console.log("Registro exitoso.");
        setSuccessMessage("¡Registro exitoso! Ahora puedes iniciar sesión.");
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error("Error de autenticación:", error);
      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data;
        if (typeof apiError === 'object' && apiError !== null && 'message' in apiError && typeof apiError.message === 'string') {
          setErrorMessage(apiError.message);
        } else if (typeof apiError === 'object' && apiError !== null && 'errors' in apiError && typeof apiError.errors === 'object') {
          const validationErrors: LaravelValidationError = apiError as LaravelValidationError;
          const messages: string[] = Object.values(validationErrors.errors).flat();
          setErrorMessage(messages.join(" "));
        }
      } else {
        setErrorMessage("Ocurrió un error de red o un error desconocido. Inténtalo de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Imagen decorativa (lado izquierdo) - Fija, sin scroll */}
      <div className="hidden lg:flex lg:w-1/2 bg-lime-50 relative overflow-hidden">
        {/* El degradado de capa (que pediste quitar) no está aquí. */}

        {/* Indicador de carga para la imagen (sobre el fondo bg-lime-50) */}
        {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-lime-100 text-gray-700 text-lg animate-pulse"> {/* Un color más claro para la carga */}
                Cargando imagen...
            </div>
        )}
        {/* Indicador de error para la imagen (sobre el fondo bg-lime-50) */}
        {imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-100 text-red-700 p-4 text-center">
                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p>Error al cargar la imagen. Inténtalo de nuevo.</p>
            </div>
        )}

        {/* La imagen real, condicional y con transición de opacidad */}
        {imageUrl && !imageLoading && !imageError && (
          <img
            src={imageUrl}
            alt={speciesName || "Imagen de especie"}
            className="object-cover w-full h-full transition-opacity duration-500 ease-in-out opacity-0" // Se mantiene la transición para el fade-in
            onLoad={(e) => {
                e.currentTarget.classList.add('opacity-100');
                // No necesitamos setImageFullyLoaded si no hay degradado complejo
            }}
            onError={() => {
                setImageError(true);
                setImageLoading(false);
            }}
          />
        )}
        {/* La caja de información de la imagen, visible solo si hay una imagen cargada y sin error */}
        {imageUrl && !imageLoading && !imageError && (
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg max-w-xs">
              <p className="text-sm font-heading font-bold text mb-0.5 ">{speciesName}</p>
              <p className="text-xs text-gray-200"> Foto: (c) {photoAttribution}</p>
            </div>
        )}
      </div>


      {/* Formulario de inicio de sesión (lado derecho) - Con scroll */}
      <div className="w-full lg:w-1/2 bg-white overflow-y-auto">
        <div className="flex items-center justify-center min-h-full p-8">
          <div className="w-full max-w-md py-4">
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
              {/* Mensajes de error y éxito */}
              {errorMessage && (
                <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-green-500 text-sm mb-4">{successMessage}</p>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nombre completo</Label>
                    <Input
                      id="fullName"
                      placeholder="Ingresa tu nombre"
                      value={fullName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked: boolean) => setRememberMe(checked)}
                      />
                      <Label htmlFor="remember" className="text-sm cursor-pointer">Recordarme</Label>
                    </div>
                    <a href="#" className="text-sm text-lime-600 hover:text-lime-700">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                )}

                <Button type="submit" className="w-full bg-lime-500 hover:bg-lime-600" disabled={isLoading}>
                  {isLoading ? "Cargando..." : (isLogin ? "Iniciar sesión" : "Registrarse")}
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
    </div>
  );
};

export default Login;