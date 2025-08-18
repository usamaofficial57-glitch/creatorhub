import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  Search, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Eye, 
  Users,
  BarChart3,
  Lightbulb,
  Star,
  ArrowRight
} from 'lucide-react';
import { mockNiches } from '../data/mockData';
import { useToast } from '../hooks/use-toast';

const NicheResearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  const filteredNiches = mockNiches.filter(niche =>
    niche.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    niche.topKeywords.some(keyword => 
      keyword.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const analyzeNiche = (nicheId) => {
    toast({
      title: "Analyzing Niche",
      description: "Deep diving into market opportunities and competition",
    });
  };

  const getProfitabilityColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompetitionColor = (level) => {
    switch (level.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'very high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Niche Research</h1>
          <p className="text-gray-600 mt-1">Discover profitable niches and analyze market opportunities</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Search className="w-4 h-4 mr-2" />
          Research New Niche
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search niches, keywords, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline">
            Advanced Search
          </Button>
        </div>
      </Card>

      {/* Niche Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredNiches.map((niche) => (
          <Card key={niche.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{niche.name}</h3>
                    {niche.trending && (
                      <Badge className="bg-red-100 text-red-800">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={getCompetitionColor(niche.competition)}>
                      Competition: {niche.competition}
                    </Badge>
                    <Badge className={getDifficultyColor(niche.difficulty)}>
                      {niche.difficulty}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end space-x-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className={`font-bold text-lg ${getProfitabilityColor(niche.profitability)}`}>
                      {niche.profitability}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Profitability Score</p>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Avg Views</span>
                  </div>
                  <p className="text-lg font-bold text-blue-600">
                    {niche.avgViews.toLocaleString()}
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Est. Revenue</span>
                  </div>
                  <p className="text-sm font-bold text-green-600">
                    {niche.estimatedRevenue}
                  </p>
                </div>
              </div>

              {/* Profitability Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Market Opportunity</span>
                  <span className="font-medium">{niche.profitability}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      niche.profitability >= 90 ? 'bg-green-500' :
                      niche.profitability >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${niche.profitability}%` }}
                  />
                </div>
              </div>

              {/* Top Keywords */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Top Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {niche.topKeywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => analyzeNiche(niche.id)}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Deep Analysis
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Generate Ideas
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Niche Finder Tool */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Discover Untapped Niches
            </h3>
            <p className="text-gray-600 mb-4">
              Use our AI-powered niche finder to discover profitable opportunities with low competition
            </p>
            <div className="flex space-x-3">
              <Input placeholder="Enter keywords or topics..." className="max-w-xs" />
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Search className="w-4 h-4 mr-2" />
                Find Niches
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Target className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </Card>

      {/* Empty State */}
      {filteredNiches.length === 0 && (
        <Card className="p-12 text-center">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No niches found</h3>
          <p className="text-gray-600 mb-6">
            Try different keywords or use our niche finder to discover new opportunities.
          </p>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Search className="w-4 h-4 mr-2" />
            Discover Niches
          </Button>
        </Card>
      )}
    </div>
  );
};

export default NicheResearch;