import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import initialHomeData from '../data/homeData.json';
import { getValidRoomImage } from '../utils/roomImages';

const HotelContext = createContext(null);


// Seed rooms used only on first load if table is empty
const SEED_ROOMS = [
  {
    name: 'Premium Triple',
    slug: 'premium-triple',
    description: 'Spacious and ideal for families or groups seeking extra comfort with three beds, private bathroom, and room service.',
    price: 6500,
    status: 'published',
    category: 'triple',
    image: '/images/rooms/premium-triple.png',
    sort_order: 0,
    amenities: ['Three Comfortable Beds', 'Private Bathroom', 'Air Conditioning', 'Flat-Screen TV', 'Complimentary Wi-Fi', 'Refrigerator', 'Minibar', '24/7 Room Service', 'Wardrobe & Storage']
  },
  {
    name: 'Deluxe Twin',
    slug: 'deluxe-twin',
    description: 'Stylish and relaxing environment decorated in soothing warm tones, featuring two comfortable twin single beds.',
    price: 4500,
    status: 'published',
    category: 'twin',
    image: '/images/rooms/deluxe-twin.png',
    sort_order: 1,
    amenities: ['Two Comfortable Twin Beds', 'Private Bathroom', 'Air Conditioning', 'Flat-Screen TV', 'Complimentary Wi-Fi', 'Refrigerator', 'Minibar', '24/7 Room Service', 'Wardrobe']
  },
  {
    name: 'Superior Twin',
    slug: 'superior-twin',
    description: 'Finest twin rooms designed to accommodate guests with comfortable twin beds in a serene, inviting atmosphere.',
    price: 5500,
    status: 'published',
    category: 'twin',
    image: '/images/rooms/superior-twin.png',
    sort_order: 2,
    amenities: ['Two Superior Twin Beds', 'Private Bathroom', 'Air Conditioning', 'Flat-Screen TV', 'Complimentary Wi-Fi', 'Refrigerator', 'Minibar', '24/7 Room Service', 'Spacious Wardrobe']
  },
  {
    name: 'Premium Deluxe King',
    slug: 'premium-deluxe-king',
    description: 'Our largest and most luxurious option with plush king-sized bed, seating area, writing desk, and upscale amenities.',
    price: 8500,
    status: 'published',
    category: 'king',
    image: '/images/rooms/premium-deluxe-king.png',
    sort_order: 3,
    amenities: ['King-Size Bed', 'Private Bathroom', 'Air Conditioning', 'Flat-Screen TV', 'Complimentary Wi-Fi', 'Refrigerator', 'Minibar', '24/7 Room Service', 'Spacious Wardrobe']
  },
  {
    name: 'Deluxe King',
    slug: 'deluxe-king',
    description: 'Luxurious experience with stylish decor, king-sized bed, modern security, high-speed internet, and customized services.',
    price: 5000,
    status: 'published',
    category: 'king',
    image: '/images/rooms/deluxe-king.png',
    sort_order: 4,
    amenities: ['King-Size Bed', 'Private Bathroom', 'Air Conditioning', 'Flat-Screen TV', 'Complimentary Wi-Fi', 'Refrigerator', 'Minibar', '24/7 Room Service', 'Spacious Wardrobe']
  },
  {
    name: 'Superior King',
    slug: 'superior-king',
    description: 'Cozy and inviting atmosphere with king-size bed, private bathroom, refrigerator, flat-screen TV, and city views.',
    price: 4200,
    status: 'published',
    category: 'king',
    image: '/images/rooms/superior-king.png',
    sort_order: 5,
    amenities: ['King-Size Bed', 'Private Bathroom', 'Air Conditioning', 'Flat-Screen TV', 'Complimentary Wi-Fi', 'Refrigerator', 'Spacious Wardrobe']
  },
  {
    name: 'Standard Single',
    slug: 'standard-single',
    description: 'Budget-friendly yet cozy, comfortable, and secure stay with essential amenities, Wi-Fi, and desk for solo travelers.',
    price: 3500,
    status: 'published',
    category: 'single',
    image: '/images/rooms/standard-single.png',
    sort_order: 6,
    amenities: ['Single Bed', 'Private Bathroom', 'Air Conditioning', 'Flat-Screen TV', 'Complimentary Wi-Fi', 'Refrigerator', 'Minibar', '24/7 Room Service', 'In-Room Wardrobe', 'On-Site Parking']
  },
];


export const HotelProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [homepage, setHomepage] = useState({
    hero: initialHomeData.hero,
    experiences: initialHomeData.experiences,
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Load all data ───────────────────────────────────────
  const loadData = async () => {
    setLoading(true);

    // 1. Rooms — load from Supabase and order gracefully
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Sort client-side: prioritize sort_order if set, else maintain original index
        const sortedData = [...data].sort((a, b) => {
          if (a.sort_order !== undefined && a.sort_order !== null && b.sort_order !== undefined && b.sort_order !== null) {
            return a.sort_order - b.sort_order;
          }
          return 0;
        });

        const sanitized = sortedData.map((r, i) => ({
          ...r,
          sort_order: r.sort_order ?? i,
          image: getValidRoomImage(r.image, r.name),
        }));
        setRooms(sanitized);
      } else {
        // First run — seed rooms into Supabase
        const seedPayload = SEED_ROOMS.map(({ sort_order, ...rest }) => rest);
        const { data: seeded } = await supabase.from('rooms').insert(seedPayload).select();
        if (seeded) {
          const sanitized = seeded.map((r, i) => ({
            ...r,
            sort_order: i,
            image: getValidRoomImage(r.image, r.name),
          }));
          setRooms(sanitized);
        }
      }
    } catch (err) {
      console.warn('Rooms load failed:', err.message);
      setRooms(SEED_ROOMS.map((r, i) => ({
        ...r,
        id: String(i + 1),
        sort_order: r.sort_order ?? i,
        image: getValidRoomImage(r.image, r.name),
      })));
    }


    // 2. Homepage settings
    try {
      const { data, error } = await supabase
        .from('homepage_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;

      if (data) {
        setHomepage({
          hero: Object.keys(data.hero || {}).length > 0 ? data.hero : initialHomeData.hero,
          experiences: Object.keys(data.experiences || {}).length > 0 ? data.experiences : initialHomeData.experiences,
        });
      }
    } catch (err) {
      console.warn('Homepage load failed:', err.message);
    }

    // 3. Bookings
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        // Normalize snake_case → camelCase for components
        setBookings(data.map(normalizeBooking));
      }
    } catch (err) {
      console.warn('Bookings load failed:', err.message);
    }

    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  // ── Image Upload (Supabase Storage) ────────────────────
  const uploadImage = async (file) => {
    try {
      const ext = file.name.split('.').pop();
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('hotel-images')
        .upload(path, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('hotel-images').getPublicUrl(path);
      return data.publicUrl;
    } catch (err) {
      console.warn('Supabase Storage upload failed, using Data URL fallback:', err.message);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  };

  // ── Rooms CRUD ─────────────────────────────────────────
  const addRoom = async (roomData, imageFile) => {
    let image = roomData.image || '/images/rooms/standard-single.png';
    if (imageFile) image = await uploadImage(imageFile);

    const payload = {
      name: roomData.name,
      slug: roomData.slug || roomData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: roomData.description || '',
      price: Number(roomData.price) || 3500,
      status: roomData.status || 'published',
      category: roomData.category || 'standard',
      amenities: Array.isArray(roomData.amenities)
        ? roomData.amenities
        : (roomData.amenities || '').split(',').map(a => a.trim()).filter(Boolean),
      image,
      sort_order: rooms.length,
    };

    const { data, error } = await supabase.from('rooms').insert(payload).select().single();
    if (error) { console.error('Add room error:', error); return null; }
    setRooms(prev => [...prev, data]);
    return data;
  };

  const updateRoom = async (id, roomData, imageFile) => {
    let payload = { ...roomData };
    delete payload.id;
    delete payload.created_at;

    if (imageFile) payload.image = await uploadImage(imageFile);
    if (payload.price !== undefined) payload.price = Number(payload.price);
    if (payload.amenities && !Array.isArray(payload.amenities)) {
      payload.amenities = payload.amenities.split(',').map(a => a.trim()).filter(Boolean);
    }

    const { data, error } = await supabase.from('rooms').update(payload).eq('id', id).select().single();
    if (error) { console.error('Update room error:', error); return null; }
    setRooms(prev => prev.map(r => r.id === id ? data : r));
    return data;
  };

  const toggleRoomStatus = async (id) => {
    const room = rooms.find(r => r.id === id);
    if (!room) return;
    const newStatus = room.status === 'published' ? 'draft' : 'published';
    await updateRoom(id, { status: newStatus });
  };

  const deleteRoom = async (id) => {
    const { error } = await supabase.from('rooms').delete().eq('id', id);
    if (error) { console.error('Delete room error:', error); return false; }
    setRooms(prev => prev.filter(r => r.id !== id));
    return true;
  };

  const reorderRooms = async (reorderedRooms) => {
    // Optimistic UI update
    setRooms(reorderedRooms);

    // Persist new sort_order to Supabase (silently skip if column doesn't exist)
    try {
      const updates = reorderedRooms.map((room, index) =>
        supabase.from('rooms').update({ sort_order: index }).eq('id', room.id)
      );
      const results = await Promise.all(updates);
      // If first update failed because column doesn't exist, just log it
      const firstError = results.find(r => r.error);
      if (firstError?.error?.message?.includes('sort_order')) {
        console.warn('sort_order column not found in Supabase — reorder is in-memory only. Add the column for persistence.');
      }
    } catch (err) {
      console.warn('Reorder persist failed:', err.message);
    }
  };

  // ── Homepage CRUD ──────────────────────────────────────
  const updateHero = async (heroData, imageFile) => {
    let payload = { ...homepage.hero, ...heroData };
    if (imageFile) payload.backgroundImage = await uploadImage(imageFile);

    const { error } = await supabase
      .from('homepage_settings')
      .update({ hero: payload })
      .eq('id', 1);

    if (error) { console.error('Update hero error:', error); return; }
    setHomepage(prev => ({ ...prev, hero: payload }));
  };

  const updateExperiences = async (imagesList) => {
    const payload = { ...homepage.experiences, images: imagesList };

    const { error } = await supabase
      .from('homepage_settings')
      .update({ experiences: payload })
      .eq('id', 1);

    if (error) { console.error('Update experiences error:', error); return; }
    setHomepage(prev => ({ ...prev, experiences: payload }));
  };

  const updateSingleExperienceImage = async (index, file, caption) => {
    const currentImages = [...(homepage.experiences?.images || [])];
    if (!currentImages[index]) return;

    const uploadedUrl = file ? await uploadImage(file) : null;
    currentImages[index] = {
      ...currentImages[index],
      src: uploadedUrl || currentImages[index].src,
      caption: caption !== undefined ? caption : currentImages[index].caption,
    };
    await updateExperiences(currentImages);
  };

  // ── Bookings CRUD ──────────────────────────────────────
  const normalizeBooking = (b) => ({
    id: b.id,
    fullName: b.full_name,
    email: b.email,
    phone: b.phone,
    roomPreference: b.room_preference,
    checkIn: b.check_in,
    checkOut: b.check_out,
    numRooms: b.num_rooms,
    numGuests: b.num_guests,
    status: b.status,
    message: b.message,
    createdAt: b.created_at,
  });

  const addBooking = async (bookingData) => {
    const payload = {
      id: 'BK-' + Math.floor(1000 + Math.random() * 9000),
      full_name: bookingData.fullName || bookingData.full_name,
      email: bookingData.email,
      phone: bookingData.phone,
      room_preference: bookingData.roomPreference || bookingData.room_preference || '',
      check_in: bookingData.checkIn || bookingData.check_in,
      check_out: bookingData.checkOut || bookingData.check_out,
      num_rooms: bookingData.numRooms || 1,
      num_guests: bookingData.numGuests || 1,
      status: 'Pending',
      message: bookingData.message || '',
    };

    const { data, error } = await supabase.from('bookings').insert(payload).select().single();
    if (error) { console.error('Add booking error:', error); return null; }
    const normalized = normalizeBooking(data);
    setBookings(prev => [normalized, ...prev]);
    return normalized;
  };

  const updateBookingStatus = async (id, status) => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (error) { console.error('Update booking status error:', error); return; }
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  return (
    <HotelContext.Provider
      value={{
        rooms,
        homepage,
        bookings,
        loading,
        uploadImage,
        addRoom,
        updateRoom,
        toggleRoomStatus,
        deleteRoom,
        reorderRooms,
        updateHero,
        updateExperiences,
        updateSingleExperienceImage,
        addBooking,
        updateBookingStatus,
        refreshData: loadData,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const ctx = useContext(HotelContext);
  if (!ctx) throw new Error('useHotel must be used within HotelProvider');
  return ctx;
};

export default HotelContext;
