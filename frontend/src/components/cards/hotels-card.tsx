"use client";

import Image from "next/image";
import { Hotel, Star, MapPin, Loader2, Building2 } from "lucide-react";

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
    <span className="font-semibold">
      <span className="text-dark-accent">{"$".repeat(level)}</span>
      <span className="text-dark-text-muted opacity-40">{"$".repeat(4 - level)}</span>
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
          className={`h-3.5 w-3.5 ${
            i < fullStars
              ? "fill-yellow-400 text-yellow-400"
              : i === fullStars && hasHalf
              ? "fill-yellow-400/50 text-yellow-400"
              : "text-dark-text-muted/30"
          }`}
        />
      ))}
      <span className="ml-1.5 text-xs font-medium text-dark-text-secondary">{rating.toFixed(1)}</span>
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20">
            <Building2 className="h-4 w-4 text-purple-400" />
          </div>
          <span className="text-sm font-medium text-dark-text">Available Hotels</span>
        </div>
        <div className="flex items-center gap-2">
          {data.source && (
            <span className="text-xs text-dark-text-muted bg-dark-bg-tertiary px-2 py-1 rounded-full">
              {data.source === "google_places" ? "Google Places" : "Demo data"}
            </span>
          )}
          <span className="text-xs text-dark-text-muted bg-dark-bg-tertiary px-2 py-1 rounded-full">
            {data.hotels.length} options
          </span>
        </div>
      </div>

      {/* Hotel Cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {data.hotels.map((hotel, index) => (
          <div
            key={hotel.id || index}
            className="group overflow-hidden rounded-xl border border-dark-border bg-dark-bg-secondary transition-all duration-300 card-hover hover:border-purple-500/30"
          >
            {/* Image */}
            <div className="relative h-32 w-full overflow-hidden">
              <Image
                src={hotel.imageUrl}
                alt={hotel.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {hotel.priceLevel && (
                <div className="absolute top-2 right-2 rounded-lg bg-black/70 backdrop-blur-sm px-2 py-1">
                  <PriceLevelIndicator level={hotel.priceLevel} />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-2.5">
              <h3 className="font-semibold text-dark-text line-clamp-1 group-hover:text-white transition-colors">{hotel.name}</h3>
              
              {hotel.rating && <StarRating rating={hotel.rating} />}
              
              {(hotel.address || hotel.location) && (
                <div className="flex items-start gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-dark-text-muted mt-0.5 shrink-0" />
                  <span className="text-xs text-dark-text-muted line-clamp-2 leading-relaxed">
                    {hotel.address || hotel.location}
                  </span>
                </div>
              )}

              {hotel.price && (
                <p className="text-lg font-bold bg-gradient-to-r from-dark-accent to-emerald-400 bg-clip-text text-transparent">
                  ${hotel.price}<span className="text-xs font-normal text-dark-text-muted">/night</span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {data.message && (
        <p className="text-xs text-dark-text-muted text-center">{data.message}</p>
      )}
    </div>
  );
}

export function HotelsCardSkeleton({ message }: { message: string }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20">
          <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
        </div>
        <span className="text-sm text-dark-text-muted">{message}</span>
      </div>

      {/* Skeleton Cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-dark-border bg-dark-bg-secondary"
          >
            <div className="h-32 w-full skeleton" />
            <div className="p-4 space-y-3">
              <div className="h-4 w-36 rounded skeleton" />
              <div className="h-3 w-24 rounded skeleton" />
              <div className="h-3 w-full rounded skeleton" />
              <div className="h-5 w-20 rounded skeleton" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
