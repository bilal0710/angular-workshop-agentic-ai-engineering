import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from './book';

export interface BooksResponse {
  books: Book[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class BookApiClient {
  private readonly apiUrl = 'http://localhost:4730/books';
  private readonly http = inject(HttpClient);

  getBooks(page: number = 1, pageSize: number = 10, searchTerm?: string): Observable<BooksResponse> {
    let params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', pageSize.toString());

    if (searchTerm) {
      // Search in title and author fields
      params = params.set('q', searchTerm);
    }

    return this.http.get<Book[]>(this.apiUrl, { params, observe: 'response' }).pipe(
      map((response: HttpResponse<Book[]>) => {
        const total = response.headers.get('X-Total-Count')
          ? parseInt(response.headers.get('X-Total-Count') || '0', 10)
          : response.body?.length || 0;
        
        return {
          books: response.body || [],
          total
        };
      })
    );
  }

  /**
   * Fetches a single book by its ISBN
   * @param isbn - The ISBN of the book to fetch
   * @returns Observable of the book
   */
  getBookByIsbn(isbn: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${isbn}`);
  }

  /**
   * Updates an existing book
   * @param isbn - The ISBN of the book to update
   * @param book - The updated book data
   * @returns Observable of the updated book
   */
  updateBook(isbn: string, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${isbn}`, book);
  }
}
