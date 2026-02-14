import { Suspense } from 'react';
import { SearchContent } from './SearchContent';

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchContent />
    </Suspense>
  );
}

function SearchFallback() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-6">
        Search
      </h1>
      <div className="h-12 bg-card rounded-lg animate-pulse" />
    </div>
  );
}
