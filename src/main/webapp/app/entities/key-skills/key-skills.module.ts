import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { KeySkillsComponent } from './list/key-skills.component';
import { KeySkillsDetailComponent } from './detail/key-skills-detail.component';
import { KeySkillsUpdateComponent } from './update/key-skills-update.component';
import { KeySkillsDeleteDialogComponent } from './delete/key-skills-delete-dialog.component';
import { KeySkillsRoutingModule } from './route/key-skills-routing.module';

@NgModule({
  imports: [SharedModule, KeySkillsRoutingModule],
  declarations: [KeySkillsComponent, KeySkillsDetailComponent, KeySkillsUpdateComponent, KeySkillsDeleteDialogComponent],
  entryComponents: [KeySkillsDeleteDialogComponent],
})
export class KeySkillsModule {}
