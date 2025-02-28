import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import compassLogo from '../assets/images/compassLogo.png'
import { AiOutlineArrowUp, AiOutlineArrowDown, AiOutlineCreditCard } from "react-icons/ai";
import { GiPiggyBank } from "react-icons/gi";


const History = () => {
        const [isOpen, setIsOpen] = useState(false);
        const [option, setOption] = useState("")
        const [category, setCategory] = useState(null)
        const [isFocused, setIsFocused] = useState(false);
    
        const toggleSidebar = () => setIsOpen(!isOpen);

        const incomeCategories = [
            "Employment (Salary/Bonus/Freelance)",
            "Investments (Interest/Dividends)",
            "Gifts",
            "Government (Benefits/Assistance)",
            "Other"
        ];
        
        const expenseCategories = [
            "Living (Rent/Utilities/Insurance)",
            "Transportation",
            "Healthcare",
            "Groceries",
            "Restaurant & Dining",
            "Entertainment",
            "Education",
            "Gifts",
            "Other"
        ];

        const debtCategories = [
            "Student Loans",
            "Credit Card Debt",
            "Mortgage",
            "Personal",
            "Auto Loans",
            "Medical Debt",
            "Business Loans",
            "Tax Debt"
        ];

        const savingCategories = [
            "Savings Balance",
            "Goals",
        ];

        const handleSelection = (value) => {
            if (value) {
                setOption(value);
                if (value === 'income') {
                    setCategory(incomeCategories);
                } else if (value === 'expense') {
                    setCategory(expenseCategories);
                } else if (value === 'saving') {
                    setCategory(savingCategories);
                } else if (value === 'debt') {
                    setCategory(debtCategories);
                };
            };
        };

        //type icons
        const getTypeIcon = (type) => {
            switch (type.toLowerCase()) {
                case "expense":
                    return <div className="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full text-white"><AiOutlineArrowDown size={18}/></div>;
                case "income":
                    return <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full text-white"><AiOutlineArrowUp size={18}/></div>;
                case "savings":
                    return <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-white"><GiPiggyBank size={18}/></div>;
                case "debt":
                    return <div className="flex items-center justify-center w-8 h-8 bg-yellow-500 rounded-full text-white"><AiOutlineCreditCard size={18}/></div>;
                default:
                    return <div></div>;
            }
        };  

        //TRANSACTION DATA
        const transactions = [
            { type: "Savings", amount: 50, category: "Travel to Dubai", date: "2025-02-15", description: "Added money towards Dubai trip fund" },
            { type: "Expense", amount: -300, category: "Healthcare", date: "2025-02-12", description: "Doctor visit and medication" },
            { type: "Debt", amount: 750, category: "Personal", date: "2025-02-04", description: "New personal loan taken" },
            { type: "Income", amount: 500, category: "Investments", date: "2025-02-07", description: "Stock dividends" },
            { type: "Debt", amount: -50, category: "Auto Loans", date: "2025-02-06", description: "Car loan installment payment" },
            { type: "Savings", amount: 450, category: "Home Renovation", date: "2025-02-12", description: "Added money towards home renovation savings" },
            { type: "Debt", amount: -30000, category: "Mortgage", date: "2025-02-03", description: "Monthly mortgage payment" },
            { type: "Income", amount: 3000, category: "Employment", date: "2025-02-05", description: "Monthly salary" },
            { type: "Expense", amount: -50, category: "Entertainment", date: "2025-02-15", description: "Movie tickets" },
            { type: "Savings", amount: -500, category: "Upgrade Home Office", date: "2025-02-10", description: "Withdrew savings to cover unexpected car repairs" },
            { type: "Debt", amount: -1000, category: "Medical Debt", date: "2025-02-07", description: "Hospital bill payment" },
            { type: "Income", amount: 250, category: "Gifts", date: "2025-02-08", description: "Gift from family" },
            { type: "Debt", amount: -2000, category: "Student Loans", date: "2025-02-01", description: "Federal student loan payment" },
            { type: "Expense", amount: -250, category: "Groceries", date: "2025-02-13", description: "Weekly grocery shopping" },
            { type: "Savings", amount: 100, category: "Buy New Laptop", date: "2025-02-07", description: "Added money towards new laptop savings" },
            { type: "Income", amount: 600, category: "Government", date: "2025-02-09", description: "Unemployment benefits" },
            { type: "Debt", amount: 1000, category: "Tax Debt", date: "2025-02-09", description: "New tax debt incurred" },
            { type: "Expense", amount: -75, category: "Restaurant", date: "2025-02-14", description: "Dinner with friends" },
            { type: "Savings", amount: -50, category: "Fix Car Transmission", date: "2025-02-05", description: "Withdrew savings to cover emergency medical expense" },
            { type: "Savings", amount: 25, category: "Learn a New Language", date: "2025-02-18", description: "Added money towards language learning fund" },
            { type: "Income", amount: 300, category: "Other", date: "2025-02-10", description: "Freelance project payment" },
            { type: "Expense", amount: -200, category: "Other", date: "2025-02-18", description: "Miscellaneous expenses" },
            { type: "Expense", amount: -150, category: "Transportation", date: "2025-02-11", description: "Gas and maintenance" },
            { type: "Savings", amount: 500, category: "Savings", date: "2025-02-10", description: "Set aside money for savings" },
            { type: "Expense", amount: -1200, category: "Living", date: "2025-02-10", description: "Rent payment" },
            { type: "Income", amount: 500, category: "Gifts", date: "2025-02-17", description: "Birthday gift for a friend" },
            { type: "Debt", amount: -10, category: "Credit Card Debt", date: "2025-02-02", description: "Credit card minimum payment" },
            { type: "Expense", amount: -500, category: "Education", date: "2025-02-16", description: "Online course" },
            { type: "Debt", amount: 5000, category: "Business Loan", date: "2025-02-10", description: "New business loan taken" },
            { type: "Savings", amount: -100, category: "Buy New Laptop", date: "2025-02-07", description: "Withdrew savings to cover urgent home repair" },
        ];
        
    return (
        <>
            <div className="flex min-h-screen bg-bg-gray">
                {/* navbar */}
                <div className={`lg:w-1/5 w-[300px] fixed z-20 lg:relative bg-dark-blue text-white h-full flex flex-col lg:top-0 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}></div>
                    <div className={`lg:w-1/5 w-[300px] fixed z-20 bg-dark-blue text-white p-4 h-screen flex flex-col lg:top-0 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
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
                            <h1 className="text-dark-blue text-xl md:text-3xl">History</h1>
                        </div>
                        <div className="flex items-center">
                            <h1 className="text-dark-blue text-2xl mr-4">Daniel</h1>
                            <img className="h-12 w-auto rounded-full" src="https://tse1.mm.bing.net/th?id=OIP.cEvbluCvNFD_k4wC3k-_UwHaHa&pid=Api" alt="profile"/>
                        </div>
                    </div>
                    {/* main content */}
                    {/* FILTER SECTION */}
                    <div className="flex justify-between mt-4">
                        <div className="w-full max-w-7xl mx-auto">
                            <div className="flex flex-wrap gap-4 mb-10">
                                <div className="flex rounded-lg border border-dark-blue overflow-hidden shadow-md h-10">
                                    <select className="bg-white p-2 text-dark-blue font-semibold mx-auto text-sm focus:outline-none" required>
                                        <option className="font-semibold" value="1_week">Last 7 Days</option>
                                        <option className="font-semibold" value="1_month">Last Month</option>
                                        <option className="font-semibold" value="6_months">Last 6 Months</option>
                                        <option className="font-semibold" value="12_months">Last 12 Months</option>
                                    </select>
                                    <input className="bg-white text-dark-blue font-semibold text-sm px-2 border-l border-dark-blue focus:outline-none date-dark-blue-icon" type="date" />
                                </div>
                                <div className="flex rounded-lg border border-dark-blue overflow-hidden shadow-md h-10">
                                    <select className="bg-white p-2 text-dark-blue font-semibold mx-auto text-sm focus:outline-none border-r border-dark-blue"  onChange={(e)=> handleSelection(e.target.value)} required>
                                        <option className="font-semibold" value="" hidden>Type</option>
                                        <option className="font-semibold" value="income">Income</option>
                                        <option className="font-semibold" value="expense">Expense</option>
                                        <option className="font-semibold" value="saving">Saving</option>
                                        <option className="font-semibold" value="debt">Debt</option>
                                    </select>

                                    {option && (
                                    <select className="bg-white p-2 text-dark-blue font-semibold mx-auto text-sm focus:outline-none border-r border-dark-blue w-[150px] truncate" required>
                                        <option value="" hidden>Category</option>
                                        {/* FIX THE WIDTH OF THE OPTIONS SO IT DOES NOT STRETCH THE WIDTH OF THE INPUT */}
                                        {category.map((item) => (
                                            <option className="font-semibold" key={item} value={item.toLowerCase()}>{item}</option>
                                        ))}
                                    </select>)}

                                    <select className="bg-white p-2 text-dark-blue font-semibold mx-auto text-sm focus:outline-none" required>
                                        <option className="font-semibold" value="" hidden>Amount</option>
                                        <option className="font-semibold" value="50_99">1 - 99</option>
                                        <option className="font-semibold" value="100_299">100 - 299</option>
                                        <option className="font-semibold" value="300_599">300 - 599</option>
                                        <option className="font-semibold" value="600_999">600 - 999</option>
                                        <option className="font-semibold" value="1000_1999">1000 - 2499</option>
                                        <option className="font-semibold" value="2000_2999">2500 - 4999</option>
                                        <option className="font-semibold" value="3000_3999">5000+</option>
                                    </select>
                                </div>
                                <div className="flex overflow-hidden shadow-md">
                                    <div className="relative z-10 w-fit h-fit">
                                        <button className="absolute right-1 w-10 h-10 flex items-center justify-center text-dark-blue cursor-pointer" onClick={() => setIsFocused(!isFocused)}>
                                            <FaSearch size={20} />
                                        </button>
                                        <input type="text" className={`h-10 border border-dark-blue text-dark-blue pr-12 text-sm tracking-widest outline-none rounded-lg transition-all duration-500 ease-in-out bg-white placeholder-gray-700  ${isFocused ? 'w-64 px-4' : 'w-12'}`} placeholder="Type to Search..." onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}/>
                                    </div>
                                </div>
                                <div className="flex rounded-lg border border-dark-blue shadow-md overflow-hidden h-10">
                                    <button className="bg-white text-dark-blue w-24 font-semibold hover:bg-gray-200">Search</button>
                                </div>
                            </div>
                            {/* TABLE SECTION */}
                            <div className="border border-dark-blue rounded-lg overflow-hidden p-2 bg-white">
                                <table className="w-full border-collapse">
                                    <thead className="border-b">
                                        <tr>
                                            <th className="px-4 py-4 text-start text-dark-blue text-sm font-semibold hidden sm:block">Type</th>
                                            <th className="px-4 py-4 text-start text-dark-blue text-sm font-semibold sm:hidden">Type/Date</th>
                                            <th className="px-4 py-4 text-start text-dark-blue text-sm font-semibold">Amount</th>
                                            <th className="px-4 py-4 text-start text-dark-blue text-sm font-semibold">Where</th>
                                            <th className="px-4 py-4 text-start text-dark-blue text-sm font-semibold hidden sm:table-cell">Date</th>
                                            <th className="px-4 py-4 text-start text-dark-blue text-sm font-semibold hidden md:table-cell">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-2 text-dark-blue text-sm flex items-center gap-4">{getTypeIcon(item.type)}
                                                    <div className="flex flex-col sm:hidden">
                                                        <p>{item.type}</p>
                                                        <p className="text-[11px] text-nowrap">{item.date}</p>
                                                    </div>
                                                    <div className="hidden sm:block">{item.type}</div>
                                                </td>
                                                <td className={`px-4 py-2 ${item.type !== 'Debt' ? item.amount > 0 ? 'text-green-500' : 'text-red-500' : item.amount > 0 ? 'text-yellow-500' : 'text-green-500'} text-sm`}>{item.type === 'income' ? '+' : ''}{item.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                                <td className="px-4 py-2 text-dark-blue text-sm">{item.category}</td>
                                                <td className="px-4 py-4 text-dark-blue text-sm hidden sm:table-cell text-nowrap">{item.date}</td>
                                                <td className="px-4 py-2 text-dark-blue text-sm hidden md:table-cell truncate overflow-hidden max-w-[150px] lg:max-w-[250px] whitespace-nowrap" title={item.description}>
                                                    {item.description}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex flex-wrap gap-4 bg-white border border-dark-blue rounded-lg p-8 mt-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-[30px] h-[15px] max-w-4 bg-green-500 rounded-full"></div>
                                    <p className="font-semibold text-sm text-gray-900">Indicates income, paying off debt, or setting aside money for savings.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-[30px] h-[15px] max-w-4 bg-red-500 rounded-full"></div>
                                    <p className="font-semibold text-sm text-gray-900">Indicates expenses or taking money out of savings.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-[30px] h-[15px] max-w-4 bg-yellow-500 rounded-full"></div>
                                    <p className="font-semibold text-sm text-gray-900">Indicates adding to your debt.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default History