import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Lightbulb, 
  Users, 
  Calendar, 
  Search, 
  Settings, 
  TrendingUp,
  Target,
  UserPlus,
  Video,
  PenTool
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/' },
    { icon: PenTool, label: 'AI Script Generator', path: '/script-generator' },
    { icon: Lightbulb, label: 'Content Ideas', path: '/content-ideas' },
    { icon: Users, label: 'Competitor Analysis', path: '/competitors' },
    { icon: TrendingUp, label: 'Trending Videos', path: '/trending' },
    { icon: Calendar, label: 'Content Calendar', path: '/calendar' },
    { icon: Target, label: 'Niche Research', path: '/niche-research' },
    { icon: Video, label: 'Channel Analytics', path: '/analytics' },
    { icon: UserPlus, label: 'Team & Freelancers', path: '/team' },
    { icon: Search, label: 'SEO Tools', path: '/seo' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-40">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Video className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">CreatorHub</h1>
        </div>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Upgrade to Pro</h3>
          <p className="text-xs text-gray-600 mb-3">
            Unlock advanced analytics and AI features
          </p>
          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium py-2 px-3 rounded-md hover:from-blue-700 hover:to-purple-700 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;