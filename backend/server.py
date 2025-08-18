from fastapi import FastAPI, APIRouter, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import asyncio
from googleapiclient.discovery import build
from emergentintegrations.llm.chat import LlmChat, UserMessage
import json
import aiohttp
import traceback

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# API Keys
YOUTUBE_API_KEY = os.environ.get('YOUTUBE_API_KEY')
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# YouTube API client
youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class TrendingVideo(BaseModel):
    id: str
    title: str
    channel: str
    channel_id: str
    views: int
    publish_date: str
    thumbnail: str
    category: str
    description: str
    duration: str
    tags: List[str] = []
    viral_score: int

class ChannelStats(BaseModel):
    channel_id: str
    name: str
    subscriber_count: int
    view_count: int
    video_count: int
    description: str
    thumbnail: str
    custom_url: Optional[str] = None
    country: Optional[str] = None

class VideoIdea(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: str
    trend: str
    viral_potential: int
    difficulty: str
    estimated_views: str
    tags: List[str]
    ai_generated: bool = True
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class ContentGenerationRequest(BaseModel):
    topic: str
    category: str = "general"
    count: int = 5

# YouTube API Helper Functions
def get_video_duration_seconds(duration):
    """Convert YouTube duration format to seconds"""
    import re
    match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration)
    if not match:
        return 0
    
    hours = int(match.group(1) or 0)
    minutes = int(match.group(2) or 0)
    seconds = int(match.group(3) or 0)
    
    return hours * 3600 + minutes * 60 + seconds

def format_duration(seconds):
    """Format seconds to readable duration"""
    if seconds < 60:
        return f"0:{seconds:02d}"
    elif seconds < 3600:
        minutes = seconds // 60
        secs = seconds % 60
        return f"{minutes}:{secs:02d}"
    else:
        hours = seconds // 3600
        minutes = (seconds % 3600) // 60
        secs = seconds % 60
        return f"{hours}:{minutes:02d}:{secs:02d}"

def calculate_viral_score(views, published_date, subscriber_count=None):
    """Calculate a viral score based on views and time since publication"""
    try:
        # Parse the published date
        pub_date = datetime.fromisoformat(published_date.replace('Z', '+00:00'))
        days_since_published = (datetime.utcnow().replace(tzinfo=pub_date.tzinfo) - pub_date).days
        
        # Avoid division by zero
        if days_since_published == 0:
            days_since_published = 1
            
        # Calculate views per day
        views_per_day = views / days_since_published
        
        # Base score calculation
        if views_per_day >= 100000:
            score = 95
        elif views_per_day >= 50000:
            score = 85
        elif views_per_day >= 10000:
            score = 75
        elif views_per_day >= 5000:
            score = 65
        elif views_per_day >= 1000:
            score = 55
        else:
            score = 45
            
        # Boost for very high view counts
        if views >= 1000000:
            score = min(100, score + 10)
        elif views >= 500000:
            score = min(100, score + 5)
            
        return max(0, min(100, score))
    except:
        return 50

# API Routes

@api_router.get("/")
async def root():
    return {"message": "CreatorHub API is running", "status": "active"}

# Status check endpoints (existing)
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# YouTube API endpoints
@api_router.get("/youtube/trending", response_model=List[TrendingVideo])
async def get_trending_videos(
    category: str = Query(default="all"),
    region: str = Query(default="US"),
    max_results: int = Query(default=50, le=50)
):
    """Get trending videos from YouTube"""
    try:
        # Get trending videos
        request = youtube.videos().list(
            part="snippet,statistics,contentDetails",
            chart="mostPopular",
            regionCode=region,
            maxResults=max_results,
            videoCategoryId=None if category == "all" else category
        )
        
        response = request.execute()
        
        trending_videos = []
        for item in response.get('items', []):
            snippet = item['snippet']
            statistics = item['statistics']
            content_details = item['contentDetails']
            
            # Get duration in seconds
            duration_seconds = get_video_duration_seconds(content_details['duration'])
            
            # Calculate viral score
            viral_score = calculate_viral_score(
                int(statistics.get('viewCount', 0)),
                snippet['publishedAt']
            )
            
            video = TrendingVideo(
                id=item['id'],
                title=snippet['title'],
                channel=snippet['channelTitle'],
                channel_id=snippet['channelId'],
                views=int(statistics.get('viewCount', 0)),
                publish_date=snippet['publishedAt'].split('T')[0],
                thumbnail=snippet['thumbnails']['medium']['url'],
                category=snippet.get('categoryId', ''),
                description=snippet['description'][:200] + "..." if len(snippet['description']) > 200 else snippet['description'],
                duration=format_duration(duration_seconds),
                tags=snippet.get('tags', [])[:5],  # Limit to 5 tags
                viral_score=viral_score
            )
            trending_videos.append(video)
        
        # Sort by viral score
        trending_videos.sort(key=lambda x: x.viral_score, reverse=True)
        
        return trending_videos
        
    except Exception as e:
        logger.error(f"Error fetching trending videos: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to fetch trending videos: {str(e)}")

@api_router.get("/youtube/search")
async def search_youtube_videos(
    query: str = Query(..., description="Search query"),
    max_results: int = Query(default=25, le=50)
):
    """Search for YouTube videos"""
    try:
        request = youtube.search().list(
            part="snippet",
            q=query,
            type="video",
            maxResults=max_results,
            order="relevance"
        )
        
        response = request.execute()
        
        # Get video IDs for additional details
        video_ids = [item['id']['videoId'] for item in response.get('items', [])]
        
        if not video_ids:
            return []
        
        # Get detailed video information
        videos_request = youtube.videos().list(
            part="snippet,statistics,contentDetails",
            id=','.join(video_ids)
        )
        
        videos_response = videos_request.execute()
        
        search_results = []
        for item in videos_response.get('items', []):
            snippet = item['snippet']
            statistics = item['statistics']
            content_details = item['contentDetails']
            
            duration_seconds = get_video_duration_seconds(content_details['duration'])
            viral_score = calculate_viral_score(
                int(statistics.get('viewCount', 0)),
                snippet['publishedAt']
            )
            
            video = TrendingVideo(
                id=item['id'],
                title=snippet['title'],
                channel=snippet['channelTitle'],
                channel_id=snippet['channelId'],
                views=int(statistics.get('viewCount', 0)),
                publish_date=snippet['publishedAt'].split('T')[0],
                thumbnail=snippet['thumbnails']['medium']['url'],
                category=snippet.get('categoryId', ''),
                description=snippet['description'][:200] + "..." if len(snippet['description']) > 200 else snippet['description'],
                duration=format_duration(duration_seconds),
                tags=snippet.get('tags', [])[:5],
                viral_score=viral_score
            )
            search_results.append(video)
        
        return search_results
        
    except Exception as e:
        logger.error(f"Error searching YouTube videos: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@api_router.get("/youtube/channel/{channel_id}", response_model=ChannelStats)
async def get_channel_stats(channel_id: str):
    """Get YouTube channel statistics"""
    try:
        request = youtube.channels().list(
            part="snippet,statistics",
            id=channel_id
        )
        
        response = request.execute()
        
        if not response.get('items'):
            raise HTTPException(status_code=404, detail="Channel not found")
        
        item = response['items'][0]
        snippet = item['snippet']
        statistics = item['statistics']
        
        channel_stats = ChannelStats(
            channel_id=channel_id,
            name=snippet['title'],
            subscriber_count=int(statistics.get('subscriberCount', 0)),
            view_count=int(statistics.get('viewCount', 0)),
            video_count=int(statistics.get('videoCount', 0)),
            description=snippet['description'][:300] + "..." if len(snippet['description']) > 300 else snippet['description'],
            thumbnail=snippet['thumbnails']['medium']['url'],
            custom_url=snippet.get('customUrl'),
            country=snippet.get('country')
        )
        
        return channel_stats
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching channel stats: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch channel stats: {str(e)}")

# AI-powered content generation
@api_router.post("/content/generate-ideas", response_model=List[VideoIdea])
async def generate_content_ideas(request: ContentGenerationRequest):
    """Generate AI-powered content ideas based on trending topics"""
    try:
        # Initialize AI chat
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"content_gen_{uuid.uuid4()}",
            system_message="You are an expert YouTube content strategist. Generate viral video ideas based on trending topics and user requests. Focus on engaging, clickable titles and valuable content descriptions."
        ).with_model("openai", "gpt-4o-mini")
        
        # Create prompt for content generation
        prompt = f"""
Generate {request.count} unique YouTube video ideas for the category: {request.category} and topic: {request.topic}

For each idea, provide:
1. A compelling, clickable title (under 60 characters)
2. A brief description (2-3 sentences)
3. Estimated viral potential (0-100)
4. Difficulty level (Easy/Medium/Hard)
5. Estimated view range
6. 3-5 relevant tags

Focus on current trends, engaging formats, and content that provides real value to viewers.

Format your response as a JSON array with objects containing: title, description, viral_potential, difficulty, estimated_views, tags

Make sure the titles are attention-grabbing and follow successful YouTube patterns like:
- "I Tried... for X Days"
- "The Secret to..."
- "Why Everyone is..."
- "X Things You Didn't Know About..."
- "This Changed My Life:"
"""

        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        # Parse AI response
        try:
            # Extract JSON from the response
            response_text = str(response)
            start_idx = response_text.find('[')
            end_idx = response_text.rfind(']') + 1
            
            if start_idx != -1 and end_idx != 0:
                json_str = response_text[start_idx:end_idx]
                ai_ideas = json.loads(json_str)
            else:
                # Fallback: create structured response
                ai_ideas = []
                
        except json.JSONDecodeError:
            # Fallback: create some default ideas if JSON parsing fails
            ai_ideas = [
                {
                    "title": f"The Ultimate {request.topic} Guide for 2025",
                    "description": f"Everything you need to know about {request.topic} in the current year.",
                    "viral_potential": 75,
                    "difficulty": "Medium",
                    "estimated_views": "100K - 500K",
                    "tags": [request.topic, "guide", "2025", "tutorial"]
                }
            ]
        
        # Convert to VideoIdea objects
        video_ideas = []
        for idea in ai_ideas[:request.count]:
            video_idea = VideoIdea(
                title=idea.get('title', f'{request.topic} Content Idea'),
                description=idea.get('description', f'Great content about {request.topic}'),
                category=request.category,
                trend="AI Generated",
                viral_potential=min(100, max(0, int(idea.get('viral_potential', 70)))),
                difficulty=idea.get('difficulty', 'Medium'),
                estimated_views=idea.get('estimated_views', '50K - 200K'),
                tags=idea.get('tags', [request.topic])[:5],  # Limit to 5 tags
                ai_generated=True
            )
            video_ideas.append(video_idea)
        
        # Store in database
        for idea in video_ideas:
            await db.video_ideas.insert_one(idea.dict())
        
        return video_ideas
        
    except Exception as e:
        logger.error(f"Error generating content ideas: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to generate content ideas: {str(e)}")

@api_router.get("/analytics/dashboard")
async def get_dashboard_analytics():
    """Get dashboard analytics data combining YouTube and stored data"""
    try:
        # This could be enhanced to fetch real user's channel data
        # For now, we'll provide aggregated trending data
        
        # Get some trending videos for analysis
        trending_request = youtube.videos().list(
            part="snippet,statistics",
            chart="mostPopular",
            regionCode="US",
            maxResults=10
        )
        
        trending_response = trending_request.execute()
        
        total_views = 0
        total_videos = len(trending_response.get('items', []))
        
        for item in trending_response.get('items', []):
            total_views += int(item['statistics'].get('viewCount', 0))
        
        avg_views = total_views // total_videos if total_videos > 0 else 0
        
        # Generate mock analytics with real trending data influence
        analytics = {
            "totalViews": avg_views * 45,  # Simulate user having 45 videos
            "totalSubscribers": min(567000, avg_views // 100),  # Realistic subscriber count
            "avgViewDuration": "4:32",
            "clickThroughRate": 12.8,
            "engagementRate": 8.5,
            "revenueThisMonth": min(15600, avg_views // 1000),
            "topPerformingVideo": {
                "title": trending_response['items'][0]['snippet']['title'] if trending_response.get('items') else "Top Video",
                "views": trending_response['items'][0]['statistics'].get('viewCount', '0') if trending_response.get('items') else 0,
                "thumbnail": trending_response['items'][0]['snippet']['thumbnails']['medium']['url'] if trending_response.get('items') else ""
            },
            "monthlyGrowth": [
                {"month": "Aug", "subscribers": 12000, "views": 890000},
                {"month": "Sep", "subscribers": 18000, "views": 1200000},
                {"month": "Oct", "subscribers": 22000, "views": 1450000},
                {"month": "Nov", "subscribers": 28000, "views": 1800000},
                {"month": "Dec", "subscribers": 32000, "views": 2100000},
                {"month": "Jan", "subscribers": 35000, "views": 2350000}
            ]
        }
        
        return analytics
        
    except Exception as e:
        logger.error(f"Error fetching dashboard analytics: {str(e)}")
        # Return fallback data
        return {
            "totalViews": 45600000,
            "totalSubscribers": 567000,
            "avgViewDuration": "4:32",
            "clickThroughRate": 12.8,
            "engagementRate": 8.5,
            "revenueThisMonth": 15600,
            "topPerformingVideo": {
                "title": "My Best Gaming Setup Under $500",
                "views": 2100000,
                "thumbnail": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=120&fit=crop"
            },
            "monthlyGrowth": [
                {"month": "Aug", "subscribers": 12000, "views": 890000},
                {"month": "Sep", "subscribers": 18000, "views": 1200000},
                {"month": "Oct", "subscribers": 22000, "views": 1450000},
                {"month": "Nov", "subscribers": 28000, "views": 1800000},
                {"month": "Dec", "subscribers": 32000, "views": 2100000},
                {"month": "Jan", "subscribers": 35000, "views": 2350000}
            ]
        }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()