"use client";

import { Plane, Clock, Loader2, ArrowRight } from "lucide-react";

interface Flight {
  id: string;
  airline: string;
  flightNumber?: string;
  price: number;
  currency?: string;
  departure: string | { city: string; time: string };
  arrival?: { city: string; time: string };
  duration: string;
  origin?: string;
  destination?: string;
  date?: string;
}

interface FlightsData {
  flights: Flight[];
  source?: string;
  message?: string;
}

interface FlightsCardProps {
  data: FlightsData;
}

export function FlightsCard({ data }: FlightsCardProps) {
  if (!data?.flights?.length) {
    return (
      <div className="rounded-xl border border-dark-border bg-dark-bg-secondary p-4">
        <p className="text-sm text-dark-text-muted">No flights found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Plane className="h-4 w-4 text-dark-accent" />
          <span className="text-sm font-medium text-dark-text">Available Flights</span>
        </div>
        {data.source && (
          <span className="text-xs text-dark-text-muted">
            {data.source === "amadeus" ? "Live prices" : "Demo data"}
          </span>
        )}
      </div>

      {/* Flight Cards */}
      <div className="space-y-2">
        {data.flights.map((flight, index) => {
          const departureTime = typeof flight.departure === "string" 
            ? flight.departure 
            : flight.departure?.time;
          const departureCity = flight.origin || (typeof flight.departure === "object" ? flight.departure.city : "");
          const arrivalTime = flight.arrival?.time || "";
          const arrivalCity = flight.destination || flight.arrival?.city || "";

          return (
            <div
              key={flight.id || index}
              className="flex items-center justify-between rounded-xl border border-dark-border bg-dark-bg-secondary p-4 transition-all card-hover"
            >
              {/* Left: Airline & Flight Info */}
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dark-bg-tertiary">
                  <Plane className="h-5 w-5 text-dark-accent" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-dark-text">{flight.airline}</span>
                    {flight.flightNumber && (
                      <span className="text-xs text-dark-text-muted">{flight.flightNumber}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-dark-text-secondary">
                    <Clock className="h-3 w-3" />
                    <span>{flight.duration}</span>
                  </div>
                </div>
              </div>

              {/* Center: Route */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-dark-text">{departureTime}</p>
                  <p className="text-xs text-dark-text-muted">{departureCity}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-dark-text-muted" />
                <div className="text-left">
                  <p className="text-sm font-medium text-dark-text">{arrivalTime || "—"}</p>
                  <p className="text-xs text-dark-text-muted">{arrivalCity}</p>
                </div>
              </div>

              {/* Right: Price */}
              <div className="text-right">
                <p className="text-lg font-semibold text-dark-accent">
                  ${flight.price.toFixed(0)}
                </p>
                <p className="text-xs text-dark-text-muted">
                  {flight.currency || "USD"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {data.message && (
        <p className="text-xs text-dark-text-muted">{data.message}</p>
      )}
    </div>
  );
}

export function FlightsCardSkeleton({ message }: { message: string }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-dark-accent" />
        <span className="text-sm text-dark-text-muted">{message}</span>
      </div>

      {/* Skeleton Cards */}
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border border-dark-border bg-dark-bg-secondary p-4"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg skeleton" />
              <div className="space-y-2">
                <div className="h-4 w-24 rounded skeleton" />
                <div className="h-3 w-16 rounded skeleton" />
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <div className="h-4 w-12 rounded skeleton" />
              <div className="h-4 w-4 rounded skeleton" />
              <div className="h-4 w-12 rounded skeleton" />
            </div>
            <div className="space-y-2">
              <div className="h-5 w-16 rounded skeleton" />
              <div className="h-3 w-10 rounded skeleton ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
