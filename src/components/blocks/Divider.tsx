import { cn } from "@/lib/utils/cn";

interface DividerProps {
  style?: "line" | "dots" | "space" | "wave";
  size?: "small" | "medium" | "large";
}

export function Divider({ style = "line", size = "medium" }: DividerProps) {
  const sizes = {
    small: "py-4",
    medium: "py-8",
    large: "py-16",
  };

  return (
    <div className={cn("relative", sizes[size])}>
      {style === "line" && (
        <div className="max-w-xs mx-auto h-px bg-gray-200 dark:bg-slate-600" />
      )}

      {style === "dots" && (
        <div className="flex justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
          <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]/60" />
          <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]/30" />
        </div>
      )}

      {style === "wave" && (
        <div className="flex justify-center">
          <svg
            viewBox="0 0 120 10"
            className="w-32 h-3 text-[var(--color-primary)]"
            fill="currentColor"
          >
            <path d="M0 5 Q15 0, 30 5 T60 5 T90 5 T120 5" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      )}

      {/* space style renders nothing - just the padding */}
    </div>
  );
}
