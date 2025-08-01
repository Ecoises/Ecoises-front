import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');

    if (token) {
      // Almacenar el token y redirigir al dashboard
      localStorage.setItem('auth_token', token);
      navigate('/home', { replace: true });
    } else if (error) {
      // Manejar error y redirigir al login
      console.error('Error de autenticación con Google:', error);
      navigate('/login', { 
        replace: true, 
        state: { error: 'Error al iniciar sesión con Google' } 
      });
    } else {
      // Sin token ni error, redirigir al login
      navigate('/login', { replace: true });
    }
  }, [navigate, location.search]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Procesando autenticación...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleCallback;