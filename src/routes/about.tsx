import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About Us — Gospel for Generation Church" }, { name: "description", content: "Learn about Gospel for Generation Church in Addis Ababa." }, { property: "og:title", content: "About Gospel for Generation Church" }, { property: "og:description", content: "Our story, convictions and leadership." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <Navigate to="/" hash="about" replace />,
});