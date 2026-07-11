import roomsData from '../data/roomsData.json';
import PageBanner from '../components/common/PageBanner';
import RoomCard from '../components/rooms/RoomCard';
import '../styles/rooms.css';

const RoomsPage = () => {
  const breadcrumb = [
    { label: 'Home', path: '/' },
    { label: 'Rooms', path: '/rooms' }
  ];

  return (
    <>
      <PageBanner title={roomsData.pageTitle} breadcrumbItems={breadcrumb} />
      <section className="rooms-intro">
        <div className="rooms-intro__container">
          <p className="rooms-intro__subtitle">{roomsData.pageSubtitle}</p>
          <h2 className="rooms-intro__title">ROOMS</h2>
          <p className="rooms-intro__description">{roomsData.pageDescription}</p>
        </div>
      </section>
      <section className="rooms-grid-section">
        <div className="rooms-grid">
          {roomsData.rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>
    </>
  );
};

export default RoomsPage;
export { RoomsPage };
