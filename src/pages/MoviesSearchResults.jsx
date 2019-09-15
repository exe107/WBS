import * as React from "react";
import _range from "lodash/range";
import { constructUrl } from "../util";
import { MOVIE_ROUTE } from "../navigation/routes";
import { StyledInput } from "../common";

const MoviesSearchResults = props => {
  const { movies } = props;
  const [moviesPerPage, setMoviesPerPage] = React.useState(50);
  const [pageIndex, setPageIndex] = React.useState(0);
  const moviesPerPageInputRef = React.useRef();

  let firstMovieOrdinal = pageIndex * moviesPerPage + 1;

  const lastMovieOrdinal = Math.min(
    firstMovieOrdinal + moviesPerPage - 1,
    movies.length
  );

  if (firstMovieOrdinal > lastMovieOrdinal) {
    firstMovieOrdinal = Math.max(1, lastMovieOrdinal - (moviesPerPage - 1));
  }

  const onSetMoviesPerPage = React.useCallback(
    () => setMoviesPerPage(Number(moviesPerPageInputRef.current.value)),
    []
  );

  const onNextClick = React.useCallback(
    () => setPageIndex(prevPageIndex => prevPageIndex + 1),
    []
  );
  const onPreviousClick = React.useCallback(
    () => setPageIndex(prevPageIndex => prevPageIndex - 1),
    []
  );

  const isFirstPage = pageIndex === 0;
  const isLastPage = lastMovieOrdinal === movies.length;

  return (
    <div className="mt-5">
      <div className="d-flex">
        <h1>Search results:</h1>
        <div className="ml-auto d-flex align-items-baseline">
          <span>Results per page:</span>
          <StyledInput
            className="ml-2 form-control"
            type="number"
            defaultValue={moviesPerPage}
            ref={moviesPerPageInputRef}
          />
          <button className="btn btn-primary ml-2" onClick={onSetMoviesPerPage}>
            Set
          </button>
        </div>
      </div>
      {_range(firstMovieOrdinal, lastMovieOrdinal + 1).map(ordinal => {
        const movie = movies[ordinal - 1];
        const { name, id, year } = movie;

        return (
          <div key={id}>
            <h4>
              {`${ordinal}. `}
              <a href={constructUrl(MOVIE_ROUTE.path, [], { id })}>
                {name} ({year})
              </a>
            </h4>
          </div>
        );
      })}
      <h5>
        {`Showing ${firstMovieOrdinal} to ${lastMovieOrdinal} out of total ${movies.length} results`}
      </h5>
      <div className="mb-5">
        {!isLastPage && (
          <button className="mr-5 btn btn-primary" onClick={onNextClick}>
            Next
          </button>
        )}
        {!isFirstPage && (
          <button className="btn btn-secondary" onClick={onPreviousClick}>
            Previous
          </button>
        )}
      </div>
    </div>
  );
};

export default MoviesSearchResults;
