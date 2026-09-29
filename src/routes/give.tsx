import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/give")({
  head: () => ({ meta: [{ title: "Give — Gospel for Generation Church" }, { name: "description", content: "Support the ministries and missions of Gospel for Generation Church." }, { property: "og:title", content: "Give — Gospel for Generation Church" }, { property: "og:description", content: "Thank you for supporting our ministry." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <Navigate to="/" hash="give" replace />,
});