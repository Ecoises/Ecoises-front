import React from "react";
import SpeciesImage from "../../components/auth/SpeciesImage";
import AuthForm from "../../components/auth/AuthForm";

const Login: React.FC = () => {

  return (
    <div className="flex h-screen overflow-hidden">
      <SpeciesImage />
      
      {/* Formulario de inicio de sesión (lado derecho) - Con scroll */}
      <div className="w-full lg:w-1/2 bg-white overflow-y-auto">
        <div className="flex items-center justify-center min-h-full p-8">
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default Login;