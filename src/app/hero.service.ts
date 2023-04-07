import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from "rxjs";
import { Hero } from './hero';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private heroesUrl = `api/heroes`

  /* 
    CRUD 
  */

  /**
  * DELETE: delete the hero from the server
  * @param {number} id
  * @returns {Observable<Hero>}
  */
  deleteHero(id: number): Observable<Hero> {
    return this.http.delete<Hero>(`${this.heroesUrl}/${id}`, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    )
  }

  /**
   * POST: add a new hero to the server
   * @param {Hero} hero
   * @returns {Observable<Hero>}
   */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<any>(`addHero`))
    )
  }

  /**
   * PUT: update the hero on the server
   * @param {Hero} hero 
   * @returns {Observable<any>}
   */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(() => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>(`updateHero`))
    );
  }

  /**
   * GET heroes from the server
   * @returns {Observable<Hero[]>}
   */
  getHeroes(): Observable<Hero[]> {
    const heroes = this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(() => this.log(`fetched heroes`)),
      catchError(this.handleError<Hero[]>(`getHeroes`, []))
    )
    return heroes
  }

/**
 * GET hero by id. Will 404 if id not found 
 * @param {Number} id 
 * @returns {Observable<Hero>}
 */
  public getHero(id: Number): Observable<Hero> {
    // const hero = HEROES.find((h) => h.id === id)!
    const hero = this.http.get<Hero>(`${this.heroesUrl}/${id}`).pipe(
      tap(() => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    )
    return hero
  }

  /**
 * GET hero by id. Return `undefined` when id not found
 * @param {Number} id 
 * @returns {Observable<Hero>}
 */
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  /* ************************************************ */

  /**
   * 
   * @param {string} term 
   * @returns Observable<Hero[]>
   */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not seach term return empty hero array
      return of([])
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap((x) => x.length ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)
      ),
      catchError(this.handleError<Hero[]>(`searchHeroes`, []))
    )
  }




  /* ************************************************ */
  /**
 * Handle Http operation that failed.
 * Let the app continue.
 *
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }



  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`)
  }

  constructor(private http: HttpClient, private messageService: MessageService) { }
}
