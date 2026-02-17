import Link from 'next/link';
import { Search, Book, Film, Tv } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link
            href="/"
            className="flex items-center gap-2 font-heading text-lg font-bold"
          >
            <span className="text-foreground">Fantasy</span>
            <span className="text-accent">Movies</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-secondary">
            <Link
              href="/movies"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Film size={18} />
              Movies
            </Link>
            <Link
              href="/books"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Book size={18} />
              Books
            </Link>
            <Link
              href="/tv"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Tv size={18} />
              TV
            </Link>
            <Link
              href="/search"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Search size={18} />
              Search
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
