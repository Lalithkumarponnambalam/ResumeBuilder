import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { KeySkillsComponent } from '../list/key-skills.component';
import { KeySkillsDetailComponent } from '../detail/key-skills-detail.component';
import { KeySkillsUpdateComponent } from '../update/key-skills-update.component';
import { KeySkillsRoutingResolveService } from './key-skills-routing-resolve.service';

const keySkillsRoute: Routes = [
  {
    path: '',
    component: KeySkillsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: KeySkillsDetailComponent,
    resolve: {
      keySkills: KeySkillsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: KeySkillsUpdateComponent,
    resolve: {
      keySkills: KeySkillsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: KeySkillsUpdateComponent,
    resolve: {
      keySkills: KeySkillsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(keySkillsRoute)],
  exports: [RouterModule],
})
export class KeySkillsRoutingModule {}
