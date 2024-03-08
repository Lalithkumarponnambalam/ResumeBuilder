import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ExperienceDetailsComponent } from './list/experience-details.component';
import { ExperienceDetailsDetailComponent } from './detail/experience-details-detail.component';
import { ExperienceDetailsUpdateComponent } from './update/experience-details-update.component';
import { ExperienceDetailsDeleteDialogComponent } from './delete/experience-details-delete-dialog.component';
import { ExperienceDetailsRoutingModule } from './route/experience-details-routing.module';

@NgModule({
  imports: [SharedModule, ExperienceDetailsRoutingModule],
  declarations: [
    ExperienceDetailsComponent,
    ExperienceDetailsDetailComponent,
    ExperienceDetailsUpdateComponent,
    ExperienceDetailsDeleteDialogComponent,
  ],
  entryComponents: [ExperienceDetailsDeleteDialogComponent],
})
export class ExperienceDetailsModule {}
