import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Lightbulb, 
  Bookmark, 
  Search, 
  Sparkles, 
  TrendingUp, 
  Filter,
  RefreshCw,
  Plus,
  Loader2,
  Brain,
  Zap
} from 'lucide-react';
import { contentApi, youtubeApi } from '../services/api';
import { useToast } from '../hooks/use-toast';

const ContentIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [filteredIdeas, setFilteredIdeas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [trendStatus, setTrendStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('general');
  const { toast } = useToast();

  // Load existing ideas from localStorage or database
  useEffect(() => {
    const savedIdeas = localStorage.getItem('contentIdeas');
    if (savedIdeas) {
      const parsedIdeas = JSON.parse(savedIdeas);
      setIdeas(parsedIdeas);
      setFilteredIdeas(parsedIdeas);
    } else {
      // Load some initial AI-generated ideas
      generateInitialIdeas();
    }
  }, []);

  // Filter ideas based on search and filters
  useEffect(() => {
    let filtered = ideas;
    
    if (searchTerm) {
      filtered = filtered.filter(idea => 
        idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(idea => idea.category === selectedCategory);
    }
    
    if (trendStatus !== 'all') {
      filtered = filtered.filter(idea => idea.trend === trendStatus);
    }
    
    setFilteredIdeas(filtered);
  }, [ideas, searchTerm, selectedCategory, trendStatus]);

  const generateInitialIdeas = async () => {
    try {
      setLoading(true);
      const initialIdeas = await contentApi.generateIdeas('YouTube content creation', 'general', 6);
      setIdeas(initialIdeas);
      setFilteredIdeas(initialIdeas);
      localStorage.setItem('contentIdeas', JSON.stringify(initialIdeas));
    } catch (error) {
      console.error('Error generating initial ideas:', error);
      // Fallback to some default ideas
      const fallbackIdeas = [
        {
          id: '1',
          title: 'Why Everyone is Switching to This Unknown Tech in 2025',
          description: 'Explore the revolutionary technology that\'s changing how we work and live',
          category: 'Technology',
          trend: 'AI Generated',
          viral_potential: 92,
          difficulty: 'Medium',
          estimated_views: '500K - 1M',
          tags: ['tech', 'innovation', '2025', 'trending'],
          ai_generated: true,
          created_at: new Date().toISOString()
        }
      ];
      setIdeas(fallbackIdeas);
      setFilteredIdeas(fallbackIdeas);
    } finally {
      setLoading(false);
    }
  };

  const generateNewIdeas = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for content generation.",
        variant: "destructive",
      });
      return;
    }

    try {
      setGenerating(true);
      toast({
        title: "Generating Ideas",
        description: "AI is creating personalized content ideas for you...",
      });

      const newIdeas = await contentApi.generateIdeas(topic, category, 5);
      const updatedIdeas = [...ideas, ...newIdeas];
      
      setIdeas(updatedIdeas);
      setFilteredIdeas(updatedIdeas);
      localStorage.setItem('contentIdeas', JSON.stringify(updatedIdeas));
      
      toast({
        title: "Ideas Generated!",
        description: `Created ${newIdeas.length} new AI-powered content ideas.`,
      });
      
      setTopic('');
      
    } catch (error) {
      console.error('Error generating ideas:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate ideas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const generateTrendingIdeas = async () => {
    try {
      setGenerating(true);
      toast({
        title: "Analyzing Trends",
        description: "Finding trending topics for content ideas...",
      });

      // Get trending videos to find popular topics
      const trendingVideos = await youtubeApi.getTrending('all', 'US', 10);
      
      // Extract popular topics from trending video titles
      const popularTopics = trendingVideos
        .map(video => video.title)
        .join(', ')
        .substring(0, 200); // Limit length

      const trendingIdeas = await contentApi.generateIdeas(
        `trending topics based on: ${popularTopics}`, 
        'trending', 
        5
      );
      
      const updatedIdeas = [...ideas, ...trendingIdeas];
      setIdeas(updatedIdeas);
      setFilteredIdeas(updatedIdeas);
      localStorage.setItem('contentIdeas', JSON.stringify(updatedIdeas));
      
      toast({
        title: "Trending Ideas Generated!",
        description: `Created ${trendingIdeas.length} ideas based on current YouTube trends.`,
      });
      
    } catch (error) {
      console.error('Error generating trending ideas:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate trending ideas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const saveIdea = (ideaId) => {
    const idea = ideas.find(i => i.id === ideaId);
    toast({
      title: "Idea Saved",
      description: `"${idea?.title}" has been saved to your collection.`,
    });
  };

  const useIdea = (ideaId) => {
    const idea = ideas.find(i => i.id === ideaId);
    toast({
      title: "Using Idea",
      description: `"${idea?.title}" - Start creating your content!`,
    });
  };

  const getViralPotentialColor = (potential) => {
    if (potential >= 90) return 'bg-red-100 text-red-800';
    if (potential >= 75) return 'bg-orange-100 text-orange-800';
    if (potential >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Ideas</h1>
            <p className="text-gray-600 mt-1">Loading AI-powered content suggestions...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Content Ideas</h1>
          <p className="text-gray-600 mt-1">AI-powered content suggestions based on trending topics</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={generateTrendingIdeas}
            disabled={generating}
          >
            {generating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <TrendingUp className="w-4 h-4 mr-2" />
            )}
            Trending Ideas
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={generateNewIdeas}
            disabled={generating || !topic.trim()}
          >
            {generating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Generate Ideas
          </Button>
        </div>
      </div>

      {/* AI Content Generator */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Content Generator</h3>
          </div>
          <Badge className="bg-blue-100 text-blue-800">
            <Zap className="w-3 h-3 mr-1" />
            Powered by AI
          </Badge>
        </div>
        
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic or Keyword
            </label>
            <Input
              placeholder="e.g., 'productivity tips', 'gaming tutorials', 'cooking hacks'"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="health">Health & Fitness</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={generateNewIdeas}
            disabled={generating || !topic.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {generating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Generate
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{ideas.length}</div>
              <div className="text-sm text-gray-600">Total Ideas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {ideas.filter(i => i.ai_generated).length}
              </div>
              <div className="text-sm text-gray-600">AI Generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(ideas.reduce((sum, i) => sum + (i.viral_potential || 0), 0) / ideas.length) || 0}%
              </div>
              <div className="text-sm text-gray-600">Avg Viral Potential</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search content ideas..."
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
              <SelectItem value="Entertainment">Entertainment</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={trendStatus} onValueChange={setTrendStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Trend Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trends</SelectItem>
              <SelectItem value="Rising">Rising</SelectItem>
              <SelectItem value="Trending">Trending</SelectItem>
              <SelectItem value="Hot">Hot</SelectItem>
              <SelectItem value="AI Generated">AI Generated</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>

          <div className="ml-auto">
            <Badge variant="outline">
              {filteredIdeas.length} ideas found
            </Badge>
          </div>
        </div>
      </Card>

      {/* Content Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeas.map((idea) => (
          <Card key={idea.id} className="p-6 hover:shadow-lg transition-all duration-200 group">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {idea.category}
                  </Badge>
                  {idea.ai_generated && (
                    <Badge className="text-xs bg-purple-100 text-purple-800">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI
                    </Badge>
                  )}
                </div>
                <Badge className={`text-xs ${getViralPotentialColor(idea.viral_potential)}`}>
                  {idea.viral_potential}% viral
                </Badge>
              </div>

              {/* Content */}
              <div>
                <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2 mb-2">
                  {idea.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {idea.description}
                </p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Difficulty:</span>
                  <Badge className={`ml-2 text-xs ${getDifficultyColor(idea.difficulty)}`}>
                    {idea.difficulty}
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-500">Trend:</span>
                  <span className="ml-2 font-medium">{idea.trend}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Est. Views:</span>
                  <span className="ml-2 font-medium">{idea.estimated_views}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {idea.tags?.slice(0, 4).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Viral Potential Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Viral Potential</span>
                  <span className="font-medium">{idea.viral_potential}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idea.viral_potential >= 90 ? 'bg-red-500' :
                      idea.viral_potential >= 75 ? 'bg-orange-500' :
                      idea.viral_potential >= 60 ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}
                    style={{ width: `${idea.viral_potential}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-4 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => saveIdea(idea.id)}
                >
                  <Bookmark className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => useIdea(idea.id)}
                >
                  <Lightbulb className="w-4 h-4 mr-1" />
                  Use Idea
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredIdeas.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No content ideas found</h3>
          <p className="text-gray-600 mb-6">
            Try generating new ideas or adjusting your search filters.
          </p>
          <Button 
            onClick={() => setTopic('content creation')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate Ideas
          </Button>
        </Card>
      )}
    </div>
  );
};

export default ContentIdeas;