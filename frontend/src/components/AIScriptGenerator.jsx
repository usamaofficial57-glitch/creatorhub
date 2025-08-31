import React, { useState, useEffect } from 'react';
import { 
  PenTool, 
  Wand2, 
  Clock, 
  Globe, 
  Users, 
  Download, 
  Share, 
  Copy, 
  Loader2,
  FileText,
  Mic,
  Video,
  Zap,
  TrendingUp,
  Target,
  Languages,
  BookOpen,
  Smile,
  Drama,
  GraduationCap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Alert, AlertDescription } from './ui/alert';
import { useToast } from '../hooks/use-toast';

const AIScriptGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [scriptTitle, setScriptTitle] = useState('');
  const [scriptHook, setScriptHook] = useState('');
  const [formData, setFormData] = useState({
    topic: '',
    duration: '10min',
    tone: 'educational',
    style: 'faceless-documentary',
    language: 'english',
    autoResearch: false,
    targetAudience: 'general',
    includeHook: true,
    includeCTA: true,
    includeTimestamps: true
  });
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [researchData, setResearchData] = useState(null);
  const { toast } = useToast();

  // Duration options
  const durationOptions = [
    { value: 'shorts', label: 'YouTube Shorts (60s)', icon: Zap },
    { value: '5min', label: '5 Minutes', icon: Clock },
    { value: '10min', label: '10 Minutes', icon: Clock },
    { value: '15min', label: '15 Minutes', icon: Clock },
    { value: '20min', label: '20 Minutes', icon: Clock },
    { value: '30min', label: '30 Minutes', icon: Clock },
    { value: 'podcast', label: 'Podcast (45-60min)', icon: Mic }
  ];

  // Tone options
  const toneOptions = [
    { value: 'educational', label: 'Educational', icon: GraduationCap, description: 'Informative and instructional' },
    { value: 'dramatic', label: 'Dramatic', icon: Drama, description: 'Intense and engaging storytelling' },
    { value: 'storytelling', label: 'Storytelling', icon: BookOpen, description: 'Narrative-driven content' },
    { value: 'funny', label: 'Funny', icon: Smile, description: 'Humorous and entertaining' },
    { value: 'casual', label: 'Casual', icon: Users, description: 'Conversational and relaxed' },
    { value: 'professional', label: 'Professional', icon: Target, description: 'Formal and authoritative' }
  ];

  // Content style templates
  const styleOptions = [
    { 
      value: 'faceless-documentary', 
      label: 'Faceless Documentary', 
      description: 'Beluga-style documentary narration',
      icon: FileText 
    },
    { 
      value: 'faceless-listicle', 
      label: 'Faceless Listicle', 
      description: 'Top 10 style countdown format',
      icon: Target 
    },
    { 
      value: 'podcast-style', 
      label: 'Podcast Style', 
      description: 'Conversational podcast format',
      icon: Mic 
    },
    { 
      value: 'shorts-punchline', 
      label: 'Shorts Punchline', 
      description: 'Quick hook and punchline for shorts',
      icon: Zap 
    },
    { 
      value: 'educational-breakdown', 
      label: 'Educational Breakdown', 
      description: 'Step-by-step tutorial format',
      icon: GraduationCap 
    },
    { 
      value: 'story-driven', 
      label: 'Story Driven', 
      description: 'Narrative storytelling approach',
      icon: BookOpen 
    }
  ];

  // Language options
  const languageOptions = [
    { value: 'english', label: 'English', icon: '🇺🇸' },
    { value: 'spanish', label: 'Spanish', icon: '🇪🇸' },
    { value: 'hindi', label: 'Hindi', icon: '🇮🇳' },
    { value: 'urdu', label: 'Urdu', icon: '🇵🇰' },
    { value: 'french', label: 'French', icon: '🇫🇷' },
    { value: 'german', label: 'German', icon: '🇩🇪' }
  ];

  // Target audience options
  const audienceOptions = [
    { value: 'general', label: 'General Audience' },
    { value: 'teens', label: 'Teens (13-19)' },
    { value: 'young-adults', label: 'Young Adults (20-35)' },
    { value: 'adults', label: 'Adults (35-55)' },
    { value: 'professionals', label: 'Professionals' },
    { value: 'students', label: 'Students' }
  ];

  // Fetch trending topics on component mount
  useEffect(() => {
    fetchTrendingTopics();
  }, []);

  const fetchTrendingTopics = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/trending-topics`);
      if (response.ok) {
        const data = await response.json();
        setTrendingTopics(data.topics || []);
      }
    } catch (error) {
      console.error('Error fetching trending topics:', error);
      // Set some default trending topics
      setTrendingTopics([
        'AI and Machine Learning',
        'Cryptocurrency Updates',
        'Climate Change Solutions',
        'Space Exploration',
        'Health and Wellness Tips',
        'Tech Reviews and Gadgets',
        'Personal Finance Tips',
        'Productivity Hacks'
      ]);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAutoResearch = async () => {
    if (!formData.topic) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic before enabling auto-research.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auto-research`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: formData.topic,
          language: formData.language
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResearchData(data);
        toast({
          title: "Research Complete",
          description: "Auto-research completed successfully! Data will be used in script generation."
        });
      }
    } catch (error) {
      console.error('Error during auto-research:', error);
      toast({
        title: "Research Failed",
        description: "Could not complete auto-research. Script will be generated without research data.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateScript = async () => {
    if (!formData.topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for your script.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedScript('');
    setScriptTitle('');
    setScriptHook('');

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/generate-script`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          researchData: researchData
        })
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedScript(data.script);
        setScriptTitle(data.title || 'Generated Script');
        setScriptHook(data.hook || '');
        
        toast({
          title: "Script Generated!",
          description: `Your ${formData.duration} ${formData.style} script is ready.`
        });
      } else {
        throw new Error('Failed to generate script');
      }
    } catch (error) {
      console.error('Error generating script:', error);
      toast({
        title: "Generation Failed",
        description: "Could not generate script. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "Content copied to clipboard."
      });
    });
  };

  const exportScript = () => {
    const scriptContent = `Title: ${scriptTitle}\n\nHook: ${scriptHook}\n\nScript:\n${generatedScript}`;
    const blob = new Blob([scriptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scriptTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_script.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Script Exported",
      description: "Script has been downloaded as a text file."
    });
  };

  const shareScript = () => {
    // This would integrate with team collaboration features
    toast({
      title: "Share Feature",
      description: "Team sharing feature will be available soon!"
    });
  };

  const useTrendingTopic = (topic) => {
    setFormData(prev => ({
      ...prev,
      topic: topic
    }));
    toast({
      title: "Topic Added",
      description: `"${topic}" has been added as your script topic.`
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <PenTool className="w-6 h-6 text-white" />
            </div>
            AI Script Generator
          </h1>
          <p className="text-gray-600 mt-2">Generate professional YouTube scripts with AI in multiple languages and styles</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Wand2 className="w-4 h-4" />
            AI Powered
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Globe className="w-4 h-4" />
            Multi-language
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator">Script Generator</TabsTrigger>
          <TabsTrigger value="trending">Trending Topics</TabsTrigger>
          <TabsTrigger value="templates">Style Templates</TabsTrigger>
        </TabsList>

        {/* Main Generator Tab */}
        <TabsContent value="generator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Configuration Panel */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Script Configuration
                  </CardTitle>
                  <CardDescription>
                    Set up your script parameters and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Topic Input */}
                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic/Keyword/Title</Label>
                    <Textarea
                      id="topic"
                      placeholder="Enter your video topic, keywords, or title..."
                      value={formData.topic}
                      onChange={(e) => handleInputChange('topic', e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Duration Selection */}
                  <div className="space-y-2">
                    <Label>Video Duration</Label>
                    <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {durationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <option.icon className="w-4 h-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tone Selection */}
                  <div className="space-y-2">
                    <Label>Tone & Style</Label>
                    <Select value={formData.tone} onValueChange={(value) => handleInputChange('tone', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {toneOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <option.icon className="w-4 h-4" />
                              <div>
                                <div>{option.label}</div>
                                <div className="text-xs text-gray-500">{option.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Content Style */}
                  <div className="space-y-2">
                    <Label>Content Style Template</Label>
                    <Select value={formData.style} onValueChange={(value) => handleInputChange('style', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        {styleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <option.icon className="w-4 h-4" />
                              <div>
                                <div>{option.label}</div>
                                <div className="text-xs text-gray-500">{option.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Language Selection */}
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{option.icon}</span>
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Target Audience */}
                  <div className="space-y-2">
                    <Label>Target Audience</Label>
                    <Select value={formData.targetAudience} onValueChange={(value) => handleInputChange('targetAudience', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        {audienceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Advanced Options */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Advanced Options</Label>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm">Auto-Research Mode</Label>
                        <p className="text-xs text-gray-500">Analyze trending topics & competitors</p>
                      </div>
                      <Switch
                        checked={formData.autoResearch}
                        onCheckedChange={(checked) => {
                          handleInputChange('autoResearch', checked);
                          if (checked) {
                            handleAutoResearch();
                          }
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm">Include Hook</Label>
                        <p className="text-xs text-gray-500">Add engaging opening hook</p>
                      </div>
                      <Switch
                        checked={formData.includeHook}
                        onCheckedChange={(checked) => handleInputChange('includeHook', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm">Include CTA</Label>
                        <p className="text-xs text-gray-500">Add call-to-action sections</p>
                      </div>
                      <Switch
                        checked={formData.includeCTA}
                        onCheckedChange={(checked) => handleInputChange('includeCTA', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm">Include Timestamps</Label>
                        <p className="text-xs text-gray-500">Add section timestamps</p>
                      </div>
                      <Switch
                        checked={formData.includeTimestamps}
                        onCheckedChange={(checked) => handleInputChange('includeTimestamps', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={generateScript} 
                    disabled={isGenerating || !formData.topic.trim()}
                    className="w-full"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Script...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate AI Script
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {/* Research Data Display */}
              {researchData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Research Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div><strong>Trending Keywords:</strong> {researchData.keywords?.join(', ')}</div>
                      <div><strong>Competitor Analysis:</strong> {researchData.competitorCount} similar videos found</div>
                      <div><strong>Optimal Length:</strong> {researchData.optimalLength}</div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Generated Script Display */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Generated Script
                    </div>
                    {generatedScript && (
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedScript)}>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={exportScript}>
                          <Download className="w-4 h-4 mr-1" />
                          Export
                        </Button>
                        <Button variant="outline" size="sm" onClick={shareScript}>
                          <Share className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                  {scriptTitle && (
                    <CardDescription>
                      <strong>Title:</strong> {scriptTitle}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {!generatedScript && !isGenerating && (
                    <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                      <PenTool className="w-16 h-16 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Script Generated Yet</h3>
                      <p className="text-center">Configure your script settings and click "Generate AI Script" to create your content.</p>
                    </div>
                  )}

                  {isGenerating && (
                    <div className="flex flex-col items-center justify-center h-96">
                      <Loader2 className="w-16 h-16 animate-spin text-purple-600 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Generating Your Script...</h3>
                      <p className="text-gray-600 text-center">AI is analyzing your topic and creating a professional script. This may take a moment.</p>
                    </div>
                  )}

                  {generatedScript && (
                    <ScrollArea className="h-96">
                      <div className="space-y-4">
                        {scriptHook && (
                          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border">
                            <h4 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
                              <Zap className="w-4 h-4" />
                              Hook (First 15 seconds)
                            </h4>
                            <p className="text-purple-800">{scriptHook}</p>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => copyToClipboard(scriptHook)}
                              className="mt-2"
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copy Hook
                            </Button>
                          </div>
                        )}
                        
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-gray-50 p-4 rounded-lg">
                            {generatedScript}
                          </pre>
                        </div>
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Trending Topics Tab */}
        <TabsContent value="trending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Trending Topics
              </CardTitle>
              <CardDescription>
                Popular topics and keywords that are trending right now
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingTopics.map((topic, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{topic}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => useTrendingTopic(topic)}
                        >
                          Use
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Style Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {styleOptions.map((style) => (
              <Card key={style.value} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <style.icon className="w-5 h-5" />
                    {style.label}
                  </CardTitle>
                  <CardDescription>{style.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {style.value === 'faceless-documentary' && 'Perfect for educational content with professional narration and B-roll footage.'}
                    {style.value === 'faceless-listicle' && 'Great for top 10 lists, rankings, and countdown-style videos.'}
                    {style.value === 'podcast-style' && 'Conversational format ideal for interviews and discussions.'}
                    {style.value === 'shorts-punchline' && 'Quick, punchy content designed for maximum engagement in 60 seconds.'}
                    {style.value === 'educational-breakdown' && 'Step-by-step tutorials and how-to content.'}
                    {style.value === 'story-driven' && 'Narrative storytelling with character development and plot.'}
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      handleInputChange('style', style.value);
                      toast({
                        title: "Template Selected",
                        description: `${style.label} template has been selected.`
                      });
                    }}
                  >
                    Select Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIScriptGenerator;