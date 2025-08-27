
import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordRequirement {
  text: string;
  test: (password: string) => boolean;
}

interface PasswordRequirementsProps {
  password: string;
  onValidityChange: (isValid: boolean) => void;
}

const requirements: PasswordRequirement[] = [
  {
    text: "Al menos 8 caracteres",
    test: (password) => password.length >= 8
  },
  {
    text: "Una letra mayúscula (A-Z)",
    test: (password) => /[A-Z]/.test(password)
  },
  {
    text: "Una letra minúscula (a-z)",
    test: (password) => /[a-z]/.test(password)
  },
  {
    text: "Un número (0-9)",
    test: (password) => /[0-9]/.test(password)
  },
  {
    text: "Un carácter especial (!@#$%^&*)",
    test: (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  }
];

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password, onValidityChange }) => {
  React.useEffect(() => {
    const allMet = requirements.every(req => req.test(password));
    onValidityChange(allMet);
  }, [password, onValidityChange]);

  if (!password) {
    return null;
  }

  return (
    <div className="mt-2 p-3 bg-gray-50 rounded-md">
      <p className="text-sm font-medium text-gray-700 mb-2">Requisitos de contraseña:</p>
      <ul className="space-y-1">
        {requirements.map((requirement, index) => {
          const isMet = requirement.test(password);
          return (
            <li key={index} className={`flex items-center text-sm ${isMet ? 'text-green-600' : 'text-red-600'}`}>
              {isMet ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <X className="h-4 w-4 mr-2" />
              )}
              {requirement.text}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PasswordRequirements;
