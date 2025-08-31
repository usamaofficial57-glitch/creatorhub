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
  PenTool,
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/', category: 'main' },
    { icon: PenTool, label: 'AI Script Generator', path: '/script-generator', category: 'create' },
    { icon: Lightbulb, label: 'Content Ideas', path: '/content-ideas', category: 'create' },
    { icon: Users, label: 'Competitor Analysis', path: '/competitors', category: 'analyze' },
    { icon: TrendingUp, label: 'Trending Videos', path: '/trending', category: 'analyze' },
    { icon: Calendar, label: 'Content Calendar', path: '/calendar', category: 'manage' },
    { icon: Target, label: 'Niche Research', path: '/niche-research', category: 'analyze' },
    { icon: Video, label: 'Channel Analytics', path: '/analytics', category: 'analyze' },
    { icon: UserPlus, label: 'Team & Freelancers', path: '/team', category: 'manage' },
    { icon: Search, label: 'SEO Tools', path: '/seo', category: 'optimize' },
    { icon: Settings, label: 'Settings', path: '/settings', category: 'config' }
  ];
  
  const isActive = (path) => location.pathname === path;
  
  const categoryColors = {
    main: '#4F46E5',
    create: '#10B981', 
    analyze: '#F59E0B',
    manage: '#8B5CF6',
    optimize: '#EF4444',
    config: '#6B7280'
  };
  
  return (
    <div className="w-64 bg-white shadow-xl h-screen fixed left-0 top-0 z-40 border-r border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #4F46E5, #10B981)'
            }}
          >
            <Video className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{color: '#111827'}}>CreatorHub</h1>
            <p className="text-xs" style={{color: '#6B7280'}}>YouTube Automation</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="mt-2 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group flex items-center px-4 py-3 text-sm font-medium rounded-xl 
                  transition-all duration-200 smooth-transition relative overflow-hidden
                  ${active 
                    ? 'text-white shadow-lg transform scale-[1.02]' 
                    : 'hover:bg-gray-50 transform hover:scale-[1.01]'
                  }
                `}
                style={{
                  backgroundColor: active ? '#4F46E5' : 'transparent',
                  color: active ? 'white' : '#6B7280'
                }}
              >
                {/* Active indicator */}
                {active && (
                  <div 
                    className="absolute inset-0 rounded-xl opacity-20"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))'
                    }}
                  />
                )}
                
                {/* Category indicator */}
                <div 
                  className="w-1 h-1 rounded-full mr-3 transition-all duration-200"
                  style={{
                    backgroundColor: active ? 'rgba(255,255,255,0.8)' : categoryColors[item.category],
                    transform: active ? 'scale(1.5)' : 'scale(1)'
                  }}
                />
                
                <Icon className={`w-5 h-5 mr-3 transition-all duration-200 ${
                  active ? 'text-white' : 'group-hover:scale-110'
                }`} />
                
                <span className="relative z-10">{item.label}</span>
                
                {/* Hover effect */}
                {!active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
      
      {/* Pro Upgrade Card */}
      <div className="absolute bottom-6 left-4 right-4">
        <div 
          className="p-5 rounded-2xl shadow-lg relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05), rgba(16, 185, 129, 0.05))',
            border: '1px solid rgba(79, 70, 229, 0.1)'
          }}
        >
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
            <Sparkles className="w-full h-full" style={{color: '#4F46E5'}} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-3">
              <div 
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{backgroundColor: '#4F46E5'}}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-bold" style={{color: '#111827'}}>Upgrade to Pro</h3>
            </div>
            
            <p className="text-xs mb-4 leading-relaxed" style={{color: '#6B7280'}}>
              Unlock advanced AI features, unlimited analytics, and priority support
            </p>
            
            <button 
              className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-white
                        transition-all duration-200 transform hover:scale-105 hover:shadow-lg
                        focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{
                background: 'linear-gradient(135deg, #4F46E5, #10B981)',
                focusRingColor: '#4F46E5'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #4338CA, #059669)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #4F46E5, #10B981)';
              }}
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;