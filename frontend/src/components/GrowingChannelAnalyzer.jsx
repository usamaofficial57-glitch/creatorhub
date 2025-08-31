import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  TrendingUp, 
  Eye, 
  Users, 
  Heart, 
  MessageCircle,
  Share2,
  Clock,
  Target,
  Zap,
  Copy,
  Sparkles,
  BarChart3,
  Video,
  ThumbsUp,
  PlayCircle,
  ExternalLink,
  RefreshCw,
  Loader2,
  Search,
  Filter,
  Calendar,
  Star,
  Award,
  Flame,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  FileText,
  Image,
  Wand2,
  Lightbulb,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const GrowingChannelAnalyzer = () => {
  const [activeTab, setActiveTab] = useState('growth-analysis');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);
  const { toast } = useToast();

  // Mock data for Growing Channels Analysis
  const mockGrowingChannels = [
    {
      id: 1,
      channelName: "TechStartup Chronicles",
      channelId: "UCTechStartup123",
      thumbnailUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=64&h=64&fit=crop&crop=face",
      subscriberCount: 156000,
      subscriberGrowthRate: 287.5, // % growth in last 30 days
      viewsPerVideo: 89400,
      engagementRate: 8.4,
      niche: "Technology/Startup",
      growthTrend: "exponential",
      recentGrowth: "+44.7K subs (30d)",
      avgViews30d: 1.2,
      viralScore: 94,
      contentConsistency: 85,
      uploadFrequency: "3x/week"
    },
    {
      id: 2,
      channelName: "AI Revolution Hub",
      channelId: "UCAIRevolution456",
      thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      subscriberCount: 89300,
      subscriberGrowthRate: 198.3,
      viewsPerVideo: 67200,
      engagementRate: 12.1,
      niche: "AI/Machine Learning",
      growthTrend: "steep",
      recentGrowth: "+28.1K subs (30d)",
      avgViews30d: 890000,
      viralScore: 89,
      contentConsistency: 92,
      uploadFrequency: "2x/week"
    },
    {
      id: 3,
      channelName: "Crypto Simplified",
      channelId: "UCCryptoSimple789",
      thumbnailUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      subscriberCount: 234500,
      subscriberGrowthRate: 156.8,
      viewsPerVideo: 145000,
      engagementRate: 7.8,
      niche: "Cryptocurrency/Finance",
      growthTrend: "consistent",
      recentGrowth: "+56.2K subs (30d)",
      avgViews30d: 2100000,
      viralScore: 82,
      contentConsistency: 78,
      uploadFrequency: "Daily"
    },
    {
      id: 4,
      channelName: "Mindful Productivity",
      channelId: "UCMindfulProd101",
      thumbnailUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b3fd?w=64&h=64&fit=crop&crop=face",
      subscriberCount: 67800,
      subscriberGrowthRate: 245.2,
      viewsPerVideo: 34500,
      engagementRate: 15.6,
      niche: "Productivity/Lifestyle",
      growthTrend: "viral",
      recentGrowth: "+19.4K subs (30d)",
      avgViews30d: 456000,
      viralScore: 91,
      contentConsistency: 88,
      uploadFrequency: "4x/week"
    },
    {
      id: 5,
      channelName: "WebDev Masters",
      channelId: "UCWebDevMasters",
      thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      subscriberCount: 112000,
      subscriberGrowthRate: 189.4,
      viewsPerVideo: 78900,
      engagementRate: 9.2,
      niche: "Web Development",
      growthTrend: "accelerating",
      recentGrowth: "+32.1K subs (30d)",
      avgViews30d: 980000,
      viralScore: 87,
      contentConsistency: 83,
      uploadFrequency: "3x/week"
    }
  ];

  // Mock content patterns data
  const mockContentPatterns = {
    1: {
      winningFormulas: [
        {
          pattern: "Problem-Solution-Result",
          usage: 85,
          avgViews: 127000,
          engagement: 8.9,
          example: "Why Your Startup is Failing + The Fix That Saved Mine"
        },
        {
          pattern: "Behind-the-Scenes",
          usage: 70,
          avgViews: 98000,
          engagement: 12.3,
          example: "Building a $1M Startup in My Garage (Real Footage)"
        },
        {
          pattern: "Lessons Learned",
          usage: 60,
          avgViews: 89000,
          engagement: 7.4,
          example: "10 Mistakes That Cost Me $500K (Learn From My Failures)"
        }
      ],
      keywordPatterns: [
        { keyword: "startup", frequency: 92, performance: "high" },
        { keyword: "entrepreneur", frequency: 76, performance: "high" },
        { keyword: "fail", frequency: 65, performance: "very high" },
        { keyword: "million", frequency: 58, performance: "high" },
        { keyword: "bootstrap", frequency: 43, performance: "medium" }
      ],
      videoFormats: {
        "Long-form (8-15 min)": { percentage: 65, avgViews: 134000 },
        "Short-form (<60s)": { percentage: 25, avgViews: 89000 },
        "Mid-form (3-7 min)": { percentage: 10, avgViews: 67000 }
      },
      titlePatterns: [
        "Why [Problem] + [Solution]",
        "I [Action] and [Result]",
        "[Number] [Mistakes/Lessons] That [Impact]",
        "Building [Something] in [Timeframe]"
      ],
      thumbnailStyles: {
        "Face + Text Overlay": 78,
        "Before/After Split": 65,
        "Question/Problem Visual": 52,
        "Product/Result Focus": 43
      },
      uploadTiming: {
        bestDays: ["Tuesday", "Thursday", "Sunday"],
        bestTimes: ["2PM EST", "6PM EST", "9AM EST"],
        consistency: 85
      }
    }
  };

  // Mock improved content generation
  const mockImprovedContent = {
    1: {
      originalTitle: "Why Your Startup is Failing + The Fix That Saved Mine",
      improvedTitles: [
        "The ONE Mistake Killing 90% of Startups (+ How I Fixed Mine)",
        "I Lost $200K Before Learning This Startup Secret",
        "Why Your Startup Will Fail in 2025 (Unless You Do This)",
        "The $500K Startup Mistake I Made So You Don't Have To"
      ],
      scriptImprovement: {
        hookSuggestion: "Start with a shocking statistic: '95% of startups fail within 5 years, and I was about to become one of them...'",
        structureTips: [
          "Lead with the failure story (emotional hook)",
          "Break down the exact mistake in 3 parts",
          "Show real numbers/proof of the solution",
          "End with actionable steps viewers can take today"
        ],
        toneOptimization: "More conversational, less corporate. Use 'you' instead of 'one'. Add personal anecdotes."
      },
      thumbnailSuggestions: [
        {
          concept: "Split-screen: Worried face vs. Confident face",
          elements: ["Red X over failing chart", "Green checkmark over growth chart", "Bold text: 'FIXED'"],
          colorScheme: "Red/Green contrast"
        },
        {
          concept: "Money burning effect",
          elements: ["Stack of cash with fire effect", "Arrow pointing to solution", "Shocked expression"],
          colorScheme: "Orange/Yellow flames"
        }
      ]
    }
  };

  const handleAnalyzeChannel = async (channelId) => {
    setAnalyzing(true);
    setSelectedChannel(channelId);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Analysis Complete!",
        description: "Content patterns have been extracted and analyzed.",
      });
      setAnalyzing(false);
    }, 2000);
  };

  const handleGenerateImprovedContent = async (channelId) => {
    setLoading(true);
    
    // Simulate AI content generation
    setTimeout(() => {
      setGeneratedContent(mockImprovedContent[channelId]);
      toast({
        title: "Content Generated!",
        description: "Improved copycat content has been created successfully.",
      });
      setLoading(false);
    }, 3000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content has been copied to clipboard.",
    });
  };

  const getGrowthIcon = (trend) => {
    switch (trend) {
      case 'exponential':
      case 'viral':
        return <Flame className="w-4 h-4" style={{color: '#EF4444'}} />;
      case 'steep':
      case 'accelerating':
        return <TrendingUp className="w-4 h-4" style={{color: '#10B981'}} />;
      default:
        return <Activity className="w-4 h-4" style={{color: '#F59E0B'}} />;
    }
  };

  const getGrowthColor = (rate) => {
    if (rate >= 200) return '#EF4444'; // Red for extreme growth
    if (rate >= 150) return '#F59E0B'; // Orange for high growth
    return '#10B981'; // Green for moderate growth
  };

  return (
    <div className="p-8 space-y-8" style={{backgroundColor: '#F3F4F6', minHeight: '100vh'}}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold" style={{color: '#111827'}}>Growing Channel Analyzer</h1>
          <p className="text-lg mt-2" style={{color: '#6B7280'}}>
            Discover fast-growing channels, extract winning patterns, and create improved copycat content
          </p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="btn-animate rounded-xl shadow-md"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button 
            className="btn-animate rounded-xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #4F46E5, #10B981)',
              borderColor: 'transparent'
            }}
          >
            <Target className="w-4 h-4 mr-2" />
            Auto-Discover Channels
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl p-2 shadow-lg">
        <div className="flex space-x-2">
          {[
            { id: 'growth-analysis', label: 'Channel Growth Analysis', icon: BarChart3 },
            { id: 'pattern-extraction', label: 'Content Pattern Extraction', icon: Search },
            { id: 'copycat-engine', label: 'Copy & Improve Engine', icon: Wand2 }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                  active ? 'text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'
                }`}
                style={{
                  backgroundColor: active ? '#4F46E5' : 'transparent'
                }}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'growth-analysis' && (
        <div className="space-y-8">
          {/* Growth Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Fastest Growing', value: '287.5%', subtitle: 'TechStartup Chronicles', icon: Flame, color: '#EF4444' },
              { label: 'Top Views/Video', value: '145K', subtitle: 'Crypto Simplified', icon: Eye, color: '#8B5CF6' },
              { label: 'Best Engagement', value: '15.6%', subtitle: 'Mindful Productivity', icon: Heart, color: '#EC4899' },
              { label: 'Trending Niches', value: '5', subtitle: 'AI, Crypto, Startup', icon: Target, color: '#10B981' }
            ].map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card key={metric.label} className="p-6 bg-white shadow-xl border-0 rounded-2xl card-hover">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium mb-2" style={{color: '#6B7280'}}>{metric.label}</p>
                      <p className="text-3xl font-bold mb-1" style={{color: '#111827'}}>{metric.value}</p>
                      <p className="text-xs" style={{color: '#9CA3AF'}}>{metric.subtitle}</p>
                    </div>
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{backgroundColor: `${metric.color}20`}}
                    >
                      <Icon className="w-6 h-6" style={{color: metric.color}} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Growing Channels List */}
          <Card className="bg-white shadow-xl border-0 rounded-3xl">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{backgroundColor: '#4F46E520'}}
                  >
                    <TrendingUp className="w-6 h-6" style={{color: '#4F46E5'}} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold" style={{color: '#111827'}}>Fastest Growing Channels</h3>
                    <p className="text-sm" style={{color: '#6B7280'}}>Ranked by subscriber growth rate (last 30 days)</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter by Niche
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <Calendar className="w-4 h-4 mr-2" />
                    Time Range
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {mockGrowingChannels.map((channel, index) => (
                  <div 
                    key={channel.id}
                    className="p-6 rounded-2xl border-2 hover:shadow-lg transition-all duration-200 cursor-pointer"
                    style={{borderColor: '#E5E7EB', backgroundColor: '#FAFBFC'}}
                  >
                    <div className="flex items-center space-x-6">
                      {/* Rank Badge */}
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg"
                        style={{
                          backgroundColor: index === 0 ? '#EF4444' : index === 1 ? '#F59E0B' : index === 2 ? '#10B981' : '#6B7280'
                        }}
                      >
                        #{index + 1}
                      </div>

                      {/* Channel Info */}
                      <div className="flex items-center space-x-4 flex-1">
                        <img 
                          src={channel.thumbnailUrl}
                          alt={channel.channelName}
                          className="w-16 h-16 rounded-2xl shadow-md"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-bold" style={{color: '#111827'}}>{channel.channelName}</h4>
                            {getGrowthIcon(channel.growthTrend)}
                            <Badge 
                              className="text-xs px-3 py-1 rounded-full font-bold border-0"
                              style={{
                                backgroundColor: `${getGrowthColor(channel.subscriberGrowthRate)}20`,
                                color: getGrowthColor(channel.subscriberGrowthRate)
                              }}
                            >
                              {channel.niche}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-6 text-sm" style={{color: '#6B7280'}}>
                            <span>{channel.subscriberCount.toLocaleString()} subscribers</span>
                            <span>{channel.viewsPerVideo.toLocaleString()} avg views</span>
                            <span>{channel.engagementRate}% engagement</span>
                            <span>{channel.uploadFrequency}</span>
                          </div>
                        </div>
                      </div>

                      {/* Growth Metrics */}
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <ArrowUpRight className="w-4 h-4" style={{color: getGrowthColor(channel.subscriberGrowthRate)}} />
                          <span 
                            className="text-lg font-bold"
                            style={{color: getGrowthColor(channel.subscriberGrowthRate)}}
                          >
                            +{channel.subscriberGrowthRate}%
                          </span>
                        </div>
                        <p className="text-sm" style={{color: '#6B7280'}}>{channel.recentGrowth}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Star className="w-4 h-4" style={{color: '#F59E0B'}} />
                          <span className="text-sm font-medium" style={{color: '#F59E0B'}}>
                            {channel.viralScore}/100 viral
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button 
                        onClick={() => handleAnalyzeChannel(channel.id)}
                        className="rounded-xl btn-animate"
                        style={{backgroundColor: '#4F46E5'}}
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Analyze
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'pattern-extraction' && (
        <div className="space-y-8">
          {selectedChannel ? (
            <div className="space-y-8">
              {/* Channel Analysis Header */}
              <Card className="bg-white shadow-xl border-0 rounded-3xl">
                <div className="p-8">
                  <div className="flex items-center space-x-6">
                    <img 
                      src={mockGrowingChannels.find(c => c.id === selectedChannel)?.thumbnailUrl}
                      alt="Channel"
                      className="w-20 h-20 rounded-3xl shadow-lg"
                    />
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold mb-2" style={{color: '#111827'}}>
                        Content Pattern Analysis
                      </h2>
                      <p className="text-lg" style={{color: '#6B7280'}}>
                        {mockGrowingChannels.find(c => c.id === selectedChannel)?.channelName}
                      </p>
                      <div className="flex items-center space-x-4 mt-3">
                        <Badge className="px-3 py-1 rounded-full border-0" style={{backgroundColor: '#10B98120', color: '#10B981'}}>
                          Analysis Complete
                        </Badge>
                        {analyzing && (
                          <div className="flex items-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin" style={{color: '#4F46E5'}} />
                            <span className="text-sm" style={{color: '#4F46E5'}}>Analyzing patterns...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {mockContentPatterns[selectedChannel] && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Winning Content Formulas */}
                  <Card className="bg-white shadow-xl border-0 rounded-3xl">
                    <div className="p-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{backgroundColor: '#8B5CF620'}}
                        >
                          <Target className="w-5 h-5" style={{color: '#8B5CF6'}} />
                        </div>
                        <h3 className="text-xl font-bold" style={{color: '#111827'}}>Winning Content Formulas</h3>
                      </div>
                      <div className="space-y-4">
                        {mockContentPatterns[selectedChannel].winningFormulas.map((formula, index) => (
                          <div key={index} className="p-4 rounded-2xl" style={{backgroundColor: '#F9FAFB'}}>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-bold" style={{color: '#111827'}}>{formula.pattern}</h4>
                              <div className="flex items-center space-x-2">
                                <Progress value={formula.usage} className="w-20 h-2" />
                                <span className="text-sm font-medium" style={{color: '#6B7280'}}>{formula.usage}%</span>
                              </div>
                            </div>
                            <p className="text-sm mb-3" style={{color: '#6B7280'}}>{formula.example}</p>
                            <div className="flex items-center space-x-4 text-xs" style={{color: '#9CA3AF'}}>
                              <span>{formula.avgViews.toLocaleString()} avg views</span>
                              <span>{formula.engagement}% engagement</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Keywords & Performance */}
                  <Card className="bg-white shadow-xl border-0 rounded-3xl">
                    <div className="p-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{backgroundColor: '#10B98120'}}
                        >
                          <Zap className="w-5 h-5" style={{color: '#10B981'}} />
                        </div>
                        <h3 className="text-xl font-bold" style={{color: '#111827'}}>High-Performance Keywords</h3>
                      </div>
                      <div className="space-y-3">
                        {mockContentPatterns[selectedChannel].keywordPatterns.map((keyword, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-xl" style={{backgroundColor: '#F9FAFB'}}>
                            <div className="flex items-center space-x-3">
                              <Badge 
                                className="text-xs px-2 py-1 rounded-full border-0"
                                style={{
                                  backgroundColor: keyword.performance === 'very high' ? '#EF444420' : 
                                                   keyword.performance === 'high' ? '#F59E0B20' : '#10B98120',
                                  color: keyword.performance === 'very high' ? '#EF4444' : 
                                         keyword.performance === 'high' ? '#F59E0B' : '#10B981'
                                }}
                              >
                                {keyword.performance}
                              </Badge>
                              <span className="font-medium" style={{color: '#111827'}}>"{keyword.keyword}"</span>
                            </div>
                            <div className="text-sm" style={{color: '#6B7280'}}>
                              {keyword.frequency}% frequency
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Video Formats */}
                  <Card className="bg-white shadow-xl border-0 rounded-3xl">
                    <div className="p-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{backgroundColor: '#F59E0B20'}}
                        >
                          <Video className="w-5 h-5" style={{color: '#F59E0B'}} />
                        </div>
                        <h3 className="text-xl font-bold" style={{color: '#111827'}}>Optimal Video Formats</h3>
                      </div>
                      <div className="space-y-4">
                        {Object.entries(mockContentPatterns[selectedChannel].videoFormats).map(([format, data]) => (
                          <div key={format} className="p-4 rounded-2xl" style={{backgroundColor: '#F9FAFB'}}>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-bold" style={{color: '#111827'}}>{format}</h4>
                              <span className="text-sm font-medium" style={{color: '#6B7280'}}>{data.percentage}%</span>
                            </div>
                            <div className="w-full rounded-full h-3" style={{backgroundColor: '#E5E7EB'}}>
                              <div 
                                className="h-3 rounded-full transition-all duration-500"
                                style={{ 
                                  width: `${data.percentage}%`,
                                  background: 'linear-gradient(135deg, #F59E0B, #EF4444)'
                                }}
                              ></div>
                            </div>
                            <p className="text-xs mt-2" style={{color: '#9CA3AF'}}>
                              {data.avgViews.toLocaleString()} average views
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Title Patterns */}
                  <Card className="bg-white shadow-xl border-0 rounded-3xl">
                    <div className="p-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{backgroundColor: '#EC489920'}}
                        >
                          <FileText className="w-5 h-5" style={{color: '#EC4899'}} />
                        </div>
                        <h3 className="text-xl font-bold" style={{color: '#111827'}}>Viral Title Patterns</h3>
                      </div>
                      <div className="space-y-3">
                        {mockContentPatterns[selectedChannel].titlePatterns.map((pattern, index) => (
                          <div key={index} className="p-4 rounded-xl border-2 border-dashed" style={{borderColor: '#E5E7EB'}}>
                            <div className="flex items-center justify-between">
                              <code className="text-sm font-mono px-3 py-1 rounded-lg" style={{backgroundColor: '#F3F4F6', color: '#374151'}}>
                                {pattern}
                              </code>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => copyToClipboard(pattern)}
                                className="rounded-lg"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          ) : (
            <Card className="bg-white shadow-xl border-0 rounded-3xl">
              <div className="p-16 text-center">
                <Search className="w-20 h-20 mx-auto mb-6" style={{color: '#D1D5DB'}} />
                <h3 className="text-2xl font-bold mb-4" style={{color: '#111827'}}>Select a Channel to Analyze</h3>
                <p className="text-lg mb-8" style={{color: '#6B7280'}}>
                  Go to the "Channel Growth Analysis" tab and click "Analyze" on any channel to extract content patterns.
                </p>
                <Button 
                  onClick={() => setActiveTab('growth-analysis')}
                  className="rounded-xl btn-animate"
                  style={{backgroundColor: '#4F46E5'}}
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Browse Growing Channels
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'copycat-engine' && (
        <div className="space-y-8">
          {selectedChannel && mockContentPatterns[selectedChannel] ? (
            <div className="space-y-8">
              {/* Generate Content Header */}
              <Card className="bg-white shadow-xl border-0 rounded-3xl">
                <div className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div 
                        className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg"
                        style={{background: 'linear-gradient(135deg, #4F46E5, #10B981)'}}
                      >
                        <Wand2 className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold mb-2" style={{color: '#111827'}}>Copy & Improve Engine</h2>
                        <p className="text-lg" style={{color: '#6B7280'}}>
                          Generate improved copycat versions based on {mockGrowingChannels.find(c => c.id === selectedChannel)?.channelName}'s patterns
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleGenerateImprovedContent(selectedChannel)}
                      disabled={loading}
                      className="rounded-xl btn-animate shadow-lg"
                      style={{background: 'linear-gradient(135deg, #4F46E5, #10B981)'}}
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="w-5 h-5 mr-2" />
                      )}
                      Generate Improved Content
                    </Button>
                  </div>
                </div>
              </Card>

              {generatedContent ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Improved Titles */}
                  <Card className="bg-white shadow-xl border-0 rounded-3xl">
                    <div className="p-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{backgroundColor: '#4F46E520'}}
                        >
                          <Lightbulb className="w-5 h-5" style={{color: '#4F46E5'}} />
                        </div>
                        <h3 className="text-xl font-bold" style={{color: '#111827'}}>AI-Improved Titles</h3>
                      </div>
                      
                      {/* Original Title */}
                      <div className="p-4 rounded-2xl mb-6" style={{backgroundColor: '#FEF3C7'}}>
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertCircle className="w-4 h-4" style={{color: '#F59E0B'}} />
                          <span className="text-sm font-medium" style={{color: '#92400E'}}>Original</span>
                        </div>
                        <p className="font-medium" style={{color: '#92400E'}}>{generatedContent.originalTitle}</p>
                      </div>

                      {/* Improved Titles */}
                      <div className="space-y-4">
                        {generatedContent.improvedTitles.map((title, index) => (
                          <div key={index} className="p-4 rounded-2xl border-2" style={{borderColor: '#10B981', backgroundColor: '#F0FDF4'}}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <CheckCircle2 className="w-4 h-4" style={{color: '#10B981'}} />
                                <span className="text-sm font-medium" style={{color: '#166534'}}>Improved #{index + 1}</span>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => copyToClipboard(title)}
                                className="rounded-lg"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="font-medium" style={{color: '#166534'}}>{title}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Script Improvements */}
                  <Card className="bg-white shadow-xl border-0 rounded-3xl">
                    <div className="p-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{backgroundColor: '#8B5CF620'}}
                        >
                          <FileText className="w-5 h-5" style={{color: '#8B5CF6'}} />
                        </div>
                        <h3 className="text-xl font-bold" style={{color: '#111827'}}>Script Enhancement</h3>
                      </div>

                      <div className="space-y-6">
                        {/* Hook Suggestion */}
                        <div className="p-4 rounded-2xl" style={{backgroundColor: '#EFF6FF'}}>
                          <h4 className="font-bold mb-3 flex items-center space-x-2" style={{color: '#1E40AF'}}>
                            <Zap className="w-4 h-4" />
                            <span>Improved Hook</span>
                          </h4>
                          <p className="text-sm leading-relaxed" style={{color: '#1E3A8A'}}>
                            {generatedContent.scriptImprovement.hookSuggestion}
                          </p>
                        </div>

                        {/* Structure Tips */}
                        <div className="p-4 rounded-2xl" style={{backgroundColor: '#F0FDF4'}}>
                          <h4 className="font-bold mb-3 flex items-center space-x-2" style={{color: '#166534'}}>
                            <Target className="w-4 h-4" />
                            <span>Structure Optimization</span>
                          </h4>
                          <ul className="space-y-2">
                            {generatedContent.scriptImprovement.structureTips.map((tip, index) => (
                              <li key={index} className="flex items-start space-x-2 text-sm" style={{color: '#166534'}}>
                                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{color: '#10B981'}} />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Tone Optimization */}
                        <div className="p-4 rounded-2xl" style={{backgroundColor: '#FDF4FF'}}>
                          <h4 className="font-bold mb-3 flex items-center space-x-2" style={{color: '#7C3AED'}}>
                            <Heart className="w-4 h-4" />
                            <span>Tone Enhancement</span>
                          </h4>
                          <p className="text-sm leading-relaxed" style={{color: '#6B21A8'}}>
                            {generatedContent.scriptImprovement.toneOptimization}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Thumbnail Suggestions */}
                  <Card className="lg:col-span-2 bg-white shadow-xl border-0 rounded-3xl">
                    <div className="p-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{backgroundColor: '#F59E0B20'}}
                        >
                          <Image className="w-5 h-5" style={{color: '#F59E0B'}} />
                        </div>
                        <h3 className="text-xl font-bold" style={{color: '#111827'}}>AI Thumbnail Concepts</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {generatedContent.thumbnailSuggestions.map((suggestion, index) => (
                          <div key={index} className="p-6 rounded-2xl" style={{backgroundColor: '#F9FAFB'}}>
                            <div className="flex items-center space-x-3 mb-4">
                              <div 
                                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white"
                                style={{backgroundColor: '#F59E0B'}}
                              >
                                {index + 1}
                              </div>
                              <h4 className="font-bold" style={{color: '#111827'}}>{suggestion.concept}</h4>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm font-medium mb-2" style={{color: '#6B7280'}}>Elements:</p>
                                <div className="flex flex-wrap gap-2">
                                  {suggestion.elements.map((element, elemIndex) => (
                                    <Badge 
                                      key={elemIndex}
                                      className="text-xs px-2 py-1 rounded-full border-0"
                                      style={{backgroundColor: '#F59E0B20', color: '#F59E0B'}}
                                    >
                                      {element}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium mb-1" style={{color: '#6B7280'}}>Color Scheme:</p>
                                <p className="text-sm" style={{color: '#374151'}}>{suggestion.colorScheme}</p>
                              </div>
                              
                              <div className="flex space-x-2 mt-4">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="flex-1 rounded-lg"
                                >
                                  <Image className="w-4 h-4 mr-2" />
                                  Generate Image
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => copyToClipboard(JSON.stringify(suggestion, null, 2))}
                                  className="rounded-lg"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              ) : (
                <Card className="bg-white shadow-xl border-0 rounded-3xl">
                  <div className="p-16 text-center">
                    <Wand2 className="w-20 h-20 mx-auto mb-6" style={{color: '#D1D5DB'}} />
                    <h3 className="text-2xl font-bold mb-4" style={{color: '#111827'}}>Ready to Generate Improved Content</h3>
                    <p className="text-lg mb-8" style={{color: '#6B7280'}}>
                      Click "Generate Improved Content" to create optimized titles, scripts, and thumbnail concepts 
                      based on the analyzed channel patterns.
                    </p>
                    <Button 
                      onClick={() => handleGenerateImprovedContent(selectedChannel)}
                      disabled={loading}
                      className="px-8 py-4 text-lg rounded-xl btn-animate shadow-lg"
                      style={{background: 'linear-gradient(135deg, #4F46E5, #10B981)'}}
                    >
                      {loading ? (
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-6 h-6 mr-3" />
                      )}
                      Generate Improved Content
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          ) : (
            <Card className="bg-white shadow-xl border-0 rounded-3xl">
              <div className="p-16 text-center">
                <Target className="w-20 h-20 mx-auto mb-6" style={{color: '#D1D5DB'}} />
                <h3 className="text-2xl font-bold mb-4" style={{color: '#111827'}}>Analyze a Channel First</h3>
                <p className="text-lg mb-8" style={{color: '#6B7280'}}>
                  You need to analyze a growing channel's content patterns before generating improved copycat content.
                </p>
                <div className="flex space-x-4 justify-center">
                  <Button 
                    onClick={() => setActiveTab('growth-analysis')}
                    variant="outline"
                    className="rounded-xl"
                  >
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Browse Channels
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('pattern-extraction')}
                    className="rounded-xl"
                    style={{backgroundColor: '#4F46E5'}}
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Analyze Patterns
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default GrowingChannelAnalyzer;