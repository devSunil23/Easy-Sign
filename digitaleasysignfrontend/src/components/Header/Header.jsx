import React, { createContext, useCallback, useContext } from "react";
import Navbar from "../Navbar/Navbar";
import AuthorizationProvider from "../../hooks/Authorize";
import { CssBaseline } from "@mui/material";
import useSnack from "../../hooks/useSnack";
import ThemeContextProvider from "../../style/theme";
import { Outlet } from "react-router-dom";

const HeaderContext = createContext();

const Header = ({ children }) => {
    const { SnackBar, showMessage } = useSnack();

    return (
        <ThemeContextProvider>
            <CssBaseline />
            <HeaderContext.Provider value={{ showMessage }}>
                <AuthorizationProvider>
                    <Navbar>
                        <Outlet />
                    </Navbar>
                </AuthorizationProvider>
                {SnackBar}
            </HeaderContext.Provider>
        </ThemeContextProvider>
    );
};

const useMessage = () => {
    const showMessage = useContext(HeaderContext).showMessage;

    const showSuccess = useCallback(
        function showSuccess(msg) {
            showMessage({ success: msg });
        },
        [showMessage]
    );

    const showError = useCallback(
        function (msg) {
            showMessage({ error: msg });
        },
        [showMessage]
    );

    const showResponse = useCallback(
        function showResponse(msg, action) {
            showMessage({ response: msg, action });
        },
        [showMessage]
    );

    const showErrors = useCallback(
        function showErrors(errs) {
            errs?.forEach((err) => showError(err.message));
        },
        [showError]
    );

    return { showError, showSuccess, showResponse, showErrors };
};

// const useEventEmitter = () => {
//     const eventEmitter = useContext(HeaderContext).eventEmitter;
//     return eventEmitter;
// };

export default Header;

export { useMessage };
