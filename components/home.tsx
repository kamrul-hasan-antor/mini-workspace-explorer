"use client";

import Header from "./header";
import Activitybar from "./activitybar";
import WorkspaceView from "./workspaceView";
import Sidebar from "./sidebar";
import SearchSidebar from "./searchSidebar";
import WorkspaceProvider from "@/context/workspaceProvider";
import { useState } from "react";
import type { SidebarPanel } from "./activitybar";

function HomeContent() {
  const [sidebarPanel, setSidebarPanel] = useState<SidebarPanel>("explorer");
  const [query, setQuery] = useState("");
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Header />
      <div className="flex min-h-0 flex-1">
        <div className="flex min-h-0">
          <Activitybar
            activePanel={sidebarPanel}
            onPanelChange={setSidebarPanel}
          />
          {sidebarPanel === "explorer" ? (
            <Sidebar />
          ) : (
            <SearchSidebar query={query} setQuery={setQuery} />
          )}
        </div>
        <div className="min-h-0 min-w-0 flex-1">
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
