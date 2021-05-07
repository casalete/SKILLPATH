import { DefaultDataServiceConfig } from '@ngrx/data';

export const defaultDataServiceConfig: DefaultDataServiceConfig = {
    root: 'api/v1',
    timeout: 3000, // request timeout
};
