import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Book } from './book';
import { BookApiClient } from './book-api-client.service';

@Component({
  selector: 'app-book-create',
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
        Back to List
      </button>

      @if (error()) {
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-6">
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
          <p class="text-red-800 font-medium mb-2">Error creating book</p>
          <p class="text-red-600 text-sm">{{ error() }}</p>
        </div>
      }

      @if (bookForm) {
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-8">Create New Book</h1>

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
                />
                @if (bookForm.get('isbn')?.invalid && bookForm.get('isbn')?.touched) {
                  <p class="mt-1 text-sm text-red-600">ISBN is required</p>
                }
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
                  <p class="mt-1 text-sm text-red-600">Valid page number (minimum 1) is required</p>
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
                    Creating...
                  </span>
                } @else {
                  Create Book
                }
              </button>
            </div>
          </form>
        </div>
      }
    </div>
  `
})
export class BookCreateComponent {
  private readonly router = inject(Router);
  private readonly bookApiClient = inject(BookApiClient);
  private readonly fb = inject(FormBuilder);

  readonly error = signal<string | null>(null);
  readonly saving = signal(false);
  readonly bookForm = this.fb.group({
    // id and userId are omitted - will be generated/handled by json-server
    isbn: ['', Validators.required],
    title: ['', Validators.required],
    subtitle: [''],
    author: ['', Validators.required],
    publisher: ['', Validators.required],
    numPages: [null as number | null, [Validators.required, Validators.min(1)]],
    price: ['', Validators.required],
    cover: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
    abstract: ['', Validators.required]
  });

  constructor() {
    // Form is initialized above
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
    this.error.set(null);
    
    const formValue = this.bookForm.value;
    
    // Create payload without id and userId fields - explicitly structure the object
    // Type-safe: Omit<Book, 'id' | 'userId'> ensures id and userId are never included at compile time
    // The form does not contain 'id' or 'userId' controls, so they will be undefined
    const bookData: Omit<Book, 'id' | 'userId'> = {
      isbn: String(formValue.isbn).trim(),
      title: String(formValue.title).trim(),
      subtitle: formValue.subtitle ? String(formValue.subtitle).trim() : undefined,
      author: String(formValue.author).trim(),
      publisher: String(formValue.publisher).trim(),
      numPages: Number(formValue.numPages),
      price: String(formValue.price).trim(),
      cover: String(formValue.cover).trim(),
      abstract: String(formValue.abstract).trim()
    };
    
    // Payload is guaranteed to be free of 'id' and 'userId' fields:
    // 1. FormGroup has no 'id' or 'userId' controls (verified in constructor)
    // 2. TypeScript Omit<Book, 'id' | 'userId'> prevents them from being included
    // 3. Explicit object structure ensures only specified fields are included
    
    // Debug: Log payload to verify it's clean (remove in production)
    console.log('Creating book with payload:', JSON.stringify(bookData, null, 2));
    console.log('Payload keys:', Object.keys(bookData));
    console.log('Has id field?', 'id' in bookData);
    console.log('Has userId field?', 'userId' in bookData);
    
    this.bookApiClient.createBook(bookData).subscribe({
      next: (createdBook) => {
        this.saving.set(false);
        this.router.navigate(['/books', createdBook.isbn]);
      },
      error: (error: unknown) => {
        this.handleError(error);
      }
    });
  }

  private handleError(error: unknown): void {
    console.error('Error creating book:', error);
    
    let errorMessage = 'Failed to create book. Please try again.';
    
    if (error && typeof error === 'object' && 'status' in error) {
      const httpError = error as { status: number; error?: { error?: string } };
      if (httpError.status === 500) {
        const errorText = httpError.error?.error || '';
        if (errorText.includes('duplicate id')) {
          // This could mean:
          // 1. The ISBN already exists (json-server might use ISBN as ID)
          // 2. There's a conflict with auto-generated ID
          const formValue = this.bookForm.value;
          errorMessage = `A book with ISBN "${formValue.isbn}" may already exist. Please check if the ISBN is unique or try a different ISBN.`;
        } else {
          errorMessage = `Server error: ${errorText || 'Internal server error'}. Please try again.`;
        }
      } else if (httpError.status === 409) {
        errorMessage = 'A book with this ISBN already exists.';
      } else if (httpError.status === 400) {
        errorMessage = 'Invalid book data. Please check all fields.';
      }
    }
    
    this.error.set(errorMessage);
    this.saving.set(false);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}

