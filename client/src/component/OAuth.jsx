import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { backendURL } from "../constant";
import { useDispatch } from "react-redux";
import { signinSuccess } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            const response = await fetch(`${backendURL}/api/v1/auth/google`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                dispatch(signinSuccess(data));
                navigate("/");
            }
        } catch (error) {
            console.log(`Could not sign in with google ${error}`);
        }
    };

    return (
        <button
            onClick={handleGoogleClick}
            type="button"
            className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
        >
            Continue with Google
        </button>
    );
};

export default OAuth;
