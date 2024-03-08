import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AreaofInterestComponent } from './list/areaof-interest.component';
import { AreaofInterestDetailComponent } from './detail/areaof-interest-detail.component';
import { AreaofInterestUpdateComponent } from './update/areaof-interest-update.component';
import { AreaofInterestDeleteDialogComponent } from './delete/areaof-interest-delete-dialog.component';
import { AreaofInterestRoutingModule } from './route/areaof-interest-routing.module';

@NgModule({
  imports: [SharedModule, AreaofInterestRoutingModule],
  declarations: [
    AreaofInterestComponent,
    AreaofInterestDetailComponent,
    AreaofInterestUpdateComponent,
    AreaofInterestDeleteDialogComponent,
  ],
  entryComponents: [AreaofInterestDeleteDialogComponent],
})
export class AreaofInterestModule {}
