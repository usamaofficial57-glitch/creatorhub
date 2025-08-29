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
BACKEND_URL = "https://tube-connector-1.preview.emergentagent.com/api"

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

    def test_channel_connection_channel_id(self):
        """Test channel connection with channel ID format"""
        try:
            # Test with Marques Brownlee's channel ID
            payload = {
                "channel_id": "UCBJycsmduvYEL83R_U4JriQ"
            }
            
            response = requests.post(f"{BACKEND_URL}/channels/connect", 
                                   json=payload, timeout=20)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['id', 'channel_id', 'channel_name', 'subscriber_count', 'view_count', 'video_count']
                
                missing_fields = [field for field in required_fields if field not in data]
                if not missing_fields:
                    self.log_result("Channel Connection (ID)", "PASS", 
                                  f"Connected {data['channel_name']} with {data['subscriber_count']} subscribers", 
                                  {"channel_name": data['channel_name'], "subscribers": data['subscriber_count']})
                    return data['channel_id']  # Return for cleanup
                else:
                    self.log_result("Channel Connection (ID)", "FAIL", 
                                  f"Missing fields: {missing_fields}")
            elif response.status_code == 400 and "already connected" in response.text:
                self.log_result("Channel Connection (ID)", "PASS", 
                              "Channel already connected (expected behavior)")
                return "UCBJycsmduvYEL83R_U4JriQ"  # Return for cleanup
            else:
                self.log_result("Channel Connection (ID)", "FAIL", 
                              f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Channel Connection (ID)", "FAIL", f"Request error: {str(e)}")
        return None

    def test_channel_connection_url_formats(self):
        """Test channel connection with different URL formats"""
        try:
            # Test with channel URL format
            payload = {
                "channel_url": "https://www.youtube.com/channel/UCX6OQ3DkcsbYNE6H8uQQuVA"
            }
            
            response = requests.post(f"{BACKEND_URL}/channels/connect", 
                                   json=payload, timeout=20)
            
            if response.status_code == 200:
                data = response.json()
                self.log_result("Channel Connection (URL)", "PASS", 
                              f"Connected {data['channel_name']} via URL format", 
                              {"channel_name": data['channel_name']})
                return data['channel_id']
            elif response.status_code == 400 and "already connected" in response.text:
                self.log_result("Channel Connection (URL)", "PASS", 
                              "Channel already connected (expected behavior)")
                return "UCX6OQ3DkcsbYNE6H8uQQuVA"
            else:
                self.log_result("Channel Connection (URL)", "FAIL", 
                              f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Channel Connection (URL)", "FAIL", f"Request error: {str(e)}")
        return None

    def test_channel_connection_handle(self):
        """Test channel connection with handle format"""
        try:
            # Test with handle format
            payload = {
                "channel_handle": "@MrBeast"
            }
            
            response = requests.post(f"{BACKEND_URL}/channels/connect", 
                                   json=payload, timeout=20)
            
            if response.status_code == 200:
                data = response.json()
                self.log_result("Channel Connection (Handle)", "PASS", 
                              f"Connected {data['channel_name']} via handle format", 
                              {"channel_name": data['channel_name']})
                return data['channel_id']
            elif response.status_code == 400 and "already connected" in response.text:
                self.log_result("Channel Connection (Handle)", "PASS", 
                              "Channel already connected (expected behavior)")
                return "UCX6OQ3DkcsbYNE6H8uQQuVA"  # MrBeast's channel ID
            else:
                self.log_result("Channel Connection (Handle)", "FAIL", 
                              f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Channel Connection (Handle)", "FAIL", f"Request error: {str(e)}")
        return None

    def test_get_connected_channels(self):
        """Test getting list of connected channels"""
        try:
            response = requests.get(f"{BACKEND_URL}/channels", timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    if len(data) > 0:
                        channel = data[0]
                        required_fields = ['id', 'channel_id', 'channel_name', 'subscriber_count', 'is_primary']
                        
                        missing_fields = [field for field in required_fields if field not in channel]
                        if not missing_fields:
                            primary_count = sum(1 for ch in data if ch.get('is_primary', False))
                            self.log_result("Get Connected Channels", "PASS", 
                                          f"Retrieved {len(data)} connected channels, {primary_count} primary", 
                                          {"count": len(data), "primary_count": primary_count})
                        else:
                            self.log_result("Get Connected Channels", "FAIL", 
                                          f"Missing fields: {missing_fields}")
                    else:
                        self.log_result("Get Connected Channels", "PASS", 
                                      "No channels connected (valid state)")
                else:
                    self.log_result("Get Connected Channels", "FAIL", 
                                  "Response is not a list")
            else:
                self.log_result("Get Connected Channels", "FAIL", 
                              f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Get Connected Channels", "FAIL", f"Request error: {str(e)}")

    def test_set_primary_channel(self, channel_id):
        """Test setting a channel as primary"""
        if not channel_id:
            self.log_result("Set Primary Channel", "SKIP", "No channel ID available")
            return
            
        try:
            response = requests.put(f"{BACKEND_URL}/channels/{channel_id}/primary", timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "successfully" in data["message"].lower():
                    self.log_result("Set Primary Channel", "PASS", 
                                  f"Successfully set channel as primary: {data['message']}")
                else:
                    self.log_result("Set Primary Channel", "FAIL", 
                                  "Unexpected response format")
            elif response.status_code == 404:
                self.log_result("Set Primary Channel", "FAIL", 
                              "Channel not found")
            else:
                self.log_result("Set Primary Channel", "FAIL", 
                              f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Set Primary Channel", "FAIL", f"Request error: {str(e)}")

    def test_analytics_dashboard_with_connected_channel(self):
        """Test analytics dashboard with connected channel"""
        try:
            response = requests.get(f"{BACKEND_URL}/analytics/dashboard", timeout=25)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get('connected') == True:
                    # Test with connected channel
                    required_fields = ['channelInfo', 'totalViews', 'totalSubscribers', 'videoCount', 'monthlyGrowth']
                    missing_fields = [field for field in required_fields if field not in data]
                    
                    if not missing_fields:
                        channel_info = data.get('channelInfo', {})
                        if 'name' in channel_info and 'id' in channel_info:
                            self.log_result("Analytics Dashboard (Connected)", "PASS", 
                                          f"Real analytics for {channel_info['name']}: {data['totalViews']} views, {data['totalSubscribers']} subscribers", 
                                          {"channel": channel_info['name'], "views": data['totalViews'], "subscribers": data['totalSubscribers']})
                        else:
                            self.log_result("Analytics Dashboard (Connected)", "FAIL", 
                                          "Missing channel info fields")
                    else:
                        self.log_result("Analytics Dashboard (Connected)", "FAIL", 
                                      f"Missing fields: {missing_fields}")
                elif data.get('connected') == False:
                    # Test without connected channel
                    if 'message' in data and 'no youtube channels connected' in data['message'].lower():
                        self.log_result("Analytics Dashboard (No Channels)", "PASS", 
                                      "Correctly returns no channels connected state")
                    else:
                        self.log_result("Analytics Dashboard (No Channels)", "FAIL", 
                                      "Unexpected response for no channels state")
                else:
                    self.log_result("Analytics Dashboard (Connected)", "FAIL", 
                                  "Invalid connected status")
            else:
                self.log_result("Analytics Dashboard (Connected)", "FAIL", 
                              f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Analytics Dashboard (Connected)", "FAIL", f"Request error: {str(e)}")

    def test_channel_connection_error_handling(self):
        """Test error handling for invalid channel connections"""
        try:
            # Test with invalid channel ID
            payload = {
                "channel_id": "INVALID_CHANNEL_ID_123"
            }
            
            response = requests.post(f"{BACKEND_URL}/channels/connect", 
                                   json=payload, timeout=15)
            
            if response.status_code == 404:
                self.log_result("Channel Connection Error Handling", "PASS", 
                              "Correctly handles invalid channel ID with 404")
            elif response.status_code == 400:
                self.log_result("Channel Connection Error Handling", "PASS", 
                              "Correctly handles invalid channel ID with 400")
            else:
                self.log_result("Channel Connection Error Handling", "FAIL", 
                              f"Unexpected response for invalid channel: {response.status_code}")
                
        except Exception as e:
            self.log_result("Channel Connection Error Handling", "FAIL", f"Request error: {str(e)}")

    def test_disconnect_channel(self, channel_id):
        """Test disconnecting a channel"""
        if not channel_id:
            self.log_result("Disconnect Channel", "SKIP", "No channel ID available")
            return
            
        try:
            response = requests.delete(f"{BACKEND_URL}/channels/{channel_id}", timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "disconnected" in data["message"].lower():
                    self.log_result("Disconnect Channel", "PASS", 
                                  f"Successfully disconnected channel: {data['message']}")
                else:
                    self.log_result("Disconnect Channel", "FAIL", 
                                  "Unexpected response format")
            elif response.status_code == 404:
                self.log_result("Disconnect Channel", "PASS", 
                              "Channel not found (may have been already disconnected)")
            else:
                self.log_result("Disconnect Channel", "FAIL", 
                              f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Disconnect Channel", "FAIL", f"Request error: {str(e)}")
    
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
    
    def test_database_state_check(self):
        """Check current database state for connected channels"""
        try:
            response = requests.get(f"{BACKEND_URL}/channels", timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    primary_channels = [ch for ch in data if ch.get('is_primary', False)]
                    self.log_result("Database State Check", "PASS", 
                                  f"Found {len(data)} connected channels, {len(primary_channels)} primary", 
                                  {"total_channels": len(data), "primary_channels": len(primary_channels), "channels": data})
                    return data
                else:
                    self.log_result("Database State Check", "FAIL", "Invalid response format")
            else:
                self.log_result("Database State Check", "FAIL", f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Database State Check", "FAIL", f"Request error: {str(e)}")
        return []

    def test_dashboard_with_no_channels(self):
        """Test dashboard behavior when no channels are connected"""
        try:
            response = requests.get(f"{BACKEND_URL}/analytics/dashboard", timeout=20)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('connected') == False:
                    self.log_result("Dashboard No Channels", "PASS", 
                                  f"Dashboard correctly shows no channels: {data.get('message', 'No message')}", 
                                  data)
                elif data.get('connected') == True:
                    self.log_result("Dashboard No Channels", "INFO", 
                                  f"Dashboard shows connected channel: {data.get('channelInfo', {}).get('name', 'Unknown')}", 
                                  data)
                else:
                    self.log_result("Dashboard No Channels", "FAIL", 
                                  f"Unexpected connected status: {data.get('connected')}")
            else:
                self.log_result("Dashboard No Channels", "FAIL", 
                              f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Dashboard No Channels", "FAIL", f"Request error: {str(e)}")

    def run_focused_tests(self):
        """Run focused tests for the review request issues"""
        print("🎯 FOCUSED TESTING: YouTube Channel Connection & Dashboard Analytics")
        print(f"Testing against: {BACKEND_URL}")
        print("=" * 80)
        
        # 1. Check current database state
        print("\n1️⃣ Checking current database state...")
        existing_channels = self.test_database_state_check()
        
        # 2. Test dashboard with current state
        print("\n2️⃣ Testing dashboard with current state...")
        self.test_dashboard_with_no_channels()
        
        # 3. Test connecting new channels
        print("\n3️⃣ Testing channel connection...")
        channel_id_1 = self.test_channel_connection_channel_id()  # Marques Brownlee
        channel_id_2 = self.test_channel_connection_url_formats()  # MrBeast
        
        # 4. Test listing channels after connection
        print("\n4️⃣ Testing channel listing after connections...")
        self.test_get_connected_channels()
        
        # 5. Test setting primary channel
        test_channel_id = channel_id_1 or channel_id_2
        if test_channel_id:
            print("\n5️⃣ Testing primary channel setting...")
            self.test_set_primary_channel(test_channel_id)
            
            # 6. Test dashboard with connected channel
            print("\n6️⃣ Testing dashboard with connected channel...")
            self.test_analytics_dashboard_with_connected_channel()
        
        # 7. Test basic API functionality
        print("\n7️⃣ Testing basic API functionality...")
        self.test_health_check()
        self.test_youtube_channel_stats()
        
        # Print focused summary
        print("\n" + "=" * 80)
        print("🎯 FOCUSED TEST SUMMARY")
        print("=" * 80)
        print(f"Total Tests: {self.total_tests}")
        print(f"Passed: {self.passed_tests}")
        print(f"Failed: {self.failed_tests}")
        print(f"Success Rate: {(self.passed_tests/self.total_tests)*100:.1f}%")
        
        # Print detailed results
        if self.failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.results:
                if result['status'] == 'FAIL':
                    print(f"  - {result['test']}: {result['message']}")
        
        print("\n✅ PASSED TESTS:")
        for result in self.results:
            if result['status'] == 'PASS':
                print(f"  - {result['test']}: {result['message']}")
        
        return self.results

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting CreatorHub Backend API Tests")
        print(f"Testing against: {BACKEND_URL}")
        print("=" * 60)
        
        # Run basic tests first
        self.test_health_check()
        self.test_environment_variables()
        self.test_youtube_trending()
        self.test_youtube_search()
        self.test_youtube_channel_stats()
        self.test_content_generation()
        
        # Test analytics dashboard without connected channels first
        self.test_analytics_dashboard()
        
        print("\n🔗 Testing YouTube Channel Connection Features")
        print("-" * 60)
        
        # Test channel connection with different formats
        channel_id_1 = self.test_channel_connection_channel_id()
        channel_id_2 = self.test_channel_connection_url_formats()
        channel_id_3 = self.test_channel_connection_handle()
        
        # Test channel management
        self.test_get_connected_channels()
        
        # Use the first successfully connected channel for further tests
        test_channel_id = channel_id_1 or channel_id_2 or channel_id_3
        
        if test_channel_id:
            self.test_set_primary_channel(test_channel_id)
            
            # Test analytics dashboard with connected channel
            self.test_analytics_dashboard_with_connected_channel()
            
            # Test disconnection (cleanup)
            self.test_disconnect_channel(test_channel_id)
        
        # Test error handling
        self.test_channel_connection_error_handling()
        
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