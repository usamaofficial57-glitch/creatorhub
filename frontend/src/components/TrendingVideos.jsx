import React, { useState, useEffect } from 'react';
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
  Calendar,
  Loader2
} from 'lucide-react';
import { youtubeApi } from '../services/api';
import { useToast } from '../hooks/use-toast';

const TrendingVideos = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [timeFrame, setTimeFrame] = useState('24h');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();
  
  const fetchTrendingVideos = async () => {
    try {
      setLoading(true);
      const trendingVideos = await youtubeApi.getTrending(selectedCategory, 'US', 50);
      setVideos(trendingVideos);
      setFilteredVideos(trendingVideos);
    } catch (error) {
      console.error('Error fetching trending videos:', error);
      toast({
        title: "Error",
        description: "Failed to fetch trending videos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTrendingVideos();
  }, [selectedCategory]);

  useEffect(() => {
    // Filter videos based on search term
    const filtered = videos.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           video.channel.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
    setFilteredVideos(filtered);
  }, [searchTerm, videos]);

  const refreshTrending = async () => {
    setRefreshing(true);
    await fetchTrendingVideos();
    toast({
      title: "Trends Refreshed",
      description: "Latest trending videos have been loaded.",
    });
  };

  const saveVideo = (videoId, title) => {
    toast({
      title: "Video Saved",
      description: `"${title}" added to your inspiration collection`,
    });
  };

  const watchVideo = (videoId) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  const analyzeVideo = (video) => {
    toast({
      title: "Analyzing Video",
      description: `Gathering insights for "${video.title}"`,
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
    return views?.toString() || '0';
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trending Videos</h1>
            <p className="text-gray-600 mt-1">Loading viral content from YouTube...</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trending Videos</h1>
          <p className="text-gray-600 mt-1">Discover viral content from YouTube in real-time</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={refreshTrending}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analyze Trends
          </Button>
        </div>
      </div>

      {/* Stats Banner */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredVideos.length}</div>
              <div className="text-sm text-gray-600">Trending Videos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(filteredVideos.reduce((sum, v) => sum + (v.viral_score || 0), 0) / filteredVideos.length) || 0}%
              </div>
              <div className="text-sm text-gray-600">Avg Viral Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatViews(filteredVideos.reduce((sum, v) => sum + (v.views || 0), 0))}
              </div>
              <div className="text-sm text-gray-600">Total Views</div>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800">Live Data</Badge>
        </div>
      </Card>

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
              <SelectItem value="1">Film & Animation</SelectItem>
              <SelectItem value="2">Autos & Vehicles</SelectItem>
              <SelectItem value="10">Music</SelectItem>
              <SelectItem value="15">Pets & Animals</SelectItem>
              <SelectItem value="17">Sports</SelectItem>
              <SelectItem value="19">Travel & Events</SelectItem>
              <SelectItem value="20">Gaming</SelectItem>
              <SelectItem value="22">People & Blogs</SelectItem>
              <SelectItem value="23">Comedy</SelectItem>
              <SelectItem value="24">Entertainment</SelectItem>
              <SelectItem value="25">News & Politics</SelectItem>
              <SelectItem value="26">Howto & Style</SelectItem>
              <SelectItem value="27">Education</SelectItem>
              <SelectItem value="28">Science & Technology</SelectItem>
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
          
          <div className="ml-auto">
            <Badge variant="outline">
              {filteredVideos.length} videos found
            </Badge>
          </div>
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
                  <Badge className={getViralScoreColor(video.viral_score)}>
                    {video.viral_score}% viral
                  </Badge>
                </div>
                <img 
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                     onClick={() => watchVideo(video.id)}>
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
                    <Clock className="w-4 h-4 mr-1" />
                    {video.duration}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {video.publish_date}
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                    Trending
                  </div>
                </div>

                {/* Tags */}
                {video.tags && video.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {video.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Performance Indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Viral Performance</span>
                    <span className="font-medium">{video.viral_score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        video.viral_score >= 95 ? 'bg-red-500' :
                        video.viral_score >= 85 ? 'bg-orange-500' :
                        video.viral_score >= 75 ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${video.viral_score}%` }}
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
                  onClick={() => saveVideo(video.id, video.title)}
                >
                  <Bookmark className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => watchVideo(video.id)}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Watch
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => analyzeVideo(video)}
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
        <Button variant="outline" className="w-48" onClick={refreshTrending}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Load More Videos
        </Button>
      </div>

      {/* Empty State */}
      {filteredVideos.length === 0 && !loading && (
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