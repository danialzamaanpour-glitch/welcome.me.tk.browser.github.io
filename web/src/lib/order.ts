/**
 * Cross-section handoff: any card can ask the order form to focus on one
 * service without prop drilling.
 */
export const ORDER_EVENT = 'danialchap:order-request';

export function requestOrder(service?: string) {
  window.dispatchEvent(new CustomEvent(ORDER_EVENT, { detail: { service } }));
  const target = document.getElementById('order');
  if (!target) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
}
