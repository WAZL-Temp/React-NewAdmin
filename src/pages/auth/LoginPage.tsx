import React, { useState } from "react";
import { useAuthStore } from "../../store/auth.store";
import { loginByEmail, loginUser, ValidateEmail } from "./login";
import { signInWithGoogle } from "./firebase";
import img1 from '../../assets/images/logo.png'
import { Button, GoogleButton, Image, InputText } from "../../sharedBase/globalImports";
import { useNavigate } from "../../sharedBase/globalUtils";
import { FirebaseUser } from "../../types/auth";

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { login, userInfo } = useAuthStore();
    const selectedValue = false;

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
                userInfo(userInfoData);
                setEmail("");
                setPassword("");
                navigate('/appUsers');
            } else {
                setErrorMessage("Login failed. Please check your credentials.");
            }
        } catch {
            setErrorMessage("Invalid Credentials");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setErrorMessage("");
        setLoading(true);

        try {
            const user = await signInWithGoogle() as unknown as FirebaseUser;

            if (!user || !user.email) throw new Error("Google Sign-In data is incomplete.");

            const idToken = user.stsTokenManager?.accessToken;

            if (selectedValue) {
                await validateRegisterEmail(user.email, idToken);
            } else {
                await validateByEmail(user.email, idToken);
            }
        } catch (error: unknown) {
            console.error("Google Sign-In error:", error);
            if (error instanceof Error) {
                setErrorMessage(`Failed to sign in with Google. ${error.message}`);
            } else {
                setErrorMessage("Failed to sign in with Google. An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };


    const loginEmail = async (email: string, emailToken: string) => {
        try {
            const response = await loginByEmail(email, emailToken);
            if (response) {
                login(response?.token);
                const userInfoData = response?.userInfo[0];
                userInfo(userInfoData);
                navigate('/appUsers');
            } else {
                console.error('Login failed: Token not found');
            }
        } catch (error) {
            console.error("Error during email login:", error);
            setErrorMessage("Failed to login with email. Please try again.");
        }
    };

    const validateRegisterEmail = async (email: string, emailToken: string) => {
        try {
            const data = await ValidateEmail(email, emailToken);

            if (data === "success:Register-Admin") {
                navigate('/appUsers');
            } else if (data === "success:Not Register") {
                setEmail(email);
                setErrorMessage("User is not registered. Please sign up.");
            }
        } catch (error) {
            console.error("Error validating register email:", error);
            setErrorMessage("Failed to validate email for registration. Please try again.");
        }
    };

    const validateByEmail = async (email: string, emailToken: string) => {
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter Your Username / Email"
                                className="w-full h-10 p-2 mt-1 text-sm rounded-md  bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                        </div>

                        <div className="py-1">
                            <label htmlFor="password" className="text-[#374151] text-[16px] font-semibold">Password</label>
                            <InputText
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter Your Password"
                                className="w-full h-10 p-2 mt-1 text-sm rounded-md bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex justify-center text-center w-full bg-[var(--color-primary)] text-white h-10 rounded-md hover:bg-[var(--color-primary)]">
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                        {errorMessage && (
                            <div className="text-red-500 font-semibold text-left mt-2">
                                {errorMessage}
                            </div>
                        )}
                    </form>
                    <GoogleButton
                        className=" hover:border-[var(--color-primary)]"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        style={{ width: '100%', backgroundColor: "var(--color-primary)" }}
                    />

                    <div className=" text-center mt-4 font-medium text-[16px] text-[#4B5563]">© 2024 DIW. All rights reserved.</div>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;

