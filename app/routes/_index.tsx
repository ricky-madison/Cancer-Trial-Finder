import type { MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => [
  { title: 'Empty Page Project' },
  { name: 'description', content: 'A blank starting point ready for your first feature.' },
];

export default function Index() {
  return <main />;
}
