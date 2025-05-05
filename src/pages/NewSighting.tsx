
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Camera, 
  Search,
  Upload,
  Check
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const birdSpecies = [
  "American Robin",
  "Northern Cardinal",
  "Blue Jay",
  "American Goldfinch",
  "Red-tailed Hawk",
  "Great Blue Heron",
  "Barn Swallow",
  "Eastern Bluebird",
  "Black-capped Chickadee",
  "Downy Woodpecker",
  "Mourning Dove",
  "House Finch",
  "European Starling",
  "House Sparrow",
  "Red-winged Blackbird"
];

const NewSighting = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBird, setSelectedBird] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  // Filter bird species based on search term
  const filteredBirds = birdSpecies.filter(bird => 
    bird.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleNextStep = () => {
    if (step === 1 && !selectedBird) {
      toast({
        title: "Bird species required",
        description: "Please select a bird species to continue",
        variant: "destructive"
      });
      return;
    }
    
    if (step === 2 && !location) {
      toast({
        title: "Location required",
        description: "Please enter a location for this sighting",
        variant: "destructive"
      });
      return;
    }
    
    if (step < 3) {
      setStep((step + 1) as 1 | 2 | 3);
    } else {
      // Submit form
      toast({
        title: "Sighting recorded!",
        description: `Your sighting of ${selectedBird} has been saved.`,
        variant: "default"
      });
      navigate("/sightings");
    }
  };
  
  const handlePrevStep = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3);
    }
  };
  
  const handleSelectBird = (bird: string) => {
    setSelectedBird(bird);
  };
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="mb-6">
          <Link to="/sightings" className="text-forest-700 hover:text-forest-900 inline-flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Sightings
          </Link>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-forest-950 mb-2">Record New Sighting</h1>
          <p className="text-forest-700">Document your bird observation</p>
        </div>
        
        {/* Progress steps */}
        <div className="flex mb-8">
          <div className="flex-1 flex flex-col items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-lime-500 text-white' : 'bg-lime-100 text-lime-500'
            }`}>
              <Search className="h-5 w-5" />
            </div>
            <span className="text-sm mt-2 text-forest-800">Bird Species</span>
          </div>
          
          <div className="w-16 h-0.5 mt-5 bg-lime-200 flex-shrink-0" />
          
          <div className="flex-1 flex flex-col items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-lime-500 text-white' : 'bg-lime-100 text-lime-500'
            }`}>
              <MapPin className="h-5 w-5" />
            </div>
            <span className="text-sm mt-2 text-forest-800">Location & Time</span>
          </div>
          
          <div className="w-16 h-0.5 mt-5 bg-lime-200 flex-shrink-0" />
          
          <div className="flex-1 flex flex-col items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-lime-500 text-white' : 'bg-lime-100 text-lime-500'
            }`}>
              <Camera className="h-5 w-5" />
            </div>
            <span className="text-sm mt-2 text-forest-800">Photo & Notes</span>
          </div>
        </div>
        
        <Card className="border-lime-200 overflow-hidden">
          {/* Step 1: Bird Selection */}
          {step === 1 && (
            <div className="p-6">
              <h2 className="text-xl font-heading font-semibold text-forest-900 mb-4">
                What bird did you see?
              </h2>
              
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest-500 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search bird species..."
                    className="pl-10 bg-white rounded-xl border-lime-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="max-h-64 overflow-y-auto border rounded-xl border-lime-200 mb-6">
                {filteredBirds.length > 0 ? (
                  <ul className="divide-y divide-lime-100">
                    {filteredBirds.map(bird => (
                      <li key={bird}>
                        <button
                          className={`w-full text-left px-4 py-3 flex items-center ${
                            selectedBird === bird 
                              ? 'bg-lime-50 text-forest-900'
                              : 'text-forest-800 hover:bg-lime-50'
                          }`}
                          onClick={() => handleSelectBird(bird)}
                        >
                          <span className="flex-1">{bird}</span>
                          {selectedBird === bird && (
                            <Check className="h-4 w-4 text-lime-500" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-forest-700">
                    <p>No bird species found matching your search.</p>
                    <p className="text-sm mt-2">
                      Try a different search term or 
                      <button className="text-lime-600 hover:text-lime-700 ml-1">
                        add a new species
                      </button>
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  className="border-lime-200"
                  onClick={() => navigate("/sightings")}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-lime-500 hover:bg-lime-600 text-white"
                  onClick={handleNextStep}
                >
                  Next Step
                </Button>
              </div>
            </div>
          )}
          
          {/* Step 2: Location & Time */}
          {step === 2 && (
            <div className="p-6">
              <h2 className="text-xl font-heading font-semibold text-forest-900 mb-4">
                Where and when did you see {selectedBird}?
              </h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-forest-800 text-sm mb-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest-500 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Enter location..."
                      className="pl-10 bg-white rounded-xl border-lime-200"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-forest-800 text-sm mb-1">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest-500 h-4 w-4" />
                      <Input
                        type="date"
                        className="pl-10 bg-white rounded-xl border-lime-200"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-forest-800 text-sm mb-1">Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest-500 h-4 w-4" />
                      <Input
                        type="time"
                        className="pl-10 bg-white rounded-xl border-lime-200"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  className="border-lime-200"
                  onClick={handlePrevStep}
                >
                  Previous
                </Button>
                <Button 
                  className="bg-lime-500 hover:bg-lime-600 text-white"
                  onClick={handleNextStep}
                >
                  Next Step
                </Button>
              </div>
            </div>
          )}
          
          {/* Step 3: Photo & Notes */}
          {step === 3 && (
            <div className="p-6">
              <h2 className="text-xl font-heading font-semibold text-forest-900 mb-4">
                Add a photo and notes
              </h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-forest-800 text-sm mb-1">Upload Photo (optional)</label>
                  <div className="border-2 border-dashed border-lime-200 rounded-xl p-4 text-center">
                    {photoPreview ? (
                      <div className="space-y-3">
                        <img 
                          src={photoPreview} 
                          alt="Bird sighting" 
                          className="mx-auto max-h-48 rounded-lg object-contain"
                        />
                        <Button 
                          variant="outline" 
                          className="border-lime-200"
                          onClick={() => setPhotoPreview(null)}
                        >
                          Remove Photo
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-lime-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
                          <Camera className="h-8 w-8 text-lime-500" />
                        </div>
                        <p className="text-forest-700">Drag & drop a photo here or click to browse</p>
                        <div>
                          <label className="cursor-pointer">
                            <Button 
                              variant="outline" 
                              className="border-lime-200 gap-1"
                            >
                              <Upload className="h-4 w-4" />
                              Browse Files
                            </Button>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden"
                              onChange={handlePhotoUpload}
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-forest-800 text-sm mb-1">Notes (optional)</label>
                  <Textarea
                    placeholder="Add any observations or notes about the bird..."
                    className="bg-white border-lime-200 min-h-24"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  className="border-lime-200"
                  onClick={handlePrevStep}
                >
                  Previous
                </Button>
                <Button 
                  className="bg-lime-500 hover:bg-lime-600 text-white"
                  onClick={handleNextStep}
                >
                  Complete
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default NewSighting;
