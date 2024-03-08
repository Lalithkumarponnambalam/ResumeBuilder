import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SocialLinksComponent } from '../list/social-links.component';
import { SocialLinksDetailComponent } from '../detail/social-links-detail.component';
import { SocialLinksUpdateComponent } from '../update/social-links-update.component';
import { SocialLinksRoutingResolveService } from './social-links-routing-resolve.service';

const socialLinksRoute: Routes = [
  {
    path: '',
    component: SocialLinksComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SocialLinksDetailComponent,
    resolve: {
      socialLinks: SocialLinksRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SocialLinksUpdateComponent,
    resolve: {
      socialLinks: SocialLinksRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SocialLinksUpdateComponent,
    resolve: {
      socialLinks: SocialLinksRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(socialLinksRoute)],
  exports: [RouterModule],
})
export class SocialLinksRoutingModule {}
