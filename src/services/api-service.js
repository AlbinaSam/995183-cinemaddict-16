import {Method} from '../consts';
import {adaptFilmToServer} from '../utils/utils';

export const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';
export const AUTHORIZATION = 'Basic h58vv5we5cmf09f';

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor (endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get films() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  getComments = (filmId) => this.#load({url: `comments/${filmId}`})
    .then(ApiService.parseResponse);

  // updateFilm = async (film) => {
  //   const response = await this.#load({url:`movies/${film.id}`,
  //     method: Method.PUT,
  //     body: JSON.stringify(adaptFilmToServer(film)),
  //     headers: new Headers({'Content-Type': 'application/json'})
  //   });

  //   const parsedResponse = await ApiService.parseResponse(response);
  //   return parsedResponse;
  // }

  updateFilm = async (film) => this.#load({url:`movies/${film.id}`,
    method: Method.PUT,
    body: JSON.stringify(adaptFilmToServer(film)),
    headers: new Headers({'Content-Type': 'application/json'})
  }).then(ApiService.parseResponse);

  // addComment = async (comment, filmId) => {
  //   const response = await this.#load({url: `comments/${filmId}`,
  //     method: Method.POST,
  //     body: JSON.stringify(comment),
  //     headers: new Headers({'Content-Type': 'application/json'})
  //   });

  //   const parsedResponse = await ApiService.parseResponse(response);
  //   return parsedResponse;
  // }

  addComment = async (comment, filmId) => this.#load({url: `comments/${filmId}`,
    method: Method.POST,
    body: JSON.stringify(comment),
    headers: new Headers({'Content-Type': 'application/json'})
  }).then(ApiService.parseResponse);


  // deleteComment = async (comment) => {

  //   const response = await this.#load({url: `comments/${comment.id}`,
  //     method: Method.DELETE
  //   });

  //   return response;
  // }

  deleteComment = async (comment) =>  this.#load({url: `comments/${comment.id}`, method: Method.DELETE
  });


  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers}
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}:${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
