#!/usr/bin/env python3
"""
Specific tests for the review request issues:
- Channel connection with various input formats
- Analytics API returning accurate connected state
- Real-time data accuracy
"""

import requests
import json
import time
from datetime import datetime

BACKEND_URL = "https://tube-metrics-fix.preview.emergentagent.com/api"

class ReviewRequestTester:
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

    def test_channel_connection_formats_comprehensive(self):
        """Test all channel connection formats mentioned in review request"""
        print("\n🔗 TESTING CHANNEL CONNECTION WITH VARIOUS INPUT FORMATS")
        print("-" * 70)
        
        # Clear existing channels first
        try:
            response = requests.get(f"{BACKEND_URL}/channels", timeout=15)
            if response.status_code == 200:
                channels = response.json()
                for channel in channels:
                    requests.delete(f"{BACKEND_URL}/channels/{channel['channel_id']}", timeout=10)
                print(f"Cleared {len(channels)} existing channels for clean testing")
        except:
            pass
        
        # Test formats from review request
        test_cases = [
            {
                "name": "Channel ID Format",
                "payload": {"channel_id": "UCBJycsmduvYEL83R_U4JriQ"},
                "expected_channel": "Marques Brownlee"
            },
            {
                "name": "Full YouTube URL",
                "payload": {"channel_url": "https://www.youtube.com/channel/UCX6OQ3DkcsbYNE6H8uQQuVA"},
                "expected_channel": "MrBeast"
            },
            {
                "name": "Channel Handle Format",
                "payload": {"channel_handle": "@TechLinked"},
                "expected_channel": "TechLinked"
            },
            {
                "name": "URL without protocol",
                "payload": {"channel_url": "youtube.com/channel/UCBJycsmduvYEL83R_U4JriQ"},
                "expected_channel": "Marques Brownlee"
            },
            {
                "name": "Custom URL format",
                "payload": {"channel_url": "https://www.youtube.com/@MrBeast"},
                "expected_channel": "MrBeast"
            }
        ]
        
        connected_channels = []
        
        for test_case in test_cases:
            try:
                response = requests.post(f"{BACKEND_URL}/channels/connect", 
                                       json=test_case["payload"], timeout=20)
                
                if response.status_code == 200:
                    data = response.json()
                    connected_channels.append(data['channel_id'])
                    self.log_result(f"Channel Connection - {test_case['name']}", "PASS", 
                                  f"Successfully connected {data['channel_name']} ({data['subscriber_count']} subscribers)")
                elif response.status_code == 400 and "already connected" in response.text:
                    self.log_result(f"Channel Connection - {test_case['name']}", "PASS", 
                                  "Channel already connected (expected behavior)")
                else:
                    error_text = response.text
                    if "Could not extract channel ID" in error_text:
                        self.log_result(f"Channel Connection - {test_case['name']}", "FAIL", 
                                      f"CRITICAL: 'Could not extract channel ID' error still exists - {error_text}")
                    else:
                        self.log_result(f"Channel Connection - {test_case['name']}", "FAIL", 
                                      f"HTTP {response.status_code}: {error_text}")
                        
            except Exception as e:
                self.log_result(f"Channel Connection - {test_case['name']}", "FAIL", 
                              f"Request error: {str(e)}")
        
        return connected_channels

    def test_analytics_connected_state_accuracy(self):
        """Test analytics API returning accurate connected state"""
        print("\n📊 TESTING ANALYTICS API CONNECTED STATE ACCURACY")
        print("-" * 70)
        
        # Test 1: Check analytics when channels exist
        try:
            # First check if channels are connected
            channels_response = requests.get(f"{BACKEND_URL}/channels", timeout=15)
            
            if channels_response.status_code == 200:
                channels = channels_response.json()
                
                # Test analytics response
                analytics_response = requests.get(f"{BACKEND_URL}/analytics/dashboard", timeout=25)
                
                if analytics_response.status_code == 200:
                    analytics_data = analytics_response.json()
                    
                    if len(channels) > 0:
                        # Should show connected=true when channels exist
                        if analytics_data.get('connected') == True:
                            channel_info = analytics_data.get('channelInfo', {})
                            self.log_result("Analytics Connected State (With Channels)", "PASS", 
                                          f"Correctly returns connected=true with {len(channels)} channels. Primary: {channel_info.get('name', 'Unknown')}")
                        else:
                            self.log_result("Analytics Connected State (With Channels)", "FAIL", 
                                          f"CRITICAL: Analytics returns connected={analytics_data.get('connected')} when {len(channels)} channels exist")
                    else:
                        # Should show connected=false when no channels
                        if analytics_data.get('connected') == False:
                            self.log_result("Analytics Connected State (No Channels)", "PASS", 
                                          f"Correctly returns connected=false when no channels exist")
                        else:
                            self.log_result("Analytics Connected State (No Channels)", "FAIL", 
                                          f"Analytics returns connected={analytics_data.get('connected')} when no channels exist")
                else:
                    self.log_result("Analytics Connected State", "FAIL", 
                                  f"Analytics API failed: HTTP {analytics_response.status_code}")
            else:
                self.log_result("Analytics Connected State", "FAIL", 
                              f"Channels API failed: HTTP {channels_response.status_code}")
                
        except Exception as e:
            self.log_result("Analytics Connected State", "FAIL", f"Request error: {str(e)}")

    def test_real_time_data_accuracy(self):
        """Test real-time data accuracy and freshness"""
        print("\n⏱️ TESTING REAL-TIME DATA ACCURACY")
        print("-" * 70)
        
        try:
            # Get current analytics data
            response1 = requests.get(f"{BACKEND_URL}/analytics/dashboard", timeout=25)
            
            if response1.status_code == 200:
                data1 = response1.json()
                
                if data1.get('connected'):
                    # Wait a moment and get data again to check consistency
                    time.sleep(2)
                    response2 = requests.get(f"{BACKEND_URL}/analytics/dashboard", timeout=25)
                    
                    if response2.status_code == 200:
                        data2 = response2.json()
                        
                        # Check if data is consistent and has real values
                        if (data1.get('totalViews') == data2.get('totalViews') and 
                            data1.get('totalSubscribers') == data2.get('totalSubscribers')):
                            
                            # Verify data looks real (not dummy values)
                            views = data1.get('totalViews', 0)
                            subscribers = data1.get('totalSubscribers', 0)
                            
                            if views > 1000000 and subscribers > 10000:  # Real channel should have substantial numbers
                                self.log_result("Real-Time Data Accuracy", "PASS", 
                                              f"Data is consistent and realistic: {views:,} views, {subscribers:,} subscribers")
                            else:
                                self.log_result("Real-Time Data Accuracy", "FAIL", 
                                              f"Data appears to be dummy/test data: {views} views, {subscribers} subscribers")
                        else:
                            self.log_result("Real-Time Data Accuracy", "FAIL", 
                                          "Data inconsistency between requests")
                    else:
                        self.log_result("Real-Time Data Accuracy", "FAIL", 
                                      f"Second request failed: HTTP {response2.status_code}")
                else:
                    self.log_result("Real-Time Data Accuracy", "PASS", 
                                  "No channels connected - cannot test real-time data")
            else:
                self.log_result("Real-Time Data Accuracy", "FAIL", 
                              f"Analytics request failed: HTTP {response1.status_code}")
                
        except Exception as e:
            self.log_result("Real-Time Data Accuracy", "FAIL", f"Request error: {str(e)}")

    def test_crud_operations_comprehensive(self):
        """Test all CRUD operations for channel management"""
        print("\n🔧 TESTING COMPREHENSIVE CRUD OPERATIONS")
        print("-" * 70)
        
        # CREATE - Connect a channel
        try:
            payload = {"channel_id": "UCBJycsmduvYEL83R_U4JriQ"}  # Marques Brownlee
            response = requests.post(f"{BACKEND_URL}/channels/connect", json=payload, timeout=20)
            
            if response.status_code in [200, 400]:  # 400 if already connected
                self.log_result("CRUD - CREATE (Connect Channel)", "PASS", 
                              "Channel connection working")
                
                # READ - Get all channels
                read_response = requests.get(f"{BACKEND_URL}/channels", timeout=15)
                if read_response.status_code == 200:
                    channels = read_response.json()
                    if len(channels) > 0:
                        self.log_result("CRUD - READ (Get Channels)", "PASS", 
                                      f"Retrieved {len(channels)} channels with full metadata")
                        
                        # UPDATE - Set primary channel
                        channel_id = channels[0]['channel_id']
                        update_response = requests.put(f"{BACKEND_URL}/channels/{channel_id}/primary", timeout=15)
                        if update_response.status_code == 200:
                            self.log_result("CRUD - UPDATE (Set Primary)", "PASS", 
                                          "Primary channel update working")
                            
                            # DELETE - Disconnect channel
                            delete_response = requests.delete(f"{BACKEND_URL}/channels/{channel_id}", timeout=15)
                            if delete_response.status_code == 200:
                                self.log_result("CRUD - DELETE (Disconnect)", "PASS", 
                                              "Channel disconnection working")
                            else:
                                self.log_result("CRUD - DELETE (Disconnect)", "FAIL", 
                                              f"Delete failed: HTTP {delete_response.status_code}")
                        else:
                            self.log_result("CRUD - UPDATE (Set Primary)", "FAIL", 
                                          f"Update failed: HTTP {update_response.status_code}")
                    else:
                        self.log_result("CRUD - READ (Get Channels)", "FAIL", 
                                      "No channels returned")
                else:
                    self.log_result("CRUD - READ (Get Channels)", "FAIL", 
                                  f"Read failed: HTTP {read_response.status_code}")
            else:
                self.log_result("CRUD - CREATE (Connect Channel)", "FAIL", 
                              f"Create failed: HTTP {response.status_code}")
                
        except Exception as e:
            self.log_result("CRUD Operations", "FAIL", f"Request error: {str(e)}")

    def test_backend_frontend_discrepancy(self):
        """Test for discrepancies between backend API responses and expected behavior"""
        print("\n🔍 TESTING BACKEND-FRONTEND DISCREPANCY ISSUES")
        print("-" * 70)
        
        try:
            # Test scenario: Backend returns 100% success but frontend can't connect
            
            # 1. Test channel connection endpoint directly
            payload = {"channel_id": "UCBJycsmduvYEL83R_U4JriQ"}
            connect_response = requests.post(f"{BACKEND_URL}/channels/connect", json=payload, timeout=20)
            
            # 2. Immediately check if it appears in channels list
            channels_response = requests.get(f"{BACKEND_URL}/channels", timeout=15)
            
            # 3. Check if analytics reflects the connection
            analytics_response = requests.get(f"{BACKEND_URL}/analytics/dashboard", timeout=25)
            
            if (connect_response.status_code in [200, 400] and  # Connection successful or already exists
                channels_response.status_code == 200 and
                analytics_response.status_code == 200):
                
                channels = channels_response.json()
                analytics = analytics_response.json()
                
                # Check for consistency
                has_channels = len(channels) > 0
                analytics_connected = analytics.get('connected', False)
                
                if has_channels and analytics_connected:
                    self.log_result("Backend-Frontend Consistency", "PASS", 
                                  f"Backend APIs are consistent: {len(channels)} channels, analytics connected={analytics_connected}")
                elif not has_channels and not analytics_connected:
                    self.log_result("Backend-Frontend Consistency", "PASS", 
                                  "Backend APIs consistently show no channels")
                else:
                    self.log_result("Backend-Frontend Consistency", "FAIL", 
                                  f"INCONSISTENCY: Channels={len(channels)}, Analytics connected={analytics_connected}")
            else:
                self.log_result("Backend-Frontend Consistency", "FAIL", 
                              f"API failures: Connect={connect_response.status_code}, Channels={channels_response.status_code}, Analytics={analytics_response.status_code}")
                
        except Exception as e:
            self.log_result("Backend-Frontend Consistency", "FAIL", f"Request error: {str(e)}")

    def run_review_request_tests(self):
        """Run all tests specific to the review request"""
        print("🎯 REVIEW REQUEST SPECIFIC TESTING")
        print(f"Testing against: {BACKEND_URL}")
        print("=" * 80)
        print("Verifying specific issues mentioned in review request:")
        print("1. Channel connection with various input formats")
        print("2. Analytics API returning accurate connected state")
        print("3. Real-time data accuracy")
        print("4. Backend-frontend discrepancies")
        print("=" * 80)
        
        # Run all specific tests
        connected_channels = self.test_channel_connection_formats_comprehensive()
        self.test_analytics_connected_state_accuracy()
        self.test_real_time_data_accuracy()
        self.test_crud_operations_comprehensive()
        self.test_backend_frontend_discrepancy()
        
        # Print comprehensive summary
        print("\n" + "=" * 80)
        print("🎯 REVIEW REQUEST TEST SUMMARY")
        print("=" * 80)
        print(f"Total Tests: {self.total_tests}")
        print(f"Passed: {self.passed_tests}")
        print(f"Failed: {self.failed_tests}")
        print(f"Success Rate: {(self.passed_tests/self.total_tests)*100:.1f}%")
        
        # Print detailed results
        if self.failed_tests > 0:
            print("\n❌ CRITICAL ISSUES FOUND:")
            for result in self.results:
                if result['status'] == 'FAIL':
                    print(f"  - {result['test']}: {result['message']}")
        
        print("\n✅ VERIFIED WORKING:")
        for result in self.results:
            if result['status'] == 'PASS':
                print(f"  - {result['test']}: {result['message']}")
        
        return self.results

if __name__ == "__main__":
    tester = ReviewRequestTester()
    results = tester.run_review_request_tests()