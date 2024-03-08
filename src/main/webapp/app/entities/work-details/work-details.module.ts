import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { WorkDetailsComponent } from './list/work-details.component';
import { WorkDetailsDetailComponent } from './detail/work-details-detail.component';
import { WorkDetailsUpdateComponent } from './update/work-details-update.component';
import { WorkDetailsDeleteDialogComponent } from './delete/work-details-delete-dialog.component';
import { WorkDetailsRoutingModule } from './route/work-details-routing.module';

@NgModule({
  imports: [SharedModule, WorkDetailsRoutingModule],
  declarations: [WorkDetailsComponent, WorkDetailsDetailComponent, WorkDetailsUpdateComponent, WorkDetailsDeleteDialogComponent],
  entryComponents: [WorkDetailsDeleteDialogComponent],
})
export class WorkDetailsModule {}
