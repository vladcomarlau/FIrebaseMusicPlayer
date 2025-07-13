
import { cn } from "@/lib/utils";

interface ListSpacerProps {
  isMenuOpen?: boolean;
}

export function ListSpacer({ isMenuOpen = false }: ListSpacerProps) {
  return (
    <div
      className={cn(
        "w-full flex-shrink-0 transition-all duration-300",
        isMenuOpen ? "h-80" : "h-48"
      )}
      aria-hidden="true"
    />
  );
}
