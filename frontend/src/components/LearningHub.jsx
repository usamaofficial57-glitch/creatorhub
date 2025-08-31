import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Users, 
  CheckCircle, 
  Star,
  Download,
  ArrowRight,
  Zap,
  Calendar,
  BarChart3,
  Settings,
  PlayCircle,
  FileText,
  Target,
  TrendingUp
} from 'lucide-react';

const LearningHub = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [automationWorkflows, setAutomationWorkflows] = useState([]);

  // Mock course data
  const courses = [
    {
      id: 'faceless-youtube-mastery',
      title: 'Faceless YouTube Mastery',
      description: 'Complete guide to building a successful faceless YouTube channel',
      instructor: 'CreatorHub Team',
      duration: '6 hours',
      lessons: 24,
      level: 'Beginner to Advanced',
      rating: 4.9,
      students: 15420,
      thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
      modules: [
        {
          id: 'module-1',
          title: 'Getting Started with Faceless Content',
          lessons: [
            { id: 'lesson-1-1', title: 'What is Faceless YouTube?', duration: '12:30', type: 'video' },
            { id: 'lesson-1-2', title: 'Choosing Your Niche', duration: '18:15', type: 'video' },
            { id: 'lesson-1-3', title: 'Channel Setup & Branding', duration: '25:40', type: 'video' },
            { id: 'lesson-1-4', title: 'Content Planning Template', duration: '5:00', type: 'download' }
          ]
        },
        {
          id: 'module-2',
          title: 'Content Creation System',
          lessons: [
            { id: 'lesson-2-1', title: 'Script Writing Framework', duration: '22:10', type: 'video' },
            { id: 'lesson-2-2', title: 'Voice & Audio Recording', duration: '19:35', type: 'video' },
            { id: 'lesson-2-3', title: 'Visual Content Creation', duration: '31:20', type: 'video' },
            { id: 'lesson-2-4', title: 'Editing Workflows', duration: '28:45', type: 'video' }
          ]
        },
        {
          id: 'module-3',
          title: 'Automation & Scaling',
          lessons: [
            { id: 'lesson-3-1', title: 'Content Calendar Automation', duration: '16:25', type: 'video' },
            { id: 'lesson-3-2', title: 'Batch Production Methods', duration: '21:50', type: 'video' },
            { id: 'lesson-3-3', title: 'Outsourcing & VA Management', duration: '24:15', type: 'video' },
            { id: 'lesson-3-4', title: 'Analytics & Optimization', duration: '19:30', type: 'video' }
          ]
        }
      ]
    },
    {
      id: 'automation-mastery',
      title: 'YouTube Automation Mastery',
      description: 'Advanced automation strategies for scaling your YouTube channel',
      instructor: 'Automation Expert',
      duration: '4 hours',
      lessons: 18,
      level: 'Intermediate',
      rating: 4.8,
      students: 8920,
      thumbnail: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=300&fit=crop',
      modules: [
        {
          id: 'auto-module-1',
          title: 'Workflow Automation',
          lessons: [
            { id: 'auto-1-1', title: 'Setting Up Your Tech Stack', duration: '15:20', type: 'video' },
            { id: 'auto-1-2', title: 'Content Pipeline Automation', duration: '22:45', type: 'video' },
            { id: 'auto-1-3', title: 'Publishing Schedules', duration: '18:30', type: 'video' }
          ]
        }
      ]
    }
  ];

  // Mock automation workflows
  const workflows = [
    {
      id: 'content-pipeline',
      name: 'Complete Content Pipeline',
      description: 'Automated workflow from idea generation to published video',
      steps: 8,
      status: 'active',
      lastRun: '2 hours ago',
      successRate: 94,
      icon: Zap,
      color: 'bg-blue-500',
      steps_detail: [
        { name: 'Generate Content Ideas', tool: 'AI Script Generator', status: 'completed' },
        { name: 'Create Script', tool: 'OpenAI GPT-4', status: 'completed' },
        { name: 'Generate Voiceover', tool: 'ElevenLabs', status: 'completed' },
        { name: 'Create Visuals', tool: 'Canva API', status: 'completed' },
        { name: 'Edit Video', tool: 'Automated Editor', status: 'pending' },
        { name: 'Generate Thumbnail', tool: 'AI Thumbnail Creator', status: 'pending' },
        { name: 'Upload to YouTube', tool: 'YouTube API', status: 'pending' },
        { name: 'Schedule Social Posts', tool: 'Buffer API', status: 'pending' }
      ]
    },
    {
      id: 'analytics-report',
      name: 'Weekly Analytics Report',
      description: 'Automated weekly performance analysis and insights',
      steps: 4,
      status: 'active',
      lastRun: '1 day ago',
      successRate: 98,
      icon: BarChart3,
      color: 'bg-green-500'
    },
    {
      id: 'competitor-monitoring',
      name: 'Competitor Content Monitoring',
      description: 'Track competitor uploads and analyze trending content',
      steps: 6,
      status: 'active',
      lastRun: '4 hours ago',
      successRate: 91,
      icon: Target,
      color: 'bg-purple-500'
    },
    {
      id: 'seo-optimization',
      name: 'Auto SEO Optimization',
      description: 'Optimize titles, descriptions, and tags for better discoverability',
      steps: 5,
      status: 'paused',
      lastRun: '3 days ago',
      successRate: 87,
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  const handleLessonComplete = (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  const calculateCourseProgress = (course) => {
    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const completedInCourse = completedLessons.filter(lessonId => 
      course.modules.some(module => 
        module.lessons.some(lesson => lesson.id === lessonId)
      )
    ).length;
    return Math.round((completedInCourse / totalLessons) * 100);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Hub</h1>
        <p className="text-gray-600">Master faceless YouTube content creation and automation workflows</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('courses')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'courses'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BookOpen className="w-4 h-4 inline-block mr-2" />
            Courses
          </button>
          <button
            onClick={() => setActiveTab('automation')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'automation'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Zap className="w-4 h-4 inline-block mr-2" />
            Automation Workflows
          </button>
        </nav>
      </div>

      {/* Courses Tab */}
      {activeTab === 'courses' && !selectedCourse && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-white rounded-full px-3 py-1 text-sm font-medium text-gray-900">
                    {calculateCourseProgress(course)}% Complete
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <Play className="w-4 h-4 mr-1" />
                    {course.lessons} lessons
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {course.students.toLocaleString()} students
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{course.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">• {course.level}</span>
                  </div>
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                  >
                    Continue Learning
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Detail View */}
      {activeTab === 'courses' && selectedCourse && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <button
              onClick={() => setSelectedCourse(null)}
              className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
            >
              ← Back to Courses
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCourse.title}</h2>
            <p className="text-gray-600">{selectedCourse.description}</p>
            
            <div className="flex items-center space-x-6 mt-4">
              <div className="text-sm text-gray-500">
                Progress: {calculateCourseProgress(selectedCourse)}% Complete
              </div>
              <div className="text-sm text-gray-500">
                Instructor: {selectedCourse.instructor}
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {selectedCourse.modules.map((module) => (
              <div key={module.id} className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{module.title}</h3>
                <div className="space-y-3">
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        {completedLessons.includes(lesson.id) ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        ) : lesson.type === 'video' ? (
                          <PlayCircle className="w-5 h-5 text-blue-500 mr-3" />
                        ) : (
                          <FileText className="w-5 h-5 text-gray-400 mr-3" />
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                          <p className="text-sm text-gray-500">{lesson.duration}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleLessonComplete(lesson.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        {completedLessons.includes(lesson.id) ? 'Completed' : 'Start'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Automation Workflows Tab */}
      {activeTab === 'automation' && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Automation Workflows</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Create New Workflow
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`${workflow.color} p-2 rounded-lg mr-3`}>
                      <workflow.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                      <p className="text-gray-600 text-sm">{workflow.description}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    workflow.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {workflow.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{workflow.steps}</p>
                    <p className="text-sm text-gray-500">Steps</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{workflow.successRate}%</p>
                    <p className="text-sm text-gray-500">Success Rate</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{workflow.lastRun}</p>
                    <p className="text-sm text-gray-500">Last Run</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Configure
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    View Logs
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Workflow Templates */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Workflow Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Content Research', description: 'Automated trending topic discovery', icon: TrendingUp },
                { name: 'Bulk Thumbnail Generator', description: 'Generate thumbnails for multiple videos', icon: FileText },
                { name: 'Social Media Cross-posting', description: 'Auto-post to multiple platforms', icon: Calendar }
              ].map((template, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                  <template.icon className="w-8 h-8 text-blue-600 mb-2" />
                  <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningHub;