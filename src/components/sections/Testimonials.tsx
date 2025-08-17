
import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "../ui/card";
import { ExternalLink, Building, User, Calendar, BadgeAlert } from "lucide-react";
import { getFeaturedSuccessStories } from "@/lib/successStoriesHelpers";
import { SuccessStory } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";

export const Testimonials = () => {
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { theme } = useTheme();

  useEffect(() => {
    async function loadSuccessStories() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getFeaturedSuccessStories(5); // Load more for carousel
        if (result.success && result.data.length > 0) {
          setSuccessStories(result.data);
        } else {
          // Only show toast if there are no success stories
          if (!result.success) {
            setError("Failed to load success stories");
            toast({
              title: "Couldn't load success stories",
              description: "Please check the admin dashboard to add success stories",
              variant: "destructive",
            });
          }
          // Use fallback data only if we couldn't fetch any stories
          setSuccessStories(getFallbackStories());
        }
      } catch (error) {
        console.error("Error loading success stories:", error);
        setError("Failed to load success stories");
        toast({
          title: "Error loading success stories",
          description: "Please try again later",
          variant: "destructive",
        });
        setSuccessStories(getFallbackStories());
      } finally {
        setIsLoading(false);
      }
    }

    loadSuccessStories();
  }, [toast]);

  // Fallback success stories
  const getFallbackStories = (): SuccessStory[] => {
    return [
      {
        id: '1',
        company_name: "NovaTech",
        founder: "Alex Johnson",
        year: 2022,
        description: "Started as a university project and now an AI-powered education platform with over 50,000 users and $2M in funding.",
        user_id: "fallback1",
        industry: "Education",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        company_name: "GreenGrow",
        founder: "Sarah Miller",
        year: 2021,
        description: "A sustainable agriculture startup that developed from our hackathon and now partners with farmers across the country.",
        user_id: "fallback2",
        industry: "Agriculture",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        company_name: "FinScape",
        founder: "Michael Chen",
        year: 2023,
        description: "A fintech app built by our club members that simplifies investing for students and recently acquired by a major bank.",
        user_id: "fallback3",
        industry: "FinTech",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
    ];
  };

  const isDarkMode = theme === "dark";

  return (
    <section id="success-stories" className={`w-full py-12 ${isDarkMode ? 'bg-[#111827]' : 'bg-secondary/30'}`}>
      <div className="container mx-auto px-4">
        <div className={`text-center mb-8 ${isDarkMode ? 'bg-gray-800/30 p-4 rounded-lg' : ''}`}>
          <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
            Success Stories
          </div>
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${isDarkMode ? 'text-white' : ''}`}>
            Startups Born in Our Club
          </h2>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-foreground/80'}`}>
            Discover how students like you have transformed their innovative ideas into successful businesses with our support.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : successStories.length === 0 ? (
          <div className={`text-center py-12 flex flex-col items-center gap-4 ${isDarkMode ? 'text-gray-300' : ''}`}>
            <BadgeAlert className={`h-12 w-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-400'}`} />
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-500'}>No success stories available at the moment.</p>
          </div>
        ) : (
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent>
              {successStories.map((story) => (
                <CarouselItem key={story.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className={`overflow-hidden h-full ${isDarkMode ? 'bg-gray-800/30 border-gray-700' : 'border-none'} shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={story.image_url || `https://picsum.photos/seed/${story.id}/800/600`} 
                        alt={`${story.company_name} logo`} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                          target.alt = "Image failed to load";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                      <div className="absolute top-2 right-2 bg-primary/10 text-primary font-medium px-3 py-1 rounded-full text-sm">
                        Founded {story.year}
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className={`text-xl font-bold mb-2 line-clamp-1 ${isDarkMode ? 'text-white' : ''}`}>{story.company_name}</h3>
                      <p className={`text-sm mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-foreground/70'}`}>
                        {story.description}
                      </p>
                      
                      <div className={`space-y-2 text-sm mb-4 ${isDarkMode ? 'text-gray-300' : ''}`}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          <span>Founded by {story.founder}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{story.year}</span>
                        </div>
                        {story.industry && (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-primary" />
                            <span>{story.industry}</span>
                          </div>
                        )}
                      </div>
                      
                      <a 
                        href={`/community/success-stories/${story.id}`} 
                        className="inline-flex items-center text-primary font-medium hover:underline transition-colors"
                      >
                        Read Full Story
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className={`left-4 ${isDarkMode ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700' : 'bg-white/80 backdrop-blur-sm border-none shadow-md hover:bg-white'}`} />
            <CarouselNext className={`right-4 ${isDarkMode ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700' : 'bg-white/80 backdrop-blur-sm border-none shadow-md hover:bg-white'}`} />
          </Carousel>
        )}
      </div>
    </section>
  );
};
