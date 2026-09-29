import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/events")({
  head: () => ({ meta: [{ title: "Upcoming Events — Gospel for Generation Church" }, { name: "description", content: "Church events and gatherings in Addis Ababa." }, { property: "og:title", content: "Upcoming Church Events" }, { property: "og:description", content: "See what is happening across our church family." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <Navigate to="/" hash="events" replace />,
});