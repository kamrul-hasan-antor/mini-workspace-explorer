"use client";

import Header from "./header";
import Activitybar from "./activitybar";
import WorkspaceView from "./workspaceView";
import Sidebar from "./sidebar";
import SearchSidebar from "./searchSidebar";
import WorkspaceProvider from "@/context/workspaceProvider";
import { useCallback, useState } from "react";
import type { SidebarPanel } from "./activitybar";

function HomeContent() {
  const [sidebarPanel, setSidebarPanel] = useState<SidebarPanel>("explorer");
  const [query, setQuery] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  const onSidebarNavigate = useCallback(() => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      setMobileSidebarOpen(false);
    }
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <Header
        onToggleSidebar={() => setMobileSidebarOpen((open) => !open)}
        sidebarOpen={mobileSidebarOpen}
      />
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {mobileSidebarOpen ? (
          <button
            type="button"
            aria-label="Close sidebar overlay"
            className="fixed inset-0 z-40 bg-black/45 md:hidden"
            onClick={closeMobileSidebar}
          />
        ) : null}

        <aside
          className={`fixed top-8 bottom-0 left-0 z-50 flex min-h-0 w-[min(85vw,280px)] max-w-full transform border-r border-[var(--border)] bg-[var(--bg-sidebar)] shadow-lg transition-transform duration-200 ease-out md:static md:z-auto md:h-auto md:w-auto md:max-w-none md:translate-x-0 md:shadow-none ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Activitybar
            activePanel={sidebarPanel}
            onPanelChange={setSidebarPanel}
          />
          {sidebarPanel === "explorer" ? (
            <Sidebar onNavigate={onSidebarNavigate} />
          ) : (
            <SearchSidebar
              query={query}
              setQuery={setQuery}
              onNavigate={onSidebarNavigate}
            />
          )}
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <WorkspaceView />
        </div>
      </div>
    </div>
  );
}

const Home = () => (
  <WorkspaceProvider>
    <HomeContent />
  </WorkspaceProvider>
);

export default Home;
