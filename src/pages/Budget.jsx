import React, { useEffect, useState, useRef } from "react";
import compassLogo from '../assets/images/compassLogo.png';
import { IoReturnDownBack } from "react-icons/io5";
import { FiEdit3 } from "react-icons/fi";
import { FaHome, FaEllipsisH, FaShoppingBasket, FaCar, FaHeartbeat, FaFilm, FaGift, FaBook, FaUtensils, FaGraduationCap, FaCreditCard, FaUser, FaBriefcase, FaFileInvoiceDollar, FaMoneyBillWave } from "react-icons/fa";
import Speedometer from "../components/Speedometer";
import { TbTargetArrow } from "react-icons/tb";
import axios from 'axios';

const Budget = () => {
    // ===================== STATE MANAGEMENT =====================
    const [formActive, setFormActive] = useState(false); // Toggles the "Add Goal" form
    const [budgetFormActive, setBudgetFormActive] = useState(false); // Toggles the "Adjust Budget" form
    const [selectedBudgetCategory, setSelectedBudgetCategory] = useState(null); // Selected budget category for editing
    const [selectedGoalCategory, setselectedGoalCategory] = useState(null); // Selected savings goal for editing
    const [goalFormActive, setGoalFormActive] = useState(false); // Toggles the "Adjust Goal" form
    const [isVisible, setIsVisible] = useState(false); // Tracks speedometer visibility for animations
    const [threshold, setThreshold] = useState(0.4); // Threshold for IntersectionObserver
    const [BudgetItems, setBudgetItems] = useState([]); // Budget items (to be fetched from MongoDB)
    const speedometerRef = useRef(null); // Ref for the speedometer component

    // ===================== SIDEBAR TOGGLE =====================
    const [isOpen, setIsOpen] = useState(false); // Toggles sidebar visibility
    const toggleSidebar = () => setIsOpen(!isOpen); // Function to toggle sidebar

    // ===================== INTERSECTION OBSERVER =====================
    useEffect(() => {
        const updateThreshold = () => {
            if (window.innerWidth < 768) setThreshold(0.4); // Lower threshold for mobile
            else setThreshold(0.8); // Higher threshold for desktop
        };
        updateThreshold();
        window.addEventListener("resize", updateThreshold); // Update threshold on resize
        return () => window.removeEventListener("resize", updateThreshold); // Cleanup
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true); // Trigger animation when speedometer is visible
                    observer.disconnect(); // Stop observing
                }
            },
            { threshold } // Use dynamic threshold
        );
        if (speedometerRef.current) observer.observe(speedometerRef.current); // Observe speedometer
        return () => observer.disconnect(); // Cleanup
    }, [threshold]);

    // ===================== API FUNCTION: UPDATE BUDGET =====================
    const updateBudgetItem = async (id, newAmount) => {
        try {
            const response = await axios.post('/routes/budgetRoutes/update', { id, newAmount });
            return response.data; // Return updated data
        } catch (error) {
            console.error('Error updating budget:', error);
            throw error;
        }
    };

    // ===================== FORM SUBMISSION HANDLER =====================
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            const newAmount = formData.get('newAmount');
            const result = await updateBudgetItem(selectedBudgetCategory._id, newAmount); // Call API
            if (result.success) {
                const updatedBudgetItems = budgetItems.map(item => {
                    if (item._id === selectedBudgetCategory._id) {
                        return { ...item, amount: parseFloat(newAmount) }; // Update local state
                    }
                    return item;
                });
                setBudgetItems(updatedBudgetItems); // Update state
                setBudgetFormActive(false); // Close form
                alert('Budget updated successfully!');
            } else {
                throw new Error(result.message || 'Failed to update budget');
            }
        } catch (error) {
            console.error('Update failed:', error);
            alert(error.message || 'Failed to update budget');
        }
    };

    // ===================== HARDCODED DATA (TO BE REPLACED WITH MONGODB FETCH) =====================
    const budgetItems = [
        { icon: FaHome, title: "Living", amount: 2000, spent: 2200, color: "text-gray-500" },
        { icon: FaHeartbeat, title: "Healthcare", amount: 250, spent: 100, color: "text-red-500" },
        // Add more budget items here
    ];

    const savingItems = [
        { title: "Fix Car Transmission", startDate: "01 Jan 25", goalDate: "27 May 26", goalAmount: 250, currentAmount: 200 },
        // Add more savings goals here
    ];

    const debtItems = [
        { icon: FaGraduationCap, title: "Student Loans", currentAmount: 2000, color: "text-blue-500", description: "Includes federal and private student loans." },
        // Add more debt items here
    ];

    const totalDebt = debtItems.reduce((sum, item) => sum + item.currentAmount, 0); // Calculate total debt
    const formattedTotalDebt = totalDebt.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Format total debt

    const financialResources = [
        { question: "Don't know how much to save?", title: "How Much Should You Save Each Month?", link: "https://www.youtube.com/watch?v=IIKr2915l2g" },
        // Add more resources here
    ];

    // ===================== RENDER COMPONENT =====================
    return (
        <div className="flex min-h-screen bg-bg-gray">
            {/* Sidebar */}
            <div className={`lg:w-1/5 w-[300px] fixed bg-dark-blue text-white p-4 h-screen flex flex-col lg:top-0 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
                {/* Sidebar content */}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 w-4/5 transition-all duration-300 ease-in-out min-h-[100vh]">
                {/* Header */}
                <div className="flex px-4 pt-4 justify-between border-b border-[#284b74] pb-5">
                    <div className="flex items-center">
                        <button className="lg:hidden p-2 text-black text-3xl md:text-4xl mr-3" onClick={toggleSidebar}>☰</button>
                        <h1 className="text-dark-blue text-xl md:text-3xl">Budgeting</h1>
                    </div>
                    <div className="flex items-center">
                        <h1 className="text-dark-blue text-2xl mr-4">Daniel</h1>
                        <img className="h-12 w-auto rounded-full" src="https://tse1.mm.bing.net/th?id=OIP.cEvbluCvNFD_k4wC3k-_UwHaHa&pid=Api" alt="profile" />
                    </div>
                </div>

                {/* Budgeting Section */}
                <div className="w-full max-w-7xl mx-auto px-4">
                    <h1 className="text-gray-500 text-xl my-4">Budgeting Goals</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {budgetItems.map((item, index) => (
                            <div key={index} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                                {/* Budget item content */}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Savings Section */}
                <div className="w-full max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-gray-500 text-xl my-4">Savings Goals</h1>
                        <button onClick={() => setFormActive(true)} className="flex items-center border-2 gap-1 border-dark-blue text-dark-blue rounded-lg w-[100px] h-[40px] justify-center hover:border-blue-300 hover:text-blue-300">
                            <h1 className="text-sm font-bold">Add Goal</h1>
                            <TbTargetArrow className="w-5 h-5" />
                        </button>
                    </div>
                    <div ref={speedometerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {savingItems.map((item, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                                {/* Savings goal content */}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Debt Section */}
                <div className="w-full max-w-7xl mx-auto px-4">
                    <h1 className="text-gray-500 text-xl my-4">Debt Tracking</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Debt content */}
                    </div>
                </div>

                {/* Resources Section */}
                <div className="w-full max-w-7xl mx-auto px-4">
                    <h1 className="text-gray-500 text-xl my-4">Resources</h1>
                    <div className="flex flex-col text-center bg-white p-10 gap-8 rounded-lg shadow-sm hover:shadow-md">
                        {/* Resources content */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Budget;