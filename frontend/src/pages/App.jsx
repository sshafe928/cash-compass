import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Imports for charts/bar
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
// Up/down arrow icons
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
// Icons for categories
import {
  FaBriefcase,
  FaHome,
  FaShoppingBasket,
  FaChartLine,
  FaCar,
  FaHeartbeat,
  FaFilm,
  FaGift,
  FaBook,
  FaUtensils,
  FaEllipsisH,
  FaLandmark
} from "react-icons/fa";
// Target icon import
import { TbTargetArrow } from "react-icons/tb";
import compassLogo from "../assets/images/compassLogo.png";
// Left and right arrows
import { ChevronLeft, ChevronRight } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();

  // User and dashboard states
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [incomes, setIncome] = useState([]);
  const [expenses, setExpense] = useState([]);
  const [savings, setSavings] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [displayedGoal, setDisplayedGoal] = useState({});

  // Chart data states
  const [chartIncome, setChartIncome] = useState(Array(12).fill(0));
  const [chartExpense, setChartExpense] = useState(Array(12).fill(0));
  const [chartDebt, setChartDebt] = useState(Array(12).fill(0));

  // Time filter states
  const [timeFilter, setTimeFilter] = useState("12_months");
  const [customChartData, setCustomChartData] = useState(null);

  // Other dashboard state
  const [selectedOption, setSelectedOption] = useState("expenseIncome");
  const [error, setError] = useState(null);

  // MISSING SIDEBAR STATE: Add isOpen state and toggleSidebar handler
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  // On mount, check for logged-in user; if not, redirect to About page
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/about");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/about");
  };

  // Default 12-month chart data
  const chartData = {
    labels: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    datasets: [
      {
        label: "Income",
        data: chartIncome,
        backgroundColor: "rgba(54, 162, 235, 0.6)"
      },
      {
        label: "Expenses",
        data: chartExpense,
        backgroundColor: "rgba(255, 99, 132, 0.6)"
      }
    ]
  };

  const debtData = {
    labels: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    datasets: [
      {
        label: "Debt",
        data: chartDebt,
        backgroundColor: "rgba(0, 0, 0, 0.6)"
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text:
          selectedOption === "expenseIncome"
            ? "Income and Expenses Overview"
            : "Debt Overview"
      }
    }
  };

  const chartDataActive = selectedOption === "expenseIncome" ? chartData : debtData;

  // Fetch dashboard data from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("Dashboard Data:", data);
          setTransactions(data.transactions);
          setIncome(data.income);
          setExpense(data.expense);
          setSavings(data.totalSavings);
          setTotalBudget(data.totalBudget);
          setDisplayedGoal(data.displayedGoal);
          setChartIncome(data.chartIncome);
          setChartExpense(data.chartExpense);
          setChartDebt(data.chartDebt);
        } else {
          setError("Failed to load data");
        }
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
        setError("Error fetching data");
      });
  }, []);

  useEffect(() => {
    if (selectedOption === "debt") {
      // Build debt chart data based on the selected time filter
      if (timeFilter === "12_months") {
        const labels = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        setCustomChartData({
          labels,
          datasets: [
            {
              label: "Debt",
              data: chartDebt,
              backgroundColor: "rgba(0, 0, 0, 0.6)"
            }
          ]
        });
      } else if (timeFilter === "6_months") {
        let earliestMonth = 13;
        // Use chartDebt data for six months
        const allLabels = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        // Find the earliest month that has a debt value (if any)
        chartDebt.forEach((val, index) => {
          if (val > 0 && index + 1 < earliestMonth) {
            earliestMonth = index + 1;
          }
        });
        if (earliestMonth === 13) earliestMonth = 1;
        const labels = allLabels.slice(earliestMonth - 1, earliestMonth - 1 + 6);
        const slicedDebt = chartDebt.slice(earliestMonth - 1, earliestMonth - 1 + 6);
        setCustomChartData({
          labels,
          datasets: [
            {
              label: "Debt",
              data: slicedDebt,
              backgroundColor: "rgba(0, 0, 0, 0.6)"
            }
          ]
        });
      } else if (timeFilter === "1_month") {
        // For one month, you might decide how to display debt data.
        // For example, showing daily totals for the current month:
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
        const dailyDebt = Array(daysInMonth).fill(0);
        transactions.forEach(t => {
          const [year, month, day] = t.date.split("-").map(Number);
          if (year === currentYear && month === currentMonth && t.type.toLowerCase() === "debt") {
            dailyDebt[day - 1] += parseFloat(t.amount.toString().replace(/[$,]/g, ""));
          }
        });
        const labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
        setCustomChartData({
          labels,
          datasets: [
            {
              label: "Debt",
              data: dailyDebt,
              backgroundColor: "rgba(0, 0, 0, 0.6)"
            }
          ]
        });
      }
    } else {
      // Original logic for Expense & Income
      if (timeFilter === "12_months") {
        const labels = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        setCustomChartData({
          labels,
          datasets: [
            {
              label: "Income",
              data: chartIncome,
              backgroundColor: "rgba(54, 162, 235, 0.6)"
            },
            {
              label: "Expenses",
              data: chartExpense,
              backgroundColor: "rgba(255, 99, 132, 0.6)"
            }
          ]
        });
      } else if (timeFilter === "6_months") {
        let earliestMonth = 13;
        const allData = [...incomes, ...expenses];
        allData.forEach(item => {
          const m = new Date(item.date).getMonth() + 1;
          if (m < earliestMonth) earliestMonth = m;
        });
        if (earliestMonth === 13) earliestMonth = 1;
        const allLabels = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        const labels = allLabels.slice(earliestMonth - 1, earliestMonth - 1 + 6);
        const slicedIncome = chartIncome.slice(earliestMonth - 1, earliestMonth - 1 + 6);
        const slicedExpense = chartExpense.slice(earliestMonth - 1, earliestMonth - 1 + 6);
        setCustomChartData({
          labels,
          datasets: [
            {
              label: "Income",
              data: slicedIncome,
              backgroundColor: "rgba(54, 162, 235, 0.6)"
            },
            {
              label: "Expenses",
              data: slicedExpense,
              backgroundColor: "rgba(255, 99, 132, 0.6)"
            }
          ]
        });
      } else if (timeFilter === "1_month") {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
        const dailyIncome = Array(daysInMonth).fill(0);
        const dailyExpense = Array(daysInMonth).fill(0);
        transactions.forEach(t => {
          const [year, month, day] = t.date.split("-").map(Number);
          if (year === currentYear && month === currentMonth) {
            const amt = parseFloat(t.amount.toString().replace(/[$,]/g, ""));
            if (t.type.toLowerCase() === "income") {
              dailyIncome[day - 1] += amt;
            } else {
              dailyExpense[day - 1] += amt;
            }
          }
        });
        const labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
        setCustomChartData({
          labels,
          datasets: [
            {
              label: "Income",
              data: dailyIncome,
              backgroundColor: "rgba(54, 162, 235, 0.6)"
            },
            {
              label: "Expenses",
              data: dailyExpense,
              backgroundColor: "rgba(255, 99, 132, 0.6)"
            }
          ]
        });
      }
    }
  }, [timeFilter, incomes, expenses, chartIncome, chartExpense, chartDebt, transactions, selectedOption]);
  

  const finalChartData = customChartData || chartDataActive;

  // Helper for category icons
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
        return <FaEllipsisH className="w-6 h-6 text-blue-600" />;
    }
  };

  // Pagination states for expense/income groups
  const [expensePage, setExpensePage] = useState(0);
  const [incomePage, setIncomePage] = useState(0);
  const itemsPerPage = 3;

  const groupAndSort = (data) => {
    return Object.entries(
      data.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = 0;
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

  const currentExpenses = groupedExpenses.slice(
    expensePage * itemsPerPage,
    (expensePage + 1) * itemsPerPage
  );
  const currentIncomes = groupedIncomes.slice(
    incomePage * itemsPerPage,
    (incomePage + 1) * itemsPerPage
  );

  const nextExpensePage = () => setExpensePage((prev) => (prev + 1) % expensePageCount);
  const prevExpensePage = () => setExpensePage((prev) => (prev - 1 + expensePageCount) % expensePageCount);
  const nextIncomePage = () => setIncomePage((prev) => (prev + 1) % incomePageCount);
  const prevIncomePage = () => setIncomePage((prev) => (prev - 1 + incomePageCount) % incomePageCount);

  const formattedBalance = user
    ? Number(user.userMoney).toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
      })
    : "$0.00";

  const formattedSavings = savings;
  const formattedBudget = totalBudget;
  const progress = (displayedGoal.currentAmount / displayedGoal.goalAmount) * 100 || 0;

  return (
    <div className="flex min-h-screen bg-bg-gray">
      {/* Navbar */}
      <div className={`lg:w-1/5 w-[300px] fixed lg:relative bg-dark-blue text-white h-full flex flex-col lg:top-0 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}></div>
      <div className={`lg:w-1/5 w-[300px] fixed bg-dark-blue text-white p-4 h-screen flex flex-col lg:top-0 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <button className="lg:hidden absolute top-4 right-4 text-white text-3xl" onClick={toggleSidebar}>
          &times;
        </button>
        <div className="text-center">
          <img src={compassLogo} alt="Compass Logo" className="mx-auto w-[150px]" />
          <h2 className="text-2xl mb-4">Cash Compass</h2>
        </div>
        <ul>
          <li>
            <a href="/" className="block py-2 px-4 rounded-md hover:bg-hl-blue hover:text-dark-blue">
              Dashboard
            </a>
          </li>
          <li>
            <a href="/forms" className="block py-2 px-4 rounded-md hover:bg-hl-blue hover:text-dark-blue">
              Forms
            </a>
          </li>
          <li>
            <a href="/history" className="block py-2 px-4 rounded-md hover:bg-hl-blue hover:text-dark-blue">
              History
            </a>
          </li>
          <li>
            <a href="/budget" className="block py-2 px-4 rounded-md hover:bg-hl-blue hover:text-dark-blue">
              Budgeting
            </a>
          </li>
        </ul>
        <div className="flex-grow" />
        <div className="mb-4">
          <ul>
            <li>
              <button onClick={handleLogout} className="w-full text-left block py-2 px-4 rounded-md hover:bg-hl-blue hover:text-dark-blue">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
      {/* Header and Dashboard Content */}
      <div className="flex-1 p-4 w-4/5 transition-all duration-300 ease-in-out min-h-[100vh]">
        <div className="flex justify-between border-b border-[#284b74] pb-5">
          <div className="flex items-center">
            <button className="lg:hidden p-2 text-black text-3xl md:text-4xl mr-3" onClick={toggleSidebar}>☰</button>
            <h1 className="text-dark-blue text-xl md:text-3xl">Dashboard</h1>
          </div>
          <div className="flex items-center">
            <h1 className="text-dark-blue text-2xl mr-4">{user ? user.fullName : "Guest"}</h1>
            <img
              className="h-12 w-auto rounded-full"
              src="https://tse1.mm.bing.net/th?id=OIP.cEvbluCvNFD_k4wC3k-_UwHaHa&pid=Api"
              alt="profile"
            />
          </div>
        </div>
        {/* Dashboard Sections */}
        <div className="flex flex-col custom-large:flex-row gap-4">
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              {/* Total Balance Box */}
              <div className="bg-white p-4 rounded-lg shadow-md h-[222px] w-full">
                <div className="flex flex-col gap-4">
                  <h1 className="text-xl text-dark-blue">Total Balance</h1>
                  <h1 className="font-bold text-3xl text-dark-blue">{formattedBalance}</h1>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <h1 className="text-xl text-dark-blue">Total Savings</h1>
                  <h1 className="font-bold text-3xl text-dark-blue">{formattedSavings}</h1>
                </div>
              </div>
              {/* Goals and Savings Box */}
              <div className="bg-white p-4 rounded-lg shadow-md h-[222px] w-full space-y-2">
                <div className="flex justify-between items-center">
                  <h1 className="text-xl text-dark-blue">Goals</h1>
                  <a className="text-blue-400 hover:underline" href="/budget">
                    View all
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <TbTargetArrow className="text-red-600 w-16 h-16" />
                  <div className="flex flex-col w-full">
                    <h1 className="text-xl text-dark-blue">{displayedGoal.title}</h1>
                    <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                      <div className="bg-green-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span className="text-sm text-gray-600 mt-1">{progress.toFixed(1)}% Completed</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h1 className="text-xl text-dark-blue">Total Monthly Budget</h1>
                  <h1 className="text-dark-blue text-2xl font-bold">{formattedBudget}</h1>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
              <div className="flex justify-between items-center mb-4">
                <select
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="expenseIncome">Expense & Income</option>
                  <option value="debt">Debt</option>
                </select>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="1_month">1 Month</option>
                  <option value="6_months">6 Months</option>
                  <option value="12_months">12 Months</option>
                </select>
              </div>
              <Bar data={finalChartData} options={chartOptions} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Spending Overview Section */}
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
                <div className="space-y-3">
                  {currentExpenses.map(([category, total]) => (
                    <div key={category} className="flex flex-col">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{category}</span>
                        <span className="text-gray-600">{((total / totalExpenses) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div className="bg-green-500 h-4 rounded-full transition-all duration-500" style={{ width: `${(total / totalExpenses) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Earnings Overview Section */}
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
                        <div className="bg-green-500 h-4 rounded-full transition-all duration-500" style={{ width: `${(total / totalIncomes) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Recent Transactions Section */}
          <div className="w-full height-full custom-large:w-[400px] bg-white rounded-lg shadow-md p-4 mt-4">
            <h2 className="text-xl font-semibold mb-4 text-dark-blue">Recent Transactions</h2>
            <div className="space-y-4 max-h-full overflow-y-auto">
              {transactions.slice(0, 10).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    {getCategoryIcon(transaction.category)}
                    <div>
                      <p className="font-medium">{transaction.category}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {transaction.type === "income" ? "+" : ""}
                    {transaction.amount}
                  </span>
                </div>
              ))}
            </div>
            <a className="text-blue-400 hover:underline" href="/history">
              View all
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
