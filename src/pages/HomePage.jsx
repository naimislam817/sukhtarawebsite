import HeroSection from '../components/home/HeroSection';
import LocationSection from '../components/home/LocationSection';
import StatsCounter from '../components/home/StatsCounter';
import FacilitiesSection from '../components/home/FacilitiesSection';
import ExperiencesGallery from '../components/home/ExperiencesGallery';
import AccommodationsSection from '../components/home/AccommodationsSection';
import CTASection from '../components/home/CTASection';
import MapSection from '../components/home/MapSection';

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <LocationSection />
      <StatsCounter />
      <FacilitiesSection />
      <ExperiencesGallery />
      <AccommodationsSection />
      <CTASection />
      <MapSection />
    </>
  );
};

export default HomePage;
export { HomePage };

