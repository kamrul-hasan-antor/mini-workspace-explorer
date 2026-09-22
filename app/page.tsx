import Activitybar from "@/components/activitybar";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import WorkspaceView from "@/components/workspaceView";

export default function Home() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Header />
      <div className="flex min-h-0 flex-1">
        <div className="flex">
          <Activitybar />
          <Sidebar />
        </div>
        <div className="min-h-0 min-w-0 flex-1">
          <WorkspaceView />
        </div>
      </div>
    </div>
  );
}
