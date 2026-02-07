"use client";

interface MediaImageCardProps {
  url: string;
  name: string;
  formattedSize: string;
}

export function MediaImageCard({ url, name, formattedSize }: MediaImageCardProps) {
  return (
    <div className="group relative aspect-square bg-[var(--color-surface-elevated)] rounded-lg overflow-hidden border border-[var(--color-border)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
        <p className="text-zinc-100 text-xs text-center truncate w-full mb-1">{name}</p>
        <p className="text-zinc-400 text-xs">{formattedSize}</p>
        <button
          onClick={() => {
            navigator.clipboard.writeText(url);
          }}
          className="mt-2 px-3 py-1.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] text-black text-xs font-medium rounded transition-colors"
        >
          Copy URL
        </button>
      </div>
    </div>
  );
}
