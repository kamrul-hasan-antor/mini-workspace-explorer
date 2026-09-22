"use client";

import { Menu, X } from "lucide-react";

const Header = ({
  onToggleSidebar,
  sidebarOpen,
}: {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}) => {
  return (
    <div className="flex h-8 shrink-0 items-center gap-2 border-b border-[var(--border)] bg-[var(--bg-header)] px-2 sm:px-4">
      {onToggleSidebar ? (
        <button
          type="button"
          className="rounded p-1 text-white hover:bg-white/10 md:hidden"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      ) : (
        <span className="size-8 md:hidden" aria-hidden />
      )}
      <h1 className="min-w-0 flex-1 truncate text-center font-medium text-white">
        Mini Workspace Explorer
      </h1>
      <span className="size-8 shrink-0 md:hidden" aria-hidden />
    </div>
  );
};

export default Header;
