// Mock data for the YouTube creator tool

export const mockChannels = [
  {
    id: '1',
    name: 'Tech Reviews Pro',
    subscriberCount: 245000,
    viewCount: 12500000,
    videoCount: 156,
    avgViews: 45000,
    growthRate: 12.5,
    revenueEstimate: 8500,
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100&h=100&fit=crop&crop=face',
    category: 'Technology',
    uploadFrequency: 'Weekly',
    engagement: 8.5
  },
  {
    id: '2', 
    name: 'Mindful Living',
    subscriberCount: 89000,
    viewCount: 3200000,
    videoCount: 78,
    avgViews: 28000,
    growthRate: 18.2,
    revenueEstimate: 3200,
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    category: 'Lifestyle',
    uploadFrequency: 'Bi-weekly',
    engagement: 12.3
  },
  {
    id: '3',
    name: 'Gaming Universe',
    subscriberCount: 567000,
    viewCount: 45600000,
    videoCount: 334,
    avgViews: 125000,
    growthRate: 8.7,
    revenueEstimate: 15600,
    thumbnail: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    category: 'Gaming',
    uploadFrequency: 'Daily',
    engagement: 6.8
  }
];

export const mockVideoIdeas = [
  {
    id: '1',
    title: 'Why Everyone is Switching to This Unknown Tech in 2025',
    description: 'Explore the revolutionary technology that\'s changing how we work and live',
    category: 'Technology',
    trend: 'Rising',
    viralPotential: 92,
    difficulty: 'Medium',
    estimatedViews: '500K - 1M',
    tags: ['tech', 'innovation', '2025', 'trending'],
    competitorExample: 'Similar video got 2.3M views',
    createdAt: '2025-01-15',
    folder: 'Tech Content',
    status: 'saved'
  },
  {
    id: '2',
    title: 'I Tried the $10 vs $1000 Morning Routine for 30 Days',
    description: 'Comparing budget vs luxury morning routines and the shocking results',
    category: 'Lifestyle',
    trend: 'Trending',
    viralPotential: 87,
    difficulty: 'Easy',
    estimatedViews: '300K - 800K',
    tags: ['morning routine', 'experiment', 'lifestyle'],
    competitorExample: 'Similar comparison got 1.8M views',
    createdAt: '2025-01-14',
    folder: 'Lifestyle',
    status: 'in-progress'
  },
  {
    id: '3',
    title: 'The Gaming Trick That Pro Players Don\'t Want You to Know',
    description: 'Secret strategies used by professional gamers revealed',
    category: 'Gaming',
    trend: 'Hot',
    viralPotential: 95,
    difficulty: 'Hard',
    estimatedViews: '1M - 2M',
    tags: ['gaming', 'pro tips', 'secrets', 'strategy'],
    competitorExample: 'Similar secret revealed got 3.1M views',
    createdAt: '2025-01-13',
    folder: 'Gaming Tips',
    status: 'planned'
  }
];

export const mockCompetitors = [
  {
    id: '1',
    channelName: 'TechMaster Pro',
    subscriberCount: 890000,
    recentVideo: {
      title: 'The Future of AI is Here',
      views: 456000,
      uploadDate: '2025-01-14',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=120&fit=crop'
    },
    growthRate: 15.2,
    avgViews: 320000,
    category: 'Technology',
    trackingSince: '2024-12-01'
  },
  {
    id: '2',
    channelName: 'Wellness Journey',
    subscriberCount: 234000,
    recentVideo: {
      title: '5 Habits That Changed My Life',
      views: 125000,
      uploadDate: '2025-01-13',
      thumbnail: 'https://images.unsplash.com/photo-1506629905607-c90fb8b8e78d?w=200&h=120&fit=crop'
    },
    growthRate: 22.8,
    avgViews: 85000,
    category: 'Lifestyle',
    trackingSince: '2024-11-15'
  }
];

export const mockTrendingVideos = [
  {
    id: '1',
    title: 'This AI Tool Will Replace Your Job in 2025',
    channel: 'Future Tech Today',
    views: 2300000,
    publishDate: '2025-01-12',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=120&fit=crop',
    category: 'Technology',
    viralScore: 98,
    growthRate: 45.6
  },
  {
    id: '2',
    title: 'I Lived Like a Millionaire for 24 Hours',
    channel: 'Lifestyle Experiments',
    views: 1800000,
    publishDate: '2025-01-11',
    thumbnail: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=200&h=120&fit=crop',
    category: 'Lifestyle',
    viralScore: 94,
    growthRate: 38.2
  },
  {
    id: '3',
    title: 'The Secret Gaming Setup That Pros Use',
    channel: 'Gaming Legends',
    views: 1500000,
    publishDate: '2025-01-10',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=120&fit=crop',
    category: 'Gaming',
    viralScore: 91,
    growthRate: 42.1
  }
];

export const mockAnalytics = {
  totalViews: 45600000,
  totalSubscribers: 567000,
  avgViewDuration: '4:32',
  clickThroughRate: 12.8,
  engagementRate: 8.5,
  revenueThisMonth: 15600,
  topPerformingVideo: {
    title: 'My Best Gaming Setup Under $500',
    views: 2100000,
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=120&fit=crop'
  },
  monthlyGrowth: [
    { month: 'Aug', subscribers: 12000, views: 890000 },
    { month: 'Sep', subscribers: 18000, views: 1200000 },
    { month: 'Oct', subscribers: 22000, views: 1450000 },
    { month: 'Nov', subscribers: 28000, views: 1800000 },
    { month: 'Dec', subscribers: 32000, views: 2100000 },
    { month: 'Jan', subscribers: 35000, views: 2350000 }
  ]
};

export const mockNiches = [
  {
    id: '1',
    name: 'AI & Automation',
    profitability: 92,
    competition: 'Medium',
    avgViews: 450000,
    topKeywords: ['artificial intelligence', 'automation', 'AI tools', 'machine learning'],
    estimatedRevenue: '$2,500 - $8,000/month',
    difficulty: 'Medium',
    trending: true
  },
  {
    id: '2',
    name: 'Productivity Hacks',
    profitability: 88,
    competition: 'High',
    avgViews: 320000,
    topKeywords: ['productivity', 'time management', 'life hacks', 'efficiency'],
    estimatedRevenue: '$1,800 - $5,500/month',
    difficulty: 'Easy',
    trending: false
  },
  {
    id: '3',
    name: 'Crypto Analysis',
    profitability: 95,
    competition: 'Very High',
    avgViews: 680000,
    topKeywords: ['cryptocurrency', 'bitcoin', 'blockchain', 'trading'],
    estimatedRevenue: '$3,200 - $12,000/month',
    difficulty: 'Hard',
    trending: true
  }
];

export const mockFreelancers = [
  {
    id: '1',
    name: 'Sarah Chen',
    profession: 'Video Editor',
    rating: 4.9,
    completedProjects: 156,
    hourlyRate: 45,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=100&h=100&fit=crop&crop=face',
    skills: ['After Effects', 'Premiere Pro', 'DaVinci Resolve'],
    availability: 'Available',
    specialization: 'Tech & Gaming Content'
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    profession: 'Thumbnail Designer',
    rating: 4.8,
    completedProjects: 89,
    hourlyRate: 35,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    skills: ['Photoshop', 'Illustrator', 'Figma'],
    availability: 'Busy until Jan 20',
    specialization: 'YouTube Thumbnails'
  },
  {
    id: '3',
    name: 'Emma Thompson',
    profession: 'Script Writer',
    rating: 4.9,
    completedProjects: 203,
    hourlyRate: 50,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    skills: ['Creative Writing', 'SEO', 'Research'],
    availability: 'Available',
    specialization: 'Educational & Lifestyle Content'
  }
];