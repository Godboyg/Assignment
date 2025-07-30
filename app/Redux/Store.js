import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./Slice"
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig ={
    key: "root",
    storage
}

const persistUserReducer = persistReducer(persistConfig , UserReducer);

const store = configureStore({
    reducer : {
        user : persistUserReducer
    }
})

const persistor = persistStore(store);

export default store;