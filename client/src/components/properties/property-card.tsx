import { useState } from "react";
import { Link } from "wouter";
import { Property } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Star } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
}

const PropertyCard = ({ property, isFavorite = false }: PropertyCardProps) => {
  const { user } = useAuth();
  const [favorite, setFavorite] = useState(isFavorite);

  const addFavoriteMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/favorites", {
        propertyId: property.id,
      });
      return await res.json();
    },
    onSuccess: () => {
      setFavorite(true);
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/favorites/${property.id}`);
    },
    onSuccess: () => {
      setFavorite(false);
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    },
  });

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Redirect to auth page if not logged in
      window.location.href = "/auth";
      return;
    }
    
    if (favorite) {
      removeFavoriteMutation.mutate();
    } else {
      addFavoriteMutation.mutate();
    }
  };

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <Link href={`/property/${property.id}`} className="block relative">
        <div className="overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-60 object-cover transition-all hover:scale-105 duration-200"
          />
          <button
            className="absolute top-3 right-3 p-1.5 bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 transition-colors"
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            onClick={toggleFavorite}
            disabled={addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
          >
            <Heart 
              className={`h-5 w-5 ${favorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
          </button>
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg truncate">{property.title}</h3>
            <p className="text-gray-500">{property.city}, {property.state}</p>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 font-medium">
              {property.rating ? (property.rating / 10).toFixed(1) : "New"}
            </span>
          </div>
        </div>
        <p className="text-gray-500 mt-1">
          {property.bedrooms} {property.bedrooms === 1 ? "bedroom" : "bedrooms"} · 
          {property.bathrooms} {property.bathrooms === 1 ? "bath" : "baths"}
        </p>
        <div className="mt-3">
          <span className="font-semibold">${property.price}</span> night
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
