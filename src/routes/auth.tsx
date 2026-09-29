import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Member Sign In — Gospel for Generation Church" }, { name: "description", content: "Sign in or create a member account." }, { property: "og:title", content: "Member Sign In" }, { property: "og:description", content: "Access the Gospel for Generation Church member portal." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <Navigate to="/" hash="members" replace />,
});