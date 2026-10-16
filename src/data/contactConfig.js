// Central contact configuration for Hotel Shuktara (Pvt.) Ltd.
// Can be edited directly or updated dynamically from the Admin Panel.

export const contactConfig = {
  hotelName: "Hotel Shuktara (Pvt.) Ltd.",
  tagline: "A Tradition of Gracious Hospitality",
  address: "HH 20/A, Indira Road, Sher-E-Bangla Nagar, Dhaka-1215",
  city: "Dhaka",
  country: "Bangladesh",
  
  phones: [
    {
      display: "+880 1400-334422",
      raw: "+8801400334422",
      label: "Front Desk & Reservations"
    },
    {
      display: "+880 2-98888777",
      raw: "+880298888777",
      label: "Banquet & Events Desk"
    }
  ],

  emails: [
    {
      email: "info@hotelshuktara.com",
      label: "General Inquiries"
    },
    {
      email: "reservation@hotelshuktara.com",
      label: "Room Reservations"
    }
  ],

  whatsapp: {
    number: "8801400334422",
    display: "+880 1400-334422",
    prefilledMessage: "Hello, I'd like to inquire about a room."
  },

  hours: {
    frontDesk: "24/7",
    checkIn: "2:00 PM",
    checkOut: "12:00 PM"
  },

  map: {
    query: "Hotel+Shuktara+Indira+Road+Sher-E-Bangla+Nagar+Dhaka+1215",
    embedSrc: "https://www.google.com/maps?q=Hotel+Shuktara+Indira+Road+Sher-E-Bangla+Nagar+Dhaka+1215&output=embed",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Hotel+Shuktara+Indira+Road+Sher-E-Bangla+Nagar+Dhaka+1215"
  },

  nearbyDistances: [
    {
      title: "Metro Station",
      distance: "500m (5 min walk)",
      description: "Farmgate Metro Station",
      icon: "metro"
    },
    {
      title: "Airport",
      distance: "14 km (30 mins drive)",
      description: "Hazrat Shahjalal Int'l Airport",
      icon: "plane"
    },
    {
      title: "Farmgate Hub",
      distance: "300m (3 min walk)",
      description: "Prime Commercial & Transit Hub",
      icon: "pin"
    }
  ],

  socialLinks: [
    {
      name: "Facebook",
      url: "https://facebook.com/hotelshuktara",
      icon: "facebook"
    },
    {
      name: "Twitter / X",
      url: "https://twitter.com/hotelshuktara",
      icon: "twitter"
    },
    {
      name: "Instagram",
      url: "https://instagram.com/hotelshuktara",
      icon: "instagram"
    },
    {
      name: "YouTube",
      url: "https://youtube.com/@hotelshuktara",
      icon: "youtube"
    }
  ],

  formSubjects: [
    "Room Booking",
    "Banquet/Events",
    "Airport Transfer",
    "General Inquiry"
  ]
};

export default contactConfig;
