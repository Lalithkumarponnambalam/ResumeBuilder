import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ExperienceDetailsComponent } from '../list/experience-details.component';
import { ExperienceDetailsDetailComponent } from '../detail/experience-details-detail.component';
import { ExperienceDetailsUpdateComponent } from '../update/experience-details-update.component';
import { ExperienceDetailsRoutingResolveService } from './experience-details-routing-resolve.service';

const experienceDetailsRoute: Routes = [
  {
    path: '',
    component: ExperienceDetailsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExperienceDetailsDetailComponent,
    resolve: {
      experienceDetails: ExperienceDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExperienceDetailsUpdateComponent,
    resolve: {
      experienceDetails: ExperienceDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExperienceDetailsUpdateComponent,
    resolve: {
      experienceDetails: ExperienceDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(experienceDetailsRoute)],
  exports: [RouterModule],
})
export class ExperienceDetailsRoutingModule {}
