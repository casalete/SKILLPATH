import { RouterReducerState } from '@ngrx/router-store';
import { AuthState } from './authentication';

export interface State {
    router?: RouterReducerState;
    auth: AuthState;
}
