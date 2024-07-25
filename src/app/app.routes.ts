import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/map',
    pathMatch: 'full',
  },
  {
    path: 'folder/map',
    loadComponent: () => import('./map/map.page').then(m => m.MapPage)
  },
  {
    path: 'folder/coordinate-list',
    loadComponent: () => import('./coordinate-list/coordinate-list.page').then(m => m.CoordinateListPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },

  {
    path: 'folder/logout',
    loadComponent: () => import('./logout/logout.page').then( m => m.LogoutPage)
  },
  {
    path: 'folder/test',
    loadComponent: () => import('./test/test.page').then(m => m.TestPage)
  },

  {
    path: 'folder/:id',
    loadComponent: () =>
      import('./folder/folder.page').then((m) => m.FolderPage),
  },

];
