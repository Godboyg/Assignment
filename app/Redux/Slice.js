import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    theme: false
}

const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        toggleAuthenticated : (state) => {
            state.isAuthenticated = true
        },
        toggleTheme : (state) => {
            state.theme = !state.theme
        }
    } 
})

export const { toggleAuthenticated , toggleTheme } = UserSlice.actions;

export default UserSlice.reducer;