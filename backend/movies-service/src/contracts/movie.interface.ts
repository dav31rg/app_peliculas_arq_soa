export interface Movie {
  imdbID: string;
  title: string;
  year: string;
  genre: string;
  director: string;
  actors: string;
  plot: string;
  poster: string;
  imdbRating: string;
  runtime: string;
  rated: string;
  boxOffice: string;
  awards: string;
}

export interface MovieCategory {
  category: string;
  label: string;
  movies: Movie[];
}
