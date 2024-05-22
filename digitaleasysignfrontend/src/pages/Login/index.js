import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LabelAndInput from "../../components/Common/LabelAndInput";
import { loginFunction } from "../../functions/authFunction";

const Login = () => {
    const [inputValue, setInputValue] = useState({ email: "", password: "" });
    const { email, password } = inputValue;
    const navigate = useNavigate();
    const onChangeHandller = (e) => {
        const { name, value } = e.target;
        setInputValue({ ...inputValue, [name]: value });
    };

    const onSubmitHandller = async () => {
        const response = await loginFunction(email, password);
        if (response.status === 200) {
            navigate("/");
        }
    };
    return (
        <div className="wrapper signIn">
            <div className="illustration">
                <img
                    src="https://source.unsplash.com/random"
                    alt="illustration"
                />
            </div>
            <div className="form">
                <div className="heading">LOGIN</div>
                <div>
                    <LabelAndInput
                        id={"email"}
                        labelName={"Email"}
                        name={"email"}
                        value={email}
                        placeholder={"Enter your email"}
                        onChange={onChangeHandller}
                    />
                    <LabelAndInput
                        id={"password"}
                        labelName={"Password"}
                        name={"password"}
                        value={password}
                        placeholder={"Enter your password"}
                        type="password"
                        onChange={onChangeHandller}
                    />

                    <button onClick={onSubmitHandller}>Login</button>
                </div>
                <p>
                    Don't have an account ? <Link to="/signup"> Sign Up </Link>
                </p>
            </div>
        </div>
    );
};
export default Login;
