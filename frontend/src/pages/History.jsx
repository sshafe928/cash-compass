import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import compassLogo from "../assets/images/compassLogo.png";
import { AiOutlineArrowUp, AiOutlineArrowDown, AiOutlineCreditCard } from "react-icons/ai";
import { GiPiggyBank } from "react-icons/gi";

const History = () => {
  // Sidebar and header state
  const [isOpen, setIsOpen] = useState(false);
  // User state (pulled from localStorage)
  const [user, setUser] = useState(null);
  
  // Transaction data state (fetched from backend)
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  // Filter states
  const [dateRange, setDateRange] = useState("1_week"); // "1_week", "1_month", "6_months", "12_months"
  const [specificDate, setSpecificDate] = useState(""); // for the date input (optional)
  const [typeFilter, setTypeFilter] = useState(""); // "income", "expense", "saving", "debt"
  const [categoryList, setCategoryList] = useState([]); // list of categories based on type
  const [categoryFilter, setCategoryFilter] = useState(""); // selected category value
  const [amountRange, setAmountRange] = useState(""); // e.g., "50_99", "100_299", etc.
  const [searchText, setSearchText] = useState("");
  
  // Filtered transactions (derived from transactions + filter states)
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // Pre-defined categories for each type
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
    "Goals"
  ];

  // Toggle sidebar
  const toggleSidebar = () => setIsOpen(!isOpen);

  // On mount, load user from localStorage and fetch transaction data
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Fetch transactions from backend (include token if needed)
    fetch("http://localhost:5000/api/history", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTransactions(data.transactions);
        } else {
          setError("Failed to load data");
        }
      })
      .catch((err) => {
        console.error("Error fetching transactions:", err);
        setError("Error fetching data");
      });
  }, []);

  // When any filter changes or transactions change, update the filtered list.
  useEffect(() => {
    const now = new Date();
    let cutoff;
    if (dateRange === "1_week") {
      cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (dateRange === "1_month") {
      cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (dateRange === "6_months") {
      cutoff = new Date(now.getTime() - 182 * 24 * 60 * 60 * 1000);
    } else if (dateRange === "12_months") {
      cutoff = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    }

    const filtered = transactions.filter((txn) => {
      const txnDate = new Date(txn.date);
      // Date range filter
      if (cutoff && txnDate < cutoff) return false;
      // Specific date filter (if set)
      if (specificDate && txn.date !== specificDate) return false;
      // Type filter
      if (typeFilter && txn.type.toLowerCase() !== typeFilter.toLowerCase()) return false;
      // Category filter
      if (categoryFilter && txn.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
      // Amount range filter
      if (amountRange) {
        const [min, max] = amountRange.split("_").map(Number);
        if (txn.amount < min || txn.amount > max) return false;
      }
      // Search text filter (search in description, category, or type)
      if (searchText) {
        const lowerSearch = searchText.toLowerCase();
        if (
          !txn.description.toLowerCase().includes(lowerSearch) &&
          !txn.category.toLowerCase().includes(lowerSearch) &&
          !txn.type.toLowerCase().includes(lowerSearch)
        ) {
          return false;
        }
      }
      return true;
    });
    setFilteredTransactions(filtered);
  }, [transactions, dateRange, specificDate, typeFilter, categoryFilter, amountRange, searchText]);

  // When type filter changes, update the category list accordingly
  const handleTypeChange = (value) => {
    setTypeFilter(value);
    if (value === "income") {
      setCategoryList(incomeCategories);
    } else if (value === "expense") {
      setCategoryList(expenseCategories);
    } else if (value === "saving") {
      setCategoryList(savingCategories);
    } else if (value === "debt") {
      setCategoryList(debtCategories);
    } else {
      setCategoryList([]);
    }
    // Reset the selected category when type changes
    setCategoryFilter("");
  };

  // Type icons
  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case "expense":
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full text-white">
            <AiOutlineArrowDown size={18} />
          </div>
        );
      case "income":
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full text-white">
            <AiOutlineArrowUp size={18} />
          </div>
        );
      case "saving":
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-white">
            <GiPiggyBank size={18} />
          </div>
        );
      case "debt":
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-yellow-500 rounded-full text-white">
            <AiOutlineCreditCard size={18} />
          </div>
        );
      default:
        return <div></div>;
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-bg-gray">
        {/* Navbar */}
        <div
          className={`lg:w-1/5 w-[300px] fixed z-20 lg:relative bg-dark-blue text-white h-full flex flex-col lg:top-0 transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        ></div>
        <div
          className={`lg:w-1/5 w-[300px] fixed z-20 bg-dark-blue text-white p-4 h-screen flex flex-col lg:top-0 transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <button
            className="lg:hidden absolute top-4 right-4 text-white text-3xl"
            onClick={() => setIsOpen(!isOpen)}
          >
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
                <a href="/" className="block py-2 px-4 rounded-md hover:bg-hl-blue hover:text-dark-blue">
                  Profile
                </a>
              </li>
              <li>
                <a href="/" className="block py-2 px-4 rounded-md hover:bg-hl-blue hover:text-dark-blue">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 p-4 w-4/5 transition-all duration-300 ease-in-out min-h-[100vh]">
          {/* Header */}
          <div className="flex justify-between border-b border-[#284b74] pb-5">
            <div className="flex items-center">
              <button
                className="lg:hidden p-2 text-black text-3xl md:text-4xl mr-3"
                onClick={() => setIsOpen(!isOpen)}
              >
                ☰
              </button>
              <h1 className="text-dark-blue text-xl md:text-3xl">History</h1>
            </div>
            <div className="flex items-center">
              <h1 className="text-dark-blue text-2xl mr-4">
                {user ? user.fullName : "Guest"}
              </h1>
              <img
                className="h-12 w-auto rounded-full"
                src="https://tse1.mm.bing.net/th?id=OIP.cEvbluCvNFD_k4wC3k-_UwHaHa&pid=Api"
                alt="profile"
              />
            </div>
          </div>
          {/* Filter Section */}
          <div className="flex flex-col gap-4 my-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex rounded-lg border border-dark-blue overflow-hidden shadow-md h-10">
                <select
                  className="bg-white p-2 text-dark-blue font-semibold text-sm focus:outline-none"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="1_week">Last 7 Days</option>
                  <option value="1_month">Last Month</option>
                  <option value="6_months">Last 6 Months</option>
                  <option value="12_months">Last 12 Months</option>
                </select>
                <input
                  className="bg-white text-dark-blue font-semibold text-sm px-2 border-l border-dark-blue focus:outline-none"
                  type="date"
                  value={specificDate}
                  onChange={(e) => setSpecificDate(e.target.value)}
                />
              </div>
              <div className="flex rounded-lg border border-dark-blue overflow-hidden shadow-md h-10">
                <select
                  className="bg-white p-2 text-dark-blue font-semibold text-sm focus:outline-none border-r border-dark-blue"
                  value={typeFilter}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  required
                >
                  <option value="" hidden>
                    Type
                  </option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                  <option value="saving">Saving</option>
                  <option value="debt">Debt</option>
                </select>
                {typeFilter && (
                  <select
                    className="bg-white p-2 text-dark-blue font-semibold text-sm focus:outline-none border-r border-dark-blue w-[150px] truncate"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    required
                  >
                    <option value="" hidden>
                      Category
                    </option>
                    {categoryList.map((item) => (
                      <option key={item} value={item.toLowerCase()}>
                        {item}
                      </option>
                    ))}
                  </select>
                )}
                <select
                  className="bg-white p-2 text-dark-blue font-semibold text-sm focus:outline-none"
                  value={amountRange}
                  onChange={(e) => setAmountRange(e.target.value)}
                  required
                >
                  <option value="" hidden>
                    Amount
                  </option>
                  <option value="50_99">50 - 99</option>
                  <option value="100_299">100 - 299</option>
                  <option value="300_599">300 - 599</option>
                  <option value="600_999">600 - 999</option>
                  <option value="1000_1999">1000 - 2499</option>
                  <option value="2000_2999">2500 - 4999</option>
                  <option value="3000_3999">5000+</option>
                </select>
              </div>
              <div className="flex overflow-hidden shadow-md">
                <div className="relative z-10 w-fit h-fit">
                  <button
                    className="absolute right-1 w-10 h-10 flex items-center justify-center text-dark-blue cursor-pointer"
                    onClick={() => {}}
                  >
                    <FaSearch size={20} />
                  </button>
                  <input
                    type="text"
                    className={`h-10 border border-dark-blue text-dark-blue font-semibold text-sm px-4 pr-12 rounded-lg transition-all duration-500 ease-in-out bg-white placeholder-gray-700`}
                    placeholder="Type to Search..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex rounded-lg border border-dark-blue shadow-md overflow-hidden h-10">
                <button className="bg-white text-dark-blue w-24 font-semibold hover:bg-gray-200">
                  Search
                </button>
              </div>
            </div>
            {/* End Filter Section */}
            {/* Table Section */}
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
                  {filteredTransactions.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-dark-blue text-sm flex items-center gap-4">
                        {getTypeIcon(item.type)}
                        <div className="flex flex-col sm:hidden">
                          <p>{item.type}</p>
                          <p className="text-[11px]">{item.date}</p>
                        </div>
                        <div className="hidden sm:block">{item.type}</div>
                      </td>
                      <td className={`px-4 py-2 ${
                        item.type.toLowerCase() === "saving" && item.category.toLowerCase() === "out"
                          ? "text-red-500"
                          : item.type.toLowerCase() === "expense"
                          ? "text-red-500"
                          : "text-green-500"
                      } text-sm`}>
                        {item.type.toLowerCase() === "income" ? '+' : ''}
                        {item.formattedAmount}
                      </td>
                      <td className="px-4 py-2 text-dark-blue text-sm">{item.category}</td>
                      <td className="px-4 py-4 text-dark-blue text-sm hidden sm:table-cell">{item.date}</td>
                      <td className="px-4 py-2 text-dark-blue text-sm hidden md:table-cell truncate overflow-hidden max-w-[150px] lg:max-w-[250px]" title={item.description}>
                        {item.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap gap-4 bg-white border border-dark-blue rounded-lg p-8 mt-10">
              <div className="flex items-center gap-2">
                <div className="w-[30px] h-[15px] bg-green-500 rounded-full"></div>
                <p className="font-semibold text-sm text-gray-900">
                  Indicates income, paying off debt, or setting aside money for savings.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-[30px] h-[15px] bg-red-500 rounded-full"></div>
                <p className="font-semibold text-sm text-gray-900">
                  Indicates expenses or taking money out of savings.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-[30px] h-[15px] bg-yellow-500 rounded-full"></div>
                <p className="font-semibold text-sm text-gray-900">
                  Indicates adding to your debt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default History;
