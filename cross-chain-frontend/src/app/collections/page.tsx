"use client";

import { useEffect, useState } from "react";
import {
  fetchSupportedCollections,
  Collection,
} from "@/components/utils/collections";
import { Badge } from "@/Components/privy/ui/badge";
import { Card } from "@/Components/privy/ui/card";
import { Toggle } from "@/Components/privy/ui/toggle";
import Image from "next/image";
import Link from "next/link";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCollections = async () => {
      setLoading(true);
      const data = await fetchSupportedCollections();
      console.log("collections: ", data);
      setCollections(data);
      setLoading(false);
    };
    loadCollections();
  }, []);

  const filtered = showVerifiedOnly
    ? collections.filter((c) => c.verified)
    : collections;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Supported NFT Collections
        </h1>
        <Toggle
          pressed={showVerifiedOnly}
          onPressedChange={setShowVerifiedOnly}
          className="text-xs"
        >
          {showVerifiedOnly ? "Showing Verified Only" : "Showing All"}
        </Toggle>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading collections...</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground">No collections found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((collection) => (
            <Link
              key={collection.contractAddress}
              href={`/collections/${collection.contractAddress}`}
            >
              <Card className="p-1 transition hover:shadow-md cursor-pointer border border-monad-border bg-muted hover:shadow-md hover:scale-[1.02] transition duration-200">
                <div className="relative w-full h-40 mb-4 rounded overflow-hidden">
                  <Image
                    src={
                      collection.imageUrl ||
                      "https://next.cdn.magiceden.dev/_next/static/media/nft_fallback.f889df8f.svg"
                    }
                    alt={collection.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <h3 className="text-base font-semibold text-foreground truncate flex items-center gap-2">
                  {collection.name}
                  {collection.verified ? (
                    <Badge variant="success" className="text-[10px]">
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">
                      Unverified
                    </Badge>
                  )}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Floor:{" "}
                  <span className="text-foreground font-medium">
                    {collection.floorPrice} wMON
                  </span>
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
