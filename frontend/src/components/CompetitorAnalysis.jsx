import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Calendar, 
  Bell, 
  BellOff, 
  Search, 
  Plus,
  ExternalLink,
  BarChart3,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { youtubeApi } from '../services/api';
import { useToast } from '../hooks/use-toast';

const CompetitorAnalysis = () => {
  const [competitors, setCompetitors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompetitors, setFilteredCompetitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingCompetitor, setAddingCompetitor] = useState(false);
  const [newCompetitorUrl, setNewCompetitorUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Load saved competitors from localStorage
    const savedCompetitors = localStorage.getItem('competitors');
    if (savedCompetitors) {
      const parsedCompetitors = JSON.parse(savedCompetitors);
      setCompetitors(parsedCompetitors);
      setFilteredCompetitors(parsedCompetitors);
    } else {
      // Load some default competitors for demo
      loadDefaultCompetitors();
    }
  }, []);

  useEffect(() => {
    // Filter competitors based on search
    const filtered = competitors.filter(competitor =>
      competitor.channelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      competitor.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCompetitors(filtered);
  }, [searchTerm, competitors]);

  const loadDefaultCompetitors = async () => {
    // Add some popular tech/lifestyle channels as examples
    const defaultChannelIds = [
      'UCBJycsmduvYEL83R_U4JriQ', // Marques Brownlee
      'UC-lHJZR3Gqxm24_Vd_AJ5Yw', // PewDiePie
      'UCsooa4yRKGN_zEE8iknghZA'  // TED-Ed
    ];

    const defaultCompetitors = [];
    
    for (const channelId of defaultChannelIds) {
      try {
        const channelData = await youtubeApi.getChannelStats(channelId);
        defaultCompetitors.push({
          id: channelId,
          channelName: channelData.name,
          subscriberCount: channelData.subscriber_count,
          viewCount: channelData.view_count,
          videoCount: channelData.video_count,
          thumbnail: channelData.thumbnail,
          description: channelData.description,
          customUrl: channelData.custom_url,
          category: 'Technology',
          trackingSince: new Date().toISOString().split('T')[0],
          notifications: true,
          recentVideo: null,
          growthRate: Math.floor(Math.random() * 20) + 5, // Mock growth rate
          avgViews: Math.floor(channelData.view_count / channelData.video_count)
        });
      } catch (error) {
        console.error(`Error loading channel ${channelId}:`, error);
      }
    }

    if (defaultCompetitors.length > 0) {
      setCompetitors(defaultCompetitors);
      setFilteredCompetitors(defaultCompetitors);
      localStorage.setItem('competitors', JSON.stringify(defaultCompetitors));
    }
  };

  const extractChannelId = (url) => {
    // Extract channel ID from various YouTube URL formats
    const patterns = [
      /youtube\.com\/channel\/([a-zA-Z0-9_-]+)/,
      /youtube\.com\/c\/([a-zA-Z0-9_-]+)/,
      /youtube\.com\/user\/([a-zA-Z0-9_-]+)/,
      /youtube\.com\/@([a-zA-Z0-9_-]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    // If it's just a channel ID
    if (/^[a-zA-Z0-9_-]{24}$/.test(url.trim())) {
      return url.trim();
    }
    
    return null;
  };

  const addCompetitor = async () => {
    if (!newCompetitorUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a YouTube channel URL or ID.",
        variant: "destructive",
      });
      return;
    }

    const channelId = extractChannelId(newCompetitorUrl);
    
    if (!channelId) {
      toast({
        title: "Invalid URL",
        description: "Please provide a valid YouTube channel URL or ID.",
        variant: "destructive",
      });
      return;
    }

    // Check if already exists
    if (competitors.find(c => c.id === channelId)) {
      toast({
        title: "Already Tracked",
        description: "This competitor is already in your tracking list.",
        variant: "destructive",
      });
      return;
    }

    try {
      setAddingCompetitor(true);
      
      const channelData = await youtubeApi.getChannelStats(channelId);
      
      const newCompetitor = {
        id: channelId,
        channelName: channelData.name,
        subscriberCount: channelData.subscriber_count,
        viewCount: channelData.view_count,
        videoCount: channelData.video_count,
        thumbnail: channelData.thumbnail,
        description: channelData.description,
        customUrl: channelData.custom_url,
        category: 'General',
        trackingSince: new Date().toISOString().split('T')[0],
        notifications: true,
        recentVideo: null,
        growthRate: 0, // Will be calculated over time
        avgViews: Math.floor(channelData.view_count / channelData.video_count)
      };

      const updatedCompetitors = [...competitors, newCompetitor];
      setCompetitors(updatedCompetitors);
      setFilteredCompetitors(updatedCompetitors);
      localStorage.setItem('competitors', JSON.stringify(updatedCompetitors));
      
      toast({
        title: "Competitor Added",
        description: `${channelData.name} is now being tracked.`,
      });
      
      setNewCompetitorUrl('');
      
    } catch (error) {
      console.error('Error adding competitor:', error);
      toast({
        title: "Failed to Add",
        description: "Could not add this competitor. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setAddingCompetitor(false);
    }
  };

  const toggleNotifications = (competitorId) => {
    const updatedCompetitors = competitors.map(competitor => 
      competitor.id === competitorId 
        ? { ...competitor, notifications: !competitor.notifications }
        : competitor
    );
    
    setCompetitors(updatedCompetitors);
    setFilteredCompetitors(updatedCompetitors);
    localStorage.setItem('competitors', JSON.stringify(updatedCompetitors));
    
    const competitor = updatedCompetitors.find(c => c.id === competitorId);
    toast({
      title: competitor.notifications ? "Notifications On" : "Notifications Off",
      description: `${competitor.channelName} notification settings updated.`,
    });
  };

  const removeCompetitor = (competitorId) => {
    const updatedCompetitors = competitors.filter(c => c.id !== competitorId);
    setCompetitors(updatedCompetitors);
    setFilteredCompetitors(updatedCompetitors);
    localStorage.setItem('competitors', JSON.stringify(updatedCompetitors));
    
    toast({
      title: "Competitor Removed",
      description: "Competitor has been removed from tracking.",
    });
  };

  const viewAnalytics = (competitor) => {
    toast({
      title: "Analytics Coming Soon",
      description: `Detailed analytics for ${competitor.channelName} will open in a new tab.`,
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num?.toLocaleString() || '0';
  };

  const getGrowthColor = (rate) => {
    if (rate > 10) return 'text-green-600';
    if (rate > 0) return 'text-blue-600';
    return 'text-red-600';
  };

  return (
    <div className="p-8 space-y-8" style={{backgroundColor: '#F3F4F6', minHeight: '100vh'}}>
      {/* Header */}
      <div className="flex justify-between items-center fade-in-up">
        <div>
          <h1 className="text-4xl font-bold" style={{color: '#111827'}}>Competitor Analysis</h1>
          <p className="text-lg mt-2" style={{color: '#6B7280'}}>Track and analyze your competitors with real YouTube data</p>
        </div>
        <Button 
          disabled={addingCompetitor}
          className="btn-animate rounded-xl shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #4F46E5, #10B981)',
            borderColor: 'transparent'
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Competitor
        </Button>
      </div>

      {/* Stats Overview */}
      <Card className="p-8 bg-white shadow-xl border-0 rounded-3xl card-hover">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{color: '#4F46E5'}}>{competitors.length}</div>
              <div className="text-sm font-medium" style={{color: '#6B7280'}}>Tracked Channels</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{color: '#10B981'}}>
                {competitors.filter(c => c.notifications).length}
              </div>
              <div className="text-sm font-medium" style={{color: '#6B7280'}}>Active Alerts</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{color: '#8B5CF6'}}>
                {formatNumber(competitors.reduce((sum, c) => sum + (c.subscriberCount || 0), 0))}
              </div>
              <div className="text-sm font-medium" style={{color: '#6B7280'}}>Total Subscribers</div>
            </div>
          </div>
          <Badge className="px-4 py-2 rounded-full font-bold text-sm" style={{
            backgroundColor: '#10B98120',
            color: '#10B981',
            border: 'none'
          }}>
            <div className="status-dot status-connected mr-2"></div>
            Live Data
          </Badge>
        </div>
      </Card>

      {/* Add Competitor Form */}
      <Card className="p-8 card-hover bg-white shadow-xl border-0 rounded-3xl" style={{
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.03), rgba(16, 185, 129, 0.03))'
      }}>
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #4F46E5, #10B981)'
              }}
            >
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold" style={{color: '#111827'}}>Add New Competitor</h3>
          </div>
        </div>
        
        <div className="flex items-end space-x-6">
          <div className="flex-1">
            <label className="block text-sm font-bold mb-3" style={{color: '#111827'}}>
              YouTube Channel URL or ID
            </label>
            <Input
              placeholder="e.g., https://youtube.com/@channelname or UCxxxxxxxxx"
              value={newCompetitorUrl}
              onChange={(e) => setNewCompetitorUrl(e.target.value)}
              className="w-full p-4 rounded-2xl border-2 focus:border-[#4F46E5] transition-colors"
              style={{backgroundColor: '#F9FAFB', borderColor: '#E5E7EB'}}
            />
          </div>
          
          <Button 
            onClick={addCompetitor}
            disabled={addingCompetitor || !newCompetitorUrl.trim()}
            className="px-8 py-4 rounded-2xl font-bold btn-animate shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #4F46E5, #10B981)',
              borderColor: 'transparent'
            }}
          >
            {addingCompetitor ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Add
          </Button>
        </div>
      </Card>

      {/* Search Filter */}
      <Card className="p-6 bg-white shadow-xl border-0 rounded-3xl card-hover">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3 flex-1">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{backgroundColor: '#6B728020'}}
            >
              <Search className="w-5 h-5" style={{color: '#6B7280'}} />
            </div>
            <Input
              placeholder="Search competitors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border-2 focus:border-[#4F46E5] transition-colors"
              style={{backgroundColor: '#F9FAFB', borderColor: '#E5E7EB'}}
            />
          </div>
          <Badge className="px-4 py-2 rounded-full font-bold text-sm" style={{
            backgroundColor: '#4F46E520',
            color: '#4F46E5',
            border: 'none'
          }}>
            {filteredCompetitors.length} competitors
          </Badge>
        </div>
      </Card>

      {/* Competitors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCompetitors.map((competitor) => (
          <Card key={competitor.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src={competitor.thumbnail} 
                    alt={competitor.channelName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{competitor.channelName}</h3>
                    <p className="text-sm text-gray-600">{competitor.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleNotifications(competitor.id)}
                  >
                    {competitor.notifications ? (
                      <Bell className="w-4 h-4 text-blue-600" />
                    ) : (
                      <BellOff className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCompetitor(competitor.id)}
                  >
                    ×
                  </Button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subscribers:</span>
                  <span className="font-medium">{formatNumber(competitor.subscriberCount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Videos:</span>
                  <span className="font-medium">{competitor.videoCount?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg Views:</span>
                  <span className="font-medium">{formatNumber(competitor.avgViews)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Growth:</span>
                  <div className="flex items-center">
                    <TrendingUp className={`w-4 h-4 mr-1 ${getGrowthColor(competitor.growthRate)}`} />
                    <span className={`font-medium ${getGrowthColor(competitor.growthRate)}`}>
                      {competitor.growthRate > 0 ? '+' : ''}{competitor.growthRate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {competitor.description}
                </p>
              </div>

              {/* Tracking Status */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Tracking since {competitor.trackingSince}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  {competitor.notifications ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                  )}
                  <span className={`text-xs ${competitor.notifications ? 'text-green-600' : 'text-gray-500'}`}>
                    {competitor.notifications ? 'Alerts On' : 'Alerts Off'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-4 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => viewAnalytics(competitor)}
                >
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Analytics
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => window.open(`https://youtube.com/channel/${competitor.id}`, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Visit
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Schedule
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCompetitors.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No competitors found</h3>
          <p className="text-gray-600 mb-6">
            {competitors.length === 0 
              ? "Start tracking your competitors by adding their YouTube channels."
              : "No competitors match your search criteria."
            }
          </p>
          <Button 
            onClick={() => setNewCompetitorUrl('https://youtube.com/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Competitor
          </Button>
        </Card>
      )}
    </div>
  );
};

export default CompetitorAnalysis;