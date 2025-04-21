import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { 
  SlidersHorizontal, 
  Home, 
  Building, 
  TreePine, 
  Waves 
} from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

const PropertyFilters = () => {
  const [, navigate] = useLocation();
  const [priceRange, setPriceRange] = useState([50, 500]);
  
  const propertyTypes: FilterOption[] = [
    { label: "House", value: "house", icon: <Home className="w-4 h-4 mr-2" /> },
    { label: "Apartment", value: "apartment", icon: <Building className="w-4 h-4 mr-2" /> },
    { label: "Cabin", value: "cabin", icon: <TreePine className="w-4 h-4 mr-2" /> },
    { label: "Beach House", value: "beach house", icon: <Waves className="w-4 h-4 mr-2" /> },
  ];
  
  const bedroomOptions: FilterOption[] = [
    { label: "Any", value: "" },
    { label: "1+", value: "1" },
    { label: "2+", value: "2" },
    { label: "3+", value: "3" },
    { label: "4+", value: "4" },
  ];
  
  const bathroomOptions: FilterOption[] = [
    { label: "Any", value: "" },
    { label: "1+", value: "1" },
    { label: "2+", value: "2" },
    { label: "3+", value: "3" },
  ];
  
  const applyFilters = (filters: Record<string, string>) => {
    const params = new URLSearchParams(window.location.search);
    
    // Add or update filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    navigate(`/?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-4 mb-4">
      <ScrollArea className="whitespace-nowrap">
        <div className="flex space-x-4 pb-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded-full">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <span>Filters</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Price range</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={priceRange}
                      min={0}
                      max={1000}
                      step={10}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="border rounded p-2 w-24 text-center">${priceRange[0]}</div>
                    <div className="border-t w-4"></div>
                    <div className="border rounded p-2 w-24 text-center">${priceRange[1]}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Property type</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {propertyTypes.map((type) => (
                      <Button
                        key={type.value}
                        variant="outline"
                        className="justify-start font-normal"
                        onClick={() => applyFilters({ propertyType: type.value })}
                      >
                        {type.icon}
                        {type.label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between pt-4 border-t">
                  <Button variant="outline" onClick={() => navigate("/")}>
                    Clear all
                  </Button>
                  <Button 
                    onClick={() => applyFilters({ 
                      minPrice: priceRange[0].toString(),
                      maxPrice: priceRange[1].toString()
                    })}
                  >
                    Show results
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded-full">
                Price
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="p-4">
                <h3 className="font-medium mb-3">Price range</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={priceRange}
                    min={0}
                    max={1000}
                    step={10}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                  />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="border rounded p-2 w-24 text-center">${priceRange[0]}</div>
                  <div className="border-t w-4"></div>
                  <div className="border rounded p-2 w-24 text-center">${priceRange[1]}</div>
                </div>
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={() => navigate("/")}>
                    Clear
                  </Button>
                  <Button 
                    onClick={() => applyFilters({ 
                      minPrice: priceRange[0].toString(),
                      maxPrice: priceRange[1].toString()
                    })}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded-full">
                Type of place
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-4">
                <div className="grid grid-cols-1 gap-2">
                  {propertyTypes.map((type) => (
                    <Button
                      key={type.value}
                      variant="outline"
                      className="justify-start font-normal"
                      onClick={() => applyFilters({ propertyType: type.value })}
                    >
                      {type.icon}
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded-full">
                Bedrooms
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-4 flex flex-col space-y-2">
                {bedroomOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant="outline"
                    className="justify-start font-normal"
                    onClick={() => applyFilters({ bedrooms: option.value })}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded-full">
                Bathrooms
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-4 flex flex-col space-y-2">
                {bathroomOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant="outline"
                    className="justify-start font-normal"
                    onClick={() => applyFilters({ bathrooms: option.value })}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" className="rounded-full" onClick={() => navigate("/")}>
            Clear filters
          </Button>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default PropertyFilters;
