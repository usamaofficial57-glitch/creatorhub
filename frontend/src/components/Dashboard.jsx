import React from 'react';
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
  ArrowDownRight 
} from 'lucide-react';
import { mockAnalytics, mockChannels, mockTrendingVideos } from '../data/mockData';

const Dashboard = () => {
  const stats = [
    {
      label: 'Total Views',
      value: mockAnalytics.totalViews.toLocaleString(),
      change: '+12.5%',
      positive: true,
      icon: Eye
    },
    {
      label: 'Subscribers',
      value: mockAnalytics.totalSubscribers.toLocaleString(),
      change: '+8.2%',
      positive: true,
      icon: Users
    },
    {
      label: 'Avg View Duration',
      value: mockAnalytics.avgViewDuration,
      change: '+2.3%',
      positive: true,
      icon: Clock
    },
    {
      label: 'Monthly Revenue',
      value: `$${mockAnalytics.revenueThisMonth.toLocaleString()}`,
      change: '+15.7%',
      positive: true,
      icon: DollarSign
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your channel overview.</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          Generate New Ideas
        </Button>
      </div>

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
            {mockAnalytics.monthlyGrowth.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-900 w-8">{month.month}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600">
                        +{month.subscribers.toLocaleString()} subscribers
                      </div>
                      <div className="text-sm text-gray-600">
                        {month.views.toLocaleString()} views
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(month.subscribers / 35000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Performing Video */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Video</h3>
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={mockAnalytics.topPerformingVideo.thumbnail}
                alt="Top video thumbnail"
                className="w-full h-32 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
                <Play className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">{mockAnalytics.topPerformingVideo.title}</h4>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{mockAnalytics.topPerformingVideo.views.toLocaleString()} views</span>
                <Badge className="bg-green-100 text-green-800">Viral</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Channels & Trending Videos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your Channels */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Channels</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {mockChannels.slice(0, 3).map((channel) => (
              <div key={channel.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <img 
                    src={channel.thumbnail} 
                    alt={channel.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{channel.name}</h4>
                    <p className="text-sm text-gray-600">{channel.subscriberCount.toLocaleString()} subscribers</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +{channel.growthRate}%
                  </div>
                  <p className="text-xs text-gray-500">growth</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Trending Videos */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Trending in Your Niche</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {mockTrendingVideos.slice(0, 3).map((video) => (
              <div key={video.id} className="flex space-x-3">
                <img 
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-16 h-12 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm leading-tight">{video.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{video.channel}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{video.views.toLocaleString()} views</span>
                    <Badge className="text-xs bg-red-100 text-red-800">
                      {video.viralScore}% viral
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;