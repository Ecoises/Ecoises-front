import React, { useState, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import SpeciesImage from "../../components/auth/SpeciesImage";
import authService from "../../services/authService";
import { AxiosError } from "axios";
import { LaravelValidationError } from "../../types/api";

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    token: searchParams.get('token') || '',
    email: searchParams.get('email') || '',
    password: '',
    password_confirmation: ''
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Verificar que tenemos token y email
    if (!formData.token || !formData.email) {
      setError('Enlace de restablecimiento inválido o expirado');
    }
  }, [formData.token, formData.email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores específicos del campo
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");
    setFieldErrors({});

    try {
      const response = await authService.resetPassword(formData);
      
      if (response.status) {
        setIsSuccess(true);
        setMessage("Contraseña restablecida exitosamente. Redirigiendo al inicio de sesión...");
        
        // Redirigir después de 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.error || "No se pudo restablecer la contraseña.");
      }
    } catch (err) {
      const axiosError = err as AxiosError<LaravelValidationError>;
      
      if (axiosError.response?.status === 422) {
        // Errores de validación de Laravel
        const validationErrors = axiosError.response.data.errors;
        const newFieldErrors: Record<string, string> = {};
        
        Object.keys(validationErrors).forEach(field => {
          newFieldErrors[field] = validationErrors[field][0];
        });
        
        setFieldErrors(newFieldErrors);
      } else if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message);
      } else {
        setError("Ocurrió un error de conexión. Por favor, inténtalo de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Si no hay token o email válidos
  if (!formData.token || !formData.email) {
    return (
      <div className="flex h-screen overflow-hidden">
        <SpeciesImage />
        
        <div className="w-full lg:w-1/2 bg-white overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-8">
            <div className="w-full max-w-md text-center">
              <div className="mb-8">
                <div className="flex justify-center items-center gap-2 mb-4">
                  <div className="bg-lime-400 h-10 w-10 rounded-lg flex items-center justify-center">
                    <span className="text-forest-900 font-bold text-xl">E</span>
                  </div>
                  <h1 className="text-forest-900 font-bold text-2xl">Ecoises</h1>
                </div>
              </div>

              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-red-600">Enlace inválido</CardTitle>
                  <CardDescription>
                    El enlace de restablecimiento es inválido o ha expirado.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Por favor, solicita un nuevo enlace de restablecimiento.
                  </p>
                  <Link to="/forgot-password">
                    <Button className="w-full bg-lime-500 hover:bg-lime-600">
                      Solicitar nuevo enlace
                    </Button>
                  </Link>
                  <Link 
                    to="/login" 
                    className="inline-flex items-center text-sm text-lime-600 hover:text-lime-700"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Volver al inicio de sesión
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                Ingresa tu nueva contraseña
              </p> */}
            </div>

            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-lime-600" />
                </div>
                <CardTitle>Restablecer contraseña</CardTitle>
                <CardDescription>
                  {!isSuccess 
                    ? "Crea una nueva contraseña para tu cuenta"
                    : "¡Contraseña actualizada correctamente!"
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

                {/* Mensaje de error general */}
                {error && (
                  <div className="p-4 rounded-md mb-4 bg-red-50 text-red-700 border border-red-200">
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {!isSuccess ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email (solo lectura) */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        readOnly
                        className="bg-gray-50 text-gray-500"
                      />
                    </div>

                    {/* Nueva contraseña */}
                    <div className="space-y-2">
                      <Label htmlFor="password">Nueva contraseña</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Ingresa tu nueva contraseña"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          disabled={isLoading}
                          className={fieldErrors.password ? "border-red-300" : ""}
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
                      {fieldErrors.password && (
                        <p className="text-sm text-red-600">{fieldErrors.password}</p>
                      )}
                    </div>

                    {/* Confirmar contraseña */}
                    <div className="space-y-2">
                      <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
                      <div className="relative">
                        <Input
                          id="password_confirmation"
                          name="password_confirmation"
                          type={showPasswordConfirmation ? "text" : "password"}
                          placeholder="Confirma tu nueva contraseña"
                          value={formData.password_confirmation}
                          onChange={handleChange}
                          required
                          disabled={isLoading}
                          className={fieldErrors.password_confirmation ? "border-red-300" : ""}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                        >
                          {showPasswordConfirmation ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {fieldErrors.password_confirmation && (
                        <p className="text-sm text-red-600">{fieldErrors.password_confirmation}</p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-lime-500 hover:bg-lime-600" 
                      disabled={isLoading || !formData.password || !formData.password_confirmation}
                    >
                      {isLoading ? "Restableciendo..." : "Restablecer contraseña"}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Serás redirigido al inicio de sesión en unos segundos...
                    </p>
                    <Link to="/login">
                      <Button className="w-full bg-lime-500 hover:bg-lime-600">
                        Ir al inicio de sesión ahora
                      </Button>
                    </Link>
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

export default ResetPassword;