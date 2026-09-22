"use client";

import { Files, Search } from "lucide-react";

const Activitybar = () => {
  return (
    <div className="flex w-12 shrink-0 flex-col gap-2 items-center border-r border-r-[var(--border)] bg-[var(--bg-activitybar)] pt-2">
      <ActivitybarItem icon={<Files className="size-5" />} onClick={() => {}} />
      <ActivitybarItem
        icon={<Search className="size-5" />}
        onClick={() => {}}
      />
    </div>
  );
};

const ActivitybarItem = ({
  icon,
  onClick,
}: {
  icon: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      className="hover:bg-[#2a2a2a] rounded cursor-pointer p-2 outline-none border-none"
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

export default Activitybar;
