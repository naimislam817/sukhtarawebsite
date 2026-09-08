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
          <div className="book-card">
            <div className="book-card__header">
              <span className="book-card__badge">Direct Reservation</span>
              <h2 className="book-card__title">Reserve Your Stay</h2>
              <p className="book-card__subtitle">
                Experience comfort and warm Bengali hospitality in Dhaka. Complete your reservation request below and our front desk will confirm your booking promptly.
              </p>
            </div>

            {submitted ? (
              <div className="book-success">
                <div className="book-success__icon">
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 className="book-success__title">Reservation Request Received!</h3>
                <p className="book-success__text">
                  Thank you, <strong>{formData.fullName}</strong>. We have received your booking request for <strong>{formData.numRooms} × {formData.roomPreference}</strong> from <strong>{formData.checkIn}</strong> to <strong>{formData.checkOut}</strong>.
                </p>
                <p className="book-success__subtext">
                  Our reservations desk will email confirmation details to <strong>{formData.email}</strong> shortly.
                </p>
                <button onClick={() => setSubmitted(false)} className="book-form__submit-btn">
                  Book Another Room
                </button>
              </div>
            ) : (
              <form className="book-form" onSubmit={handleSubmit}>
                <div className="book-form__row">
                  <div className="book-form__group">
                    <label htmlFor="fullName" className="book-form__label">
                      Full Name <span className="book-form__required">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="book-form__input"
                      placeholder="e.g. John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="book-form__group">
                    <label htmlFor="email" className="book-form__label">
                      Email Address <span className="book-form__required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="book-form__input"
                      placeholder="e.g. name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="book-form__row">
                  <div className="book-form__group">
                    <label htmlFor="phone" className="book-form__label">
                      Phone Number <span className="book-form__required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="book-form__input"
                      placeholder="e.g. +880 1700 000000"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      required
                    />
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
                </div>

                <div className="book-form__row">
                  <div className="book-form__group">
                    <label htmlFor="checkIn" className="book-form__label">
                      Check-In Date <span className="book-form__required">*</span>
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
                      Check-Out Date <span className="book-form__required">*</span>
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

                <div className="book-form__row">
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
                    <label htmlFor="numGuests" className="book-form__label">
                      Number of Guests
                    </label>
                    <input
                      type="number"
                      id="numGuests"
                      name="numGuests"
                      min="1"
                      max="30"
                      className="book-form__input"
                      value={formData.numGuests || '1'}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="book-form__group">
                  <label htmlFor="specialRequest" className="book-form__label">
                    Special Requests or Flight Details (Optional)
                  </label>
                  <textarea
                    id="specialRequest"
                    name="specialRequest"
                    className="book-form__textarea"
                    placeholder="Let us know if you require airport pickup, extra bedding, dietary requirements, or late check-in..."
                    value={formData.specialRequest}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="book-form__actions">
                  <button type="submit" className="book-form__submit-btn">
                    CONFIRM RESERVATION
                  </button>
                  <div className="book-form__perks">
                    <span className="book-form__perk">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      Complimentary Buffet Breakfast
                    </span>
                    <span className="book-form__perk">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      Airport Transfers Available
                    </span>
                    <span className="book-form__perk">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      Free High-Speed Wi-Fi
                    </span>
                  </div>
                </div>
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
