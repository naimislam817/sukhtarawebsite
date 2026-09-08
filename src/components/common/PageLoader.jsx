import '../../styles/loader.css';

const PageLoader = ({ isLoading }) => {
  return (
    <div
      className={`page-loader ${isLoading ? 'page-loader--active' : ''}`}
      aria-hidden={!isLoading}
      role="status"
      aria-label="Loading page"
    >
      <div className="page-loader__content">
        <div className="page-loader__ring-wrapper">
          <div className="page-loader__aura"></div>
          <div className="page-loader__circle"></div>
          <div className="page-loader__emblem-wrapper">
            <img
              src="/images/shuktara-emblem.png"
              alt="Hotel Shuktara Emblem"
              className="page-loader__emblem"
            />
          </div>
        </div>

        <h3 className="page-loader__brand">Hotel Shuktara</h3>
        <span className="page-loader__subline">Dhaka</span>
        <div className="page-loader__bar"></div>
      </div>
    </div>
  );
};

export default PageLoader;
