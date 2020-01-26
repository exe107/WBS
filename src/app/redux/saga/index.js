// @flow
import { takeEvery, call, put, all } from 'redux-saga/effects';
import {
  LOGIN_USER,
  LOGOUT_USER,
  DELETE_RATING,
  RATE_MOVIE,
  clearUserAction,
  removeRatingAction,
  saveRatingAction,
  updateRatingAction,
  saveUserAction,
  REGISTER_USER,
  deleteWatchlistMovieAction,
  WATCHLIST_REMOVE_MOVIE,
  WATCHLIST_ADD_MOVIE,
  saveMovieToWatchlistAction,
} from 'app/redux/user/actions';
import {
  addMovieToWatchlist,
  deleteRating,
  deleteWatchlistMovie,
  logInUser,
  logOutUser,
  rateMovie,
  registerUser,
} from 'app/http';
import { hideSpinner, showSpinner } from 'app/redux/spinner/actions';
import { addError } from 'app/redux/errors/actions';
import type {
  AddWatchlistMovieAction,
  DeleteRatingAction,
  LogInUserAction,
  RateMovieAction,
  RegisterUserAction,
  RemoveWatchlistMovieAction,
} from 'app/redux/user/flow';

type SagaFunction = Generator<any, any, any>;

function withSpinner(worker: Function): Function {
  return function*(...args) {
    yield put(showSpinner());

    try {
      yield call(worker, ...args);
    } catch (error) {
      yield put(addError(error));
    }

    yield put(hideSpinner());
  };
}

function* registerWorker({ userDetails }: RegisterUserAction): SagaFunction {
  const user = yield call(registerUser, userDetails);
  yield put(saveUserAction(user));
}

function* logInWorker({ userCredentials }: LogInUserAction): SagaFunction {
  const user = yield call(logInUser, userCredentials);
  yield put(saveUserAction(user));
}

function* logOutWorker(): SagaFunction {
  yield call(logOutUser);
  yield put(clearUserAction());
}

function* rateMovieWorker({
  movieRating,
  isNewRating,
}: RateMovieAction): SagaFunction {
  yield call(rateMovie, movieRating);

  const action = isNewRating
    ? saveRatingAction(movieRating)
    : updateRatingAction(movieRating);

  yield put(action);
}

function* deleteRatingWorker({ movieId }: DeleteRatingAction): SagaFunction {
  yield call(deleteRating, movieId);
  yield put(removeRatingAction(movieId));
}

function* addMovieToWatchlistWorker({
  movie,
}: AddWatchlistMovieAction): SagaFunction {
  yield call(addMovieToWatchlist, movie);
  yield put(saveMovieToWatchlistAction(movie));
}

function* deleteWatchlistMovieWorker({
  movieId,
}: RemoveWatchlistMovieAction): SagaFunction {
  yield call(deleteWatchlistMovie, movieId);
  yield put(deleteWatchlistMovieAction(movieId));
}

function* registerWatcher(): SagaFunction {
  yield takeEvery(REGISTER_USER, withSpinner(registerWorker));
}

function* logInWatcher(): SagaFunction {
  yield takeEvery(LOGIN_USER, withSpinner(logInWorker));
}

function* logOutWatcher(): SagaFunction {
  yield takeEvery(LOGOUT_USER, withSpinner(logOutWorker));
}

function* rateMovieWatcher(): SagaFunction {
  yield takeEvery(RATE_MOVIE, withSpinner(rateMovieWorker));
}

function* deleteRatingWatcher(): SagaFunction {
  yield takeEvery(DELETE_RATING, withSpinner(deleteRatingWorker));
}

function* addMovieToWatchlistWatcher(): SagaFunction {
  yield takeEvery(WATCHLIST_ADD_MOVIE, withSpinner(addMovieToWatchlistWorker));
}

function* deleteWatchlistMovieWatcher(): SagaFunction {
  yield takeEvery(
    WATCHLIST_REMOVE_MOVIE,
    withSpinner(deleteWatchlistMovieWorker),
  );
}

export default function* rootSaga(): SagaFunction {
  yield all([
    registerWatcher(),
    logInWatcher(),
    logOutWatcher(),
    rateMovieWatcher(),
    deleteRatingWatcher(),
    addMovieToWatchlistWatcher(),
    deleteWatchlistMovieWatcher(),
  ]);
}
