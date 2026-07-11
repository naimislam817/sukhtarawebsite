import { useParams } from 'react-router-dom';
import facilitiesData from '../data/facilitiesData.json';
import PageBanner from '../components/common/PageBanner';
import FacilityDetail from '../components/facilities/FacilityDetail';
import ContactBar from '../components/common/ContactBar';
import '../styles/facilities.css';

const FacilityPage = () => {
  const { slug } = useParams();
  const facility = facilitiesData.facilities.find(f => f.slug === slug);

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
