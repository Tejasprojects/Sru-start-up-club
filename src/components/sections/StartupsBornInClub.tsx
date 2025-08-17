import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllStartups } from "@/lib/startupApiHelpers";
import { useToast } from "@/hooks/use-toast";
import { Startup } from "@/lib/types";
import { Building2, ExternalLink, Calendar, Users } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const StartupsBornInClub = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const loadStartups = async () => {
    console.log("StartupsBornInClub: Starting to load startups...");
    setLoading(true);
    setError(null);
    try {
      const result = await getAllStartups();
      console.log("StartupsBornInClub: API result:", result);
      
      if (result.success && result.data) {
        console.log("Fetched startups:", result.data);
        // Show all featured startups, or first 8 if none are featured
        const featuredStartups = result.data.filter(startup => startup.is_featured);
        const startupsToShow = featuredStartups.length > 0 ? featuredStartups : result.data.slice(0, 8);
        console.log("Startups to display:", startupsToShow);
        setStartups(startupsToShow);
      } else {
        console.error("Failed to load startups:", result.error);
        throw new Error(result.error || "Failed to load startups");
      }
    } catch (error: any) {
      console.error("Error fetching startups:", error);
      setError("Failed to load startups");
      toast({
        title: "Couldn't load startups",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("StartupsBornInClub: Component mounted, loading startups...");
    loadStartups();
  }, []);

  const isDarkMode = theme === "dark";

  const formatFoundingDate = (date: string | null) => {
    if (!date) return "Founded";
    return new Date(date).getFullYear().toString();
  };

  const getFundingStageColor = (stage: string | null) => {
    switch (stage?.toLowerCase()) {
      case 'seed':
        return 'bg-green-100 text-green-800';
      case 'series a':
        return 'bg-blue-100 text-blue-800';
      case 'series b':
        return 'bg-purple-100 text-purple-800';
      case 'growth':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  console.log("StartupsBornInClub: Rendering with", startups.length, "startups, loading:", loading, "error:", error);

  return (
    <section className={`w-full py-12 ${isDarkMode ? 'bg-[#111827]' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        <div className={`mb-8 ${isDarkMode ? 'bg-gray-800/30 p-4 rounded-lg' : ''}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-center md:text-left">
              <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : ''}`}>
                Startups Born in Our Club
              </h2>
              <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Discover amazing companies that started their journey with us
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/startups")}
              className={isDarkMode ? "border-gray-700 text-gray-200 hover:bg-gray-800" : ""}
            >
              View All Startups
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="ml-4 text-gray-600">Loading startups...</p>
          </div>
        ) : error ? (
          <div className={`text-center py-12 flex flex-col items-center gap-4 ${isDarkMode ? 'text-gray-300' : ''}`}>
            <Building2 className={`h-12 w-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-400'}`} />
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-500'}>
              {error}
            </p>
            <Button onClick={loadStartups} variant="outline">
              Try Again
            </Button>
          </div>
        ) : startups.length === 0 ? (
          <div className={`text-center py-12 flex flex-col items-center gap-4 ${isDarkMode ? 'text-gray-300' : ''}`}>
            <Building2 className={`h-12 w-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-400'}`} />
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-500'}>
              No startups featured at the moment.
            </p>
            <p className="text-sm text-gray-400">
              Add some startups in the admin panel to see them here.
            </p>
          </div>
        ) : (
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full max-w-6xl mx-auto"
            >
            <CarouselContent>
              {startups.map((startup) => (
                <CarouselItem key={startup.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className={`overflow-hidden h-full ${isDarkMode ? 'bg-gray-800/30 border-gray-700' : 'border-none'} shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
                    {/* Title First */}
                    <div className="p-6 pb-3">
                      <h3 className={`font-bold text-xl text-center ${isDarkMode ? 'text-white' : ''}`}>
                        {startup.name}
                      </h3>
                      {startup.is_featured && (
                        <div className="flex justify-center mt-2">
                          <Badge className="bg-primary text-white font-semibold">
                            Featured
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    {/* Image Second */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 mx-6 rounded-lg">
                      {startup.logo_url ? (
                        <img 
                          src={startup.logo_url} 
                          alt={`${startup.name} logo`} 
                          className="w-full h-full object-contain p-8"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="h-16 w-16 text-primary/60" />
                        </div>
                      )}
                    </div>
                    
                    {/* Text/Content Third */}
                    <CardContent className="p-6 pt-4">
                      <div className="mb-4">
                        <p className={`text-sm mb-3 line-clamp-2 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {startup.description || "Innovative startup making waves in the industry"}
                        </p>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        {startup.industry && (
                          <div className="flex items-center gap-2 text-sm justify-center">
                            <Building2 className="h-4 w-4 text-primary" />
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                              {startup.industry}
                            </span>
                          </div>
                        )}
                        
                        {startup.founding_date && (
                          <div className="flex items-center gap-2 text-sm justify-center">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                              Founded {formatFoundingDate(startup.founding_date)}
                            </span>
                          </div>
                        )}
                        
                        {startup.team_size && (
                          <div className="flex items-center gap-2 text-sm justify-center">
                            <Users className="h-4 w-4 text-primary" />
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                              {startup.team_size} team members
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {startup.funding_stage && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getFundingStageColor(startup.funding_stage)}`}
                          >
                            {startup.funding_stage}
                          </Badge>
                        )}
                        
                        {startup.website_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`group ${isDarkMode ? 'text-gray-300 hover:text-white' : ''}`}
                            onClick={() => window.open(startup.website_url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 transition-transform group-hover:scale-110" />
                            <span className="sr-only">Visit website</span>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className={`left-4 ${isDarkMode ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700' : ''}`} />
            <CarouselNext className={`right-4 ${isDarkMode ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700' : ''}`} />
          </Carousel>
        )}
      </div>
    </section>
  );
};
