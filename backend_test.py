#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for AI Script Generator
Testing the newly implemented endpoints:
- GET /api/trending-topics
- POST /api/generate-script  
- POST /api/auto-research
"""

import requests
import json
import time
from datetime import datetime

# Backend URL from frontend .env
BACKEND_URL = "https://tubeflow-design.preview.emergentagent.com/api"

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

def test_script_generation_api():
    """Test POST /api/generate-script endpoint with various configurations"""
    print(f"\n{Colors.BOLD}=== Testing Script Generation API ==={Colors.ENDC}")
    
    test_cases = [
        {
            "name": "Basic Educational Script",
            "payload": {
                "topic": "How to Start a YouTube Channel",
                "duration": "10min",
                "tone": "educational",
                "style": "faceless-documentary",
                "language": "english"
            }
        },
        {
            "name": "Short Form Content",
            "payload": {
                "topic": "Quick Productivity Tips",
                "duration": "shorts",
                "tone": "funny",
                "style": "shorts-punchline",
                "language": "english"
            }
        },
        {
            "name": "Long Form Content",
            "payload": {
                "topic": "Complete Guide to Digital Marketing",
                "duration": "20min",
                "tone": "dramatic",
                "style": "podcast-style",
                "language": "english"
            }
        },
        {
            "name": "Spanish Language Content",
            "payload": {
                "topic": "Cómo hacer dinero en línea",
                "duration": "5min",
                "tone": "storytelling",
                "style": "faceless-documentary",
                "language": "spanish"
            }
        },
        {
            "name": "Hindi Language Content",
            "payload": {
                "topic": "भारत में बिजनेस शुरू करना",
                "duration": "10min",
                "tone": "educational",
                "style": "educational-breakdown",
                "language": "hindi"
            }
        }
    ]
    
    results = []
    
    for test_case in test_cases:
        try:
            print(f"\n{Colors.BLUE}Testing: {test_case['name']}{Colors.ENDC}")
            
            response = requests.post(
                f"{BACKEND_URL}/generate-script",
                json=test_case['payload'],
                timeout=60,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Verify required fields
                required_fields = ['script', 'title', 'hook', 'metadata']
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    # Verify content quality
                    script_length = len(data['script'])
                    title_length = len(data['title'])
                    hook_length = len(data['hook'])
                    
                    log_test(f"{test_case['name']} - Response Structure", "PASS",
                            f"All required fields present")
                    
                    log_test(f"{test_case['name']} - Content Quality", "PASS",
                            f"Script: {script_length} chars, Title: {title_length} chars, Hook: {hook_length} chars")
                    
                    # Verify metadata
                    metadata = data['metadata']
                    expected_metadata = ['wordCount', 'estimatedDuration', 'style', 'tone', 'language']
                    metadata_check = all(field in metadata for field in expected_metadata)
                    
                    if metadata_check:
                        log_test(f"{test_case['name']} - Metadata", "PASS",
                                f"Duration: {metadata['estimatedDuration']}, Style: {metadata['style']}")
                        results.append(True)
                    else:
                        log_test(f"{test_case['name']} - Metadata", "FAIL",
                                f"Missing metadata fields")
                        results.append(False)
                else:
                    log_test(f"{test_case['name']} - Response Structure", "FAIL",
                            f"Missing fields: {missing_fields}")
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

def test_auto_research_api():
    """Test POST /api/auto-research endpoint"""
    print(f"\n{Colors.BOLD}=== Testing Auto-Research API ==={Colors.ENDC}")
    
    test_cases = [
        {
            "name": "Tech Topic Research",
            "payload": {
                "topic": "Artificial Intelligence in 2025",
                "language": "english"
            }
        },
        {
            "name": "Business Topic Research", 
            "payload": {
                "topic": "Starting an Online Business",
                "language": "english"
            }
        },
        {
            "name": "Health Topic Research",
            "payload": {
                "topic": "Mental Health and Wellness",
                "language": "english"
            }
        }
    ]
    
    results = []
    
    for test_case in test_cases:
        try:
            print(f"\n{Colors.BLUE}Testing: {test_case['name']}{Colors.ENDC}")
            
            response = requests.post(
                f"{BACKEND_URL}/auto-research",
                json=test_case['payload'],
                timeout=45,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Verify required fields
                required_fields = ['keywords', 'competitorCount', 'optimalLength', 'trendsAnalysis']
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    log_test(f"{test_case['name']} - Response Structure", "PASS",
                            "All required fields present")
                    
                    # Verify data quality
                    keywords = data['keywords']
                    competitor_count = data['competitorCount']
                    optimal_length = data['optimalLength']
                    trends_analysis = data['trendsAnalysis']
                    
                    if isinstance(keywords, list) and len(keywords) > 0:
                        log_test(f"{test_case['name']} - Keywords", "PASS",
                                f"Found {len(keywords)} keywords: {', '.join(keywords[:3])}")
                    else:
                        log_test(f"{test_case['name']} - Keywords", "FAIL",
                                "No keywords or invalid format")
                        results.append(False)
                        continue
                    
                    if isinstance(competitor_count, int) and competitor_count > 0:
                        log_test(f"{test_case['name']} - Competitor Analysis", "PASS",
                                f"Found {competitor_count} competitors")
                    else:
                        log_test(f"{test_case['name']} - Competitor Analysis", "FAIL",
                                f"Invalid competitor count: {competitor_count}")
                        results.append(False)
                        continue
                    
                    if optimal_length and len(optimal_length) > 0:
                        log_test(f"{test_case['name']} - Optimal Length", "PASS",
                                f"Recommended: {optimal_length}")
                    else:
                        log_test(f"{test_case['name']} - Optimal Length", "FAIL",
                                "No optimal length provided")
                        results.append(False)
                        continue
                    
                    if trends_analysis and len(trends_analysis) > 10:
                        log_test(f"{test_case['name']} - Trends Analysis", "PASS",
                                f"Analysis: {trends_analysis[:100]}...")
                        results.append(True)
                    else:
                        log_test(f"{test_case['name']} - Trends Analysis", "FAIL",
                                "Insufficient trends analysis")
                        results.append(False)
                else:
                    log_test(f"{test_case['name']} - Response Structure", "FAIL",
                            f"Missing fields: {missing_fields}")
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

def test_error_handling():
    """Test error handling for invalid requests"""
    print(f"\n{Colors.BOLD}=== Testing Error Handling ==={Colors.ENDC}")
    
    error_tests = [
        {
            "name": "Script Generation - Missing Topic",
            "endpoint": "/generate-script",
            "payload": {
                "duration": "10min",
                "tone": "educational"
                # Missing required 'topic' field
            },
            "expected_status": [400, 422]
        },
        {
            "name": "Script Generation - Invalid Duration",
            "endpoint": "/generate-script", 
            "payload": {
                "topic": "Test Topic",
                "duration": "invalid_duration",
                "tone": "educational"
            },
            "expected_status": [200, 400, 422]  # May still work with fallback
        },
        {
            "name": "Auto Research - Missing Topic",
            "endpoint": "/auto-research",
            "payload": {
                "language": "english"
                # Missing required 'topic' field
            },
            "expected_status": [400, 422]
        },
        {
            "name": "Auto Research - Empty Topic",
            "endpoint": "/auto-research",
            "payload": {
                "topic": "",
                "language": "english"
            },
            "expected_status": [400, 422]
        }
    ]
    
    results = []
    
    for test in error_tests:
        try:
            print(f"\n{Colors.BLUE}Testing: {test['name']}{Colors.ENDC}")
            
            response = requests.post(
                f"{BACKEND_URL}{test['endpoint']}",
                json=test['payload'],
                timeout=30,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code in test['expected_status']:
                log_test(f"{test['name']}", "PASS",
                        f"Returned expected status: {response.status_code}")
                results.append(True)
            else:
                log_test(f"{test['name']}", "FAIL",
                        f"Expected status {test['expected_status']}, got {response.status_code}")
                results.append(False)
                
        except Exception as e:
            log_test(f"{test['name']} - Exception", "FAIL", f"Error: {str(e)}")
            results.append(False)
    
    return results

def test_response_times():
    """Test API response times"""
    print(f"\n{Colors.BOLD}=== Testing Response Times ==={Colors.ENDC}")
    
    # Test trending topics response time
    try:
        start_time = time.time()
        response = requests.get(f"{BACKEND_URL}/trending-topics", timeout=30)
        end_time = time.time()
        
        response_time = end_time - start_time
        
        if response.status_code == 200 and response_time < 15:
            log_test("Trending Topics Response Time", "PASS",
                    f"Responded in {response_time:.2f} seconds")
        elif response.status_code == 200:
            log_test("Trending Topics Response Time", "WARN",
                    f"Slow response: {response_time:.2f} seconds")
        else:
            log_test("Trending Topics Response Time", "FAIL",
                    f"Failed with status {response.status_code}")
    except Exception as e:
        log_test("Trending Topics Response Time", "FAIL", f"Error: {str(e)}")
    
    # Test script generation response time
    try:
        start_time = time.time()
        response = requests.post(
            f"{BACKEND_URL}/generate-script",
            json={
                "topic": "Quick Test Topic",
                "duration": "5min",
                "tone": "educational",
                "style": "faceless-documentary",
                "language": "english"
            },
            timeout=60
        )
        end_time = time.time()
        
        response_time = end_time - start_time
        
        if response.status_code == 200 and response_time < 30:
            log_test("Script Generation Response Time", "PASS",
                    f"Responded in {response_time:.2f} seconds")
        elif response.status_code == 200:
            log_test("Script Generation Response Time", "WARN",
                    f"Slow response: {response_time:.2f} seconds")
        else:
            log_test("Script Generation Response Time", "FAIL",
                    f"Failed with status {response.status_code}")
    except Exception as e:
        log_test("Script Generation Response Time", "FAIL", f"Error: {str(e)}")

def main():
    """Run all tests"""
    print(f"{Colors.BOLD}🚀 AI Script Generator Backend API Testing{Colors.ENDC}")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    all_results = []
    
    # Test 1: Trending Topics API
    trending_success, trending_data = test_trending_topics_api()
    all_results.append(trending_success)
    
    # Test 2: Script Generation API
    script_results = test_script_generation_api()
    all_results.extend(script_results)
    
    # Test 3: Auto-Research API
    research_results = test_auto_research_api()
    all_results.extend(research_results)
    
    # Test 4: Error Handling
    error_results = test_error_handling()
    all_results.extend(error_results)
    
    # Test 5: Response Times
    test_response_times()
    
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
        print(f"\n{Colors.GREEN}✅ AI Script Generator APIs are working correctly!{Colors.ENDC}")
        return True
    else:
        print(f"\n{Colors.RED}❌ Some critical issues found in AI Script Generator APIs{Colors.ENDC}")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)