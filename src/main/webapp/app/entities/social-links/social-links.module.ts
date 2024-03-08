import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SocialLinksComponent } from './list/social-links.component';
import { SocialLinksDetailComponent } from './detail/social-links-detail.component';
import { SocialLinksUpdateComponent } from './update/social-links-update.component';
import { SocialLinksDeleteDialogComponent } from './delete/social-links-delete-dialog.component';
import { SocialLinksRoutingModule } from './route/social-links-routing.module';

@NgModule({
  imports: [SharedModule, SocialLinksRoutingModule],
  declarations: [SocialLinksComponent, SocialLinksDetailComponent, SocialLinksUpdateComponent, SocialLinksDeleteDialogComponent],
  entryComponents: [SocialLinksDeleteDialogComponent],
})
export class SocialLinksModule {}
