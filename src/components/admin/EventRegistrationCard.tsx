
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronUp, Calendar, MapPin, Users, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';

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

interface EventRegistrationCardProps {
  event: EventWithRegistrations;
  onUpdateRegistrationStatus: (registrationId: string, newStatus: string) => void;
}

const EventRegistrationCard: React.FC<EventRegistrationCardProps> = ({
  event,
  onUpdateRegistrationStatus,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadge = (status: string) => {
    const variants = {
      registered: 'default',
      attended: 'default',
      cancelled: 'destructive',
      pending: 'secondary',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  const getRegistrationStats = () => {
    const stats = {
      total: event.registrations.length,
      registered: event.registrations.filter(r => r.status === 'registered').length,
      attended: event.registrations.filter(r => r.status === 'attended').length,
      cancelled: event.registrations.filter(r => r.status === 'cancelled').length,
    };
    return stats;
  };

  const stats = getRegistrationStats();

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          {event.image_url && (
            <img
              src={event.image_url}
              alt={event.title}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(event.start_datetime), 'PPp')}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {event.location_type === 'virtual' ? 'Virtual' : event.physical_address}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {stats.total} registrations
              </div>
            </div>
            <div className="flex gap-2 mb-3">
              <Badge variant="outline">{stats.registered} Registered</Badge>
              <Badge variant="outline">{stats.attended} Attended</Badge>
              <Badge variant="outline">{stats.cancelled} Cancelled</Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {isExpanded ? 'Hide' : 'Show'} Details
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          {event.description && (
            <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
          )}
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participant</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {event.registrations.map((registration) => (
                <TableRow key={registration.id}>
                  <TableCell>
                    <div className="font-medium">
                      {registration.profiles?.first_name} {registration.profiles?.last_name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3" />
                        {registration.profiles?.email}
                      </div>
                      {registration.profiles?.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3" />
                          {registration.profiles.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(registration.registered_at), 'PPp')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{registration.role}</Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(registration.status)}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={registration.status}
                      onValueChange={(value) => onUpdateRegistrationStatus(registration.id, value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="registered">Registered</SelectItem>
                        <SelectItem value="attended">Attended</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      )}
    </Card>
  );
};

export default EventRegistrationCard;
