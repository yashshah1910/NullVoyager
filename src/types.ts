export type AgentMode = 'INSPIRATION' | 'PLANNING' | 'BOOKING';

export interface TripPreferences {
  originCity?: string;
  destinationCity?: string;
  dates?: { start: string; end: string };
  budget?: number;
  travelers: number;
}

export interface VoyagerState {
  mode: AgentMode;
  preferences: TripPreferences;
  cart: {
    selectedFlightId?: string;
    selectedHotelId?: string;
  };
}
