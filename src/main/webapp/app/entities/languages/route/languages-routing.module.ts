import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LanguagesComponent } from '../list/languages.component';
import { LanguagesDetailComponent } from '../detail/languages-detail.component';
import { LanguagesUpdateComponent } from '../update/languages-update.component';
import { LanguagesRoutingResolveService } from './languages-routing-resolve.service';

const languagesRoute: Routes = [
  {
    path: '',
    component: LanguagesComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LanguagesDetailComponent,
    resolve: {
      languages: LanguagesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LanguagesUpdateComponent,
    resolve: {
      languages: LanguagesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LanguagesUpdateComponent,
    resolve: {
      languages: LanguagesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(languagesRoute)],
  exports: [RouterModule],
})
export class LanguagesRoutingModule {}
