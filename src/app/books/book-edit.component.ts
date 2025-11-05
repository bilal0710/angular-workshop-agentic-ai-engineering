import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Book } from './book';
import { BookApiClient } from './book-api-client.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-book-edit',
  imports: [ReactiveFormsModule, RouterModule],
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
        Back to Details
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
            Back to Details
          </button>
        </div>
      }

      @if (!loading() && !error() && bookForm) {
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-8">Edit Book</h1>

          <form [formGroup]="bookForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="title" class="block text-sm font-semibold text-gray-700 mb-2">
                Title <span class="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                formControlName="title"
                [class]="getInputClasses('title')"
              />
              @if (bookForm.get('title')?.invalid && bookForm.get('title')?.touched) {
                <p class="mt-1 text-sm text-red-600">Title is required</p>
              }
            </div>

            <div>
              <label for="subtitle" class="block text-sm font-semibold text-gray-700 mb-2">
                Subtitle
              </label>
              <input
                id="subtitle"
                type="text"
                formControlName="subtitle"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>

            <div>
              <label for="author" class="block text-sm font-semibold text-gray-700 mb-2">
                Author <span class="text-red-500">*</span>
              </label>
              <input
                id="author"
                type="text"
                formControlName="author"
                [class]="getInputClasses('author')"
              />
              @if (bookForm.get('author')?.invalid && bookForm.get('author')?.touched) {
                <p class="mt-1 text-sm text-red-600">Author is required</p>
              }
            </div>

            <div>
              <label for="publisher" class="block text-sm font-semibold text-gray-700 mb-2">
                Publisher <span class="text-red-500">*</span>
              </label>
              <input
                id="publisher"
                type="text"
                formControlName="publisher"
                [class]="getInputClasses('publisher')"
              />
              @if (bookForm.get('publisher')?.invalid && bookForm.get('publisher')?.touched) {
                <p class="mt-1 text-sm text-red-600">Publisher is required</p>
              }
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="isbn" class="block text-sm font-semibold text-gray-700 mb-2">
                  ISBN <span class="text-red-500">*</span>
                </label>
                <input
                  id="isbn"
                  type="text"
                  formControlName="isbn"
                  [class]="getInputClasses('isbn')"
                  readonly
                />
                <p class="mt-1 text-xs text-gray-500">ISBN cannot be changed</p>
              </div>

              <div>
                <label for="numPages" class="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Pages <span class="text-red-500">*</span>
                </label>
                <input
                  id="numPages"
                  type="number"
                  formControlName="numPages"
                  [class]="getInputClasses('numPages')"
                  min="1"
                />
                @if (bookForm.get('numPages')?.invalid && bookForm.get('numPages')?.touched) {
                  <p class="mt-1 text-sm text-red-600">Valid page number is required</p>
                }
              </div>
            </div>

            <div>
              <label for="price" class="block text-sm font-semibold text-gray-700 mb-2">
                Price <span class="text-red-500">*</span>
              </label>
              <input
                id="price"
                type="text"
                formControlName="price"
                [class]="getInputClasses('price')"
              />
              @if (bookForm.get('price')?.invalid && bookForm.get('price')?.touched) {
                <p class="mt-1 text-sm text-red-600">Price is required</p>
              }
            </div>

            <div>
              <label for="cover" class="block text-sm font-semibold text-gray-700 mb-2">
                Cover URL <span class="text-red-500">*</span>
              </label>
              <input
                id="cover"
                type="url"
                formControlName="cover"
                [class]="getInputClasses('cover')"
              />
              @if (bookForm.get('cover')?.invalid && bookForm.get('cover')?.touched) {
                <p class="mt-1 text-sm text-red-600">Valid cover URL is required</p>
              }
            </div>

            <div>
              <label for="abstract" class="block text-sm font-semibold text-gray-700 mb-2">
                Abstract <span class="text-red-500">*</span>
              </label>
              <textarea
                id="abstract"
                formControlName="abstract"
                rows="6"
                [class]="getInputClasses('abstract')"
              ></textarea>
              @if (bookForm.get('abstract')?.invalid && bookForm.get('abstract')?.touched) {
                <p class="mt-1 text-sm text-red-600">Abstract is required</p>
              }
            </div>

            <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                (click)="goBack()"
                class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition duration-200"
                [disabled]="saving()"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                [disabled]="bookForm.invalid || saving()"
              >
                @if (saving()) {
                  <span class="flex items-center">
                    <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                } @else {
                  Save Changes
                }
              </button>
            </div>
          </form>
        </div>
      }
    </div>
  `
})
export class BookEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bookApiClient = inject(BookApiClient);
  private readonly fb = inject(FormBuilder);

  loading = signal(true);
  error = signal<string | null>(null);
  saving = signal(false);
  bookForm!: FormGroup;
  private originalIsbn = '';

  ngOnInit(): void {
    const isbn = this.route.snapshot.paramMap.get('isbn');
    if (isbn) {
      this.originalIsbn = isbn;
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
        this.initializeForm(book);
        this.loading.set(false);
      },
      error: error => {
        console.error('Error fetching book:', error);
        this.error.set(error.status === 404 ? 'Book not found' : 'Failed to load book details');
        this.loading.set(false);
      }
    });
  }

  private initializeForm(book: Book): void {
    this.bookForm = this.fb.group({
      id: [book.id, Validators.required],
      isbn: [{ value: book.isbn, disabled: true }, Validators.required],
      title: [book.title, Validators.required],
      subtitle: [book.subtitle || ''],
      author: [book.author, Validators.required],
      publisher: [book.publisher, Validators.required],
      numPages: [book.numPages, [Validators.required, Validators.min(1)]],
      price: [book.price, Validators.required],
      cover: [book.cover, Validators.required],
      abstract: [book.abstract, Validators.required],
      userId: [book.userId, Validators.required]
    });
  }

  getInputClasses(fieldName: string): string {
    const field = this.bookForm.get(fieldName);
    const baseClasses = 'w-full px-4 py-2 border rounded-md transition duration-200';
    const validClasses = 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent';
    const invalidClasses = 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent';
    
    if (field?.invalid && field?.touched) {
      return `${baseClasses} ${invalidClasses}`;
    }
    return `${baseClasses} ${validClasses}`;
  }

  onSubmit(): void {
    if (this.bookForm.invalid || this.saving()) {
      return;
    }

    this.saving.set(true);
    const formValue = this.bookForm.getRawValue();
    
    this.bookApiClient.updateBook(this.originalIsbn, formValue).subscribe({
      next: updatedBook => {
        this.saving.set(false);
        this.router.navigate(['/books', updatedBook.isbn]);
      },
      error: error => {
        console.error('Error updating book:', error);
        this.error.set('Failed to update book. Please try again.');
        this.saving.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/books', this.originalIsbn]);
  }
}

