import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { EditCompanyComponent } from './components/edit-company/edit-company.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'edit-company', component: EditCompanyComponent },
  { path: '**', component: NotFoundComponent }, // not-found
];
