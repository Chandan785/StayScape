import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Menu, 
  Search, 
  Home, 
  Heart, 
  LogOut, 
  LogIn, 
  UserPlus 
} from "lucide-react";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-primary font-bold text-2xl flex items-center">
            <Home className="w-6 h-6 mr-2" />
            <span>StayScape</span>
          </Link>
        </div>

        {/* Search Bar */}
        <form 
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 mx-8"
        >
          <div className="flex items-center w-full max-w-xl mx-auto rounded-full border border-gray-300 py-2 px-4 shadow-sm">
            <Input
              type="text"
              placeholder="Where are you going?"
              className="w-full border-none outline-none text-dark shadow-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="rounded-full bg-primary text-white hover:bg-primary/90"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* Navigation */}
        <nav className="flex items-center">
          <Link 
            href="/favorites" 
            className="hidden md:flex items-center mr-6 text-gray-600 hover:text-primary"
          >
            <Heart className="w-4 h-4 mr-1" />
            <span>Favorites</span>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full p-2 flex items-center space-x-2">
                <Menu className="h-4 w-4" />
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {user ? (
                <>
                  <div className="px-2 py-1.5 text-sm font-medium">
                    Hello, {user.name || user.username}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/favorites" className="cursor-pointer">
                      Favorites
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-red-500"
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>{logoutMutation.isPending ? "Logging out..." : "Log out"}</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/auth" className="cursor-pointer">
                      <LogIn className="h-4 w-4 mr-2" />
                      <span>Log in</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth" className="cursor-pointer">
                      <UserPlus className="h-4 w-4 mr-2" />
                      <span>Sign up</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>

      {/* Mobile Search */}
      <form 
        onSubmit={handleSearch}
        className="md:hidden px-4 pb-4"
      >
        <div className="flex items-center w-full max-w-xl mx-auto rounded-full border border-gray-300 py-2 px-4 shadow-sm">
          <Input
            type="text"
            placeholder="Where are you going?"
            className="w-full border-none outline-none text-dark shadow-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="rounded-full bg-primary text-white hover:bg-primary/90"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </header>
  );
};

export default Navbar;
