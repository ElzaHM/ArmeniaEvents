import {
  BenefitsSection,
  FooterContent,
  HeroSection,
  HeyGenVideoWidget,
  OrganizeEventCTA,
  PopularCategories,
  TopPicks,
  UpcomingEvents,
} from '../../components/home';

import '../../components/home/home.css';

export default function HomePage() {
  return (
    <div className="homePage">

      <HeroSection />
      <PopularCategories />
      <UpcomingEvents />
      <OrganizeEventCTA />
      <TopPicks />
      <BenefitsSection />
      <FooterContent />
      <HeyGenVideoWidget />
    </div>
  );
}
