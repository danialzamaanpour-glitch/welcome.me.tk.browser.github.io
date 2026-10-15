import { useEffect } from 'react'

/** Set the document title and meta description for the current route. */
export function usePageMeta(title, description) {
  useEffect(() => {
    if (title) document.title = `${title} | VELORA`
    if (description) {
      let tag = document.querySelector('meta[name="description"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', 'description')
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', description)
    }
  }, [title, description])
}
