import '../../styles/global.css';

const SectionTitle = ({ subtitle, title, description, light = false, align = 'center' }) => {
  return (
    <div className={`section-title section-title--${align} ${light ? 'section-title--light' : ''}`}>
      {subtitle && <p className="section-title__subtitle">{subtitle}</p>}
      <h2 className="section-title__heading">
        {title}
      </h2>
      {description && <p className="section-title__description">{description}</p>}
    </div>
  );
};

export default SectionTitle;
