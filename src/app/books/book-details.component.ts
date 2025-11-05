import { Component, OnInit, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Book } from './book';
import { BookApiClient } from './book-api-client.service';

@Component({
  selector: 'app-book-details',
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container mx-auto px-4 py-12 max-w-4xl">
      <button
        (click)="goBack()"
        class="mb-6 flex items-center text-blue-700 hover:text-blue-900 font-medium transition-colors duration-200"
      >
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to List
      </button>

      @if (loading()) {
        <div class="flex justify-center items-center py-20">
        <div class="animate-pulse flex flex-col items-center">
          <div
            class="h-16 w-16 rounded-full border-4 border-t-blue-700 border-r-blue-700 border-b-gray-200 border-l-gray-200 animate-spin"
          ></div>
          <p class="mt-4 text-gray-600">Loading book details...</p>
        </div>
        </div>
      }

      @if (error()) {
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg
          class="h-12 w-12 text-red-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="text-red-800 font-medium mb-2">Error loading book</p>
        <p class="text-red-600 text-sm">{{ error() }}</p>
        <button
          (click)="goBack()"
          class="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          Back to List
        </button>
        </div>
      }

      @if (!loading() && !error() && book()) {
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="md:flex">
          <div class="md:w-1/3 p-6 bg-gray-50 flex items-center justify-center">
            <div class="w-full max-w-xs">
              @if (book()!.cover) {
                <img
                  [src]="book()!.cover"
                  [alt]="book()!.title"
                  class="w-full h-auto object-contain rounded-lg shadow-md"
                />
              } @else {
                <div
                  class="w-full aspect-[3/4] bg-gray-200 rounded-lg flex items-center justify-center"
                >
                  <span class="text-gray-500 text-sm font-medium">No cover available</span>
                </div>
              }
            </div>
          </div>

          <div class="md:w-2/3 p-8">
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ book()!.title }}</h1>
                @if (book()!.subtitle) {
                  <p class="text-xl text-gray-600">{{ book()!.subtitle }}</p>
                }
              </div>
              <button
                [routerLink]="['/books', book()!.isbn, 'edit']"
                class="ml-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition duration-200"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Edit
              </button>
            </div>

            <div class="space-y-4 mb-6">
              <div class="border-b border-gray-200 pb-4">
                <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Author</h3>
                <p class="text-lg text-blue-700 font-medium">{{ book()!.author }}</p>
              </div>

              <div class="border-b border-gray-200 pb-4">
                <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Publisher</h3>
                <p class="text-lg text-gray-800">{{ book()!.publisher }}</p>
              </div>

              <div class="grid grid-cols-2 gap-4 border-b border-gray-200 pb-4">
                <div>
                  <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">ISBN</h3>
                  <p class="text-lg text-gray-800 font-mono">{{ book()!.isbn }}</p>
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Pages</h3>
                  <p class="text-lg text-gray-800">{{ book()!.numPages }}</p>
                </div>
              </div>

              <div class="border-b border-gray-200 pb-4">
                <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Price</h3>
                <p class="text-2xl font-bold text-green-600">{{ book()!.price }}</p>
              </div>

              <div class="border-b border-gray-200 pb-4">
                <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Book ID</h3>
                <p class="text-sm text-gray-600 font-mono">{{ book()!.id }}</p>
              </div>

              @if (book()!.userId) {
                <div class="border-b border-gray-200 pb-4">
                  <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">User ID</h3>
                  <p class="text-sm text-gray-600">{{ book()!.userId }}</p>
                </div>
              }
            </div>
          </div>
        </div>

        <div class="p-8 bg-gray-50 border-t border-gray-200">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Abstract</h2>
          <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ book()!.abstract }}</p>
        </div>
        </div>
      }
    </div>
  `
})
export class BookDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bookApiClient = inject(BookApiClient);

  book = signal<Book | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const isbn = this.route.snapshot.paramMap.get('isbn');
    if (isbn) {
      this.loadBook(isbn);
    } else {
      this.error.set('ISBN parameter is missing');
      this.loading.set(false);
    }
  }

  private loadBook(isbn: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.bookApiClient.getBookByIsbn(isbn).subscribe({
      next: book => {
        this.book.set(book);
        this.loading.set(false);
      },
      error: error => {
        console.error('Error fetching book:', error);
        this.error.set(error.status === 404 ? 'Book not found' : 'Failed to load book details');
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}

