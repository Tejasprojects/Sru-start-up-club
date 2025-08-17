import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Star, Globe, Linkedin, Twitter, ExternalLink, MapPin, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useImportantMembers } from "@/hooks/useImportantMembers";

const ImportantMembers = () => {
  const { data: members, isLoading, error } = useImportantMembers();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Our Key Community Members</h1>
            <p className="text-xl text-muted-foreground">
              Meet the amazing individuals who make our startup community thrive
            </p>
          </div>
          
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Our Key Community Members</h1>
            <p className="text-xl text-muted-foreground">
              Meet the amazing individuals who make our startup community thrive
            </p>
          </div>
          
          <div className="bg-red-50 border border-red-200 p-6 rounded-md text-center">
            <p className="text-red-800">Error loading members. Please try again later.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const sortedMembers = members?.sort((a, b) => a.display_order - b.display_order) || [];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Star className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-foreground">Our Key Community Members</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Meet the amazing individuals who make our startup community thrive. 
            These are the leaders, mentors, and innovators who guide and inspire our members.
          </p>
        </div>

        {/* Members Grid */}
        {sortedMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedMembers.map((member) => (
              <Card key={member.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24 border-4 border-primary/10 group-hover:border-primary/20 transition-colors">
                      <AvatarImage src={member.avatar_url || ""} alt={member.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                        {member.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {member.name}
                  </CardTitle>
                  
                  <p className="text-primary font-medium">{member.role}</p>
                  
                  {member.company && (
                    <div className="flex items-center justify-center text-muted-foreground text-sm mt-1">
                      <Building className="h-4 w-4 mr-1" />
                      {member.company}
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Expertise Tags */}
                  {member.expertise && member.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4 justify-center">
                      {member.expertise.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {member.expertise.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{member.expertise.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {/* Bio */}
                  {member.bio && (
                    <p className="text-muted-foreground text-sm text-center mb-4 line-clamp-3">
                      {member.bio}
                    </p>
                  )}
                  
                  {/* Social Links */}
                  <div className="flex justify-center gap-3 pt-4 border-t border-border/50">
                    {member.linkedin_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => window.open(member.linkedin_url, '_blank')}
                      >
                        <Linkedin className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {member.twitter_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-400 hover:text-blue-500 hover:bg-blue-50"
                        onClick={() => window.open(member.twitter_url, '_blank')}
                      >
                        <Twitter className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {member.website_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                        onClick={() => window.open(member.website_url, '_blank')}
                      >
                        <Globe className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {!member.linkedin_url && !member.twitter_url && !member.website_url && (
                      <span className="text-muted-foreground text-xs">No social links</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Members Found</h3>
            <p className="text-muted-foreground">
              Our key community members will be displayed here once they're added.
            </p>
          </div>
        )}
        
        {/* Call to Action */}
        {sortedMembers.length > 0 && (
          <div className="mt-16 text-center p-8 bg-muted/30 rounded-lg border">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Want to Connect with Our Members?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join our community to network with these amazing individuals and access exclusive 
              mentorship opportunities, startup resources, and collaborative projects.
            </p>
            <Button size="lg" className="mr-4">
              Join Our Community
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ImportantMembers;