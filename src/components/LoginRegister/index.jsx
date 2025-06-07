import { useState } from "react";
import "./styles.css";
import {useForm} from "react-hook-form";
function LoginRegister({ onLoginSuccess }) {

    const [registerMode, setRegisterMode] = useState(false);
    const [error, setError] = useState("");
    const [registerError, setRegisterError] = useState("");

    const { register, handleSubmit, reset, watch, formState:{errors} } = useForm();
    const password = watch("password");

    const handleLogin = async (data) => {
        try {
            const response = await fetch("http://localhost:8081/api/user/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const user = await response.json();
                onLoginSuccess(user);
            } else {
                const errorText = await response.text();
                setError(errorText || "Login failed.");
            }
        } catch (err) {
            setError(err.toString());
        }
    };



    const handleRegister = async (data) => {
        delete data.confirm_password;
        try {
            const response = await fetch("http://localhost:8081/api/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            const result = await response.json();
            if (!response.ok) {
                setRegisterError(result.error || "Registration failed.");
                return;
            }
            console.log(result);
            reset();
            alert("Registration successful!")
        }
        catch (err) {
            console.log(err);
            setRegisterError("Network error.");
        }
    }

    return (
        <div>
            {registerMode ? (
                <div className="login-register-container">
                    <div className="login-box">
                        <h1>REGISTER</h1>
                        <form onSubmit={handleSubmit(handleRegister)}>
                            <div className="form-group">
                                <div className="form-field full-width">
                                    <label>Login name:</label>
                                    <input
                                        type="text"
                                        placeholder="Enter login name"
                                        {...register("login_name",{required: "Login name is required"})}
                                    />
                                    {errors.login_name && <p className="error">{errors.login_name.message}</p>}
                                </div>

                                <div className="form-field full-width">
                                    <label>Password:</label>
                                    <input
                                        type="password"
                                        placeholder="Enter password"
                                        {...register("password",{required: "Password is required"})}
                                    />
                                    {errors.password && <p className="error">{errors.password.message}</p>}
                                </div>

                                <div className="form-field full-width">
                                    <label>Confirm password:</label>
                                    <input
                                        type="password"
                                        placeholder="Enter confirm password"
                                        {...register("confirm_password",{required: "Password is required",
                                        validate: (value) =>
                                            value === password || "Confirm password doesn't match"
                                        })}
                                    />
                                    {errors.confirm_password && <p className="error">{errors.confirm_password.message}</p>}
                                </div>

                                <div className="register-fields">
                                    <div className="form-field">
                                        <label>First name:</label>
                                        <input
                                            type="text"
                                            placeholder="Enter first name"
                                            {...register("first_name",{required: "First name is required"})}
                                        />
                                        {errors.first_name && <p className="error">{errors.first_name.message}</p>}
                                    </div>

                                    <div className="form-field">
                                        <label>Last name:</label>
                                        <input
                                            type="text"
                                            placeholder="Enter last name"
                                            {...register("last_name",{required: "Last name is required"})}
                                        />
                                        {errors.last_name && <p className="error">{errors.last_name.message}</p>}
                                    </div>
                                </div>

                                <div className="form-field full-width">
                                    <label>Location:</label>
                                    <input
                                        type="text"
                                        placeholder="Enter location"
                                        {...register("location")}
                                    />
                                </div>

                                <div className="form-field full-width">
                                    <label>Occupation:</label>
                                    <input
                                        type="text"
                                        placeholder="Enter occupation"
                                        {...register("occupation")}
                                    />
                                </div>

                                <div className="form-field full-width">
                                    <label>Description:</label>
                                    <input
                                        type="text"
                                        placeholder="Enter description"
                                        {...register("description")}
                                    />
                                </div>
                            </div>

                            <div className="button-group">
                                <button type="submit">Register me</button>
                                <button type="button" onClick={() => setRegisterMode(false)}>
                                    Back to Login
                                </button>
                            </div>
                        </form>
                        {registerError && <div className="error">{registerError}</div>}
                    </div>
                </div>
            ) : (
                <div className="login-register-container">
                    <div className="login-box">
                        <h1>LOGIN</h1>
                        <form onSubmit={handleSubmit(handleLogin)}>
                            <div className="form-group">
                                <div className="form-field">
                                    <label>Login name:</label>
                                    <input
                                        type="text"
                                        placeholder="Enter login name"
                                        {...register("login_name",{required: "Login name is required"})}
                                    />
                                    {errors.login_name && <p className="error">{errors.login_name.message}</p>}
                                </div>

                                <div className="form-field">
                                    <label>Password:</label>
                                    <input
                                        type="password"
                                        placeholder="Enter password"
                                        {...register("password",{required: "Password is required"})}
                                    />
                                    {errors.password && <p className="error">{errors.password.message}</p>}
                                </div>
                            </div>

                            <div className="button-group">
                                <button type="submit">Login</button>
                                <button type="button" onClick={() => setRegisterMode(true)}>
                                    Register
                                </button>
                            </div>
                        </form>
                        {error && <div className="error">{error}</div>}
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginRegister;
