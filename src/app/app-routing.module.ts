import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'loader',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    //canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule), //canActivate: [NoAuthGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/login/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'loader',
    loadChildren: () => import('./pages/presets/loader/loader.module').then(m => m.LoaderPageModule)

  },
  {
    path: 'article',
    loadChildren: () => import('./pages/home/article/article.module').then( m => m.ArticlePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./pages/home/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'start',
    loadChildren: () => import('./pages/home/start/start.module').then( m => m.StartPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
