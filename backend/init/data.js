const sampleListings = [
  {
    title: "Cozy Beachfront Cottage",
    description:
      "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views, private beach access, and peaceful coastal breeze.",
    category: "beachfront",
    images: [
      {
        filename: "listingimage1",
        url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80",
      },
      {
        filename: "listingimage2",
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      },
      {
        filename: "listingimage3",
        url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    price: 1500,
    location: "Malibu",
    country: "United States",
  },
  {
    title: "Modern Loft in Downtown",
    description:
      "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers, digital nomads, and luxury travelers!",
    category: "iconic_cities",
    images: [
      {
        filename: "listingimage1",
        url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      },
      {
        filename: "listingimage2",
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    price: 1200,
    location: "New York City",
    country: "United States",
  },
  {
    title: "Mountain Retreat",
    description:
      "Unplug and unwind in this peaceful mountain cabin. Surrounded by nature and pine forests, it's a perfect place to recharge.",
    category: "mountains",
    images: [
      {
        filename: "listingimage1",
        url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
      },
      {
        filename: "listingimage2",
        url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    price: 1000,
    location: "Aspen",
    country: "United States",
  },
  {
    title: "Historic Villa in Tuscany",
    description:
      "Experience the charm of Tuscany in this beautifully restored villa. Explore rolling hills, vineyards, and authentic Italian dining.",
    category: "villas",
    images: [
      {
        filename: "listingimage1",
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      },
      {
        filename: "listingimage2",
        url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    price: 2500,
    location: "Florence",
    country: "Italy",
  },
  {
    title: "Secluded Treehouse Getaway",
    description:
      "Live among the treetops in this unique treehouse retreat. A true nature lover's paradise with panoramic forest views.",
    category: "camping",
    images: [
      {
        filename: "listingimage1",
        url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
      },
      {
        filename: "listingimage2",
        url: "https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    price: 800,
    location: "Portland",
    country: "United States",
  },
  {
    title: "Beachfront Paradise Resort",
    description:
      "Step out of your door onto white sandy beaches. This beachfront condo offers infinity pool access and ultimate relaxation.",
    category: "beachfront",
    images: [
      {
        filename: "listingimage1",
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
      },
      {
        filename: "listingimage2",
        url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    price: 2000,
    location: "Cancun",
    country: "Mexico",
  },
  {
    title: "Luxury Penthouse with City Views",
    description:
      "Indulge in luxury living with panoramic city skyline views from this stunning high-floor penthouse apartment.",
    category: "pools",
    images: [
      {
        filename: "listingimage1",
        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      },
      {
        filename: "listingimage2",
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    price: 3500,
    location: "Los Angeles",
    country: "United States",
  },
  {
    title: "Tropical Villa in Phuket",
    description:
      "Escape to a tropical paradise in this luxurious villa featuring a private infinity pool and lush garden surroundings.",
    category: "villas",
    images: [
      {
        filename: "listingimage1",
        url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      },
      {
        filename: "listingimage2",
        url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    price: 3000,
    location: "Phuket",
    country: "Thailand",
  },
  {
    title: "Desert Oasis Villa",
    description:
      "Experience opulent luxury in the middle of the desert with private pool, marble finishes, and 5-star amenities.",
    category: "trending",
    images: [
      {
        filename: "listingimage1",
        url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
      },
      {
        filename: "listingimage2",
        url: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    price: 5000,
    location: "Dubai",
    country: "United Arab Emirates",
  },
];

module.exports = { data: sampleListings };