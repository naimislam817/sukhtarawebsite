// Map of room image paths that exist in /public/images/rooms/
export const VALID_ROOM_IMAGES = [
  '/images/rooms/deluxe-king.png',
  '/images/rooms/deluxe-twin.png',
  '/images/rooms/deluxe-double.png',
  '/images/rooms/king-suite.png',
  '/images/rooms/premium-deluxe-king.png',
  '/images/rooms/premium-triple.png',
  '/images/rooms/standard-single.png',
  '/images/rooms/superior-king.png',
  '/images/rooms/superior-twin.png',
  '/images/rooms/twin-bedroom.png',
  '/images/rooms/triple-room.png',
  '/images/rooms/executive-room.png',
  '/images/rooms/family-suite.png',
];

/**
 * Returns a valid, existing room image URL.
 * Automatically resolves any room image path or name to a verified existing image.
 */
export const getValidRoomImage = (image, name = '') => {
  // If it's a dynamic upload (Supabase Storage URL or base64 data URL), preserve it
  if (image && (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:'))) {
    return image;
  }

  // Exact file match
  if (image && VALID_ROOM_IMAGES.includes(image)) {
    return image;
  }

  const n = (name || '').toLowerCase();
  const img = (image || '').toLowerCase();

  // Match room names or broken filenames to corresponding high-res room images
  if (n.includes('triple') || img.includes('triple')) {
    return '/images/rooms/premium-triple.png';
  }
  if (n.includes('superior twin') || img.includes('superior-twin')) {
    return '/images/rooms/superior-twin.png';
  }
  if (n.includes('twin') || n.includes('double') || img.includes('twin') || img.includes('double')) {
    return '/images/rooms/deluxe-twin.png';
  }
  if (n.includes('premium deluxe') || n.includes('suite') || img.includes('suite') || img.includes('premium-deluxe')) {
    return '/images/rooms/premium-deluxe-king.png';
  }
  if (n.includes('superior') || img.includes('superior')) {
    return '/images/rooms/superior-king.png';
  }
  if (n.includes('single') || img.includes('single')) {
    return '/images/rooms/standard-single.png';
  }
  if (n.includes('king') || img.includes('king')) {
    return '/images/rooms/deluxe-king.png';
  }

  // Safe fallback
  return '/images/rooms/deluxe-king.png';
};

export default getValidRoomImage;
