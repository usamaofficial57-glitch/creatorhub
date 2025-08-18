import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  Plus, 
  TrendingUp, 
  Users, 
  Eye, 
  Bell, 
  BarChart3,
  Calendar,
  Play,
  Search,
  MoreVertical
} from 'lucide-react';
import { mockCompetitors } from '../data/mockData';
import { useToast } from '../hooks/use-toast';

const CompetitorAnalysis = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  const filteredCompetitors = mockCompetitors.filter(competitor =>
    competitor.channelName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addCompetitor = () => {
    toast({
      title: "Add Competitor",
      description: "Enter a YouTube channel URL to start tracking",
    });
  };

  const toggleNotifications = (competitorId) => {
    toast({
      title: "Notifications Updated",
      description: "You'll now receive alerts when this channel uploads",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Competitor Analysis</h1>
          <p className="text-gray-600 mt-1">Track and analyze your competitors' performance</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Weekly Report
          </Button>
          <Button 
            onClick={addCompetitor}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Competitor
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search competitors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
      </Card>

      {/* Competitors List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCompetitors.map((competitor) => (
          <Card key={competitor.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-blue-600">
                      {competitor.channelName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{competitor.channelName}</h3>
                    <p className="text-sm text-gray-600">{competitor.subscriberCount.toLocaleString()} subscribers</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleNotifications(competitor.id)}
                  >
                    <Bell className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center text-green-600 mb-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">+{competitor.growthRate}%</span>
                  </div>
                  <p className="text-xs text-gray-500">Growth Rate</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-blue-600 mb-1">
                    <Eye className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">{Math.round(competitor.avgViews / 1000)}K</span>
                  </div>
                  <p className="text-xs text-gray-500">Avg Views</p>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="text-xs">
                    {competitor.category}
                  </Badge>
                </div>
              </div>

              {/* Recent Video */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900">Latest Video</h4>
                  <span className="text-xs text-gray-500">{competitor.recentVideo.uploadDate}</span>
                </div>
                <div className="flex space-x-3">
                  <div className="relative">
                    <img 
                      src={competitor.recentVideo.thumbnail}
                      alt="Video thumbnail"
                      className="w-20 h-12 object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-md flex items-center justify-center">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-gray-900 leading-tight">
                      {competitor.recentVideo.title}
                    </h5>
                    <p className="text-xs text-gray-600 mt-1">
                      {competitor.recentVideo.views.toLocaleString()} views
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  Upload Schedule
                </Button>
              </div>

              {/* Tracking Info */}
              <div className="text-xs text-gray-500 border-t pt-3">
                Tracking since {competitor.trackingSince}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCompetitors.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No competitors found</h3>
          <p className="text-gray-600 mb-6">
            Add competitors to start tracking their performance and stay ahead.
          </p>
          <Button 
            onClick={addCompetitor}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Competitor
          </Button>
        </Card>
      )}
    </div>
  );
};

export default CompetitorAnalysis;