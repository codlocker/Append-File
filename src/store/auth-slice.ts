import { createSlice } from "@reduxjs/toolkit";
import { AuthParams } from "../types/authInput";

const initiaState: AuthParams = {
    isLoginModal: false,
    accessToken: '',
    email: ''
};

const authSlice = createSlice({
    name: 'auth',
    initialState: initiaState,
    reducers: {
        openModal: (state) => {
            state.isLoginModal = true;
        },
        closeModal: (state) => {
            state.isLoginModal = false;
        },
        setAccessToken: (state, payload) => {
            state.accessToken = payload.payload?.accessToken
            state.email = payload.payload?.email
        },
        clearStates: () => initiaState
    }
});

export const { openModal, closeModal, setAccessToken, clearStates } = authSlice.actions;

export default authSlice;