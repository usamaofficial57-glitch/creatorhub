import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar as CalendarIcon, Plus, Clock, Eye, Filter } from 'lucide-react';
import { Calendar } from './ui/calendar';

const ContentCalendar = () => {
  const [date, setDate] = useState(new Date());
  
  // Mock calendar data
  const scheduledContent = [
    {
      id: '1',
      title: 'Tech Review: Latest iPhone',
      date: '2025-01-20',
      time: '10:00 AM',
      status: 'scheduled',
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=60&fit=crop'
    },
    {
      id: '2',
      title: 'Gaming Setup Tour',
      date: '2025-01-22',
      time: '2:00 PM',
      status: 'in-production',
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=60&fit=crop'
    },
    {
      id: '3',
      title: 'Productivity Tips Thread',
      date: '2025-01-25',
      time: '9:00 AM',
      status: 'draft',
      type: 'shorts',
      thumbnail: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=100&h=60&fit=crop'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-green-100 text-green-800';
      case 'in-production': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'video': return 'bg-blue-100 text-blue-800';
      case 'shorts': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Calendar</h1>
          <p className="text-gray-600 mt-1">Plan and schedule your content pipeline</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Content
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">January 2025</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Week</Button>
              <Button variant="outline" size="sm">Month</Button>
            </div>
          </div>
          
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border w-full"
          />
        </Card>

        {/* Upcoming Content */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Upcoming Content</h3>
          <div className="space-y-4">
            {scheduledContent.map((content) => (
              <div key={content.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex space-x-2">
                    <Badge className={getStatusColor(content.status)} variant="outline">
                      {content.status}
                    </Badge>
                    <Badge className={getTypeColor(content.type)} variant="outline">
                      {content.type}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <img 
                    src={content.thumbnail}
                    alt="Content thumbnail"
                    className="w-16 h-10 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm leading-tight">
                      {content.title}
                    </h4>
                    <div className="flex items-center space-x-3 mt-2 text-xs text-gray-600">
                      <div className="flex items-center">
                        <CalendarIcon className="w-3 h-3 mr-1" />
                        {content.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {content.time}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Content Pipeline */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Content Pipeline</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Ideas (12)</h4>
            <div className="space-y-2">
              <div className="bg-white p-3 rounded-md border-l-4 border-blue-500">
                <p className="text-sm font-medium">AI Revolution in 2025</p>
                <p className="text-xs text-gray-600">Added Jan 15</p>
              </div>
              <div className="bg-white p-3 rounded-md border-l-4 border-blue-500">
                <p className="text-sm font-medium">Budget Gaming Setup</p>
                <p className="text-xs text-gray-600">Added Jan 14</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">In Production (3)</h4>
            <div className="space-y-2">
              <div className="bg-white p-3 rounded-md border-l-4 border-yellow-500">
                <p className="text-sm font-medium">Tech Review: iPhone</p>
                <p className="text-xs text-gray-600">50% complete</p>
              </div>
              <div className="bg-white p-3 rounded-md border-l-4 border-yellow-500">
                <p className="text-sm font-medium">Gaming Setup Tour</p>
                <p className="text-xs text-gray-600">25% complete</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Scheduled (2)</h4>
            <div className="space-y-2">
              <div className="bg-white p-3 rounded-md border-l-4 border-green-500">
                <p className="text-sm font-medium">Productivity Hacks</p>
                <p className="text-xs text-gray-600">Jan 20, 10:00 AM</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Published (8)</h4>
            <div className="space-y-2">
              <div className="bg-white p-3 rounded-md border-l-4 border-purple-500">
                <p className="text-sm font-medium">2025 Tech Predictions</p>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <Eye className="w-3 h-3" />
                  <span>45K views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ContentCalendar;