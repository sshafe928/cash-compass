import React, { useState } from "react";
// imports for charts/bar
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
// up down arrow icons
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
// icons for categories
import { FaBriefcase, FaHome, FaShoppingBasket, FaChartLine, FaCar, FaHeartbeat, FaFilm, FaGift, FaBook, FaUtensils, FaEllipsisH, FaLandmark } from "react-icons/fa";
// target icon import
import { TbTargetArrow } from "react-icons/tb";
import compassLogo from '../assets/images/compassLogo.png';
//left and right arrows
import { ChevronLeft, ChevronRight } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('expenseIncome');

  const chartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    datasets: [
      { label: "Income", data: [4000, 4500, 5000, 5500, 6000, 4000, 4500, 5000, 5500, 6000, 4000, 4500], backgroundColor: "rgba(54, 162, 235, 0.6)" },
      { label: "Expenses", data: [3000, 3200, 3300, 3400, 3500, 3900, 3000, 3200, 3300, 3400, 3500, 3900], backgroundColor: "rgba(255, 99, 132, 0.6)" },
    ],
  };

  const debtData = {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    datasets: [
      { label: "Debt", data: [4000, 4500, 5000, 5500, 6000, 4000, 4500, 5000, 5500, 6000, 4000, 4500], backgroundColor: "rgba(0, 0, 0, 0.6)" },
    ],
  };

  const chartOptions = { responsive: true, plugins: { legend: { position: "top" }, title: { display: true, text: selectedOption === 'expenseIncome' ? "Income and Expenses Overview" : "Debt Overview" } } };

  // Handle the dropdown change
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // Use the selected option to decide which data to display
  const chartDataActive = selectedOption === 'expenseIncome' ? chartData : debtData;

  const toggleSidebar = () => setIsOpen(!isOpen);

  //category icons
  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "employment":
        return <FaBriefcase className="w-6 h-6 text-blue-500" />;
      case "living":
        return <FaHome className="w-6 h-6 text-gray-500" />;
      case "groceries":
        return <FaShoppingBasket className="w-6 h-6 text-green-500" />;
      case "investments":
        return <FaChartLine className="w-6 h-6 text-indigo-500" />;
      case "transportation":
        return <FaCar className="w-6 h-6 text-yellow-500" />;
      case "healthcare":
        return <FaHeartbeat className="w-6 h-6 text-red-500" />;
      case "entertainment":
        return <FaFilm className="w-6 h-6 text-purple-500" />;
      case "gifts":
        return <FaGift className="w-6 h-6 text-pink-500" />;
      case "education":
        return <FaBook className="w-6 h-6 text-orange-500" />;
      case "restaurant":
        return <FaUtensils className="w-6 h-6 text-red-400" />;
      case "government":
        return <FaLandmark className="w-6 h-6 text-blue-600" />;
      default:
        return <FaEllipsisH className="w-6 h-6 text-blue-600" />; // Default icon for other categories
    }
  };  
  
  // Sample transaction data
  const transactions = [
    { id: 1, type: "income", amount: 2500, category: "Employment", date: "2025-01-26" },
    { id: 2, type: "expense", amount: -80, category: "Living", date: "2025-01-25" },
    { id: 3, type: "expense", amount: -120, category: "Groceries", date: "2025-01-24" },
    { id: 4, type: "income", amount: 500, category: "Investments", date: "2025-01-23" },
    { id: 5, type: "expense", amount: -45, category: "Transportation", date: "2025-01-22" },
    { id: 6, type: "expense", amount: -35, category: "Healthcare", date: "2025-01-21" },
    { id: 7, type: "expense", amount: -35, category: "Entertainment", date: "2025-01-20" },
    { id: 8, type: "income", amount: 500, category: "Gifts", date: "2025-01-19" },
    { id: 9, type: "expense", amount: -35, category: "Education", date: "2025-01-18" },
    { id: 10, type: "expense", amount: -35, category: "Restaurant", date: "2025-01-17" },
    { id: 11, type: "expense", amount: -35, category: "Other", date: "2025-01-16" },
    { id: 12, type: "income", amount: 500, category: "Government", date: "2025-01-15" }
  ];

  // income
  const incomes = [
    { id: 1, type: "income", amount: 500, category: "Employment", date: "2025-01-05" },
    { id: 2, type: "income", amount: 600, category: "Employment", date: "2025-02-10" },
    { id: 3, type: "income", amount: 200, category: "Gifts", date: "2025-01-15" },
    { id: 4, type: "income", amount: 250, category: "Gifts", date: "2025-03-05" },
    { id: 5, type: "income", amount: 300, category: "Investments", date: "2025-02-01" },
    { id: 6, type: "income", amount: 350, category: "Investments", date: "2025-04-12" },
    { id: 7, type: "income", amount: 150, category: "Government", date: "2025-02-20" },
    { id: 8, type: "income", amount: 200, category: "Government", date: "2025-05-18" },
    { id: 9, type: "income", amount: 400, category: "Other", date: "2025-03-01" },
    { id: 10, type: "income", amount: 450, category: "Other", date: "2025-06-08" },
  ];  

  // expenses
  const expenses = [
    { id: 1, type: "expense", amount: -50, category: "Groceries", date: "2025-01-10" },
    { id: 2, type: "expense", amount: -80, category: "Living", date: "2025-01-25" },
    { id: 3, type: "expense", amount: -120, category: "Transportation", date: "2025-02-05" },
    { id: 4, type: "expense", amount: -30, category: "Entertainment", date: "2025-02-15" },
    { id: 5, type: "expense", amount: -200, category: "Gifts", date: "2025-03-01" },
    { id: 6, type: "expense", amount: -60, category: "Restaurant & Dining", date: "2025-03-10" },
    { id: 7, type: "expense", amount: -90, category: "Healthcare", date: "2025-03-20" },
    { id: 8, type: "expense", amount: -40, category: "Other", date: "2025-04-01" },
    { id: 9, type: "expense", amount: -75, category: "Groceries", date: "2025-04-10" },
    { id: 10, type: "expense", amount: -100, category: "Living", date: "2025-04-25" },
    { id: 11, type: "expense", amount: -90, category: "Transportation", date: "2025-05-05" },
    { id: 12, type: "expense", amount: -50, category: "Entertainment", date: "2025-05-15" },
    { id: 13, type: "expense", amount: -150, category: "Gifts", date: "2025-06-01" },
    { id: 14, type: "expense", amount: -80, category: "Restaurant & Dining", date: "2025-06-10" },
    { id: 15, type: "expense", amount: -120, category: "Healthcare", date: "2025-06-20" },
    { id: 16, type: "expense", amount: -60, category: "Other", date: "2025-07-01" },
    { id: 15, type: "expense", amount: -180, category: "Education", date: "2025-02-23" },
    { id: 16, type: "expense", amount: -60, category: "Education", date: "2025-09-15" },
  ];

  const [expensePage, setExpensePage] = useState(0);
  const [incomePage, setIncomePage] = useState(0);
  const itemsPerPage = 3;

  // Function to group and sort data by category
  const groupAndSort = (data) => {
    return Object.entries(
      data.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = 0;
        }
        acc[item.category] += Math.abs(item.amount);
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1]);
  };

  const groupedExpenses = groupAndSort(expenses);
  const groupedIncomes = groupAndSort(incomes);

  const totalExpenses = groupedExpenses.reduce((sum, [_, amount]) => sum + amount, 0);
  const totalIncomes = groupedIncomes.reduce((sum, [_, amount]) => sum + amount, 0);

  const expensePageCount = Math.ceil(groupedExpenses.length / itemsPerPage);
  const incomePageCount = Math.ceil(groupedIncomes.length / itemsPerPage);

  // Paginate expenses and incomes separately
  const currentExpenses = groupedExpenses.slice(
    expensePage * itemsPerPage,
    (expensePage + 1) * itemsPerPage
  );

  const currentIncomes = groupedIncomes.slice(
    incomePage * itemsPerPage,
    (incomePage + 1) * itemsPerPage
  );

  // Separate navigation functions for expenses and incomes
  const nextExpensePage = () => {
    setExpensePage((prev) => (prev + 1) % expensePageCount);
  };

  const prevExpensePage = () => {
    setExpensePage((prev) => (prev - 1 + expensePageCount) % expensePageCount);
  };

  const nextIncomePage = () => {
    setIncomePage((prev) => (prev + 1) % incomePageCount);
  };

  const prevIncomePage = () => {
    setIncomePage((prev) => (prev - 1 + incomePageCount) % incomePageCount);
  };

  // percent up/down math will be the starting amount from the given time frame to now
  const startAmount = 9487;
  const currentAmount = 11013;
  function calculatePercentageIncrease(startAmount, currentAmount) {
    if (startAmount === 0) {
        return currentAmount > 0 ? 100 : 0;
    }
    const percentageIncrease = ((currentAmount - startAmount) / startAmount) * 100;
    return percentageIncrease;
  }
  const percent = calculatePercentageIncrease(startAmount, currentAmount);

  // savings total
  const totalSavings = 2592;

  const formattedSavings = totalSavings.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const formattedBalance = currentAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // budget data
  const budgetItems = [
      { icon: FaHome, title: "Housing", amount: 250, color: "text-gray-500" },
      { icon: FaHeartbeat, title: "Healthcare", amount: 250, color: "text-red-500" },
      { icon: FaCar, title: "Transportation", amount: 250, color: "text-yellow-500" },
      { icon: FaShoppingBasket, title: "Groceries", amount: 250, color: "text-green-500" },
      { icon: FaFilm, title: "Entertainment", amount: 250, color: "text-purple-500" },
      { icon: FaGift, title: "Gifts", amount: 250, color: "text-pink-500" },
      { icon: FaUtensils, title: "Restaurant & Dining", amount: 250, color: "text-red-400" },
      { icon: FaBook, title: "Education", amount: 250, color: "text-orange-500" },
      { icon: FaLandmark, title: "Government", amount: 250, color: "text-blue-600" }
  ];

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.amount, 0);
  const formattedBudget = totalBudget.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // saving goal display mock data
  const savingItems = [
    { title: "Fix Car Transmission", startDate: "01 Jan 25", goalDate: "27 May 26", goalAmount: 250, currentAmount: 197 },
    { title: "Travel to Dubai", startDate: "01 Jan 25", goalDate: "27 May 26", goalAmount: 250, currentAmount: 10 },
    { title: "Buy New Laptop", startDate: "01 Jan 25", goalDate: "15 Aug 26", goalAmount: 1200, currentAmount: 300 },
    { title: "Home Renovation", startDate: "01 Feb 25", goalDate: "10 Dec 26", goalAmount: 5000, currentAmount: 750 },
    { title: "Learn a New Language", startDate: "01 Mar 25", goalDate: "01 Mar 26", goalAmount: 200, currentAmount: 50 },
    { title: "Upgrade Home Office", startDate: "01 Apr 25", goalDate: "01 Oct 26", goalAmount: 1500, currentAmount: 1000 },
  ];

  // progress bar math
  const displayedGoal = savingItems[Math.floor(Math.random() * savingItems.length)];
  const progress = (displayedGoal.currentAmount / displayedGoal.goalAmount) * 100;

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
        <div className="flex justify-between border-b border-[#284b74] pb-5">
          <div className="flex items-center">
            <button className="lg:hidden p-2 text-black text-3xl md:text-4xl mr-3" onClick={toggleSidebar}>☰</button>
            <h1 className="text-dark-blue text-xl md:text-3xl">Dashboard</h1>
          </div>
          <div className="flex items-center">
            <h1 className="text-dark-blue text-2xl mr-4">Daniel</h1>
            <img className="h-12 w-auto rounded-full" src="https://tse1.mm.bing.net/th?id=OIP.cEvbluCvNFD_k4wC3k-_UwHaHa&pid=Api" alt="profile"/>
          </div>
        </div>
        {/* dashboard */}
        <div className="flex flex-col custom-large:flex-row gap-4">
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">

              {/* total balance box */}
              <div className="bg-white p-4 rounded-lg shadow-md h-[222px] w-full">
                <div className="flex justify-between">
                  <div className="flex flex-col gap-4">
                    <h1 className="text-xl text-dark-blue">Total Balance</h1>
                    <h1 className="font-bold text-3xl text-dark-blue">${formattedBalance}</h1>
                  </div>
                  {/* percent display */}
                  <div className="flex gap-4">
                    {percent > 0 ? 
                    <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full text-white">
                      <AiOutlineArrowUp size={18} />
                    </div>
                    :
                    <div className="flex items-center justify-center w-6 h-6 bg-red-500 rounded-full text-white">
                      <AiOutlineArrowDown size={18} />
                    </div>
                    }
                    <h1 className={percent > 0 ? `text-green-500` : `text-red-500`}>{percent.toFixed(2)}%</h1>
                  </div>
                </div>
                {/* Monthly budget */}
                <div className="flex flex-col gap-2 mt-4">
                  <h1 className="text-xl text-dark-blue">Total Savings</h1>
                  <h1 className="font-bold text-3xl text-dark-blue">${formattedSavings}</h1>
                </div>
              </div>

              {/* goals and savings boxz */}
              <div className="bg-white p-4 rounded-lg shadow-md h-[222px] w-full space-y-2">
                {/* goals section */}
                <div className="flex justify-between items-center">
                  <h1 className="text-xl text-dark-blue">Goals</h1>
                  <a className="text-blue-400 hover:underline" href="/budget">View all</a>
                </div>
                <div className="flex items-center gap-4">
                  <TbTargetArrow className="text-red-600 w-16 h-16" />
                  <div className="flex flex-col w-full">
                    <h1 className="text-xl text-dark-blue">{displayedGoal.title}</h1>
                    {/* progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                      <div className="bg-green-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span className="text-sm text-gray-600 mt-1">{progress.toFixed(1)}% Completed</span>
                  </div>
                </div>
                {/* savings section */}
                <div className="flex flex-col gap-2">
                  <h1 className="text-xl text-dark-blue">Total Monthly Budget</h1>
                  <h1 className="text-dark-blue text-2xl font-bold">${formattedBudget}</h1>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
              {/* Dropdown */}
              <select value={selectedOption} onChange={handleChange} className="mb-4 p-2 border rounded">
                <option value="expenseIncome">Expense & Income</option>
                <option value="debt">Debt</option>
              </select>
              <select className="mb-4 p-2 border rounded float-right">
                <option value="1_month">1 Month</option>
                <option value="6_months">6 Months</option>
                <option value="12_months">12 Months</option>
              </select>
              {/* Chart */}
              <Bar data={chartDataActive} options={chartOptions} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* spending overview section */}
              <div className="bg-white p-4 rounded-lg shadow-md h-[222px]">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-dark-blue text-xl">Spending Overview</h1>
                  <div className="flex gap-2">
                    <button onClick={prevExpensePage} className="p-1 rounded-full hover:bg-gray-100" disabled={expensePageCount <= 1}>
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button onClick={nextExpensePage} className="p-1 rounded-full hover:bg-gray-100" disabled={expensePageCount <= 1}>
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                {/* progress bars */}
                <div className="space-y-3">
                  {currentExpenses.map(([category, total]) => (
                    <div key={category} className="flex flex-col">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{category}</span>
                        <span className="text-gray-600">{((total / totalExpenses) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div className="bg-green-500 h-4 rounded-full transition-all duration-500" style={{ width: `${(total / totalExpenses) * 100}%`}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* progress bars */}
              {/* earnings overview section */}
              <div className="bg-white p-4 rounded-lg shadow-md h-[222px]">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-dark-blue text-xl">Earnings Overview</h1>
                  <div className="flex gap-2">
                    <button onClick={prevIncomePage} className="p-1 rounded-full hover:bg-gray-100" disabled={incomePageCount <= 1}>
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button onClick={nextIncomePage} className="p-1 rounded-full hover:bg-gray-100" disabled={incomePageCount <= 1}>
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  {currentIncomes.map(([category, total]) => (
                    <div key={category} className="flex flex-col">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{category}</span>
                        <span className="text-gray-600">{((total / totalIncomes) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div className="bg-green-500 h-4 rounded-full transition-all duration-500" style={{ width: `${(total / totalIncomes) * 100}%`}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* transactions (last 10) */}
          <div className="w-full height-full custom-large:w-[400px] bg-white rounded-lg shadow-md p-4 mt-4">
            <h2 className="text-xl font-semibold mb-4 text-dark-blue">Recent Transactions</h2>
            <div className="space-y-4 max-h-full overflow-y-auto">
            {transactions.slice(0, 10).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 desktop:pb-4 desktopXL:pb-5 desktop2XL:pb-6 border-b border-gray-100">
                {/* Icon on the left */}
                <div className="flex items-center space-x-3">
                  {getCategoryIcon(transaction.category)}
                  <div>
                    <p className="font-medium">{transaction.category}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                {/* Amount on the right */}
                <span className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'income' ? '+' : ''}{transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </span>
              </div>
            ))}
            </div>
            <a className="text-blue-400 hover:underline" href="/history">View all</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;