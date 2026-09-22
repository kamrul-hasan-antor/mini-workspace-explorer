"use client";

import Header from "./header";
import Activitybar from "./activitybar";
import WorkspaceView from "./workspaceView";
import Sidebar from "./sidebar";
import WorkspaceProvider, {
  useWorkspaceContext,
} from "@/context/workspaceProvider";

const Home = () => {
  const  a  = useWorkspaceContext();
  console.log(a);
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
};

export default Home;
