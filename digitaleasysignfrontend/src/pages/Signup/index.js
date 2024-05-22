import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LabelAndInput from "../../components/Common/LabelAndInput";
import { signupFunction } from "../../functions/authFunction";

const Signup = () => {
    const [inputValue, setInputValue] = useState({
        name: "",
        email: "",
        password: "",
    });
    const { name, email, password } = inputValue;
    const navigate = useNavigate();
    const onChangeHandller = (e) => {
        const { name, value } = e.target;
        setInputValue({ ...inputValue, [name]: value });
    };

    const onSubmitHandller = async () => {
        const response = await signupFunction(name, email, password);
        if (response.status === 200) {
            navigate("/login");
        }
    };

    return (
        <div className="wrapper signUp">
            <div className="illustration">
                <img
                    src="https://source.unsplash.com/random"
                    alt="illustration"
                />
            </div>
            <div className="form">
                <div className="heading">CREATE AN ACCOUNT</div>
                <div>
                    <LabelAndInput
                        id={"name"}
                        labelName={"Name"}
                        name={"name"}
                        value={name}
                        placeholder={"Enter your name"}
                        onChange={onChangeHandller}
                    />
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
                    <button onClick={onSubmitHandller}>Signup</button>
                    <h2 align="center" class="or">
                        OR
                    </h2>
                </div>
                <p>
                    Have an account ? <Link to="/login"> Login </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
