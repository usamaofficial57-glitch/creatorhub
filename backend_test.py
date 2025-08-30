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
BACKEND_URL = "https://revenue-fix.preview.emergentagent.com/api"

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

    def test_multi_channel_scenarios(self):
        """Test comprehensive multi-channel scenarios"""
        print("\n🔄 MULTI-CHANNEL SCENARIO TESTING")
        print("-" * 60)
        
        # Connect multiple channels with different formats
        print("Connecting multiple channels...")
        channel_ids = []
        
        # Channel 1: Marques Brownlee (Channel ID format)
        channel_id_1 = self.test_channel_connection_channel_id()
        if channel_id_1:
            channel_ids.append(channel_id_1)
        
        # Channel 2: MrBeast (URL format)  
        channel_id_2 = self.test_channel_connection_url_formats()
        if channel_id_2:
            channel_ids.append(channel_id_2)
        
        # Channel 3: Handle format (try another channel)
        try:
            payload = {"channel_handle": "@TechLinked"}
            response = requests.post(f"{BACKEND_URL}/channels/connect", json=payload, timeout=20)
            if response.status_code == 200:
                data = response.json()
                channel_ids.append(data['channel_id'])
                self.log_result("Multi-Channel Connection (Handle)", "PASS", 
                              f"Connected {data['channel_name']} via handle")
            elif response.status_code == 400 and "already connected" in response.text:
                self.log_result("Multi-Channel Connection (Handle)", "PASS", 
                              "Channel already connected (expected)")
        except Exception as e:
            self.log_result("Multi-Channel Connection (Handle)", "FAIL", f"Error: {str(e)}")
        
        # Test switching primary channels
        if len(channel_ids) >= 2:
            print(f"\nTesting primary channel switching with {len(channel_ids)} channels...")
            for i, channel_id in enumerate(channel_ids[:2]):  # Test first 2 channels
                self.test_set_primary_channel(channel_id)
                time.sleep(1)  # Brief pause between switches
                
                # Verify dashboard shows correct primary channel
                try:
                    response = requests.get(f"{BACKEND_URL}/analytics/dashboard", timeout=20)
                    if response.status_code == 200:
                        data = response.json()
                        if data.get('connected') and data.get('channelInfo'):
                            self.log_result(f"Primary Channel Switch {i+1}", "PASS", 
                                          f"Dashboard shows primary channel: {data['channelInfo']['name']}")
                        else:
                            self.log_result(f"Primary Channel Switch {i+1}", "FAIL", 
                                          "Dashboard not showing connected channel")
                except Exception as e:
                    self.log_result(f"Primary Channel Switch {i+1}", "FAIL", f"Error: {str(e)}")
        
        # Test disconnecting individual channels
        if len(channel_ids) >= 2:
            print(f"\nTesting individual channel disconnection...")
            # Disconnect the last connected channel
            self.test_disconnect_channel(channel_ids[-1])
            
            # Verify remaining channels still work
            try:
                response = requests.get(f"{BACKEND_URL}/channels", timeout=15)
                if response.status_code == 200:
                    remaining_channels = response.json()
                    self.log_result("Post-Disconnect Channel List", "PASS", 
                                  f"Remaining channels: {len(remaining_channels)}")
                    
                    # Verify dashboard still works with remaining channels
                    response = requests.get(f"{BACKEND_URL}/analytics/dashboard", timeout=20)
                    if response.status_code == 200:
                        data = response.json()
                        if data.get('connected'):
                            self.log_result("Post-Disconnect Dashboard", "PASS", 
                                          "Dashboard still functional after channel disconnect")
                        else:
                            self.log_result("Post-Disconnect Dashboard", "PASS", 
                                          "Dashboard correctly shows no channels after disconnect")
            except Exception as e:
                self.log_result("Post-Disconnect Verification", "FAIL", f"Error: {str(e)}")
    
    def test_comprehensive_error_handling(self):
        """Test comprehensive error handling scenarios"""
        print("\n⚠️ ERROR HANDLING TESTING")
        print("-" * 60)
        
        # Test invalid channel ID
        try:
            payload = {"channel_id": "INVALID_CHANNEL_ID_12345"}
            response = requests.post(f"{BACKEND_URL}/channels/connect", json=payload, timeout=15)
            if response.status_code in [400, 404]:
                self.log_result("Invalid Channel ID Error", "PASS", 
                              f"Correctly handled invalid channel ID: {response.status_code}")
            else:
                self.log_result("Invalid Channel ID Error", "FAIL", 
                              f"Unexpected response: {response.status_code}")
        except Exception as e:
            self.log_result("Invalid Channel ID Error", "FAIL", f"Request error: {str(e)}")
        
        # Test malformed URL
        try:
            payload = {"channel_url": "not-a-valid-url"}
            response = requests.post(f"{BACKEND_URL}/channels/connect", json=payload, timeout=15)
            if response.status_code in [400, 404]:
                self.log_result("Malformed URL Error", "PASS", 
                              f"Correctly handled malformed URL: {response.status_code}")
            else:
                self.log_result("Malformed URL Error", "FAIL", 
                              f"Unexpected response: {response.status_code}")
        except Exception as e:
            self.log_result("Malformed URL Error", "FAIL", f"Request error: {str(e)}")
        
        # Test non-existent channel handle
        try:
            payload = {"channel_handle": "@NonExistentChannelHandle12345"}
            response = requests.post(f"{BACKEND_URL}/channels/connect", json=payload, timeout=15)
            if response.status_code in [400, 404]:
                self.log_result("Non-existent Handle Error", "PASS", 
                              f"Correctly handled non-existent handle: {response.status_code}")
            else:
                self.log_result("Non-existent Handle Error", "FAIL", 
                              f"Unexpected response: {response.status_code}")
        except Exception as e:
            self.log_result("Non-existent Handle Error", "FAIL", f"Request error: {str(e)}")
        
        # Test duplicate connection (connect same channel twice)
        try:
            # First connection
            payload = {"channel_id": "UCBJycsmduvYEL83R_U4JriQ"}  # Marques Brownlee
            response1 = requests.post(f"{BACKEND_URL}/channels/connect", json=payload, timeout=15)
            
            # Second connection (should fail)
            response2 = requests.post(f"{BACKEND_URL}/channels/connect", json=payload, timeout=15)
            
            if response2.status_code == 400 and "already connected" in response2.text.lower():
                self.log_result("Duplicate Connection Error", "PASS", 
                              "Correctly prevented duplicate channel connection")
            else:
                self.log_result("Duplicate Connection Error", "FAIL", 
                              f"Unexpected response for duplicate: {response2.status_code}")
        except Exception as e:
            self.log_result("Duplicate Connection Error", "FAIL", f"Request error: {str(e)}")
        
        # Test operations on non-existent channel
        try:
            fake_channel_id = "NON_EXISTENT_CHANNEL_ID"
            response = requests.put(f"{BACKEND_URL}/channels/{fake_channel_id}/primary", timeout=15)
            if response.status_code == 404:
                self.log_result("Non-existent Channel Primary", "PASS", 
                              "Correctly handled setting primary on non-existent channel")
            else:
                self.log_result("Non-existent Channel Primary", "FAIL", 
                              f"Unexpected response: {response.status_code}")
        except Exception as e:
            self.log_result("Non-existent Channel Primary", "FAIL", f"Request error: {str(e)}")
        
        # Test delete non-existent channel
        try:
            fake_channel_id = "NON_EXISTENT_CHANNEL_ID"
            response = requests.delete(f"{BACKEND_URL}/channels/{fake_channel_id}", timeout=15)
            if response.status_code == 404:
                self.log_result("Non-existent Channel Delete", "PASS", 
                              "Correctly handled deleting non-existent channel")
            else:
                self.log_result("Non-existent Channel Delete", "FAIL", 
                              f"Unexpected response: {response.status_code}")
        except Exception as e:
            self.log_result("Non-existent Channel Delete", "FAIL", f"Request error: {str(e)}")

    def test_revenue_calculation_with_existing_channels(self):
        """Test revenue calculation system with existing connected channels"""
        print("\n💰 TESTING REVENUE CALCULATION WITH EXISTING CHANNELS")
        print("-" * 60)
        
        try:
            # Get current connected channels
            channels_response = requests.get(f"{BACKEND_URL}/channels", timeout=15)
            
            if channels_response.status_code == 200:
                channels = channels_response.json()
                
                if len(channels) > 0:
                    print(f"Found {len(channels)} connected channels")
                    
                    for channel in channels:
                        channel_name = channel.get('channel_name', 'Unknown')
                        subscriber_count = channel.get('subscriber_count', 0)
                        view_count = channel.get('view_count', 0)
                        
                        print(f"Channel: {channel_name}")
                        print(f"  Subscribers: {subscriber_count:,}")
                        print(f"  Total Views: {view_count:,}")
                        
                        # Set this channel as primary to test revenue calculation
                        primary_response = requests.put(f"{BACKEND_URL}/channels/{channel['channel_id']}/primary", timeout=15)
                        
                        if primary_response.status_code == 200:
                            print(f"  Set as primary channel: ✅")
                            
                            # Test dashboard analytics (this should work even with quota issues if channel data is cached)
                            dashboard_response = requests.get(f"{BACKEND_URL}/analytics/dashboard", timeout=25)
                            
                            if dashboard_response.status_code == 200:
                                data = dashboard_response.json()
                                
                                # Check if we have revenue details
                                if 'revenueDetails' in data and data.get('connected'):
                                    revenue_details = data['revenueDetails']
                                    
                                    # Verify all required fields are present
                                    required_fields = [
                                        'estimatedMonthlyViews', 'rpm', 'baseRpm', 'category',
                                        'geographyMultiplier', 'sizeMultiplier', 'breakdown'
                                    ]
                                    
                                    missing_fields = [field for field in required_fields if field not in revenue_details]
                                    
                                    if not missing_fields:
                                        self.log_result(f"Enhanced Revenue System - {channel_name}", "PASS",
                                                      f"All revenue fields present: RPM ${revenue_details['rpm']:.2f}, "
                                                      f"Category: {revenue_details['category']}, "
                                                      f"Monthly Revenue: ${data.get('revenueThisMonth', 0):,}",
                                                      revenue_details)
                                        
                                        # Verify the revenue is realistic (not the old $50k cap)
                                        monthly_revenue = data.get('revenueThisMonth', 0)
                                        if monthly_revenue > 50000:
                                            self.log_result(f"Revenue Realism - {channel_name}", "PASS",
                                                          f"Revenue exceeds old $50k cap: ${monthly_revenue:,}")
                                        elif monthly_revenue > 0:
                                            self.log_result(f"Revenue Realism - {channel_name}", "PASS",
                                                          f"Realistic revenue calculated: ${monthly_revenue:,}")
                                        else:
                                            self.log_result(f"Revenue Realism - {channel_name}", "FAIL",
                                                          "Revenue is zero or negative")
                                        
                                        # Verify RPM calculation components
                                        base_rpm = revenue_details.get('baseRpm', 0)
                                        geo_multiplier = revenue_details.get('geographyMultiplier', 1)
                                        size_multiplier = revenue_details.get('sizeMultiplier', 1)
                                        final_rpm = revenue_details.get('rpm', 0)
                                        
                                        expected_rpm = base_rpm * geo_multiplier * size_multiplier
                                        rpm_diff = abs(final_rpm - expected_rpm)
                                        
                                        if rpm_diff < 0.01:
                                            self.log_result(f"RPM Calculation - {channel_name}", "PASS",
                                                          f"Accurate: ${base_rpm:.2f} × {geo_multiplier:.2f} × {size_multiplier:.2f} = ${final_rpm:.2f}")
                                        else:
                                            self.log_result(f"RPM Calculation - {channel_name}", "FAIL",
                                                          f"Mismatch: expected ${expected_rpm:.2f}, got ${final_rpm:.2f}")
                                        
                                        # Verify industry-standard RPM rates
                                        category = revenue_details.get('category', '').lower()
                                        expected_base_rpms = {
                                            'finance': 8.50, 'technology': 6.20, 'education': 4.80,
                                            'gaming': 2.20, 'entertainment': 1.80
                                        }
                                        
                                        category_found = False
                                        for cat_key, expected_rpm in expected_base_rpms.items():
                                            if cat_key in category:
                                                category_found = True
                                                if abs(base_rpm - expected_rpm) < 0.01:
                                                    self.log_result(f"Industry RPM - {channel_name}", "PASS",
                                                                  f"Correct base RPM for {category}: ${base_rpm:.2f}")
                                                else:
                                                    self.log_result(f"Industry RPM - {channel_name}", "FAIL",
                                                                  f"Incorrect base RPM for {category}: expected ${expected_rpm:.2f}, got ${base_rpm:.2f}")
                                                break
                                        
                                        if not category_found:
                                            self.log_result(f"Industry RPM - {channel_name}", "INFO",
                                                          f"Category '{category}' not in standard list, base RPM: ${base_rpm:.2f}")
                                        
                                        # Verify breakdown format
                                        breakdown = revenue_details.get('breakdown', '')
                                        if 'views' in breakdown and 'RPM' in breakdown and '$' in breakdown:
                                            self.log_result(f"Revenue Breakdown - {channel_name}", "PASS",
                                                          f"Proper format: {breakdown}")
                                        else:
                                            self.log_result(f"Revenue Breakdown - {channel_name}", "FAIL",
                                                          f"Invalid format: {breakdown}")
                                            
                                    else:
                                        self.log_result(f"Enhanced Revenue System - {channel_name}", "FAIL",
                                                      f"Missing revenue fields: {missing_fields}")
                                        
                                elif data.get('connected') == False:
                                    self.log_result(f"Enhanced Revenue System - {channel_name}", "INFO",
                                                  f"Dashboard shows disconnected state: {data.get('message', 'No message')}")
                                else:
                                    self.log_result(f"Enhanced Revenue System - {channel_name}", "FAIL",
                                                  "Missing revenueDetails in connected dashboard response")
                            else:
                                self.log_result(f"Enhanced Revenue System - {channel_name}", "FAIL",
                                              f"Dashboard request failed: {dashboard_response.status_code}")
                        else:
                            self.log_result(f"Set Primary Channel - {channel_name}", "FAIL",
                                          f"Failed to set primary: {primary_response.status_code}")
                else:
                    self.log_result("Enhanced Revenue System", "INFO", "No channels connected to test")
            else:
                self.log_result("Enhanced Revenue System", "FAIL", f"Failed to get channels: {channels_response.status_code}")
                
        except Exception as e:
            self.log_result("Enhanced Revenue System", "FAIL", f"Test error: {str(e)}")

    def test_enhanced_revenue_calculation_system(self):
        """Test the new enhanced monthly revenue calculation system"""
        print("\n💰 ENHANCED REVENUE CALCULATION SYSTEM TESTING")
        print("-" * 60)
        
        # First test with existing channels to avoid quota issues
        self.test_revenue_calculation_with_existing_channels()
        
        # Test different channel types for revenue calculation comparison (if quota allows)
        test_channels = [
            {
                "name": "MrBeast (Entertainment/Gaming)",
                "channel_id": "UCX6OQ3DkcsbYNE6H8uQQuVA",
                "expected_category": "entertainment",
                "expected_high_revenue": True
            },
            {
                "name": "Marques Brownlee (Tech)",
                "channel_id": "UCBJycsmduvYEL83R_U4JriQ", 
                "expected_category": "tech",
                "expected_high_revenue": True
            }
        ]
        
        revenue_results = []
        
        for channel_info in test_channels:
            try:
                # Connect the channel
                payload = {"channel_id": channel_info["channel_id"]}
                connect_response = requests.post(f"{BACKEND_URL}/channels/connect", 
                                               json=payload, timeout=20)
                
                if connect_response.status_code in [200, 400]:  # 400 if already connected
                    # Set as primary channel
                    requests.put(f"{BACKEND_URL}/channels/{channel_info['channel_id']}/primary", timeout=15)
                    
                    # Get dashboard analytics with revenue details
                    dashboard_response = requests.get(f"{BACKEND_URL}/analytics/dashboard", timeout=25)
                    
                    if dashboard_response.status_code == 200:
                        data = dashboard_response.json()
                        
                        if data.get('connected') and 'revenueDetails' in data:
                            revenue_details = data['revenueDetails']
                            
                            # Verify all required revenue detail fields are present
                            required_fields = [
                                'estimatedMonthlyViews', 'rpm', 'baseRpm', 'category',
                                'geographyMultiplier', 'sizeMultiplier', 'breakdown'
                            ]
                            
                            missing_fields = [field for field in required_fields if field not in revenue_details]
                            
                            if not missing_fields:
                                revenue_results.append({
                                    "channel": channel_info["name"],
                                    "channel_id": channel_info["channel_id"],
                                    "revenue": data.get('revenueThisMonth', 0),
                                    "details": revenue_details,
                                    "total_views": data.get('totalViews', 0),
                                    "subscribers": data.get('totalSubscribers', 0)
                                })
                                
                                self.log_result(f"Revenue Calculation - {channel_info['name']}", "PASS",
                                              f"Revenue: ${revenue_details.get('rpm', 0):.2f} RPM, "
                                              f"Category: {revenue_details.get('category', 'Unknown')}, "
                                              f"Monthly: ${data.get('revenueThisMonth', 0):,}",
                                              revenue_details)
                            else:
                                self.log_result(f"Revenue Calculation - {channel_info['name']}", "FAIL",
                                              f"Missing revenue detail fields: {missing_fields}")
                        else:
                            self.log_result(f"Revenue Calculation - {channel_info['name']}", "INFO",
                                          f"Dashboard response: connected={data.get('connected')}, has_revenueDetails={'revenueDetails' in data}")
                    else:
                        self.log_result(f"Revenue Calculation - {channel_info['name']}", "FAIL",
                                      f"Dashboard request failed: {dashboard_response.status_code}")
                elif connect_response.status_code == 500:
                    # Likely quota exceeded
                    self.log_result(f"Revenue Calculation - {channel_info['name']}", "INFO",
                                  "Skipped due to YouTube API quota exceeded")
                else:
                    self.log_result(f"Revenue Calculation - {channel_info['name']}", "FAIL",
                                  f"Channel connection failed: {connect_response.status_code}")
                    
            except Exception as e:
                self.log_result(f"Revenue Calculation - {channel_info['name']}", "FAIL",
                              f"Request error: {str(e)}")
        
        # Compare revenue calculations between different channel types
        if len(revenue_results) >= 2:
            try:
                mrBeast_result = next((r for r in revenue_results if "MrBeast" in r["channel"]), None)
                marques_result = next((r for r in revenue_results if "Marques" in r["channel"]), None)
                
                if mrBeast_result and marques_result:
                    mrBeast_rpm = mrBeast_result["details"]["rpm"]
                    marques_rpm = marques_result["details"]["rpm"]
                    
                    # Verify different RPM calculations based on channel category
                    if mrBeast_rpm != marques_rpm:
                        self.log_result("Revenue RPM Differentiation", "PASS",
                                      f"Different RPM rates: MrBeast ${mrBeast_rpm:.2f} vs Marques ${marques_rpm:.2f}")
                    else:
                        self.log_result("Revenue RPM Differentiation", "FAIL",
                                      "RPM rates are identical for different channel types")
                    
                    # Verify revenue amounts are realistic (not the old $50k max system)
                    mrBeast_revenue = mrBeast_result["revenue"]
                    marques_revenue = marques_result["revenue"]
                    
                    # Check if revenues are different and realistic
                    if mrBeast_revenue > 50000 or marques_revenue > 50000:
                        self.log_result("Revenue Realism Check", "PASS",
                                      f"Revenue exceeds old $50k cap: MrBeast ${mrBeast_revenue:,}, Marques ${marques_revenue:,}")
                    elif mrBeast_revenue != marques_revenue:
                        self.log_result("Revenue Realism Check", "PASS",
                                      f"Different realistic revenues: MrBeast ${mrBeast_revenue:,}, Marques ${marques_revenue:,}")
                    else:
                        self.log_result("Revenue Realism Check", "FAIL",
                                      "Revenue calculations appear to be using old system")
                        
            except Exception as e:
                self.log_result("Revenue Comparison Analysis", "FAIL", f"Analysis error: {str(e)}")

    def test_dashboard_state_management(self):
        """Test dashboard analytics in different states"""
        print("\n📊 DASHBOARD STATE MANAGEMENT TESTING")
        print("-" * 60)
        
        # Test dashboard with no channels
        try:
            # First ensure no channels are connected
            response = requests.get(f"{BACKEND_URL}/channels", timeout=15)
            if response.status_code == 200:
                channels = response.json()
                # Disconnect all channels for clean test
                for channel in channels:
                    requests.delete(f"{BACKEND_URL}/channels/{channel['channel_id']}", timeout=10)
            
            # Test dashboard with no channels
            response = requests.get(f"{BACKEND_URL}/analytics/dashboard", timeout=20)
            if response.status_code == 200:
                data = response.json()
                if data.get('connected') == False and 'message' in data:
                    self.log_result("Dashboard No Channels State", "PASS", 
                                  f"Correct no-channels state: {data['message']}")
                else:
                    self.log_result("Dashboard No Channels State", "FAIL", 
                                  f"Unexpected no-channels response: {data}")
        except Exception as e:
            self.log_result("Dashboard No Channels State", "FAIL", f"Error: {str(e)}")
        
        # Connect a channel and test dashboard with connection
        try:
            payload = {"channel_id": "UCBJycsmduvYEL83R_U4JriQ"}  # Marques Brownlee
            response = requests.post(f"{BACKEND_URL}/channels/connect", json=payload, timeout=20)
            
            if response.status_code in [200, 400]:  # 400 if already connected
                # Test dashboard with connected channel
                response = requests.get(f"{BACKEND_URL}/analytics/dashboard", timeout=25)
                if response.status_code == 200:
                    data = response.json()
                    if data.get('connected') == True and data.get('channelInfo'):
                        channel_info = data['channelInfo']
                        self.log_result("Dashboard Connected State", "PASS", 
                                      f"Connected state: {channel_info['name']} - {data['totalViews']} views")
                    else:
                        self.log_result("Dashboard Connected State", "FAIL", 
                                      f"Invalid connected state response: {data}")
                else:
                    self.log_result("Dashboard Connected State", "FAIL", 
                                  f"Dashboard request failed: {response.status_code}")
        except Exception as e:
            self.log_result("Dashboard Connected State", "FAIL", f"Error: {str(e)}")

    def run_focused_tests(self):
        """Run focused tests for the review request issues"""
        print("🎯 ENHANCED REVENUE CALCULATION SYSTEM TESTING")
        print(f"Testing against: {BACKEND_URL}")
        print("=" * 80)
        
        # 1. Check current database state
        print("\n1️⃣ Checking current database state...")
        existing_channels = self.test_database_state_check()
        
        # 2. Test enhanced revenue calculation system (PRIMARY FOCUS)
        self.test_enhanced_revenue_calculation_system()
        
        # 3. Test dashboard state management
        self.test_dashboard_state_management()
        
        # 4. Test basic channel connection formats
        print("\n4️⃣ Testing channel connection formats...")
        channel_id_1 = self.test_channel_connection_channel_id()  # Marques Brownlee
        channel_id_2 = self.test_channel_connection_url_formats()  # MrBeast
        channel_id_3 = self.test_channel_connection_handle()  # Handle format
        
        # 5. Test channel management operations
        print("\n5️⃣ Testing channel management operations...")
        self.test_get_connected_channels()
        
        # 6. Test analytics dashboard with connected channels
        print("\n6️⃣ Testing analytics dashboard with connected channels...")
        self.test_analytics_dashboard_with_connected_channel()
        
        # 7. Test basic API functionality
        print("\n7️⃣ Testing basic API functionality...")
        self.test_health_check()
        self.test_youtube_channel_stats()
        
        # Print comprehensive summary
        print("\n" + "=" * 80)
        print("🎯 ENHANCED REVENUE CALCULATION TEST SUMMARY")
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
    
    # Check if we should run focused tests
    if len(sys.argv) > 1 and sys.argv[1] == "--focused":
        results = tester.run_focused_tests()
    else:
        results = tester.run_all_tests()
    
    # Exit with error code if tests failed
    sys.exit(0 if tester.failed_tests == 0 else 1)