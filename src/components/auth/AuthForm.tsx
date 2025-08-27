import React, { useState, FormEvent, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import authService from "../../services/authService";
import axios from "axios";
import { LaravelValidationError } from '../../types/api';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import GoogleSignInButton from './GoogleSignInButton';
import PasswordRequirements from './PasswordRequirements';

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Estado para los campos del formulario
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);

  // Estado para la validación de contraseña
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);

  // Estado para la interacción con la API
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  
  // Estado para mostrar/ocultar contraseñas
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const handlePasswordValidityChange = useCallback((isValid: boolean) => {
    setIsPasswordValid(isValid);
  }, []);

  const toggleForm = (): void => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setFullName("");
    setConfirmPassword("");
    setAcceptTerms(false);
    setErrorMessage("");
    setSuccessMessage("");
    setIsPasswordValid(false);
  };

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await authService.login({ email, password });
        console.log("Login exitoso. Usuario autenticado.");
        
        // Actualizar el contexto de autenticación con el usuario
        if (response.user) {
          login(response.user);
        }
        
        // Redirigir a la página anterior o al home
        const from = location.state?.from?.pathname || '/home';
        navigate(from, { replace: true });
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

  const handleGoogleSignInSuccess = async (googleIdToken: string) => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);
    try {
      const response = await authService.googleLogin(googleIdToken);
      console.log('Inicio de sesión con Google exitoso. Usuario autenticado.');

      if (response.user) {
        login(response.user);
      }

      const from = location.state?.from?.pathname || '/home';
      navigate(from, { replace: true });

    } catch (error: any) {
      console.error('Error al iniciar sesión con Google:', error);
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
        setErrorMessage("Ocurrió un error de red o un error desconocido al iniciar sesión con Google.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignInFailure = (error: any) => {
    console.error('Fallo el inicio de sesión con Google:', error);
    setErrorMessage("Fallo el inicio de sesión con Google. Por favor, inténtalo de nuevo.");
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md py-4">
      <div className="mb-8 text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <div className="flex items-center justify-center">
            <img
              src="/favicon.png"
              alt="Logo Ecoises"
              className="h-12 w-12 object-contain"
            />
          </div>
          <h1 className="text-forest-900 font-bold text-3xl">Ecoises</h1>
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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {!isLogin && (
                <PasswordRequirements 
                  password={password} 
                  onValidityChange={handlePasswordValidityChange}
                />
              )}
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                    required={!isLogin}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {!isLogin && (
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked: boolean) => setAcceptTerms(checked)}
                  required
                />
                <Label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed">
                  Acepto los{" "}
                  <a href="#" className="text-lime-600 hover:text-lime-700 underline">
                    términos y condiciones
                  </a>{" "}
                  y las{" "}
                  <a href="#" className="text-lime-600 hover:text-lime-700 underline">
                    políticas de privacidad
                  </a>
                </Label>
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
                <Link to="/forgot-password" className="text-sm text-lime-600 hover:text-lime-700">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-lime-500 hover:bg-lime-600" 
              disabled={isLoading || (!isLogin && (!acceptTerms || !isPasswordValid))}
            >
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
            <div className="flex justify-center mt-4">
              <GoogleSignInButton
                onSignInSuccess={handleGoogleSignInSuccess}
                onSignInFailure={handleGoogleSignInFailure}
              />
            </div>
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
  );
};

export default AuthForm;
