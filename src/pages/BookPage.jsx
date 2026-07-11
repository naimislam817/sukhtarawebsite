import { useState } from 'react';
import roomsData from '../data/roomsData.json';
import siteData from '../data/siteData.json';
import '../styles/book.css';

const BookPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    checkIn: '',
    checkOut: '',
    roomPreference: roomsData.rooms[0]?.name || '',
    numRooms: '1',
    specialRequest: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API request or log the form submission details
    console.log('Reservation Submitted:', formData);
    setSubmitted(true);
  };

  return (
    <>
      <section className="book-banner">
        <div className="container">
          <p className="book-banner__subtitle">Gracious Hospitality</p>
          <h1 className="book-banner__title">BOOK NOW</h1>
        </div>
      </section>

      <section className="book-page">
        <div className="book-page__container">
          <div className="book-page__left">
            <h2 className="book-page__left-title">BOOK NOW</h2>
            <p className="book-page__left-subtitle">Feel free to reach out to us</p>
            <img src={siteData.logo} alt="Hotel Shuktara Logo" className="book-page__left-logo" />
          </div>

          <div className="book-page__right">
            {submitted ? (
              <div className="book-success" style={{ padding: '40px', backgroundColor: 'var(--color-bg-light)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <h3 style={{ color: 'var(--color-primary)', fontSize: '1.8rem', marginBottom: '15px' }}>Reservation Requested!</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: '1.7' }}>
                  Thank you, <strong>{formData.fullName}</strong>. We have received your request for <strong>{formData.numRooms} {formData.roomPreference}</strong> from <strong>{formData.checkIn}</strong> to <strong>{formData.checkOut}</strong>.
                  <br />Our reservations desk will email you confirmation details at <strong>{formData.email}</strong> shortly.
                </p>
                <button onClick={() => setSubmitted(false)} className="book-form__submit-btn" style={{ marginTop: '25px', alignSelf: 'center' }}>
                  Book Another Room
                </button>
              </div>
            ) : (
              <form className="book-form" onSubmit={handleSubmit}>
                <div className="book-form__group">
                  <label htmlFor="fullName" className="book-form__label">
                    Full Name <span className="book-form__required">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="book-form__input"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="book-form__group">
                  <label htmlFor="email" className="book-form__label">
                    Email <span className="book-form__required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="book-form__input"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="book-form__row">
                  <div className="book-form__group">
                    <label htmlFor="checkIn" className="book-form__label">
                      Check In Date <span className="book-form__required">*</span>
                    </label>
                    <input
                      type="date"
                      id="checkIn"
                      name="checkIn"
                      className="book-form__input"
                      value={formData.checkIn}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="book-form__group">
                    <label htmlFor="checkOut" className="book-form__label">
                      Check Out Date <span className="book-form__required">*</span>
                    </label>
                    <input
                      type="date"
                      id="checkOut"
                      name="checkOut"
                      className="book-form__input"
                      value={formData.checkOut}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="book-form__group">
                  <label htmlFor="roomPreference" className="book-form__label">
                    Room Preference <span className="book-form__required">*</span>
                  </label>
                  <select
                    id="roomPreference"
                    name="roomPreference"
                    className="book-form__select"
                    value={formData.roomPreference}
                    onChange={handleChange}
                    required
                  >
                    {roomsData.rooms.map((room) => (
                      <option key={room.id} value={room.name}>
                        {room.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="book-form__group">
                  <label htmlFor="numRooms" className="book-form__label">
                    Number of Rooms <span className="book-form__required">*</span>
                  </label>
                  <input
                    type="number"
                    id="numRooms"
                    name="numRooms"
                    min="1"
                    max="10"
                    className="book-form__input"
                    value={formData.numRooms}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="book-form__group">
                  <label htmlFor="specialRequest" className="book-form__label">
                    Special Request <span className="book-form__required">*</span>
                  </label>
                  <textarea
                    id="specialRequest"
                    name="specialRequest"
                    className="book-form__textarea"
                    value={formData.specialRequest}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="book-form__submit-btn">
                  BOOK NOW
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default BookPage;
export { BookPage };
