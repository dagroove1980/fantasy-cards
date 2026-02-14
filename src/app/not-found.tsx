import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
        404
      </h1>
      <p className="text-secondary mb-8">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 rounded-lg bg-accent text-background font-semibold hover:opacity-90 transition-opacity"
      >
        Go Home
      </Link>
    </div>
  );
}
