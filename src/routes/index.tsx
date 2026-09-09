import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { APP_MARKUP } from '../markup'

const TITLE = 'Trial Finder — Match a patient profile to global cancer trials'
const DESC =
  'Search every recruiting study on ClinicalTrials.gov worldwide by diagnosis, biomarkers, treatment history and labs, and export a discussion guide for your oncologist.'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: 'description', content: DESC },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESC },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap',
      },
      { rel: 'stylesheet', href: '/css/styles.css' },
    ],
  }),
  component: IndexPage,
})

function loadScript(src: string, type?: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[data-tf="${src}"]`)) return resolve()
    const el = document.createElement('script')
    el.src = src
    el.dataset.tf = src
    if (type) el.type = type
    el.onload = () => resolve()
    el.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.body.appendChild(el)
  })
}

function IndexPage() {
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js').catch(
        () => undefined,
      )
      if (!cancelled) await loadScript('/js/app.js', 'module').catch(() => undefined)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return <div dangerouslySetInnerHTML={{ __html: APP_MARKUP }} />
}
