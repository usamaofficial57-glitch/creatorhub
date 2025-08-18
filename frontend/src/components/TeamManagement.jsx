import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Users, 
  Search, 
  Star, 
  Clock, 
  DollarSign,
  Plus,
  MessageCircle,
  CheckCircle,
  UserPlus,
  Filter,
  Briefcase
} from 'lucide-react';
import { mockFreelancers } from '../data/mockData';
import { useToast } from '../hooks/use-toast';

const TeamManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const { toast } = useToast();
  
  const filteredFreelancers = mockFreelancers.filter(freelancer => {
    const matchesSearch = freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         freelancer.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         freelancer.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProfession = selectedProfession === 'all' || freelancer.profession === selectedProfession;
    const matchesAvailability = availabilityFilter === 'all' || 
                               (availabilityFilter === 'available' && freelancer.availability === 'Available');
    
    return matchesSearch && matchesProfession && matchesAvailability;
  });

  const contactFreelancer = (freelancerId) => {
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the freelancer",
    });
  };

  const hireFreelancer = (freelancerId) => {
    toast({
      title: "Hire Request Sent",
      description: "Your hiring request has been sent for review",
    });
  };

  const getAvailabilityColor = (availability) => {
    return availability === 'Available' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team & Freelancers</h1>
          <p className="text-gray-600 mt-1">Find and manage talented freelancers for your content</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Briefcase className="w-4 h-4 mr-2" />
            Post Job
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Freelancer
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search freelancers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          
          <Select value={selectedProfession} onValueChange={setSelectedProfession}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Profession" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Professions</SelectItem>
              <SelectItem value="Video Editor">Video Editor</SelectItem>
              <SelectItem value="Thumbnail Designer">Thumbnail Designer</SelectItem>
              <SelectItem value="Script Writer">Script Writer</SelectItem>
              <SelectItem value="Voice Over Artist">Voice Over Artist</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="busy">Busy</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Freelancers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFreelancers.map((freelancer) => (
          <Card key={freelancer.id} className="p-6 hover:shadow-lg transition-all duration-200 group">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src={freelancer.avatar}
                    alt={freelancer.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{freelancer.name}</h3>
                    <p className="text-sm text-gray-600">{freelancer.profession}</p>
                  </div>
                </div>
                <Badge className={getAvailabilityColor(freelancer.availability)}>
                  {freelancer.availability}
                </Badge>
              </div>

              {/* Rating & Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-gray-900">{freelancer.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-semibold text-gray-900">{freelancer.completedProjects}</span>
                  </div>
                  <p className="text-xs text-gray-500">Projects</p>
                </div>
              </div>

              {/* Rate */}
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="flex items-center justify-center space-x-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-gray-900">${freelancer.hourlyRate}</span>
                  <span className="text-sm text-gray-600">/hour</span>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {freelancer.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Specialization */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-1">Specialization</h4>
                <p className="text-sm text-blue-800">{freelancer.specialization}</p>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-4 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => contactFreelancer(freelancer.id)}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Message
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => hireFreelancer(freelancer.id)}
                  disabled={freelancer.availability !== 'Available'}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Hire
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Team Building CTA */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Scale Your Content Production
            </h3>
            <p className="text-gray-600 mb-4">
              Build a team of skilled freelancers to increase your upload frequency and content quality
            </p>
            <div className="flex space-x-3">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Briefcase className="w-4 h-4 mr-2" />
                Post Your First Job
              </Button>
              <Button variant="outline">
                Browse More Freelancers
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Users className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </Card>

      {/* Empty State */}
      {filteredFreelancers.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No freelancers found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your filters or post a job to attract talented freelancers.
          </p>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Briefcase className="w-4 h-4 mr-2" />
            Post a Job
          </Button>
        </Card>
      )}
    </div>
  );
};

export default TeamManagement;