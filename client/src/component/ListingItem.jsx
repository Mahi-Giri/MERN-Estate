import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

const ListingItem = ({ listing }) => {
    return (
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
            <Link to={`/listing/${listing._id}`}>
                <img
                    src={listing.imageURLs[0]}
                    alt={listing.name}
                    className="h-[300px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
                />
                <div className="p-3 flex flex-col gap-2 w-full">
                    <p className="truncate text-lg font-semibold text-slate-700">{listing.name}</p>
                    <div className="flex items-center gap-1">
                        <MdLocationOn className="h-4 w-4 text-green-700" />
                        <p className="truncate text-sm text-gray-600 w-full">{listing.address}</p>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>
                    <p className="text-slate-500 mt-2 font-semibold">
                        ₹{" "}
                        {listing.isOffer
                            ? listing.discountPrice.toLocaleString("en-US")
                            : listing.regularPrice.toLocaleString("en-US")}
                        {listing.type === "rent" && " / month"}
                    </p>
                    <div className="text-slate-700 flex gap-4">
                        <div className="font-bold text-xm">
                            {listing.bedRooms > 1 ? `${listing.bedRooms} beds` : `${listing.bedRooms} bed`}
                        </div>
                        <div className="font-bold text-xm">
                            {listing.bathRooms > 1 ? `${listing.bathRooms} baths` : `${listing.bathRooms} bath`}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ListingItem;
