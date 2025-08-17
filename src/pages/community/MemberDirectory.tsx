
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MainLayout } from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Users, MapPin, Building, Briefcase } from 'lucide-react';
import { UserProfileDialog } from '@/components/community/UserProfileDialog';

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  bio?: string;
  photo_url?: string;
  company?: string;
  profession?: string;
  location?: string;
  role: string;
  interests?: string[];
  industry?: string;
}

const MemberDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  const { data: members, isLoading } = useQuery({
    queryKey: ['members', searchTerm, roleFilter],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .neq('role', 'admin')
        .order('first_name');

      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%,profession.ilike.%${searchTerm}%`);
      }

      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data as Member[];
    },
  });

  const handleViewProfile = (member: Member) => {
    setSelectedMember(member);
    setProfileDialogOpen(true);
  };

  const getRoleColor = (role: string) => {
    const colors = {
      student: 'bg-blue-100 text-blue-800',
      alumni: 'bg-green-100 text-green-800',
      mentor: 'bg-purple-100 text-purple-800',
      entrepreneur: 'bg-orange-100 text-orange-800',
      investor: 'bg-red-100 text-red-800',
    } as const;
    
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-4xl font-bold">Member Directory</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with fellow entrepreneurs, students, mentors, and industry professionals 
            in our startup community.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search members by name, company, or profession..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="alumni">Alumni</SelectItem>
                <SelectItem value="mentor">Mentors</SelectItem>
                <SelectItem value="entrepreneur">Entrepreneurs</SelectItem>
                <SelectItem value="investor">Investors</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Members Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members?.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage 
                          src={member.photo_url} 
                          alt={`${member.first_name} ${member.last_name}`} 
                        />
                        <AvatarFallback>
                          {member.first_name?.[0]}{member.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {member.first_name} {member.last_name}
                        </h3>
                        <Badge className={getRoleColor(member.role)}>
                          {member.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2 mb-4">
                    {(member.profession || member.company) && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">
                          {member.profession}
                          {member.profession && member.company && ' at '}
                          {member.company}
                        </span>
                      </div>
                    )}
                    
                    {member.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{member.location}</span>
                      </div>
                    )}
                    
                    {member.industry && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Building className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{member.industry}</span>
                      </div>
                    )}
                  </div>

                  {member.bio && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {member.bio}
                    </p>
                  )}

                  {member.interests && member.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {member.interests.slice(0, 3).map((interest, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                      {member.interests.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{member.interests.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <Button 
                    onClick={() => handleViewProfile(member)}
                    className="w-full"
                    variant="outline"
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && members?.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No members found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find more members.
            </p>
          </div>
        )}
      </div>

      {/* Profile Dialog */}
      <UserProfileDialog
        user={selectedMember}
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
      />
    </MainLayout>
  );
};

export default MemberDirectory;
