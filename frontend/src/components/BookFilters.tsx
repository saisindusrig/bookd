import type { BookFilterOptions } from "../utils/bookFilters";

interface BookFiltersProps {
  filters: BookFilterOptions;
  setFilters: React.Dispatch<
    React.SetStateAction<BookFilterOptions>
  >;
  genres: string[];
  languages: string[];
}

const BookFilters = ({
  filters,
  setFilters,
  genres,
  languages,
}: BookFiltersProps) => {
  const updateFilter = (
    key: keyof BookFilterOptions,
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      genre: "",
      minRating: "",
      language: "",
      sortBy: "",
    });
  };

  const hasFilters =
    filters.genre ||
    filters.minRating ||
    filters.language ||
    filters.sortBy;

  return (
    <div className="w-full border-y border-primary/20 py-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

        {/* FILTERS */}
        <div className="flex flex-wrap gap-4">

          {/* GENRE */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">
              Genre
            </label>

            <select
              value={filters.genre}
              onChange={(e) =>
                updateFilter("genre", e.target.value)
              }
              className="min-w-[160px] rounded-md border border-primary/30 bg-background px-3 py-2 text-sm outline-none"
            >
              <option value="">All Genres</option>

              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* RATING */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">
              Rating
            </label>

            <select
              value={filters.minRating}
              onChange={(e) =>
                updateFilter("minRating", e.target.value)
              }
              className="min-w-[160px] rounded-md border border-primary/30 bg-background px-3 py-2 text-sm outline-none"
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5+ ⭐</option>
              <option value="4">4+ ⭐</option>
              <option value="3.5">3.5+ ⭐</option>
              <option value="3">3+ ⭐</option>
            </select>
          </div>

          {/* LANGUAGE */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">
              Language
            </label>

            <select
              value={filters.language}
              onChange={(e) =>
                updateFilter("language", e.target.value)
              }
              className="min-w-[160px] rounded-md border border-primary/30 bg-background px-3 py-2 text-sm outline-none"
            >
              <option value="">All Languages</option>

              {languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SORT + CLEAR */}
        <div className="flex flex-wrap items-end gap-4">

          {/* SORT */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">
              Sort By
            </label>

            <select
              value={filters.sortBy}
              onChange={(e) =>
                updateFilter("sortBy", e.target.value)
              }
              className="min-w-[190px] rounded-md border border-primary/30 bg-background px-3 py-2 text-sm outline-none"
            >
              <option value="">Default</option>
              <option value="rating-high">
                Rating: High → Low
              </option>
              <option value="rating-low">
                Rating: Low → High
              </option>
              <option value="newest">
                Newest → Oldest
              </option>
              <option value="oldest">
                Oldest → Newest
              </option>
              <option value="most-reviewed">
                Most Reviewed
              </option>
            </select>
          </div>

          {/* CLEAR */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="rounded-md border border-primary px-4 py-2 text-sm font-semibold transition hover:bg-primary hover:text-background"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookFilters;