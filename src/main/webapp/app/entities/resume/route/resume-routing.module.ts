import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ResumeComponent } from '../list/resume.component';
import { ResumeDetailComponent } from '../detail/resume-detail.component';
import { ResumeUpdateComponent } from '../update/resume-update.component';
import { ResumeRoutingResolveService } from './resume-routing-resolve.service';

const resumeRoute: Routes = [
  {
    path: '',
    component: ResumeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ResumeDetailComponent,
    resolve: {
      resume: ResumeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ResumeUpdateComponent,
    resolve: {
      resume: ResumeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ResumeUpdateComponent,
    resolve: {
      resume: ResumeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(resumeRoute)],
  exports: [RouterModule],
})
export class ResumeRoutingModule {}
