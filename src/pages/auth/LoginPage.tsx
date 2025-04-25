import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { loginByEmail, loginUser, ValidateEmail } from "./login";
import { signInWithGoogle } from "./firebase";
import {  appUserRoleDetailStore } from "../admin/appuser/appuserRoleDetail.store";
import { enumDetailStore } from "../../store/enumDetailsStore";
import img1 from '../../assets/images/logo.png'
import { Button, GoogleButton, Image, InputText, useNavigate } from "../../sharedBase/globalImports";

const LoginPage = () => {
    let navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const login = useAuthStore((state) => state.login);
    const userInfo = useAuthStore((state) => state.userInfo);
    const selectedValue = false;
    // const { loadList } = enumDetailStore();
    // const { fetchRoleData } = appUserRoleDetailStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setErrorMessage("Email and password are required.");
            return;
        }

        setErrorMessage("");
        setLoading(true);

        const payload = {
            "emailId": email,
            "pin": password
        }

        try {
            const response = await loginUser(payload);
            if (response) {
                const userInfoData = response?.userInfo[0];
                login(response.token);
                userInfo(JSON.stringify(userInfoData));
                setEmail("");
                setPassword("");
                // loadList();
                // fetchRoleData();
                navigate('/appuser');
            } else {
                setErrorMessage("Login failed. Please check your credentials.");
            }
        } catch (error: any) {
            setErrorMessage("Invalid Credentials");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setErrorMessage("");
        setLoading(true);

        try {
            const user = await signInWithGoogle();
            if (!user || !user.email) throw new Error("Google Sign-In data is incomplete.");

            const idToken = (user as any).stsTokenManager?.accessToken;

            if (selectedValue) {
                await validateRegisterEmail(user.email, idToken);
            } else {
                await validateByEmail(user.email, idToken);
            }
        } catch (error: any) {
            console.error("Google Sign-In error:", error);
            setErrorMessage(`Failed to sign in with Google. ${error.message}`);
        } finally {
            setLoading(false);
        }
    };


    const loginEmail = async (email: string, emailToken: string) => {
        try {
            const response = await loginByEmail(email, emailToken);
            if (response) {
                loadList();
                fetchRoleData();
                login(response?.token);
                const userInfoData = response?.userInfo[0];
                userInfo(JSON.stringify(userInfoData));
                navigate('/appuser');
            } else {
                console.error('Login failed: Token not found');
            }
        } catch (error) {
            console.error("Error during email login:", error);
            setErrorMessage("Failed to login with email. Please try again.");
        }
    };

    const validateRegisterEmail = async (email: any, emailToken: any) => {
        try {
            const data = await ValidateEmail(email, emailToken);

            if (data === "success:Register-Admin") {
                navigate('/appuser');
            } else if (data === "success:Not Register") {
                setEmail(email);
                setErrorMessage("User is not registered. Please sign up.");
            }
        } catch (error) {
            console.error("Error validating register email:", error);
            setErrorMessage("Failed to validate email for registration. Please try again.");
        }
    };

    const validateByEmail = async (email: any, emailToken: any) => {
        try {
            const data = await ValidateEmail(email, emailToken);

            if (data === "success:Register-Admin") {
                loginEmail(email, emailToken);
            } else if (data === "success:Not Register") {
                setEmail(email);
                setErrorMessage("User is not registered. Please sign up.");
            }
        } catch (error) {
            console.error("Error validating register email:", error);
            setErrorMessage("An error occurred. Please try again.");
        }
    };

    return (
        <section className="authSection flex items-center justify-center min-h-screen bg-cover bg-center">
            <div className="authCard bg-[#e2e8f0] bg-opacity-60 backdrop-blur-lg shadow-lg rounded-lg p-4 max-w-md w-full relative transform transition duration-500 font-custom">
                <div className="logo flex items-center justify-center my-2">
                    <Image src={img1} alt="DIW Logo" className="w-48 h-24" />
                </div>

                <h1 className="font-bold text-center text-gray-800 text-2xl">Admin Login</h1>

                <div className="py-2 space-y-5">
                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                        <div className="py-1">
                            <label htmlFor="email" className="text-[#374151] text-[16px] font-semibold">Email Address</label>
                            <InputText
                                id="email"
                                type="email"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter Your Username / Email"
                                className="w-full h-10 p-2 text-[#6B7280] mt-1 text-sm" />
                        </div>

                        <div className="py-1">
                            <label htmlFor="password" className="text-[#374151] text-[16px] font-semibold">Password</label>
                            <InputText
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter Your Password"
                                className="w-full h-10 p-2 text-[#6B7280] mt-1 text-sm"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex justify-center text-center w-full bg-[#059669] text-white h-10 rounded-md hover:bg-[#059669]">
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                        {errorMessage && (
                            <div className="text-red-500 font-semibold text-left mt-2">
                                {errorMessage}
                            </div>
                        )}
                    </form>
                    <GoogleButton
                        className=" hover:border-[#DF4A32]"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        style={{ width: '100%', backgroundColor: "#DF4A32" }}
                    />

                    <div className=" text-center mt-4 font-medium text-[16px] text-[#4B5563]">© 2024 DIW. All rights reserved.</div>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;

