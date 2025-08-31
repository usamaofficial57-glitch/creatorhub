#!/usr/bin/env python3
"""
Revenue Calculation System Testing for CreatorHub
Specifically tests the dashboard analytics revenue calculation system 
to verify if it's properly calculating RPM using demographic factors.

Focus Areas:
1. GET /api/analytics/dashboard - Check revenue calculation with demographic breakdown
2. Revenue Details Analysis - Verify revenueDetails section shows demographic multipliers, 
   category-based RPM rates, channel size multipliers, audience demographics data
3. Test with different channel scenarios
4. Verify calculation accuracy with formula: estimated_monthly_views / 1000 * final_rpm 
   where final_rpm = base_rpm * demographic_multiplier * size_multiplier
"""

import requests
import json
import sys
from datetime import datetime
import time

# Get backend URL from frontend .env
BACKEND_URL = "https://code-cleaner-6.preview.emergentagent.com/api"

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
        else:  # INFO
            print(f"ℹ️ {test_name}: {message}")

    def test_dashboard_analytics_revenue_calculation(self):
        """Test GET /api/analytics/dashboard for revenue calculation with demographic breakdown"""
        print("\n🎯 TESTING DASHBOARD ANALYTICS REVENUE CALCULATION")
        print("-" * 60)
        
        try:
            response = requests.get(f"{BACKEND_URL}/analytics/dashboard", timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get('connected') == True:
                    # Test 1: Verify revenue calculation is present
                    if 'revenueThisMonth' in data:
                        revenue = data['revenueThisMonth']
                        self.log_result("Revenue Calculation Present", "PASS", 
                                      f"Monthly revenue calculated: ${revenue:,}")
                    else:
                        self.log_result("Revenue Calculation Present", "FAIL", 
                                      "revenueThisMonth field missing from response")
                        return
                    
                    # Test 2: Verify revenueDetails section exists
                    if 'revenueDetails' in data:
                        revenue_details = data['revenueDetails']
                        self.log_result("Revenue Details Section", "PASS", 
                                      "revenueDetails section present in response")
                        
                        # Test 3: Verify demographic breakdown fields
                        required_demographic_fields = [
                            'demographicMultiplier', 'demographicBreakdown', 'audienceDemographics'
                        ]
                        
                        missing_demo_fields = [field for field in required_demographic_fields 
                                             if field not in revenue_details]
                        
                        if not missing_demo_fields:
                            self.log_result("Demographic Fields Present", "PASS", 
                                          f"All demographic fields present: {required_demographic_fields}")
                            
                            # Test 4: Verify demographic breakdown structure
                            demo_breakdown = revenue_details.get('demographicBreakdown', {})
                            breakdown_fields = ['ageMultiplier', 'genderMultiplier', 'geographicMultiplier']
                            
                            missing_breakdown = [field for field in breakdown_fields 
                                               if field not in demo_breakdown]
                            
                            if not missing_breakdown:
                                age_mult = demo_breakdown['ageMultiplier']
                                gender_mult = demo_breakdown['genderMultiplier']
                                geo_mult = demo_breakdown['geographicMultiplier']
                                
                                self.log_result("Demographic Breakdown Structure", "PASS", 
                                              f"Complete breakdown - Age: {age_mult:.3f}, "
                                              f"Gender: {gender_mult:.3f}, Geographic: {geo_mult:.3f}")
                                
                                # Test 5: Verify demographic multipliers are realistic
                                if 0.1 <= age_mult <= 2.0 and 0.8 <= gender_mult <= 1.5 and 0.1 <= geo_mult <= 1.5:
                                    self.log_result("Demographic Multipliers Realistic", "PASS", 
                                                  "All demographic multipliers within realistic ranges")
                                else:
                                    self.log_result("Demographic Multipliers Realistic", "FAIL", 
                                                  f"Unrealistic multipliers: Age={age_mult}, Gender={gender_mult}, Geo={geo_mult}")
                            else:
                                self.log_result("Demographic Breakdown Structure", "FAIL", 
                                              f"Missing breakdown fields: {missing_breakdown}")
                        else:
                            self.log_result("Demographic Fields Present", "FAIL", 
                                          f"Missing demographic fields: {missing_demo_fields}")
                        
                        # Test 6: Verify category-based RPM rates
                        required_rpm_fields = ['baseRpm', 'rpm', 'category']
                        missing_rpm_fields = [field for field in required_rpm_fields 
                                            if field not in revenue_details]
                        
                        if not missing_rpm_fields:
                            base_rpm = revenue_details['baseRpm']
                            final_rpm = revenue_details['rpm']
                            category = revenue_details['category']
                            
                            self.log_result("Category-based RPM Rates", "PASS", 
                                          f"Category: {category}, Base RPM: ${base_rpm:.2f}, Final RPM: ${final_rpm:.2f}")
                            
                            # Verify industry-standard RPM rates
                            expected_base_rpms = {
                                'finance': 8.50, 'technology': 6.20, 'education': 4.80,
                                'health': 4.50, 'beauty': 3.80, 'food': 3.20,
                                'travel': 2.90, 'music': 2.50, 'gaming': 2.20, 
                                'entertainment': 1.80, 'general': 2.00
                            }
                            
                            category_lower = category.lower()
                            rpm_verified = False
                            for cat_key, expected_rpm in expected_base_rpms.items():
                                if cat_key in category_lower:
                                    if abs(base_rpm - expected_rpm) < 0.01:
                                        self.log_result("Industry Standard RPM", "PASS", 
                                                      f"Correct base RPM for {category}: ${base_rpm:.2f}")
                                    else:
                                        self.log_result("Industry Standard RPM", "FAIL", 
                                                      f"Incorrect base RPM for {category}: expected ${expected_rpm:.2f}, got ${base_rpm:.2f}")
                                    rpm_verified = True
                                    break
                            
                            if not rpm_verified:
                                self.log_result("Industry Standard RPM", "INFO", 
                                              f"Category '{category}' not in standard list, base RPM: ${base_rpm:.2f}")
                        else:
                            self.log_result("Category-based RPM Rates", "FAIL", 
                                          f"Missing RPM fields: {missing_rpm_fields}")
                        
                        # Test 7: Verify channel size multipliers
                        if 'sizeMultiplier' in revenue_details:
                            size_mult = revenue_details['sizeMultiplier']
                            
                            if 0.8 <= size_mult <= 2.0:
                                self.log_result("Channel Size Multiplier", "PASS", 
                                              f"Realistic size multiplier: {size_mult:.2f}")
                            else:
                                self.log_result("Channel Size Multiplier", "FAIL", 
                                              f"Unrealistic size multiplier: {size_mult:.2f}")
                        else:
                            self.log_result("Channel Size Multiplier", "FAIL", 
                                          "sizeMultiplier field missing")
                        
                        # Test 8: Verify audience demographics data
                        if 'audienceDemographics' in revenue_details:
                            audience_demo = revenue_details['audienceDemographics']
                            
                            if isinstance(audience_demo, dict):
                                demo_categories = ['age_groups', 'gender', 'countries']
                                present_categories = [cat for cat in demo_categories if cat in audience_demo]
                                
                                if len(present_categories) >= 2:
                                    self.log_result("Audience Demographics Data", "PASS", 
                                                  f"Demographics available: {present_categories}")
                                    
                                    # Verify age groups data
                                    if 'age_groups' in audience_demo and audience_demo['age_groups']:
                                        age_groups = audience_demo['age_groups']
                                        total_percentage = sum(age_groups.values())
                                        
                                        if 90 <= total_percentage <= 110:  # Allow some variance
                                            self.log_result("Age Demographics Validity", "PASS", 
                                                          f"Age groups sum to {total_percentage}%: {list(age_groups.keys())}")
                                        else:
                                            self.log_result("Age Demographics Validity", "FAIL", 
                                                          f"Age groups sum to {total_percentage}% (should be ~100%)")
                                    
                                    # Verify geographic data
                                    if 'countries' in audience_demo and audience_demo['countries']:
                                        countries = audience_demo['countries']
                                        top_countries = list(countries.keys())[:3]
                                        self.log_result("Geographic Demographics", "PASS", 
                                                      f"Top countries: {top_countries}")
                                else:
                                    self.log_result("Audience Demographics Data", "FAIL", 
                                                  f"Insufficient demographic categories: {present_categories}")
                            else:
                                self.log_result("Audience Demographics Data", "FAIL", 
                                              "audienceDemographics is not a valid dictionary")
                        else:
                            self.log_result("Audience Demographics Data", "FAIL", 
                                          "audienceDemographics field missing")
                        
                        return revenue_details
                    else:
                        self.log_result("Revenue Details Section", "FAIL", 
                                      "revenueDetails section missing from response")
                        return None
                        
                elif data.get('connected') == False:
                    self.log_result("Dashboard Analytics", "INFO", 
                                  f"No channels connected: {data.get('message', 'No message')}")
                    return None
                else:
                    self.log_result("Dashboard Analytics", "FAIL", 
                                  f"Invalid connected status: {data.get('connected')}")
                    return None
            else:
                self.log_result("Dashboard Analytics", "FAIL", 
                              f"HTTP {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            self.log_result("Dashboard Analytics", "FAIL", f"Request error: {str(e)}")
            return None

    def test_revenue_calculation_accuracy(self, revenue_details):
        """Test the accuracy of revenue calculation formula"""
        print("\n🧮 TESTING REVENUE CALCULATION ACCURACY")
        print("-" * 60)
        
        if not revenue_details:
            self.log_result("Revenue Calculation Accuracy", "SKIP", "No revenue details available")
            return
        
        try:
            # Extract required values
            estimated_monthly_views = revenue_details.get('estimatedMonthlyViews', 0)
            base_rpm = revenue_details.get('baseRpm', 0)
            demographic_multiplier = revenue_details.get('demographicMultiplier', 1)
            size_multiplier = revenue_details.get('sizeMultiplier', 1)
            final_rpm = revenue_details.get('rpm', 0)
            
            # Test 1: Verify final RPM calculation
            expected_final_rpm = base_rpm * demographic_multiplier * size_multiplier
            rpm_diff = abs(final_rpm - expected_final_rpm)
            
            if rpm_diff < 0.01:
                self.log_result("Final RPM Calculation", "PASS", 
                              f"Accurate: ${base_rpm:.2f} × {demographic_multiplier:.3f} × {size_multiplier:.2f} = ${final_rpm:.2f}")
            else:
                self.log_result("Final RPM Calculation", "FAIL", 
                              f"Mismatch: expected ${expected_final_rpm:.2f}, got ${final_rpm:.2f}")
            
            # Test 2: Verify monthly revenue calculation
            expected_monthly_revenue = max(1, int((estimated_monthly_views / 1000) * final_rpm))
            
            # Get actual revenue from dashboard
            dashboard_response = requests.get(f"{BACKEND_URL}/analytics/dashboard", timeout=20)
            if dashboard_response.status_code == 200:
                dashboard_data = dashboard_response.json()
                actual_revenue = dashboard_data.get('revenueThisMonth', 0)
                
                revenue_diff = abs(actual_revenue - expected_monthly_revenue)
                
                if revenue_diff <= 1:  # Allow for rounding differences
                    self.log_result("Monthly Revenue Formula", "PASS", 
                                  f"Accurate: {estimated_monthly_views:,} views ÷ 1000 × ${final_rpm:.2f} = ${actual_revenue:,}")
                else:
                    self.log_result("Monthly Revenue Formula", "FAIL", 
                                  f"Mismatch: expected ${expected_monthly_revenue:,}, got ${actual_revenue:,}")
                
                # Test 3: Verify revenue is using demographic factors vs basic estimation
                if demographic_multiplier != 1.0:
                    self.log_result("Demographic Factor Usage", "PASS", 
                                  f"Using demographic multiplier: {demographic_multiplier:.3f} (not basic 1.0)")
                else:
                    self.log_result("Demographic Factor Usage", "FAIL", 
                                  "Demographic multiplier is 1.0 - may not be using real demographic factors")
                
                # Test 4: Verify breakdown string format
                breakdown = revenue_details.get('breakdown', '')
                if ('views' in breakdown.lower() and 'rpm' in breakdown.lower() and 
                    str(estimated_monthly_views) in breakdown and f"${final_rpm:.2f}" in breakdown):
                    self.log_result("Revenue Breakdown Format", "PASS", 
                                  f"Proper breakdown format: {breakdown}")
                else:
                    self.log_result("Revenue Breakdown Format", "FAIL", 
                                  f"Invalid breakdown format: {breakdown}")
            else:
                self.log_result("Monthly Revenue Formula", "FAIL", 
                              f"Could not get dashboard data: {dashboard_response.status_code}")
                
        except Exception as e:
            self.log_result("Revenue Calculation Accuracy", "FAIL", f"Calculation error: {str(e)}")

    def test_different_channel_scenarios(self):
        """Test revenue calculation with different channel scenarios"""
        print("\n🎭 TESTING DIFFERENT CHANNEL SCENARIOS")
        print("-" * 60)
        
        # Test channels with different expected demographics and categories
        test_channels = [
            {
                "name": "MrBeast (Entertainment - Young Global Audience)",
                "channel_id": "UCX6OQ3DkcsbYNE6H8uQQuVA",
                "expected_category": "entertainment",
                "expected_base_rpm": 1.80
            },
            {
                "name": "Marques Brownlee (Tech - Premium Audience)",
                "channel_id": "UCBJycsmduvYEL83R_U4JriQ", 
                "expected_category": "technology",
                "expected_base_rpm": 6.20
            }
        ]
        
        channel_results = []
        
        for channel_info in test_channels:
            try:
                # Connect the channel
                payload = {"channel_id": channel_info["channel_id"]}
                connect_response = requests.post(f"{BACKEND_URL}/channels/connect", 
                                               json=payload, timeout=20)
                
                if connect_response.status_code in [200, 400]:  # 400 if already connected
                    # Set as primary channel
                    primary_response = requests.put(f"{BACKEND_URL}/channels/{channel_info['channel_id']}/primary", timeout=15)
                    
                    if primary_response.status_code == 200:
                        # Get analytics for this channel
                        time.sleep(2)  # Brief pause for data consistency
                        analytics_response = requests.get(f"{BACKEND_URL}/analytics/dashboard", timeout=30)
                        
                        if analytics_response.status_code == 200:
                            data = analytics_response.json()
                            
                            if data.get('connected') and 'revenueDetails' in data:
                                revenue_details = data['revenueDetails']
                                
                                # Verify category detection
                                category = revenue_details.get('category', '').lower()
                                expected_category = channel_info['expected_category']
                                
                                if expected_category in category:
                                    self.log_result(f"Category Detection - {channel_info['name']}", "PASS", 
                                                  f"Correct category detected: {category}")
                                else:
                                    self.log_result(f"Category Detection - {channel_info['name']}", "FAIL", 
                                                  f"Expected '{expected_category}' in category, got: {category}")
                                
                                # Verify base RPM for category
                                base_rpm = revenue_details.get('baseRpm', 0)
                                expected_base_rpm = channel_info['expected_base_rpm']
                                
                                if abs(base_rpm - expected_base_rpm) < 0.01:
                                    self.log_result(f"Base RPM - {channel_info['name']}", "PASS", 
                                                  f"Correct base RPM: ${base_rpm:.2f}")
                                else:
                                    self.log_result(f"Base RPM - {channel_info['name']}", "FAIL", 
                                                  f"Expected ${expected_base_rpm:.2f}, got ${base_rpm:.2f}")
                                
                                # Store results for comparison
                                channel_results.append({
                                    "name": channel_info["name"],
                                    "channel_id": channel_info["channel_id"],
                                    "category": category,
                                    "base_rpm": base_rpm,
                                    "demographic_multiplier": revenue_details.get('demographicMultiplier', 0),
                                    "final_rpm": revenue_details.get('rpm', 0),
                                    "monthly_revenue": data.get('revenueThisMonth', 0),
                                    "demographic_breakdown": revenue_details.get('demographicBreakdown', {}),
                                    "audience_demographics": revenue_details.get('audienceDemographics', {})
                                })
                                
                                self.log_result(f"Revenue Calculation - {channel_info['name']}", "PASS", 
                                              f"Monthly revenue: ${data.get('revenueThisMonth', 0):,}, "
                                              f"Final RPM: ${revenue_details.get('rpm', 0):.2f}")
                            else:
                                self.log_result(f"Analytics Data - {channel_info['name']}", "FAIL", 
                                              "No revenue details in analytics response")
                        else:
                            self.log_result(f"Analytics Request - {channel_info['name']}", "FAIL", 
                                          f"Analytics request failed: {analytics_response.status_code}")
                    else:
                        self.log_result(f"Set Primary - {channel_info['name']}", "FAIL", 
                                      f"Failed to set primary: {primary_response.status_code}")
                else:
                    self.log_result(f"Channel Connection - {channel_info['name']}", "FAIL", 
                                  f"Connection failed: {connect_response.status_code}")
                    
            except Exception as e:
                self.log_result(f"Channel Test - {channel_info['name']}", "FAIL", 
                              f"Test error: {str(e)}")
        
        # Compare results between different channel types
        if len(channel_results) >= 2:
            self.compare_channel_demographics(channel_results)
        
        return channel_results

    def compare_channel_demographics(self, channel_results):
        """Compare demographic profiles between different channel types"""
        print("\n🔍 COMPARING CHANNEL DEMOGRAPHIC PROFILES")
        print("-" * 60)
        
        try:
            entertainment_channel = next((r for r in channel_results if "entertainment" in r["category"]), None)
            tech_channel = next((r for r in channel_results if "tech" in r["category"]), None)
            
            if entertainment_channel and tech_channel:
                # Compare base RPMs
                ent_rpm = entertainment_channel["base_rpm"]
                tech_rpm = tech_channel["base_rpm"]
                
                if tech_rpm > ent_rpm:
                    self.log_result("Category RPM Comparison", "PASS", 
                                  f"Tech RPM (${tech_rpm:.2f}) > Entertainment RPM (${ent_rpm:.2f}) as expected")
                else:
                    self.log_result("Category RPM Comparison", "FAIL", 
                                  f"Unexpected RPM comparison: Tech=${tech_rpm:.2f}, Entertainment=${ent_rpm:.2f}")
                
                # Compare demographic multipliers
                ent_demo_mult = entertainment_channel["demographic_multiplier"]
                tech_demo_mult = tech_channel["demographic_multiplier"]
                
                if ent_demo_mult != tech_demo_mult:
                    self.log_result("Demographic Differentiation", "PASS", 
                                  f"Different demographic profiles: Entertainment={ent_demo_mult:.3f} vs Tech={tech_demo_mult:.3f}")
                else:
                    self.log_result("Demographic Differentiation", "FAIL", 
                                  "Identical demographic multipliers for different channel types")
                
                # Compare age demographics if available
                ent_age = entertainment_channel["audience_demographics"].get('age_groups', {})
                tech_age = tech_channel["audience_demographics"].get('age_groups', {})
                
                if ent_age and tech_age:
                    ent_young = ent_age.get('18-24', 0) + ent_age.get('13-17', 0)
                    tech_young = tech_age.get('18-24', 0) + tech_age.get('13-17', 0)
                    
                    if abs(ent_young - tech_young) > 5:  # Significant difference
                        self.log_result("Age Profile Differentiation", "PASS", 
                                      f"Different age profiles: Entertainment young={ent_young}% vs Tech={tech_young}%")
                    else:
                        self.log_result("Age Profile Differentiation", "INFO", 
                                      f"Similar age profiles: Entertainment={ent_young}% vs Tech={tech_young}% young audience")
                
                # Compare final revenue calculations
                ent_revenue = entertainment_channel["monthly_revenue"]
                tech_revenue = tech_channel["monthly_revenue"]
                
                self.log_result("Revenue Comparison", "INFO", 
                              f"Monthly revenues: Entertainment=${ent_revenue:,} vs Tech=${tech_revenue:,}")
                
        except Exception as e:
            self.log_result("Demographic Comparison", "FAIL", f"Comparison error: {str(e)}")

    def test_demographic_vs_basic_estimation(self):
        """Test whether system uses exact demographic factors vs basic estimation"""
        print("\n🎯 TESTING DEMOGRAPHIC FACTORS VS BASIC ESTIMATION")
        print("-" * 60)
        
        try:
            # Get current analytics
            response = requests.get(f"{BACKEND_URL}/analytics/dashboard", timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get('connected') and 'revenueDetails' in data:
                    revenue_details = data['revenueDetails']
                    
                    # Check if using demographic multiplier vs legacy geography multiplier
                    demographic_mult = revenue_details.get('demographicMultiplier', 0)
                    legacy_geo_mult = revenue_details.get('legacyGeographyMultiplier', 0)
                    
                    if demographic_mult != legacy_geo_mult:
                        self.log_result("Demographic vs Legacy System", "PASS", 
                                      f"Using enhanced demographic multiplier ({demographic_mult:.3f}) "
                                      f"instead of legacy geography ({legacy_geo_mult:.3f})")
                    else:
                        self.log_result("Demographic vs Legacy System", "FAIL", 
                                      "System appears to be using legacy geography multiplier")
                    
                    # Check demographic breakdown components
                    demo_breakdown = revenue_details.get('demographicBreakdown', {})
                    
                    if demo_breakdown:
                        age_mult = demo_breakdown.get('ageMultiplier', 1.0)
                        gender_mult = demo_breakdown.get('genderMultiplier', 1.0)
                        geo_mult = demo_breakdown.get('geographicMultiplier', 1.0)
                        
                        # Check if multipliers show variation (indicating real demographic analysis)
                        if age_mult != 1.0 or gender_mult != 1.0 or geo_mult != 1.0:
                            self.log_result("Real Demographic Analysis", "PASS", 
                                          f"Non-default multipliers indicate real analysis: "
                                          f"Age={age_mult:.3f}, Gender={gender_mult:.3f}, Geo={geo_mult:.3f}")
                        else:
                            self.log_result("Real Demographic Analysis", "FAIL", 
                                          "All multipliers are 1.0 - may be using basic estimation")
                    
                    # Check audience demographics data quality
                    audience_demo = revenue_details.get('audienceDemographics', {})
                    
                    if audience_demo:
                        data_source = audience_demo.get('data_source', 'unknown')
                        
                        if 'estimated' in data_source.lower():
                            self.log_result("Demographic Data Source", "INFO", 
                                          f"Using estimated demographics: {data_source}")
                        elif 'real' in data_source.lower() or 'api' in data_source.lower():
                            self.log_result("Demographic Data Source", "PASS", 
                                          f"Using real demographic data: {data_source}")
                        else:
                            self.log_result("Demographic Data Source", "INFO", 
                                          f"Demographic data source: {data_source}")
                        
                        # Check demographic data completeness
                        age_groups = audience_demo.get('age_groups', {})
                        countries = audience_demo.get('countries', {})
                        gender = audience_demo.get('gender', {})
                        
                        completeness_score = 0
                        if age_groups: completeness_score += 1
                        if countries: completeness_score += 1
                        if gender: completeness_score += 1
                        
                        if completeness_score == 3:
                            self.log_result("Demographic Data Completeness", "PASS", 
                                          "Complete demographic data (age, gender, geography)")
                        elif completeness_score >= 2:
                            self.log_result("Demographic Data Completeness", "PASS", 
                                          f"Partial demographic data ({completeness_score}/3 categories)")
                        else:
                            self.log_result("Demographic Data Completeness", "FAIL", 
                                          f"Insufficient demographic data ({completeness_score}/3 categories)")
                    
                    # Final assessment
                    if (demographic_mult != 1.0 and demographic_mult != legacy_geo_mult and 
                        demo_breakdown and audience_demo):
                        self.log_result("Overall Demographic System Assessment", "PASS", 
                                      "System is using sophisticated demographic-aware revenue calculation")
                    else:
                        self.log_result("Overall Demographic System Assessment", "FAIL", 
                                      "System may be using basic estimation rather than exact demographic factors")
                        
                else:
                    self.log_result("Demographic Analysis", "FAIL", 
                                  "No connected channel or revenue details available")
            else:
                self.log_result("Demographic Analysis", "FAIL", 
                              f"Dashboard request failed: {response.status_code}")
                
        except Exception as e:
            self.log_result("Demographic Analysis", "FAIL", f"Analysis error: {str(e)}")

    def run_all_tests(self):
        """Run all revenue calculation tests"""
        print("🚀 Starting Revenue Calculation System Tests")
        print(f"Testing against: {BACKEND_URL}")
        print("=" * 60)
        
        # Test 1: Dashboard analytics revenue calculation
        revenue_details = self.test_dashboard_analytics_revenue_calculation()
        
        # Test 2: Revenue calculation accuracy
        self.test_revenue_calculation_accuracy(revenue_details)
        
        # Test 3: Different channel scenarios
        channel_results = self.test_different_channel_scenarios()
        
        # Test 4: Demographic vs basic estimation
        self.test_demographic_vs_basic_estimation()
        
        # Print summary
        self.print_summary()

    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 REVENUE CALCULATION TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.total_tests}")
        print(f"Passed: {self.passed_tests}")
        print(f"Failed: {self.failed_tests}")
        print(f"Success Rate: {(self.passed_tests/self.total_tests*100):.1f}%")
        
        if self.failed_tests > 0:
            print(f"\n❌ FAILED TESTS:")
            for result in self.results:
                if result['status'] == 'FAIL':
                    print(f"  - {result['test']}: {result['message']}")
        
        print(f"\n🎯 REVENUE CALCULATION SYSTEM ASSESSMENT:")
        
        # Analyze results for final assessment
        demographic_tests = [r for r in self.results if 'demographic' in r['test'].lower()]
        passed_demographic_tests = [r for r in demographic_tests if r['status'] == 'PASS']
        
        if len(passed_demographic_tests) >= len(demographic_tests) * 0.8:
            print("✅ SYSTEM IS USING DEMOGRAPHIC FACTORS FOR RPM CALCULATION")
            print("   - Demographic multipliers are being applied")
            print("   - Audience demographics data is being used")
            print("   - Category-based RPM rates are implemented")
            print("   - Channel size multipliers are working")
        else:
            print("❌ SYSTEM MAY NEED ENHANCEMENT FOR DEMOGRAPHIC FACTORS")
            print("   - Some demographic features may be missing or not working")
            print("   - Consider implementing more sophisticated audience analysis")

if __name__ == "__main__":
    tester = RevenueCalculationTester()
    tester.run_all_tests()