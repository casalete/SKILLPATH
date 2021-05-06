import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ButtonsModule, MDBBootstrapModulesPro, NavbarModule, WavesModule } from 'ng-uikit-pro-standard';

import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { TopicComponent } from './components/topic/topic.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PostComponent } from './components/post/post.component';
import { EllipsisModule } from 'ngx-ellipsis';
import { AddPostComponent } from './components/add-post/add-post.component';

@NgModule({
    declarations: [HomeComponent, TopicComponent, ProfileComponent, PostComponent, AddPostComponent],
    imports: [CommonModule, HomeRoutingModule, MDBBootstrapModulesPro.forRoot(), SharedModule, EllipsisModule],

    schemas: [],
})
export class HomeModule {}
