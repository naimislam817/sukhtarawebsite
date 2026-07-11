import { Link } from 'react-router-dom';
import '../../styles/pagebanner.css';

const PageBanner = ({ title, breadcrumbItems }) => {
  return (
    <section className="page-banner">
      <div className="page-banner__container">
        <h1 className="page-banner__title">{title}</h1>
        <nav className="page-banner__breadcrumb">
          {breadcrumbItems.map((item, index) => (
            <span key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {index < breadcrumbItems.length - 1 ? (
                <>
                  <Link to={item.path} className="page-banner__breadcrumb-link">{item.label}</Link>
                  <span className="page-banner__breadcrumb-separator">&gt;</span>
                </>
              ) : (
                <span className="page-banner__breadcrumb-current">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
};

export default PageBanner;
