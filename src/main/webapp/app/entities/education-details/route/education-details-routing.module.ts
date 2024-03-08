import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EducationDetailsComponent } from '../list/education-details.component';
import { EducationDetailsDetailComponent } from '../detail/education-details-detail.component';
import { EducationDetailsUpdateComponent } from '../update/education-details-update.component';
import { EducationDetailsRoutingResolveService } from './education-details-routing-resolve.service';

const educationDetailsRoute: Routes = [
  {
    path: '',
    component: EducationDetailsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EducationDetailsDetailComponent,
    resolve: {
      educationDetails: EducationDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EducationDetailsUpdateComponent,
    resolve: {
      educationDetails: EducationDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EducationDetailsUpdateComponent,
    resolve: {
      educationDetails: EducationDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(educationDetailsRoute)],
  exports: [RouterModule],
})
export class EducationDetailsRoutingModule {}
