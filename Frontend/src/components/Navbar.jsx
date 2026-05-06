import React, { useEffect, useRef, useState } from "react";
import { navbarStyles } from "../assets/dummyStyles";
import img1 from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, User } from 'lucide-react';
import axios from "axios";

{/* Backend URL */}

const BASE_URL = import.meta.env.VITE_API_BASE;

const Navbar = ({user: propUser, onLogout}) => {
    const navigate = useNavigate();

    {/* For Reference */} 

    const menuRef = useRef();
    const [menuOpen, setMenuOpen] = useState(false);

    {/* If User is logged in */}

    const [user, setUser] = useState(propUser || null);

    {/* For Fetching the Data */}

    useEffect(() => {
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await axios.get(`${BASE_URL}/api/user/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const userData = response.data.user || response.data;
            setUser(userData);
        } catch (err) {
            console.error("Failed To Load the Profile", err);
        }
    };

    if (propUser) {
        setUser(propUser);
    } else {
        fetchUserData();
        }
    }, [propUser]);

    {/* For ToggleMenu */}

    const toggleMenu = () => setMenuOpen((prev) => !prev);
    const handleLogout = () => {
        setMenuOpen(false);
        localStorage.removeItem("token");
        onLogout?.();
        navigate("/login");
    };

    {/* For Closing the menu If we click outside */}

     useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className={navbarStyles.header}>
            <div className={navbarStyles.container}>
                {/* For Logo */}
                <div 
                    onClick={() => navigate("/")} 
                    className={navbarStyles.logoContainer}
                >
                    <div className={navbarStyles.logoImage}>
                        <img src={img1} alt="logo" />
                    </div>
                    <span className={navbarStyles.logoText}>MoneyTrack</span>
                </div>

                {/* If User Is already Logged IN */} 

                {user && (
                    <div className={navbarStyles.userContainer} ref={menuRef}>
                        <button onClick={toggleMenu} className={navbarStyles.userButton}>
                            <div className="relative">
                                <div className={navbarStyles.userAvatar}>
                                    {user?.name?.[0]?.toUpperCase() || "U"}
                                </div>
                                <div className={navbarStyles.statusIndicator}></div>
                            </div>
                            <div className={navbarStyles.userTextContainer}>
                                <p className={navbarStyles.userName}>{user?.name || "User"}</p>
                                <p className={navbarStyles.userEmail}>{user?.email || "notuser@MoneyTrack.com"}</p>
                            </div>
                            <ChevronDown className={navbarStyles.chevronIcon(menuOpen)} />
                        </button>

                        {/* DropDown Menu */}

                        {menuOpen && (
                            <div className={navbarStyles.dropdownMenu}>
                                <div className={navbarStyles.dropdownHeader}>
                                    <div className="flex items-center gap-3">
                                        <div className={navbarStyles.dropdownAvatar}>
                                            {user?.name?.[0]?.toUpperCase() || "U"}
                                        </div>
                                        <div>
                                            <div className={navbarStyles.dropdownName}>
                                                {user?.name || "User"}
                                            </div>
                                            <div className={navbarStyles.dropdownEmail}>
                                                {user?.email || "notuser@MoneyTrack.com"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={navbarStyles.menuItemContainer}>
                                    <button
                                        onClick={() => {
                                            setMenuOpen(false);
                                            navigate("/profile");
                                        }}
                                        className={navbarStyles.menuItem}
                                    >
                                        <User className="w-4 h-4" />
                                        <span>My Profile</span>
                                    </button>
                                </div>
                                <div className={navbarStyles.menuItemBorder}>
                                    <button
                                        onClick={handleLogout}
                                        className={navbarStyles.logoutButton}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Log Out</span>

                                    </button>

                                </div>
                            </div>
                        )}

                    </div>
                )}


            </div>
        </header>
    )
}

export default Navbar;