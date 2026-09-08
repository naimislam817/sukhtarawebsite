import { useEffect, useState, useRef } from 'react';
import homeData from '../../data/homeData.json';
import '../../styles/home.css';

const AnimatedValue = ({ target, isDecimal, isStarted }) => {
  const [current, setCurrent] = useState(isStarted ? target : (isDecimal ? '0.0' : '0'));

  useEffect(() => {
    if (!isStarted) return;
    const numTarget = parseFloat(target);
    const duration = 1500;
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = ease * numTarget;

      if (isDecimal) {
        setCurrent(val.toFixed(1));
      } else {
        setCurrent(Math.floor(val).toString());
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setCurrent(target);
      }
    };

    const animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [isStarted, target, isDecimal]);

  return <>{current}</>;
};

const StatsCounter = () => {
  const { stats } = homeData;
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats" ref={sectionRef}>
      <div className="stats__container">
        {stats.map((stat, index) => {
          const isDecimal = stat.value.includes('.');
          const itemContent = (
            <div className="stats__item-content">
              <span className="stats__value">
                <AnimatedValue target={stat.value} isDecimal={isDecimal} isStarted={hasAnimated} />
                {stat.icon === 'star' && (
                  <svg className="stats__star" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                )}
              </span>
              {stat.reviews && (
                <span className="stats__reviews">{stat.reviews}</span>
              )}
              <span className="stats__label">{stat.label}</span>
            </div>
          );

          return (
            <div className={`stats__item reveal-fade-up delay-${index + 1}`} key={index}>
              {stat.link ? (
                <a
                  href={stat.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="stats__link"
                >
                  {itemContent}
                </a>
              ) : (
                itemContent
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default StatsCounter;
