"use client";

import { Plane, Clock, Loader2, ArrowRight, Ticket } from "lucide-react";

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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20">
            <Plane className="h-4 w-4 text-blue-400" />
          </div>
          <span className="text-sm font-medium text-dark-text">Available Flights</span>
        </div>
        <div className="flex items-center gap-2">
          {data.source && (
            <span className="text-xs text-dark-text-muted bg-dark-bg-tertiary px-2 py-1 rounded-full">
              {data.source === "amadeus" ? "✓ Live prices" : "Demo data"}
            </span>
          )}
          <span className="text-xs text-dark-text-muted bg-dark-bg-tertiary px-2 py-1 rounded-full">
            {data.flights.length} options
          </span>
        </div>
      </div>

      {/* Flight Cards */}
      <div className="space-y-3">
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
              className="group flex items-center justify-between rounded-xl border border-dark-border bg-dark-bg-secondary p-4 transition-all duration-300 card-hover hover:border-blue-500/30"
            >
              {/* Left: Airline & Flight Info */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-colors">
                  <Plane className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-dark-text">{flight.airline}</span>
                    {flight.flightNumber && (
                      <span className="text-xs text-dark-text-muted bg-dark-bg-tertiary px-1.5 py-0.5 rounded">{flight.flightNumber}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-dark-text-secondary mt-0.5">
                    <Clock className="h-3 w-3" />
                    <span>{flight.duration}</span>
                  </div>
                </div>
              </div>

              {/* Center: Route */}
              <div className="hidden sm:flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-dark-text">{departureTime}</p>
                  <p className="text-xs text-dark-text-muted">{departureCity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-px w-8 bg-dark-border" />
                  <ArrowRight className="h-4 w-4 text-dark-text-muted" />
                  <div className="h-px w-8 bg-dark-border" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-dark-text">{arrivalTime || "—"}</p>
                  <p className="text-xs text-dark-text-muted">{arrivalCity}</p>
                </div>
              </div>

              {/* Right: Price */}
              <div className="text-right">
                <p className="text-xl font-bold bg-gradient-to-r from-dark-accent to-emerald-400 bg-clip-text text-transparent">
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
        <p className="text-xs text-dark-text-muted text-center">{data.message}</p>
      )}
    </div>
  );
}

export function FlightsCardSkeleton({ message }: { message: string }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20">
          <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
        </div>
        <span className="text-sm text-dark-text-muted">{message}</span>
      </div>

      {/* Skeleton Cards */}
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border border-dark-border bg-dark-bg-secondary p-4"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl skeleton" />
              <div className="space-y-2">
                <div className="h-4 w-28 rounded skeleton" />
                <div className="h-3 w-16 rounded skeleton" />
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <div className="space-y-1">
                <div className="h-4 w-12 rounded skeleton" />
                <div className="h-3 w-8 rounded skeleton" />
              </div>
              <div className="h-4 w-16 rounded skeleton" />
              <div className="space-y-1">
                <div className="h-4 w-12 rounded skeleton" />
                <div className="h-3 w-8 rounded skeleton" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-6 w-20 rounded skeleton" />
              <div className="h-3 w-10 rounded skeleton ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
