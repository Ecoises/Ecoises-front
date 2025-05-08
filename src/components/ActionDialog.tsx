
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Bird, BookOpen, X } from "lucide-react";

interface ActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ActionDialog = ({ open, onOpenChange }: ActionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 border-none max-w-3xl">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-full h-8 w-8 flex items-center justify-center z-10 bg-white/80 hover:bg-white"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Registrar Avistamiento */}
          <Link 
            to="/sightings/new"
            className="p-8 bg-pink-50 hover:bg-pink-100 transition-colors flex flex-col items-center justify-center gap-4 text-center min-h-[230px]"
            onClick={() => onOpenChange(false)}
          >
            <div className="bg-pink-200 h-20 w-20 rounded-full flex items-center justify-center">
              <Bird className="h-10 w-10 text-pink-800" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-700">Registrar Avistamiento</h3>
              <p className="text-sm text-gray-500">subtítulo</p>
            </div>
          </Link>

          {/* Identificar Especie */}
          <Link 
            to="/explorer"
            className="p-8 bg-lime-50 hover:bg-lime-100 transition-colors flex flex-col items-center justify-center gap-4 text-center min-h-[230px]"
            onClick={() => onOpenChange(false)}
          >
            <div className="bg-lime-200 h-20 w-20 rounded-full flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-lime-800" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-700">Identificar Especie</h3>
              <p className="text-sm text-gray-500">subtítulo</p>
            </div>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActionDialog;
