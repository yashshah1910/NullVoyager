"use client";

import Image from "next/image";
import { MapPin, Loader2 } from "lucide-react";

interface Destination {
  city: string;
  description: string;
  imageUrl: string;
  vibe?: string;
}

interface DestinationsData {
  destinations: Destination[];
  vibe?: string;
  message?: string;
}

interface DestinationsCardProps {
  data: DestinationsData;
}

export function DestinationsCard({ data }: DestinationsCardProps) {
  if (!data?.destinations?.length) {
    return (
      <div className="rounded-xl border border-dark-border bg-dark-bg-secondary p-4">
        <p className="text-sm text-dark-text-muted">No destinations found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-dark-accent" />
        <span className="text-sm font-medium text-dark-text">
          {data.vibe ? `${data.vibe.charAt(0).toUpperCase() + data.vibe.slice(1)} Destinations` : "Recommended Destinations"}
        </span>
      </div>

      {/* Destination Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.destinations.map((destination, index) => (
          <div
            key={index}
            className="group overflow-hidden rounded-xl border border-dark-border bg-dark-bg-secondary transition-all card-hover"
          >
            {/* Image */}
            <div className="relative h-32 w-full overflow-hidden">
              <Image
                src={destination.imageUrl}
                alt={destination.city}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-3">
                <h3 className="text-lg font-semibold text-white">{destination.city}</h3>
              </div>
            </div>

            {/* Content */}
            <div className="p-3">
              <p className="line-clamp-3 text-xs text-dark-text-secondary">
                {destination.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {data.message && (
        <p className="text-xs text-dark-text-muted">{data.message}</p>
      )}
    </div>
  );
}

export function DestinationsCardSkeleton({ message }: { message: string }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-dark-accent" />
        <span className="text-sm text-dark-text-muted">{message}</span>
      </div>

      {/* Skeleton Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-dark-border bg-dark-bg-secondary"
          >
            <div className="h-32 w-full skeleton" />
            <div className="p-3 space-y-2">
              <div className="h-4 w-24 rounded skeleton" />
              <div className="h-3 w-full rounded skeleton" />
              <div className="h-3 w-3/4 rounded skeleton" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
