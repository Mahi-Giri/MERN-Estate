import { useEffect, useState } from "react";
import { backendURL } from "../constant";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const response = await fetch(`${backendURL}/user/${listing.userRef}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                const data = await response.json();

                if (response.ok) {
                    setLandlord(data);
                } else {
                    setLandlord(null);
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchLandlord();
    }, [listing.userRef]);

    return (
        <>
            {landlord && (
                <div className="flex flex-col gap-2">
                    <p>
                        Contact <span className="font-semibold">{landlord?.username}</span> for{" "}
                        <span className="font-semibold">{listing?.name.toLowerCase()}</span>
                    </p>
                    <textarea
                        name="message"
                        id="message"
                        rows={2}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter your message here..."
                        className="w-full border p-3 rounded-lg"
                    ></textarea>
                    <Link
                        to={`mailto:${landlord?.email}?subject=Regarding ${listing?.name}&body=${message}`}
                        className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
                    >
                        Send Message
                    </Link>
                </div>
            )}
        </>
    );
};

export default Contact;
