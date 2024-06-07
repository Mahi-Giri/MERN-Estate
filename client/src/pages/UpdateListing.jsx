import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import { app } from "../firebase";
import { backendURL } from "../constant";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdateListing = () => {
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageURLs: [],
        name: "",
        description: "",
        address: "",
        type: "rent",
        bedRooms: 1,
        bathRooms: 1,
        regularPrice: 0,
        discountPrice: 0,
        isOffer: false,
        isParking: false,
        isFurnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useSelector((store) => store.user);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchListing = async () => {
            const response = await fetch(`${backendURL}/listing/get/${id}`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                setFormData(data)
            } else {
                setError(data.message);
            }
        };
        fetchListing();
    }, [id]);

    const handleImageSubmit = () => {
        if (files.length > 0 && files.length + formData.imageURLs.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }

            Promise.all(promises)
                .then((urls) => {
                    setFormData({
                        ...formData,
                        imageURLs: formData.imageURLs.concat(urls),
                    });

                    setImageUploadError(false);
                    setUploading(false);
                })
                .catch((err) => {
                    setImageUploadError(
                        `The image upload failed because it exceeded the maximum size limit of 2 MB per image.`
                    );
                    setUploading(false);
                });
        } else {
            setImageUploadError(`You can only upload a maximum of six images.`);
            setUploading(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageURLs: formData.imageURLs.filter((url, i) => i !== index),
        });
    };

    const handleChange = (e) => {
        if (e.target.id === "sale" || e.target.id === "rent") {
            setFormData({
                ...formData,
                type: e.target.id,
            });
        }

        if (e.target.id === "isParking" || e.target.id === "isFurnished" || e.target.id === "isOffer") {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            });
        }

        if (e.target.type === "number" || e.target.type === "text" || e.target.type === "textarea") {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageURLs.length < 1) return setError("Please provide a valid image for uploading.");
            if (formData.regularPrice < formData.discountPrice)
                return setError("Discount price must be lower than regular price");
            setLoading(true);
            setError(false);
            const response = await fetch(`${backendURL}/listing/update/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
            } else {
                setLoading(false);
                setError(false);
                navigate(`/listing/${data._id}`);
            }
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Update a Listing</h1>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-4 flex-1">
                    <input
                        type="text"
                        id="name"
                        maxLength="62"
                        minLength="10"
                        required
                        placeholder="Name"
                        className="border p-3 rounded-lg"
                        onChange={handleChange}
                        value={formData.name}
                    />
                    <textarea
                        type="text"
                        id="description"
                        required
                        placeholder="Description"
                        className="border p-3 rounded-lg"
                        onChange={handleChange}
                        value={formData.description}
                    />
                    <input
                        type="text"
                        id="address"
                        required
                        placeholder="Address"
                        className="border p-3 rounded-lg"
                        onChange={handleChange}
                        value={formData.address}
                    />
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="sale"
                                className="w-5"
                                onChange={handleChange}
                                checked={formData.type === "sale"}
                            />
                            <label htmlFor="sale">sell</label>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="rent"
                                className="w-5"
                                onChange={handleChange}
                                checked={formData.type === "rent"}
                            />
                            <label htmlFor="rent">Rent</label>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="isParking"
                                className="w-5"
                                onChange={handleChange}
                                checked={formData.isParking}
                            />
                            <label htmlFor="isParking">Parking Spot</label>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="isFurnished"
                                className="w-5"
                                onChange={handleChange}
                                checked={formData.isFurnished}
                            />
                            <label htmlFor="isFurnished">Furnished</label>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="isOffer"
                                className="w-5"
                                onChange={handleChange}
                                checked={formData.isOffer}
                            />
                            <label htmlFor="isOffer">Offer</label>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input
                                className="p-3 border border-gray-300 rounded-lg"
                                type="number"
                                id="bedRooms"
                                min={1}
                                max={10}
                                required
                                onChange={handleChange}
                                value={formData.bedRooms}
                            />
                            <label htmlFor="bedRooms">Beds</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                className="p-3 border border-gray-300 rounded-lg"
                                type="number"
                                id="bathRooms"
                                min={1}
                                max={10}
                                required
                                onChange={handleChange}
                                value={formData.bathRooms}
                            />
                            <label htmlFor="bathRooms">Bathrooms</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                className="p-3 border border-gray-300 rounded-lg"
                                type="number"
                                id="regularPrice"
                                min={1}
                                required
                                onChange={handleChange}
                                value={formData.regularPrice}
                            />
                            <div className="flex flex-col items-center">
                                <label htmlFor="regularPrice">Regular Price</label>
                                <span className="text-xs"> (₹ / Month)</span>
                            </div>
                        </div>
                        {formData.isOffer && (
                            <div className="flex items-center gap-2">
                                <input
                                    className="p-3 border border-gray-300 rounded-lg"
                                    type="number"
                                    id="discountPrice"
                                    min={1}
                                    required
                                    onChange={handleChange}
                                    value={formData.discountPrice}
                                />
                                <div className="flex flex-col items-center">
                                    <label htmlFor="discountPrice">Discounted Price </label>
                                    <span className="text-xs"> (₹ / Month)</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-4">
                    <p className="font-semibold">
                        Images:
                        <span className="font-normal text-gray-600 ml-2">
                            The first image will be the cover image (max 6)
                        </span>
                    </p>
                    <div className="flex gap-4">
                        <input
                            onChange={(e) => setFiles(e.target.files)}
                            className="p-3 border border-gray-300 rounded w-full"
                            type="file"
                            id="images"
                            accept="image/*"
                            multiple
                        />
                        <button
                            onClick={handleImageSubmit}
                            type="button"
                            disabled={uploading}
                            className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
                        >
                            {uploading ? " Uploading..." : "Upload"}
                        </button>
                    </div>
                    <p className="text-red-500 text-sm text-center">{imageUploadError && imageUploadError}</p>
                    {formData.imageURLs.length > 0 &&
                        formData.imageURLs.map((url, index) => (
                            <div className="flex justify-between p-3 border items-center" key={url}>
                                <img className="w-32 h-20 object-cover rounded-lg" key={index} src={url} alt="image" />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="p-3 text-red-500 rounded-lg uppercase hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    <button
                        disabled={loading || uploading}
                        className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                    >
                        {loading ? "updating..." : "Update listing"}
                    </button>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                </div>
            </form>
        </main>
    );
};

export default UpdateListing;
