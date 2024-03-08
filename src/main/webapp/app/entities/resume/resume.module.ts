import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ResumeComponent } from './list/resume.component';
import { ResumeDetailComponent } from './detail/resume-detail.component';
import { ResumeUpdateComponent } from './update/resume-update.component';
import { ResumeDeleteDialogComponent } from './delete/resume-delete-dialog.component';
import { ResumeRoutingModule } from './route/resume-routing.module';

@NgModule({
  imports: [SharedModule, ResumeRoutingModule],
  declarations: [ResumeComponent, ResumeDetailComponent, ResumeUpdateComponent, ResumeDeleteDialogComponent],
  entryComponents: [ResumeDeleteDialogComponent],
})
export class ResumeModule {}
