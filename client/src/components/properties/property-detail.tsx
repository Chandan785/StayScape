import { Property } from "@shared/schema";
import PropertyGallery from "./property-gallery";
import BookingForm from "./booking-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  Medal, 
  MapPin, 
  Key, 
  Droplet, 
  ChefHat, 
  Wifi, 
  Tv, 
  Snowflake, 
  Car, 
  Shirt, 
  Heater 
} from "lucide-react";

interface PropertyDetailProps {
  property: Property;
}

const PropertyDetail = ({ property }: PropertyDetailProps) => {
  return (
    <div className="container mx-auto px-4 py-4">
      {/* Property Title */}
      <h1 className="text-2xl md:text-3xl font-semibold mb-2">{property.title}</h1>
      <div className="flex flex-wrap items-center text-gray-700 mb-4">
        <div className="flex items-center mr-4">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
          <span className="font-medium">
            {property.rating ? (property.rating / 10).toFixed(1) : "New"}
          </span>
          <span className="mx-1">·</span>
          <a href="#reviews" className="underline">
            {property.reviews} {property.reviews === 1 ? "review" : "reviews"}
          </a>
        </div>
        <span className="mr-4">{property.city}, {property.state}, {property.country}</span>
      </div>

      {/* Photo Gallery */}
      <PropertyGallery images={property.images} />

      {/* Property Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {/* Left Side: Details */}
        <div className="md:col-span-2">
          <div className="flex items-start justify-between border-b border-gray-200 pb-6">
            <div>
              <h2 className="text-xl font-semibold">
                {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)} hosted by Host
              </h2>
              <p>
                {property.bedrooms} {property.bedrooms === 1 ? "bedroom" : "bedrooms"} · 
                {property.guests} {property.guests === 1 ? "guest" : "guests"} · 
                {property.bathrooms} {property.bathrooms === 1 ? "bath" : "baths"}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center">
              <span className="text-white text-xl">H</span>
            </div>
          </div>

          {/* Features */}
          <div className="py-6 border-b border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center">
                <div className="mr-4 text-2xl">
                  <Medal className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-medium">Superhost</h3>
                  <p className="text-gray-500 text-sm">Experienced, highly rated host</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-4 text-2xl">
                  <MapPin className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-medium">Great location</h3>
                  <p className="text-gray-500 text-sm">95% of guests gave 5 stars</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-4 text-2xl">
                  <Key className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-medium">Self check-in</h3>
                  <p className="text-gray-500 text-sm">Check in with the smartlock</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">About this place</h2>
            <p className="mb-4">{property.description}</p>
            <Button variant="link" className="px-0">Show more</Button>
          </div>

          {/* Amenities */}
          <div className="py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center">
                  {renderAmenityIcon(amenity)}
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-6">
              Show all amenities
            </Button>
          </div>
        </div>

        {/* Right Side: Booking */}
        <div>
          <BookingForm property={property} />
        </div>
      </div>
    </div>
  );
};

// Helper function to render amenity icons
const renderAmenityIcon = (amenity: string) => {
  const iconClassName = "w-6 h-6 mr-2";
  
  switch (amenity.toLowerCase()) {
    case "pool":
      return <Droplet className={iconClassName} />;
    case "kitchen":
      return <ChefHat className={iconClassName} />;
    case "wifi":
      return <Wifi className={iconClassName} />;
    case "tv":
      return <Tv className={iconClassName} />;
    case "air conditioning":
      return <Snowflake className={iconClassName} />;
    case "free parking":
    case "parking":
      return <Car className={iconClassName} />;
    case "washer":
    case "dryer":
      return <Shirt className={iconClassName} />;
    case "hot tub":
      return <Heater className={iconClassName} />;
    default:
      return <div className="w-6 h-6 mr-2" />;
  }
};

export default PropertyDetail;
