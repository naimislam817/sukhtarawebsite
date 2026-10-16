import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import facilitiesData from '../data/facilitiesData.json';
import { useHotel } from '../context/HotelContext';
import PageBanner from '../components/common/PageBanner';
import FacilityDetail from '../components/facilities/FacilityDetail';
import ContactBar from '../components/common/ContactBar';
import '../styles/facilities.css';

const FacilityPage = () => {
  const { slug } = useParams();
  const { rasun, banquet } = useHotel();
  const rawFacility = facilitiesData.facilities.find(f => f.slug === slug);

  const facility = useMemo(() => {
    if (!rawFacility) return null;
    if (slug === 'restaurant' && rasun) {
      return {
        ...rawFacility,
        image: rasun.mainImage || rawFacility.image,
        gallery: (rasun.ambianceGallery && rasun.ambianceGallery.length > 0)
          ? rasun.ambianceGallery
          : rawFacility.gallery,
        buttons: rawFacility.buttons.map(btn => {
          if (btn.label?.toUpperCase().includes('MENU')) {
            return {
              ...btn,
              path: rasun.menuPdf || btn.path
            };
          }
          return btn;
        })
      };
    }
    if (slug === 'banquet-hall' && banquet) {
      // If a menu/brochure PDF has been uploaded for Banquet Hall, ensure there's a button for it
      let buttons = [...rawFacility.buttons];
      if (banquet.menuPdf) {
        const hasMenuBtn = buttons.some(b => b.label?.toUpperCase().includes('MENU') || b.label?.toUpperCase().includes('BROCHURE'));
        if (hasMenuBtn) {
          buttons = buttons.map(b => (b.label?.toUpperCase().includes('MENU') || b.label?.toUpperCase().includes('BROCHURE')) ? { ...b, path: banquet.menuPdf } : b);
        } else {
          buttons = [...buttons, { label: "EVENT MENU", path: banquet.menuPdf }];
        }
      }
      return {
        ...rawFacility,
        image: banquet.mainImage || rawFacility.image,
        gallery: (banquet.ambianceGallery && banquet.ambianceGallery.length > 0)
          ? banquet.ambianceGallery
          : rawFacility.gallery,
        buttons
      };
    }
    return rawFacility;
  }, [rawFacility, slug, rasun, banquet]);

  if (!facility) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center', fontStyle: 'italic' }}>
        <h2>Facility not found</h2>
      </div>
    );
  }

  const breadcrumb = [
    { label: 'Home', path: '/' },
    { label: facility.pageTitle, path: `/facilities/${facility.slug}` }
  ];

  return (
    <>
      <PageBanner title={facility.pageTitle} breadcrumbItems={breadcrumb} />
      <FacilityDetail facility={facility} />
      {facility.contactBar && (
        <ContactBar
          phone={facility.contactBar.phone}
          phoneAvailability={facility.contactBar.phoneAvailability}
          email={facility.contactBar.email}
        />
      )}
    </>
  );
};

export default FacilityPage;
export { FacilityPage };
