import roomsData from '../data/roomsData.json';
import { useHotel } from '../context/HotelContext';
import PageBanner from '../components/common/PageBanner';
import RoomCard from '../components/rooms/RoomCard';
import '../styles/rooms.css';

const RoomsPage = () => {
  const { rooms, loading } = useHotel();

  const breadcrumb = [
    { label: 'Home', path: '/' },
    { label: 'Rooms', path: '/rooms' }
  ];

  const publishedRooms = rooms && rooms.length > 0
    ? rooms.filter(r => r.status === 'published')
    : roomsData.rooms;

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
          {publishedRooms.map((room) => (
            <RoomCard key={room.id || room.slug} room={room} />
          ))}
        </div>
      </section>
    </>
  );
};

export default RoomsPage;
export { RoomsPage };

