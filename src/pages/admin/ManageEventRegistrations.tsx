
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminPageTemplate } from '@/components/admin/AdminPageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Users, UserCheck, UserX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EventRegistrationCard from '@/components/admin/EventRegistrationCard';

interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  registered_at: string;
  status: string;
  role: string;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
}

interface EventWithRegistrations {
  id: string;
  title: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  location_type: string;
  physical_address: string;
  virtual_meeting_url: string;
  image_url: string;
  registrations: EventRegistration[];
}

const ManageEventRegistrations = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const { toast } = useToast();

  const { data: eventsWithRegistrations, isLoading, refetch } = useQuery({
    queryKey: ['events-with-registrations', selectedStatus],
    queryFn: async () => {
      // First, get all events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select(`
          id,
          title,
          description,
          start_datetime,
          end_datetime,
          location_type,
          physical_address,
          virtual_meeting_url,
          image_url
        `)
        .order('start_datetime', { ascending: false });

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
        throw eventsError;
      }

      // Then get registrations for each event
      const eventsWithRegistrations: EventWithRegistrations[] = [];

      for (const event of eventsData || []) {
        let registrationsQuery = supabase
          .from('event_registrations')
          .select('*')
          .eq('event_id', event.id)
          .order('registered_at', { ascending: false });

        if (selectedStatus !== 'all') {
          registrationsQuery = registrationsQuery.eq('status', selectedStatus);
        }

        const { data: registrationData, error: regError } = await registrationsQuery;
        
        if (regError) {
          console.error('Error fetching registrations:', regError);
          continue;
        }

        // Get profile data for each registration
        if (registrationData && registrationData.length > 0) {
          const userIds = registrationData.map(reg => reg.user_id);
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, email, phone')
            .in('id', userIds);

          if (profileError) {
            console.error('Error fetching profiles:', profileError);
            continue;
          }

          const registrationsWithProfiles = registrationData.map(registration => {
            const profile = profileData?.find(p => p.id === registration.user_id);
            return {
              ...registration,
              profiles: profile || {
                first_name: 'Unknown',
                last_name: 'User',
                email: 'N/A',
                phone: 'N/A'
              }
            };
          });

          eventsWithRegistrations.push({
            ...event,
            registrations: registrationsWithProfiles as EventRegistration[]
          });
        } else {
          // Include events with no registrations if showing all
          if (selectedStatus === 'all') {
            eventsWithRegistrations.push({
              ...event,
              registrations: []
            });
          }
        }
      }
      
      return eventsWithRegistrations;
    },
  });

  const updateRegistrationStatus = async (registrationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('event_registrations')
        .update({ status: newStatus })
        .eq('id', registrationId);

      if (error) throw error;

      toast({
        title: 'Registration updated',
        description: `Registration status updated to ${newStatus}`,
      });

      refetch();
    } catch (error) {
      console.error('Error updating registration:', error);
      toast({
        title: 'Error',
        description: 'Failed to update registration status',
        variant: 'destructive',
      });
    }
  };

  const getOverallStats = () => {
    if (!eventsWithRegistrations) return { total: 0, registered: 0, attended: 0, cancelled: 0 };
    
    const allRegistrations = eventsWithRegistrations.flatMap(event => event.registrations);
    
    return {
      total: allRegistrations.length,
      registered: allRegistrations.filter(r => r.status === 'registered').length,
      attended: allRegistrations.filter(r => r.status === 'attended').length,
      cancelled: allRegistrations.filter(r => r.status === 'cancelled').length,
    };
  };

  const stats = getOverallStats();

  return (
    <AdminPageTemplate 
      title="Event Registrations Management"
      description="Manage event registrations organized by events"
      icon={Calendar}
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registered</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.registered}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attended</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.attended}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.cancelled}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="registered">Registered</SelectItem>
              <SelectItem value="attended">Attended</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Events with Registrations */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : eventsWithRegistrations && eventsWithRegistrations.length > 0 ? (
            eventsWithRegistrations.map((event) => (
              <EventRegistrationCard
                key={event.id}
                event={event}
                onUpdateRegistrationStatus={updateRegistrationStatus}
              />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No events found</p>
                <p className="text-sm text-muted-foreground">
                  {selectedStatus === 'all' 
                    ? 'No events with registrations found'
                    : `No events with ${selectedStatus} registrations found`
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminPageTemplate>
  );
};

export default ManageEventRegistrations;
