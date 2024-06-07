import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backendURL } from "../constant";
import ListingItem from "../component/ListingItem";

const Search = () => {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: "",
        type: "all",
        offer: false,
        furnished: false,
        parking: false,
        sort: "created_at",
        order: "desc",
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState([]);
    // console.log(listing);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromURL = urlParams.get("searchTerm");
        const typeFromURL = urlParams.get("type");
        const offerFromURL = urlParams.get("offer");
        const furnishedFromURL = urlParams.get("furnished");
        const parkingFromURL = urlParams.get("parking");
        const sortFromURL = urlParams.get("sort");
        const orderFromURL = urlParams.get("order");

        if (
            searchTermFromURL ||
            typeFromURL ||
            offerFromURL ||
            furnishedFromURL ||
            parkingFromURL ||
            sortFromURL ||
            orderFromURL
        ) {
            setSidebarData({
                searchTerm: searchTermFromURL,
                type: typeFromURL || "all",
                offer: offerFromURL === "true" ? true : false,
                furnished: furnishedFromURL === "true" ? true : false,
                parking: parkingFromURL === "true" ? true : false,
                sort: sortFromURL || "created_at",
                order: orderFromURL || "desc",
            });
        }

        const fetchListing = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const response = await fetch(`${backendURL}/listing/get?${searchQuery}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                setListing(data);
                setLoading(false);
            } else {
                setLoading(false);
            }
        };

        fetchListing();
    }, [location.search]);

    const handleChange = (e) => {
        if (e.target.id === "all" || e.target.id === "rent" || e.target.id === "sale") {
            setSidebarData({
                ...sidebarData,
                type: e.target.id,
            });
        }

        if (e.target.id === "searchTerm") {
            setSidebarData({
                ...sidebarData,
                searchTerm: e.target.value,
            });
        }

        if (e.target.id === "offer" || e.target.id === "parking" || e.target.id === "furnished") {
            setSidebarData({
                ...sidebarData,
                [e.target.id]: e.target.checked || e.target.checked === "true" ? true : false,
            });
        }

        if (e.target.id === "sort") {
            const sort = e.target.value.split("_")[0] || "created_at";
            const order = e.target.value.split("_")[1] || "desc";
            setSidebarData({
                ...sidebarData,
                sort,
                order,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set("searchTerm", sidebarData.searchTerm);
        urlParams.set("type", sidebarData.type);
        urlParams.set("offer", sidebarData.offer);
        urlParams.set("furnished", sidebarData.furnished);
        urlParams.set("parking", sidebarData.parking);
        urlParams.set("sort", sidebarData.sort);
        urlParams.set("order", sidebarData.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    return (
        <div className="flex flex-col md:flex-row md:min-h-screen">
            <div className="p-7 border-b-2 md:border-r-2">
                <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                    <div className="flex items-center gap-2">
                        <label htmlFor="searchTerm" className="whitespace-nowrap font-semibold">
                            Search Term
                        </label>
                        <input
                            type="text"
                            id="searchTerm"
                            placeholder="Search"
                            className="border rounded-lg p-3 w-full"
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap items-center">
                        <label className="font-semibold">Type:</label>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="all"
                                className="w-5"
                                onChange={handleChange}
                                checked={sidebarData.type === "all"}
                            />
                            <span>Rent & Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="rent"
                                className="w-5"
                                onChange={handleChange}
                                checked={sidebarData.type === "rent"}
                            />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="sale"
                                className="w-5"
                                onChange={handleChange}
                                checked={sidebarData.type === "sale"}
                            />
                            <span>Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="offer"
                                className="w-5"
                                onChange={handleChange}
                                checked={sidebarData.offer === true}
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap items-center">
                        <label className="font-semibold">Amenities:</label>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="parking"
                                className="w-5"
                                onChange={handleChange}
                                checked={sidebarData.parking === true}
                            />
                            <span>Parking</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="furnished"
                                className="w-5"
                                onChange={handleChange}
                                checked={sidebarData.furnished === true}
                            />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="sort" className="font-semibold">
                            Sort
                        </label>
                        <select
                            id="sort"
                            className="border rounded-lg p-3"
                            onChange={handleChange}
                            defaultValue={"created_at_desc"}
                        >
                            <option value="regularPrice_desc">Price High to low</option>
                            <option value="regularPrice_asc">Price low to High</option>
                            <option value="createAt_desc">Latest</option>
                            <option value="createAt_asc">Oldest</option>
                        </select>
                    </div>
                    <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
                        Search
                    </button>
                </form>
            </div>
            <div className="flex-1">
                <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">Listing result:</h1>
                <div className="flex flex-wrap gap-4 p-7">
                    {!loading && listing.length === 0 && <p className="text-xl text-slate-700">No listing found !!!</p>}
                    {loading && <div className="text-xl text-slate-700 text-center w-full">Loading...</div>}
                    {!loading &&
                        listing &&
                        listing.map((listing) => <ListingItem key={listing._id} listing={listing} />)}
                </div>
            </div>
        </div>
    );
};

export default Search;
