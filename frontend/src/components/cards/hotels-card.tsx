"use client";

import Image from "next/image";
import { Hotel, Star, MapPin, Loader2 } from "lucide-react";

interface HotelItem {
  id: string;
  name: string;
  rating?: number;
  address?: string;
  priceLevel?: number;
  price?: number;
  stars?: number;
  imageUrl: string;
  location?: string;
  checkInDate?: string;
  checkOutDate?: string;
}

interface HotelsData {
  hotels: HotelItem[];
  source?: string;
  message?: string;
}

interface HotelsCardProps {
  data: HotelsData;
}

function PriceLevelIndicator({ level }: { level: number }) {
  return (
    <span className="text-dark-accent font-medium">
      {"$".repeat(level)}
      <span className="text-dark-text-muted">{"$".repeat(4 - level)}</span>
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i < fullStars
              ? "fill-yellow-400 text-yellow-400"
              : i === fullStars && hasHalf
              ? "fill-yellow-400/50 text-yellow-400"
              : "text-dark-text-muted"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-dark-text-secondary">{rating.toFixed(1)}</span>
    </div>
  );
}

export function HotelsCard({ data }: HotelsCardProps) {
  if (!data?.hotels?.length) {
    return (
      <div className="rounded-xl border border-dark-border bg-dark-bg-secondary p-4">
        <p className="text-sm text-dark-text-muted">No hotels found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hotel className="h-4 w-4 text-dark-accent" />
          <span className="text-sm font-medium text-dark-text">Available Hotels</span>
        </div>
        {data.source && (
          <span className="text-xs text-dark-text-muted">
            {data.source === "google_places" ? "Google Places" : "Demo data"}
          </span>
        )}
      </div>

      {/* Hotel Cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {data.hotels.map((hotel, index) => (
          <div
            key={hotel.id || index}
            className="group overflow-hidden rounded-xl border border-dark-border bg-dark-bg-secondary transition-all card-hover"
          >
            {/* Image */}
            <div className="relative h-28 w-full overflow-hidden">
              <Image
                src={hotel.imageUrl}
                alt={hotel.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {hotel.priceLevel && (
                <div className="absolute top-2 right-2 rounded-md bg-black/60 px-2 py-1">
                  <PriceLevelIndicator level={hotel.priceLevel} />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-3 space-y-2">
              <h3 className="font-medium text-dark-text line-clamp-1">{hotel.name}</h3>
              
              {hotel.rating && <StarRating rating={hotel.rating} />}
              
              {(hotel.address || hotel.location) && (
                <div className="flex items-start gap-1">
                  <MapPin className="h-3 w-3 text-dark-text-muted mt-0.5 shrink-0" />
                  <span className="text-xs text-dark-text-muted line-clamp-2">
                    {hotel.address || hotel.location}
                  </span>
                </div>
              )}

              {hotel.price && (
                <p className="text-sm font-semibold text-dark-accent">
                  ${hotel.price}/night
                </p>
              )}
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

export function HotelsCardSkeleton({ message }: { message: string }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-dark-accent" />
        <span className="text-sm text-dark-text-muted">{message}</span>
      </div>

      {/* Skeleton Cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-dark-border bg-dark-bg-secondary"
          >
            <div className="h-28 w-full skeleton" />
            <div className="p-3 space-y-2">
              <div className="h-4 w-32 rounded skeleton" />
              <div className="h-3 w-24 rounded skeleton" />
              <div className="h-3 w-full rounded skeleton" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
