import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CertificationDetailsComponent } from './list/certification-details.component';
import { CertificationDetailsDetailComponent } from './detail/certification-details-detail.component';
import { CertificationDetailsUpdateComponent } from './update/certification-details-update.component';
import { CertificationDetailsDeleteDialogComponent } from './delete/certification-details-delete-dialog.component';
import { CertificationDetailsRoutingModule } from './route/certification-details-routing.module';

@NgModule({
  imports: [SharedModule, CertificationDetailsRoutingModule],
  declarations: [
    CertificationDetailsComponent,
    CertificationDetailsDetailComponent,
    CertificationDetailsUpdateComponent,
    CertificationDetailsDeleteDialogComponent,
  ],
  entryComponents: [CertificationDetailsDeleteDialogComponent],
})
export class CertificationDetailsModule {}
