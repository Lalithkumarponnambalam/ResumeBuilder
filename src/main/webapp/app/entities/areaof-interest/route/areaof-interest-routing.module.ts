import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AreaofInterestComponent } from '../list/areaof-interest.component';
import { AreaofInterestDetailComponent } from '../detail/areaof-interest-detail.component';
import { AreaofInterestUpdateComponent } from '../update/areaof-interest-update.component';
import { AreaofInterestRoutingResolveService } from './areaof-interest-routing-resolve.service';

const areaofInterestRoute: Routes = [
  {
    path: '',
    component: AreaofInterestComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AreaofInterestDetailComponent,
    resolve: {
      areaofInterest: AreaofInterestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AreaofInterestUpdateComponent,
    resolve: {
      areaofInterest: AreaofInterestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AreaofInterestUpdateComponent,
    resolve: {
      areaofInterest: AreaofInterestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(areaofInterestRoute)],
  exports: [RouterModule],
})
export class AreaofInterestRoutingModule {}
