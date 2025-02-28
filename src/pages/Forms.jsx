import React, { useState } from "react";
import { IoReturnDownBack } from "react-icons/io5";
import compassLogo from '../assets/images/compassLogo.png'
//even tho not used its needed for data so no errors
import { FaHome, FaCar, FaHeartbeat, FaGraduationCap, FaCreditCard, FaUser, FaBriefcase, FaFileInvoiceDollar} from "react-icons/fa";

const Forms = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("")
    const [formActive, setFormActive] = useState(false)

    function handleOption(variable){
        if(variable){
            setSelectedOption(variable)
            setFormActive(true)
        }
    }

    const toggleSidebar = () => setIsOpen(!isOpen);

    // savings total
    const totalSavings = 2592;

    //GOAL DATA
    const savingItems = [
        { title: "Fix Car Transmission", startDate: "01 Jan 25", goalDate: "27 May 26", goalAmount: 250, currentAmount: 200 },
        { title: "Travel to Dubai", startDate: "01 Jan 25", goalDate: "27 May 26", goalAmount: 250, currentAmount: 10 },
        { title: "Buy New Laptop", startDate: "01 Jan 25", goalDate: "15 Aug 26", goalAmount: 1200, currentAmount: 300 },
        { title: "Home Renovation", startDate: "01 Feb 25", goalDate: "10 Dec 26", goalAmount: 5000, currentAmount: 750 },
        { title: "Learn a New Language", startDate: "01 Mar 25", goalDate: "01 Mar 26", goalAmount: 200, currentAmount: 50 },
        { title: "Upgrade Home Office", startDate: "01 Apr 25", goalDate: "01 Oct 26", goalAmount: 1500, currentAmount: 1000 },
    ];

    //DEBT DATA
    const debtItems = [
        {
            icon: FaGraduationCap,
            title: "Student Loans",
            currentAmount: 2000,
            color: "text-blue-500",
            description: "Includes fed spent: 10,eral and private student loans for tuition, books, housing, and other educational expenses."
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
    
    return (
        <>
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
                    <div className="flex justify-between border-b border-[#284b74] pb-5">
                        <div className="flex items-center">
                            <button className="lg:hidden p-2 text-black text-3xl md:text-4xl mr-3" onClick={toggleSidebar}>☰</button>
                            <h1 className="text-dark-blue text-xl md:text-3xl">Forms</h1>
                        </div>
                        <div className="flex items-center">
                            <h1 className="text-dark-blue text-2xl mr-4">Daniel</h1>
                            <img className="h-12 w-auto rounded-full" src="https://tse1.mm.bing.net/th?id=OIP.cEvbluCvNFD_k4wC3k-_UwHaHa&pid=Api" alt="profile"/>
                        </div>
                    </div>
                    {/* main content */}
                    {/* FORM OPTIONS */}
                    {!formActive &&
                    <div className="flex flex-col justify-between mx-auto mt-20 gap-10 md:gap-20">
                        <div className="flex md:flex-row flex-col gap-10 md:gap-20 mx-auto">
                            <button className="bg-[url(../assets/images/incomeMobile2.png)] md:bg-[url(../assets/images/income.png)] bg-cover md:bg-cover w-[300px] h-[150px] md:h-[250px] lg:w-[350px] rounded-2xl flex shadow-md hover:shadow-lg transition-shadow duration-200" onClick={()=>handleOption("income")}>
                                <h1 className="text-4xl ml-8 mt-6 text-dark-blue">Income</h1>
                            </button>
                            <button className="bg-[url(../assets/images/expenseMobile.png)] md:bg-[url(../assets/images/expense.png)] bg-cover md:bg-cover w-[300px] h-[150px] md:h-[250px] lg:w-[350px] rounded-2xl flex shadow-md hover:shadow-lg transition-shadow duration-200" onClick={()=>handleOption("expense")}>
                                <h1 className="text-4xl ml-8 mt-6 text-dark-blue">Expense</h1>
                            </button>
                        </div>
                        <div className="flex md:flex-row flex-col gap-10 md:gap-20 mx-auto">
                            <button className="bg-[url(../assets/images/savingsMobile.png)] md:bg-[url(../assets/images/savings2.png)] bg-cover md:bg-cover w-[300px] h-[150px] md:h-[250px] lg:w-[350px] rounded-2xl flex shadow-md hover:shadow-lg transition-shadow duration-200" onClick={()=>handleOption("savings")}>
                                <h1 className="text-4xl ml-8 mt-6 text-dark-blue">Savings</h1>
                            </button>
                            <button className="bg-[url(../assets/images/debtMobile.png)] md:bg-[url(../assets/images/debt2.png)] bg-cover md:bg-cover w-[300px] h-[150px] md:h-[250px] lg:w-[350px] rounded-2xl flex shadow-md hover:shadow-lg transition-shadow duration-200" onClick={()=>handleOption("debt")}>
                                <h1 className="text-4xl ml-8 mt-6 text-dark-blue">Debt</h1>
                            </button>
                        </div>
                    </div>
                    }
                    {/* INCOME FORM */}
                    {selectedOption === "income" && formActive && (
                        <form className="rounded-2xl bg-white max-w-[800px] min-h-[600px] border border-[#284b74] mx-auto p-4 mt-8">
                            <button className="text-gray flex items-center hover:text-dark-blue" onClick={() => setFormActive(false)}>
                                <IoReturnDownBack className="w-6 h-6" />
                            </button>
                            <div className="text-center flex flex-col w-5/6 mx-auto">
                                <h1 className="text-dark-blue text-xl md:text-3xl mt-6">Income</h1>

                                {/* Source Dropdown */}
                                <div className="flex flex-col mt-2">
                                    <label className="text-left text-md text-gray-700 font-medium" htmlFor="income-source">Category</label>
                                    <select className="p-2 border border-gray-300 rounded-md text-gray-900 w-full mx-auto focus:outline-none focus:ring-1 focus:ring-[#284b74]" required>
                                        <option value="Employment">Employment (Salary/Bonus/Freelance)</option>
                                        <option value="Investments">Investments (Interest/Dividends)</option>
                                        <option value="Gifts">Gifts</option>
                                        <option value="Government">Government (Benefits/Assistance)</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Date and Amount Inputs */}
                                <div className="flex justify-between w-full mx-auto mt-6">
                                    <div className="flex flex-col w-3/6 mr-2">
                                        <label className="text-left text-md text-gray-700 font-medium" htmlFor="income-date">Date</label>
                                        <input className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" type="date" required />
                                    </div>
                                    <div className="flex flex-col w-3/6 ml-2">
                                        <label className="text-left text-md text-gray-700 font-medium" htmlFor="income-amount">Amount</label>
                                        <input className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" type="number" placeholder="$" required />
                                    </div>
                                </div>

                                {/* Description Textarea */}
                                <div className="flex flex-col mt-6">
                                    <label className="text-left text-md text-gray-700 font-medium" htmlFor="description">Description</label>
                                    <textarea className="p-2 border border-gray-300 rounded-md text-gray-900 w-full h-[150px] resize-none focus:outline-none focus:ring-1 focus:ring-[#284b74]" name="description" id="description" placeholder="Description..." required></textarea>
                                </div>

                                {/* Submit Button */}
                                <button className="mt-6 p-2 rounded-md text-white w-full bg-dark-blue mx-auto hover:bg-hl-blue hover:text-dark-blue">
                                    Submit Transaction
                                </button>
                            </div>
                        </form>
                    )}
                    {/* EXPENSES FORM */}
                    {selectedOption === "expense" && formActive && (
                        <form className="rounded-2xl bg-white max-w-[800px] min-h-[600px] border border-[#284b74] mx-auto p-4 mt-8">
                            <button className="text-gray flex items-center hover:text-dark-blue" onClick={() => setFormActive(false)}>
                                <IoReturnDownBack className="w-6 h-6" />
                            </button>
                            <div className="text-center flex flex-col w-5/6 mx-auto">
                                <h1 className="text-dark-blue text-xl md:text-3xl mt-6">Expense</h1>

                                {/* Category Dropdown */}
                                <div className="flex flex-col mt-2">
                                    <label className="text-left text-md text-gray-700 font-medium" htmlFor="expense-category">Category</label>
                                    <select className="p-2 border border-gray-300 rounded-md text-gray-900 w-full mx-auto focus:outline-none focus:ring-1 focus:ring-[#284b74]" required>
                                        <option value="Living">Living (Rent/Utilities/Insurance)</option>
                                        <option value="Transportation">Transportation</option>
                                        <option value="Healthcare">Healthcare</option>
                                        <option value="Groceries">Groceries</option>
                                        <option value="Restaurant">Restaurant & Dining</option>
                                        <option value="Entertainment">Entertainment</option>
                                        <option value="Education">Education</option>
                                        <option value="Gifts">Gifts</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Date and Amount Inputs */}
                                <div className="flex justify-between w-full mx-auto mt-6">
                                    <div className="flex flex-col w-3/6 mr-2">
                                        <label className="text-left text-md text-gray-700 font-medium" htmlFor="expense-date">Date</label>
                                        <input className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" type="date" required />
                                    </div>
                                    <div className="flex flex-col w-3/6 ml-2">
                                        <label className="text-left text-md text-gray-700 font-medium" htmlFor="expense-amount">Amount</label>
                                        <input className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" type="number" placeholder="$" required />
                                    </div>
                                </div>

                                {/* Description Textarea */}
                                <div className="flex flex-col mt-6">
                                    <label className="text-left text-md text-gray-700 font-medium" htmlFor="description">Description</label>
                                    <textarea className="p-2 border border-gray-300 rounded-md text-gray-900 w-full h-[150px] resize-none focus:outline-none focus:ring-1 focus:ring-[#284b74]" name="description" id="description" placeholder="Description..." required></textarea>
                                </div>

                                {/* Submit Button */}
                                <button className="mt-6 p-2 rounded-md text-white w-full bg-dark-blue mx-auto hover:bg-hl-blue hover:text-dark-blue">
                                    Submit Transaction
                                </button>
                            </div>
                        </form>
                    )}
                    {/* SAVINGS FORM */}
                    {selectedOption === "savings" && formActive && (
                        <form className="rounded-2xl bg-white max-w-[800px] min-h-[600px] border border-[#284b74] mx-auto p-4 mt-8">
                            <button className="text-gray flex items-center hover:text-dark-blue" onClick={() => setFormActive(false)}>
                                <IoReturnDownBack className="w-6 h-6" />
                            </button>
                            <div className="text-center flex flex-col w-5/6 mx-auto mb-4">
                                <h1 className="text-dark-blue text-xl md:text-3xl mt-6">Savings</h1>

                                {/* Savings Balance Dropdown */}
                                <div className="flex flex-col mt-2">
                                    <label className="text-left text-md text-gray-700 font-medium" htmlFor="savings-category">Savings Category</label>
                                    <select className="p-2 border border-gray-300 rounded-md text-gray-900 w-full mx-auto focus:outline-none focus:ring-1 focus:ring-[#284b74]" required>
                                        <option value="Student">Savings Balance - ${totalSavings}</option>
                                        {/* goals dynamically displayed here */}
                                        {savingItems.map(item => (
                                            <option key={item.title} value={item.title}>{item.title} - ${item.currentAmount}/${item.goalAmount}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Transaction Type Dropdown */}
                                <div className="flex flex-col mt-6">
                                    <label className="text-left text-md text-gray-700 font-medium" htmlFor="savings-transaction">Transaction Type</label>
                                    <select className="p-2 border border-gray-300 rounded-md text-gray-900 w-full mx-auto focus:outline-none focus:ring-1 focus:ring-[#284b74]" required>
                                        <option value="In">Into Savings/Goal</option>
                                        <option value="Out">Out of Savings/Goal</option>
                                    </select>
                                </div>

                                {/* Date and Amount Inputs */}
                                <div className="flex justify-between w-full mx-auto mt-6">
                                    <div className="flex flex-col w-3/6 mr-2">
                                        <label className="text-left text-md text-gray-700 font-medium" htmlFor="savings-date">Date</label>
                                        <input className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" type="date" required />
                                    </div>
                                    <div className="flex flex-col w-3/6 ml-2">
                                        <label className="text-left text-md text-gray-700 font-medium" htmlFor="savings-amount">Amount</label>
                                        <input className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" type="number" placeholder="$" required />
                                    </div>
                                </div>

                                {/* Description Textarea */}
                                <div className="flex flex-col mt-6">
                                    <label className="text-left text-md text-gray-700 font-medium" htmlFor="description">Description</label>
                                    <textarea className="p-2 border border-gray-300 rounded-md text-gray-900 w-full h-[150px] resize-none focus:outline-none focus:ring-1 focus:ring-[#284b74]" name="description" id="description" placeholder="Description..." required></textarea>
                                </div>

                                {/* Submit Button */}
                                <button className="my-6 p-2 rounded-md text-white w-full bg-dark-blue mx-auto hover:bg-hl-blue hover:text-dark-blue">
                                    Submit Transaction
                                </button>
                            </div>
                        </form>
                    )}
                    {/* DEBT FORM */}
                    {selectedOption === "debt" && formActive && (
                        <form className="rounded-2xl bg-white max-w-[800px] min-h-[600px] border border-[#284b74] mx-auto p-4 mt-8">
                            <button className="text-gray flex items-center hover:text-dark-blue" onClick={() => setFormActive(false)}>
                                <IoReturnDownBack className="w-6 h-6" />
                            </button>
                            <div className="text-center flex flex-col w-5/6 mx-auto mb-4">
                                <h1 className="text-dark-blue text-xl md:text-3xl mt-6">Debt</h1>

                                {/* Debt Type Dropdown */}
                                <div className="flex flex-col mt-2">
                                    <label className="text-left text-md text-gray-700 font-medium" htmlFor="debt-type">Debt Category</label>
                                    <select className="p-2 border border-gray-300 rounded-md text-gray-900 w-full mx-auto focus:outline-none focus:ring-1 focus:ring-[#284b74]" required>
                                        {/* debt options dynamically displayed here */}
                                        {debtItems.map(item => (
                                            <option key={item.title} value={item.title}>{item.title} - ${item.currentAmount}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Debt Action Dropdown */}
                                <div className="flex flex-col mt-6">
                                    <label className="text-left text-md text-gray-700 font-medium" htmlFor="debt-action">Debt Action</label>
                                    <select className="p-2 border border-gray-300 rounded-md text-gray-900 w-full mx-auto focus:outline-none focus:ring-1 focus:ring-[#284b74]" required>
                                        <option value="Adding">Adding to Debt</option>
                                        <option value="Paying">Paying off Debt</option>
                                    </select>
                                </div>

                                {/* Date and Amount Inputs */}
                                <div className="flex justify-between w-full mx-auto mt-6">
                                    <div className="flex flex-col w-3/6 mr-2">
                                        <label className="text-left text-md text-gray-700 font-medium" htmlFor="debt-date">Date</label>
                                        <input className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" type="date" required />
                                    </div>
                                    <div className="flex flex-col w-3/6 ml-2">
                                        <label className="text-left text-md text-gray-700 font-medium" htmlFor="debt-amount">Amount</label>
                                        <input className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" type="number" placeholder="$" required />
                                    </div>
                                </div>

                                {/* Description Textarea */}
                                <div className="flex flex-col mt-6">
                                    <label className="text-left text-md text-gray-700 font-medium" htmlFor="description">Description</label>
                                    <textarea className="p-2 border border-gray-300 rounded-md text-gray-900 w-full h-[150px] resize-none focus:outline-none focus:ring-1 focus:ring-[#284b74]" name="description" id="description" placeholder="Description..." required></textarea>
                                </div>

                                {/* Submit Button */}
                                <button className="my-6 p-2 rounded-md text-white w-full bg-dark-blue mx-auto hover:bg-hl-blue hover:text-dark-blue">
                                    Submit Transaction
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
};

export default Forms;