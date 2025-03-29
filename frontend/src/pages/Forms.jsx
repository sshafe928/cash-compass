import React, { useState, useEffect } from "react";
import { IoReturnDownBack } from "react-icons/io5";
import compassLogo from "../assets/images/compassLogo.png";
import { FaHome, FaCar, FaHeartbeat, FaGraduationCap, FaCreditCard, FaUser, FaBriefcase, FaFileInvoiceDollar } from "react-icons/fa";
import axios from "axios";

const Forms = () => {
  // For display purposes only
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [formActive, setFormActive] = useState(false);
  const [error, setError] = useState(null);
  const [submitMessage, setSubmitMessage] = useState(""); // For submission feedback
  const [totalSavings, setTotalSavings] = useState(0);
  const [savingItems, setSavingItems] = useState([]);
  const [debtItems, setDebtItems] = useState([]);
  
  // For income/expense form reuse
  const [category, setCategory] = useState("Employment");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  
  // Separate state for savings form category selection
  const [savingsCategory, setSavingsCategory] = useState("");
  const [transaction, setTransaction] = useState(""); // "In" or "Out" for savings

  function handleOption(variable) {
    if (variable) {
      setSelectedOption(variable);
      setFormActive(true);
      setSubmitMessage(""); // clear any previous messages
      // Reset form fields (optional)
      setDate("");
      setAmount(0);
      setDescription("");
      if(variable === "savings") {
        setSavingsCategory(""); // clear previous savings category
        setTransaction("");
      }
    }
  }

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    fetch("http://localhost:5000/api/forms", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("Forms Data:", data);
          setTotalSavings(data.totalSavings);
          setSavingItems(data.savingItems);
          setDebtItems(data.debtItems);
        } else {
          setError("Failed to load data");
        }
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
        setError("Error fetching data");
      });
  }, []);

  const handleIncomeSubmit = (e) => {
    e.preventDefault();
    const where = category;
    const entryDate = date;
    const entryAmount = Number(amount);
    const notes = description;
    const dataObj = {
      category: "Income",
      where,
      entryDate,
      entryAmount,
      notes
    };

    console.log("Submitting income payload:", { type: "income", data: dataObj });
    
    axios
    .post("http://localhost:5000/api/forms", { type: "income", data: dataObj }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then((response) => {
        setSubmitMessage("Income submitted successfully!");
        if (response.data.updatedUserMoney) {
          const updatedUser = { ...user, userMoney: response.data.updatedUserMoney };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        console.log("Income submitted successfully:", response.data);
      })      
    .catch((error) => {
      setSubmitMessage("Error submitting income: " + error.message);
      console.error("There was an error submitting the income:", error);
    });  
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    const where = category;
    const entryDate = date;
    const entryAmount = Number(amount);
    const notes = description;
    const dataObj = {
      category: "Expense",
      where,
      entryDate,
      entryAmount,
      notes
    };
  
    axios
      .post("http://localhost:5000/api/forms", { type: "expense", data: dataObj }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then((response) => {
        setSubmitMessage("Expense submitted successfully!");
        if (response.data.updatedUserMoney) {
          const updatedUser = { ...user, userMoney: response.data.updatedUserMoney };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        console.log("Expense submitted successfully:", response.data);
      })
      .catch((error) => {
        setSubmitMessage("Error submitting expense: " + error.message);
        console.error("There was an error submitting the expense:", error);
      });
  };
  

  const handleSavingsSubmit = (e) => {
    e.preventDefault();
    const entryDate = date;
    let entryAmount = Number(amount);
    const notes = description;
  
    // Normalize transaction type to lowercase
    const where = transaction.toLowerCase(); // expects "in" for deposits, "out" for withdrawals
  
    if (where === "out") {
      entryAmount = -Math.abs(entryAmount);
    }
  
    // Determine if it's a goal update or a direct savings record:
    let cat;
    let whereField;
    if (savingsCategory && savingsCategory !== "Savings") {
      cat = "Goals";
      whereField = savingsCategory; // Use the goal title
    } else {
      cat = "Saving";
      whereField = where; // "in" or "out"
    }
  
    const dataObj = {
      category: cat,
      where: whereField,
      entryDate,
      entryAmount,
      notes
    };
  
    axios
      .post("http://localhost:5000/api/forms", { type: "savings", data: dataObj }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then((response) => {
        setSubmitMessage("Savings submitted successfully!");
        console.log("Savings submitted successfully:", response.data);
      })
      .catch((error) => {
        setSubmitMessage("Error submitting savings: " + error.message);
        console.error("There was an error submitting the savings:", error);
      });
  };
  

  const handleDebtSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const debtCategory = form["debt-type"].value;
    const debtAction = form["debt-action"].value;
    const debtDate = form["debt-date"].value;
    const debtAmount = Number(form["debt-amount"].value);
    const debtDescription = form["description"].value;

    const dataObj = {
      type: "debt",
      debtCategory,
      debtAction,
      debtDate,
      debtAmount,
      debtDescription
    };

    axios
      .post("http://localhost:5000/api/forms", { type: "debt", data: dataObj }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then((response) => {
        setSubmitMessage("Debt submitted successfully!");
        console.log("Debt submitted successfully:", response.data);
      })
      .catch((error) => {
        setSubmitMessage("Error submitting debt: " + error.message);
        console.error("There was an error submitting the debt:", error);
      });
  };

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
            <a href="/" className="block py-2 px-4 rounded-md hover:bg-hl-blue hover:text-dark-blue">Dashboard</a>
          </li>
          <li>
            <a href="/forms" className="block py-2 px-4 rounded-md hover:bg-hl-blue hover:text-dark-blue">Forms</a>
          </li>
          <li>
            <a href="/history" className="block py-2 px-4 rounded-md hover:bg-hl-blue hover:text-dark-blue">History</a>
          </li>
          <li>
            <a href="/budget" className="block py-2 px-4 rounded-md hover:bg-hl-blue hover:text-dark-blue">Budgeting</a>
          </li>
        </ul>
        <div className="flex-grow" />
        <div className="mb-4">
          <ul>
            <li>
              <a href="/" className="block py-2 px-4 rounded-md hover:bg-hl-blue hover:text-dark-blue">Profile</a>
            </li>
            <li>
              <a href="/" className="block py-2 px-4 rounded-md hover:bg-hl-blue hover:text-dark-blue">Logout</a>
            </li>
          </ul>
        </div>
      </div>
      {/* Header and Forms */}
      <div className="flex-1 p-4 w-4/5 transition-all duration-300 ease-in-out min-h-[100vh]">
        <div className="flex justify-between border-b border-[#284b74] pb-5">
          <div className="flex items-center">
            <button className="lg:hidden p-2 text-black text-3xl md:text-4xl mr-3" onClick={toggleSidebar}>☰</button>
            <h1 className="text-dark-blue text-xl md:text-3xl">Forms</h1>
          </div>
          <div className="flex items-center">
            <h1 className="text-dark-blue text-2xl mr-4">{user ? user.fullName : "Guest"}</h1>
            <img className="h-12 w-auto rounded-full" src="https://tse1.mm.bing.net/th?id=OIP.cEvbluCvNFD_k4wC3k-_UwHaHa&pid=Api" alt="profile" />
          </div>
        </div>
        {/* Display Submission Message */}
        {submitMessage && (
          <div className="my-4 p-2 bg-green-100 text-green-800 text-center rounded-md">
            {submitMessage}
          </div>
        )}
        {/* Main Content */}
        {!formActive && (
          <div className="flex flex-col justify-between mx-auto mt-20 gap-10 md:gap-20">
            <div className="flex md:flex-row flex-col gap-10 md:gap-20 mx-auto">
              <button className="bg-[url(../assets/images/incomeMobile2.png)] md:bg-[url(../assets/images/income.png)] bg-cover w-[300px] h-[150px] md:h-[250px] lg:w-[350px] rounded-2xl flex shadow-md hover:shadow-lg transition-shadow duration-200" onClick={() => handleOption("income")}>
                <h1 className="text-4xl ml-8 mt-6 text-dark-blue">Income</h1>
              </button>
              <button className="bg-[url(../assets/images/expenseMobile.png)] md:bg-[url(../assets/images/expense.png)] bg-cover w-[300px] h-[150px] md:h-[250px] lg:w-[350px] rounded-2xl flex shadow-md hover:shadow-lg transition-shadow duration-200" onClick={() => handleOption("expense")}>
                <h1 className="text-4xl ml-8 mt-6 text-dark-blue">Expense</h1>
              </button>
            </div>
            <div className="flex md:flex-row flex-col gap-10 md:gap-20 mx-auto">
              <button className="bg-[url(../assets/images/savingsMobile.png)] md:bg-[url(../assets/images/savings2.png)] bg-cover w-[300px] h-[150px] md:h-[250px] lg:w-[350px] rounded-2xl flex shadow-md hover:shadow-lg transition-shadow duration-200" onClick={() => handleOption("savings")}>
                <h1 className="text-4xl ml-8 mt-6 text-dark-blue">Savings</h1>
              </button>
              <button className="bg-[url(../assets/images/debtMobile.png)] md:bg-[url(../assets/images/debt2.png)] bg-cover w-[300px] h-[150px] md:h-[250px] lg:w-[350px] rounded-2xl flex shadow-md hover:shadow-lg transition-shadow duration-200" onClick={() => handleOption("debt")}>
                <h1 className="text-4xl ml-8 mt-6 text-dark-blue">Debt</h1>
              </button>
            </div>
          </div>
        )}
        {/* Income Form */}
        {selectedOption === "income" && formActive && (
          <form className="rounded-2xl bg-white max-w-[800px] min-h-[600px] border border-[#284b74] mx-auto p-4 mt-8" onSubmit={handleIncomeSubmit}>
            <button className="text-gray flex items-center hover:text-dark-blue" onClick={() => setFormActive(false)}>
              <IoReturnDownBack className="w-6 h-6" />
            </button>
            <div className="text-center flex flex-col w-5/6 mx-auto">
              <h1 className="text-dark-blue text-xl md:text-3xl mt-6">Income</h1>
              <div className="flex flex-col mt-2">
                <label className="text-left text-md text-gray-700 font-medium" htmlFor="income-source">
                  Category
                </label>
                <select value={category} className="p-2 border border-gray-300 rounded-md text-gray-900 w-full mx-auto focus:outline-none focus:ring-1 focus:ring-[#284b74]" onChange={(e) => setCategory(e.target.value)} required>
                  <option value="Employment">Employment (Salary/Bonus/Freelance)</option>
                  <option value="Investments">Investments (Interest/Dividends)</option>
                  <option value="Gifts">Gifts</option>
                  <option value="Government">Government (Benefits/Assistance)</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex justify-between w-full mx-auto mt-6">
                <div className="flex flex-col w-3/6 mr-2">
                  <label className="text-left text-md text-gray-700 font-medium" htmlFor="income-date">Date</label>
                  <input className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" type="date" onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="flex flex-col w-3/6 ml-2">
                  <label className="text-left text-md text-gray-700 font-medium" htmlFor="income-amount">Amount</label>
                  <input className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" type="number" placeholder="$" onChange={(e) => setAmount(e.target.value)} required />
                </div>
              </div>
              <div className="flex flex-col mt-6">
                <label className="text-left text-md text-gray-700 font-medium" htmlFor="description">Description</label>
                <textarea className="p-2 border border-gray-300 rounded-md text-gray-900 w-full h-[150px] resize-none focus:outline-none focus:ring-1 focus:ring-[#284b74]" name="description" id="description" placeholder="Description..." onChange={(e) => setDescription(e.target.value)} required></textarea>
              </div>
              <button className="mt-6 p-2 rounded-md text-white w-full bg-dark-blue mx-auto hover:bg-hl-blue hover:text-dark-blue">Submit Transaction</button>
            </div>
          </form>
        )}
        {/* Expense Form */}
        {selectedOption === "expense" && formActive && (
          <form className="rounded-2xl bg-white max-w-[800px] min-h-[600px] border border-[#284b74] mx-auto p-4 mt-8" onSubmit={handleExpenseSubmit}>
            <button className="text-gray flex items-center hover:text-dark-blue" onClick={() => setFormActive(false)}>
              <IoReturnDownBack className="w-6 h-6" />
            </button>
            <div className="text-center flex flex-col w-5/6 mx-auto">
              <h1 className="text-dark-blue text-xl md:text-3xl mt-6">Expense</h1>
              <div className="flex flex-col mt-2">
                <label className="text-left text-md text-gray-700 font-medium" htmlFor="expense-category">Category</label>
                <select className="p-2 border border-gray-300 rounded-md text-gray-900 w-full mx-auto focus:outline-none focus:ring-1 focus:ring-[#284b74]" onChange={(e) => setCategory(e.target.value)} required>
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
              <div className="flex justify-between w-full mx-auto mt-6">
                <div className="flex flex-col w-3/6 mr-2">
                  <label className="text-left text-md text-gray-700 font-medium" htmlFor="expense-date">Date</label>
                  <input className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" type="date" onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="flex flex-col w-3/6 ml-2">
                  <label className="text-left text-md text-gray-700 font-medium" htmlFor="expense-amount">Amount</label>
                  <input className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" type="number" placeholder="$" onChange={(e) => setAmount(e.target.value)} required />
                </div>
              </div>
              <div className="flex flex-col mt-6">
                <label className="text-left text-md text-gray-700 font-medium" htmlFor="description">Description</label>
                <textarea className="p-2 border border-gray-300 rounded-md text-gray-900 w-full h-[150px] resize-none focus:outline-none focus:ring-1 focus:ring-[#284b74]" name="description" id="description" placeholder="Description..." onChange={(e) => setDescription(e.target.value)} required></textarea>
              </div>
              <button className="mt-6 p-2 rounded-md text-white w-full bg-dark-blue mx-auto hover:bg-hl-blue hover:text-dark-blue">Submit Transaction</button>
            </div>
          </form>
        )}
        {/* Savings Form */}
        {selectedOption === "savings" && formActive && (
          <form className="rounded-2xl bg-white max-w-[800px] min-h-[600px] border border-[#284b74] mx-auto p-4 mt-8" onSubmit={handleSavingsSubmit}>
            <button className="text-gray flex items-center hover:text-dark-blue" onClick={() => setFormActive(false)}>
              <IoReturnDownBack className="w-6 h-6" />
            </button>
            <div className="text-center flex flex-col w-5/6 mx-auto mb-4">
              <h1 className="text-dark-blue text-xl md:text-3xl mt-6">Savings</h1>
              {/* Savings Category Dropdown */}
              <div className="flex flex-col mt-2">
                <label className="text-left text-md text-gray-700 font-medium" htmlFor="savings-category">Savings Category</label>
                <select className="p-2 border border-gray-300 rounded-md text-gray-900 w-full mx-auto focus:outline-none focus:ring-1 focus:ring-[#284b74]" value={savingsCategory} onChange={(e) => setSavingsCategory(e.target.value)} required>
                  <option value="">Select a Goal or Savings Account</option>
                  <option value="Savings">Direct Savings</option>
                  {savingItems.map((item) => (
                    <option key={item.title} value={item.title}>
                      {item.title} - ${item.currentAmount}/{item.goalAmount}
                    </option>
                  ))}
                </select>
              </div>
              {/* Transaction Type Dropdown */}
              <div className="flex flex-col mt-6">
                <label className="text-left text-md text-gray-700 font-medium" htmlFor="savings-transaction">Transaction Type</label>
                <select className="p-2 border border-gray-300 rounded-md text-gray-900 w-full mx-auto focus:outline-none focus:ring-1 focus:ring-[#284b74]" onChange={(e) => setTransaction(e.target.value)} required>
                  <option value="">Select Transaction Type</option>
                  <option value="In">Into Savings/Goal</option>
                  <option value="Out">Out of Savings/Goal</option>
                </select>
              </div>
              <div className="flex justify-between w-full mx-auto mt-6">
                <div className="flex flex-col w-3/6 mr-2">
                  <label className="text-left text-md text-gray-700 font-medium" htmlFor="savings-date">Date</label>
                  <input className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" type="date" onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="flex flex-col w-3/6 ml-2">
                  <label className="text-left text-md text-gray-700 font-medium" htmlFor="savings-amount">Amount</label>
                  <input className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" type="number" placeholder="$" onChange={(e) => setAmount(e.target.value)} required />
                </div>
              </div>
              <div className="flex flex-col mt-6">
                <label className="text-left text-md text-gray-700 font-medium" htmlFor="description">Description</label>
                <textarea className="p-2 border border-gray-300 rounded-md text-gray-900 w-full h-[150px] resize-none focus:outline-none focus:ring-1 focus:ring-[#284b74]" name="description" id="description" placeholder="Description..." onChange={(e) => setDescription(e.target.value)} required></textarea>
              </div>
              <button className="my-6 p-2 rounded-md text-white w-full bg-dark-blue mx-auto hover:bg-hl-blue hover:text-dark-blue">Submit Transaction</button>
            </div>
          </form>
        )}
        {/* Debt Form */}
        {selectedOption === "debt" && formActive && (
        <form
            className="rounded-2xl bg-white max-w-[800px] min-h-[600px] border border-[#284b74] mx-auto p-4 mt-8"
            onSubmit={handleDebtSubmit}
        >
            <button
            className="text-gray flex items-center hover:text-dark-blue"
            onClick={() => setFormActive(false)}
            >
            <IoReturnDownBack className="w-6 h-6" />
            </button>
            <div className="text-center flex flex-col w-5/6 mx-auto mb-4">
            <h1 className="text-dark-blue text-xl md:text-3xl mt-6">Debt</h1>
            {/* Debt Category Dropdown */}
            <div className="flex flex-col mt-2">
                <label
                className="text-left text-md text-gray-700 font-medium"
                htmlFor="debt-type"
                >
                Debt Category
                </label>
                <select
                name="debt-type"
                id="debt-type"
                className="p-2 border border-gray-300 rounded-md text-gray-900 w-full mx-auto focus:outline-none focus:ring-1 focus:ring-[#284b74]"
                required
                >
                {debtItems.length > 0 ? (
                    debtItems.map((item) => (
                    <option key={item.title} value={item.title}>
                        {item.title} - ${item.currentAmount}
                    </option>
                    ))
                ) : (
                    <option value="General Debt">General Debt</option>
                )}
                </select>
            </div>
            {/* Debt Action Dropdown */}
            <div className="flex flex-col mt-6">
                <label
                className="text-left text-md text-gray-700 font-medium"
                htmlFor="debt-action"
                >
                Debt Action
                </label>
                <select
                name="debt-action"
                id="debt-action"
                className="p-2 border border-gray-300 rounded-md text-gray-900 w-full mx-auto focus:outline-none focus:ring-1 focus:ring-[#284b74]"
                required
                >
                <option value="Adding">Adding to Debt</option>
                <option value="Paying">Paying off Debt</option>
                </select>
            </div>
            <div className="flex justify-between w-full mx-auto mt-6">
                <div className="flex flex-col w-3/6 mr-2">
                <label
                    className="text-left text-md text-gray-700 font-medium"
                    htmlFor="debt-date"
                >
                    Date
                </label>
                <input
                    name="debt-date"
                    id="debt-date"
                    className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]"
                    type="date"
                    required
                />
                </div>
                <div className="flex flex-col w-3/6 ml-2">
                <label
                    className="text-left text-md text-gray-700 font-medium"
                    htmlFor="debt-amount"
                >
                    Amount
                </label>
                <input
                    name="debt-amount"
                    id="debt-amount"
                    className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]"
                    type="number"
                    placeholder="$"
                    required
                />
                </div>
            </div>
            <div className="flex flex-col mt-6">
                <label
                className="text-left text-md text-gray-700 font-medium"
                htmlFor="description"
                >
                Description
                </label>
                <textarea
                className="p-2 border border-gray-300 rounded-md text-gray-900 w-full h-[150px] resize-none focus:outline-none focus:ring-1 focus:ring-[#284b74]"
                name="description"
                id="description"
                placeholder="Description..."
                required
                ></textarea>
            </div>
            <button className="my-6 p-2 rounded-md text-white w-full bg-dark-blue mx-auto hover:bg-hl-blue hover:text-dark-blue">
                Submit Transaction
            </button>
            </div>
        </form>
        )}

      </div>
    </div>
  );
};

export default Forms;
