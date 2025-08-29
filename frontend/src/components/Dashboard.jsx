import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  TrendingUp, 
  Eye, 
  Users, 
  Clock, 
  DollarSign, 
  Play,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Loader2,
  Plus,
  Settings,
  ExternalLink,
  Youtube
} from 'lucide-react';
import { analyticsApi, youtubeApi, channelsApi } from '../services/api';
import { useToast } from '../hooks/use-toast';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [trendingVideos, setTrendingVideos] = useState([]);
  const [connectedChannels, setConnectedChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [channelUrl, setChannelUrl] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [managingChannels, setManagingChannels] = useState(false);
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch analytics and trending videos in parallel
      const [analyticsData, trendingData] = await Promise.all([
        analyticsApi.getDashboardAnalytics(),
        youtubeApi.getTrending('all', 'US', 10)
      ]);
      
      setAnalytics(analyticsData);
      setTrendingVideos(trendingData.slice(0, 3)); // Show only top 3
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // Before showing error state, check if we have connected channels
      try {
        const connectedChannels = await channelsApi.getConnectedChannels();
        const primaryChannel = connectedChannels.find(ch => ch.is_primary);
        
        if (primaryChannel) {
          // We have connected channels, show error state with channel info
          setAnalytics({
            connected: true,
            channelInfo: {
              name: primaryChannel.channel_name,
              id: primaryChannel.channel_id,
              handle: primaryChannel.channel_handle,
              thumbnail: primaryChannel.thumbnail_url
            },
            message: "Unable to load analytics data. Please try refreshing.",
            error: true,
            totalViews: 0,
            totalSubscribers: primaryChannel.subscriber_count || 0,
            videoCount: primaryChannel.video_count || 0,
            revenueThisMonth: 0,
            topPerformingVideo: null,
            monthlyGrowth: []
          });
          
          toast({
            title: "Analytics Unavailable",
            description: "Connected channel found but analytics data couldn't be loaded. Try refreshing.",
            variant: "destructive",
          });
        } else {
          // No channels connected, show connect state
          setAnalytics({
            connected: false,
            message: "No YouTube channels connected. Please connect a channel to view analytics.",
            error: error.message
          });
          
          toast({
            title: "Error",
            description: "Failed to load dashboard data.",
            variant: "destructive",
          });
        }
      } catch (channelError) {
        console.error('Error checking connected channels:', channelError);
        // Fallback to error state
        setAnalytics({
          connected: false,
          message: "Failed to load data. Please refresh or check your connection.",
          error: error.message
        });
        
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive",
        });
      }
      
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    toast({
      title: "Dashboard Refreshed",
      description: "Latest data has been loaded successfully.",
    });
  };

  const generateNewIdeas = () => {
    toast({
      title: "Generating Ideas",
      description: "Redirecting to Content Ideas page...",
    });
    // Could navigate to content ideas page or open a modal
    window.location.href = '/content-ideas';
  };

  const handleConnectChannel = async () => {
    if (!channelUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid YouTube channel URL or handle.",
        variant: "destructive",
      });
      return;
    }

    setConnecting(true);
    try {
      await channelsApi.connectChannel({
        channel_url: channelUrl.trim()
      });

      toast({
        title: "Channel Connected!",
        description: "Your YouTube channel has been connected successfully.",
      });

      setShowChannelModal(false);
      setChannelUrl('');
      
      // Refresh dashboard data
      await fetchDashboardData();
      
    } catch (error) {
      console.error('Error connecting channel:', error);
      toast({
        title: "Connection Failed",
        description: error.response?.data?.detail || "Failed to connect channel. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Loading your channel overview...</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  const stats = analytics && analytics.connected ? [
    {
      label: 'Total Views',
      value: analytics.totalViews?.toLocaleString() || '0',
      change: '+12.5%',
      positive: true,
      icon: Eye
    },
    {
      label: 'Subscribers',
      value: analytics.totalSubscribers?.toLocaleString() || '0',
      change: '+8.2%',
      positive: true,
      icon: Users
    },
    {
      label: 'Videos',
      value: analytics.videoCount?.toLocaleString() || '0',
      change: '+5.1%',
      positive: true,
      icon: Play
    },
    {
      label: 'Monthly Revenue',
      value: `$${analytics.revenueThisMonth?.toLocaleString() || '0'}`,
      change: '+15.7%',
      positive: true,
      icon: DollarSign
    }
  ] : [];

  // No Channel Connected State
  if (analytics && !analytics.connected) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Connect your YouTube channel to view real analytics</p>
          </div>
        </div>

        {/* No Channel Connected UI */}
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-8 text-center max-w-md">
            <Youtube className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Your YouTube Channel</h3>
            <p className="text-gray-600 mb-6">
              {analytics.message || "To view your real YouTube analytics, please connect your channel first."}
            </p>
            <Button 
              onClick={() => setShowChannelModal(true)}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Connect Channel
            </Button>
          </Card>
        </div>

        {/* Channel Connection Modal */}
        {showChannelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Connect YouTube Channel</h3>
              <p className="text-sm text-gray-600 mb-4">
                Enter your YouTube channel URL or handle (e.g., @username)
              </p>
              <input
                type="text"
                value={channelUrl}
                onChange={(e) => setChannelUrl(e.target.value)}
                placeholder="https://youtube.com/@channel or @username"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowChannelModal(false)}
                  className="flex-1"
                  disabled={connecting}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleConnectChannel}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  disabled={connecting}
                >
                  {connecting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Connect
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Channel Info */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-gray-600">
                {analytics?.channelInfo ? 
                  (analytics.error ? 
                    `Channel: ${analytics.channelInfo.name} (Analytics unavailable)` : 
                    `Analytics for ${analytics.channelInfo.name}`
                  ) : 
                  "Welcome back! Here's your channel overview with live data."
                }
              </p>
              {analytics?.channelInfo && (
                <Badge variant="outline" className={analytics.error ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-green-50 text-green-700 border-green-200"}>
                  <div className={`w-2 h-2 ${analytics.error ? 'bg-orange-500' : 'bg-green-500'} rounded-full mr-1`}></div>
                  {analytics.error ? 'Data Error' : 'Connected'}
                </Badge>
              )}
            </div>
          </div>
          {analytics?.channelInfo && (
            <img 
              src={analytics.channelInfo.thumbnail}
              alt={analytics.channelInfo.name}
              className="w-12 h-12 rounded-full"
            />
          )}
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={handleRefresh} 
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={generateNewIdeas}
          >
            Generate New Ideas
          </Button>
        </div>
      </div>

      {/* Analytics Error Banner */}
      {analytics?.connected && analytics?.error && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <RefreshCw className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-orange-800">
                Analytics data temporarily unavailable
              </p>
              <p className="text-sm text-orange-700 mt-1">
                Your channel is connected, but we're having trouble loading analytics data. This may be due to temporary network issues.
              </p>
            </div>
            <Button 
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="border-orange-200 text-orange-700 hover:bg-orange-100"
              disabled={refreshing}
            >
              {refreshing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.positive ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Icon className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Channel Growth</h3>
            <div className="flex space-x-2">
              <Badge variant="outline">Subscribers</Badge>
              <Badge variant="outline">Views</Badge>
            </div>
          </div>
          <div className="space-y-4">
            {analytics?.monthlyGrowth?.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-900 w-8">{month.month}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600">
                        +{month.subscribers?.toLocaleString()} subscribers
                      </div>
                      <div className="text-sm text-gray-600">
                        {month.views?.toLocaleString()} views
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (month.subscribers / 35000) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center text-gray-500 py-8">
                No growth data available
              </div>
            )}
          </div>
        </Card>

        {/* Top Performing Video */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Video</h3>
          <div className="space-y-4">
            {analytics?.topPerformingVideo ? (
              <>
                <div className="relative">
                  <img 
                    src={analytics.topPerformingVideo.thumbnail || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=120&fit=crop'}
                    alt="Top video thumbnail"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{analytics.topPerformingVideo.title}</h4>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{parseInt(analytics.topPerformingVideo.views)?.toLocaleString()} views</span>
                    <Badge className="bg-green-100 text-green-800">Viral</Badge>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No video data available
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Live Trending Videos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Channel</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowChannelModal(true)}
            >
              <Settings className="w-3 h-3 mr-1" />
              Settings
            </Button>
          </div>
          <div className="space-y-4">
            {analytics?.channelInfo ? (
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <img 
                  src={analytics.channelInfo.thumbnail}
                  alt={analytics.channelInfo.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{analytics.channelInfo.name}</h4>
                  <p className="text-sm text-gray-600">
                    {analytics.channelInfo.handle || analytics.channelInfo.id}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                    <span>{analytics.totalSubscribers?.toLocaleString()} subscribers</span>
                    <span>{analytics.videoCount} videos</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(`https://youtube.com/channel/${analytics.channelInfo.id}`, '_blank')}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No channel connected
              </div>
            )}
          </div>
        </Card>

        {/* Live Trending Videos */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Live Trending Videos</h3>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/trending'}>
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {trendingVideos.length > 0 ? (
              trendingVideos.map((video) => (
                <div key={video.id} className="flex space-x-3">
                  <img 
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-16 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2">
                      {video.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">{video.channel}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{video.views?.toLocaleString()} views</span>
                      <Badge className="text-xs bg-red-100 text-red-800">
                        {video.viral_score}% viral
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                {!refreshing && !loading ? (
                  <div>
                    <TrendingUp className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <p>No trending videos available</p>
                  </div>
                ) : (
                  <div>
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading trending videos...
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Channel Connection Modal for Settings */}
      {showChannelModal && analytics?.connected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Channel Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <img 
                  src={analytics.channelInfo.thumbnail}
                  alt={analytics.channelInfo.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{analytics.channelInfo.name}</h4>
                  <p className="text-sm text-gray-600">
                    {analytics.channelInfo.handle || analytics.channelInfo.id}
                  </p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Primary
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 p-3 bg-blue-50 rounded-lg">
                <span>Last updated:</span>
                <span>{analytics.lastUpdated ? new Date(analytics.lastUpdated).toLocaleString() : 'Just now'}</span>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowChannelModal(false)}
                className="flex-1"
              >
                Close
              </Button>
              <Button 
                onClick={handleRefresh}
                className="flex-1"
                disabled={refreshing}
              >
                {refreshing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Refresh Data
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;