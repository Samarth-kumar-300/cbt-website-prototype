"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/shared/Button";
import { DEPARTMENTS, JOBS, LOCATIONS } from "./content";

const SELECT =
  "h-12 w-full appearance-none rounded-[12px] border border-[#d6e8e6] bg-[#fbfaf7] px-4 pr-10 text-[14px] text-text-default focus:outline-none focus:ring-2 focus:ring-brand-teal lg:w-[220px]";

function Caret() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 8 5"
      width="8"
      height="5"
      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#323439]"
    >
      <path d="M0 0h8L4 5z" fill="currentColor" />
    </svg>
  );
}

export function JobList() {
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");

  const jobs = useMemo(
    () =>
      JOBS.filter(
        (job) =>
          (department === "" || job.department === department) &&
          (location === "" || job.location === location),
      ),
    [department, location],
  );

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 lg:mt-10 lg:gap-x-5">
        <span className="w-full font-heading text-[14px] font-semibold leading-6 text-brand-teal lg:w-auto lg:text-[16px]">
          Filter by
        </span>
        <div className="relative w-full lg:w-auto">
          <label htmlFor="filter-department" className="sr-only">
            Department
          </label>
          <select
            id="filter-department"
            className={SELECT}
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">Department</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <Caret />
        </div>
        <div className="relative w-full lg:w-auto">
          <label htmlFor="filter-location" className="sr-only">
            Location
          </label>
          <select
            id="filter-location"
            className={SELECT}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Location</option>
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <Caret />
        </div>
        <button
          type="button"
          onClick={() => {
            setDepartment("");
            setLocation("");
          }}
          className="inline-flex h-12 items-center px-1 font-semibold text-content-brand-secondary underline-offset-4 hover:underline"
        >
          Clear filters
        </button>
      </div>
      <p
        className="mt-4 text-[14px] text-text-secondary lg:text-[16px]"
        aria-live="polite"
      >
        {jobs.length} open {jobs.length === 1 ? "position" : "positions"}
      </p>
      <ul className="mt-4 flex flex-col gap-4">
        {jobs.map((job) => (
          <li
            key={job.slug}
            className="flex flex-col gap-4 rounded-[18px] border border-[#e4edea] bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between lg:px-8 lg:py-6"
          >
            <div className="flex flex-col gap-3">
              <h3 className="font-heading text-[18px] font-semibold leading-[26px] text-brand-teal lg:text-[24px] lg:leading-[30px]">
                {job.title}
              </h3>
              <div className="flex flex-wrap gap-2 text-[13px] max-lg:text-[14px] lg:text-[14px]">
                <span className="rounded-full bg-[#eef4f3] px-3 py-1 text-text-default">
                  {job.department}
                </span>
                <span className="rounded-full bg-[#e4f2f8] px-3 py-1 text-[#2b5d7a]">
                  On-site - {job.location}
                </span>
                <span className="rounded-full bg-[#f1f1f1] px-3 py-1 text-text-secondary">
                  {job.type}
                </span>
              </div>
            </div>
            <Button
              href={`/careers/${job.slug}`}
              size="md"
              arrow
              className="self-start sm:self-auto"
            >
              View role
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
}
