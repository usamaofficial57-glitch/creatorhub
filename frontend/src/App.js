import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import AIScriptGenerator from "./components/AIScriptGenerator";
import ContentIdeas from "./components/ContentIdeas";
import GrowingChannelAnalyzer from "./components/GrowingChannelAnalyzer";
import LearningHub from "./components/LearningHub";
import CommunityHub from "./components/CommunityHub";
import CompetitorAnalysis from "./components/CompetitorAnalysis";
import TrendingVideos from "./components/TrendingVideos";
import ContentCalendar from "./components/ContentCalendar";
import NicheResearch from "./components/NicheResearch";
import ChannelAnalytics from "./components/ChannelAnalytics";
import TeamManagement from "./components/TeamManagement";
import SEOTools from "./components/SEOTools";
import Settings from "./components/Settings";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="flex min-h-screen" style={{backgroundColor: '#F3F4F6'}}>
          <Sidebar />
          <main className="flex-1 ml-64 min-h-screen transition-all duration-300">
            <div className="animate-in fade-in duration-300">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/script-generator" element={<AIScriptGenerator />} />
                <Route path="/content-ideas" element={<ContentIdeas />} />
                <Route path="/growing-analyzer" element={<GrowingChannelAnalyzer />} />
                <Route path="/learning-hub" element={<LearningHub />} />
                <Route path="/community-hub" element={<CommunityHub />} />
                <Route path="/competitors" element={<CompetitorAnalysis />} />
                <Route path="/trending" element={<TrendingVideos />} />
                <Route path="/calendar" element={<ContentCalendar />} />
                <Route path="/niche-research" element={<NicheResearch />} />
                <Route path="/analytics" element={<ChannelAnalytics />} />
                <Route path="/team" element={<TeamManagement />} />
                <Route path="/seo" element={<SEOTools />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </main>
        </div>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;