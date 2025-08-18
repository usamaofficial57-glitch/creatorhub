import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  Search, 
  TrendingUp, 
  Target, 
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Copy,
  RefreshCw,
  Zap
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const SEOTools = () => {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const { toast } = useToast();

  const keywordSuggestions = [
    { keyword: 'tech review 2025', volume: 89000, competition: 'Medium', trend: '+15%' },
    { keyword: 'best gaming setup', volume: 156000, competition: 'High', trend: '+8%' },
    { keyword: 'productivity tips', volume: 67000, competition: 'Low', trend: '+22%' },
    { keyword: 'AI tools 2025', volume: 234000, competition: 'Medium', trend: '+45%' },
    { keyword: 'budget tech', volume: 45000, competition: 'Low', trend: '+12%' }
  ];

  const titleOptimizations = [
    { type: 'success', message: 'Title length is optimal (48 characters)', icon: CheckCircle },
    { type: 'warning', message: 'Consider adding numbers or years for better CTR', icon: AlertTriangle },
    { type: 'success', message: 'Contains main keyword at the beginning', icon: CheckCircle }
  ];

  const descriptionOptimizations = [
    { type: 'success', message: 'Good use of keywords in first 125 characters', icon: CheckCircle },
    { type: 'warning', message: 'Add more call-to-action phrases', icon: AlertTriangle },
    { type: 'success', message: 'Includes relevant hashtags', icon: CheckCircle }
  ];

  const analyzeKeywords = () => {
    toast({
      title: "Analyzing Keywords",
      description: "Searching for trending keywords and opportunities...",
    });
  };

  const generateTitles = () => {
    toast({
      title: "Generating Titles",
      description: "Creating SEO-optimized title suggestions...",
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const getCompetitionColor = (competition) => {
    switch (competition.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SEO Tools</h1>
          <p className="text-gray-600 mt-1">Optimize your content for maximum visibility</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Zap className="w-4 h-4 mr-2" />
          SEO Audit
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Title Optimizer */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Title Optimizer</h3>
            <Button variant="outline" size="sm" onClick={generateTitles}>
              <Lightbulb className="w-4 h-4 mr-2" />
              Generate
            </Button>
          </div>
          
          <div className="space-y-4">
            <Input
              placeholder="Enter your video title..."
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
            />
            
            <div className="space-y-2">
              {titleOptimizations.map((opt, index) => {
                const Icon = opt.icon;
                return (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <Icon className={`w-4 h-4 ${opt.type === 'success' ? 'text-green-600' : 'text-yellow-600'}`} />
                    <span className="text-gray-700">{opt.message}</span>
                  </div>
                );
              })}
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Character count: {videoTitle.length}/100</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    videoTitle.length <= 60 ? 'bg-green-500' : 
                    videoTitle.length <= 80 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((videoTitle.length / 100) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Description Optimizer */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Description Optimizer</h3>
            <Button variant="outline" size="sm">
              <Target className="w-4 h-4 mr-2" />
              Optimize
            </Button>
          </div>
          
          <div className="space-y-4">
            <Textarea
              placeholder="Enter your video description..."
              value={videoDescription}
              onChange={(e) => setVideoDescription(e.target.value)}
              rows={4}
            />
            
            <div className="space-y-2">
              {descriptionOptimizations.map((opt, index) => {
                const Icon = opt.icon;
                return (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <Icon className={`w-4 h-4 ${opt.type === 'success' ? 'text-green-600' : 'text-yellow-600'}`} />
                    <span className="text-gray-700">{opt.message}</span>
                  </div>
                );
              })}
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Word count: {videoDescription.split(' ').filter(word => word.length > 0).length}</p>
              <p className="text-xs text-gray-500 mt-1">Recommended: 125-250 words</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Keyword Research */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Keyword Research</h3>
          <Button variant="outline" onClick={analyzeKeywords}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center space-x-2 flex-1">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Enter keywords to research..."
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              className="flex-1"
            />
          </div>
          <Button onClick={analyzeKeywords}>
            <Search className="w-4 h-4 mr-2" />
            Analyze
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Keyword</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Volume</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Competition</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Trend</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {keywordSuggestions.map((keyword, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">{keyword.keyword}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-700">{keyword.volume.toLocaleString()}/month</span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={getCompetitionColor(keyword.competition)} variant="outline">
                      {keyword.competition}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">{keyword.trend}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(keyword.keyword)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* SEO Checklist */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">SEO Checklist</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Video Optimization</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700">Custom thumbnail uploaded</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700">Video title optimized</span>
              </div>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-gray-700">Add end screens and cards</span>
              </div>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-gray-700">Create closed captions</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Channel Optimization</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700">Channel keywords added</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700">Playlist organization</span>
              </div>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-gray-700">Update channel trailer</span>
              </div>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-gray-700">Optimize channel description</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SEOTools;