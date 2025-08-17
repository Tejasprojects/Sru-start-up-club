
import React, { useEffect, useState, useCallback } from "react";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAllStartups } from "@/lib/startupApiHelpers";
import { useToast } from "@/hooks/use-toast";
import { Startup } from "@/lib/types";
import { 
  Rocket, 
  ExternalLink, 
  Users, 
  Calendar, 
  TrendingUp, 
  BadgeAlert,
  Sparkles,
  Building2,
  ArrowRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Autoplay from "embla-carousel-autoplay";
import { useNavigate } from "react-router-dom";

interface StartupWithFounder extends Startup {
  founder?: {
    first_name: string;
    last_name: string;
    email: string;
    photo_url?: string;
  } | null;
}

export const StartupShowcase: React.FC = () => {
  const [startups, setStartups] = useState<StartupWithFounder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const autoplay = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  useEffect(() => {
    loadStartups();
  }, []);

  const loadStartups = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllStartups();
      
      if (!response.success) {
        throw new Error(response.error);
      }

      // Add founder info to startups and filter for featured ones
      const startupsWithFounders: StartupWithFounder[] = await Promise.all(
        (response.data || [])
          .filter(startup => startup.is_featured) // Only show featured startups
          .slice(0, 6) // Limit to 6 startups for better performance
          .map(async (startup) => {
            if (startup.founder_id) {
              try {
                const { data, error } = await supabase
                  .from("profiles")
                  .select("first_name, last_name, email, photo_url")
                  .eq("id", startup.founder_id)
                  .single();
                
                if (!error && data) {
                  return {
                    ...startup,
                    founder: data
                  };
                }
              } catch (err) {
                console.error("Error fetching founder:", err);
              }
            }
            return { ...startup, founder: null };
          })
      );
      
      setStartups(startupsWithFounders);
    } catch (error: any) {
      console.error("Error fetching startups:", error.message);
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short'
    }).format(date);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-muted/30 via-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <Rocket className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/70 bg-clip-text text-transparent">
                Startups Born in Our Club
              </h2>
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-4">
              Discover how students like you have transformed their innovative ideas into successful businesses with our support.
            </p>
            <div className="h-1 w-40 bg-gradient-to-r from-primary via-primary/80 to-primary/60 mx-auto rounded-full"></div>
          </div>
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || startups.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-muted/30 via-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <Rocket className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/70 bg-clip-text text-transparent">
                Startups Born in Our Club
              </h2>
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-4">
              Discover how students like you have transformed their innovative ideas into successful businesses with our support.
            </p>
            <div className="h-1 w-40 bg-gradient-to-r from-primary via-primary/80 to-primary/60 mx-auto rounded-full"></div>
          </div>
          <div className="text-center py-16 bg-card/30 rounded-2xl border border-border/30 backdrop-blur-sm">
            <div className="max-w-md mx-auto">
              <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
                <BadgeAlert className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg">
                Amazing startups are being built right now. Check back soon to see what our members are creating!
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="text-left">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <Rocket className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/70 bg-clip-text text-transparent">
                Startups Born in Our Club
              </h2>
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mb-4">
              Discover how students like you have transformed their innovative ideas into successful businesses with our support.
            </p>
            <div className="h-1 w-40 bg-gradient-to-r from-primary via-primary/80 to-primary/60 rounded-full"></div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => navigate("/startups/browse")}
            className="group bg-card/60 border-border/40 hover:bg-card/80 backdrop-blur-sm shadow-sm"
          >
            <Building2 className="h-4 w-4 mr-2" />
            View All 
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
            duration: 30,
          }}
          plugins={[autoplay.current]}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {startups.map((startup) => (
              <CarouselItem key={startup.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:scale-105 bg-card/70 backdrop-blur-sm border-border/40 hover:bg-card/90">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={startup.logo_url || `https://picsum.photos/seed/${startup.id}/800/600`} 
                      alt={startup.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                    {startup.industry && (
                      <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground font-semibold">
                        {startup.industry}
                      </Badge>
                    )}
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-sm">
                        <AvatarImage src={startup.logo_url || ''} alt={startup.name} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                          {startup.name.substring(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg leading-tight text-foreground">
                          {startup.name}
                        </CardTitle>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {startup.funding_stage && (
                            <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                              {startup.funding_stage}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm line-clamp-3 text-muted-foreground">
                      {startup.description || "Innovative startup making an impact in their industry."}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Founded {formatDate(startup.founding_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{startup.team_size || "5+"} team</span>
                      </div>
                    </div>

                    {startup.founder && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/30">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={startup.founder.photo_url || ''} alt={`${startup.founder.first_name} ${startup.founder.last_name}`} />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {startup.founder.first_name?.[0]}{startup.founder.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground">
                            {startup.founder.first_name} {startup.founder.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Founder
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {startup.website_url && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs border-border/40 hover:bg-muted/50"
                          onClick={() => window.open(startup.website_url, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Website
                        </Button>
                      )}
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="flex-1 text-xs bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-sm"
                        onClick={() => navigate(`/startups/browse`)}
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <CarouselPrevious className="left-0 bg-card/80 border-border/40 hover:bg-card backdrop-blur-sm shadow-sm" />
          <CarouselNext className="right-0 bg-card/80 border-border/40 hover:bg-card backdrop-blur-sm shadow-sm" />
        </Carousel>
      </div>
    </section>
  );
};
