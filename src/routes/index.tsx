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
  return <main aria-label="Empty page" />
}
