import { Link } from 'react-router-dom';
import homeData from '../../data/homeData.json';
import '../../styles/home.css';

const CTASection = () => {
  const { cta } = homeData;

  return (
    <section className="cta" style={{ backgroundImage: `url(${cta.backgroundImage})` }}>
      <div className="cta__overlay"></div>
      <div className="cta__content">
        <h2 className="cta__title">{cta.title}</h2>
        <Link to="/book" className="cta__btn">
          {cta.buttonLabel}
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
