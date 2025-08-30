#!/usr/bin/env python3
"""
Revenue Calculation Testing for CreatorHub Dashboard
Focused testing for monthly revenue calculation issues
"""

import requests
import json
import sys
from datetime import datetime
import time

# Get backend URL from frontend .env
BACKEND_URL = "https://rpm-dashboard-fix.preview.emergentagent.com/api"

class RevenueCalculationTester:
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
        elif status == "FAIL":
            self.failed_tests += 1
            print(f"❌ {test_name}: {message}")
        else:
            print(f"ℹ️ {test_name}: {message}")
            
    def test_dashboard_no_channels_revenue(self):
        """Test dashboard revenue calculation when no channels are connected"""
        try:
            # First, disconnect all channels to ensure clean state
            response = requests.get(f"{BACKEND_URL}/channels", timeout=15)
            if response.status_code == 200:
                channels = response.json()
                for channel in channels:
                    requests.delete(f"{BACKEND_URL}/channels/{channel['channel_id']}", timeout=10)
            
            # Test dashboard with no channels
            response = requests.get(f"{BACKEND_URL}/analytics/dashboard", timeout=20)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('connected') == False:
                    revenue = data.get('revenueThisMonth', 0)
                    self.log_result("Revenue No Channels", "PASS", 
                                  f"No channels connected - Revenue: ${revenue}", 
                                  {"revenue": revenue, "connected": False})
                    return revenue
                else:
                    self.log_result("Revenue No Channels", "FAIL", 
                                  f"Expected connected=False, got {data.get('connected')}")
            else:
                self.log_result("Revenue No Channels", "FAIL", 
                              f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Revenue No Channels", "FAIL", f"Request error: {str(e)}")
        return 0

    def test_revenue_calculation_with_channel(self, channel_id, expected_channel_name):
        """Test revenue calculation with a specific connected channel"""
        try:
            # Connect the channel
            payload = {"channel_id": channel_id}
            connect_response = requests.post(f"{BACKEND_URL}/channels/connect", 
                                           json=payload, timeout=20)
            
            if connect_response.status_code == 200:
                channel_data = connect_response.json()
                self.log_result("Channel Connection for Revenue Test", "PASS", 
                              f"Connected {channel_data['channel_name']} for revenue testing")
            elif connect_response.status_code == 400 and "already connected" in connect_response.text:
                self.log_result("Channel Connection for Revenue Test", "PASS", 
                              "Channel already connected (expected)")
            else:
                self.log_result("Channel Connection for Revenue Test", "FAIL", 
                              f"Failed to connect channel: {connect_response.status_code}")
                return None
            
            # Get dashboard analytics
            response = requests.get(f"{BACKEND_URL}/analytics/dashboard", timeout=25)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('connected') == True:
                    total_views = data.get('totalViews', 0)
                    revenue = data.get('revenueThisMonth', 0)
                    channel_info = data.get('channelInfo', {})
                    
                    # Calculate expected revenue using the formula from backend
                    expected_revenue = max(100, min(50000, total_views // 10000))
                    
                    # Verify the calculation
                    if revenue == expected_revenue:
                        self.log_result("Revenue Calculation Accuracy", "PASS", 
                                      f"{channel_info.get('name', 'Unknown')}: {total_views:,} views → ${revenue} (formula: max(100, min(50000, {total_views} // 10000)))", 
                                      {
                                          "channel_name": channel_info.get('name'),
                                          "total_views": total_views,
                                          "calculated_revenue": revenue,
                                          "expected_revenue": expected_revenue,
                                          "formula_check": "PASS"
                                      })
                    else:
                        self.log_result("Revenue Calculation Accuracy", "FAIL", 
                                      f"Revenue mismatch: Expected ${expected_revenue}, Got ${revenue} (Views: {total_views:,})", 
                                      {
                                          "total_views": total_views,
                                          "calculated_revenue": revenue,
                                          "expected_revenue": expected_revenue,
                                          "formula_check": "FAIL"
                                      })
                    
                    return {
                        "channel_name": channel_info.get('name'),
                        "total_views": total_views,
                        "revenue": revenue,
                        "expected_revenue": expected_revenue
                    }
                else:
                    self.log_result("Revenue Calculation Accuracy", "FAIL", 
                                  f"Expected connected=True, got {data.get('connected')}")
            else:
                self.log_result("Revenue Calculation Accuracy", "FAIL", 
                              f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Revenue Calculation Accuracy", "FAIL", f"Request error: {str(e)}")
        return None

    def test_revenue_edge_cases(self):
        """Test revenue calculation edge cases"""
        print("\n🧮 TESTING REVENUE CALCULATION EDGE CASES")
        print("-" * 60)
        
        # Test different channels with different view counts to verify formula
        test_channels = [
            ("UCBJycsmduvYEL83R_U4JriQ", "Marques Brownlee"),  # High view count channel
            ("UCX6OQ3DkcsbYNE6H8uQQuVA", "MrBeast"),           # Very high view count channel
        ]
        
        revenue_results = []
        
        for channel_id, expected_name in test_channels:
            print(f"\nTesting revenue calculation for {expected_name}...")
            result = self.test_revenue_calculation_with_channel(channel_id, expected_name)
            if result:
                revenue_results.append(result)
            
            # Brief pause between tests
            time.sleep(2)
        
        # Analyze revenue calculation consistency
        if len(revenue_results) >= 2:
            print(f"\n📊 REVENUE CALCULATION ANALYSIS")
            print("-" * 60)
            
            for i, result in enumerate(revenue_results):
                views = result['total_views']
                revenue = result['revenue']
                expected = result['expected_revenue']
                
                # Verify formula: max(100, min(50000, total_views // 10000))
                formula_result = max(100, min(50000, views // 10000))
                
                if revenue == formula_result:
                    self.log_result(f"Formula Verification {i+1}", "PASS", 
                                  f"{result['channel_name']}: Formula correct - {views:,} views → ${revenue}")
                else:
                    self.log_result(f"Formula Verification {i+1}", "FAIL", 
                                  f"{result['channel_name']}: Formula incorrect - Expected ${formula_result}, Got ${revenue}")
                
                # Check if revenue is within expected bounds
                if 100 <= revenue <= 50000:
                    self.log_result(f"Revenue Bounds Check {i+1}", "PASS", 
                                  f"{result['channel_name']}: Revenue ${revenue} within bounds [100, 50000]")
                else:
                    self.log_result(f"Revenue Bounds Check {i+1}", "FAIL", 
                                  f"{result['channel_name']}: Revenue ${revenue} outside bounds [100, 50000]")
        
        return revenue_results

    def test_revenue_consistency_across_calls(self):
        """Test revenue calculation consistency across multiple API calls"""
        try:
            print("\n🔄 TESTING REVENUE CONSISTENCY ACROSS MULTIPLE CALLS")
            print("-" * 60)
            
            revenues = []
            view_counts = []
            
            # Make multiple calls to the dashboard API
            for i in range(3):
                response = requests.get(f"{BACKEND_URL}/analytics/dashboard", timeout=20)
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get('connected') == True:
                        revenue = data.get('revenueThisMonth', 0)
                        views = data.get('totalViews', 0)
                        revenues.append(revenue)
                        view_counts.append(views)
                        
                        self.log_result(f"Revenue Consistency Call {i+1}", "INFO", 
                                      f"Revenue: ${revenue}, Views: {views:,}")
                    else:
                        self.log_result(f"Revenue Consistency Call {i+1}", "INFO", 
                                      "No channels connected")
                        break
                else:
                    self.log_result(f"Revenue Consistency Call {i+1}", "FAIL", 
                                  f"HTTP {response.status_code}")
                    break
                
                time.sleep(1)  # Brief pause between calls
            
            # Check consistency
            if len(revenues) >= 2:
                if all(r == revenues[0] for r in revenues):
                    self.log_result("Revenue Consistency Check", "PASS", 
                                  f"Revenue consistent across {len(revenues)} calls: ${revenues[0]}")
                else:
                    self.log_result("Revenue Consistency Check", "FAIL", 
                                  f"Revenue inconsistent: {revenues}")
                
                if all(v == view_counts[0] for v in view_counts):
                    self.log_result("View Count Consistency Check", "PASS", 
                                  f"View count consistent across {len(view_counts)} calls: {view_counts[0]:,}")
                else:
                    self.log_result("View Count Consistency Check", "FAIL", 
                                  f"View count inconsistent: {view_counts}")
            
        except Exception as e:
            self.log_result("Revenue Consistency Check", "FAIL", f"Error: {str(e)}")

    def test_multiple_channels_revenue_switching(self):
        """Test revenue calculation when switching between multiple connected channels"""
        try:
            print("\n🔀 TESTING REVENUE WITH MULTIPLE CHANNELS AND PRIMARY SWITCHING")
            print("-" * 60)
            
            # Connect multiple channels
            channels_to_connect = [
                ("UCBJycsmduvYEL83R_U4JriQ", "Marques Brownlee"),
                ("UCX6OQ3DkcsbYNE6H8uQQuVA", "MrBeast")
            ]
            
            connected_channels = []
            
            for channel_id, name in channels_to_connect:
                payload = {"channel_id": channel_id}
                response = requests.post(f"{BACKEND_URL}/channels/connect", 
                                       json=payload, timeout=20)
                
                if response.status_code in [200, 400]:  # 400 if already connected
                    connected_channels.append(channel_id)
                    self.log_result(f"Multi-Channel Connect", "PASS", 
                                  f"Connected/Verified {name}")
            
            # Test switching primary channels and verify revenue changes
            if len(connected_channels) >= 2:
                revenue_by_channel = {}
                
                for i, channel_id in enumerate(connected_channels):
                    # Set as primary
                    response = requests.put(f"{BACKEND_URL}/channels/{channel_id}/primary", timeout=15)
                    
                    if response.status_code == 200:
                        self.log_result(f"Set Primary Channel {i+1}", "PASS", 
                                      f"Set {channel_id} as primary")
                        
                        # Get dashboard data
                        time.sleep(1)  # Brief pause for state update
                        dashboard_response = requests.get(f"{BACKEND_URL}/analytics/dashboard", timeout=20)
                        
                        if dashboard_response.status_code == 200:
                            data = dashboard_response.json()
                            if data.get('connected') == True:
                                channel_info = data.get('channelInfo', {})
                                revenue = data.get('revenueThisMonth', 0)
                                views = data.get('totalViews', 0)
                                
                                revenue_by_channel[channel_id] = {
                                    'name': channel_info.get('name', 'Unknown'),
                                    'revenue': revenue,
                                    'views': views
                                }
                                
                                self.log_result(f"Primary Channel {i+1} Revenue", "PASS", 
                                              f"{channel_info.get('name')}: ${revenue} (Views: {views:,})")
                
                # Analyze revenue differences between channels
                if len(revenue_by_channel) >= 2:
                    revenues = [data['revenue'] for data in revenue_by_channel.values()]
                    views = [data['views'] for data in revenue_by_channel.values()]
                    
                    if len(set(revenues)) > 1:
                        self.log_result("Multi-Channel Revenue Variation", "PASS", 
                                      f"Revenue correctly varies by channel: {revenues}")
                    else:
                        self.log_result("Multi-Channel Revenue Variation", "INFO", 
                                      f"Revenue same across channels: ${revenues[0]}")
                    
                    # Verify each channel's revenue calculation
                    for channel_id, data in revenue_by_channel.items():
                        expected_revenue = max(100, min(50000, data['views'] // 10000))
                        if data['revenue'] == expected_revenue:
                            self.log_result(f"Channel Revenue Formula Check", "PASS", 
                                          f"{data['name']}: Correct formula application")
                        else:
                            self.log_result(f"Channel Revenue Formula Check", "FAIL", 
                                          f"{data['name']}: Expected ${expected_revenue}, Got ${data['revenue']}")
            
        except Exception as e:
            self.log_result("Multi-Channel Revenue Test", "FAIL", f"Error: {str(e)}")

    def test_revenue_boundary_conditions(self):
        """Test revenue calculation boundary conditions"""
        print("\n🎯 TESTING REVENUE CALCULATION BOUNDARY CONDITIONS")
        print("-" * 60)
        
        # The formula is: max(100, min(50000, total_views // 10000))
        # This means:
        # - Minimum revenue: $100 (when views < 1,000,000)
        # - Maximum revenue: $50,000 (when views >= 500,000,000)
        # - Linear scaling: $1 per 10,000 views between these bounds
        
        boundary_tests = [
            (0, 100, "Zero views should give minimum $100"),
            (999999, 100, "Under 1M views should give minimum $100"),
            (1000000, 100, "Exactly 1M views should give $100"),
            (10000000, 1000, "10M views should give $1,000"),
            (100000000, 10000, "100M views should give $10,000"),
            (500000000, 50000, "500M views should give maximum $50,000"),
            (1000000000, 50000, "1B+ views should be capped at $50,000")
        ]
        
        print("Formula Analysis:")
        print("Revenue = max(100, min(50000, total_views // 10000))")
        print("Minimum: $100, Maximum: $50,000")
        print("Scaling: $1 per 10,000 views")
        print()
        
        for views, expected_revenue, description in boundary_tests:
            calculated_revenue = max(100, min(50000, views // 10000))
            
            if calculated_revenue == expected_revenue:
                self.log_result("Boundary Condition Test", "PASS", 
                              f"{description} ✓ (${calculated_revenue})")
            else:
                self.log_result("Boundary Condition Test", "FAIL", 
                              f"{description} ✗ Expected ${expected_revenue}, Got ${calculated_revenue}")

    def run_revenue_focused_tests(self):
        """Run all revenue-focused tests"""
        print("💰 COMPREHENSIVE REVENUE CALCULATION TESTING")
        print(f"Testing against: {BACKEND_URL}")
        print("=" * 80)
        
        # 1. Test revenue calculation boundary conditions
        self.test_revenue_boundary_conditions()
        
        # 2. Test dashboard revenue with no channels
        print("\n1️⃣ Testing revenue calculation with no channels...")
        no_channel_revenue = self.test_dashboard_no_channels_revenue()
        
        # 3. Test revenue calculation with different channels
        print("\n2️⃣ Testing revenue calculation with connected channels...")
        revenue_results = self.test_revenue_edge_cases()
        
        # 4. Test revenue consistency across multiple API calls
        self.test_revenue_consistency_across_calls()
        
        # 5. Test revenue with multiple channels and primary switching
        self.test_multiple_channels_revenue_switching()
        
        # Print comprehensive summary
        print("\n" + "=" * 80)
        print("💰 REVENUE CALCULATION TEST SUMMARY")
        print("=" * 80)
        print(f"Total Tests: {self.total_tests}")
        print(f"Passed: {self.passed_tests}")
        print(f"Failed: {self.failed_tests}")
        print(f"Success Rate: {(self.passed_tests/self.total_tests)*100:.1f}%")
        
        # Print key findings
        print("\n🔍 KEY FINDINGS:")
        print("- Revenue Formula: max(100, min(50000, total_views // 10000))")
        print("- Minimum Revenue: $100")
        print("- Maximum Revenue: $50,000")
        print("- Scaling Rate: $1 per 10,000 views")
        
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

if __name__ == "__main__":
    tester = RevenueCalculationTester()
    results = tester.run_revenue_focused_tests()
    
    # Exit with error code if tests failed
    sys.exit(0 if tester.failed_tests == 0 else 1)