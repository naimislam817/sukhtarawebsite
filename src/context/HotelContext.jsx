import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import initialHomeData from '../data/homeData.json';
import initialFacilitiesData from '../data/facilitiesData.json';
import { contactConfig } from '../data/contactConfig';
import { getValidRoomImage } from '../utils/roomImages';

const defaultRasunFacility = initialFacilitiesData.facilities.find(f => f.slug === 'restaurant') || {};

const DEFAULT_RASUN_DATA = {
  mainImage: defaultRasunFacility.image || '/images/facilities/restraurant.jpg',
  menuPdf: defaultRasunFacility.buttons?.find(b => b.path?.includes('.pdf'))?.path || '/menus/rasun-menu.pdf',
  ambianceGallery: defaultRasunFacility.gallery || [
    '/images/facilities/restaurant/gallery-1.jpg',
    '/images/facilities/restaurant/gallery-2.jpg',
    '/images/facilities/restaurant/gallery-3.jpg',
    '/images/facilities/restaurant/gallery-4.jpg',
    '/images/facilities/restaurant/gallery-5.jpg'
  ]
};

const defaultBanquetFacility = initialFacilitiesData.facilities.find(f => f.slug === 'banquet-hall') || {};

const DEFAULT_BANQUET_DATA = {
  mainImage: defaultBanquetFacility.image || '/images/facilities/banquet-hall.jpg',
  menuPdf: defaultBanquetFacility.buttons?.find(b => b.path?.includes('.pdf'))?.path || '',
  ambianceGallery: defaultBanquetFacility.gallery || [
    '/images/facilities/banquet-hall.jpg',
    '/images/facilities/conference-room.jpg',
    '/images/gallery/experience-1.png',
    '/images/gallery/experience-3.png',
    '/images/gallery/experience-4.png'
  ]
};

const defaultSkylightFacility = initialFacilitiesData.facilities.find(f => f.slug === 'skylight') || {};

const DEFAULT_SKYLIGHT_DATA = {
  mainImage: defaultSkylightFacility.image || '/images/facilities/skylight.png',
  menuPdf: defaultSkylightFacility.buttons?.find(b => b.path?.includes('.pdf'))?.path || '/menus/skylight-menu.pdf',
  ambianceGallery: defaultSkylightFacility.gallery || [
    '/images/facilities/skylight/gallery-1.jpg',
    '/images/facilities/skylight/gallery-2.jpg',
    '/images/facilities/skylight/gallery-3.jpg',
    '/images/facilities/skylight/gallery-4.jpg',
    '/images/facilities/skylight/gallery-5.jpg'
  ]
};

export const ROOM_CATEGORIES = [
  { id: 'standard-single', name: 'Standard Single' },
  { id: 'superior-king', name: 'Superior King' },
  { id: 'deluxe-king', name: 'Deluxe King' },
  { id: 'premium-deluxe-king', name: 'Premium Deluxe King' },
  { id: 'superior-twin', name: 'Superior Twin' },
  { id: 'deluxe-twin', name: 'Deluxe Twin' },
  { id: 'premium-triple', name: 'Premium Triple' },
];

const HotelContext = createContext(null);

const generateUniqueSlug = (name, currentRooms) => {
  const base = (name || 'room')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'room';

  let candidate = base;
  let counter = 1;
  const existing = new Set((currentRooms || []).map(r => r.slug).filter(Boolean));
  while (existing.has(candidate)) {
    counter++;
    candidate = `${base}-${counter}`;
  }
  return candidate;
};

// Seed rooms used only on first load if table is empty
const SEED_ROOMS = [
  {
    name: 'Premium Triple',
    slug: 'premium-triple',
    description: 'Spacious and ideal for families or groups seeking extra comfort with three beds, private bathroom, and room service.',
    price: 6500,
    status: 'published',
    category: 'premium-triple',
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
    category: 'deluxe-twin',
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
    category: 'superior-twin',
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
    category: 'premium-deluxe-king',
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
    category: 'deluxe-king',
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
    category: 'superior-king',
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
    category: 'standard-single',
    image: '/images/rooms/standard-single.png',
    sort_order: 6,
    amenities: ['Single Bed', 'Private Bathroom', 'Air Conditioning', 'Flat-Screen TV', 'Complimentary Wi-Fi', 'Refrigerator', 'Minibar', '24/7 Room Service', 'In-Room Wardrobe', 'On-Site Parking']
  },
];


export const HotelProvider = ({ children }) => {
  const [rooms, setRooms] = useState(() => {
    try {
      const local = localStorage.getItem('shuktara_rooms_data');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return [];
  });
  const [homepage, setHomepage] = useState(() => {
    let cachedCta = null;
    try {
      const local = localStorage.getItem('shuktara_cta_settings');
      if (local) cachedCta = JSON.parse(local);
    } catch (_) {}
    return {
      hero: initialHomeData.hero,
      experiences: initialHomeData.experiences,
      cta: cachedCta || initialHomeData.cta,
    };
  });
  const [rasun, setRasun] = useState(() => {
    try {
      const local = localStorage.getItem('shuktara_rasun_settings');
      if (local) return { ...DEFAULT_RASUN_DATA, ...JSON.parse(local) };
    } catch (_) {}
    return DEFAULT_RASUN_DATA;
  });
  const [banquet, setBanquet] = useState(() => {
    try {
      const local = localStorage.getItem('shuktara_banquet_settings');
      if (local) return { ...DEFAULT_BANQUET_DATA, ...JSON.parse(local) };
    } catch (_) {}
    return DEFAULT_BANQUET_DATA;
  });
  const [skylight, setSkylight] = useState(() => {
    try {
      const local = localStorage.getItem('shuktara_skylight_settings');
      if (local) return { ...DEFAULT_SKYLIGHT_DATA, ...JSON.parse(local) };
    } catch (_) {}
    return DEFAULT_SKYLIGHT_DATA;
  });
  const [contact, setContact] = useState(() => {
    try {
      const local = localStorage.getItem('shuktara_contact_settings');
      if (local) return { ...contactConfig, ...JSON.parse(local) };
    } catch (_) {}
    return contactConfig;
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Load all data ───────────────────────────────────────
  const loadData = async () => {
    setLoading(true);

    // 1. Rooms — load from Supabase and order gracefully
    try {
      let localRooms = [];
      try {
        const raw = localStorage.getItem('shuktara_rooms_data');
        if (raw) localRooms = JSON.parse(raw);
      } catch (_) {}

      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Merge any locally created rooms that might not yet be in Supabase
        const dbIds = new Set(data.map(d => String(d.id)));
        const dbSlugs = new Set(data.map(d => d.slug));
        const extraLocal = (localRooms || []).filter(lr => !dbIds.has(String(lr.id)) && !dbSlugs.has(lr.slug));
        const combined = [...data, ...extraLocal];

        // Get local room order cache if available
        let savedOrder = {};
        try {
          const raw = localStorage.getItem('shuktara_rooms_order');
          if (raw) savedOrder = JSON.parse(raw);
        } catch (_) {}

        // Sort: prioritize explicit sort_order from DB, then localStorage order, then original
        const sortedData = combined.sort((a, b) => {
          const orderA = a.sort_order ?? savedOrder[a.id] ?? savedOrder[a.slug];
          const orderB = b.sort_order ?? savedOrder[b.id] ?? savedOrder[b.slug];
          if (orderA !== undefined && orderB !== undefined) {
            return orderA - orderB;
          }
          return 0;
        });

        const sanitized = sortedData.map((r, i) => ({
          ...r,
          sort_order: r.sort_order ?? savedOrder[r.id] ?? savedOrder[r.slug] ?? i,
          image: getValidRoomImage(r.image, r.name),
        }));
        setRooms(sanitized);
        try {
          localStorage.setItem('shuktara_rooms_data', JSON.stringify(sanitized));
        } catch (_) {}
      } else if (localRooms && localRooms.length > 0) {
        setRooms(localRooms);
      } else {
        // First run — seed rooms into Supabase
        const seedPayload = SEED_ROOMS.map(({ sort_order, ...rest }) => rest);
        const { data: seeded } = await supabase.from('rooms').insert(seedPayload).select();
        const initialList = (seeded && seeded.length > 0 ? seeded : SEED_ROOMS).map((r, i) => ({
          ...r,
          id: r.id || String(i + 1),
          sort_order: i,
          image: getValidRoomImage(r.image, r.name),
        }));
        setRooms(initialList);
        try {
          localStorage.setItem('shuktara_rooms_data', JSON.stringify(initialList));
        } catch (_) {}
      }
    } catch (err) {
      console.warn('Rooms load failed, using local/seed fallback:', err.message);
      let fallback = [];
      try {
        const raw = localStorage.getItem('shuktara_rooms_data');
        if (raw) fallback = JSON.parse(raw);
      } catch (_) {}

      if (!fallback || fallback.length === 0) {
        fallback = SEED_ROOMS.map((r, i) => ({
          ...r,
          id: String(i + 1),
          sort_order: r.sort_order ?? i,
          image: getValidRoomImage(r.image, r.name),
        }));
      }
      setRooms(fallback);
    }


    // 2. Homepage & Restaurant settings
    try {
      const { data, error } = await supabase
        .from('homepage_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;

      if (data) {
        if (data.cta && typeof data.cta === 'object' && Object.keys(data.cta).length > 0) {
          try {
            localStorage.setItem('shuktara_cta_settings', JSON.stringify(data.cta));
          } catch (_) {}
        }

        setHomepage({
          hero: Object.keys(data.hero || {}).length > 0 ? data.hero : initialHomeData.hero,
          experiences: Object.keys(data.experiences || {}).length > 0 ? data.experiences : initialHomeData.experiences,
          cta: (data.cta && Object.keys(data.cta).length > 0) ? data.cta : initialHomeData.cta,
        });

        if (data.rasun && typeof data.rasun === 'object') {
          const merged = { ...DEFAULT_RASUN_DATA, ...data.rasun };
          setRasun(merged);
          try {
            localStorage.setItem('shuktara_rasun_settings', JSON.stringify(merged));
          } catch (_) {}
        }

        if (data.banquet && typeof data.banquet === 'object') {
          const merged = { ...DEFAULT_BANQUET_DATA, ...data.banquet };
          setBanquet(merged);
          try {
            localStorage.setItem('shuktara_banquet_settings', JSON.stringify(merged));
          } catch (_) {}
        }

        if (data.skylight && typeof data.skylight === 'object') {
          const merged = { ...DEFAULT_SKYLIGHT_DATA, ...data.skylight };
          setSkylight(merged);
          try {
            localStorage.setItem('shuktara_skylight_settings', JSON.stringify(merged));
          } catch (_) {}
        }

        if (data.contact && typeof data.contact === 'object') {
          const merged = { ...contactConfig, ...data.contact };
          setContact(merged);
          try {
            localStorage.setItem('shuktara_contact_settings', JSON.stringify(merged));
          } catch (_) {}
        }
      }
    } catch (err) {
      console.warn('Homepage / Facilities load failed:', err.message);
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
  // IMPORTANT: Returns a public Supabase URL or throws an error.
  // Data URL fallback was removed — base64 strings stored in the DB
  // are too large and are not accessible across devices (mobile won't see them).
  const uploadImage = async (file) => {
    // Validate file size client-side (max 10 MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Image is too large. Please use a file under 10 MB.');
    }

    const ext = file.name.split('.').pop().toLowerCase();
    const safeName = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('hotel-images')
      .upload(safeName, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      // Surface a clear, actionable error message
      const hint =
        uploadError.message?.includes('Bucket not found')
          ? 'Storage bucket "hotel-images" not found. Create it in Supabase Storage and set it to Public.'
          : uploadError.message?.includes('policy') || uploadError.message?.includes('403')
          ? 'Storage permission denied. Set the "hotel-images" bucket to Public in Supabase.'
          : uploadError.message || 'Unknown upload error.';
      throw new Error(`Image upload failed: ${hint}`);
    }

    const { data } = supabase.storage.from('hotel-images').getPublicUrl(safeName);
    return data.publicUrl;
  };

  // ── Rooms CRUD ─────────────────────────────────────────
  const addRoom = async (roomData, imageFile, galleryFiles = []) => {
    let image = roomData.image || '/images/rooms/standard-single.png';
    if (imageFile) image = await uploadImage(imageFile);

    // Upload any gallery images
    let uploadedGallery = Array.isArray(roomData.images) ? [...roomData.images] : [];
    if (galleryFiles && galleryFiles.length > 0) {
      for (const file of galleryFiles) {
        if (file) {
          try {
            const url = await uploadImage(file);
            if (url) uploadedGallery.push(url);
          } catch (e) {
            console.warn('Gallery image upload warning:', e.message);
          }
        }
      }
    }

    const generatedSlug = generateUniqueSlug(roomData.name, rooms);
    const tempId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'room-' + Date.now();

    const newRoom = {
      id: tempId,
      name: roomData.name,
      slug: roomData.slug || generatedSlug,
      description: roomData.description || '',
      price: Number(roomData.price) || 3500,
      status: roomData.status || 'published',
      category: roomData.category || 'standard-single',
      amenities: Array.isArray(roomData.amenities)
        ? roomData.amenities
        : (roomData.amenities || '').split(',').map(a => a.trim()).filter(Boolean),
      image,
      images: uploadedGallery,
      sort_order: rooms.length,
      created_at: new Date().toISOString(),
    };

    // 1. Optimistic state & local storage update (ensures room is immediately visible & saved)
    const updatedRooms = [...rooms, newRoom];
    setRooms(updatedRooms);
    try {
      localStorage.setItem('shuktara_rooms_data', JSON.stringify(updatedRooms));
      window.dispatchEvent(new Event('storage'));
    } catch (_) {}

    // 2. Persist to Supabase
    try {
      const payload = {
        name: newRoom.name,
        slug: newRoom.slug,
        description: newRoom.description,
        price: newRoom.price,
        status: newRoom.status,
        category: newRoom.category,
        amenities: newRoom.amenities,
        image: newRoom.image,
        images: newRoom.images,
        sort_order: newRoom.sort_order,
      };

      const { data, error } = await supabase.from('rooms').insert(payload).select().maybeSingle();
      if (!error && data) {
        setRooms(prev => {
          const synced = prev.map(r => (r.id === tempId ? { ...r, ...data } : r));
          try {
            localStorage.setItem('shuktara_rooms_data', JSON.stringify(synced));
          } catch (_) {}
          return synced;
        });
        return data;
      } else if (error) {
        console.warn('Supabase room insert warning (persisted locally):', error.message);
      }
    } catch (err) {
      console.warn('Supabase room insert exception (persisted locally):', err.message);
    }

    return newRoom;
  };

  const updateRoom = async (id, roomData, imageFile, galleryFiles = []) => {
    let payload = { ...roomData };
    delete payload.id;
    delete payload.created_at;

    if (imageFile) payload.image = await uploadImage(imageFile);
    
    // Upload any new gallery image files and merge with existing images
    let uploadedGallery = Array.isArray(payload.images) ? [...payload.images] : [];
    if (galleryFiles && galleryFiles.length > 0) {
      for (const file of galleryFiles) {
        if (file) {
          try {
            const url = await uploadImage(file);
            if (url) uploadedGallery.push(url);
          } catch (e) {
            console.warn('Gallery image upload warning:', e.message);
          }
        }
      }
    }
    payload.images = uploadedGallery;

    if (payload.price !== undefined) payload.price = Number(payload.price);
    if (payload.amenities && !Array.isArray(payload.amenities)) {
      payload.amenities = payload.amenities.split(',').map(a => a.trim()).filter(Boolean);
    }

    const updatedRooms = rooms.map(r => (r.id === id ? { ...r, ...payload } : r));
    setRooms(updatedRooms);
    try {
      localStorage.setItem('shuktara_rooms_data', JSON.stringify(updatedRooms));
      window.dispatchEvent(new Event('storage'));
    } catch (_) {}

    try {
      const { data, error } = await supabase.from('rooms').update(payload).eq('id', id).select().maybeSingle();
      if (!error && data) {
        return data;
      } else if (error) {
        // If 'images' column doesn't exist yet, retry without 'images' so save still succeeds
        if (error.message?.includes("'images'")) {
          const { images, ...safePayload } = payload;
          const { data: retryData } = await supabase.from('rooms').update(safePayload).eq('id', id).select().maybeSingle();
          if (retryData) return retryData;
        }
      }
    } catch (err) {
      console.warn('Supabase update room exception (persisted locally):', err.message);
    }

    return updatedRooms.find(r => r.id === id);
  };

  const toggleRoomStatus = async (id) => {
    const room = rooms.find(r => r.id === id);
    if (!room) return;
    const newStatus = room.status === 'published' ? 'draft' : 'published';
    await updateRoom(id, { status: newStatus });
  };

  const deleteRoom = async (id) => {
    const updatedRooms = rooms.filter(r => r.id !== id);
    setRooms(updatedRooms);
    try {
      localStorage.setItem('shuktara_rooms_data', JSON.stringify(updatedRooms));
      window.dispatchEvent(new Event('storage'));
    } catch (_) {}

    try {
      const { error } = await supabase.from('rooms').delete().eq('id', id);
      if (error) console.warn('Supabase delete error (handled locally):', error.message);
    } catch (err) {
      console.warn('Supabase delete room exception (persisted locally):', err.message);
    }
    return true;
  };

  const reorderRooms = async (reorderedRooms) => {
    // Optimistic UI update
    setRooms(reorderedRooms);

    // Save order map to localStorage for instant cross-tab / refresh persistence
    try {
      const orderMap = {};
      reorderedRooms.forEach((r, idx) => {
        if (r.id) orderMap[r.id] = idx;
        if (r.slug) orderMap[r.slug] = idx;
      });
      localStorage.setItem('shuktara_rooms_order', JSON.stringify(orderMap));
      // Notify other tabs / components
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.warn('LocalStorage order save failed:', e);
    }

    // Persist new sort_order to Supabase (silently skip if column doesn't exist)
    try {
      const updates = reorderedRooms.map((room, index) =>
        supabase.from('rooms').update({ sort_order: index }).eq('id', room.id)
      );
      const results = await Promise.all(updates);
      const firstError = results.find(r => r?.error);
      if (firstError?.error?.message?.includes('sort_order')) {
        console.warn('sort_order column not found in Supabase — order saved locally.');
      }
    } catch (err) {
      console.warn('Reorder persist failed:', err.message);
    }
  };

  // ── Homepage CRUD ──────────────────────────────────────
  const updateHero = async (heroData, imageFile) => {
    let payload = { ...homepage.hero, ...heroData };

    // uploadImage now throws on failure — let it bubble up to the caller
    if (imageFile) payload.backgroundImage = await uploadImage(imageFile);

    const { error } = await supabase
      .from('homepage_settings')
      .update({ hero: payload })
      .eq('id', 1);

    if (error) throw new Error(`Failed to save hero to database: ${error.message}`);

    setHomepage(prev => ({ ...prev, hero: payload }));
  };

  const updateExperiences = async (imagesList) => {
    const payload = { ...homepage.experiences, images: imagesList };

    const { error } = await supabase
      .from('homepage_settings')
      .update({ experiences: payload })
      .eq('id', 1);

    if (error) throw new Error(`Failed to save experiences to database: ${error.message}`);
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

  const updateCta = async (ctaData) => {
    const payload = { ...(homepage.cta || initialHomeData.cta), ...ctaData };

    setHomepage(prev => ({ ...prev, cta: payload }));

    try {
      localStorage.setItem('shuktara_cta_settings', JSON.stringify(payload));
      window.dispatchEvent(new Event('storage'));
    } catch (_) {}

    try {
      await supabase
        .from('homepage_settings')
        .update({ cta: payload })
        .eq('id', 1);
    } catch (err) {
      console.warn('Persist CTA settings error (saved locally):', err.message);
    }
  };

  // ── Rasun Restaurant CRUD ─────────────────────────────
  const saveRasunSettings = async (updatedRasun) => {
    setRasun(updatedRasun);
    try {
      localStorage.setItem('shuktara_rasun_settings', JSON.stringify(updatedRasun));
      window.dispatchEvent(new Event('storage'));
    } catch (_) {}

    const { error } = await supabase
      .from('homepage_settings')
      .update({ rasun: updatedRasun })
      .eq('id', 1);

    if (error) {
      console.error('Persist rasun settings error:', error);
      throw new Error(`Failed to save Rasun to database: ${error.message}`);
    }
  };

  const updateRasunMainImage = async (file) => {
    const uploadedUrl = await uploadImage(file);
    if (!uploadedUrl) return null;
    const updated = { ...rasun, mainImage: uploadedUrl };
    await saveRasunSettings(updated);
    return uploadedUrl;
  };

  const updateRasunAmbianceImage = async (index, file) => {
    const uploadedUrl = await uploadImage(file);
    if (!uploadedUrl) return null;
    const currentList = [...(rasun.ambianceGallery || DEFAULT_RASUN_DATA.ambianceGallery)];
    currentList[index] = uploadedUrl;
    const updated = { ...rasun, ambianceGallery: currentList };
    await saveRasunSettings(updated);
    return uploadedUrl;
  };

  const updateRasunMenuPdf = async (file) => {
    const uploadedUrl = await uploadImage(file);
    if (!uploadedUrl) return null;
    const updated = { ...rasun, menuPdf: uploadedUrl };
    await saveRasunSettings(updated);
    return uploadedUrl;
  };

  // ── Banquet Hall CRUD ──────────────────────────────────
  const saveBanquetSettings = async (updatedBanquet) => {
    setBanquet(updatedBanquet);
    try {
      localStorage.setItem('shuktara_banquet_settings', JSON.stringify(updatedBanquet));
      window.dispatchEvent(new Event('storage'));
    } catch (_) {}

    const { error } = await supabase
      .from('homepage_settings')
      .update({ banquet: updatedBanquet })
      .eq('id', 1);

    if (error) {
      console.error('Persist banquet settings error:', error);
      throw new Error(`Failed to save Banquet to database: ${error.message}`);
    }
  };

  const updateBanquetMainImage = async (file) => {
    const uploadedUrl = await uploadImage(file);
    if (!uploadedUrl) return null;
    const updated = { ...banquet, mainImage: uploadedUrl };
    await saveBanquetSettings(updated);
    return uploadedUrl;
  };

  const updateBanquetAmbianceImage = async (index, file) => {
    const uploadedUrl = await uploadImage(file);
    if (!uploadedUrl) return null;
    const currentList = [...(banquet.ambianceGallery || DEFAULT_BANQUET_DATA.ambianceGallery)];
    currentList[index] = uploadedUrl;
    const updated = { ...banquet, ambianceGallery: currentList };
    await saveBanquetSettings(updated);
    return uploadedUrl;
  };

  const updateBanquetMenuPdf = async (file) => {
    const uploadedUrl = await uploadImage(file);
    if (!uploadedUrl) return null;
    const updated = { ...banquet, menuPdf: uploadedUrl };
    await saveBanquetSettings(updated);
    return uploadedUrl;
  };

  // ── Skylight Restaurant CRUD ───────────────────────────
  const saveSkylightSettings = async (updatedSkylight) => {
    setSkylight(updatedSkylight);
    try {
      localStorage.setItem('shuktara_skylight_settings', JSON.stringify(updatedSkylight));
      window.dispatchEvent(new Event('storage'));
    } catch (_) {}

    const { error } = await supabase
      .from('homepage_settings')
      .update({ skylight: updatedSkylight })
      .eq('id', 1);

    if (error) {
      console.error('Persist skylight settings error:', error);
      throw new Error(`Failed to save Skylight to database: ${error.message}`);
    }
  };

  const updateSkylightMainImage = async (file) => {
    const uploadedUrl = await uploadImage(file);
    if (!uploadedUrl) return null;
    const updated = { ...skylight, mainImage: uploadedUrl };
    await saveSkylightSettings(updated);
    return uploadedUrl;
  };

  const updateSkylightAmbianceImage = async (index, file) => {
    const uploadedUrl = await uploadImage(file);
    if (!uploadedUrl) return null;
    const currentList = [...(skylight.ambianceGallery || DEFAULT_SKYLIGHT_DATA.ambianceGallery)];
    currentList[index] = uploadedUrl;
    const updated = { ...skylight, ambianceGallery: currentList };
    await saveSkylightSettings(updated);
    return uploadedUrl;
  };

  const updateSkylightMenuPdf = async (file) => {
    const uploadedUrl = await uploadImage(file);
    if (!uploadedUrl) return null;
    const updated = { ...skylight, menuPdf: uploadedUrl };
    await saveSkylightSettings(updated);
    return uploadedUrl;
  };

  // ── Contact Info CRUD ──────────────────────────────────
  const updateContact = async (updatedContact) => {
    const merged = { ...contact, ...updatedContact };

    // 1. Always update local state & localStorage immediately so the UI is never blocked
    setContact(merged);
    try {
      localStorage.setItem('shuktara_contact_settings', JSON.stringify(merged));
      window.dispatchEvent(new Event('storage'));
    } catch (_) {}

    // 2. Persist to Supabase — requires the 'contact' jsonb column to exist.
    //    If it doesn't, run: ALTER TABLE homepage_settings ADD COLUMN IF NOT EXISTS contact jsonb DEFAULT '{}'::jsonb;
    try {
      const { error } = await supabase
        .from('homepage_settings')
        .update({ contact: merged })
        .eq('id', 1);

      if (error) {
        if (
          error.message?.includes("column") ||
          error.message?.includes("schema cache") ||
          error.code === 'PGRST204' ||
          error.code === '42703'
        ) {
          console.warn(
            '[Supabase] contact column missing in homepage_settings.\n' +
            'Run this SQL in your Supabase dashboard:\n' +
            'ALTER TABLE homepage_settings ADD COLUMN IF NOT EXISTS contact jsonb DEFAULT \'{}\'::jsonb;\n' +
            'Contact info is saved locally and will sync once the column exists.'
          );
        } else {
          console.warn('Could not persist contact to Supabase:', error.message);
        }
      }
    } catch (err) {
      console.warn('Persist contact error (saved locally):', err.message);
    }

    return merged;
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
    const bookingId = 'BK-' + Math.floor(1000 + Math.random() * 9000);
    const payload = {
      id: bookingId,
      full_name: bookingData.fullName || bookingData.full_name,
      email: bookingData.email,
      phone: bookingData.phone,
      room_preference: bookingData.roomPreference || bookingData.room_preference || '',
      check_in: bookingData.checkIn || bookingData.check_in,
      check_out: bookingData.checkOut || bookingData.check_out,
      num_rooms: Number(bookingData.numRooms) || 1,
      num_guests: Number(bookingData.numGuests) || 1,
      status: 'Pending',
      message: bookingData.message || bookingData.specialRequest || '',
      created_at: new Date().toISOString(),
    };

    const normalized = normalizeBooking(payload);
    setBookings(prev => [normalized, ...prev]);

    // 1. Save to local storage for instant availability
    try {
      const existing = JSON.parse(localStorage.getItem('shuktara_bookings_data') || '[]');
      localStorage.setItem('shuktara_bookings_data', JSON.stringify([normalized, ...existing]));
      window.dispatchEvent(new Event('storage'));
    } catch (_) {}

    // 2. Dispatch email notification to info@hotelshuktara.com & confirmation to guest
    try {
      fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: payload.full_name,
          email: payload.email,
          phone: payload.phone,
          roomPreference: payload.room_preference,
          checkIn: payload.check_in,
          checkOut: payload.check_out,
          numRooms: payload.num_rooms,
          numGuests: payload.num_guests,
          specialRequest: payload.message,
          bookingId: payload.id,
        })
      }).catch(err => {
        console.warn('Reservation email dispatch warning:', err.message);
      });
    } catch (emailErr) {
      console.warn('Email trigger exception:', emailErr.message);
    }

    // 3. Persist to Supabase
    try {
      const { data, error } = await supabase.from('bookings').insert(payload).select().single();
      if (!error && data) {
        return normalizeBooking(data);
      } else if (error) {
        console.warn('Supabase booking insert warning (saved locally):', error.message);
      }
    } catch (err) {
      console.warn('Supabase booking insert exception (saved locally):', err.message);
    }

    return normalized;
  };

  const updateBookingStatus = async (id, status) => {
    setBookings(prev => {
      const updated = prev.map(b => (b.id === id ? { ...b, status } : b));
      try {
        localStorage.setItem('shuktara_bookings_data', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
      } catch (_) {}
      return updated;
    });

    try {
      const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
      if (error) console.warn('Supabase booking status update warning:', error.message);
    } catch (err) {
      console.warn('Supabase booking status update exception:', err.message);
    }
  };

  return (
    <HotelContext.Provider
      value={{
        rooms,
        roomCategories: ROOM_CATEGORIES,
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
        updateCta,
        rasun,
        updateRasunMainImage,
        updateRasunAmbianceImage,
        updateRasunMenuPdf,
        banquet,
        updateBanquetMainImage,
        updateBanquetAmbianceImage,
        updateBanquetMenuPdf,
        skylight,
        updateSkylightMainImage,
        updateSkylightAmbianceImage,
        updateSkylightMenuPdf,
        contact,
        updateContact,
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
