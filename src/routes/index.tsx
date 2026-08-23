import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Empty Page Project' },
      { name: 'description', content: 'A blank starting point ready for your first feature.' },
      { property: 'og:title', content: 'Empty Page Project' },
      { property: 'og:description', content: 'A blank starting point ready for your first feature.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
  component: IndexPage,
})

function IndexPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Empty Page Project</h1>
      <p className="text-sm text-neutral-500">
        Your blank canvas is ready. Ask for your first feature to get started.
      </p>
    </main>
  )
}
