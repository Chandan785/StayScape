import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PropertyCard from "@/components/properties/property-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HeartOff } from "lucide-react";

export default function FavoritesPage() {
  const { toast } = useToast();
  
  const {
    data: favorites,
    isLoading,
    error,
  } = useQuery<{ property: any; favorite: any }[]>({
    queryKey: ["/api/favorites"],
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading favorites",
        description: "There was a problem loading your favorite properties. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Favorites</h1>
          <p className="text-gray-500">Properties you've saved for later</p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-60 w-full rounded-xl" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : favorites && favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map(({ property, favorite }) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                isFavorite={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="bg-gray-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
              <HeartOff className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-gray-500 mb-6">
              When you find properties you love, save them to your favorites for easy access later.
            </p>
            <Link href="/">
              <Button>
                Explore properties
              </Button>
            </Link>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
