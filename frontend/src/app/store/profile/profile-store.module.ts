import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { ProfileEffects } from './effects';
import { StoreModule } from '@ngrx/store';
import { profileReducer } from './reducer';

@NgModule({
    declarations: [],
    imports: [CommonModule, StoreModule.forFeature('profile', profileReducer), EffectsModule.forFeature([ProfileEffects])],
    providers: [ProfileEffects],
})
export class ProfileStoreModule {}
