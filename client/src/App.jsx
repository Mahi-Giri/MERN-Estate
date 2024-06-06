import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Signin from "./pages/Signin";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Header from "./component/Header";
import PrivateRoute from "./component/PrivateRoute";
import Create_Listing from "./pages/Create_Listing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="listing/:id" element={<Listing />} />
                <Route path="/search" element={<Search />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/create-listing" element={<Create_Listing />} />
                    <Route path="/update-listing/:id" element={<UpdateListing />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
