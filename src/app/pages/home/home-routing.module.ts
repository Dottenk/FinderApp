import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'article'
      },
      {
        path: 'start',
        loadChildren: () => import('./start/start.module').then(m => m.StartPageModule)
      },
      {
        path: 'article',
        loadChildren: () => import('./article/article.module').then(m => m.ArticlePageModule)
      },
      {
        path: 'list',
        loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
      }
    ]
  },
  {
    path: 'article',
    loadChildren: () => import('./article/article.module').then( m => m.ArticlePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'start',
    loadChildren: () => import('./start/start.module').then( m => m.StartPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
