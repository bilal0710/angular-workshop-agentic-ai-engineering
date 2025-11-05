import { HttpClient, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
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
    // Use query parameter instead of path parameter because json-server
    // uses 'id' as the default identifier, not 'isbn'
    // GET /books/12333 searches for id === "12333", not isbn === "12333"
    const params = new HttpParams().set('isbn', isbn);
    return this.http.get<Book[]>(this.apiUrl, { params }).pipe(
      map((books: Book[]) => {
        if (books.length === 0) {
          // Throw an HttpErrorResponse-like error to match expected error handling
          const error = new HttpErrorResponse({
            error: `Book with ISBN ${isbn} not found`,
            status: 404,
            statusText: 'Not Found'
          });
          throw error;
        }
        return books[0];
      })
    );
  }

  /**
   * Updates an existing book
   * @param isbn - The ISBN of the book to update (kept for API consistency)
   * @param book - The updated book data
   * @returns Observable of the updated book
   */
  updateBook(isbn: string, book: Book): Observable<Book> {
    // Use the book's id for the PUT request since json-server uses 'id' as identifier
    // The isbn parameter is kept for consistency with the API, but we use book.id for the actual update
    return this.http.put<Book>(`${this.apiUrl}/${book.id}`, book);
  }

  /**
   * Creates a new book
   * @param book - The book data to create (id and userId will be generated/handled by the server)
   * @returns Observable of the created book
   */
  createBook(book: Omit<Book, 'id' | 'userId'>): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }
}
