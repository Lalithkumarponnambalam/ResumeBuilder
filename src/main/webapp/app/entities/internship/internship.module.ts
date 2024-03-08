import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { InternshipComponent } from './list/internship.component';
import { InternshipDetailComponent } from './detail/internship-detail.component';
import { InternshipUpdateComponent } from './update/internship-update.component';
import { InternshipDeleteDialogComponent } from './delete/internship-delete-dialog.component';
import { InternshipRoutingModule } from './route/internship-routing.module';

@NgModule({
  imports: [SharedModule, InternshipRoutingModule],
  declarations: [InternshipComponent, InternshipDetailComponent, InternshipUpdateComponent, InternshipDeleteDialogComponent],
  entryComponents: [InternshipDeleteDialogComponent],
})
export class InternshipModule {}
