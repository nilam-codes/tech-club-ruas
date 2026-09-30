// Centralized Events Data
// Structured for future backend integration and modular interactive event pages.
// Populated with clearly marked placeholders until real club events are scheduled.

export const UPCOMING_FLAGSHIP_EVENT = {
  id: "6c6718bf-12b8-4b2a-a172-52d62fe4250f",
  title: "COOKED WITHOUT CODE",
  category: "Interactive AI Competition",
  status: "upcoming",
  displayDate: "30 September 2026",
  description: "An interactive AI challenge where participants use AI creatively to tackle unexpected challenges, create solutions, and compete through multiple rounds. No coding is required.",
  ctaText: "ENTER GAME",
  route: "/events/cooked-without-code",
  registrationOpen: false
};

export const EVENTS_LIST = [
  UPCOMING_FLAGSHIP_EVENT,
  {
    id: "upcoming-workshop-event",
    title: "[UPCOMING TECHNICAL WORKSHOP TITLE]",
    category: "[WORKSHOP TRACK]",
    status: "upcoming",
    displayDate: "[DATE PLACEHOLDER — e.g. November 04, 2026]",
    time: "[TIME PLACEHOLDER — e.g. 2:00 PM – 5:00 PM]",
    location: "[LOCATION PLACEHOLDER — e.g. Computer Lab 3]",
    format: "[Hands-on Workshop]",
    eligibility: "[All Members]",
    description: "[WORKSHOP DESCRIPTION PLACEHOLDER — Practical session covering targeted technologies, tooling, and live coding exercises.]",
    registrationLink: "[Registration Link]",
    registrationOpen: true
  },
  {
    id: "past-event-01",
    title: "[PREVIOUS EVENT / HACKATHON TITLE]",
    category: "[PAST EVENT CATEGORY]",
    status: "past",
    displayDate: "[DATE PLACEHOLDER — e.g. Spring 2026]",
    time: "[Completed]",
    location: "[LOCATION PLACEHOLDER — e.g. Engineering Block]",
    format: "[Completed Event]",
    eligibility: "[Student Teams]",
    description: "[PAST EVENT RECAP PLACEHOLDER — Summary of the concluded event, key milestones, and community participation.]",
    registrationLink: "[Archive / Recap Link]",
    registrationOpen: false
  },
  {
    id: "past-event-02",
    title: "[PREVIOUS TECHNICAL SEMINAR TITLE]",
    category: "[PAST SEMINAR CATEGORY]",
    status: "past",
    displayDate: "[DATE PLACEHOLDER — e.g. Fall 2025]",
    time: "[Completed]",
    location: "[LOCATION PLACEHOLDER — e.g. Department Hall]",
    format: "[Completed Session]",
    eligibility: "[Open Session]",
    description: "[PAST SESSION RECAP PLACEHOLDER — Summary of topics explored and session takeaways.]",
    registrationLink: "[Archive / Recap Link]",
    registrationOpen: false
  }
];
