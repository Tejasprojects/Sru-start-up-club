
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Features } from "@/components/sections/Features";
import { YearInReview } from "@/components/sections/YearInReview";
import { StartupsBornInClub } from "@/components/sections/StartupsBornInClub";
import { SuccessStoriesCarousel } from "@/components/success-stories/SuccessStoriesCarousel";
import { SponsorShowcase } from "@/components/sections/SponsorShowcase";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Features />
      <YearInReview />
      <SuccessStoriesCarousel />
      <SponsorShowcase />
      <StartupsBornInClub />
    </div>
  );
};

export default Home;

