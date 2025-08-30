#!/usr/bin/env python3
"""
Revenue Details Analysis - Examining the revenueDetails section structure
"""

import requests
import json

BACKEND_URL = "https://rpm-dashboard-fix.preview.emergentagent.com/api"

def test_revenue_details_structure():
    """Test the revenueDetails section structure and content"""
    print("🔍 TESTING REVENUE DETAILS SECTION STRUCTURE")
    print("=" * 60)
    
    try:
        # Get connected channels first
        channels_response = requests.get(f"{BACKEND_URL}/channels", timeout=15)
        
        if channels_response.status_code == 200:
            channels = channels_response.json()
            
            if len(channels) > 0:
                channel = channels[0]  # Use first channel
                channel_name = channel.get('channel_name', 'Unknown')
                
                print(f"📊 Analyzing revenue details for: {channel_name}")
                print(f"   Subscribers: {channel.get('subscriber_count', 0):,}")
                print(f"   Total Views: {channel.get('view_count', 0):,}")
                print(f"   Videos: {channel.get('video_count', 0):,}")
                print()
                
                # Test dashboard analytics
                dashboard_response = requests.get(f"{BACKEND_URL}/analytics/dashboard", timeout=25)
                
                if dashboard_response.status_code == 200:
                    data = dashboard_response.json()
                    
                    print("📋 DASHBOARD RESPONSE STRUCTURE:")
                    print(f"   Connected: {data.get('connected', 'N/A')}")
                    print(f"   Message: {data.get('message', 'N/A')}")
                    print()
                    
                    if 'revenueDetails' in data:
                        revenue_details = data['revenueDetails']
                        
                        print("💰 REVENUE DETAILS SECTION FOUND:")
                        print("=" * 40)
                        
                        for key, value in revenue_details.items():
                            if isinstance(value, (int, float)):
                                if key in ['rpm', 'baseRpm', 'geographyMultiplier', 'sizeMultiplier']:
                                    print(f"   {key}: {value:.2f}")
                                else:
                                    print(f"   {key}: {value:,}")
                            else:
                                print(f"   {key}: {value}")
                        
                        print()
                        print("🧮 REVENUE CALCULATION BREAKDOWN:")
                        print(f"   Formula: max(1, int((estimated_monthly_views / 1000) * final_rpm))")
                        print(f"   Base RPM: ${revenue_details.get('baseRpm', 0):.2f}")
                        print(f"   Geography Multiplier: {revenue_details.get('geographyMultiplier', 1):.2f}x")
                        print(f"   Size Multiplier: {revenue_details.get('sizeMultiplier', 1):.2f}x")
                        print(f"   Final RPM: ${revenue_details.get('rpm', 0):.2f}")
                        print(f"   Monthly Views: {revenue_details.get('estimatedMonthlyViews', 0):,}")
                        print(f"   Monthly Revenue: ${data.get('revenueThisMonth', 0):,}")
                        print()
                        print(f"   Breakdown String: {revenue_details.get('breakdown', 'N/A')}")
                        
                        # Verify calculation
                        monthly_views = revenue_details.get('estimatedMonthlyViews', 0)
                        final_rpm = revenue_details.get('rpm', 0)
                        expected_revenue = max(1, int((monthly_views / 1000) * final_rpm))
                        actual_revenue = data.get('revenueThisMonth', 0)
                        
                        print()
                        print("✅ CALCULATION VERIFICATION:")
                        print(f"   Expected: ${expected_revenue:,}")
                        print(f"   Actual: ${actual_revenue:,}")
                        print(f"   Match: {'✅ Yes' if expected_revenue == actual_revenue else '❌ No'}")
                        
                    else:
                        print("❌ NO REVENUE DETAILS SECTION FOUND")
                        print("   Available keys:", list(data.keys()))
                        
                        if data.get('error'):
                            error = data['error']
                            if 'quota' in error.lower():
                                print("   Reason: YouTube API quota exceeded")
                            else:
                                print(f"   Error: {error[:200]}...")
                
                else:
                    print(f"❌ Dashboard request failed: {dashboard_response.status_code}")
            else:
                print("❌ No channels connected")
        else:
            print(f"❌ Failed to get channels: {channels_response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def simulate_different_channel_scenarios():
    """Simulate how revenue would vary with different channel types"""
    print("\n🎭 SIMULATING DIFFERENT CHANNEL SCENARIOS")
    print("=" * 60)
    
    scenarios = [
        {
            "name": "Small Gaming Channel",
            "subscribers": 50000,
            "total_views": 10000000,
            "video_count": 500,
            "category": "gaming"
        },
        {
            "name": "Medium Tech Channel", 
            "subscribers": 500000,
            "total_views": 100000000,
            "video_count": 300,
            "category": "tech"
        },
        {
            "name": "Large Finance Channel",
            "subscribers": 2000000,
            "total_views": 500000000,
            "video_count": 800,
            "category": "finance"
        },
        {
            "name": "Mega Entertainment Channel",
            "subscribers": 50000000,
            "total_views": 10000000000,
            "video_count": 2000,
            "category": "entertainment"
        }
    ]
    
    # RPM rates by category
    rpm_rates = {
        'finance': 8.50,
        'tech': 6.20,
        'education': 4.80,
        'health': 4.50,
        'beauty': 3.80,
        'food': 3.20,
        'travel': 2.90,
        'music': 2.50,
        'gaming': 2.20,
        'entertainment': 1.80,
        'general': 2.00
    }
    
    for scenario in scenarios:
        print(f"\n📊 {scenario['name']}:")
        print(f"   Subscribers: {scenario['subscribers']:,}")
        print(f"   Total Views: {scenario['total_views']:,}")
        print(f"   Videos: {scenario['video_count']:,}")
        print(f"   Category: {scenario['category'].title()}")
        
        # Calculate estimated monthly views
        avg_views_per_video = scenario['total_views'] / scenario['video_count']
        subscriber_count = scenario['subscribers']
        
        if subscriber_count > 10000000:
            estimated_monthly_videos = min(15, max(4, scenario['video_count'] / 24))
            estimated_monthly_views = avg_views_per_video * estimated_monthly_videos * 1.5
        elif subscriber_count > 1000000:
            estimated_monthly_videos = min(10, max(3, scenario['video_count'] / 36))
            estimated_monthly_views = avg_views_per_video * estimated_monthly_videos * 1.2
        elif subscriber_count > 100000:
            estimated_monthly_videos = min(8, max(2, scenario['video_count'] / 48))
            estimated_monthly_views = avg_views_per_video * estimated_monthly_videos
        else:
            estimated_monthly_videos = max(1, scenario['video_count'] / 60)
            estimated_monthly_views = avg_views_per_video * estimated_monthly_videos * 0.8
        
        # Calculate multipliers
        base_rpm = rpm_rates.get(scenario['category'], 2.00)
        
        # Geography multiplier
        if scenario['category'] in ['finance', 'tech', 'education']:
            base_geo_multiplier = 1.2
        elif scenario['category'] in ['gaming', 'entertainment']:
            base_geo_multiplier = 0.9
        else:
            base_geo_multiplier = 1.0
            
        if subscriber_count > 5000000:
            size_geo_multiplier = 1.3
        elif subscriber_count > 1000000:
            size_geo_multiplier = 1.2
        elif subscriber_count > 100000:
            size_geo_multiplier = 1.1
        else:
            size_geo_multiplier = 0.95
            
        geography_multiplier = base_geo_multiplier * size_geo_multiplier
        
        # Size multiplier
        if subscriber_count > 10000000:
            size_multiplier = 1.4
        elif subscriber_count > 5000000:
            size_multiplier = 1.3
        elif subscriber_count > 1000000:
            size_multiplier = 1.2
        elif subscriber_count > 500000:
            size_multiplier = 1.15
        elif subscriber_count > 100000:
            size_multiplier = 1.1
        elif subscriber_count > 10000:
            size_multiplier = 1.0
        else:
            size_multiplier = 0.85
        
        # Final calculation
        final_rpm = base_rpm * geography_multiplier * size_multiplier
        estimated_monthly_revenue = max(1, int((estimated_monthly_views / 1000) * final_rpm))
        estimated_monthly_revenue = min(estimated_monthly_revenue, 2000000)  # $2M cap
        
        print(f"   📈 Revenue Calculation:")
        print(f"      Base RPM: ${base_rpm:.2f}")
        print(f"      Geography Multiplier: {geography_multiplier:.2f}x")
        print(f"      Size Multiplier: {size_multiplier:.2f}x")
        print(f"      Final RPM: ${final_rpm:.2f}")
        print(f"      Est. Monthly Views: {int(estimated_monthly_views):,}")
        print(f"      💰 Monthly Revenue: ${estimated_monthly_revenue:,}")

def analyze_demographic_gaps():
    """Analyze what demographic factors are missing"""
    print("\n🎯 DEMOGRAPHIC FACTORS ANALYSIS")
    print("=" * 60)
    
    print("✅ CURRENTLY CONSIDERED:")
    current_factors = [
        "Channel Category/Niche (affects base RPM rates)",
        "Channel Size (subscriber count affects multipliers)", 
        "Estimated Geography (based on category and size)",
        "Content Volume (video count affects monthly view estimation)",
        "Channel Maturity (total views and video count)"
    ]
    
    for i, factor in enumerate(current_factors, 1):
        print(f"   {i}. {factor}")
    
    print("\n❌ MISSING (mentioned in review request - 'niche audience age and so on'):")
    missing_factors = [
        "Audience Age Demographics (18-24, 25-34, 35-44, 45-54, 55+)",
        "Audience Gender Distribution (affects ad targeting)",
        "Audience Income Level (higher income = premium ads)",
        "Audience Education Level (affects ad engagement)",
        "Detailed Geographic Distribution (Tier-1 vs Tier-2/3 countries)",
        "Audience Engagement Quality (likes, comments, shares per view)",
        "Watch Time vs View Count (longer videos = more ad slots)",
        "Subscriber Engagement Rate (active vs inactive subscribers)",
        "Seasonal Viewing Patterns (affects monthly estimates)",
        "Device Usage (mobile vs desktop affects ad rates)",
        "Time of Day Viewing Patterns (prime time vs off-peak)"
    ]
    
    for i, factor in enumerate(missing_factors, 1):
        print(f"   {i}. {factor}")
    
    print(f"\n📊 SUMMARY:")
    print(f"   Current System: {len(current_factors)} basic factors")
    print(f"   Missing Factors: {len(missing_factors)} advanced demographic factors")
    print(f"   Sophistication Level: Basic estimation vs Advanced audience analysis")

if __name__ == "__main__":
    test_revenue_details_structure()
    simulate_different_channel_scenarios()
    analyze_demographic_gaps()