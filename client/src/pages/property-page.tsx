import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PropertyDetail from "@/components/properties/property-detail";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PropertyPage() {
  const [match, params] = useRoute("/property/:id");
  const { toast } = useToast();
  const propertyId = params?.id ? parseInt(params.id) : null;

  const {
    data: property,
    isLoading,
    error,
  } = useQuery<Property>({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: !!propertyId,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading property",
        description: "There was a problem loading the property details. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (!match) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Back button */}
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to listings
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-2/3 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8">
              <div className="md:col-span-2 md:row-span-2">
                <Skeleton className="h-96 w-full rounded-tl-xl rounded-bl-xl" />
              </div>
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full rounded-tr-xl" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full rounded-br-xl" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Skeleton className="h-24 w-full mb-6" />
                <Skeleton className="h-64 w-full mb-6" />
                <Skeleton className="h-64 w-full" />
              </div>
              <div>
                <Skeleton className="h-96 w-full rounded-xl" />
              </div>
            </div>
          </div>
        ) : property ? (
          <PropertyDetail property={property} />
        ) : (
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-semibold mb-4">Property not found</h1>
            <p className="text-gray-500 mb-6">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/">
              <Button>
                Back to home
              </Button>
            </Link>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
