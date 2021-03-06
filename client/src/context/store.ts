import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit'
import ReduxLogger from 'redux-logger'
import AppReducer from './appSlice';

export const store = configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(ReduxLogger),
    reducer: {
        app: AppReducer
    }
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void > = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
    >;