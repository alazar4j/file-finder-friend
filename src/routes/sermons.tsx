import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sermons")({
  head: () => ({ meta: [{ title: "Sermons — Gospel for Generation Church" }, { name: "description", content: "Listen to recent messages from our church teaching team." }, { property: "og:title", content: "Sermons — Gospel for Generation Church" }, { property: "og:description", content: "Catch up on recent messages." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <Navigate to="/" hash="sermons" replace />,
});