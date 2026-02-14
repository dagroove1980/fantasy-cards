import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-secondary">
          <Link href="/" className="font-heading font-bold text-foreground hover:text-accent">
            Fantasy.cards
          </Link>
          <div className="flex gap-6">
            <Link href="/movies" className="hover:text-foreground transition-colors">
              Movies
            </Link>
            <Link href="/books" className="hover:text-foreground transition-colors">
              Books
            </Link>
            <Link href="/tv" className="hover:text-foreground transition-colors">
              TV
            </Link>
            <Link href="/search" className="hover:text-foreground transition-colors">
              Search
            </Link>
          </div>
        </div>
        <p className="mt-4 text-xs text-secondary/80 text-center sm:text-left">
          Data from TMDB and Open Library. Fantasy.cards is not affiliated with these services.
        </p>
      </div>
    </footer>
  );
}
