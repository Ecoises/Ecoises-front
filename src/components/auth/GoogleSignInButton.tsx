// src/components/GoogleSignInButton.tsx
import React, { useEffect, useRef } from 'react';

// Declaración global para asegurar que TypeScript reconozca `window.google`
declare global {
  interface Window {
    google: any;
  }
}

interface GoogleSignInButtonProps {
  onSignInSuccess: (token: string) => void;
  onSignInFailure: (error: any) => void;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onSignInSuccess, onSignInFailure }) => {
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Verificar si la biblioteca de Google está cargada
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // Usamos import.meta.env para Vite
        callback: (response: any) => {
          if (response.credential) {
            onSignInSuccess(response.credential); // 'credential' es el ID token
          } else {
            onSignInFailure(new Error('No se recibió credencial de Google.'));
          }
        },
      });

      // Renderizar el botón de Google en el div referenciado
      if (googleButtonRef.current) {
        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          { theme: "outline", size: "large", text: "signin_with", shape: "rectangular" } // Opciones de estilo
        );
      }
    }
  }, [onSignInSuccess, onSignInFailure]); // Dependencias del useEffect

  return (
    <div ref={googleButtonRef}></div>
  );
};

export default GoogleSignInButton;