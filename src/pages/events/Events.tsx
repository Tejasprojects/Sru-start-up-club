
import React, { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Calendar, Filter, Search, Calendar as CalendarIcon, MapPin, Users, Clock } from "lucide-react";
import { EventCarousel } from "@/components/events/EventCarousel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const Events = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [eventType, setEventType] = useState("all");
  const { pastEvents, isLoadingPast } = useEvents();
  
  // Filter options
  const eventTypes = [
    { value: "all", label: "All Types" },
    { value: "workshop", label: "Workshops" },
    { value: "networking", label: "Networking" },
    { value: "pitch", label: "Pitch Events" },
    { value: "hackathon", label: "Hackathons" },
    { value: "mentorship", label: "Mentorship" },
    { value: "general", label: "General" }
  ];

  // Filter past events based on search and type
  const filteredPastEvents = useMemo(() => {
    let filtered = [...pastEvents];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(term) || 
        (event.description || '').toLowerCase().includes(term)
      );
    }
    
    if (eventType !== "all") {
      filtered = filtered.filter(event => event.event_type === eventType);
    }
    
    return filtered;
  }, [pastEvents, searchTerm, eventType]);

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-primary/5 to-background pt-6 pb-12">
        <PageHeader
          title="Events"
          description="Discover upcoming events, workshops, and networking opportunities to grow your startup journey."
          icon={Calendar}
        />
        
        <div className="container mx-auto mt-6 max-w-6xl">
          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  {eventTypes.find(t => t.value === eventType)?.label || "All Types"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {eventTypes.map((type) => (
                  <DropdownMenuItem
                    key={type.value}
                    onClick={() => setEventType(type.value)}
                    className={eventType === type.value ? "bg-primary/10 text-primary" : ""}
                  >
                    {type.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button onClick={() => navigate("/events/calendar")} className="w-full sm:w-auto">
              <CalendarIcon className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
          </div>
          
          <Tabs defaultValue="upcoming" className="mb-8">
            <TabsList className="w-full bg-background/70 backdrop-blur-sm border p-1">
              <TabsTrigger value="upcoming" className="flex-1">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past" className="flex-1">Past Events</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="mt-6">
              <EventCarousel />
            </TabsContent>
            
            <TabsContent value="past" className="mt-6">
              {isLoadingPast ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Card key={item} className="overflow-hidden border-none shadow-md">
                      <Skeleton className="h-48 w-full" />
                      <CardHeader className="p-4 pb-0">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardHeader>
                      <CardContent className="p-4">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-8 w-32 mt-4" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredPastEvents.length === 0 ? (
                <Card className="text-center p-8">
                  <CardContent>
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Past Events Found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || eventType !== "all" 
                        ? "Try adjusting your search filters to find past events."
                        : "No past events available at the moment."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPastEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="h-48 overflow-hidden relative">
                        <img 
                          src={event.image_url || `https://images.unsplash.com/photo-1591115765373-5207764f72e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`} 
                          alt={event.title} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                            {event.event_type}
                          </Badge>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                      </div>
                      <CardHeader className="p-4 pb-0">
                        <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(event.start_datetime), "MMM dd, yyyy")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p className="text-sm line-clamp-2 text-muted-foreground mb-4">
                          {event.description || "A recap of this successful event."}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          {event.physical_address && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{event.physical_address}</span>
                            </div>
                          )}
                          {event.attendees_count && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{event.attendees_count} attended</span>
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full" 
                          onClick={() => navigate("/events/recordings")}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Events;
