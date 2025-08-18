import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  TrendingUp, 
  Play, 
  Eye, 
  Clock, 
  Bookmark, 
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { mockTrendingVideos } from '../data/mockData';
import { useToast } from '../hooks/use-toast';

const TrendingVideos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [timeFrame, setTimeFrame] = useState('24h');
  const { toast } = useToast();
  
  const filteredVideos = mockTrendingVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.channel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const refreshTrending = () => {
    toast({
      title: "Refreshing Trends",
      description: "Fetching the latest trending videos...",
    });
  };

  const saveVideo = (videoId) => {
    toast({
      title: "Video Saved",
      description: "Added to your inspiration collection",
    });
  };

  const getViralScoreColor = (score) => {
    if (score >= 95) return 'bg-red-100 text-red-800';
    if (score >= 85) return 'bg-orange-100 text-orange-800';
    if (score >= 75) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trending Videos</h1>
          <p className="text-gray-600 mt-1">Discover viral content in your niche</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={refreshTrending}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analyze Trends
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search trending videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Lifestyle">Lifestyle</SelectItem>
              <SelectItem value="Gaming">Gaming</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time Frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
        </div>
      </Card>

      {/* Trending Videos Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVideos.map((video, index) => (
          <Card key={video.id} className="p-6 hover:shadow-lg transition-all duration-200 group">
            <div className="space-y-4">
              {/* Rank & Video Preview */}
              <div className="relative">
                <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs font-bold px-2 py-1 rounded">
                  #{index + 1}
                </div>
                <div className="absolute top-2 right-2">
                  <Badge className={getViralScoreColor(video.viralScore)}>
                    {video.viralScore}% viral
                  </Badge>
                </div>
                <img 
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* Video Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{video.channel}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {formatViews(video.views)} views
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +{video.growthRate}%
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {video.publishDate}
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="text-xs">
                      {video.category}
                    </Badge>
                  </div>
                </div>

                {/* Performance Indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Viral Performance</span>
                    <span className="font-medium">{video.viralScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        video.viralScore >= 95 ? 'bg-red-500' :
                        video.viralScore >= 85 ? 'bg-orange-500' :
                        video.viralScore >= 75 ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${video.viralScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-4 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => saveVideo(video.id)}
                >
                  <Bookmark className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Watch
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Analyze
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" className="w-48">
          <RefreshCw className="w-4 h-4 mr-2" />
          Load More Videos
        </Button>
      </div>

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <Card className="p-12 text-center">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No trending videos found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your filters or refresh to see the latest trends.
          </p>
          <Button 
            onClick={refreshTrending}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Trends
          </Button>
        </Card>
      )}
    </div>
  );
};

export default TrendingVideos;