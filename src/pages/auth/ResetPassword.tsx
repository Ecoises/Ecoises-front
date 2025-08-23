import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import SpeciesImage from "../../components/auth/SpeciesImage";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
  message: "Las contraseñas no coinciden",
  path: ["password_confirmation"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token || !email) {
      toast({
        title: "Error",
        description: "Token o email no válido",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Aquí iría la llamada a la API para resetear la contraseña
      // const response = await authService.resetPassword({
      //   token,
      //   email,
      //   password: data.password,
      //   password_confirmation: data.password_confirmation
      // });
      
      // Simulación de éxito
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "¡Contraseña actualizada!",
        description: "Tu contraseña ha sido cambiada exitosamente",
      });
      
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al cambiar la contraseña",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="flex h-screen overflow-hidden">
        <SpeciesImage />
        <div className="w-full lg:w-1/2 bg-white overflow-y-auto">
          <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
              <Card className="w-full max-w-md mx-auto shadow-lg">
                <CardHeader className="space-y-1 text-center">
                  <CardTitle className="text-2xl font-bold text-destructive">Enlace inválido</CardTitle>
                  <CardDescription>
                    El enlace para restablecer la contraseña no es válido o ha expirado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button asChild className="w-full">
                      <Link to="/forgot-password">
                        Solicitar nuevo enlace
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/login">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al inicio de sesión
                      </Link>
                    </Button>
                  </div>
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
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <Card className="w-full max-w-md mx-auto shadow-lg">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold">Nueva contraseña</CardTitle>
                <CardDescription>
                  Ingresa tu nueva contraseña para {email}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nueva contraseña</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder="Ingresa tu nueva contraseña"
                                className="pl-10 pr-10"
                                disabled={isLoading}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password_confirmation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar contraseña</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                {...field}
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirma tu nueva contraseña"
                                className="pl-10 pr-10"
                                disabled={isLoading}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Cambiando contraseña...
                        </>
                      ) : (
                        "Cambiar contraseña"
                      )}
                    </Button>
                  </form>
                </Form>

                <div className="mt-6">
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/login">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Volver al inicio de sesión
                    </Link>
                  </Button>
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