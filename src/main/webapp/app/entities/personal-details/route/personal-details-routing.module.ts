import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PersonalDetailsComponent } from '../list/personal-details.component';
import { PersonalDetailsDetailComponent } from '../detail/personal-details-detail.component';
import { PersonalDetailsUpdateComponent } from '../update/personal-details-update.component';
import { PersonalDetailsRoutingResolveService } from './personal-details-routing-resolve.service';

const personalDetailsRoute: Routes = [
  {
    path: '',
    component: PersonalDetailsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PersonalDetailsDetailComponent,
    resolve: {
      personalDetails: PersonalDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PersonalDetailsUpdateComponent,
    resolve: {
      personalDetails: PersonalDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PersonalDetailsUpdateComponent,
    resolve: {
      personalDetails: PersonalDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(personalDetailsRoute)],
  exports: [RouterModule],
})
export class PersonalDetailsRoutingModule {}
