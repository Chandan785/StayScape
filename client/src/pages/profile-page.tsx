import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Home, 
  Tag, 
  Users, 
  BadgeCheck, 
  BadgeX,
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  
  const {
    data: bookings,
    isLoading: bookingsLoading,
    error: bookingsError,
  } = useQuery({
    queryKey: ["/api/bookings"],
  });

  useEffect(() => {
    if (bookingsError) {
      toast({
        title: "Error loading bookings",
        description: "There was a problem loading your booking history. Please try again.",
        variant: "destructive",
      });
    }
  }, [bookingsError, toast]);

  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      const res = await apiRequest("PATCH", `/api/bookings/${bookingId}/status`, { status: "cancelled" });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Booking cancelled",
        description: "Your booking has been successfully cancelled.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error cancelling booking",
        description: error.message || "There was a problem cancelling your booking.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Account</h1>
          <p className="text-gray-500">Manage your profile and bookings</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your account details and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                        <UserIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Name</div>
                        <div className="font-medium">{user?.name || "Not provided"}</div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="font-medium">{user?.email || "Not provided"}</div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Member Since</div>
                        <div className="font-medium">
                          {user?.createdAt 
                            ? format(new Date(user.createdAt), "MMM dd, yyyy")
                            : "Not available"}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button variant="outline">Edit Profile</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Preferences</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Email notifications</span>
                          <span className="text-primary">On</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Currency</span>
                          <span className="text-primary">USD</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Language</span>
                          <span className="text-primary">English</span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">Security</h3>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        Change Password
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="bookings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Bookings</CardTitle>
                  <CardDescription>View and manage your upcoming and past stays</CardDescription>
                </CardHeader>
                <CardContent>
                  {bookingsLoading ? (
                    <div className="space-y-6">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="space-y-2">
                          <Skeleton className="h-6 w-1/3" />
                          <Skeleton className="h-24 w-full" />
                        </div>
                      ))}
                    </div>
                  ) : bookings && bookings.length > 0 ? (
                    <div className="space-y-6">
                      <h3 className="font-medium text-lg">Upcoming Stays</h3>
                      {bookings
                        .filter(booking => new Date(booking.endDate) >= new Date() && booking.status !== "cancelled")
                        .map(booking => (
                          <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                              <div>
                                <div className="font-semibold text-lg">{booking.propertyTitle || "Property Booking"}</div>
                                <div className="text-gray-500">
                                  {format(new Date(booking.startDate), "MMM dd, yyyy")} - {format(new Date(booking.endDate), "MMM dd, yyyy")}
                                </div>
                              </div>
                              <div className="mt-2 md:mt-0 flex items-center">
                                {booking.status === "pending" ? (
                                  <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs flex items-center">
                                    <Tag className="w-3 h-3 mr-1" />
                                    Pending
                                  </div>
                                ) : (
                                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs flex items-center">
                                    <BadgeCheck className="w-3 h-3 mr-1" />
                                    Confirmed
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{booking.guests} {booking.guests === 1 ? "guest" : "guests"}</span>
                              </div>
                              <div className="flex items-center">
                                <Home className="w-4 h-4 mr-2 text-gray-500" />
                                <span>Property #{booking.propertyId}</span>
                              </div>
                              <div className="flex items-center">
                                <Tag className="w-4 h-4 mr-2 text-gray-500" />
                                <span>${booking.totalPrice} total</span>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Link href={`/property/${booking.propertyId}`}>
                                <Button variant="outline" size="sm">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  View Property
                                </Button>
                              </Link>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => cancelBookingMutation.mutate(booking.id)}
                                disabled={cancelBookingMutation.isPending}
                              >
                                Cancel Booking
                              </Button>
                            </div>
                          </div>
                        ))}
                      
                      <h3 className="font-medium text-lg mt-8">Past Stays</h3>
                      {bookings
                        .filter(booking => new Date(booking.endDate) < new Date() || booking.status === "cancelled")
                        .map(booking => (
                          <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                              <div>
                                <div className="font-semibold text-lg">{booking.propertyTitle || "Property Booking"}</div>
                                <div className="text-gray-500">
                                  {format(new Date(booking.startDate), "MMM dd, yyyy")} - {format(new Date(booking.endDate), "MMM dd, yyyy")}
                                </div>
                              </div>
                              <div className="mt-2 md:mt-0 flex items-center">
                                {booking.status === "cancelled" ? (
                                  <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs flex items-center">
                                    <BadgeX className="w-3 h-3 mr-1" />
                                    Cancelled
                                  </div>
                                ) : (
                                  <div className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs flex items-center">
                                    <BadgeCheck className="w-3 h-3 mr-1" />
                                    Completed
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{booking.guests} {booking.guests === 1 ? "guest" : "guests"}</span>
                              </div>
                              <div className="flex items-center">
                                <Home className="w-4 h-4 mr-2 text-gray-500" />
                                <span>Property #{booking.propertyId}</span>
                              </div>
                              <div className="flex items-center">
                                <Tag className="w-4 h-4 mr-2 text-gray-500" />
                                <span>${booking.totalPrice} total</span>
                              </div>
                            </div>
                            
                            <Link href={`/property/${booking.propertyId}`}>
                              <Button variant="outline" size="sm">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Property
                              </Button>
                            </Link>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="bg-gray-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
                        <Calendar className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
                      <p className="text-gray-500 mb-4">When you book a stay, your reservations will appear here.</p>
                      <Link href="/">
                        <Button>Find a place to stay</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}
