#!/usr/bin/env python3
"""
Backend API Testing for CreatorHub YouTube Application
Tests all backend endpoints with real integrations
"""

import requests
import json
import sys
from datetime import datetime
import time

# Get backend URL from frontend .env
BACKEND_URL = "https://youtube-api-hub.preview.emergentagent.com/api"

class BackendTester:
    def __init__(self):
        self.results = []
        self.total_tests = 0
        self.passed_tests = 0
        self.failed_tests = 0
        
    def log_result(self, test_name, status, message, response_data=None):
        """Log test result"""
        result = {
            "test": test_name,
            "status": status,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.results.append(result)
        self.total_tests += 1
        
        if status == "PASS":
            self.passed_tests += 1
            print(f"✅ {test_name}: {message}")
        else:
            self.failed_tests += 1
            print(f"❌ {test_name}: {message}")
            
    def test_health_check(self):
        """Test basic health check endpoint"""
        try:
            response = requests.get(f"{BACKEND_URL}/", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "status" in data:
                    self.log_result("Health Check", "PASS", 
                                  f"API is running - {data['message']}", data)
                else:
                    self.log_result("Health Check", "FAIL", 
                                  "Response missing required fields", data)
            else:
                self.log_result("Health Check", "FAIL", 
                              f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Health Check", "FAIL", f"Connection error: {str(e)}")
    
    def test_youtube_trending(self):
        """Test YouTube trending videos endpoint"""
        try:
            response = requests.get(f"{BACKEND_URL}/youtube/trending", timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    # Validate first video structure
                    video = data[0]
                    required_fields = ['id', 'title', 'channel', 'views', 'viral_score', 'thumbnail']
                    
                    missing_fields = [field for field in required_fields if field not in video]
                    if not missing_fields:
                        self.log_result("YouTube Trending", "PASS", 
                                      f"Retrieved {len(data)} trending videos with viral scores", 
                                      {"count": len(data), "sample_video": video['title']})
                    else:
                        self.log_result("YouTube Trending", "FAIL", 
                                      f"Missing fields in response: {missing_fields}")
                else:
                    self.log_result("YouTube Trending", "FAIL", 
                                  "Empty or invalid response format")
            else:
                self.log_result("YouTube Trending", "FAIL", 
                              f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("YouTube Trending", "FAIL", f"Request error: {str(e)}")
    
    def test_youtube_search(self):
        """Test YouTube search functionality"""
        try:
            params = {"query": "tech", "max_results": 10}
            response = requests.get(f"{BACKEND_URL}/youtube/search", params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    video = data[0]
                    required_fields = ['id', 'title', 'channel', 'views', 'viral_score']
                    
                    missing_fields = [field for field in required_fields if field not in video]
                    if not missing_fields:
                        self.log_result("YouTube Search", "PASS", 
                                      f"Search returned {len(data)} videos for 'tech'", 
                                      {"count": len(data), "sample_title": video['title']})
                    else:
                        self.log_result("YouTube Search", "FAIL", 
                                      f"Missing fields: {missing_fields}")
                else:
                    self.log_result("YouTube Search", "FAIL", 
                                  "Empty search results")
            else:
                self.log_result("YouTube Search", "FAIL", 
                              f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("YouTube Search", "FAIL", f"Request error: {str(e)}")
    
    def test_youtube_channel_stats(self):
        """Test YouTube channel statistics endpoint"""
        try:
            # Test with the provided channel ID
            channel_id = "UCBJycsmduvYEL83R_U4JriQ"
            response = requests.get(f"{BACKEND_URL}/youtube/channel/{channel_id}", timeout=20)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['channel_id', 'name', 'subscriber_count', 'view_count', 'video_count']
                
                missing_fields = [field for field in required_fields if field not in data]
                if not missing_fields:
                    self.log_result("YouTube Channel Stats", "PASS", 
                                  f"Retrieved stats for {data['name']}: {data['subscriber_count']} subscribers", 
                                  {"channel_name": data['name'], "subscribers": data['subscriber_count']})
                else:
                    self.log_result("YouTube Channel Stats", "FAIL", 
                                  f"Missing fields: {missing_fields}")
            elif response.status_code == 404:
                self.log_result("YouTube Channel Stats", "FAIL", 
                              "Channel not found - check channel ID")
            else:
                self.log_result("YouTube Channel Stats", "FAIL", 
                              f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("YouTube Channel Stats", "FAIL", f"Request error: {str(e)}")
    
    def test_content_generation(self):
        """Test AI content generation endpoint"""
        try:
            payload = {
                "topic": "YouTube productivity tips",
                "category": "education",
                "count": 3
            }
            
            response = requests.post(f"{BACKEND_URL}/content/generate-ideas", 
                                   json=payload, timeout=45)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    idea = data[0]
                    required_fields = ['id', 'title', 'description', 'category', 'viral_potential', 'ai_generated']
                    
                    missing_fields = [field for field in required_fields if field not in idea]
                    if not missing_fields and idea.get('ai_generated') == True:
                        self.log_result("AI Content Generation", "PASS", 
                                      f"Generated {len(data)} AI content ideas", 
                                      {"count": len(data), "sample_title": idea['title']})
                    else:
                        self.log_result("AI Content Generation", "FAIL", 
                                      f"Invalid response structure or missing AI flag")
                else:
                    self.log_result("AI Content Generation", "FAIL", 
                                  "Empty or invalid response")
            else:
                self.log_result("AI Content Generation", "FAIL", 
                              f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("AI Content Generation", "FAIL", f"Request error: {str(e)}")
    
    def test_analytics_dashboard(self):
        """Test analytics dashboard endpoint"""
        try:
            response = requests.get(f"{BACKEND_URL}/analytics/dashboard", timeout=20)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['totalViews', 'totalSubscribers', 'avgViewDuration', 'revenueThisMonth']
                
                missing_fields = [field for field in required_fields if field not in data]
                if not missing_fields:
                    self.log_result("Analytics Dashboard", "PASS", 
                                  f"Dashboard data: {data['totalViews']} views, {data['totalSubscribers']} subscribers", 
                                  {"views": data['totalViews'], "subscribers": data['totalSubscribers']})
                else:
                    self.log_result("Analytics Dashboard", "FAIL", 
                                  f"Missing fields: {missing_fields}")
            else:
                self.log_result("Analytics Dashboard", "FAIL", 
                              f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Analytics Dashboard", "FAIL", f"Request error: {str(e)}")
    
    def test_environment_variables(self):
        """Test that required environment variables are configured"""
        try:
            # Test by making a request that would fail without proper API keys
            response = requests.get(f"{BACKEND_URL}/youtube/trending?max_results=1", timeout=15)
            
            if response.status_code == 200:
                self.log_result("Environment Variables", "PASS", 
                              "YouTube API key is properly configured")
            elif response.status_code == 403:
                self.log_result("Environment Variables", "FAIL", 
                              "YouTube API key invalid or quota exceeded")
            else:
                self.log_result("Environment Variables", "FAIL", 
                              f"Unexpected response: {response.status_code}")
                
        except Exception as e:
            self.log_result("Environment Variables", "FAIL", f"Request error: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting CreatorHub Backend API Tests")
        print(f"Testing against: {BACKEND_URL}")
        print("=" * 60)
        
        # Run tests in order
        self.test_health_check()
        self.test_environment_variables()
        self.test_youtube_trending()
        self.test_youtube_search()
        self.test_youtube_channel_stats()
        self.test_content_generation()
        self.test_analytics_dashboard()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.total_tests}")
        print(f"Passed: {self.passed_tests}")
        print(f"Failed: {self.failed_tests}")
        print(f"Success Rate: {(self.passed_tests/self.total_tests)*100:.1f}%")
        
        # Print failed tests details
        if self.failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.results:
                if result['status'] == 'FAIL':
                    print(f"  - {result['test']}: {result['message']}")
        
        return self.results

if __name__ == "__main__":
    tester = BackendTester()
    results = tester.run_all_tests()
    
    # Exit with error code if tests failed
    sys.exit(0 if tester.failed_tests == 0 else 1)