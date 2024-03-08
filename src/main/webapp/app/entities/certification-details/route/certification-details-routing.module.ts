import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CertificationDetailsComponent } from '../list/certification-details.component';
import { CertificationDetailsDetailComponent } from '../detail/certification-details-detail.component';
import { CertificationDetailsUpdateComponent } from '../update/certification-details-update.component';
import { CertificationDetailsRoutingResolveService } from './certification-details-routing-resolve.service';

const certificationDetailsRoute: Routes = [
  {
    path: '',
    component: CertificationDetailsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CertificationDetailsDetailComponent,
    resolve: {
      certificationDetails: CertificationDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CertificationDetailsUpdateComponent,
    resolve: {
      certificationDetails: CertificationDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CertificationDetailsUpdateComponent,
    resolve: {
      certificationDetails: CertificationDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(certificationDetailsRoute)],
  exports: [RouterModule],
})
export class CertificationDetailsRoutingModule {}
