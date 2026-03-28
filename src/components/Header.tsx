import { BriefcaseBusiness, Search } from "lucide-react";

const navItems = [
  "Find Jobs",
  "Top Companies",
  "Job Tracker",
  "My Calendar",
  "Documents",
  "Messages",
  "Notifications",
];

export default function Header() {
  return (
    <header className="shadow-sm bg-white">
      <div className="mx-auto flex h-14 w-full max-w-[1320px] items-center gap-6 px-4">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-[#eaf2ff] text-[#0a65c2]">
            <BriefcaseBusiness size={16} strokeWidth={2} />
          </div>
        </div>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item, index) => (
            <a
              key={item}
              href={index === 0 ? "/" : "#"}
              className={`text-[16px] ${
                index === 0 ? "text-[#0154AA] font-semibold" : "text-[#737A91]"
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden h-9 w-[260px] items-center gap-4 rounded-md bg-[#F6F9FF] px-3 text-[#9aa3b2] md:flex">
            <Search size={16} />
            <span className="text-[13px]">Search</span>
          </div>
          <button
            type="button"
            className="h-9 rounded-md border border-[#0a65c2] bg-[#0a65c2] px-5 text-[13px] font-semibold text-white"
          >
            Resume Builder
          </button>
          <img
            src="/assets/user-menu.png"
            alt=""
            width={38}
            height={38}
            className="h-8 w-8 rounded-full object-cover"
            decoding="async"
            loading="eager"
          />
        </div>
      </div>
    </header>
  );
}
