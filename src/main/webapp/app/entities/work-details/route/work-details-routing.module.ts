import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { WorkDetailsComponent } from '../list/work-details.component';
import { WorkDetailsDetailComponent } from '../detail/work-details-detail.component';
import { WorkDetailsUpdateComponent } from '../update/work-details-update.component';
import { WorkDetailsRoutingResolveService } from './work-details-routing-resolve.service';

const workDetailsRoute: Routes = [
  {
    path: '',
    component: WorkDetailsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WorkDetailsDetailComponent,
    resolve: {
      workDetails: WorkDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: WorkDetailsUpdateComponent,
    resolve: {
      workDetails: WorkDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WorkDetailsUpdateComponent,
    resolve: {
      workDetails: WorkDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(workDetailsRoute)],
  exports: [RouterModule],
})
export class WorkDetailsRoutingModule {}
