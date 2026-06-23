// In-memory movie catalog search tool. Filters a hardcoded list of 10 movies
// by title, genre, or year matching the given query string.

export async function searchMovies(query: string) {
  const movies = [
    { id: "tt0111161", title: "The Shawshank Redemption", year: 1994, genre: "Drama", rating: 9.3 },
    { id: "tt0068646", title: "The Godfather", year: 1972, genre: "Crime", rating: 9.2 },
    { id: "tt0468569", title: "The Dark Knight", year: 2008, genre: "Action", rating: 9.0 },
    { id: "tt0110912", title: "Pulp Fiction", year: 1994, genre: "Crime", rating: 8.9 },
    { id: "tt0137523", title: "Fight Club", year: 1999, genre: "Drama", rating: 8.8 },
    { id: "tt0109830", title: "Forrest Gump", year: 1994, genre: "Drama", rating: 8.8 },
    { id: "tt0167260", title: "The Lord of the Rings: The Return of the King", year: 2003, genre: "Adventure", rating: 8.9 },
    { id: "tt1375666", title: "Inception", year: 2010, genre: "Sci-Fi", rating: 8.8 },
    { id: "tt0133093", title: "The Matrix", year: 1999, genre: "Sci-Fi", rating: 8.7 },
    { id: "tt0103064", title: "Terminator 2: Judgment Day", year: 1991, genre: "Action", rating: 8.6 },
  ];

  const q = query.toLowerCase();
  return movies.filter(
    (m) =>
      m.title.toLowerCase().includes(q) ||
      m.genre.toLowerCase().includes(q) ||
      m.year.toString() === q,
  );
}
