import React, { createContext, useContext, useEffect, useState } from "react";
import Loading from "../components/Progress/Loading";
import { clearCookie, getCookie, setCookie } from "../utilities/cookies";
import { env, getFullURL } from "../utilities/function";
import axios from "axios";
import { useLocation } from "react-router-dom";

const authorizeContext = createContext();

const authServer = axios.create({
    baseURL: env("AUTHENTICATION_SERVER"),
});

const accessToken = getCookie("accessToken");
authServer.defaults.headers.Authorization = `Bearer ${accessToken}`;

const AuthorizationProvider = ({ children }) => {
    const [content, setContent] = useState(
        <Loading message="Please wait, logging you in..." />
    );
    const [user, setUser] = useState({});
    const location = useLocation();

    const authorize = async (loggedIn, cb) => {
        setContent(children);
        if (loggedIn) {
            setContent(children);
        } else {
            // const redirectTo = `${env(
            //   "AUTHENTICATION_CLIENT"
            // )}/login?redirectto=${encodeURIComponent(getFullURL(location))}`;
            // Check if the current route is "/otherSinger" or "/preview" and skip redirection
            if (
                window.location.pathname === "/otherSinger" ||
                window.location.pathname === "/preview"
            ) {
            } else {
                clearCookie("userId");
                // setContent(
                //   <Loading
                //     message="Please wait, redirecting you to Clikkle Accounts"
                //     redirectTo={redirectTo}
                //   />
                // );
            }
        }
        if (typeof cb === "function") cb(setUser);
    };

    useEffect(() => {
        (async () => {
            try {
                if (
                    window.location.pathname !== "/otherSinger" &&
                    window.location.pathname !== "/preview"
                ) {
                    const role = getCookie("role");
                    if (!role) throw new Error("role not found");
                    const response = await authServer.get(`/${role}/profile`);
                    const user = response.data.user;
                    setCookie("userId", user._id);
                    setCookie("fullName", user.fullName);
                    authorize(true, (setUser) => setUser(user));
                } else if (
                    window.location.pathname === "/otherSinger" ||
                    window.location.pathname === "/preview"
                ) {
                    setContent(children);
                }
            } catch (err) {
                authorize(false);
            }
        })();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <authorizeContext.Provider
            value={{ authorize, setUser, user, setContent }}>
            {content}
        </authorizeContext.Provider>
    );
};

const useAuthorize = () => useContext(authorizeContext).authorize;
const useUser = () => useContext(authorizeContext).user;
const useSetUser = () => useContext(authorizeContext).setUser;
const useSetContent = () => useContext(authorizeContext).setContent;

export default AuthorizationProvider;
export { useAuthorize, useUser, useSetUser, useSetContent };
