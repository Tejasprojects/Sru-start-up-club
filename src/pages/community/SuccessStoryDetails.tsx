import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SuccessStory } from "@/lib/types";
import { getSuccessStoryById } from "@/lib/successStoriesHelpers";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";
import { Trophy, ArrowLeft, Building, Calendar, Target, ExternalLink, User } from "lucide-react";

const SuccessStoryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<SuccessStory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    if (id) {
      fetchStory(id);
    }
  }, [id]);

  const fetchStory = async (storyId: string) => {
    setIsLoading(true);
    try {
      const result = await getSuccessStoryById(storyId);
      
      if (result.success && result.data) {
        setStory(result.data);
      } else {
        // Use fallback data if not found
        setStory(getFallbackStory(storyId));
      }
    } catch (error) {
      console.error("Error fetching success story:", error);
      toast({
        title: "Error",
        description: "Failed to load success story. Using fallback data.",
        variant: "destructive",
      });
      setStory(getFallbackStory(storyId));
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackStory = (storyId: string): SuccessStory => {
    const fallbackStories: Record<string, SuccessStory> = {
      "6cf5545c-7f46-4c01-b72b-61c7759ca634": {
        id: storyId,
        company_name: "TechFlow Solutions",
        founder: "Sophia Chen",
        year: 2021,
        industry: "SaaS",
        description: "TechFlow Solutions started as a small project in our startup community and has grown into a successful SaaS platform serving over 500 businesses worldwide. The company specializes in workflow automation and productivity tools that help teams streamline their operations and increase efficiency.",
        achievements: [
          "Raised $2M in seed funding from leading VCs",
          "Expanded to 15 full-time employees",
          "Featured in TechCrunch and Forbes",
          "Serving 500+ businesses globally",
          "98% customer satisfaction rate",
          "Partnership with Microsoft Azure"
        ],
        user_id: "user1",
        featured: true,
        image_url: "/lovable-uploads/c85d2794-e9f3-4d6a-bf35-8563a6ca4813.png",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    };

    return fallbackStories[storyId] || fallbackStories["6cf5545c-7f46-4c01-b72b-61c7759ca634"];
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Loading success story...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!story) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Trophy className={`w-16 h-16 mx-auto ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
            <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Story Not Found
            </h2>
            <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              The success story you're looking for doesn't exist.
            </p>
            <Link to="/community/success-stories">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Success Stories
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Back Navigation */}
        <div className="flex items-center gap-4">
          <Link to="/community/success-stories">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Success Stories
            </Button>
          </Link>
          {story.featured && (
            <Badge variant="secondary" className="bg-gradient-to-r from-primary/20 to-transparent">
              <Trophy className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>

        {/* Page Header */}
        <PageHeader
          title={story.company_name}
          description={`Founded by ${story.founder}${story.year ? ` in ${story.year}` : ""}`}
          icon={Building}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Image */}
            {story.image_url && (
              <Card className={`overflow-hidden ${isDarkMode ? "bg-gray-800/50 border-gray-700" : ""}`}>
                <div className="aspect-video w-full">
                  <img
                    src={story.image_url}
                    alt={`${story.company_name} company image`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/lovable-uploads/c85d2794-e9f3-4d6a-bf35-8563a6ca4813.png";
                    }}
                  />
                </div>
              </Card>
            )}

            {/* Story Description */}
            <Card className={`${isDarkMode ? "bg-gray-800/50 border-gray-700" : ""}`}>
              <CardHeader>
                <CardTitle className={`text-xl ${isDarkMode ? "text-white" : ""}`}>
                  Company Story
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-lg leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {story.description}
                </p>
              </CardContent>
            </Card>

            {/* Achievements */}
            {story.achievements && story.achievements.length > 0 && (
              <Card className={`${isDarkMode ? "bg-gray-800/50 border-gray-700" : ""}`}>
                <CardHeader>
                  <CardTitle className={`text-xl flex items-center gap-2 ${isDarkMode ? "text-white" : ""}`}>
                    <Target className="w-5 h-5 text-primary" />
                    Key Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {story.achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-4 rounded-lg ${
                          isDarkMode ? "bg-gray-700/30" : "bg-gray-50"
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {achievement}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Details */}
            <Card className={`${isDarkMode ? "bg-gray-800/50 border-gray-700" : ""}`}>
              <CardHeader>
                <CardTitle className={`text-lg ${isDarkMode ? "text-white" : ""}`}>
                  Company Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-primary" />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      Founder
                    </p>
                    <p className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      {story.founder}
                    </p>
                  </div>
                </div>

                {story.year && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-primary" />
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Founded
                      </p>
                      <p className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        {story.year}
                      </p>
                    </div>
                  </div>
                )}

                {story.industry && (
                  <div className="flex items-center gap-3">
                    <Building className="w-4 h-4 text-primary" />
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Industry
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {story.industry}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className={`${isDarkMode ? "bg-gray-800/50 border-gray-700" : ""}`}>
              <CardContent className="p-6">
                <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? "text-white" : ""}`}>
                  Get Inspired
                </h3>
                <p className={`text-sm mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Learn more about our startup community and how you can be part of similar success stories.
                </p>
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link to="/join">
                      Join Our Community
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/community/success-stories">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      More Stories
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SuccessStoryDetails;