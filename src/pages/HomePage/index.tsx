import {
  BenefitsSection,
  FooterContent,
  HeroSection,
  OrganizeEventCTA,
  PopularCategories,
  TopPicks,
  UpcomingEvents,
} from '../../components/home';

import '../../components/home/home.css';
import { useTheme } from '../../hooks/useTheme'; 
import homePageBg from '../../assets/homeBg.png'; 
import homePageBgLight from '../../assets/eventPageLigthBg.png';

export default function HomePage() {
  const { mode } = useTheme(); 
   const bgImage = mode === 'light' ? homePageBgLight : homePageBg;
  return (
    <div className="homePage" style={{ backgroundImage: `url(${bgImage})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'top' }}>

      <HeroSection />
      <PopularCategories />
      <UpcomingEvents />
      <OrganizeEventCTA />
      <TopPicks />
      <BenefitsSection />
      <FooterContent />
    </div>
  );
}
