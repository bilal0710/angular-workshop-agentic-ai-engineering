import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from './book';

@Injectable({ providedIn: 'root' })
export class BookApiClient {
  private readonly apiUrl = 'http://localhost:4730/books';

  constructor(private http: HttpClient) {}

  getBooks(pageSize: number = 10, searchTerm?: string): Observable<Book[]> {
    let params = new HttpParams().set('_limit', pageSize.toString());

    if (searchTerm) {
      // Search in title and author fields
      params = params.set('q', searchTerm);
    }

    return this.http.get<Book[]>(this.apiUrl, { params });
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
