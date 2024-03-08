import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PersonalDetailsComponent } from './list/personal-details.component';
import { PersonalDetailsDetailComponent } from './detail/personal-details-detail.component';
import { PersonalDetailsUpdateComponent } from './update/personal-details-update.component';
import { PersonalDetailsDeleteDialogComponent } from './delete/personal-details-delete-dialog.component';
import { PersonalDetailsRoutingModule } from './route/personal-details-routing.module';

@NgModule({
  imports: [SharedModule, PersonalDetailsRoutingModule],
  declarations: [
    PersonalDetailsComponent,
    PersonalDetailsDetailComponent,
    PersonalDetailsUpdateComponent,
    PersonalDetailsDeleteDialogComponent,
  ],
  entryComponents: [PersonalDetailsDeleteDialogComponent],
})
export class PersonalDetailsModule {}
