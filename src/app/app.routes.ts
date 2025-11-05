import { Routes } from '@angular/router';
import { BookListComponent } from './books/book-list.component';
import { BookDetailsComponent } from './books/book-details.component';
import { BookEditComponent } from './books/book-edit.component';
import { BookCreateComponent } from './books/book-create.component';

export const routes: Routes = [
  { path: '', component: BookListComponent },
  { path: 'books/create', component: BookCreateComponent },
  { path: 'books/:isbn', component: BookDetailsComponent },
  { path: 'books/:isbn/edit', component: BookEditComponent },
  { path: '**', redirectTo: '' }
];
