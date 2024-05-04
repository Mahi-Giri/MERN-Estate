import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { backendURL } from "../constant";
import { useDispatch, useSelector } from "react-redux";
import { signinFailure, signinStart, signinSuccess } from "../redux/userSlice";

const Signin = () => {
    const [formData, setFormData] = useState({});
    const {error, loading} = useSelector((store) => store.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            dispatch(signinStart());
            const response = await fetch(`${backendURL}/api/v1/auth/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.success === false) {
                dispatch(signinFailure(data.message));
                return;
            }

            if (response.ok) {
                dispatch(signinSuccess(data));
                navigate("/");
            }
        } catch (error) {
            dispatch(signinFailure(data.message));
        }
    };

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Email"
                    className="border p-3 rounded-lg"
                    id="email"
                    onChange={handleChange}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="border p-3 rounded-lg"
                    id="password"
                    onChange={handleChange}
                />
                <button
                    disabled={loading}
                    className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                >
                    {loading ? "Loading..." : "Sign In"}
                </button>
            </form>
            <div className="flex gap-2 mt-5">
                <p>You don&#39;t have an account?</p>
                <Link to="/signup">
                    <span className="text-blue-700">Sign up</span>
                </Link>
            </div>
            {error && <p className="text-red-500 mt-5">{error}</p>}
        </div>
    );
};

export default Signin;
