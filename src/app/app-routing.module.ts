import { Routes, RouterModule } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { LoginComponent } from './login/login.component';
import { TokenComponent } from './pages/errors/token/token.component';
import { MenuErrorComponent } from './pages/errors/menu/menu-error.component';
import { GlobalParamsErrorComponent } from './pages/errors/globalParams/globalParamsError.component';
import { NotfoundComponent } from './pages/errors/not-found/not-found.component';
import { AuthGuard } from './_guards';
import { RegisterComponent } from './register/register.component';

export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    canLoad: [AuthGuard],
    children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      {
        path: 'home',
        loadChildren: () => import('./component/component.module').then(m => m.ComponentsModule)
      },


    ]
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  { path: 'globalParamsError', component: GlobalParamsErrorComponent },
  { path: 'menuError', component: MenuErrorComponent },
  { path: 'token', component: TokenComponent },
  { path: '**', component: NotfoundComponent }
];


export const routing = RouterModule.forRoot(Approutes, {useHash: true});


