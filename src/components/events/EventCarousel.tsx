
import React, { useState, useEffect } from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, Users, ArrowRight, Star, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { getUpcomingEvents } from "@/lib/eventHelpers";
import { CalendarEvent } from "@/lib/types";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

export const EventCarousel = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const upcomingEvents = await getUpcomingEvents();
        setEvents(upcomingEvents.slice(0, 6)); // Show up to 6 events
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleRegisterClick = (eventId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to register for events",
      });
      navigate("/login", { state: { returnUrl: "/events/upcoming" } });
    } else {
      navigate(`/events/upcoming?highlight=${eventId}`);
    }
  };

  // Format event location
  const formatLocation = (event: CalendarEvent) => {
    if (event.location_type === 'virtual') {
      return 'Virtual Event';
    } else if (event.location_type === 'physical') {
      return event.physical_address || 'In-person';
    } else {
      return 'Hybrid Event';
    }
  };

  // Event type labels mapping with premium styling
  const eventTypeConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    'general': { 
      label: 'General', 
      color: 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg', 
      icon: <Star className="w-3 h-3" /> 
    },
    'workshop': { 
      label: 'Workshop', 
      color: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200', 
      icon: <Sparkles className="w-3 h-3" /> 
    },
    'networking': { 
      label: 'Networking', 
      color: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200', 
      icon: <Users className="w-3 h-3" /> 
    },
    'pitch': { 
      label: 'Pitch Event', 
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-200', 
      icon: <Star className="w-3 h-3" /> 
    },
    'hackathon': { 
      label: 'Hackathon', 
      color: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200', 
      icon: <Sparkles className="w-3 h-3" /> 
    },
    'mentorship': { 
      label: 'Mentorship', 
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-200', 
      icon: <User className="w-3 h-3" /> 
    }
  };

  if (loading) {
    return (
      <section className={`py-12 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${isDarkMode ? 'bg-primary/20 text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
              <Calendar className="w-4 h-4" />
              Loading Events
            </div>
            <Skeleton className="h-8 w-80 mx-auto mb-4" />
            <Skeleton className="h-5 w-96 mx-auto" />
          </div>
          <div className="flex gap-4 overflow-hidden justify-center">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[280px] flex-shrink-0">
                <Skeleton className="h-[320px] w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className={`py-12 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${isDarkMode ? 'bg-primary/20 text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
              <Calendar className="w-4 h-4" />
              Upcoming Events
            </div>
            <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Stay Connected with Our Community
            </h2>
            <p className={`text-base max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              No upcoming events scheduled at this time. Check back later for exciting opportunities!
            </p>
          </div>
          <div className="flex justify-center">
            <Card className={`p-6 text-center border-none shadow-lg max-w-lg ${isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-primary/20' : 'bg-primary/10'}`}>
                <Calendar className={`w-6 h-6 ${isDarkMode ? 'text-primary-foreground' : 'text-primary'}`} />
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Be the first to know when new events are announced
              </p>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-12 relative overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-20 ${isDarkMode ? 'bg-primary/30' : 'bg-primary/20'} blur-3xl`}></div>
        <div className={`absolute -bottom-24 -left-24 w-48 h-48 rounded-full opacity-20 ${isDarkMode ? 'bg-secondary/30' : 'bg-secondary/20'} blur-3xl`}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 backdrop-blur-sm ${isDarkMode ? 'bg-primary/20 text-primary-foreground border border-primary/30' : 'bg-primary/10 text-primary border border-primary/20'}`}>
            <Calendar className="w-4 h-4" />
            Upcoming Events
          </div>
          <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Don't Miss Out on{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              What's Next
            </span>
          </h2>
          <p className={`text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Join exclusive events, workshops, and networking opportunities designed to accelerate your entrepreneurial journey
          </p>
        </div>

        {/* Enhanced Carousel */}
        <div className="relative">
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent className="-ml-2">
              {events.map((event, index) => {
                const config = eventTypeConfig[event.event_type] || eventTypeConfig['general'];
                
                return (
                  <CarouselItem key={event.id} className="pl-2 md:basis-1/2 lg:basis-1/3">
                    <div className="group transition-all duration-300 hover:scale-105">
                      <Card className={`overflow-hidden h-full border-none shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'}`}>
                        <div className="relative h-40 overflow-hidden">
                          <img 
                            src={event.image_url || `https://picsum.photos/seed/${event.id}/800/600`} 
                            alt={event.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                          
                          {/* Premium Badge */}
                          <Badge className={`absolute top-2 right-2 ${config.color} border-none backdrop-blur-sm text-xs`}>
                            <span className="flex items-center gap-1">
                              {config.icon}
                              {config.label}
                            </span>
                          </Badge>
                          
                          {/* Attendance Badge */}
                          <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-md ${isDarkMode ? 'bg-white/20 text-white' : 'bg-black/20 text-white'}`}>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {event.attendees_count || 0}+ joined
                            </span>
                          </div>
                        </div>
                        
                        <CardContent className="p-4">
                          <h3 className={`font-bold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {event.title}
                          </h3>
                          <p className={`text-sm mb-3 line-clamp-2 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {event.description}
                          </p>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2">
                              <div className={`p-1 rounded-lg ${isDarkMode ? 'bg-primary/20' : 'bg-primary/10'}`}>
                                <Calendar className="h-3 w-3 text-primary" />
                              </div>
                              <div>
                                <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {format(new Date(event.start_datetime), "EEEE, MMMM d")}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className={`p-1 rounded-lg ${isDarkMode ? 'bg-primary/20' : 'bg-primary/10'}`}>
                                <Clock className="h-3 w-3 text-primary" />
                              </div>
                              <div>
                                <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {format(new Date(event.start_datetime), "h:mm a")}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className={`p-1 rounded-lg ${isDarkMode ? 'bg-primary/20' : 'bg-primary/10'}`}>
                                <MapPin className="h-3 w-3 text-primary" />
                              </div>
                              <div>
                                <p className={`text-sm font-medium line-clamp-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {formatLocation(event)}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                            onClick={() => handleRegisterClick(event.id)}
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              Register Now
                              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            
            {/* Premium Navigation Buttons */}
            <CarouselPrevious className={`left-2 w-8 h-8 border-none shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 ${isDarkMode ? 'bg-gray-800/80 hover:bg-gray-700/80 text-white' : 'bg-white/80 hover:bg-white text-gray-900'}`} />
            <CarouselNext className={`right-2 w-8 h-8 border-none shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 ${isDarkMode ? 'bg-gray-800/80 hover:bg-gray-700/80 text-white' : 'bg-white/80 hover:bg-white text-gray-900'}`} />
          </Carousel>
        </div>

        {/* Premium CTA Section */}
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate("/events/upcoming")} 
            className={`group px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border-2 ${isDarkMode ? 'border-primary/50 bg-gray-800/50 hover:bg-primary/10 text-white' : 'border-primary/30 bg-white/50 hover:bg-primary/5 text-gray-900'} backdrop-blur-sm shadow-lg hover:shadow-xl`}
          >
            <span className="flex items-center gap-2">
              View All Events
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};
