import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Clock, 
  DollarSign,
  Play,
  ThumbsUp,
  MessageSquare,
  Share2,
  Download,
  BarChart3
} from 'lucide-react';
import { mockAnalytics, mockChannels } from '../data/mockData';

const ChannelAnalytics = () => {
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [timeRange, setTimeRange] = useState('30d');

  const topVideos = [
    {
      id: '1',
      title: 'My Best Gaming Setup Under $500',
      views: 2100000,
      likes: 89000,
      comments: 5200,
      thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=120&fit=crop',
      publishDate: '2024-12-15',
      duration: '12:45'
    },
    {
      id: '2',
      title: 'Why Everyone is Switching to This Tech',
      views: 1850000,
      likes: 76000,
      comments: 4100,
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=120&fit=crop',
      publishDate: '2024-12-20',
      duration: '8:32'
    },
    {
      id: '3',
      title: 'I Tried Living Like a Millionaire',
      views: 1650000,
      likes: 82000,
      comments: 6800,
      thumbnail: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=200&h=120&fit=crop',
      publishDate: '2024-12-25',
      duration: '15:20'
    }
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Channel Analytics</h1>
          <p className="text-gray-600 mt-1">Deep insights into your channel performance</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <BarChart3 className="w-4 h-4 mr-2" />
            Advanced Analytics
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <Select value={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              {mockChannels.map((channel) => (
                <SelectItem key={channel.id} value={channel.id}>
                  {channel.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(mockAnalytics.totalViews)}</p>
              <div className="flex items-center mt-2 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12.5% vs last month
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(mockAnalytics.totalSubscribers)}</p>
              <div className="flex items-center mt-2 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                +8.2% vs last month
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg View Duration</p>
              <p className="text-2xl font-bold text-gray-900">{mockAnalytics.avgViewDuration}</p>
              <div className="flex items-center mt-2 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                +2.3% vs last month
              </div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${formatNumber(mockAnalytics.revenueThisMonth)}</p>
              <div className="flex items-center mt-2 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                +15.7% vs last month
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance Over Time</h3>
            <div className="flex space-x-2">
              <Badge variant="outline">Views</Badge>
              <Badge variant="outline">Subscribers</Badge>
            </div>
          </div>
          <div className="space-y-4">
            {mockAnalytics.monthlyGrowth.map((month) => (
              <div key={month.month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 w-12">{month.month}</span>
                <div className="flex-1 mx-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{formatNumber(month.subscribers)} subs</span>
                    <span>{formatNumber(month.views)} views</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${(month.views / 2500000) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Engagement Stats */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Engagement Metrics</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-50 rounded-lg">
                  <ThumbsUp className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Like Rate</p>
                  <p className="text-sm text-gray-600">Average likes per video</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{mockAnalytics.engagementRate}%</p>
                <p className="text-xs text-green-600">+1.2%</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Comment Rate</p>
                  <p className="text-sm text-gray-600">Comments per 1K views</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">2.4</p>
                <p className="text-xs text-green-600">+0.3</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Share2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Share Rate</p>
                  <p className="text-sm text-gray-600">Shares per 1K views</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">1.8</p>
                <p className="text-xs text-red-600">-0.1</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Eye className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">CTR</p>
                  <p className="text-sm text-gray-600">Click-through rate</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{mockAnalytics.clickThroughRate}%</p>
                <p className="text-xs text-green-600">+0.8%</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Performing Videos */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Videos</h3>
          <Button variant="outline" size="sm">View All</Button>
        </div>
        <div className="space-y-4">
          {topVideos.map((video, index) => (
            <div key={video.id} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold text-sm">
                {index + 1}
              </div>
              
              <div className="relative">
                <img 
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-24 h-14 object-cover rounded-lg"
                />
                <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                  {video.duration}
                </div>
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{video.title}</h4>
                <p className="text-sm text-gray-600">{video.publishDate}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="flex items-center justify-center text-blue-600 mb-1">
                    <Eye className="w-4 h-4 mr-1" />
                    <span className="font-medium">{formatNumber(video.views)}</span>
                  </div>
                  <p className="text-xs text-gray-500">Views</p>
                </div>
                <div>
                  <div className="flex items-center justify-center text-red-600 mb-1">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    <span className="font-medium">{formatNumber(video.likes)}</span>
                  </div>
                  <p className="text-xs text-gray-500">Likes</p>
                </div>
                <div>
                  <div className="flex items-center justify-center text-green-600 mb-1">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    <span className="font-medium">{formatNumber(video.comments)}</span>
                  </div>
                  <p className="text-xs text-gray-500">Comments</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ChannelAnalytics;