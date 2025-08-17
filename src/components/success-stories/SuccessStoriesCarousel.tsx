
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
import { Building, User, Calendar, ArrowRight, BadgeAlert, Trophy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFeaturedSuccessStories } from "@/lib/successStoriesHelpers";
import { SuccessStory } from "@/lib/types";
import { useTheme } from "@/context/ThemeContext";
import { useNavigate } from "react-router-dom";

export const SuccessStoriesCarousel = () => {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch more featured stories to show in the slider
        const result = await getFeaturedSuccessStories(50);
        if (result.success) {
          setStories(result.data);
        } else {
          setError("Failed to load success stories");
        }
      } catch (error) {
        console.error("Error fetching success stories:", error);
        setError("Failed to load success stories");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const isDarkMode = theme === "dark";

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-muted/30 via-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <Trophy className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/70 bg-clip-text text-transparent">
                Success Stories
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

  if (error || stories.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-muted/30 via-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <Trophy className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/70 bg-clip-text text-transparent">
                Success Stories
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
                Amazing success stories are being written right now. Check back soon to see what our members have achieved!
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
        <div className="flex items-center justify-between mb-8">
          <div className="text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <Trophy className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/70 bg-clip-text text-transparent">
                Success Stories
              </h2>
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
              Discover how students like you have transformed their innovative ideas into successful businesses with our support.
            </p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => navigate("/community/success-stories")}
            className="group bg-card/60 border-border/40 hover:bg-card/80 backdrop-blur-sm shadow-sm"
          >
            <Trophy className="h-4 w-4 mr-2" />
            View All Stories
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {stories.map((story) => (
              <CarouselItem key={story.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                <Card className="overflow-hidden h-full border-none shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card/70 backdrop-blur-sm">
                  {/* Title */}
                  <div className="p-4 pb-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold line-clamp-1">{story.company_name}</h3>
                      {story.featured && (
                        <Badge className="bg-primary text-primary-foreground font-semibold shadow-sm">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative h-48 md:h-56 mt-3 mx-4 rounded-lg overflow-hidden bg-muted/40">
                    <img 
                      src={story.image_url || `https://picsum.photos/seed/${story.id}/800/600`} 
                      alt={story.company_name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                        target.alt = "Image failed to load";
                      }}
                    />
                  </div>

                  {/* Text / Meta */}
                  <CardContent className="p-4">
                    {story.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                        {story.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        <span className="line-clamp-1">{story.founder}</span>
                      </div>
                      {story.year && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{story.year}</span>
                        </div>
                      )}
                      {story.industry && (
                        <div className="flex items-center gap-1">
                          <Building className="h-3.5 w-3.5" />
                          <span className="line-clamp-1">{story.industry}</span>
                        </div>
                      )}
                      <div className="ml-auto">
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="bg-white/90 text-black hover:bg-white"
                          onClick={() => navigate(`/community/success-stories/${story.id}`)}
                        >
                          Read Full Story
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 bg-white/80 backdrop-blur-sm border-none shadow-md hover:bg-white" />
          <CarouselNext className="right-0 bg-white/80 backdrop-blur-sm border-none shadow-md hover:bg-white" />
        </Carousel>
      </div>
    </section>
  );
};
