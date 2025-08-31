import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Users, 
  Heart, 
  Reply, 
  Search, 
  Filter,
  Plus,
  Crown,
  Star,
  ThumbsUp,
  Eye,
  Clock,
  Award,
  TrendingUp,
  MessageCircle,
  Share,
  ExternalLink,
  UserPlus,
  Zap,
  Target
} from 'lucide-react';

const CommunityHub = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [discussions, setDiscussions] = useState([]);
  const [creators, setCreators] = useState([]);

  // Mock discussions data
  useEffect(() => {
    setDiscussions([
      {
        id: '1',
        title: 'Just hit 100K subscribers with faceless content! AMA',
        content: 'Started my channel 8 months ago following the faceless YouTube strategies. Here to answer any questions about what worked for me!',
        author: {
          name: 'TechGrowthHacker',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
          subscribers: '127K',
          verified: true,
          level: 'Expert'
        },
        category: 'success-stories',
        replies: 47,
        likes: 234,
        views: 1205,
        timeAgo: '2 hours ago',
        tags: ['milestone', 'faceless', 'growth'],
        pinned: true
      },
      {
        id: '2',
        title: 'Best automation tools for YouTube content creation?',
        content: 'Looking for recommendations on tools that can help automate the content creation process. Currently spending 10+ hours per video.',
        author: {
          name: 'ContentCreator2024',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b5185e29?w=40&h=40&fit=crop&crop=face',
          subscribers: '12K',
          verified: false,
          level: 'Growing'
        },
        category: 'automation',
        replies: 23,
        likes: 89,
        views: 456,
        timeAgo: '4 hours ago',
        tags: ['automation', 'tools', 'efficiency']
      },
      {
        id: '3',
        title: 'Discord Community for Daily Accountability?',
        content: 'Anyone interested in joining a Discord where we share daily progress, wins, and challenges? Looking for serious creators only.',
        author: {
          name: 'ChannelMentor',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
          subscribers: '89K',
          verified: true,
          level: 'Mentor'
        },
        category: 'collaboration',
        replies: 156,
        likes: 342,
        views: 2103,
        timeAgo: '1 day ago',
        tags: ['discord', 'accountability', 'community']
      },
      {
        id: '4',
        title: 'Thumbnail feedback - which one performs better?',
        content: 'Testing two thumbnail designs for my next video. Would love to get community feedback before going live.',
        author: {
          name: 'VisualStoryteller',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
          subscribers: '34K',
          verified: false,
          level: 'Rising'
        },
        category: 'feedback',
        replies: 31,
        likes: 67,
        views: 289,
        timeAgo: '6 hours ago',
        tags: ['thumbnails', 'feedback', 'design']
      },
      {
        id: '5',
        title: 'Voice over artists for hire - recommendations?',
        content: 'Need a reliable voice over artist for my faceless YouTube channel. Budget is $50-100 per video. Any recommendations?',
        author: {
          name: 'StartupStories',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
          subscribers: '8K',
          verified: false,
          level: 'Beginner'
        },
        category: 'services',
        replies: 18,
        likes: 42,
        views: 234,
        timeAgo: '8 hours ago',
        tags: ['voiceover', 'hiring', 'services']
      }
    ]);

    setCreators([
      {
        id: '1',
        name: 'Alex Chen',
        username: '@alexcreates',
        subscribers: '567K',
        niche: 'Tech Reviews',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
        growth: '+15.2%',
        isOnline: true,
        level: 'Expert',
        posts: 156,
        reputation: 2340
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        username: '@sarahgrows',
        subscribers: '234K',
        niche: 'Business',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b5185e29?w=60&h=60&fit=crop&crop=face',
        growth: '+8.7%',
        isOnline: false,
        level: 'Mentor',
        posts: 89,
        reputation: 1890
      },
      {
        id: '3',
        name: 'Mike Rodriguez',
        username: '@mikeautomation',
        subscribers: '89K',
        niche: 'Automation',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
        growth: '+22.1%',
        isOnline: true,
        level: 'Rising',
        posts: 234,
        reputation: 1567
      }
    ]);
  }, []);

  const categories = [
    { id: 'all', name: 'All Discussions', count: 1247, icon: MessageSquare },
    { id: 'beginner-questions', name: 'Beginner Questions', count: 324, icon: Users },
    { id: 'success-stories', name: 'Success Stories', count: 89, icon: Crown },
    { id: 'collaboration', name: 'Collaborations', count: 156, icon: UserPlus },
    { id: 'feedback', name: 'Feedback Exchange', count: 278, icon: Eye },
    { id: 'automation', name: 'Automation', count: 167, icon: Zap },
    { id: 'services', name: 'Services & Hiring', count: 95, icon: Target }
  ];

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesCategory = selectedCategory === 'all' || discussion.category === selectedCategory;
    const matchesSearch = discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         discussion.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const CommunityStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <Users className="w-8 h-8 text-blue-600" />
          <div className="ml-3">
            <p className="text-2xl font-bold text-gray-900">15,420</p>
            <p className="text-sm text-gray-500">Active Members</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <MessageSquare className="w-8 h-8 text-green-600" />
          <div className="ml-3">
            <p className="text-2xl font-bold text-gray-900">1,247</p>
            <p className="text-sm text-gray-500">Discussions</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <TrendingUp className="w-8 h-8 text-purple-600" />
          <div className="ml-3">
            <p className="text-2xl font-bold text-gray-900">89</p>
            <p className="text-sm text-gray-500">Success Stories</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <Award className="w-8 h-8 text-yellow-600" />
          <div className="ml-3">
            <p className="text-2xl font-bold text-gray-900">567</p>
            <p className="text-sm text-gray-500">Experts Online</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Hub</h1>
        <p className="text-gray-600">Connect with fellow creators, share experiences, and grow together</p>
      </div>

      {/* Community Stats */}
      <CommunityStats />

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('discussions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'discussions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MessageSquare className="w-4 h-4 inline-block mr-2" />
            Discussions
          </button>
          <button
            onClick={() => setActiveTab('creators')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'creators'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="w-4 h-4 inline-block mr-2" />
            Featured Creators
          </button>
          <button
            onClick={() => setActiveTab('discord')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'discord'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ExternalLink className="w-4 h-4 inline-block mr-2" />
            Discord Community
          </button>
        </nav>
      </div>

      {/* Discussions Tab */}
      {activeTab === 'discussions' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <category.icon className="w-4 h-4 mr-3" />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Discussion Area */}
          <div className="lg:col-span-3">
            {/* Search and Create */}
            <div className="mb-6 flex gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                New Discussion
              </button>
            </div>

            {/* Discussions List */}
            <div className="space-y-4">
              {filteredDiscussions.map((discussion) => (
                <div key={discussion.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
                  {/* Discussion Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start">
                      <img
                        src={discussion.author.avatar}
                        alt={discussion.author.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="flex items-center mb-1">
                          <h3 className="font-semibold text-gray-900 mr-2">{discussion.author.name}</h3>
                          {discussion.author.verified && (
                            <Star className="w-4 h-4 text-yellow-400" />
                          )}
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            discussion.author.level === 'Expert' ? 'bg-purple-100 text-purple-800' :
                            discussion.author.level === 'Mentor' ? 'bg-blue-100 text-blue-800' :
                            discussion.author.level === 'Rising' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {discussion.author.level}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{discussion.author.subscribers} subscribers • {discussion.timeAgo}</p>
                      </div>
                    </div>
                    {discussion.pinned && (
                      <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        Pinned
                      </div>
                    )}
                  </div>

                  {/* Discussion Content */}
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">{discussion.title}</h2>
                  <p className="text-gray-600 mb-4">{discussion.content}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {discussion.tags.map((tag) => (
                      <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Discussion Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {discussion.likes}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {discussion.replies}
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {discussion.views}
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Join Discussion →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Featured Creators Tab */}
      {activeTab === 'creators' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator) => (
            <div key={creator.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center mb-4">
                <div className="relative">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-16 h-16 rounded-full"
                  />
                  {creator.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">{creator.name}</h3>
                  <p className="text-sm text-gray-500">{creator.username}</p>
                  <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                    creator.level === 'Expert' ? 'bg-purple-100 text-purple-800' :
                    creator.level === 'Mentor' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {creator.level}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-lg font-bold text-gray-900">{creator.subscribers}</p>
                  <p className="text-sm text-gray-500">Subscribers</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-600">{creator.growth}</p>
                  <p className="text-sm text-gray-500">Monthly Growth</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Niche: {creator.niche}</span>
                <span>{creator.posts} posts</span>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  Connect
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Discord Community Tab */}
      {activeTab === 'discord' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="bg-[#5865F2] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <ExternalLink className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Discord Community</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with 5,000+ creators in real-time. Get instant feedback, join voice chats, participate in challenges, and network with like-minded creators.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Real-time Chat</h3>
                <p className="text-sm text-gray-600">Get instant answers to your questions</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Voice Channels</h3>
                <p className="text-sm text-gray-600">Join co-working sessions and networking calls</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <Award className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Weekly Challenges</h3>
                <p className="text-sm text-gray-600">Participate in growth challenges with prizes</p>
              </div>
            </div>
            
            <button className="bg-[#5865F2] text-white px-8 py-3 rounded-lg hover:bg-[#4752C4] transition-colors duration-200 text-lg font-medium">
              Join Discord Server
            </button>
            
            <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                1,234 Online
              </div>
              <div>5,678 Members</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityHub;