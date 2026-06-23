// In-memory critic reviews tool. Returns hardcoded reviews for a given movie
// ID (Shawshank, Godfather, or Dark Knight). Returns empty array if not found.

export async function getReviews(movieId: string) {
  const reviews: Record<string, { critic: string; score: number; summary: string }[]> = {
    tt0111161: [
      { critic: "Roger Ebert", score: 100, summary: "A timeless masterpiece of hope and redemption." },
      { critic: "Variety", score: 95, summary: "An emotionally resonant prison drama." },
    ],
    tt0068646: [
      { critic: "Roger Ebert", score: 100, summary: "The greatest film ever made about power and family." },
      { critic: "Empire", score: 100, summary: "An epic crime saga that redefined cinema." },
    ],
    tt0468569: [
      { critic: "Empire", score: 95, summary: "A dark, complex superhero film that transcends the genre." },
      { critic: "IGN", score: 90, summary: "Heath Ledger's Joker is an all-time great performance." },
    ],
  };

  return reviews[movieId] ?? [];
}
