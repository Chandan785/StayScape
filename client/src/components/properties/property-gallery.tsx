import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface PropertyGalleryProps {
  images: string[];
}

const PropertyGallery = ({ images }: PropertyGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div>
      {/* Grid Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8">
        <Dialog>
          <div className="md:col-span-2 md:row-span-2">
            <DialogTrigger className="w-full h-full">
              <img
                src={images[0]}
                alt="Main view"
                className="w-full h-full object-cover rounded-tl-xl rounded-bl-xl cursor-pointer"
              />
            </DialogTrigger>
          </div>
          {images.slice(1, 5).map((image, index) => {
            // Determine corner rounding
            let roundedClasses = "";
            if (index === 1) roundedClasses = "rounded-tr-xl";
            if (index === 3) roundedClasses = "rounded-br-xl";

            return (
              <Dialog key={index}>
                <DialogTrigger className="w-full h-full">
                  <img
                    src={image}
                    alt={`Property view ${index + 2}`}
                    className={`w-full h-full object-cover ${roundedClasses} cursor-pointer`}
                  />
                </DialogTrigger>
                <DialogContent className="max-w-screen-xl">
                  <FullGallery
                    images={images}
                    startIndex={index + 1}
                    onClose={() => {}}
                  />
                </DialogContent>
              </Dialog>
            );
          })}

          <DialogContent className="max-w-screen-xl">
            <FullGallery 
              images={images} 
              startIndex={currentImageIndex} 
              onClose={() => {}}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

interface FullGalleryProps {
  images: string[];
  startIndex: number;
  onClose: () => void;
}

const FullGallery = ({ images, startIndex, onClose }: FullGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="absolute top-0 right-0 z-10">
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full h-full">
          <img
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
            className="max-h-[80vh] mx-auto object-contain"
          />
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <div className="flex space-x-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyGallery;
