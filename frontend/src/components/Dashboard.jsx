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
  Youtube,
  Sparkles,
  BarChart3,
  Activity,
  Star
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
      
      // Always fetch connected channels first to understand the state
      const channelsData = await channelsApi.getConnectedChannels();
      setConnectedChannels(channelsData);
      
      if (channelsData.length === 0) {
        // No channels connected
        setAnalytics({
          connected: false,
          message: "No YouTube channels connected. Connect your first channel to view analytics.",
          error: false
        });
        setTrendingVideos([]);
      } else {
        // We have connected channels, try to fetch analytics and trending data
        try {
          const [analyticsData, trendingData] = await Promise.all([
            analyticsApi.getDashboardAnalytics(),
            youtubeApi.getTrending('all', 'US', 10)
          ]);
          
          console.log('Analytics API response:', analyticsData);
          console.log('Connected channels:', channelsData);
          
          // Ensure analytics shows connected if we have channels, regardless of API response
          if (analyticsData.connected === false && channelsData.length > 0) {
            // Override analytics connected status if we know we have channels
            const primaryChannel = channelsData.find(ch => ch.is_primary) || channelsData[0];
            setAnalytics({
              ...analyticsData,
              connected: true,
              channelInfo: {
                name: primaryChannel.channel_name,
                id: primaryChannel.channel_id,
                handle: primaryChannel.channel_handle,
                thumbnail: primaryChannel.thumbnail_url
              },
              totalSubscribers: primaryChannel.subscriber_count || analyticsData.totalSubscribers || 0,
              videoCount: primaryChannel.video_count || analyticsData.videoCount || 0
            });
          } else {
            setAnalytics(analyticsData);
          }
          
          setTrendingVideos(trendingData.slice(0, 3));
        } catch (apiError) {
          console.error('Error fetching analytics/trending data:', apiError);
          
          // Analytics/trending failed but we have channels - show error state with channel info
          const primaryChannel = channelsData.find(ch => ch.is_primary) || channelsData[0];
          setAnalytics({
            connected: true,
            channelInfo: {
              name: primaryChannel.channel_name,
              id: primaryChannel.channel_id,
              handle: primaryChannel.channel_handle,
              thumbnail: primaryChannel.thumbnail_url
            },
            message: "Unable to load analytics data. Your channels are connected but data is temporarily unavailable.",
            error: true,
            totalViews: 0,
            totalSubscribers: primaryChannel.subscriber_count || 0,
            videoCount: primaryChannel.video_count || 0,
            revenueThisMonth: 0,
            topPerformingVideo: null,
            monthlyGrowth: []
          });
          setTrendingVideos([]);
          
          toast({
            title: "Analytics Unavailable",
            description: "Connected channels found but analytics data couldn't be loaded.",
            variant: "destructive",
          });
        }
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // Complete failure - show error state
      setAnalytics({
        connected: false,
        message: "Failed to load data. Please refresh or check your connection.",
        error: error.message
      });
      setConnectedChannels([]);
      setTrendingVideos([]);
      
      toast({
        title: "Connection Error",
        description: "Failed to load dashboard data. Please try refreshing.",
        variant: "destructive",
      });
      
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

  const handleDisconnectChannel = async (channelId, channelName) => {
    if (!window.confirm(`Are you sure you want to disconnect "${channelName}"? This will remove all associated data.`)) {
      return;
    }

    setManagingChannels(true);
    try {
      await channelsApi.disconnectChannel(channelId);
      
      toast({
        title: "Channel Disconnected",
        description: `"${channelName}" has been disconnected successfully.`,
      });

      // Refresh dashboard data
      await fetchDashboardData();
      
    } catch (error) {
      console.error('Error disconnecting channel:', error);
      toast({
        title: "Disconnection Failed",
        description: error.response?.data?.detail || "Failed to disconnect channel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setManagingChannels(false);
    }
  };

  const handleSetPrimaryChannel = async (channelId, channelName) => {
    setManagingChannels(true);
    try {
      await channelsApi.setPrimaryChannel(channelId);
      
      toast({
        title: "Primary Channel Updated",
        description: `"${channelName}" is now your primary channel.`,
      });

      // Refresh dashboard data
      await fetchDashboardData();
      
    } catch (error) {
      console.error('Error setting primary channel:', error);
      toast({
        title: "Update Failed",
        description: error.response?.data?.detail || "Failed to update primary channel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setManagingChannels(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Ensure we show connected state if we have channels, even if analytics is not loaded
  const shouldShowConnectedState = connectedChannels.length > 0;

  // Create effective analytics object - use actual analytics or fallback if we have channels
  const effectiveAnalytics = React.useMemo(() => {
    if (analytics) {
      return analytics;
    }
    
    if (shouldShowConnectedState) {
      // We have channels but no analytics loaded yet - create fallback
      const primaryChannel = connectedChannels.find(ch => ch.is_primary) || connectedChannels[0];
      return {
        connected: true,
        channelInfo: primaryChannel ? {
          name: primaryChannel.channel_name,
          id: primaryChannel.channel_id,
          handle: primaryChannel.channel_handle,
          thumbnail: primaryChannel.thumbnail_url
        } : null,
        message: "Loading analytics data...",
        error: false,
        totalViews: primaryChannel?.total_views || 0,
        totalSubscribers: primaryChannel?.subscriber_count || 0,
        videoCount: primaryChannel?.video_count || 0,
        revenueThisMonth: 0,
        topPerformingVideo: null,
        monthlyGrowth: []
      };
    }
    
    return analytics;
  }, [analytics, shouldShowConnectedState, connectedChannels]);

  if (loading) {
    return (
      <div className="p-8 space-y-8" style={{backgroundColor: '#F3F4F6', minHeight: '100vh'}}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold" style={{color: '#111827'}}>Dashboard</h1>
            <p className="mt-2" style={{color: '#6B7280'}}>Loading your channel overview...</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin" style={{color: '#4F46E5'}} />
            <p className="text-sm" style={{color: '#6B7280'}}>Fetching your latest data...</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = shouldShowConnectedState && effectiveAnalytics ? [
    {
      label: 'Total Views',
      value: effectiveAnalytics.totalViews?.toLocaleString() || '0',
      change: '+12.5%',
      positive: true,
      icon: Eye,
      color: '#4F46E5'
    },
    {
      label: 'Subscribers',
      value: effectiveAnalytics.totalSubscribers?.toLocaleString() || '0',
      change: '+8.2%',
      positive: true,
      icon: Users,
      color: '#10B981'
    },
    {
      label: 'Videos',
      value: effectiveAnalytics.videoCount?.toLocaleString() || '0',
      change: '+5.1%',
      positive: true,
      icon: Play,
      color: '#F59E0B'
    },
    {
      label: 'Monthly Revenue',
      value: `$${effectiveAnalytics.revenueThisMonth?.toLocaleString() || '0'}`,
      change: '+15.7%',
      positive: true,
      icon: DollarSign,
      color: '#8B5CF6'
    }
  ] : [];

  // No Channel Connected State - only show if we actually have no connected channels
  if (!shouldShowConnectedState) {
    return (
      <div className="p-8 space-y-8" style={{backgroundColor: '#F3F4F6', minHeight: '100vh'}}>
        {/* Header */}
        <div className="flex justify-between items-center fade-in-up">
          <div>
            <h1 className="text-4xl font-bold" style={{color: '#111827'}}>Dashboard</h1>
            <p className="text-lg mt-2" style={{color: '#6B7280'}}>
              Connect your YouTube channels to unlock powerful analytics and insights
            </p>
          </div>
          <Button 
            onClick={() => setShowChannelModal(true)}
            className="btn-animate shadow-lg"
            style={{
              backgroundColor: '#4F46E5',
              borderColor: '#4F46E5'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#4338CA'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#4F46E5'}
          >
            <Plus className="w-5 h-5 mr-2" />
            Connect Channel
          </Button>
        </div>

        {/* Welcome Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Welcome Card */}
          <Card className="p-10 text-center card-hover bg-white shadow-xl border-0 rounded-3xl">
            <div 
              className="w-20 h-20 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #4F46E5, #10B981)'
              }}
            >
              <Youtube className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-6" style={{color: '#111827'}}>
              Welcome to CreatorHub!
            </h3>
            <p className="text-lg mb-8 leading-relaxed" style={{color: '#6B7280'}}>
              Connect your YouTube channels to unlock powerful analytics, content insights, 
              and growth tools designed specifically for creators.
            </p>
            <Button 
              onClick={() => setShowChannelModal(true)}
              className="w-full py-4 text-lg font-semibold rounded-2xl btn-animate shadow-lg"
              style={{
                backgroundColor: '#4F46E5',
                borderColor: '#4F46E5'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#4338CA'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#4F46E5'}
            >
              <Plus className="w-6 h-6 mr-3" />
              Connect Your First Channel
            </Button>
          </Card>

          {/* Features Preview */}
          <Card className="p-10 bg-white shadow-xl border-0 rounded-3xl card-hover">
            <div className="flex items-center space-x-3 mb-8">
              <Sparkles className="w-8 h-8" style={{color: '#4F46E5'}} />
              <h4 className="text-2xl font-bold" style={{color: '#111827'}}>What you'll get:</h4>
            </div>
            <div className="space-y-6">
              {[
                { icon: Activity, title: 'Real-time Analytics', desc: 'View counts, subscribers, engagement metrics', color: '#4F46E5' },
                { icon: Sparkles, title: 'AI Content Ideas', desc: 'Get AI-powered video ideas based on trends', color: '#10B981' },
                { icon: Users, title: 'Competitor Analysis', desc: 'Track and analyze competitor performance', color: '#8B5CF6' },
                { icon: BarChart3, title: 'Multi-Channel Support', desc: 'Manage multiple channels from one dashboard', color: '#F59E0B' }
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                    style={{backgroundColor: `${feature.color}20`}}
                  >
                    <feature.icon className="w-5 h-5" style={{color: feature.color}} />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold mb-1" style={{color: '#111827'}}>{feature.title}</h5>
                    <p className="text-sm leading-relaxed" style={{color: '#6B7280'}}>{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {analytics?.error && (
          <Card className="p-6 border-0 rounded-2xl shadow-lg" style={{backgroundColor: '#FEF3C7', borderColor: '#F59E0B'}}>
            <div className="flex items-center space-x-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{backgroundColor: '#F59E0B'}}
              >
                <RefreshCw className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold" style={{color: '#92400E'}}>Connection Issue</h4>
                <p className="text-sm mt-1" style={{color: '#A16207'}}>{analytics.message}</p>
              </div>
              <Button 
                onClick={handleRefresh}
                variant="outline"
                disabled={refreshing}
                className="rounded-xl"
              >
                Try Again
              </Button>
            </div>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8" style={{backgroundColor: '#F3F4F6', minHeight: '100vh'}}>
      {/* Header with Channel Info */}
      <div className="flex justify-between items-center fade-in-up">
        <div className="flex items-center space-x-6">
          <div>
            <h1 className="text-4xl font-bold" style={{color: '#111827'}}>Dashboard</h1>
            <div className="flex items-center space-x-3 mt-2">
              <p className="text-lg" style={{color: '#6B7280'}}>
                {connectedChannels.length === 0 ? 
                  "Connect your YouTube channels to view analytics" :
                  analytics?.channelInfo ? 
                    (analytics.error ? 
                      `${analytics.channelInfo.name} (Analytics unavailable)` : 
                      `Analytics for ${analytics.channelInfo.name}`
                    ) : 
                    `${connectedChannels.length} channel${connectedChannels.length !== 1 ? 's' : ''} connected`
                }
              </p>
              {connectedChannels.length > 0 && (
                <>
                  <div className="flex items-center space-x-2">
                    <div className={`status-dot ${analytics?.error ? 'status-error' : 'status-connected'}`}></div>
                    <Badge className="px-3 py-1 rounded-full font-medium text-xs" style={{
                      backgroundColor: analytics?.error ? '#FEE2E2' : '#D1FAE5',
                      color: analytics?.error ? '#DC2626' : '#065F46',
                      border: 'none'
                    }}>
                      {analytics?.error ? 'Data Error' : 'Connected'}
                    </Badge>
                  </div>
                  <Badge className="px-3 py-1 rounded-full font-medium text-xs" style={{
                    backgroundColor: '#DBEAFE',
                    color: '#1E40AF',
                    border: 'none'
                  }}>
                    {connectedChannels.length} Channel{connectedChannels.length !== 1 ? 's' : ''}
                  </Badge>
                </>
              )}
            </div>
          </div>
          {analytics?.channelInfo && (
            <img 
              src={analytics.channelInfo.thumbnail}
              alt={analytics.channelInfo.name}
              className="w-16 h-16 rounded-2xl shadow-lg"
            />
          )}
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={handleRefresh} 
            disabled={refreshing}
            className="btn-animate rounded-xl shadow-md"
          >
            {refreshing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button 
            variant="outline"
            onClick={() => setShowChannelModal(true)}
            className="btn-animate rounded-xl shadow-md"
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage Channels
          </Button>
          <Button 
            onClick={generateNewIdeas}
            className="btn-animate rounded-xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #4F46E5, #10B981)',
              borderColor: 'transparent'
            }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate New Ideas
          </Button>
        </div>
      </div>

      {/* Analytics Error Banner */}
      {analytics?.connected && analytics?.error && (
        <div className="rounded-2xl p-6 shadow-lg slide-in-right" style={{backgroundColor: '#FEF3C7'}}>
          <div className="flex items-center space-x-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
              style={{backgroundColor: '#F59E0B'}}
            >
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold" style={{color: '#92400E'}}>
                Analytics data temporarily unavailable
              </p>
              <p className="text-sm mt-1" style={{color: '#A16207'}}>
                Your channel is connected, but we're having trouble loading analytics data. This may be due to temporary network issues.
              </p>
            </div>
            <Button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="rounded-xl btn-animate"
              style={{
                backgroundColor: '#F59E0B',
                borderColor: '#F59E0B'
              }}
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
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6 card-hover bg-white shadow-xl border-0 rounded-2xl" style={{
              animationDelay: `${index * 0.1}s`
            }}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2" style={{color: '#6B7280'}}>{stat.label}</p>
                  <p className="text-3xl font-bold mb-3" style={{color: '#111827'}}>{stat.value}</p>
                  <div className="flex items-center">
                    {stat.positive ? (
                      <ArrowUpRight className="w-4 h-4" style={{color: '#10B981'}} />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" style={{color: '#EF4444'}} />
                    )}
                    <span className="text-sm font-semibold ml-1" style={{
                      color: stat.positive ? '#10B981' : '#EF4444'
                    }}>
                      {stat.change}
                    </span>
                    <span className="text-sm ml-2" style={{color: '#6B7280'}}>vs last month</span>
                  </div>
                </div>
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{backgroundColor: `${stat.color}20`}}
                >
                  <Icon className="w-7 h-7" style={{color: stat.color}} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <Card className="lg:col-span-2 p-8 bg-white shadow-xl border-0 rounded-3xl card-hover">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{backgroundColor: '#4F46E520'}}
              >
                <BarChart3 className="w-5 h-5" style={{color: '#4F46E5'}} />
              </div>
              <h3 className="text-xl font-bold" style={{color: '#111827'}}>Channel Growth</h3>
            </div>
            <div className="flex space-x-2">
              <Badge className="px-3 py-1 rounded-full font-medium text-xs" style={{
                backgroundColor: '#4F46E520',
                color: '#4F46E5',
                border: 'none'
              }}>Subscribers</Badge>
              <Badge className="px-3 py-1 rounded-full font-medium text-xs" style={{
                backgroundColor: '#10B98120',
                color: '#10B981',
                border: 'none'
              }}>Views</Badge>
            </div>
          </div>
          <div className="space-y-4">
            {analytics?.monthlyGrowth?.map((month, index) => (
              <div key={month.month} className="p-5 rounded-2xl shadow-md" style={{backgroundColor: '#F9FAFB'}}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold w-12" style={{color: '#111827'}}>{month.month}</span>
                  <div className="flex items-center space-x-6 text-sm" style={{color: '#6B7280'}}>
                    <div>+{month.subscribers?.toLocaleString()} subscribers</div>
                    <div>{month.views?.toLocaleString()} views</div>
                  </div>
                </div>
                <div className="w-full rounded-full h-3 shadow-inner" style={{backgroundColor: '#E5E7EB'}}>
                  <div 
                    className="h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{ 
                      width: `${Math.min(100, (month.subscribers / 35000) * 100)}%`,
                      background: 'linear-gradient(135deg, #4F46E5, #10B981)'
                    }}
                  ></div>
                </div>
              </div>
            )) || (
              <div className="text-center py-12" style={{color: '#6B7280'}}>
                <BarChart3 className="w-12 h-12 mx-auto mb-4" style={{color: '#D1D5DB'}} />
                <p>No growth data available</p>
              </div>
            )}
          </div>
        </Card>

        {/* Top Performing Video */}
        <Card className="p-8 bg-white shadow-xl border-0 rounded-3xl card-hover">
          <div className="flex items-center space-x-3 mb-6">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{backgroundColor: '#F59E0B20'}}
            >
              <Star className="w-5 h-5" style={{color: '#F59E0B'}} />
            </div>
            <h3 className="text-xl font-bold" style={{color: '#111827'}}>Top Performing Video</h3>
          </div>
          <div className="space-y-4">
            {analytics?.topPerformingVideo ? (
              <>
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src={analytics.topPerformingVideo.thumbnail || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=120&fit=crop'}
                    alt="Top video thumbnail"
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                      style={{backgroundColor: '#4F46E5'}}
                    >
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold mb-3 leading-tight" style={{color: '#111827'}}>
                    {analytics.topPerformingVideo.title}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{color: '#6B7280'}}>
                      {parseInt(analytics.topPerformingVideo.views)?.toLocaleString()} views
                    </span>
                    <Badge className="px-3 py-1 rounded-full font-bold text-xs" style={{
                      backgroundColor: '#10B98120',
                      color: '#10B981',
                      border: 'none'
                    }}>
                      Viral
                    </Badge>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12" style={{color: '#6B7280'}}>
                <Play className="w-12 h-12 mx-auto mb-4" style={{color: '#D1D5DB'}} />
                <p>No video data available</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Channels and Trending Videos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8 bg-white shadow-xl border-0 rounded-3xl card-hover">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{backgroundColor: '#8B5CF620'}}
              >
                <Users className="w-5 h-5" style={{color: '#8B5CF6'}} />
              </div>
              <h3 className="text-xl font-bold" style={{color: '#111827'}}>
                Your Channels ({connectedChannels.length})
              </h3>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowChannelModal(true)}
              className="rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Connect New
            </Button>
          </div>
          <div className="space-y-4">
            {connectedChannels.length > 0 ? (
              connectedChannels.map((channel) => (
                <div key={channel.id} className="p-4 rounded-2xl shadow-md" style={{backgroundColor: '#F9FAFB'}}>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={channel.thumbnail_url}
                      alt={channel.channel_name}
                      className="w-12 h-12 rounded-xl shadow-md"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-bold text-sm" style={{color: '#111827'}}>{channel.channel_name}</h4>
                        {channel.is_primary && (
                          <Badge className="text-xs px-2 py-1 rounded-full font-bold" style={{
                            backgroundColor: '#4F46E520',
                            color: '#4F46E5',
                            border: 'none'
                          }}>Primary</Badge>
                        )}
                      </div>
                      <p className="text-xs mb-2" style={{color: '#6B7280'}}>
                        {channel.channel_handle || channel.channel_id}
                      </p>
                      <div className="flex items-center space-x-3 text-xs" style={{color: '#6B7280'}}>
                        <span>{channel.subscriber_count?.toLocaleString()} subscribers</span>
                        <span>{channel.video_count} videos</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`https://youtube.com/channel/${channel.channel_id}`, '_blank')}
                      className="rounded-xl"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12" style={{color: '#6B7280'}}>
                <Youtube className="w-12 h-12 mx-auto mb-4" style={{color: '#D1D5DB'}} />
                <p className="mb-4">No channels connected</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowChannelModal(true)}
                  className="rounded-xl"
                >
                  Connect Your First Channel
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Live Trending Videos */}
        <Card className="p-8 bg-white shadow-xl border-0 rounded-3xl card-hover">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{backgroundColor: '#EF444420'}}
              >
                <TrendingUp className="w-5 h-5" style={{color: '#EF4444'}} />
              </div>
              <h3 className="text-xl font-bold" style={{color: '#111827'}}>Live Trending Videos</h3>
            </div>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/trending'} className="rounded-xl">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {trendingVideos.length > 0 ? (
              trendingVideos.map((video) => (
                <div key={video.id} className="flex space-x-4 p-4 rounded-2xl shadow-md" style={{backgroundColor: '#F9FAFB'}}>
                  <img 
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-20 h-14 object-cover rounded-xl shadow-md"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm leading-tight line-clamp-2 mb-2" style={{color: '#111827'}}>
                      {video.title}
                    </h4>
                    <p className="text-xs mb-2" style={{color: '#6B7280'}}>{video.channel}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{color: '#6B7280'}}>{video.views?.toLocaleString()} views</span>
                      <Badge className="text-xs px-2 py-1 rounded-full font-bold" style={{
                        backgroundColor: '#EF444420',
                        color: '#EF4444',
                        border: 'none'
                      }}>
                        {video.viral_score}% viral
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12" style={{color: '#6B7280'}}>
                {!refreshing && !loading ? (
                  <div>
                    <TrendingUp className="w-12 h-12 mx-auto mb-4" style={{color: '#D1D5DB'}} />
                    <p>No trending videos available</p>
                  </div>
                ) : (
                  <div>
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{color: '#4F46E5'}} />
                    <p>Loading trending videos...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Enhanced Channel Management Modal */}
      {showChannelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl border-0 rounded-3xl">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{backgroundColor: '#4F46E520'}}
                  >
                    <Settings className="w-6 h-6" style={{color: '#4F46E5'}} />
                  </div>
                  <h3 className="text-2xl font-bold" style={{color: '#111827'}}>Channel Management</h3>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowChannelModal(false)}
                  className="rounded-xl"
                >
                  ✕
                </Button>
              </div>

              {/* Connect New Channel Section */}
              <div className="border-b border-gray-100 pb-8 mb-8">
                <h4 className="text-lg font-bold mb-6" style={{color: '#111827'}}>Connect New Channel</h4>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={channelUrl}
                    onChange={(e) => setChannelUrl(e.target.value)}
                    placeholder="https://youtube.com/@channel or @username or Channel ID"
                    className="flex-1 p-4 border-2 rounded-2xl focus:outline-none focus:border-[#4F46E5] transition-colors"
                    style={{borderColor: '#E5E7EB', backgroundColor: '#F9FAFB'}}
                  />
                  <Button 
                    onClick={handleConnectChannel}
                    disabled={connecting || !channelUrl.trim()}
                    className="px-6 py-4 rounded-2xl font-semibold btn-animate shadow-lg"
                    style={{
                      backgroundColor: '#4F46E5',
                      borderColor: '#4F46E5'
                    }}
                  >
                    {connecting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Connect
                  </Button>
                </div>
                <p className="text-sm mt-3" style={{color: '#6B7280'}}>
                  Supports: YouTube URLs, channel handles (@username), or channel IDs
                </p>
              </div>

              {/* Connected Channels List */}
              <div>
                <h4 className="text-lg font-bold mb-6" style={{color: '#111827'}}>
                  Connected Channels ({connectedChannels.length})
                </h4>
                {connectedChannels.length > 0 ? (
                  <div className="space-y-4">
                    {connectedChannels.map((channel) => (
                      <div key={channel.id} className="flex items-center space-x-6 p-6 border-2 rounded-2xl" style={{borderColor: '#E5E7EB', backgroundColor: '#F9FAFB'}}>
                        <img 
                          src={channel.thumbnail_url}
                          alt={channel.channel_name}
                          className="w-16 h-16 rounded-2xl shadow-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h5 className="font-bold text-lg" style={{color: '#111827'}}>{channel.channel_name}</h5>
                            {channel.is_primary && (
                              <Badge className="text-xs px-3 py-1 rounded-full font-bold" style={{
                                backgroundColor: '#4F46E520',
                                color: '#4F46E5',
                                border: 'none'
                              }}>Primary</Badge>
                            )}
                          </div>
                          <p className="text-sm mb-3" style={{color: '#6B7280'}}>
                            {channel.channel_handle || channel.channel_id}
                          </p>
                          <div className="flex items-center space-x-6 text-sm" style={{color: '#6B7280'}}>
                            <span>{channel.subscriber_count?.toLocaleString()} subscribers</span>
                            <span>{channel.video_count} videos</span>
                            <span>Connected: {new Date(channel.connected_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          {!channel.is_primary && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSetPrimaryChannel(channel.id, channel.channel_name)}
                              disabled={managingChannels}
                              className="rounded-xl"
                            >
                              Set Primary
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(`https://youtube.com/channel/${channel.channel_id}`, '_blank')}
                            className="rounded-xl"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDisconnectChannel(channel.channel_id, channel.channel_name)}
                            disabled={managingChannels}
                            className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                          >
                            {managingChannels ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              'Disconnect'
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16" style={{color: '#6B7280'}}>
                    <Youtube className="w-16 h-16 mx-auto mb-6" style={{color: '#D1D5DB'}} />
                    <h5 className="font-bold text-lg mb-3" style={{color: '#111827'}}>No Channels Connected</h5>
                    <p>Connect your first YouTube channel using the form above.</p>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="flex justify-between items-center mt-10 pt-8 border-t border-gray-100">
                <div className="text-sm" style={{color: '#6B7280'}}>
                  {connectedChannels.length > 0 && (
                    <>
                      Primary channel analytics are displayed on the dashboard.
                      <br />
                      You can switch primary channels anytime.
                    </>
                  )}
                </div>
                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowChannelModal(false)}
                    className="rounded-xl"
                  >
                    Close
                  </Button>
                  {connectedChannels.length > 0 && (
                    <Button 
                      onClick={() => {
                        setShowChannelModal(false);
                        handleRefresh();
                      }}
                      disabled={refreshing}
                      className="rounded-xl btn-animate"
                      style={{
                        backgroundColor: '#4F46E5',
                        borderColor: '#4F46E5'
                      }}
                    >
                      {refreshing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4 mr-2" />
                      )}
                      Refresh Dashboard
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;