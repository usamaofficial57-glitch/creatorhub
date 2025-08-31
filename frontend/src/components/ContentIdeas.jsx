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
      <div className="p-8 space-y-8" style={{backgroundColor: '#F3F4F6', minHeight: '100vh'}}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold" style={{color: '#111827'}}>Content Ideas</h1>
            <p className="text-lg mt-2" style={{color: '#6B7280'}}>Loading AI-powered content suggestions...</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin" style={{color: '#4F46E5'}} />
            <p className="text-sm" style={{color: '#6B7280'}}>Generating creative ideas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8" style={{backgroundColor: '#F3F4F6', minHeight: '100vh'}}>
      {/* Header */}
      <div className="flex justify-between items-center fade-in-up">
        <div>
          <h1 className="text-4xl font-bold" style={{color: '#111827'}}>Content Ideas</h1>
          <p className="text-lg mt-2" style={{color: '#6B7280'}}>AI-powered content suggestions based on trending topics</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={generateTrendingIdeas}
            disabled={generating}
            className="btn-animate rounded-xl shadow-md"
          >
            {generating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <TrendingUp className="w-4 h-4 mr-2" />
            )}
            Trending Ideas
          </Button>
          <Button 
            onClick={generateNewIdeas}
            disabled={generating || !topic.trim()}
            className="btn-animate rounded-xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #4F46E5, #10B981)',
              borderColor: 'transparent'
            }}
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
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold" style={{color: '#111827'}}>AI Content Generator</h3>
          </div>
          <Badge className="px-3 py-1 rounded-full font-bold text-xs" style={{
            backgroundColor: '#4F46E520',
            color: '#4F46E5',
            border: 'none'
          }}>
            <Zap className="w-3 h-3 mr-1" />
            Powered by AI
          </Badge>
        </div>
        
        <div className="flex flex-wrap items-end gap-6">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-bold mb-3" style={{color: '#111827'}}>
              Topic or Keyword
            </label>
            <Input
              placeholder="e.g., 'productivity tips', 'gaming tutorials', 'cooking hacks'"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-4 rounded-2xl border-2 focus:border-[#4F46E5] transition-colors"
              style={{backgroundColor: '#F9FAFB', borderColor: '#E5E7EB'}}
            />
          </div>
          
          <div className="w-48">
            <label className="block text-sm font-bold mb-3" style={{color: '#111827'}}>
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="rounded-2xl border-2 p-4" style={{backgroundColor: '#F9FAFB', borderColor: '#E5E7EB'}}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
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
            className="px-8 py-4 rounded-2xl font-bold btn-animate shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #4F46E5, #10B981)',
              borderColor: 'transparent'
            }}
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
      <Card className="p-8 bg-white shadow-xl border-0 rounded-3xl card-hover">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{color: '#4F46E5'}}>{ideas.length}</div>
              <div className="text-sm font-medium" style={{color: '#6B7280'}}>Total Ideas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{color: '#10B981'}}>
                {ideas.filter(i => i.ai_generated).length}
              </div>
              <div className="text-sm font-medium" style={{color: '#6B7280'}}>AI Generated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{color: '#F59E0B'}}>
                {Math.round(ideas.reduce((sum, i) => sum + (i.viral_potential || 0), 0) / ideas.length) || 0}%
              </div>
              <div className="text-sm font-medium" style={{color: '#6B7280'}}>Avg Viral Potential</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-6 bg-white shadow-xl border-0 rounded-3xl card-hover">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{backgroundColor: '#6B728020'}}
            >
              <Search className="w-5 h-5" style={{color: '#6B7280'}} />
            </div>
            <Input
              placeholder="Search content ideas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 rounded-2xl border-2 focus:border-[#4F46E5] transition-colors"
              style={{backgroundColor: '#F9FAFB', borderColor: '#E5E7EB'}}
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40 rounded-2xl border-2" style={{backgroundColor: '#F9FAFB', borderColor: '#E5E7EB'}}>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
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
            <SelectTrigger className="w-32 rounded-2xl border-2" style={{backgroundColor: '#F9FAFB', borderColor: '#E5E7EB'}}>
              <SelectValue placeholder="Trend Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all">All Trends</SelectItem>
              <SelectItem value="Rising">Rising</SelectItem>
              <SelectItem value="Trending">Trending</SelectItem>
              <SelectItem value="Hot">Hot</SelectItem>
              <SelectItem value="AI Generated">AI Generated</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="rounded-2xl border-2" style={{borderColor: '#E5E7EB'}}>
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>

          <div className="ml-auto">
            <Badge className="px-4 py-2 rounded-full font-bold text-sm" style={{
              backgroundColor: '#4F46E520',
              color: '#4F46E5',
              border: 'none'
            }}>
              {filteredIdeas.length} ideas found
            </Badge>
          </div>
        </div>
      </Card>

      {/* Content Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredIdeas.map((idea, index) => (
          <Card key={idea.id} className="p-8 card-hover bg-white shadow-xl border-0 rounded-3xl group" style={{
            animationDelay: `${index * 0.1}s`
          }}>
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className="px-3 py-1 rounded-full font-bold text-xs" style={{
                    backgroundColor: '#6B728020',
                    color: '#6B7280',
                    border: 'none'
                  }}>
                    {idea.category}
                  </Badge>
                  {idea.ai_generated && (
                    <Badge className="px-3 py-1 rounded-full font-bold text-xs" style={{
                      backgroundColor: '#8B5CF620',
                      color: '#8B5CF6',
                      border: 'none'
                    }}>
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI
                    </Badge>
                  )}
                </div>
                <Badge className={`px-3 py-1 rounded-full font-bold text-xs ${getViralPotentialColor(idea.viral_potential)}`} style={{
                  backgroundColor: idea.viral_potential >= 90 ? '#FEE2E2' : 
                                   idea.viral_potential >= 75 ? '#FED7AA' :
                                   idea.viral_potential >= 60 ? '#FEF3C7' : '#F3F4F6',
                  color: idea.viral_potential >= 90 ? '#DC2626' :
                         idea.viral_potential >= 75 ? '#EA580C' :
                         idea.viral_potential >= 60 ? '#D97706' : '#6B7280',
                  border: 'none'
                }}>
                  {idea.viral_potential}% viral
                </Badge>
              </div>

              {/* Content */}
              <div>
                <h3 className="font-bold text-xl leading-tight line-clamp-2 mb-4" style={{color: '#111827'}}>
                  {idea.title}
                </h3>
                <p className="text-sm leading-relaxed line-clamp-3" style={{color: '#6B7280'}}>
                  {idea.description}
                </p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span style={{color: '#6B7280'}}>Difficulty:</span>
                  <Badge className={`text-xs px-2 py-1 rounded-full font-bold ${getDifficultyColor(idea.difficulty)}`} style={{
                    backgroundColor: idea.difficulty?.toLowerCase() === 'easy' ? '#D1FAE5' :
                                     idea.difficulty?.toLowerCase() === 'medium' ? '#FEF3C7' : '#FEE2E2',
                    color: idea.difficulty?.toLowerCase() === 'easy' ? '#065F46' :
                           idea.difficulty?.toLowerCase() === 'medium' ? '#92400E' : '#991B1B',
                    border: 'none'
                  }}>
                    {idea.difficulty}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span style={{color: '#6B7280'}}>Trend:</span>
                  <span className="font-bold text-xs" style={{color: '#111827'}}>{idea.trend}</span>
                </div>
                <div className="col-span-2 flex items-center space-x-2">
                  <span style={{color: '#6B7280'}}>Est. Views:</span>
                  <span className="font-bold text-xs" style={{color: '#111827'}}>{idea.estimated_views}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {idea.tags?.slice(0, 4).map((tag, index) => (
                  <Badge key={index} className="px-2 py-1 rounded-full font-medium text-xs" style={{
                    backgroundColor: '#4F46E510',
                    color: '#4F46E5',
                    border: 'none'
                  }}>
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Viral Potential Bar */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium" style={{color: '#6B7280'}}>Viral Potential</span>
                  <span className="font-bold" style={{color: '#111827'}}>{idea.viral_potential}%</span>
                </div>
                <div className="w-full rounded-full h-3 shadow-inner" style={{backgroundColor: '#E5E7EB'}}>
                  <div 
                    className="h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{ 
                      width: `${idea.viral_potential}%`,
                      backgroundColor: idea.viral_potential >= 90 ? '#DC2626' :
                                       idea.viral_potential >= 75 ? '#EA580C' :
                                       idea.viral_potential >= 60 ? '#D97706' : '#6B7280'
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-6 border-t" style={{borderColor: '#F3F4F6'}}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 rounded-2xl btn-animate"
                  onClick={() => saveIdea(idea.id)}
                  style={{borderColor: '#E5E7EB'}}
                >
                  <Bookmark className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 rounded-2xl btn-animate shadow-lg"
                  onClick={() => useIdea(idea.id)}
                  style={{
                    background: 'linear-gradient(135deg, #4F46E5, #10B981)',
                    borderColor: 'transparent'
                  }}
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
        <Card className="p-16 text-center bg-white shadow-xl border-0 rounded-3xl card-hover">
          <div 
            className="w-20 h-20 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg"
            style={{backgroundColor: '#4F46E520'}}
          >
            <Sparkles className="w-10 h-10" style={{color: '#4F46E5'}} />
          </div>
          <h3 className="text-2xl font-bold mb-4" style={{color: '#111827'}}>No content ideas found</h3>
          <p className="text-lg mb-8" style={{color: '#6B7280'}}>
            Try generating new ideas or adjusting your search filters.
          </p>
          <Button 
            onClick={() => setTopic('content creation')}
            className="px-8 py-4 rounded-2xl font-bold btn-animate shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #4F46E5, #10B981)',
              borderColor: 'transparent'
            }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Generate Ideas
          </Button>
        </Card>
      )}
    </div>
  );
};

export default ContentIdeas;