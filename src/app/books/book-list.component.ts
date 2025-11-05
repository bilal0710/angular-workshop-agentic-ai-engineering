import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { Book } from './book';
import { BookApiClient } from './book-api-client.service';
import { BookItemComponent } from './book-item.component';

@Component({
  selector: 'app-book-list',
  imports: [BookItemComponent, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container mx-auto px-4 py-12 max-w-7xl">
      <div class="flex justify-between items-center mb-10">
        <h1 class="text-3xl font-bold text-blue-700 border-b pb-4 border-gray-200 flex-1">
          Book Collection
        </h1>
        <a
          routerLink="/books/create"
          class="ml-6 flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Create New Book
        </a>
      </div>

      <div class="mb-6">
        <div class="flex items-center border-b-2 border-gray-300 py-2">
          <input
            type="text"
            [value]="searchInputValue()"
            (input)="onSearchInput($event)"
            placeholder="Search for books..."
            class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          />
          @if (searchInputValue()) {
            <button
              (click)="clearSearch()"
              class="flex-shrink-0 text-gray-500 hover:text-gray-700"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          }
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center items-center py-20">
          <div class="animate-pulse flex flex-col items-center">
            <div
              class="h-16 w-16 rounded-full border-4 border-t-blue-700 border-r-blue-700 border-b-gray-200 border-l-gray-200 animate-spin"
            ></div>
            <p class="mt-4 text-gray-600">Loading books...</p>
          </div>
        </div>
      }

      @if (!loading()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          @for (book of books(); track book.id) {
            <app-book-item [book]="book"></app-book-item>
          }

          @if (books().length === 0) {
            <div
              class="col-span-full flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-16 w-16 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <p class="text-xl font-medium text-gray-600 mb-2">
                {{ searchInputValue() ? 'No books match your search' : 'No books available' }}
              </p>
              <p class="text-gray-500">
                {{ searchInputValue() ? 'Try different search terms or clear the search' : 'Check back later' }}
              </p>
              @if (searchInputValue()) {
                <button
                  (click)="clearSearch()"
                  class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                >
                  Clear Search
                </button>
              }
            </div>
          }
        </div>
      }

      @if (!loading() && totalPages() > 1) {
        <div class="mt-8 flex flex-col items-center gap-4">
          <div class="flex items-center gap-2">
            <button
              (click)="goToFirstPage()"
              [disabled]="!hasPreviousPage()"
              [class.opacity-50]="!hasPreviousPage()"
              [class.cursor-not-allowed]="!hasPreviousPage()"
              class="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:hover:bg-transparent"
            >
              First
            </button>
            <button
              (click)="goToPreviousPage()"
              [disabled]="!hasPreviousPage()"
              [class.opacity-50]="!hasPreviousPage()"
              [class.cursor-not-allowed]="!hasPreviousPage()"
              class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:hover:bg-transparent"
            >
              Previous
            </button>

            @for (pageNum of pageNumbers(); track pageNum) {
              @if (pageNum < 0) {
                <span class="px-2 py-2 text-gray-500">...</span>
              } @else {
                <button
                  (click)="goToPage(pageNum)"
                  [class.bg-blue-600]="pageNum === currentPage()"
                  [class.text-white]="pageNum === currentPage()"
                  [class.border-blue-600]="pageNum === currentPage()"
                  class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  {{ pageNum }}
                </button>
              }
            }

            <button
              (click)="goToNextPage()"
              [disabled]="!hasNextPage()"
              [class.opacity-50]="!hasNextPage()"
              [class.cursor-not-allowed]="!hasNextPage()"
              class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:hover:bg-transparent"
            >
              Next
            </button>
            <button
              (click)="goToLastPage()"
              [disabled]="!hasNextPage()"
              [class.opacity-50]="!hasNextPage()"
              [class.cursor-not-allowed]="!hasNextPage()"
              class="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:hover:bg-transparent"
            >
              Last
            </button>
          </div>

          <div class="text-sm text-gray-600">
            Page {{ currentPage() }} of {{ totalPages() }} ({{ totalItems() }} total items)
          </div>
        </div>
      }
    </div>
  `,
})
export class BookListComponent {
  readonly pageSize = input<number>(10);
  private readonly bookApiClient = inject(BookApiClient);
  private readonly destroyRef = inject(DestroyRef);

  // State signals
  readonly books = signal<Book[]>([]);
  readonly loading = signal<boolean>(true);
  readonly searchInputValue = signal<string>(''); // For immediate UI updates
  readonly searchTerm = signal<string>(''); // Debounced, triggers API call
  readonly currentPage = signal<number>(1);
  readonly totalItems = signal<number>(0);

  // Derived signals
  readonly totalPages = computed(() => {
    const total = this.totalItems();
    const size = this.pageSize();
    return total > 0 ? Math.ceil(total / size) : 0;
  });

  readonly hasNextPage = computed(() => this.currentPage() < this.totalPages());
  readonly hasPreviousPage = computed(() => this.currentPage() > 1);

  readonly pageNumbers = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: number[] = [];

    if (total <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end around current page
      let start = Math.max(2, current - 1);
      let end = Math.min(total - 1, current + 1);

      // Adjust if we're near the beginning
      if (current <= 3) {
        end = Math.min(4, total - 1);
      }

      // Adjust if we're near the end
      if (current >= total - 2) {
        start = Math.max(2, total - 3);
      }

      // Add ellipsis before middle section if needed
      if (start > 2) {
        pages.push(-1); // -1 represents ellipsis
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis after middle section if needed
      if (end < total - 1) {
        pages.push(-2); // -2 represents ellipsis
      }

      // Always show last page
      if (total > 1) {
        pages.push(total);
      }
    }

    return pages;
  });

  private searchTimeout: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    // Load books when page or search term changes
    effect(() => {
      const page = this.currentPage();
      const search = this.searchTerm();
      this.loadBooks(page, search);
    });
  }

  private loadBooks(page: number, search?: string): void {
    this.loading.set(true);
    const pageSizeValue = this.pageSize();
    this.bookApiClient.getBooks(page, pageSizeValue, search)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          this.books.set(response.books);
          this.totalItems.set(response.total);
          this.loading.set(false);
        },
        error: (error: unknown) => {
          console.error('Error fetching books:', error);
          this.loading.set(false);
        },
      });
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    
    // Update input value immediately for UI responsiveness
    this.searchInputValue.set(value);
    
    // Debounce search to avoid too many API calls while typing
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    this.searchTimeout = setTimeout(() => {
      // Update search term and reset to page 1 when search changes
      // This will trigger the effect to load books with the new search term
      this.searchTerm.set(value);
      this.currentPage.set(1);
    }, 300);
  }

  clearSearch(): void {
    this.searchInputValue.set('');
    this.searchTerm.set('');
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  goToNextPage(): void {
    if (this.hasNextPage()) {
      this.currentPage.update(page => page + 1);
    }
  }

  goToPreviousPage(): void {
    if (this.hasPreviousPage()) {
      this.currentPage.update(page => page - 1);
    }
  }

  goToFirstPage(): void {
    this.currentPage.set(1);
  }

  goToLastPage(): void {
    this.currentPage.set(this.totalPages());
  }
}