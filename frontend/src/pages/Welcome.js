import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Login from "./Login";

const Welcome = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);

    const handleStart = () => {
        if (user) {
            navigate("/home");
        } else {
            setShowLogin(true);
        }
    };

    const handleContactClick = () => {
        const contactSection = document.getElementById('contact-sec');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div
            id="welcome-sec"
            className="w-screen h-screen relative flex flex-col"
            style={{
                backgroundColor: "#DEDEDE",
                backgroundImage: 'url(/assets/bg.webp)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <nav className="fixed top-7 left-1/2 transform -translate-x-1/2 w-3/4 z-50">
                <div className="bg-[#DEDEDE]/50 backdrop-blur-md py-4 text-[#800000] rounded-2xl shadow-md">
                    <div className="max-w-[calc(100%-44px)] mx-auto flex justify-between items-center">
                        <div className="text-3xl font-semibold">
                            <span>Text Summarizer</span>
                        </div>
                        <div className="flex gap-7">
                            <button
                                className="px-4 py-2 border-2 border-[#800000] text-[#800000] rounded hover:bg-[#800000] hover:text-white transition-all duration-300 font-medium"
                                onClick={handleStart}
                            >
                                Begin
                            </button>
                            <button
                                className="px-4 py-2 border-2 border-[#800000] text-[#800000] rounded hover:bg-[#800000] hover:text-white transition-all duration-300 font-medium"
                                onClick={handleContactClick}
                            >
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex-grow flex flex-col items-center justify-center">
                <h1 className="text-7xl font-bold text-[#DEDEDE] pb-12 text-center drop-shadow-lg">
                    Welcome to your Legal AI Companion
                </h1>
                <h1 className="text-4xl font-semibold text-[#DEDEDE] pb-3 text-center drop-shadow-lg">
                    "Summarize judgments.
                </h1>
                <h1 className="text-4xl font-semibold text-[#DEDEDE] pb-16 text-center drop-shadow-lg">
                    Get clarity — effortlessly."
                </h1>
                <div className="flex gap-16">
                    <button
                        className="px-8 py-3 bg-[#800000] text-[#DEDEDE] rounded-lg hover:bg-[#DEDEDE] hover:text-[#990909] transition-all duration-300 text-lg font-medium"
                        onClick={handleStart}
                    >
                        Start
                    </button>
                    <button
                        className="px-8 py-3 border-2 border-[#800000] text-[#DEDEDE] rounded-lg hover:bg-[#800000] hover:text-white transition-all duration-300 text-lg font-medium"
                        onClick={() => window.open('https://drive.google.com/file/d/1bVmNKaMHSp_JXYkcOjkbSoKEJs8BPrMt/view?usp=sharing', '_blank', 'noopener,noreferrer')}
                    >
                        Demo
                    </button>
                </div>
            </div>

            {showLogin && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white p-8 rounded-xl shadow-lg relative">
                        <button
                            onClick={() => setShowLogin(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-[#800000] text-2xl"
                        >
                            &times;
                        </button>
                        <Login />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Welcome;