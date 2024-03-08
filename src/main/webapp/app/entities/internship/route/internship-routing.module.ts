import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { InternshipComponent } from '../list/internship.component';
import { InternshipDetailComponent } from '../detail/internship-detail.component';
import { InternshipUpdateComponent } from '../update/internship-update.component';
import { InternshipRoutingResolveService } from './internship-routing-resolve.service';

const internshipRoute: Routes = [
  {
    path: '',
    component: InternshipComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InternshipDetailComponent,
    resolve: {
      internship: InternshipRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InternshipUpdateComponent,
    resolve: {
      internship: InternshipRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InternshipUpdateComponent,
    resolve: {
      internship: InternshipRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(internshipRoute)],
  exports: [RouterModule],
})
export class InternshipRoutingModule {}
