import React, { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import SpeciesImage from "../../components/auth/SpeciesImage";
import authService from "../../services/authService";
import { AxiosError } from "axios";
import { LaravelValidationError } from "../../types/api";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await authService.forgotPassword({ email });
      
      if (response.status) {
        setIsSuccess(true);
        setMessage(response.message || "Se ha enviado un enlace de recuperación a tu correo electrónico.");
      } else {
        setError(response.error || "No se pudo enviar el enlace de recuperación.");
      }
    } catch (err) {
      const axiosError = err as AxiosError<LaravelValidationError>;
      
      if (axiosError.response?.status === 422) {
        // Errores de validación de Laravel
        const validationErrors = axiosError.response.data.errors;
        if (validationErrors.email) {
          setError(validationErrors.email[0]);
        } else {
          setError(axiosError.response.data.message);
        }
      } else if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message);
      } else {
        setError("Ocurrió un error de conexión. Por favor, inténtalo de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setEmail("");
    setMessage("");
    setError("");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <SpeciesImage />
      
      {/* Formulario (lado derecho) */}
      <div className="w-full lg:w-1/2 bg-white overflow-y-auto">
        <div className="flex items-center justify-center min-h-full p-8">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="flex justify-center items-center gap-2 mb-4">
                <div className="bg-lime-400 h-10 w-10 rounded-lg flex items-center justify-center">
                  <span className="text-forest-900 font-bold text-xl">E</span>
                </div>
                <h1 className="text-forest-900 font-bold text-2xl">Ecoises</h1>
              </div>
              {/* <p className="text-forest-700">
                Te ayudamos a recuperar el acceso a tu cuenta
              </p> */}
            </div>

            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-lime-600" />
                </div>
                <CardTitle>¿Olvidaste tu contraseña?</CardTitle>
                <CardDescription>
                  {!isSuccess 
                    ? "Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña"
                    : "Revisa tu bandeja de entrada"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Mensaje de éxito */}
                {message && isSuccess && (
                  <div className="p-4 rounded-md mb-4 bg-green-50 text-green-700 border border-green-200">
                    <p className="text-sm">{message}</p>
                  </div>
                )}

                {/* Mensaje de error */}
                {error && (
                  <div className="p-4 rounded-md mb-4 bg-red-50 text-red-700 border border-red-200">
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {!isSuccess ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-lime-500 hover:bg-lime-600" 
                      disabled={isLoading || !email.trim()}
                    >
                      {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
                    </p>
                    <Button 
                      onClick={resetForm}
                      variant="outline"
                      className="w-full"
                    >
                      Intentar con otro email
                    </Button>
                  </div>
                )}

                <div className="mt-6 text-center">
                  <Link 
                    to="/login" 
                    className="inline-flex items-center text-sm text-lime-600 hover:text-lime-700"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Volver al inicio de sesión
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;