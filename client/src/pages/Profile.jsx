import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, list, ref, uploadBytesResumable } from "firebase/storage";
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
import { Link } from "react-router-dom";

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
    const [showListingError, setShowListingError] = useState(false);
    const [userListing, setUserListing] = useState([]);

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

    const handleShowListing = async () => {
        try {
            setShowListingError(false);
            const response = await fetch(`${backendURL}/user/listing/${currentUser._id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                setUserListing(data);
            } else {
                setShowListingError(true);
            }
        } catch (error) {
            setShowListingError(true);
            console.log(error.message);
        }
    };

    const handleDeleteListing = async (id) => {
        try {
            const response = await fetch(`${backendURL}/listing/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                handleShowListing();
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
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
                <Link
                    to="/create-listing"
                    className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
                >
                    Create Listing
                </Link>
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
            <button className="text-green-500 w-full" onClick={handleShowListing}>
                Show Listing
            </button>
            <p className="text-red-500 mt-5"> {showListingError ? "Error while showing the listing" : ""} </p>
            {userListing && userListing.length > 0 && (
                <div className="flex flex-col gap-4">
                    <h1 className="font-semibold text-2xl text-center mt-6">Your Listing</h1>
                    {userListing.map((listing) => (
                        <div
                            key={listing._id}
                            className="flex border rounded-lg p-3 justify-between items-center mt-2 gap-4"
                        >
                            <Link to={`/listing/${listing._id}`}>
                                <img className="h-16 w-20 object-contain" src={listing.imageURLs} alt={listing.name} />
                            </Link>
                            <Link
                                to={`/listing/${listing._id}`}
                                className="font-semibold text-slate-700 hover:underline truncate flex-1"
                            >
                                <p>{listing.name}</p>
                            </Link>
                            <div className="flex flex-col items-center">
                                <button className="text-red-600" onClick={() => handleDeleteListing(listing._id)}>
                                    Delete
                                </button>
                                <Link to={`/update-listing/${listing._id}`}>
                                    <button className="text-green-600">
                                        Edit
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Profile;
