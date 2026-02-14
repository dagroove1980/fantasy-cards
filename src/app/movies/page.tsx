import { getFantasyMovies } from '@/lib/tmdb';
import { MovieCard } from '@/components/MovieCard';
import { SITE_URL, SITE_NAME } from '@/lib/constants';

export const revalidate = 3600;

export const metadata = {
  title: 'Fantasy Movies',
  description:
    'Browse popular fantasy movies. Ratings, release dates, and details from our curated collection.',
  openGraph: {
    title: 'Fantasy Movies | Fantasy Cards',
    url: `${SITE_URL}/movies`,
  },
};

export default async function MoviesPage() {
  const { results } = await getFantasyMovies(1);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Fantasy Movies
        </h1>
        <p className="text-secondary mt-2">
          Popular fantasy films ranked by popularity. Data from TMDB.
        </p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
