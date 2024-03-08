import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EducationDetailsComponent } from './list/education-details.component';
import { EducationDetailsDetailComponent } from './detail/education-details-detail.component';
import { EducationDetailsUpdateComponent } from './update/education-details-update.component';
import { EducationDetailsDeleteDialogComponent } from './delete/education-details-delete-dialog.component';
import { EducationDetailsRoutingModule } from './route/education-details-routing.module';

@NgModule({
  imports: [SharedModule, EducationDetailsRoutingModule],
  declarations: [
    EducationDetailsComponent,
    EducationDetailsDetailComponent,
    EducationDetailsUpdateComponent,
    EducationDetailsDeleteDialogComponent,
  ],
  entryComponents: [EducationDetailsDeleteDialogComponent],
})
export class EducationDetailsModule {}
