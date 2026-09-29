import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/portal")({
  head: () => ({ meta: [{ title: "Member Portal — Gospel for Generation Church" }, { name: "description", content: "View giving history, household details and prayer requests." }, { property: "og:title", content: "Member Portal" }, { property: "og:description", content: "Member resources for Gospel for Generation Church." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <Navigate to="/" hash="members" replace />,
});