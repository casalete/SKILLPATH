import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PostEffects } from './effects';
import { profileReducer } from '../profile/reducer';

@NgModule({
    declarations: [],
    imports: [CommonModule, StoreModule.forFeature('post', profileReducer), EffectsModule.forFeature([PostEffects])],
    providers: [PostEffects],
})
export class PostStoreModule {}
