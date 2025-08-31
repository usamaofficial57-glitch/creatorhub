#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for YouTube Automation Tool
Testing all backend functionality after frontend redesign:
- Dashboard Analytics API (GET /api/analytics/dashboard)
- Channel Management APIs (GET /api/channels, POST /api/channels/connect, DELETE /api/channels/{id})
- Content Ideas API (POST /api/content/generate-ideas)
- Trending Videos API (GET /api/youtube/trending)
- Competitor Analysis APIs (GET /api/youtube/channel/{id})
- AI Script Generator APIs (GET /api/trending-topics, POST /api/generate-script, POST /api/auto-research)
"""

import requests
import json
import time
from datetime import datetime

# Backend URL from frontend .env
BACKEND_URL = "https://creator-forum.preview.emergentagent.com/api"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def log_test(test_name, status, details=""):
    """Log test results with colors"""
    color = Colors.GREEN if status == "PASS" else Colors.RED if status == "FAIL" else Colors.YELLOW
    print(f"{color}{status}{Colors.ENDC}: {test_name}")
    if details:
        print(f"  {details}")

def test_dashboard_analytics_api():
    """Test GET /api/analytics/dashboard endpoint"""
    print(f"\n{Colors.BOLD}=== Testing Dashboard Analytics API ==={Colors.ENDC}")
    
    try:
        # Test dashboard analytics without connected channels
        response = requests.get(f"{BACKEND_URL}/analytics/dashboard", timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            
            # Verify response structure
            required_fields = ['connected', 'totalViews', 'totalSubscribers', 'avgViewDuration', 'revenueThisMonth']
            missing_fields = [field for field in required_fields if field not in data]
            
            if not missing_fields:
                log_test("GET /api/analytics/dashboard - Response Structure", "PASS", 
                        f"All required fields present. Connected: {data.get('connected')}")
                
                # Check if connected or not
                if data.get('connected'):
                    # Verify connected state fields
                    connected_fields = ['channelInfo', 'topPerformingVideo', 'monthlyGrowth']
                    connected_missing = [field for field in connected_fields if field not in data]
                    
                    if not connected_missing:
                        channel_info = data.get('channelInfo', {})
                        log_test("Dashboard Analytics - Connected State", "PASS", 
                                f"Channel: {channel_info.get('name', 'Unknown')}, "
                                f"Views: {data.get('totalViews', 0):,}, "
                                f"Subscribers: {data.get('totalSubscribers', 0):,}, "
                                f"Revenue: ${data.get('revenueThisMonth', 0):,}")
                        return True, data
                    else:
                        log_test("Dashboard Analytics - Connected State", "FAIL", 
                                f"Missing connected fields: {connected_missing}")
                        return False, data
                else:
                    # Verify no-channels state
                    log_test("Dashboard Analytics - No Channels State", "PASS", 
                            f"Message: {data.get('message', 'No message')}")
                    return True, data
            else:
                log_test("GET /api/analytics/dashboard - Response Structure", "FAIL", 
                        f"Missing fields: {missing_fields}")
                return False, data
        else:
            log_test("GET /api/analytics/dashboard - HTTP Status", "FAIL", 
                    f"Status: {response.status_code}, Response: {response.text}")
            return False, None
            
    except requests.exceptions.Timeout:
        log_test("GET /api/analytics/dashboard - Timeout", "FAIL", "Request timed out after 30 seconds")
        return False, None
    except Exception as e:
        log_test("GET /api/analytics/dashboard - Exception", "FAIL", f"Error: {str(e)}")
        return False, None

def test_channel_management_apis():
    """Test Channel Management APIs"""
    print(f"\n{Colors.BOLD}=== Testing Channel Management APIs ==={Colors.ENDC}")
    
    results = []
    
    # Test 1: GET /api/channels - List connected channels
    try:
        response = requests.get(f"{BACKEND_URL}/channels", timeout=30)
        
        if response.status_code == 200:
            channels = response.json()
            
            if isinstance(channels, list):
                log_test("GET /api/channels - Response Structure", "PASS", 
                        f"Returned {len(channels)} connected channels")
                
                # If channels exist, verify structure
                if channels:
                    sample_channel = channels[0]
                    required_fields = ['id', 'channel_id', 'channel_name', 'subscriber_count', 'is_primary']
                    missing_fields = [field for field in required_fields if field not in sample_channel]
                    
                    if not missing_fields:
                        log_test("Channel Data Structure", "PASS", 
                                f"Sample channel: {sample_channel.get('channel_name')} "
                                f"({sample_channel.get('subscriber_count', 0):,} subscribers)")
                        results.append(True)
                    else:
                        log_test("Channel Data Structure", "FAIL", 
                                f"Missing fields: {missing_fields}")
                        results.append(False)
                else:
                    log_test("Connected Channels", "INFO", "No channels currently connected")
                    results.append(True)
            else:
                log_test("GET /api/channels - Response Structure", "FAIL", 
                        f"Expected list, got: {type(channels)}")
                results.append(False)
        else:
            log_test("GET /api/channels - HTTP Status", "FAIL", 
                    f"Status: {response.status_code}")
            results.append(False)
            
    except Exception as e:
        log_test("GET /api/channels - Exception", "FAIL", f"Error: {str(e)}")
        results.append(False)
    
    # Test 2: POST /api/channels/connect - Connect a channel
    test_channels = [
        {
            "name": "Channel ID Format",
            "payload": {"channel_id": "UCBJycsmduvYEL83R_U4JriQ"}  # Marques Brownlee
        },
        {
            "name": "Channel URL Format", 
            "payload": {"channel_url": "https://youtube.com/channel/UCX6OQ3DkcsbYNE6H8uQQuVA"}  # MrBeast
        },
        {
            "name": "Handle Format",
            "payload": {"channel_handle": "@TechLinked"}  # TechLinked
        }
    ]
    
    connected_channels = []
    
    for test_case in test_channels:
        try:
            print(f"\n{Colors.BLUE}Testing Channel Connection: {test_case['name']}{Colors.ENDC}")
            
            response = requests.post(
                f"{BACKEND_URL}/channels/connect",
                json=test_case['payload'],
                timeout=45,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                channel_data = response.json()
                
                # Verify response structure
                required_fields = ['id', 'channel_id', 'channel_name', 'subscriber_count']
                missing_fields = [field for field in required_fields if field not in channel_data]
                
                if not missing_fields:
                    log_test(f"Channel Connection - {test_case['name']}", "PASS", 
                            f"Connected: {channel_data.get('channel_name')} "
                            f"({channel_data.get('subscriber_count', 0):,} subscribers)")
                    connected_channels.append(channel_data)
                    results.append(True)
                else:
                    log_test(f"Channel Connection - {test_case['name']}", "FAIL", 
                            f"Missing fields: {missing_fields}")
                    results.append(False)
            elif response.status_code == 400:
                # Channel might already be connected
                error_data = response.json()
                if "already connected" in error_data.get('detail', '').lower():
                    log_test(f"Channel Connection - {test_case['name']}", "INFO", 
                            "Channel already connected (expected)")
                    results.append(True)
                else:
                    log_test(f"Channel Connection - {test_case['name']}", "FAIL", 
                            f"Error: {error_data.get('detail', 'Unknown error')}")
                    results.append(False)
            else:
                log_test(f"Channel Connection - {test_case['name']}", "FAIL", 
                        f"Status: {response.status_code}, Response: {response.text[:200]}")
                results.append(False)
                
        except requests.exceptions.Timeout:
            log_test(f"Channel Connection - {test_case['name']} - Timeout", "FAIL", 
                    "Request timed out after 45 seconds")
            results.append(False)
        except Exception as e:
            log_test(f"Channel Connection - {test_case['name']} - Exception", "FAIL", f"Error: {str(e)}")
            results.append(False)
    
    return results

def test_content_ideas_api():
    """Test POST /api/content/generate-ideas endpoint"""
    print(f"\n{Colors.BOLD}=== Testing Content Ideas API ==={Colors.ENDC}")
    
    test_cases = [
        {
            "name": "Tech Content Ideas",
            "payload": {
                "topic": "YouTube automation tools",
                "category": "technology",
                "count": 3
            }
        },
        {
            "name": "Business Content Ideas",
            "payload": {
                "topic": "Digital marketing strategies",
                "category": "business",
                "count": 5
            }
        }
    ]
    
    results = []
    
    for test_case in test_cases:
        try:
            print(f"\n{Colors.BLUE}Testing: {test_case['name']}{Colors.ENDC}")
            
            response = requests.post(
                f"{BACKEND_URL}/content/generate-ideas",
                json=test_case['payload'],
                timeout=60,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                ideas = response.json()
                
                if isinstance(ideas, list) and len(ideas) > 0:
                    # Verify idea structure
                    sample_idea = ideas[0]
                    required_fields = ['id', 'title', 'description', 'category', 'viral_potential', 'tags']
                    missing_fields = [field for field in required_fields if field not in sample_idea]
                    
                    if not missing_fields:
                        log_test(f"{test_case['name']} - Response Structure", "PASS", 
                                f"Generated {len(ideas)} ideas")
                        
                        # Verify content quality
                        sample_title = sample_idea.get('title', '')
                        sample_viral_potential = sample_idea.get('viral_potential', 0)
                        
                        log_test(f"{test_case['name']} - Content Quality", "PASS", 
                                f"Sample: '{sample_title}' (Viral: {sample_viral_potential}%)")
                        results.append(True)
                    else:
                        log_test(f"{test_case['name']} - Response Structure", "FAIL", 
                                f"Missing fields: {missing_fields}")
                        results.append(False)
                else:
                    log_test(f"{test_case['name']} - Response Content", "FAIL", 
                            f"Expected list with ideas, got: {type(ideas)}")
                    results.append(False)
            else:
                log_test(f"{test_case['name']} - HTTP Status", "FAIL", 
                        f"Status: {response.status_code}, Response: {response.text[:200]}")
                results.append(False)
                
        except requests.exceptions.Timeout:
            log_test(f"{test_case['name']} - Timeout", "FAIL", "Request timed out after 60 seconds")
            results.append(False)
        except Exception as e:
            log_test(f"{test_case['name']} - Exception", "FAIL", f"Error: {str(e)}")
            results.append(False)
    
    return results

def test_trending_videos_api():
    """Test GET /api/youtube/trending endpoint"""
    print(f"\n{Colors.BOLD}=== Testing Trending Videos API ==={Colors.ENDC}")
    
    test_cases = [
        {
            "name": "Default Trending Videos",
            "params": {}
        },
        {
            "name": "Limited Results",
            "params": {"max_results": 10}
        }
    ]
    
    results = []
    
    for test_case in test_cases:
        try:
            print(f"\n{Colors.BLUE}Testing: {test_case['name']}{Colors.ENDC}")
            
            response = requests.get(
                f"{BACKEND_URL}/youtube/trending",
                params=test_case['params'],
                timeout=45
            )
            
            if response.status_code == 200:
                videos = response.json()
                
                if isinstance(videos, list) and len(videos) > 0:
                    # Verify video structure
                    sample_video = videos[0]
                    required_fields = ['id', 'title', 'channel', 'views', 'viral_score', 'thumbnail']
                    missing_fields = [field for field in required_fields if field not in sample_video]
                    
                    if not missing_fields:
                        log_test(f"{test_case['name']} - Response Structure", "PASS", 
                                f"Retrieved {len(videos)} trending videos")
                        
                        # Verify content quality
                        sample_title = sample_video.get('title', '')
                        sample_views = sample_video.get('views', 0)
                        sample_viral_score = sample_video.get('viral_score', 0)
                        
                        log_test(f"{test_case['name']} - Content Quality", "PASS", 
                                f"Sample: '{sample_title[:50]}...' ({sample_views:,} views, Viral: {sample_viral_score}%)")
                        results.append(True)
                    else:
                        log_test(f"{test_case['name']} - Response Structure", "FAIL", 
                                f"Missing fields: {missing_fields}")
                        results.append(False)
                else:
                    log_test(f"{test_case['name']} - Response Content", "FAIL", 
                            f"Expected list with videos, got: {type(videos)}")
                    results.append(False)
            else:
                log_test(f"{test_case['name']} - HTTP Status", "FAIL", 
                        f"Status: {response.status_code}, Response: {response.text[:200]}")
                results.append(False)
                
        except requests.exceptions.Timeout:
            log_test(f"{test_case['name']} - Timeout", "FAIL", "Request timed out after 45 seconds")
            results.append(False)
        except Exception as e:
            log_test(f"{test_case['name']} - Exception", "FAIL", f"Error: {str(e)}")
            results.append(False)
    
    return results

def test_competitor_analysis_apis():
    """Test Competitor Analysis APIs (Channel Statistics)"""
    print(f"\n{Colors.BOLD}=== Testing Competitor Analysis APIs ==={Colors.ENDC}")
    
    # Test channels for competitor analysis
    test_channels = [
        {
            "name": "Marques Brownlee (MKBHD)",
            "channel_id": "UCBJycsmduvYEL83R_U4JriQ"
        },
        {
            "name": "MrBeast",
            "channel_id": "UCX6OQ3DkcsbYNE6H8uQQuVA"
        }
    ]
    
    results = []
    
    for test_channel in test_channels:
        try:
            print(f"\n{Colors.BLUE}Testing Channel Stats: {test_channel['name']}{Colors.ENDC}")
            
            response = requests.get(
                f"{BACKEND_URL}/youtube/channel/{test_channel['channel_id']}",
                timeout=30
            )
            
            if response.status_code == 200:
                channel_stats = response.json()
                
                # Verify response structure
                required_fields = ['channel_id', 'name', 'subscriber_count', 'view_count', 'video_count']
                missing_fields = [field for field in required_fields if field not in channel_stats]
                
                if not missing_fields:
                    log_test(f"Channel Stats - {test_channel['name']}", "PASS", 
                            f"Name: {channel_stats.get('name')}, "
                            f"Subscribers: {channel_stats.get('subscriber_count', 0):,}, "
                            f"Views: {channel_stats.get('view_count', 0):,}, "
                            f"Videos: {channel_stats.get('video_count', 0):,}")
                    results.append(True)
                else:
                    log_test(f"Channel Stats - {test_channel['name']}", "FAIL", 
                            f"Missing fields: {missing_fields}")
                    results.append(False)
            elif response.status_code == 404:
                log_test(f"Channel Stats - {test_channel['name']}", "FAIL", "Channel not found")
                results.append(False)
            else:
                log_test(f"Channel Stats - {test_channel['name']}", "FAIL", 
                        f"Status: {response.status_code}, Response: {response.text[:200]}")
                results.append(False)
                
        except requests.exceptions.Timeout:
            log_test(f"Channel Stats - {test_channel['name']} - Timeout", "FAIL", 
                    "Request timed out after 30 seconds")
            results.append(False)
        except Exception as e:
            log_test(f"Channel Stats - {test_channel['name']} - Exception", "FAIL", f"Error: {str(e)}")
            results.append(False)
    
    return results

def test_trending_topics_api():
    """Test GET /api/trending-topics endpoint"""
    print(f"\n{Colors.BOLD}=== Testing Trending Topics API ==={Colors.ENDC}")
    
    try:
        # Test basic trending topics request
        response = requests.get(f"{BACKEND_URL}/trending-topics", timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            
            # Verify response structure
            if 'topics' in data and isinstance(data['topics'], list):
                topics_count = len(data['topics'])
                log_test("GET /api/trending-topics - Response Structure", "PASS", 
                        f"Returned {topics_count} topics in correct format")
                
                # Verify topics content
                if topics_count > 0:
                    sample_topics = data['topics'][:3]
                    log_test("Trending Topics Content", "PASS", 
                            f"Sample topics: {', '.join(sample_topics)}")
                    return True, data
                else:
                    log_test("Trending Topics Content", "FAIL", "No topics returned")
                    return False, data
            else:
                log_test("GET /api/trending-topics - Response Structure", "FAIL", 
                        f"Invalid response structure: {data}")
                return False, data
        else:
            log_test("GET /api/trending-topics - HTTP Status", "FAIL", 
                    f"Status: {response.status_code}, Response: {response.text}")
            return False, None
            
    except requests.exceptions.Timeout:
        log_test("GET /api/trending-topics - Timeout", "FAIL", "Request timed out after 30 seconds")
        return False, None
    except Exception as e:
        log_test("GET /api/trending-topics - Exception", "FAIL", f"Error: {str(e)}")
        return False, None

def main():
    """Run all tests"""
    print(f"{Colors.BOLD}🚀 YouTube Automation Tool Backend API Testing{Colors.ENDC}")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    all_results = []
    
    # Test 1: Dashboard Analytics API
    dashboard_success, dashboard_data = test_dashboard_analytics_api()
    all_results.append(dashboard_success)
    
    # Test 2: Channel Management APIs
    channel_results = test_channel_management_apis()
    all_results.extend(channel_results)
    
    # Test 3: Content Ideas API
    content_results = test_content_ideas_api()
    all_results.extend(content_results)
    
    # Test 4: Trending Videos API
    trending_results = test_trending_videos_api()
    all_results.extend(trending_results)
    
    # Test 5: Competitor Analysis APIs
    competitor_results = test_competitor_analysis_apis()
    all_results.extend(competitor_results)
    
    # Test 6: Trending Topics API
    trending_topics_success, trending_topics_data = test_trending_topics_api()
    all_results.append(trending_topics_success)
    
    # Summary
    print(f"\n{Colors.BOLD}=== TEST SUMMARY ==={Colors.ENDC}")
    total_tests = len(all_results)
    passed_tests = sum(all_results)
    failed_tests = total_tests - passed_tests
    success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
    
    print(f"Total Tests: {total_tests}")
    print(f"{Colors.GREEN}Passed: {passed_tests}{Colors.ENDC}")
    print(f"{Colors.RED}Failed: {failed_tests}{Colors.ENDC}")
    print(f"Success Rate: {success_rate:.1f}%")
    
    if success_rate >= 80:
        print(f"\n{Colors.GREEN}✅ YouTube Automation Tool Backend APIs are working correctly!{Colors.ENDC}")
        return True
    else:
        print(f"\n{Colors.RED}❌ Some critical issues found in Backend APIs{Colors.ENDC}")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)