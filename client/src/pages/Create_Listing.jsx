import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";

const Create_Listing = () => {
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageURLs: [],
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);

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
                    setImageUploadError(`Image upload failed (2 mb max per image)`);
                    setUploading(false);
                });
        } else {
            setImageUploadError(`You can only upload a maximum of 6 images`);
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

    return (
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Create a Listing</h1>
            <form className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-4 flex-1">
                    <input
                        type="text"
                        id="name"
                        maxLength="62"
                        minLength="10"
                        required
                        placeholder="Name"
                        className="border p-3 rounded-lg"
                    />
                    <textarea
                        type="text"
                        id="description"
                        required
                        placeholder="Description"
                        className="border p-3 rounded-lg"
                    />
                    <input type="text" id="address" required placeholder="Address" className="border p-3 rounded-lg" />
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input type="checkbox" id="sale" className="w-5" />
                            <label htmlFor="sale">sell</label>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="rent" className="w-5" />
                            <label htmlFor="rent">Rent</label>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="parking" className="w-5" />
                            <label htmlFor="parking">Parking Spot</label>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="furnished" className="w-5" />
                            <label htmlFor="furnished">Furnished</label>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="offer" className="w-5" />
                            <label htmlFor="offer">Offer</label>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input
                                className="p-3 border border-gray-300 rounded-lg"
                                type="number"
                                id="bedroom"
                                min={1}
                                max={10}
                                required
                            />
                            <label htmlFor="bedroom">Beds</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                className="p-3 border border-gray-300 rounded-lg"
                                type="number"
                                id="bathrooms"
                                min={1}
                                max={10}
                                required
                            />
                            <label htmlFor="bathrooms">Bathrooms</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                className="p-3 border border-gray-300 rounded-lg"
                                type="number"
                                id="regularPrice"
                                min={1}
                                required
                            />
                            <div className="flex flex-col items-center">
                                <label htmlFor="regularPrice">Regular Price</label>
                                <span className="text-xs"> (₹ / Month)</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                className="p-3 border border-gray-300 rounded-lg"
                                type="number"
                                id="discountPrice"
                                min={1}
                                required
                            />
                            <div className="flex flex-col items-center">
                                <label htmlFor="discountPrice">Discounted Price </label>
                                <span className="text-xs"> (₹ / Month)</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-4">
                    <p className="font-semibold">
                        Images:
                        <span className="font-normal text-gray-600 ml-2">
                            The first image will be the cover (max 6){" "}
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
                    <p className="text-red-500 text-sm">{imageUploadError && imageUploadError}</p>
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
                    <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
                        create listing
                    </button>
                </div>
            </form>
        </main>
    );
};

export default Create_Listing;
