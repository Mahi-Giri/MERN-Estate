const Create_Listing = () => {
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
                            className="p-3 border border-gray-300 rounded w-full"
                            type="file"
                            id="images"
                            accept="image/*"
                            multiple
                        />
                        <button className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
                            Upload
                        </button>
                    </div>
                    <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
                        create listing
                    </button>
                </div>
            </form>
        </main>
    );
};

export default Create_Listing;
