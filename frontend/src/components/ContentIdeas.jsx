import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Lightbulb, 
  TrendingUp, 
  Bookmark, 
  Search, 
  Filter,
  Sparkles,
  Eye,
  Clock,
  Target,
  FolderPlus
} from 'lucide-react';
import { mockVideoIdeas } from '../data/mockData';
import { useToast } from '../hooks/use-toast';

const ContentIdeas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTrend, setSelectedTrend] = useState('all');
  const { toast } = useToast();
  
  const filteredIdeas = mockVideoIdeas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || idea.category === selectedCategory;
    const matchesTrend = selectedTrend === 'all' || idea.trend === selectedTrend;
    
    return matchesSearch && matchesCategory && matchesTrend;
  });

  const handleSaveIdea = (ideaId) => {
    toast({
      title: "Idea Saved!",
      description: "Video idea has been saved to your collection.",
    });
  };

  const generateNewIdeas = () => {
    toast({
      title: "Generating New Ideas...",
      description: "AI is analyzing trending content to create fresh video ideas.",
    });
  };

  const getTrendColor = (trend) => {
    switch (trend.toLowerCase()) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'trending': return 'bg-orange-100 text-orange-800';
      case 'rising': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getViralPotentialColor = (potential) => {
    if (potential >= 90) return 'text-green-600';
    if (potential >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Ideas</h1>
          <p className="text-gray-600 mt-1">AI-powered video ideas tailored to your niche</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <FolderPlus className="w-4 h-4 mr-2" />
            Create Folder
          </Button>
          <Button 
            onClick={generateNewIdeas}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Ideas
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search video ideas..."
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
          
          <Select value={selectedTrend} onValueChange={setSelectedTrend}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Trend Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trends</SelectItem>
              <SelectItem value="Hot">Hot</SelectItem>
              <SelectItem value="Trending">Trending</SelectItem>
              <SelectItem value="Rising">Rising</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeas.map((idea) => (
          <Card key={idea.id} className="p-6 hover:shadow-lg transition-all duration-200 group">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Badge className={getTrendColor(idea.trend)} variant="outline">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {idea.trend}
                  </Badge>
                  <h3 className="font-semibold text-gray-900 mt-2 leading-tight">
                    {idea.title}
                  </h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleSaveIdea(idea.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2">
                {idea.description}
              </p>

              {/* Metrics */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Viral Potential</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          idea.viralPotential >= 90 ? 'bg-green-500' :
                          idea.viralPotential >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${idea.viralPotential}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${getViralPotentialColor(idea.viralPotential)}`}>
                      {idea.viralPotential}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                  <div className="flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    {idea.estimatedViews}
                  </div>
                  <div className="flex items-center">
                    <Target className="w-3 h-3 mr-1" />
                    {idea.difficulty}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {idea.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {idea.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{idea.tags.length - 3}
                  </Badge>
                )}
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {idea.createdAt}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="text-xs">
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Use Idea
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredIdeas.length === 0 && (
        <Card className="p-12 text-center">
          <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your filters or generate new ideas to get started.
          </p>
          <Button 
            onClick={generateNewIdeas}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate New Ideas
          </Button>
        </Card>
      )}
    </div>
  );
};

export default ContentIdeas;