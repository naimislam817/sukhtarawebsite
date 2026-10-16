import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Ensure upload directory exists in public/images/uploads
const uploadDir = path.resolve(__dirname, '../public/images/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e4);
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper functions to read/write JSON files safely
const dataDir = path.resolve(__dirname, 'data');
const getFilePath = (fileName) => path.join(dataDir, fileName);

const readJSON = (fileName, defaultVal = []) => {
  try {
    const filePath = getFilePath(fileName);
    if (!fs.existsSync(filePath)) return defaultVal;
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${fileName}:`, err);
    return defaultVal;
  }
};

const writeJSON = (fileName, data) => {
  try {
    const filePath = getFilePath(fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${fileName}:`, err);
    return false;
  }
};

// ----------------------------------------------------
// 1. File Upload Route
// ----------------------------------------------------
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }
    const publicUrl = `/images/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: publicUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message || 'File upload failed' });
  }
});

// ----------------------------------------------------
// 2. Authentication Route
// ----------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  // Demo check (accepts admin@hotelshuktara.com or standard admin demo)
  if (email === 'admin@hotelshuktara.com' || email === 'admin') {
    return res.json({
      success: true,
      token: 'shuktara-jwt-' + Date.now(),
      user: {
        name: 'Hotel Manager',
        email: 'admin@hotelshuktara.com',
        role: 'Super Admin'
      }
    });
  }
  // Allow login with any password for demo credentials convenience
  if (email) {
    return res.json({
      success: true,
      token: 'shuktara-jwt-' + Date.now(),
      user: {
        name: email.split('@')[0],
        email: email,
        role: 'Admin'
      }
    });
  }
  return res.status(401).json({ error: 'Invalid email or password' });
});

// ----------------------------------------------------
// 3. Rooms Management Routes (CRUD)
// ----------------------------------------------------
app.get('/api/rooms', (req, res) => {
  const rooms = readJSON('rooms.json', []);
  res.json(rooms);
});

app.post('/api/rooms', (req, res) => {
  const rooms = readJSON('rooms.json', []);
  const newRoom = {
    id: Date.now(),
    name: req.body.name || 'New Room',
    slug: (req.body.name || 'room')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, ''),
    image: req.body.image || '/images/rooms/standard-single.png',
    price: Number(req.body.price) || 3500,
    status: req.body.status || 'published',
    description: req.body.description || '',
    fullDescription: req.body.fullDescription || req.body.description || '',
    amenities: req.body.amenities || [
      'Private Bathroom',
      'Air Conditioning',
      'Flat-Screen TV',
      'Complimentary Wi-Fi',
      '24/7 Room Service'
    ],
    category: req.body.category || 'standard'
  };

  rooms.unshift(newRoom);
  writeJSON('rooms.json', rooms);
  res.status(201).json(newRoom);
});

app.put('/api/rooms/:id', (req, res) => {
  const id = Number(req.params.id);
  const rooms = readJSON('rooms.json', []);
  const index = rooms.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Room not found' });
  }

  rooms[index] = {
    ...rooms[index],
    ...req.body,
    id: rooms[index].id,
    price: req.body.price !== undefined ? Number(req.body.price) : rooms[index].price
  };

  writeJSON('rooms.json', rooms);
  res.json(rooms[index]);
});

app.delete('/api/rooms/:id', (req, res) => {
  const id = Number(req.params.id);
  let rooms = readJSON('rooms.json', []);
  const initialLength = rooms.length;
  rooms = rooms.filter(r => r.id !== id);

  if (rooms.length === initialLength) {
    return res.status(404).json({ error: 'Room not found' });
  }

  writeJSON('rooms.json', rooms);
  res.json({ success: true, message: 'Room deleted' });
});

// ----------------------------------------------------
// 4. Homepage Media Routes
// ----------------------------------------------------
app.get('/api/homepage', (req, res) => {
  const homepage = readJSON('homepage.json', {});
  res.json(homepage);
});

app.put('/api/homepage/hero', (req, res) => {
  const homepage = readJSON('homepage.json', {});
  if (!homepage.hero) homepage.hero = {};
  
  if (req.body.backgroundImage) {
    homepage.hero.backgroundImage = req.body.backgroundImage;
  }
  if (req.body.titleLine1 !== undefined) homepage.hero.titleLine1 = req.body.titleLine1;
  if (req.body.titleHighlight !== undefined) homepage.hero.titleHighlight = req.body.titleHighlight;
  if (req.body.titleLine2 !== undefined) homepage.hero.titleLine2 = req.body.titleLine2;
  if (req.body.description !== undefined) homepage.hero.description = req.body.description;

  writeJSON('homepage.json', homepage);
  res.json(homepage.hero);
});

app.put('/api/homepage/experiences', (req, res) => {
  const homepage = readJSON('homepage.json', {});
  if (!homepage.experiences) homepage.experiences = { title: 'Unforgettable Experiences', images: [] };

  if (Array.isArray(req.body.images)) {
    homepage.experiences.images = req.body.images;
  }

  writeJSON('homepage.json', homepage);
  res.json(homepage.experiences);
});

// ----------------------------------------------------
// 5. Bookings Routes
// ----------------------------------------------------
app.get('/api/bookings', (req, res) => {
  const bookings = readJSON('bookings.json', []);
  res.json(bookings);
});

app.post('/api/bookings', (req, res) => {
  const bookings = readJSON('bookings.json', []);
  const newBooking = {
    id: 'BK-' + Math.floor(1000 + Math.random() * 9000),
    ...req.body,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  bookings.unshift(newBooking);
  writeJSON('bookings.json', bookings);
  res.status(201).json(newBooking);
});

app.put('/api/bookings/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const bookings = readJSON('bookings.json', []);
  const booking = bookings.find(b => b.id === id);

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  booking.status = status || booking.status;
  writeJSON('bookings.json', bookings);
  res.json(booking);
});

// ----------------------------------------------------
// 6. Contact Inquiries Route
// ----------------------------------------------------
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, checkIn, checkOut, message, botcheck } = req.body || {};

    if (botcheck) {
      console.warn('Bot blocked via honeypot:', { name, email });
      return res.json({ success: true, message: 'Inquiry received' });
    }

    if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' });
    if (!email || !email.trim()) return res.status(400).json({ error: 'Valid email is required' });
    if (!phone || !phone.trim()) return res.status(400).json({ error: 'Phone number is required' });
    if (!message || !message.trim()) return res.status(400).json({ error: 'Message is required' });

    console.log('📬 [Local Server] New Contact Form Submission:', {
      name, email, phone, subject, checkIn, checkOut, message
    });

    // Save to server/data/inquiries.json
    const inquiries = readJSON('inquiries.json', []);
    inquiries.unshift({
      id: 'INQ-' + Date.now(),
      name,
      email,
      phone,
      subject: subject || 'General Inquiry',
      checkIn: checkIn || null,
      checkOut: checkOut || null,
      message,
      createdAt: new Date().toISOString()
    });
    writeJSON('inquiries.json', inquiries);

    res.json({
      success: true,
      message: 'Thank you! Your message has been sent successfully. Our team will contact you shortly.'
    });
  } catch (err) {
    console.error('Contact handler error:', err);
    res.status(500).json({ error: 'Failed to process inquiry' });
  }
});

app.listen(PORT, () => {
  console.log(`🏨 Hotel Shuktara Backend running on http://localhost:${PORT}`);
});
