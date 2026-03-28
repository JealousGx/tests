import { createFileRoute } from "@tanstack/react-router";
import {
  Bookmark,
  ChevronDown,
  LocateFixed,
  MapPin,
  Search,
} from "lucide-react";
import React from "react";

export const Route = createFileRoute("/")({ component: App });

const tags = ["Frontend", "Backend", "Graphic Designer"];

export type JobListing = {
  id: string;
  title: string;
  company: string;
  location: string;
  postedAgo: string;
  applicantCount: number;
};

const TITLES = [
  "UI/UX Designer",
  "Senior Frontend Engineer",
  "Product Designer",
  "Backend Developer",
  "Graphic Designer",
  "DevOps Engineer",
  "Mobile Developer",
  "Data Analyst",
  "QA Engineer",
  "Technical Writer",
] as const;

const COMPANIES = [
  "Teams",
  "Stripe",
  "Notion",
  "Figma",
  "Linear",
  "Vercel",
  "Shopify",
  "Airbnb",
  "Dropbox",
  "Slack",
] as const;

const LOCATIONS = [
  "Seattle, USA (Remote)",
  "San Francisco, USA (Hybrid)",
  "New York, USA (On-site)",
  "Austin, USA (Remote)",
  "Chicago, USA (Hybrid)",
] as const;

function buildJob(index: number): JobListing {
  const days = (index % 7) + 1;
  return {
    id: `job-${index}`,
    title: TITLES[index % TITLES.length],
    company: COMPANIES[index % COMPANIES.length],
    location: LOCATIONS[index % LOCATIONS.length],
    postedAgo: days === 1 ? "1 day ago" : `${days} days ago`,
    applicantCount: 12 + (index % 40) * 2,
  };
}

const JOB_POOL = Array.from({ length: 25 }, (_, i) => buildJob(i));

const sections: {
  title: string;
  link: string;
  promoted: boolean;
  jobs: JobListing[];
}[] = [
  {
    title: "Featured Jobs",
    link: "See Featured Jobs",
    promoted: true,
    jobs: JOB_POOL.slice(0, 5),
  },
  {
    title: "Recommended Jobs",
    link: "See Recommended Jobs",
    promoted: false,
    jobs: JOB_POOL.slice(5, 15),
  },
  {
    title: "Latest Jobs",
    link: "See Latest Jobs",
    promoted: false,
    jobs: JOB_POOL.slice(15, 25),
  },
];

function JobCard({ job, promoted }: { job: JobListing; promoted: boolean }) {
  return (
    <article className="flex flex-col rounded-xl border border-[#e7ecf3] bg-white p-4 shadow-[0_2px_6px_rgba(9,30,66,0.04)]">
      {promoted ? (
        <p className="mb-2 text-[10px] font-semibold leading-none text-[#8a93a5]">
          Promoted
        </p>
      ) : null}

      <div className="mb-2 flex gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#edf2ff] text-[#5f74d8]">
          <LocateFixed size={16} strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1 space-y-0.5">
          <h3 className="truncate text-[14px] font-medium leading-tight text-[#1d2330]">
            {job.title}
          </h3>
          <p className="truncate text-[12px] leading-tight text-[#5d6470] font-medium">
            {job.company}
          </p>
        </div>
      </div>

      <p className="mb-1.5 flex items-start gap-1.5 text-[12px] leading-snug text-[#6b7280]">
        <MapPin
          size={12}
          className="mt-0.5 shrink-0"
          strokeWidth={2}
          aria-hidden
        />
        <span className="min-w-0">{job.location}</span>
      </p>

      <p className="mb-3 text-[12px] leading-snug text-[#6b7280]">
        <span>{job.postedAgo}</span>
        <span className="text-[#9ca3af]"> | </span>
        <span className="text-[#0a65c2]">{job.applicantCount} applicants</span>
      </p>

      <div className="mt-auto flex items-center gap-2">
        <button
          type="button"
          className="flex h-8 min-w-0 flex-1 items-center justify-center rounded-md bg-[#0a65c2] px-3 text-[12px] font-semibold text-white"
        >
          Apply Now
        </button>

        <button
          type="button"
          aria-label="Save job"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#8d96a8]"
        >
          <Bookmark size={14} strokeWidth={2} />
        </button>
      </div>
    </article>
  );
}

function App() {
  return (
    <main className="mx-auto w-full max-w-[1320px] px-4 py-6">
      <div className="grid gap-4 lg:grid-cols-[346px_minmax(0,1fr)]">
        <aside className="space-y-3">
          <section className="isolate overflow-hidden rounded-xl bg-white">
            <div className="relative z-0 h-[100px] w-full overflow-hidden bg-[#e8edf5]">
              <img
                src="/assets/cover.png"
                alt=""
                width={346}
                height={100}
                className="h-full w-full object-cover object-center"
                decoding="async"
                fetchPriority="high"
              />
            </div>
            <div className="relative -mt-8 px-4 pb-4">
              <img
                src="/assets/profile.png"
                alt="Albert Flores"
                width={90}
                height={90}
                className="mx-auto h-16 w-16 rounded-full object-cover"
                decoding="async"
                loading="eager"
              />
              <h2 className="mt-2 text-center text-[24px] font-semibold text-[#1d2330]">
                Albert Flores
              </h2>
              <p className="mx-auto max-w-[210px] text-center text-[13px] leading-5 text-[#6b7280]">
                Senior Product Designer | UI/UX Designer | Graphic Designer |
                Web...
              </p>
              <p className="mt-1 text-center text-[12px] text-[#9aa3b2]">
                Clinton, Maryland
              </p>
            </div>
          </section>

          <section className="rounded-xl bg-white px-4 py-3">
            {[
              ["Profile Visitors", "140"],
              ["Resume Viewers", "20"],
              ["My Jobs", "88"],
            ].map(([label, value], index) => (
              <div
                key={label}
                className={`flex items-center justify-between py-2 text-[14px] ${
                  index !== 2 ? "border-b border-[#eef2f8]" : ""
                }`}
              >
                <span className="text-[#5d6470] font-semibold">{label}</span>
                <span className="font-semibold text-[#0a65c2]">{value}</span>
              </div>
            ))}
          </section>

          <section className="rounded-xl bg-white px-4 py-3 flex justify-between items-center">
            <div className="flex flex-col">
              <h3 className="text-[16px] font-semibold text-[#1d2330]">
                My calendar
              </h3>

              <p className="text-[14px] font-medium text-[#8d96a8]">
                Upcoming Interviews
              </p>
            </div>

            <ChevronDown size={16} className="text-[#9aa3b2]" />
          </section>
        </aside>

        <section className="px-4">
          <div className="mb-2 rounded-xl bg-[#f6f8fc]">
            <h1 className="text-[22px] leading-10 font-semibold text-[#1d2330]">
              Find your Dream Job,{" "}
              <span className="text-[#0a65c2]">Albert!</span>
            </h1>
            <p className="mt-1 text-[14px] text-[#6b7280] font-medium">
              Explore the latest job openings and apply for the best
              opportunities available today!
            </p>

            <div className="mt-4 grid h-[77px] p-4 grid-cols-[minmax(0,1.2fr)_minmax(0,0.7fr)_minmax(0,0.45fr)_minmax(0,0.45fr)] items-stretch gap-0 overflow-hidden rounded-xl bg-white">
              <div className="flex min-w-0 items-center gap-2 border-r border-[#E9ECEF] px-1 text-[#9aa3b2]">
                <Search size={16} className="shrink-0" />

                <span className="truncate text-sm">
                  Job Title, Company, or Keywords
                </span>
              </div>

              <button
                type="button"
                className="flex min-w-0 items-center justify-center gap-1 border-r border-[#E9ECEF] px-1 text-sm text-[#5d6470]"
              >
                <span className="truncate">Select Location</span>
                <ChevronDown size={14} className="shrink-0" />
              </button>

              <button
                type="button"
                className="flex min-w-0 items-center justify-center gap-1 border-r border-[#E9ECEF] px-1 text-sm text-[#5d6470]"
              >
                <span className="truncate">Job Type</span>
                <ChevronDown size={14} className="shrink-0" />
              </button>

              <button
                type="button"
                className="flex min-w-0 items-center justify-center gap-2 bg-[#0a65c2] px-3 text-sm rounded-xl font-semibold text-white"
              >
                <Search size={14} />
                Search
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[14px] text-[#737A91] font-medium">
                Similar:
              </span>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="h-8 rounded-[5px] border border-[#737A91] px-3 text-[12px] text-[#737A91]"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <hr className="my-6 border-[#E9ECEF]" />

          <div className="space-y-6">
            {sections.map((section) => (
              <React.Fragment key={section.title}>
                <section>
                  <div className="mb-3 flex items-center gap-3">
                    <h2 className="text-[18px] leading-8 font-medium text-[#1d2330]">
                      {section.title}
                    </h2>
                    <a
                      href="#"
                      className="text-[14px] font-medium text-[#0a65c2] underline-offset-2 underline"
                    >
                      {section.link}
                    </a>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                    {section.jobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        promoted={section.promoted}
                      />
                    ))}
                  </div>
                </section>
                <hr className="my-4 border-[#E9ECEF]" />
              </React.Fragment>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
