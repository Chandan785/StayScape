import { Link } from "wouter";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Globe 
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-600 hover:underline">Help Center</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline">Safety information</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline">Cancellation options</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline">Report a concern</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-600 hover:underline">Disaster relief</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline">Support refugees</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline">Combating discrimination</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Hosting</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-600 hover:underline">Try hosting</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline">Protection for hosts</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline">Explore hosting resources</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline">Visit community forum</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">StayScape</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-600 hover:underline">Newsroom</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline">New features</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline">Careers</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline">Investors</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-300 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span>© {new Date().getFullYear()} StayScape, Inc.</span>
            <span className="mx-2">·</span>
            <Link href="#" className="hover:underline">Privacy</Link>
            <span className="mx-2">·</span>
            <Link href="#" className="hover:underline">Terms</Link>
            <span className="mx-2">·</span>
            <Link href="#" className="hover:underline">Sitemap</Link>
          </div>
          <div className="flex items-center">
            <div className="flex items-center mr-6">
              <Globe className="mr-2 h-4 w-4" />
              <span>English (US)</span>
            </div>
            <div className="flex items-center mr-6">
              <span>$ USD</span>
            </div>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-600 hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
