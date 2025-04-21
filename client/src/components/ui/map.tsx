import { useEffect, useRef, useState } from "react";
import { Property } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface MapProps {
  properties: Property[];
  onPropertyClick?: (id: number) => void;
}

const Map = ({ properties, onPropertyClick }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // In a real app, we would use a mapping library like React Map GL
  // This is a placeholder for the map component
  useEffect(() => {
    // Simulate loading map
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleMarkerClick = (property: Property) => {
    setSelectedProperty(property);
    if (onPropertyClick) {
      onPropertyClick(property.id);
    }
  };

  return (
    <div className="relative h-full w-full">
      {isLoading ? (
        <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-xl">
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
      ) : (
        <div ref={mapRef} className="h-full w-full bg-gray-100 rounded-xl relative">
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <div className="text-center p-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-400 mb-4 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <p className="text-gray-500 text-lg font-medium">Interactive Map</p>
              <p className="text-gray-400 text-sm mt-2">
                Map would display {properties.length} properties in this area
              </p>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg">
            <button className="p-3 hover:bg-gray-100 border-b border-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button className="p-3 hover:bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Sample Property Card on Map */}
          {selectedProperty ? (
            <div className="absolute left-1/4 top-1/3">
              <Card className="w-48 shadow-lg">
                <CardContent className="p-2">
                  <img
                    src={selectedProperty.images[0]}
                    alt={selectedProperty.title}
                    className="rounded w-full h-20 object-cover mb-2"
                  />
                  <div className="text-sm font-medium">{selectedProperty.title}</div>
                  <div className="text-primary font-semibold text-sm">
                    ${selectedProperty.price}/night
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Map;
