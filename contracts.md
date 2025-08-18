# CreatorHub - YouTube Creator Tool
## API Contracts & Backend Implementation Plan

### Overview
This document outlines the API contracts and backend implementation for CreatorHub, a comprehensive YouTube creator tool combining features from NexLev.io and 1of10.

### API Endpoints Structure

#### Base URL: `/api`

### 1. Channel Management
**GET /api/channels**
- Fetch user's channels
- Response: Array of channel objects with analytics

**POST /api/channels**
- Add new channel for tracking
- Body: `{ youtubeChannelId, channelName }`

**GET /api/channels/{channelId}/analytics**
- Get detailed analytics for specific channel
- Query params: timeRange (7d, 30d, 90d, 1y)

### 2. Content Ideas Management
**GET /api/content-ideas**
- Fetch generated video ideas
- Query params: category, trend, search
- Response: Array of video idea objects

**POST /api/content-ideas/generate**
- Generate new AI-powered video ideas
- Body: `{ niche, keywords, targetAudience }`

**POST /api/content-ideas**
- Save video idea to collection
- Body: `{ title, description, category, tags, folder }`

**PUT /api/content-ideas/{ideaId}**
- Update video idea
- Body: Video idea object

**DELETE /api/content-ideas/{ideaId}**
- Delete video idea

### 3. Competitor Analysis
**GET /api/competitors**
- Get tracked competitors
- Response: Array of competitor objects

**POST /api/competitors**
- Add competitor for tracking
- Body: `{ channelId, channelName }`

**GET /api/competitors/{competitorId}/videos**
- Get competitor's recent videos
- Query params: limit, since

**POST /api/competitors/{competitorId}/notifications**
- Toggle notifications for competitor

### 4. Trending Videos
**GET /api/trending**
- Get trending videos in user's niche
- Query params: category, timeFrame, region

**GET /api/trending/analyze**
- Analyze trending patterns
- Query params: keywords, niche

### 5. Niche Research
**GET /api/niches**
- Get niche analysis data
- Query params: search, profitability

**POST /api/niches/research**
- Research new niche opportunities
- Body: `{ keywords, targetMarket }`

### 6. SEO Tools
**POST /api/seo/analyze-title**
- Analyze video title for SEO
- Body: `{ title }`

**POST /api/seo/analyze-description**
- Analyze video description
- Body: `{ description }`

**GET /api/seo/keywords**
- Get keyword suggestions
- Query params: seed_keyword, volume_min

### 7. Team Management
**GET /api/freelancers**
- Get available freelancers
- Query params: profession, availability, rating

**POST /api/freelancers/{freelancerId}/contact**
- Send message to freelancer
- Body: `{ message, projectDetails }`

### 8. Content Calendar
**GET /api/calendar**
- Get scheduled content
- Query params: start_date, end_date

**POST /api/calendar**
- Schedule new content
- Body: `{ title, scheduledDate, type, status }`

### Data Models

#### Channel
```javascript
{
  id: String,
  youtubeChannelId: String,
  name: String,
  subscriberCount: Number,
  viewCount: Number,
  videoCount: Number,
  avgViews: Number,
  growthRate: Number,
  revenueEstimate: Number,
  thumbnail: String,
  category: String,
  uploadFrequency: String,
  engagement: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### VideoIdea
```javascript
{
  id: String,
  userId: String,
  title: String,
  description: String,
  category: String,
  trend: String,
  viralPotential: Number,
  difficulty: String,
  estimatedViews: String,
  tags: [String],
  competitorExample: String,
  folder: String,
  status: String, // 'saved', 'in-progress', 'planned'
  createdAt: Date,
  updatedAt: Date
}
```

#### Competitor
```javascript
{
  id: String,
  userId: String,
  channelId: String,
  channelName: String,
  subscriberCount: Number,
  avgViews: Number,
  growthRate: Number,
  category: String,
  trackingSince: Date,
  notifications: Boolean,
  lastChecked: Date,
  recentVideos: [RecentVideo]
}
```

#### TrendingVideo
```javascript
{
  id: String,
  title: String,
  channel: String,
  views: Number,
  publishDate: Date,
  thumbnail: String,
  category: String,
  viralScore: Number,
  growthRate: Number,
  keywords: [String]
}
```

#### Niche
```javascript
{
  id: String,
  name: String,
  profitability: Number,
  competition: String,
  avgViews: Number,
  topKeywords: [String],
  estimatedRevenue: String,
  difficulty: String,
  trending: Boolean,
  analysis: Object
}
```

### Mock Data Integration Points

The following mock data will be replaced with actual API responses:

1. **mockChannels** → `/api/channels` endpoint
2. **mockVideoIdeas** → `/api/content-ideas` endpoint  
3. **mockCompetitors** → `/api/competitors` endpoint
4. **mockTrendingVideos** → `/api/trending` endpoint
5. **mockAnalytics** → `/api/channels/{id}/analytics` endpoint
6. **mockNiches** → `/api/niches` endpoint
7. **mockFreelancers** → `/api/freelancers` endpoint

### External API Integrations Needed

1. **YouTube Data API v3** - For channel and video data
2. **OpenAI API** - For AI-powered content generation
3. **Social Blade API** (optional) - For additional analytics
4. **Google Trends API** - For trending keywords

### Authentication & Authorization
- JWT-based authentication
- User sessions with MongoDB
- API key management for external services

### Database Schema
- Users collection
- Channels collection  
- VideoIdeas collection
- Competitors collection
- TrendingVideos collection (cached)
- Niches collection
- Freelancers collection
- ScheduledContent collection

### Implementation Priority
1. User authentication and channel management
2. Content ideas CRUD operations
3. Competitor tracking functionality
4. Trending video analysis
5. SEO tools implementation
6. Team management features
7. Content calendar functionality

### Frontend Integration Notes
- Replace mock data imports with API calls using axios
- Implement loading states and error handling
- Add toast notifications for API responses
- Update components to handle real-time data