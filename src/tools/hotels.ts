import { z } from "zod";
import { tool } from "ai";

// Schema for hotel search
const searchHotelsSchema = z.object({
  location: z.string().describe("City name e.g. Paris, Dubai, Tokyo"),
  checkInDate: z.string().optional().describe("Check-in date in YYYY-MM-DD format"),
  checkOutDate: z.string().optional().describe("Check-out date in YYYY-MM-DD format"),
});

// Real API Helper (Google Places)
async function fetchGoogleHotels(city: string, apiKey: string) {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=hotels+in+${encodeURIComponent(city)}&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = (await res.json()) as {
      results?: {
        place_id: string;
        name: string;
        rating?: number;
        formatted_address: string;
        price_level?: number;
        photos?: { photo_reference: string }[];
      }[];
    };

    if (!data.results || data.results.length === 0) return null;

    return data.results.slice(0, 5).map((place) => ({
      id: place.place_id,
      name: place.name,
      rating: place.rating ?? 0,
      address: place.formatted_address,
      priceLevel: place.price_level ?? 2, // 1=Cheap, 4=Expensive
      imageUrl: place.photos
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
        : `https://source.unsplash.com/400x300/?hotel,${encodeURIComponent(city)}`,
    }));
  } catch (error) {
    console.error("Google Places API Error:", error);
    return null;
  }
}

// Mock Data (Safety Net)
const MOCK_HOTELS = [
  {
    id: "ht-1",
    name: "Grand Hyatt",
    rating: 4.8,
    address: "City Center",
    priceLevel: 4,
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  },
  {
    id: "ht-2",
    name: "Budget Stay",
    rating: 3.5,
    address: "Near Station",
    priceLevel: 2,
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
  },
  {
    id: "ht-3",
    name: "Boutique Hotel",
    rating: 4.2,
    address: "Old Town",
    priceLevel: 3,
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
  },
];

// Factory Function
export const createSearchHotelsTool = (env: { GOOGLE_PLACES_API_KEY?: string }) =>
  tool({
    description:
      "Finds hotels in a specific city using Google Places API. Returns hotel names, ratings, addresses, price levels, and images.",
    inputSchema: searchHotelsSchema,
    execute: async (input) => {
      const { location, checkInDate, checkOutDate } = input as {
        location: string;
        checkInDate?: string;
        checkOutDate?: string;
      };

      // Try Real API if key exists
      if (env.GOOGLE_PLACES_API_KEY) {
        const realHotels = await fetchGoogleHotels(location, env.GOOGLE_PLACES_API_KEY);
        if (realHotels) {
          return {
            hotels: realHotels.map((h) => ({
              ...h,
              location,
              checkInDate: checkInDate ?? "TBD",
              checkOutDate: checkOutDate ?? "TBD",
            })),
            source: "google_places",
            message: `Found ${realHotels.length} hotel(s) in ${location}.`,
          };
        }
      }

      // Fallback to mock data
      const mockHotels = MOCK_HOTELS.map((h) => ({
        ...h,
        name: `${h.name} ${location}`,
        location,
        checkInDate: checkInDate ?? "TBD",
        checkOutDate: checkOutDate ?? "TBD",
      }));

      return {
        hotels: mockHotels,
        source: "mock",
        message: `Found ${mockHotels.length} hotel(s) in ${location} (demo data).`,
      };
    },
  });
