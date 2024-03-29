import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ModeratorsRoutingModule } from './moderators-routing.module';
import { PendingListComponent } from './pending-list/pending-list.component';
import { MenuComponent } from './menu/menu.component';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { ViewAdminListComponent } from './view-admin-list/view-admin-list.component';
import { ApprovedListComponent } from './approved-list/approved-list.component';
import { TagManagerComponent } from './tag-manager/tag-manager.component';
import { DeletedListComponent } from './deleted-list/deleted-list.component';


@NgModule({
  declarations: [PendingListComponent, MenuComponent, AddAdminComponent, ViewAdminListComponent, ApprovedListComponent, TagManagerComponent, DeletedListComponent],
  imports: [
    CommonModule,
    ModeratorsRoutingModule,
    SharedModule
  ]
})
export class ModeratorsModule { }
