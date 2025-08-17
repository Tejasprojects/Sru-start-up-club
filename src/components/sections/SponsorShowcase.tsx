
import React, { useEffect, useState } from 'react';
import { useSponsors } from '@/hooks/useSponsors';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Handshake, Sparkles, Star, Zap } from 'lucide-react';

export const SponsorShowcase: React.FC = () => {
  const { sponsors, loading, error } = useSponsors();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Create infinite scrolling effect for sponsors
  useEffect(() => {
    if (sponsors.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sponsors.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [sponsors.length]);

  if (loading) {
    return (
      <section className="relative w-full py-24 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-accent/10 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          {/* Premium header */}
          <div className="text-center mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Star className="h-4 w-4 text-primary" />
              <span className="text-primary font-medium text-sm">Trusted Partners</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold">
              <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                Our Sponsors
              </span>
            </h2>
            
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
            
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              Proudly partnered with industry leaders who share our vision and drive innovation forward
            </p>
          </div>

          {/* Loading skeleton carousel */}
          <Carousel className="w-full max-w-7xl mx-auto" autoPlay={true} autoPlayInterval={3000}>
            <CarouselContent className="-ml-4">
              {[...Array(6)].map((_, i) => (
                <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="group relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-12 hover:bg-card/60 transition-all duration-700 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <Skeleton className="h-24 w-full rounded-xl bg-muted/30" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </section>
    );
  }

  if (error || sponsors.length === 0) {
    return (
      <section className="relative w-full py-24 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-accent/10 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          {/* Premium header */}
          <div className="text-center mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Star className="h-4 w-4 text-primary" />
              <span className="text-primary font-medium text-sm">Trusted Partners</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold">
              <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                Our Sponsors
              </span>
            </h2>
            
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
            
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              Proudly partnered with industry leaders who share our vision and drive innovation forward
            </p>
          </div>

          {/* Empty state with premium design */}
          <div className="text-center py-20">
            <div className="relative max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-12">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-2xl"></div>
                  <div className="relative w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Zap className="h-10 w-10 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Building Amazing Partnerships
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  We're actively connecting with innovative companies that share our mission. 
                  Exciting partnerships coming soon!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Filter only active sponsors
  const activeSponsors = sponsors.filter(sponsor => sponsor.is_active);
  
  if (activeSponsors.length === 0) {
    return (
      <section className="relative w-full py-24 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-accent/10 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          {/* Premium header */}
          <div className="text-center mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Star className="h-4 w-4 text-primary" />
              <span className="text-primary font-medium text-sm">Trusted Partners</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold">
              <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                Our Sponsors
              </span>
            </h2>
            
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
            
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              Proudly partnered with industry leaders who share our vision and drive innovation forward
            </p>
          </div>

          {/* Empty state with premium design */}
          <div className="text-center py-20">
            <div className="relative max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-12">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-2xl"></div>
                  <div className="relative w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Zap className="h-10 w-10 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Building Amazing Partnerships
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  We're actively connecting with innovative companies that share our mission. 
                  Exciting partnerships coming soon!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full py-24 overflow-hidden">
      {/* Premium animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-accent/10 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.02] bg-dot-md"></div>
      </div>
      
      <div className="relative container mx-auto px-4">
        {/* Premium header */}
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm animate-fade-in">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-primary font-medium text-sm">Trusted Partners</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold animate-slide-up">
            <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Our Sponsors
            </span>
          </h2>
          
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full animate-scale-in"></div>
          
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in animate-delay-200">
            Proudly partnered with industry leaders who share our vision and drive innovation forward
          </p>
        </div>

        {/* Premium sponsors carousel */}
        <div className="relative mb-16">
          <Carousel 
            className="w-full max-w-7xl mx-auto" 
            autoPlay={true} 
            autoPlayInterval={4000}
            pauseOnHover={true}
          >
            <CarouselContent className="-ml-6">
              {activeSponsors.map((sponsor, index) => (
                <CarouselItem key={sponsor.id} className="pl-6 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="group relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-12 hover:bg-card/60 hover:border-primary/30 hover:-translate-y-3 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-700 flex items-center justify-center animate-fade-in h-40">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-3xl opacity-0 group-hover:opacity-30 blur transition-opacity duration-500"></div>
                    
                    {/* Logo container - much bigger */}
                    <div className="relative w-full h-24 flex items-center justify-center">
                      <img 
                        src={sponsor.logo_url || '/placeholder.svg'} 
                        alt={sponsor.company_name} 
                        className="max-h-full max-w-full object-contain filter group-hover:brightness-110 group-hover:contrast-110 group-hover:scale-105 transition-all duration-500"
                      />
                      
                      {/* Sparkle effect on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Sparkles className="absolute top-2 right-2 h-4 w-4 text-primary animate-pulse" />
                        <Sparkles className="absolute bottom-2 left-2 h-3 w-3 text-accent animate-pulse" style={{ animationDelay: '1s' }} />
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-card/80 backdrop-blur-xl border-border/50 hover:bg-card" />
            <CarouselNext className="right-4 bg-card/80 backdrop-blur-xl border-border/50 hover:bg-card" />
          </Carousel>
        </div>

        {/* Premium floating partnership badge */}
        <div className="text-center">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-lg"></div>
            <Badge 
              variant="secondary" 
              className="relative bg-card/50 backdrop-blur-xl text-primary border-primary/30 px-8 py-3 text-base font-medium hover:bg-card/70 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Star className="h-4 w-4 mr-2" />
              Trusted by {activeSponsors.length} amazing {activeSponsors.length === 1 ? 'partner' : 'partners'}
              <Sparkles className="h-4 w-4 ml-2 animate-pulse" />
            </Badge>
          </div>
        </div>

      </div>
    </section>
  );
};
