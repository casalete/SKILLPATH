import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TopicComponent } from './components/topic/topic.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        data: { layout: { navbar: true } },
    },

    {
        path: ':id',
        component: TopicComponent,
        data: { layout: { navbar: true } },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomeRoutingModule {}
