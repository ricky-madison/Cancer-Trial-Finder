import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "New Project — Blank Start" },
      {
        name: "description",
        content: "A clean, empty starting page ready for your first feature.",
      },
      { property: "og:title", content: "New Project — Blank Start" },
      {
        property: "og:description",
        content: "A clean, empty starting page ready for your first feature.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <h1 className="text-2xl font-semibold text-foreground">Empty page</h1>
    </main>
  );
}
