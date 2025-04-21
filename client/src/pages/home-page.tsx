import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Property } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PropertyCard from "@/components/properties/property-card";
import PropertyFilters from "@/components/properties/property-filters";
import Map from "@/components/ui/map";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const [location] = useLocation();
  const { toast } = useToast();
  const [showMap, setShowMap] = useState(false);
  
  // Parse query params
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const searchQuery = searchParams.get("search") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const bedrooms = searchParams.get("bedrooms") || "";
  const bathrooms = searchParams.get("bathrooms") || "";
  const propertyType = searchParams.get("propertyType") || "";
  
  // Build API URL with query params
  let apiUrl = "/api/properties";
  const queryParams: string[] = [];
  
  if (searchQuery) queryParams.push(`search=${encodeURIComponent(searchQuery)}`);
  if (minPrice) queryParams.push(`minPrice=${minPrice}`);
  if (maxPrice) queryParams.push(`maxPrice=${maxPrice}`);
  if (bedrooms) queryParams.push(`bedrooms=${bedrooms}`);
  if (bathrooms) queryParams.push(`bathrooms=${bathrooms}`);
  if (propertyType) queryParams.push(`propertyType=${propertyType}`);
  
  if (queryParams.length > 0) {
    apiUrl += `?${queryParams.join("&")}`;
  }
  
  // Fetch properties
  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: [apiUrl],
  });

  // Fetch user's favorites to mark favorite properties
  const { data: favorites } = useQuery<{ property: Property; favorite: any }[]>({
    queryKey: ["/api/favorites"],
    enabled: false, // Only fetch when user is logged in
  });

  // Show error toast if fetch fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading properties",
        description: "There was a problem loading the properties. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Check if a property is in user's favorites
  const isFavorite = (propertyId: number) => {
    if (!favorites) return false;
    return favorites.some(fav => fav.property.id === propertyId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PropertyFilters />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Search summary if search was performed */}
          {searchQuery && (
            <h1 className="text-2xl font-semibold mb-6">
              {isLoading 
                ? "Searching properties..." 
                : `${properties?.length || 0} properties found for "${searchQuery}"`}
            </h1>
          )}
          
          {/* Properties Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="h-60 w-full rounded-xl" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          ) : properties && properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  isFavorite={isFavorite(property.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-2">No properties found</h2>
              <p className="text-gray-500 mb-6">
                {searchQuery 
                  ? `We couldn't find any properties matching "${searchQuery}"`
                  : "Try adjusting your filters to see more results"}
              </p>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = "/"}
              >
                Clear all filters
              </Button>
            </div>
          )}
          
          {/* Map Section */}
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Explore properties on the map</h2>
              <Button 
                variant="outline"
                onClick={() => setShowMap(!showMap)}
              >
                {showMap ? "Hide Map" : "Show Map"}
              </Button>
            </div>
            
            {showMap && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden" style={{ height: "500px" }}>
                <Map properties={properties || []} />
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
