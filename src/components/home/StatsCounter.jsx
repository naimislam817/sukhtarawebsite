import homeData from '../../data/homeData.json';
import '../../styles/home.css';

const StatsCounter = () => {
  const { stats } = homeData;

  return (
    <section className="stats">
      <div className="stats__container">
        {stats.map((stat, index) => (
          <div className="stats__item" key={index}>
            <span className="stats__value">
              {stat.value}
              {stat.icon === 'star' && (
                <svg className="stats__star" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              )}
            </span>
            <span className="stats__label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsCounter;
