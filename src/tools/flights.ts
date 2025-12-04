import { z } from "zod";
import { tool } from "ai";

// Schema
const searchFlightsSchema = z.object({
  origin: z.string().length(3).describe("3-letter IATA airport code (e.g. JFK, DXB)"),
  destination: z.string().length(3).describe("3-letter IATA airport code (e.g. LHR, HND)"),
  departureDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .describe("YYYY-MM-DD format"),
});

// Get Amadeus Access Token (They expire every 30 mins)
async function getAmadeusToken(clientId: string, clientSecret: string) {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);

  const res = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const data = await res.json();
  return data.access_token;
}

// API Call
async function fetchRealFlights(origin: string, dest: string, date: string, env: any) {
  try {
    const token = await getAmadeusToken(env.AMADEUS_CLIENT_ID, env.AMADEUS_CLIENT_SECRET);

    // Search for 3 adult passengers, economy
    const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${dest}&departureDate=${date}&adults=1&max=5`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!data.data || data.data.length === 0) return null;

    // Transform complex Amadeus JSON into our simple UI format
    return data.data.map((offer: any) => ({
      id: offer.id,
      airline: offer.validatingAirlineCodes[0], // e.g., "EK"
      flightNumber: `${offer.validatingAirlineCodes[0]}${offer.itineraries[0].segments[0].number}`,
      departure: {
        city: origin,
        time: offer.itineraries[0].segments[0].departure.at.split("T")[1].slice(0, 5), // "14:30"
      },
      arrival: {
        city: dest,
        time: offer.itineraries[0].segments[0].arrival.at.split("T")[1].slice(0, 5),
      },
      duration: offer.itineraries[0].duration.replace("PT", "").toLowerCase(), // "6h30m"
      price: parseFloat(offer.price.total),
      currency: offer.price.currency,
    }));
  } catch (error) {
    console.error("Amadeus API Error:", error);
    return null; // Trigger fallback
  }
}

function getMockFlights(origin: string, dest: string) {
  return [
    {
      id: "mock-1",
      airline: "NullAir",
      flightNumber: "NA-101",
      departure: { city: origin, time: "09:00" },
      arrival: { city: dest, time: "16:00" },
      duration: "7h 00m",
      price: 450.0,
      currency: "USD",
    },
    {
      id: "mock-2",
      airline: "CloudWings",
      flightNumber: "CW-88",
      departure: { city: origin, time: "18:00" },
      arrival: { city: dest, time: "01:00" },
      duration: "7h 00m",
      price: 320.5,
      currency: "USD",
    },
  ];
}

// Tool Export
export const createSearchFlightsTool = (env: any) =>
  tool({
    description:
      "Finds real flight offers between two cities using Amadeus API. Use 3-letter IATA airport codes (e.g., JFK for New York, LHR for London, DXB for Dubai).",
    inputSchema: searchFlightsSchema,
    execute: async (input) => {
      const { origin, destination, departureDate } = input as {
        origin: string;
        destination: string;
        departureDate: string;
      };

      // Try Real API first
      const realData = await fetchRealFlights(origin, destination, departureDate, env);

      if (realData) {
        return {
          flights: realData,
          source: "amadeus",
          message: `Found ${realData.length} real flight(s) from ${origin} to ${destination} on ${departureDate}.`,
        };
      }

      // Fallback if API fails or returns no results (common in Test tier)
      console.log("Falling back to Mock Flights");
      const mockData = getMockFlights(origin, destination);
      return {
        flights: mockData,
        source: "mock",
        message: `Found ${mockData.length} flight(s) from ${origin} to ${destination} (demo data).`,
      };
    },
  });
