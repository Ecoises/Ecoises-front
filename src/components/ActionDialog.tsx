
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Bird, BookOpen, Vegan, Binoculars, Glasses  } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ActionDialog = ({ open, onOpenChange }: ActionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-6 gap-4 max-w-3xl bg-gradient-to-b from-white to-lime-50 border-lime-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-heading font-bold text-forest-900">¿Qué acción deseas realizar?</h2>
         
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 mb-4">
          {/* Registrar Avistamiento */}
          <Link 
            to="/sightings/new"
            onClick={() => onOpenChange(false)}
          >
            <Card className="p-6 hover:shadow-md transition-all duration-300 hover:transform hover:-translate-y-1  bg-gradient-to-br from-sky-50 to-sky-100 h-full">
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <div className="bg-sky-200 h-20 w-20 rounded-full flex items-center justify-center">
                  <Glasses  className="h-10 w-10 text-sky-800" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-forest-900 mb-2">Registrar Avistamiento</h3>
                  <p className="text-forest-700">Añade una nueva observación de aves a tu registro personal</p>
                </div>
              </div>
            </Card>
          </Link>

          {/* Identificar Especie */}
          <Link 
            to="/identify"
            onClick={() => onOpenChange(false)}
          >
            <Card className="p-6 hover:shadow-md transition-all duration-300 hover:transform hover:-translate-y-1  bg-gradient-to-br from-lime-50 to-lime-100 h-full">
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <div className="bg-lime-200 h-20 w-20 rounded-full flex items-center justify-center">
                  <Vegan className="h-10 w-10 text-lime-800" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-forest-900 mb-2">Identificar Especie</h3>
                  <p className="text-forest-700">Utiliza nuestra herramienta para identificar especies de aves</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActionDialog;
