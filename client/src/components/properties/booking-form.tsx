import { useState } from "react";
import { Property } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Star } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, differenceInDays, addDays } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface BookingFormProps {
  property: Property;
}

const BookingForm = ({ property }: BookingFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(new Date(), 5));
  const [guests, setGuests] = useState<number>(1);
  
  const nights = startDate && endDate ? differenceInDays(endDate, startDate) : 0;
  const subtotal = property.price * nights;
  const cleaningFee = 50;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + cleaningFee + serviceFee;

  const bookingMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("You must be logged in to book");
      if (!startDate || !endDate) throw new Error("Please select dates");
      
      const bookingData = {
        propertyId: property.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        guests,
        totalPrice: total
      };
      
      const res = await apiRequest("POST", "/api/bookings", bookingData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking successful!",
        description: "Your reservation has been confirmed."
      });
      navigate("/profile");
    },
    onError: (error: Error) => {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleBooking = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to book this property",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }
    
    if (!startDate || !endDate) {
      toast({
        title: "Date selection required",
        description: "Please select check-in and check-out dates",
        variant: "destructive"
      });
      return;
    }
    
    bookingMutation.mutate();
  };

  return (
    <Card className="sticky top-28 border border-gray-200 shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xl font-semibold">${property.price}</span> night
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
            <span className="font-medium">
              {property.rating ? (property.rating / 10).toFixed(1) : "New"}
            </span>
            <span className="mx-1 text-gray-500">·</span>
            <a href="#reviews" className="text-gray-500 underline">
              {property.reviews} {property.reviews === 1 ? "review" : "reviews"}
            </a>
          </div>
        </div>

        {/* Date Picker */}
        <div className="mt-4 border border-gray-300 rounded-lg overflow-hidden">
          <div className="grid grid-cols-2">
            <div className="p-2 border-r border-b border-gray-300">
              <div className="text-xs font-semibold">CHECK-IN</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                    {startDate ? format(startDate, "MMM dd, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="p-2 border-b border-gray-300">
              <div className="text-xs font-semibold">CHECKOUT</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                    {endDate ? format(endDate, "MMM dd, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => startDate ? date <= startDate : date <= new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="p-2 col-span-2">
              <div className="text-xs font-semibold">GUESTS</div>
              <Select value={guests.toString()} onValueChange={(value) => setGuests(parseInt(value))}>
                <SelectTrigger className="border-0 p-0 h-auto">
                  <SelectValue placeholder="1 guest" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: property.guests }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "guest" : "guests"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Book Button */}
        <Button 
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold mt-4 hover:bg-primary/90"
          onClick={handleBooking}
          disabled={bookingMutation.isPending}
        >
          {bookingMutation.isPending ? "Processing..." : "Reserve"}
        </Button>

        <p className="text-center mt-4 text-gray-500">You won't be charged yet</p>

        {/* Price Details */}
        <div className="mt-4">
          <div className="flex justify-between py-2">
            <div className="underline">${property.price} x {nights} nights</div>
            <div>${subtotal}</div>
          </div>
          <div className="flex justify-between py-2">
            <div className="underline">Cleaning fee</div>
            <div>${cleaningFee}</div>
          </div>
          <div className="flex justify-between py-2">
            <div className="underline">Service fee</div>
            <div>${serviceFee}</div>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between py-2 font-semibold">
            <div>Total before taxes</div>
            <div>${total}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
