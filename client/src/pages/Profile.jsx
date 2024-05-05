import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import {
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    signOutFailure,
    signOutStart,
    signOutSuccess,
    updateUserFailure,
    updateUserStart,
    updateUserSuccess,
} from "../redux/userSlice";
import { backendURL } from "../constant";

const Profile = () => {
    const { currentUser } = useSelector((Store) => Store.user);
    const fileRef = useRef();
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    const dispatch = useDispatch();
    const { loading, error } = useSelector((store) => store.user);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    useEffect(() => {
        if (file) handleFileUpload(file);
    }, [file]);

    const handleFileUpload = async (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePerc(Math.round(progress));
            },
            (error) => {
                setFileUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFileUploadError(false);
                    setFormData({ ...formData, avatar: downloadURL });
                });
            }
        );
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            dispatch(updateUserStart());

            const response = await fetch(`${backendURL}/user/update/${currentUser._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                dispatch(updateUserFailure(data.message));
                return;
            }

            if (response.ok) {
                dispatch(updateUserSuccess(data));
                setUpdateSuccess(true);
            }
        } catch (error) {
            dispatch(updateUserFailure(error.message));
        }
    };

    const handleDelete = async () => {
        try {
            dispatch(deleteUserStart());

            const response = await fetch(`${backendURL}/user/delete/${currentUser._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                dispatch(deleteUserSuccess(data));
            } else {
                dispatch(deleteUserFailure(data.message));
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    const handleSignOut = async () => {
        try {
            dispatch(signOutStart());

            const response = await fetch(`${backendURL}/user/signout`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();
            
            if (response.ok) {
                dispatch(signOutSuccess(data));
            } else {
                dispatch(signOutFailure(data));
            }
        } catch (error) {
            dispatch(signOutFailure(error.message));
        }
    };

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" />
                <img
                    onClick={() => fileRef.current.click()}
                    src={formData.avatar || currentUser.avatar}
                    alt={currentUser.username}
                    className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
                />
                <p className="text-sm self-center">
                    {fileUploadError ? (
                        <span className="text-red-500"> Error Image upload (Image must be less than 2MB)</span>
                    ) : filePerc > 0 && filePerc < 100 ? (
                        <span className="text-slate-700"> {`Uploading ${filePerc}%`} </span>
                    ) : filePerc === 100 ? (
                        <span className="text-green-500">Image successfully Uploaded!</span>
                    ) : (
                        ""
                    )}
                </p>
                <input
                    type="text"
                    placeholder="Username"
                    id="username"
                    className="border p-3 rounded-lg"
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                />
                <input
                    type="email"
                    placeholder="Email"
                    id="email"
                    className="border p-3 rounded-lg"
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    placeholder="Password"
                    id="password"
                    className="border p-3 rounded-lg"
                    onChange={handleChange}
                />
                <button
                    disabled={loading}
                    className="bg-slate-500 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
                >
                    {loading ? "Loading..." : "Update"}
                </button>
            </form>
            <div className="flex justify-between mt-5">
                <span onClick={handleDelete} className="text-red-500 cursor-pointer">
                    Delete Account
                </span>
                <span onClick={handleSignOut} className="text-red-500 cursor-pointer">
                    Sign Out
                </span>
            </div>
            <p className="text-red-500 mt-5">{error ? error : ""}</p>
            <p className="text-green-500 mt-5">{updateSuccess ? "User updated Successfully" : ""}</p>
        </div>
    );
};

export default Profile;
