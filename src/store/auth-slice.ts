import { createSlice } from "@reduxjs/toolkit";
import { AuthParams } from "../types/authInput";

const initiaState: AuthParams = {
    isLoginModal: false
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
        }
    }
});

export const {openModal, closeModal } = authSlice.actions;

export default authSlice;