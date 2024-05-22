import axios from "axios";
import { env } from "../utilities/function";
import { setCookie } from "../utilities/cookies";

/**This is function for create user */
export const signupFunction = async (name, email, password) => {
    try {
        const responseSignup = await axios.post(
            env("BACKEND_SERVER") + "/auth/signup",
            {
                name,
                email,
                password,
            },
            {}
        );
        if (responseSignup.data.status === 200) {
            return {
                status: 200,
                message: "Signup successfully!",
            };
        } else {
            return { status: 500, message: "Signup failed!" };
        }
    } catch (error) {
        return { status: 500, message: "Internal server error!" };
    }
};
export const loginFunction = async (email, password) => {
    try {
        const response = await axios.post(
            env("BACKEND_SERVER") + "/auth/login",
            {
                email,
                password,
            },
            {}
        );
        if (response.data.status === 200) {
            const loginData = response.data.data;
            return {
                status: 200,
                message: "login successfully!",
                data: response.data.data,
            };
            setCookie("userId", loginData.userId);
            setCookie("fullName", loginData.name);
        } else {
            return { status: 500, message: "Signup failed!" };
        }
    } catch (error) {
        return { status: 500, message: "Internal server error!" };
    }
};
