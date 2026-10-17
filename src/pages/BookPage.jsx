import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useHotel } from '../context/HotelContext';
import roomsData from '../data/roomsData.json';
import siteData from '../data/siteData.json';
import '../styles/book.css';

const BookPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedRoom = searchParams.get('room');
  const { rooms, addBooking } = useHotel();

  const availableRooms = rooms && rooms.length > 0
    ? rooms.filter(r => r.status === 'published')
    : roomsData.rooms;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    roomPreference: preselectedRoom || availableRooms[0]?.name || '',
    numRooms: '1',
    numGuests: '1',
    specialRequest: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (preselectedRoom) {
      setFormData(prev => ({ ...prev, roomPreference: preselectedRoom }));
    } else if (availableRooms.length > 0 && !formData.roomPreference) {
      setFormData(prev => ({ ...prev, roomPreference: availableRooms[0].name }));
    }
  }, [preselectedRoom, availableRooms]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      const result = await addBooking({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        roomPreference: formData.roomPreference,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        numRooms: parseInt(formData.numRooms, 10) || 1,
        numGuests: parseInt(formData.numGuests, 10) || 1,
        message: formData.specialRequest,
      });

      if (result) {
        setSubmitted(true);
      } else {
        setErrorMessage('Failed to submit booking. Please try again or contact front desk.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error occurred while saving reservation.');
    } finally {
      setSubmitting(false);
    }
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
                  Thank you, <strong>{formData.fullName}</strong>. We have received your booking request for{' '}
                  <strong>{formData.numRooms} Room(s) &times; {formData.roomPreference}</strong> for{' '}
                  <strong>{formData.numGuests} Person(s) / Guest(s)</strong> from <strong>{formData.checkIn}</strong> to <strong>{formData.checkOut}</strong>.
                </p>
                <p className="book-success__subtext">
                  A reservation confirmation has been sent to <strong>{formData.email}</strong>, and our 24/7 reservations team at <strong>info@hotelshuktara.com</strong> has received your request and will contact you promptly.
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
                      {availableRooms.map((room) => (
                        <option key={room.id || room.slug} value={room.name}>
                          {room.name} {room.price ? `(৳ ${Number(room.price).toLocaleString('en-BD')}/night)` : ''}
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
                    <select
                      id="numRooms"
                      name="numRooms"
                      className="book-form__select"
                      value={formData.numRooms}
                      onChange={handleChange}
                      required
                    >
                      <option value="1">1 Room</option>
                      <option value="2">2 Rooms</option>
                      <option value="3">3 Rooms</option>
                      <option value="4">4 Rooms</option>
                      <option value="5">5 Rooms</option>
                      <option value="6">6 Rooms</option>
                      <option value="7">7 Rooms</option>
                      <option value="8">8 Rooms</option>
                      <option value="9">9 Rooms</option>
                      <option value="10">10 Rooms</option>
                    </select>
                  </div>

                  <div className="book-form__group">
                    <label htmlFor="numGuests" className="book-form__label">
                      Number of Persons / Guests <span className="book-form__required">*</span>
                    </label>
                    <select
                      id="numGuests"
                      name="numGuests"
                      className="book-form__select"
                      value={formData.numGuests || '1'}
                      onChange={handleChange}
                      required
                    >
                      <option value="1">1 Person (Solo Traveler)</option>
                      <option value="2">2 Persons (Couple / Double)</option>
                      <option value="3">3 Persons (Triple)</option>
                      <option value="4">4 Persons (Family)</option>
                      <option value="5">5 Persons</option>
                      <option value="6">6 Persons</option>
                      <option value="7">7 Persons</option>
                      <option value="8">8 Persons</option>
                      <option value="9">9 Persons</option>
                      <option value="10">10+ Persons (Group Stay)</option>
                    </select>
                    <small style={{ display: 'block', marginTop: 4, fontSize: '0.76rem', color: '#64748b' }}>
                      Total adults & children staying
                    </small>
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

                {errorMessage && (
                  <div style={{
                    padding: '12px 18px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 8,
                    color: '#dc2626',
                    fontSize: '0.9rem',
                    marginBottom: 16
                  }}>
                    {errorMessage}
                  </div>
                )}

                <div className="book-form__actions">
                  <button type="submit" className="book-form__submit-btn" disabled={submitting}>
                    {submitting ? 'SUBMITTING RESERVATION...' : 'CONFIRM RESERVATION'}
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
