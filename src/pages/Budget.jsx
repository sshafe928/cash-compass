import React, { useEffect, useState, useRef } from "react";
import compassLogo from '../assets/images/compassLogo.png';
import { IoReturnDownBack } from "react-icons/io5";
// edit icon import
import { FiEdit3 } from "react-icons/fi";
// budget and debt section icons imports
import { FaHome, FaEllipsisH, FaShoppingBasket, FaCar, FaHeartbeat, FaFilm, FaGift, FaBook, FaUtensils, FaGraduationCap, FaCreditCard, FaUser, FaBriefcase, FaFileInvoiceDollar, FaMoneyBillWave } from "react-icons/fa";
// speedometer component and target imports
import Speedometer from "../components/Speedometer";
import { TbTargetArrow } from "react-icons/tb";
import { set } from "mongoose";
import axios from 'axios';

const Budget = () => {
const [formActive, setFormActive] = useState(false);
const [budgetFormActive, setBudgetFormActive] = useState(false);
const [selectedBudgetCategory, setSelectedBudgetCategory] = useState(null);
const [selectedGoalCategory, setselectedGoalCategory] = useState(null);
const [goalFormActive, setGoalFormActive] = useState(false);
const [isVisible, setIsVisible] = useState(false);
const [threshold, setThreshold] = useState(0.4);
const [BudgetItems, setBudgetItems] = useState([])
const speedometerRef = useRef(null);

useEffect(() => {
    const updateThreshold = () => {
    if (window.innerWidth < 768) {
        setThreshold(0.4);
    } else {
        setThreshold(0.8);
    }
    };

    updateThreshold();
    window.addEventListener("resize", updateThreshold);

    return () => {
    window.removeEventListener("resize", updateThreshold);
    };
}, []);

useEffect(() => {
    const observer = new IntersectionObserver(
    ([entry]) => {
        if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
        }
    },
    { threshold }
    );

    if (speedometerRef.current) {
    observer.observe(speedometerRef.current);
    }

    return () => observer.disconnect();
}, [threshold]);

const [isOpen, setIsOpen] = useState(false);

const toggleSidebar = () => setIsOpen(!isOpen);

const updateBudgetItem = async (id, newAmount) => {
    try {
    const response = await axios.post('/routes/budgetRoutes/update', {
        id,
        newAmount
    });
    return response.data;
    } catch (error) {
    console.error('Error updating budget:', error);
    throw error;
    }
};

// Then modify your form submission handler
const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
    // Get the new amount from form
    const formData = new FormData(e.target);
    const newAmount = formData.get('newAmount');
    
    // Call the API function
    const result = await updateBudgetItem(selectedBudgetCategory._id, newAmount);
    
    if (result.success) {
        // Update local state to reflect the change
        const updatedBudgetItems = budgetItems.map(item => {
        if (item._id === selectedBudgetCategory._id) {
            return { 
            ...item, 
            amount: parseFloat(newAmount) 
            };
        }
        return item;
        });
        
        // Update state
        setBudgetItems(updatedBudgetItems);
        
        
        setBudgetFormActive(false);
        
        
        alert('Budget updated successfully!');
    } else {
        throw new Error(result.message || 'Failed to update budget');
    }
    } catch (error) {
    // Show error message
    console.error('Update failed:', error);
    alert(error.message || 'Failed to update budget');
    } 
};


const budgetItems = [
    { icon: FaHome, title: "Living", amount: 2000, spent: 2200, color: "text-gray-500" },
    { icon: FaHeartbeat, title: "Healthcare", amount: 250, spent: 100, color: "text-red-500" },
    { icon: FaCar, title: "Transportation", amount: 120, spent: 80, color: "text-yellow-500" },
    { icon: FaShoppingBasket, title: "Groceries", amount: 250, spent: 200, color: "text-green-500" },
    { icon: FaFilm, title: "Entertainment", amount: 100, spent: 60, color: "text-purple-500" },
    { icon: FaGift, title: "Gifts", amount: 50, spent: 10, color: "text-pink-500" },
    { icon: FaUtensils, title: "Restaurant & Dining", amount: 150, spent: 120, color: "text-red-400" },
    { icon: FaBook, title: "Education", amount: 100, spent: 150, color: "text-orange-500" },
    { icon: FaEllipsisH, title: "Other", amount: 250, spent: 140, color: "text-blue-600" }
];
const savingItems = [
    { title: "Fix Car Transmission", startDate: "01 Jan 25", goalDate: "27 May 26", goalAmount: 250, currentAmount: 200 },
    { title: "Travel to Dubai", startDate: "01 Jan 25", goalDate: "27 May 26", goalAmount: 250, currentAmount: 10 },
    { title: "Buy New Laptop", startDate: "01 Jan 25", goalDate: "15 Aug 26", goalAmount: 1200, currentAmount: 300 },
    { title: "Home Renovation", startDate: "01 Feb 25", goalDate: "10 Dec 26", goalAmount: 5000, currentAmount: 750 },
    { title: "Learn a New Language", startDate: "01 Mar 25", goalDate: "01 Mar 26", goalAmount: 200, currentAmount: 50 },
    { title: "Upgrade Home Office", startDate: "01 Apr 25", goalDate: "01 Oct 26", goalAmount: 1500, currentAmount: 1000 },
];
const debtItems = [
    {
        icon: FaGraduationCap,
        title: "Student Loans",
        currentAmount: 2000,
        color: "text-blue-500",
        description:"Includes federal and private student loans for tuition, books, housing, and other educational expenses."
    },
    {
        icon: FaCreditCard,
        title: "Credit Card Debt",
        currentAmount: 10,
        color: "text-red-500",
        description: "Debt from revolving credit cards, including unpaid balances, interest charges, and late fees."
    },
    {
        icon: FaHome,
        title: "Mortgage",
        currentAmount: 30000,
        color: "text-green-500",
        description: "Home loan debt, including first and second mortgages, home equity loans, and refinancing balances."
    },
    {
        icon: FaUser,
        title: "Personal",
        currentAmount: 750,
        color: "text-purple-500",
        description: "Unsecured loans for personal use, such as debt consolidation, vacations, weddings, or emergencies."
    },
    {
        icon: FaCar,
        title: "Auto Loans",
        currentAmount: 50,
        color: "text-yellow-500",
        description: "Loans for purchasing or leasing a car, truck, or motorcycle, including financing and leasing agreements."
    },
    {
        icon: FaHeartbeat,
        title: "Medical Debt",
        currentAmount: 1000,
        color: "text-red-500",
        description: "Outstanding balances for medical expenses, including hospital bills, surgery, prescriptions, and emergency care."
    },
    {
        icon: FaBriefcase,
        title: "Business Loans",
        currentAmount: 1000,
        color: "text-red-900",
        description: "Loans taken to fund a business, including startup costs, operational expenses, and equipment purchases."
    },
    {
        icon: FaFileInvoiceDollar,
        title: "Tax Debt",
        currentAmount: 1000,
        color: "text-gray-500",
        description: "Unpaid federal, state, or local taxes, including income tax, property tax, and penalties for late payments."
    },
];
const totalDebt = debtItems.reduce((sum, item) => sum + item.currentAmount, 0);
const formattedTotalDebt = totalDebt.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// resources
const financialResources = [
    { question: "Don't know how much money to spend and how much to save?", title: "How Much Should You Save Each Month?", link: "https://www.youtube.com/watch?v=IIKr2915l2g" },
    { question: "Confused about setting financial goals that are achievable?", title: "How to Set Realistic Financial Goals and Stick to Them", link: "https://www.youtube.com/watch?v=cEqqOHfEHk8" },
    { question: "Wondering how to prioritize paying off debt while saving for the future?", title: "Pay Off Debt AND Save Money – How to Balance Both!", link: "https://www.youtube.com/watch?v=ILx5fmTun44" },
    { question: "Need tips on how to build a monthly budget that actually works for you?", title: "How to Build a Simple and Effective Monthly Budget", link: "https://www.youtube.com/watch?v=3pslPbfpnzk" },
    { question: "Struggling to save for emergencies and big purchases at the same time?", title: "How to Save for Both an Emergency Fund and Big Purchases", link: "https://www.youtube.com/watch?v=mtXUb6QpbkQ" },
    { question: "Not sure how to separate your spending into categories like essentials, wants, and savings?", title: "How to Categorize Your Spending and Save More", link: "https://www.youtube.com/watch?v=V59GNErtt48" },
    { question: "Want to know the best way to track your spending and avoid overspending?", title: "How to Track Your Spending & Avoid Overspending", link: "https://www.youtube.com/watch?v=4sT2B2SRypo" },
    { question: "Looking for a simple method to manage both short-term and long-term savings goals?", title: "Short-Term vs Long-Term Savings – How to Manage Both", link: "https://www.youtube.com/watch?v=jLojCtQPmbk" },
    { question: "Not sure how to handle unexpected expenses without disrupting your budget?", title: "How to Handle Unexpected Expenses Without Blowing Your Budget", link: "https://www.youtube.com/watch?v=mAKHBFbnF9k" },
    { question: "Curious about the 50/30/20 rule for budgeting and how to apply it?", title: "The 50/30/20 Budget Rule Explained", link: "https://www.youtube.com/watch?v=jNUbhmB8zw8" },
];

return (
    <div className="flex min-h-screen bg-bg-gray">
        {/* navbar */}
        <div className={`lg:w-1/5 w-[300px] fixed lg:relative bg-dark-blue text-white h-full flex flex-col lg:top-0 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}></div>
        <div className={`lg:w-1/5 w-[300px] fixed bg-dark-blue text-white p-4 h-screen flex flex-col lg:top-0 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
            <button className="lg:hidden absolute top-4 right-4 text-white text-3xl" onClick={toggleSidebar}>&times;</button>
            <div className="text-center">
                <img src={compassLogo} alt="Compass Logo" className="mx-auto w-[150px]" />
                <h2 className="text-2xl mb-4">Cash Compass</h2>
            </div>
            <ul>
                <li><a href="/" className="block py-2 px-4 rounded-md hover:bg-hl-blue hover:text-dark-blue">Dashboard</a></li>
                <li><a href="/forms" className="block py-2 px-4 rounded-md hover:bg-hl-blue hover:text-dark-blue">Forms</a></li>
                <li><a href="/history" className="block py-2 px-4 rounded-md hover:bg-hl-blue hover:text-dark-blue">History</a></li>
                <li><a href="/budget" className="block py-2 px-4 rounded-md hover:bg-hl-blue hover:text-dark-blue">Budgeting</a></li>
            </ul>
            <div className="flex-grow" />
            <div className="mb-4">
                <ul>
                    <li><a href="/" className="block py-2 px-4 rounded-md hover:bg-hl-blue hover:text-dark-blue">Profile</a></li>
                    <li><a href="/" className="block py-2 px-4 rounded-md hover:bg-hl-blue hover:text-dark-blue">Logout</a></li>
                </ul>
            </div>
        </div>
        {/* header */}
        <div className="flex-1 p-4 w-4/5 transition-all duration-300 ease-in-out min-h-[100vh]">
            <div className="flex px-4 pt-4 justify-between border-b border-[#284b74] pb-5">
                <div className="flex items-center">
                    <button className="lg:hidden p-2 text-black text-3xl md:text-4xl mr-3" onClick={toggleSidebar}>☰</button>
                    <h1 className="text-dark-blue text-xl md:text-3xl">Budgeting</h1>
                </div>
                <div className="flex items-center">
                    <h1 className="text-dark-blue text-2xl mr-4">Daniel</h1>
                    <img className="h-12 w-auto rounded-full" src="https://tse1.mm.bing.net/th?id=OIP.cEvbluCvNFD_k4wC3k-_UwHaHa&pid=Api" alt="profile"/>
                </div>
            </div>
            {/* main content */}
            <div className="flex flex-col gap-4 justify-center">
                {/* budgeting section */}
                <div className="w-full max-w-7xl mx-auto px-4">
                    <h1 className="text-gray-500 text-xl my-4">Budgeting Goals</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {budgetItems.map((item, index) => {
                            const spentPercentage = (item.spent / item.amount) * 100;
                            return(
                                <div key={index} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-shrink-0">
                                                <item.icon className={`w-8 h-8 ${item.color}`} />
                                            </div>
                                            <div className="flex flex-col min-w-0 max-w-[150px] lg:max-w-[110px] xl:max-w-[150px]">
                                                <h2 className="text-gray-500 text-sm sm:text-base truncate">{item.title}</h2>
                                                <p className="font-bold text-base sm:text-lg">${new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(item.amount)}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => (setBudgetFormActive(true), setSelectedBudgetCategory(item))} className="flex-shrink-0 flex items-center gap-2 border-2 border-dark-blue rounded-lg p-2 text-dark-blue hover:text-blue-300 hover:border-blue-300 text-sm sm:text-base transition-colors duration-200">
                                            <span className="hidden custom-large:inline">Adjust</span>
                                            <FiEdit3 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {/* Spent Amount & Progress Bar */}
                                    <div className="mt-4">
                                        <p className="text-gray-500 text-sm">Spent: 
                                            <span className="font-bold text-gray-700"> ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.spent)}</span>
                                        </p>
                                        {/* Progress Bar */}
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                            <div 
                                                className={`h-2 rounded-full transition-all duration-300 ${spentPercentage < 100 ? "bg-blue-500" : "bg-red-500"}`}
                                                style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                                            ></div>
                                        </div>
                                        {/* Percentage Spent Display */}
                                        <p className={`text-sm font-semibold mt-1 ${spentPercentage >= 100 ? "text-red-500" : "text-gray-600"}`}>
                                            {spentPercentage.toFixed(1)}% of budget used
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ADJUSTING BUDGET FORM */}
                {budgetFormActive && selectedBudgetCategory && (
                <>
                    {/* Dark overlay */}
                    <div className="fixed inset-0 bg-black bg-opacity-60 z-40"></div>

                    {/* The form */}
                    <form onSubmit={handleSubmit} className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[800px] rounded-2xl bg-white border border-[#284b74] p-4 mt-8">
                        <button className="text-gray flex items-center hover:text-dark-blue" onClick={() => setBudgetFormActive(false)}>
                            <IoReturnDownBack className="w-6 h-6" />
                        </button>
                        <div className="text-center flex flex-col w-5/6 mx-auto mb-4">
                            <h1 className="text-dark-blue text-xl md:text-3xl mt-6">Adjust Monthly {selectedBudgetCategory.title} Budget</h1>

                            {/* Goal Title */}
                            <div className="flex flex-col mt-4">
                                <label className="text-left text-md text-gray-700 font-medium" htmlFor="">New Budget Amount:</label>
                                <input type="text" className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" placeholder={selectedBudgetCategory.amount} />
                            </div>
                            <div className="flex flex-col mt-4 space-y-4 text-start">
                                <h1 className="font-semibold text-dark-blue">Currently spent ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(selectedBudgetCategory.spent)} of your ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(selectedBudgetCategory.amount)} monthly budget.</h1>
                                <h1 className="font-semibold text-dark-blue">Current Date: {new Date().toLocaleDateString('en-US')}</h1>
                            </div>

                            {/* Submit Button */}
                            <button className="my-10 p-2 rounded-md text-white w-full bg-dark-blue mx-auto hover:bg-hl-blue hover:text-dark-blue">
                                Submit Transaction
                            </button>
                        </div>
                    </form>
                </>
                )}

                {/* savings section */}
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
                        <div key={index}className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="flex justify-between">
                                <div className="flex flex-col">
                                    <h1 className="font-bold text-lg text-black">{item.title}</h1>
                                    <h1 className="text-gray-600 text-md">{item.startDate} - {item.goalDate}</h1>
                                </div>
                                <TbTargetArrow className="text-red-600 w-8 h-8" />
                            </div>
                            <div className="flex justify-between gap-4">
                                <div className="flex flex-col my-4">
                                    <div className="flex flex-col my-2">
                                        <p className="font-bold text-base sm:text-lg">${new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(item.currentAmount)}</p>
                                        <p className="text-gray-600 text-base sm:text-md">Total Achieved</p>
                                    </div>
                                    <div className="flex flex-col my-2">
                                        <p className="font-bold text-base sm:text-lg">${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2}).format(item.goalAmount)}</p>
                                        <p className="text-gray-600 text-base sm:text-md">Target Goal</p>
                                    </div>
                                </div>
                                {/* speedometer */}
                                {isVisible && (
                                    <Speedometer value={item.currentAmount} maxValue={item.goalAmount} />
                                )}
                                {!isVisible && (
                                    <Speedometer value={0} maxValue={1} />
                                )}
                            </div>
                            <div className="flex justify-between items-center">
                                <button className="text-red-600 hover:text-red-900 hover:border-b-2 hover:border-red-900 text-md transition-colors duration-200">
                                    remove
                                </button>
                                <button onClick={() => (setGoalFormActive(true), setselectedGoalCategory(item))} className="flex-shrink-0 flex items-center gap-2 border-2 border-dark-blue rounded-lg p-2 text-dark-blue hover:text-blue-300 hover:border-blue-300 text-sm sm:text-base transition-colors duration-200">
                                    <span>Adjust</span>
                                    <FiEdit3 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>

                {/* ADJUSTING GOAL AMOUNT FORM */}
                {goalFormActive && selectedGoalCategory && (
                <>
                    {/* Dark overlay */}
                    <div className="fixed inset-0 bg-black bg-opacity-60 z-40"></div>

                    {/* The form */}
                    <form className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[800px] rounded-2xl bg-white border border-[#284b74] p-4 mt-8">
                        <button className="text-gray flex items-center hover:text-dark-blue" onClick={() => setGoalFormActive(false)}>
                            <IoReturnDownBack className="w-6 h-6" />
                        </button>
                        <div className="text-center flex flex-col w-5/6 mx-auto mb-4">
                            <h1 className="text-dark-blue text-xl md:text-3xl mt-6">Adjust {selectedGoalCategory.title} Target Goal:</h1>

                            {/* Goal Title */}
                            <div className="flex flex-col mt-4">
                                <label className="text-left text-md text-gray-700 font-medium" htmlFor="">New Target Amount:</label>
                                <input type="text" className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" placeholder={selectedGoalCategory.goalAmount} />
                            </div>
                            {/* Goal Date */}
                            <div className="flex flex-col mt-4">
                                <label className="text-left text-md text-gray-700 font-medium" htmlFor="">New Target Date:</label>
                                <input type="text" className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" placeholder={selectedGoalCategory.goalDate} />
                            </div>
                            <div className="flex flex-col mt-4 space-y-4 text-start">
                                <h1 className="font-semibold text-dark-blue">Currently saved ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(selectedGoalCategory.currentAmount)} of your ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(selectedGoalCategory.goalAmount)} target goal.</h1>
                                <h1 className="font-semibold text-dark-blue">Current Date: {new Date().toLocaleDateString('en-US')}</h1>
                            </div>

                            {/* Submit Button */}
                            <button className="my-10 p-2 rounded-md text-white w-full bg-dark-blue mx-auto hover:bg-hl-blue hover:text-dark-blue">
                                Submit Transaction
                            </button>
                        </div>
                    </form>
                </>
                )}

                {/* GOAL FORM */}
                {formActive && (
                <>
                    {/* Dark overlay */}
                    <div className="fixed inset-0 bg-black bg-opacity-60 z-40"></div>

                    {/* The form */}
                    <form className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[800px] rounded-2xl bg-white border border-[#284b74] p-4 mt-8">
                    <button className="text-gray flex items-center hover:text-dark-blue" onClick={() => setFormActive(false)}>
                        <IoReturnDownBack className="w-6 h-6" />
                    </button>
                    <div className="text-center flex flex-col w-5/6 mx-auto mb-4">
                        <h1 className="text-dark-blue text-xl md:text-3xl mt-6">Add Goal</h1>

                        {/* Goal Title */}
                        <div className="flex flex-col mt-4">
                        <label className="text-left text-md text-gray-700 font-medium" htmlFor="">Goal Title:</label>
                        <input type="text" className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" placeholder="Trip to Dubai" />
                        </div>

                        {/* Date and Amount Inputs */}
                        <div className="flex flex-col mt-4">
                        <label className="text-left text-md text-gray-700 font-medium" htmlFor="">Achieve By:</label>
                        <input className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" type="date" required />
                        </div>

                        <div className="flex flex-col mt-4">
                        <label className="text-left text-md text-gray-700 font-medium" htmlFor="">Amount:</label>
                        <input className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" type="number" placeholder="$" required />
                        </div>

                        {/* Submit Button */}
                        <button className="my-10 p-2 rounded-md text-white w-full bg-dark-blue mx-auto hover:bg-hl-blue hover:text-dark-blue">
                        Submit Transaction
                        </button>
                    </div>
                    </form>
                </>
                )}

                {/* debt section */}
                <div className="w-full max-w-7xl mx-auto px-4">
                    <h1 className="text-gray-500 text-xl my-4">Debt Tracking</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200 flex justify-center">
                            <div className="flex flex-col">
                                <div className="flex justify-center items-center gap-4">
                                    <FaMoneyBillWave className={`w-12 h-12 text-green-700`} />
                                    <h1 className="text-xl">Total Debt</h1>
                                </div>
                                <h1 className="font-bold text-base sm:text-2xl text-center my-4">${formattedTotalDebt}</h1>
                                {totalDebt <= 0 ? <h1 className="text-2xl text-center">Congratulations you are free of debt!</h1> : <h1 className="text-2xl text-center">One step closer to being free of debt!</h1>}
                            </div>
                        </div>
                        {debtItems.map((item, index) => (
                        <div key={index}className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="flex justify-center items-center gap-4">
                                <div className="flex-shrink-0">
                                    <item.icon className={`w-12 h-12 ${item.color}`} />
                                </div>
                                <h1 className="text-xl">{item.title}</h1>
                            </div>
                            <p className="font-bold text-base sm:text-lg text-center my-4">${new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(item.currentAmount)}</p>
                            <p className="text-md text-center">{item.description}</p>
                        </div>
                        ))}
                    </div>
                </div>
                {/* resource section */}
                <div className="w-full max-w-7xl mx-auto px-4">
                    <h1 className="text-gray-500 text-xl my-4">Resources</h1>
                    <div className="flex flex-col text-center bg-white p-10 gap-8 rounded-lg shadow-sm hover:shadow-md">
                        <h1 className="text-2xl font-bold">User Resources</h1>
                        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
                            {[0, 1, 2].map((col) => (
                            <div key={col} className="flex flex-col space-y-4">
                                {financialResources.filter((_, index) => index % 3 === col).map((item, index) => (
                                    <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-100 rounded-md shadow-sm hover:bg-gray-200 transition">
                                        <h2 className="font-semibold text-lg">{item.title}</h2>
                                        <p className="text-sm text-gray-600">{item.question}</p>
                                    </a>
                                ))}
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default Budget;