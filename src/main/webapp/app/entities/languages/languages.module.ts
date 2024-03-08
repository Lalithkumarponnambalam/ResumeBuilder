import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LanguagesComponent } from './list/languages.component';
import { LanguagesDetailComponent } from './detail/languages-detail.component';
import { LanguagesUpdateComponent } from './update/languages-update.component';
import { LanguagesDeleteDialogComponent } from './delete/languages-delete-dialog.component';
import { LanguagesRoutingModule } from './route/languages-routing.module';

@NgModule({
  imports: [SharedModule, LanguagesRoutingModule],
  declarations: [LanguagesComponent, LanguagesDetailComponent, LanguagesUpdateComponent, LanguagesDeleteDialogComponent],
  entryComponents: [LanguagesDeleteDialogComponent],
})
export class LanguagesModule {}
