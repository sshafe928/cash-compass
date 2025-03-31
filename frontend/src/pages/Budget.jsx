import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import compassLogo from "../assets/images/compassLogo.png";
import { IoReturnDownBack } from "react-icons/io5";
import { FiEdit3 } from "react-icons/fi";
import { 
  FaHome, 
  FaEllipsisH, 
  FaShoppingBasket, 
  FaCar, 
  FaHeartbeat, 
  FaFilm, 
  FaGift, 
  FaBook, 
  FaUtensils, 
  FaGraduationCap, 
  FaCreditCard, 
  FaUser, 
  FaBriefcase, 
  FaFileInvoiceDollar, 
  FaMoneyBillWave,
  FaUniversity,
  FaLandmark
} from "react-icons/fa";
import Speedometer from "../components/Speedometer";
import { TbTargetArrow } from "react-icons/tb";

const toLocalISODate = (date) => {
  const tzOff = new Date().getTimezoneOffset() * 60000;
  return new Date(new Date(date) - tzOff).toISOString().split("T")[0];
};

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

const Budget = () => {
  const navigate = useNavigate();

  // Added user state for logout and user info
  const [user, setUser] = useState(null);
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

  const [isVisible, setIsVisible] = useState(false);
  const [threshold, setThreshold] = useState(0.4);
  const speedometerRef = useRef(null);
  const [budgetItems, setBudgetItems] = useState([]);
  const [savingItems, setSavingItems] = useState([]);
  const [debtItems, setDebtItems] = useState([]);
  const [Error, setError] = useState("");

  // Modals and selected goal states
  const [formActive, setFormActive] = useState(false);
  const [goalFormActive, setGoalFormActive] = useState(false);
  const [selectedGoalCategory, setSelectedGoalCategory] = useState(null);

  // State for new goal
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDate, setNewGoalDate] = useState("");
  const [newGoalAmount, setNewGoalAmount] = useState("");

  // States for updating goal
  const [updatedGoalTitle, setUpdatedGoalTitle] = useState("");
  const [updatedGoalDate, setUpdatedGoalDate] = useState("");
  const [updatedGoalAmount, setUpdatedGoalAmount] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  // Icon mapping for budget items
  const iconMap = {
    "FaHome": FaHome,
    "FaHeartbeat": FaHeartbeat,
    "FaCar": FaCar,
    "FaShoppingBasket": FaShoppingBasket,
    "FaFilm": FaFilm,
    "FaGift": FaGift,
    "FaUtensils": FaUtensils,
    "FaBook": FaBook,
    "FaEllipsisH": FaEllipsisH,
    "FaGraduationCap": FaGraduationCap,
    "FaCreditCard": FaCreditCard,
    "FaUser": FaUser,
    "FaBriefcase": FaBriefcase,
    "FaFileInvoiceDollar": FaFileInvoiceDollar,
  };

  // Dedicated mapping for debt items based on title
  const debtIconMap = {
    "General Debt": FaFileInvoiceDollar,
    "Government": FaLandmark,
    "Living": FaHome,
    "Transportation": FaCar,
    "Healthcare": FaHeartbeat,
    "Groceries": FaShoppingBasket,
    "Restaurant": FaUtensils,
    "Entertainment": FaFilm,
    "Education": FaGraduationCap,
    "Gifts": FaGift,
    "Other": FaEllipsisH,
  };

  // Dedicated mapping for debt colors
  const debtColorMap = {
    "General Debt": "text-gray-700",
    "Government": "text-blue-600",
    "Living": "text-gray-500",
    "Transportation": "text-yellow-500",
    "Healthcare": "text-red-500",
    "Groceries": "text-green-500",
    "Restaurant": "text-red-400",
    "Entertainment": "text-purple-500",
    "Education": "text-orange-500",
    "Gifts": "text-pink-500",
    "Other": "text-blue-600",
  };

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

  useEffect(() => {
    fetch('http://localhost:5000/api/budget', {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSavingItems(data.savingItems);
          setBudgetItems(data.budgetItems);
          setDebtItems(data.debtItems);
        } else {
          setError('Failed to load data');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      });
  }, []);

  const totalDebt = debtItems?.reduce((sum, item) => sum + item.currentAmount, 0) || 0;
  const formattedTotalDebt = totalDebt.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Goal Handlers
  const handleGoalSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/budget/goals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        title: newGoalTitle,
        goalDate: newGoalDate,
        goalAmount: Number(newGoalAmount),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const formattedGoal = {
            id: data.goal._id.toString(),
            title: data.goal.title,
            startDate: new Date(data.goal.startDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            goalDate: new Date(data.goal.goalDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            currentAmount: data.goal.currentAmount,
            goalAmount: data.goal.goalAmount,
            category: data.goal.category,
          };
          setSavingItems((prev) => [...prev, formattedGoal]);
          setNewGoalTitle("");
          setNewGoalDate("");
          setNewGoalAmount("");
          setFormActive(false);
        } else {
          setError("Failed to add goal");
        }
      })
      .catch((err) => {
        console.error("Error adding goal:", err);
        setError("Error adding goal");
      });
  };

  const handleGoalUpdate = (e) => {
    e.preventDefault();
    const goalId = selectedGoalCategory.id;
    fetch(`http://localhost:5000/api/budget/goals/${goalId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        title: updatedGoalTitle,
        goalDate: updatedGoalDate,
        goalAmount: Number(updatedGoalAmount),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const updatedFormattedGoal = {
            id: data.goal._id.toString(),
            title: data.goal.title,
            startDate: new Date(data.goal.startDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            goalDate: new Date(data.goal.goalDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            currentAmount: data.goal.currentAmount,
            goalAmount: data.goal.goalAmount,
            category: data.goal.category,
          };
          setSavingItems((prev) =>
            prev.map((goal) => (goal.id === goalId ? updatedFormattedGoal : goal))
          );
          setGoalFormActive(false);
        } else {
          setError("Failed to update goal");
        }
      })
      .catch((err) => {
        console.error("Error updating goal:", err);
        setError("Error updating goal");
      });
  };

  const handleGoalRemove = (goalId) => {
    if (window.confirm("Are you sure you want to remove this goal?")) {
      fetch(`http://localhost:5000/api/budget/goals/${goalId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setSavingItems(prev => prev.filter(goal => goal.id !== goalId));
          } else {
            setError("Failed to remove goal");
          }
        })
        .catch((err) => {
          console.error("Error removing goal:", err);
          setError("Error removing goal");
        });
  };
  };

  const totalBudgetAmount = budgetItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="flex min-h-screen bg-bg-gray">
      {/* Sidebar */}
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
            <li>
              <button onClick={handleLogout} className="w-full text-left block py-2 px-4 rounded-md hover:bg-hl-blue hover:text-dark-blue">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
      {/* Main Content */}
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
                        {iconMap[item.icon] ? React.createElement(iconMap[item.icon], { className: `w-8 h-8 ${item.color}` }) : null}
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
                  <div className="mt-4">
                    <p className="text-gray-500 text-sm">Spent: 
                      <span className="font-bold text-gray-700"> ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.spent)}</span>
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className={`h-2 rounded-full transition-all duration-300 ${spentPercentage < 100 ? "bg-blue-500" : "bg-red-500"}`}
                        style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                      ></div>
                    </div>
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
          <div className="fixed inset-0 bg-black bg-opacity-60 z-40"></div>
          <form className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[800px] rounded-2xl bg-white border border-[#284b74] p-4 mt-8">
            <button className="text-gray flex items-center hover:text-dark-blue" onClick={(e) => { e.preventDefault(); setBudgetFormActive(false); }}>
              <IoReturnDownBack className="w-6 h-6" />
            </button>
            <div className="text-center flex flex-col w-5/6 mx-auto mb-4">
              <h1 className="text-dark-blue text-xl md:text-3xl mt-6">Adjust Monthly {selectedBudgetCategory.title} Budget</h1>
              <div className="flex flex-col mt-4">
                <label className="text-left text-md text-gray-700 font-medium">New Budget Amount:</label>
                <input type="text" className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" placeholder={selectedBudgetCategory.amount} />
              </div>
              <div className="flex flex-col mt-4 space-y-4 text-start">
                <h1 className="font-semibold text-dark-blue">Currently spent ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(selectedBudgetCategory.spent)} of your ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(selectedBudgetCategory.amount)} monthly budget.</h1>
                <h1 className="font-semibold text-dark-blue">Current Date: {new Date().toLocaleDateString('en-US')}</h1>
              </div>
              <button className="my-10 p-2 rounded-md text-white w-full bg-dark-blue mx-auto hover:bg-hl-blue hover:text-dark-blue">
                Submit New Budget
              </button>
            </div>
          </form>
        </>
        )}
      <div className="flex-1 p-4 w-4/5 transition-all duration-300 ease-in-out min-h-[100vh]">
        <div className="flex justify-between px-4 pt-4 border-b border-[#284b74] pb-5">
          <div className="flex items-center">
            <button className="lg:hidden p-2 text-black text-3xl md:text-4xl mr-3" onClick={toggleSidebar}>☰</button>
            <h1 className="text-gray-500 text-xl my-4">Budgeting Goals</h1>
          </div>
          <div className="flex items-center">
            <h1 className="text-dark-blue text-2xl mr-4">{user ? user.fullName : "Guest"}</h1>
            <img className="h-12 w-auto rounded-full" src="https://tse1.mm.bing.net/th?id=OIP.cEvbluCvNFD_k4wC3k-_UwHaHa&pid=Api" alt="profile"/>
          </div>
        </div>
        {/* Budgeting Goals Section */}
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-gray-500 text-xl my-4">Budgeting Goals</h1>
            <button 
              onClick={() => setFormActive(true)} 
              className="flex items-center border-2 gap-1 border-dark-blue text-dark-blue rounded-lg w-[100px] h-[40px] justify-center hover:border-blue-300 hover:text-blue-300"
            >
              <h1 className="text-sm font-bold">Add Goal</h1>
              <TbTargetArrow className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savingItems?.map((item, index) => {
              const achieved = Number(item.currentAmount) || 0;
              const target = Number(item.goalAmount) || 0;
              const spentPercentage = target > 0 ? (achieved / target) * 100 : 0;
              return (
                <div key={index} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <h1 className="font-bold text-lg text-black">{item.title}</h1>
                      <h1 className="text-gray-600 text-md">
                        {new Date(item.startDate).toLocaleDateString("en-US")} - {new Date(item.goalDate).toLocaleDateString("en-US")}
                      </h1>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleGoalRemove(item.id)} className="text-red-600 hover:text-red-900 text-md transition-colors duration-200">
                        remove
                      </button>
                      <button 
                        onClick={() => { 
                          setGoalFormActive(true);
                          setSelectedGoalCategory(item);
                          setUpdatedGoalTitle(item.title);
                          setUpdatedGoalDate(toLocalISODate(item.goalDate));
                          setUpdatedGoalAmount(item.goalAmount);
                        }}
                        className="flex items-center gap-2 border-2 border-dark-blue rounded-lg p-2 text-dark-blue hover:text-blue-300 hover:border-blue-300 text-sm transition-colors duration-200"
                      >
                        <span>Adjust</span>
                        <FiEdit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between gap-4 my-4">
                    <div className="flex flex-col my-4">
                      <div className="flex flex-col my-2">
                        <p className="font-bold text-base sm:text-lg">
                          ${achieved.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-gray-600 text-base sm:text-md">Total Achieved</p>
                      </div>
                      <div className="flex flex-col my-2">
                        <p className="font-bold text-base sm:text-lg">
                          ${target.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-gray-600 text-base sm:text-md">Target Goal</p>
                      </div>
                    </div>
                    <div className="flex justify-center items-center">
                      <Speedometer value={achieved} maxValue={target} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {goalFormActive && selectedGoalCategory && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-60 z-40"></div>
            <form className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[800px] rounded-2xl bg-white border border-[#284b74] p-4 mt-8" onSubmit={handleGoalUpdate}>
              <button className="text-gray flex items-center hover:text-dark-blue" onClick={(e) => { e.preventDefault(); setGoalFormActive(false); }}>
                <IoReturnDownBack className="w-6 h-6" />
              </button>
              <div className="text-center flex flex-col w-5/6 mx-auto mb-4">
                <h1 className="text-dark-blue text-xl md:text-3xl mt-6">Adjust {selectedGoalCategory.title} Target Goal:</h1>
                <div className="flex flex-col mt-4">
                  <label className="text-left text-md text-gray-700 font-medium">New Goal Title:</label>
                  <input 
                    type="text" 
                    className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" 
                    value={updatedGoalTitle}
                    onChange={(e) => setUpdatedGoalTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col mt-4">
                  <label className="text-left text-md text-gray-700 font-medium">New Target Amount:</label>
                  <input 
                    type="number" 
                    className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" 
                    value={updatedGoalAmount}
                    onChange={(e) => setUpdatedGoalAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col mt-4">
                  <label className="text-left text-md text-gray-700 font-medium">New Target Date:</label>
                  <input 
                    type="date" 
                    className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" 
                    value={updatedGoalDate}
                    onChange={(e) => setUpdatedGoalDate(e.target.value)}
                    required
                  />
                </div>
                <button className="my-10 p-2 rounded-md text-white w-full bg-dark-blue mx-auto hover:bg-hl-blue hover:text-dark-blue">
                  Submit Adjusted Goal
                </button>
              </div>
            </form>
          </>
        )}

        {formActive && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-60 z-40"></div>
            <form className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[800px] rounded-2xl bg-white border border-[#284b74] p-4 mt-8" onSubmit={handleGoalSubmit}>
              <button className="text-gray flex items-center hover:text-dark-blue" onClick={(e) => { e.preventDefault(); setFormActive(false); }}>
                <IoReturnDownBack className="w-6 h-6" />
              </button>
              <div className="text-center flex flex-col w-5/6 mx-auto mb-4">
                <h1 className="text-dark-blue text-xl md:text-3xl mt-6">Add Goal</h1>
                <div className="flex flex-col mt-4">
                  <label className="text-left text-md text-gray-700 font-medium">Goal Title:</label>
                  <input 
                    type="text" 
                    className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" 
                    placeholder="Trip to Dubai" 
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col mt-4">
                  <label className="text-left text-md text-gray-700 font-medium">Achieve By:</label>
                  <input 
                    type="date" 
                    className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" 
                    value={newGoalDate}
                    onChange={(e) => setNewGoalDate(e.target.value)}
                    required 
                  />
                </div>
                <div className="flex flex-col mt-4">
                  <label className="text-left text-md text-gray-700 font-medium">Amount:</label>
                  <input 
                    type="number" 
                    className="p-2 border border-gray-300 rounded-md text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-[#284b74]" 
                    placeholder="$" 
                    value={newGoalAmount}
                    onChange={(e) => setNewGoalAmount(e.target.value)}
                    required 
                  />
                </div>
                <button className="my-10 p-2 rounded-md text-white w-full bg-dark-blue mx-auto hover:bg-hl-blue hover:text-dark-blue">
                  Submit New Goal
                </button>
              </div>
            </form>
          </>
        )}

        {/* Debt Tracking Section */}
        <div className="w-full max-w-7xl mx-auto px-4">
          <h1 className="text-gray-500 text-xl my-4">Debt Tracking</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200 flex justify-center">
              <div className="flex flex-col">
                <div className="flex justify-center items-center gap-4">
                  <FaMoneyBillWave className="w-12 h-12 text-green-700" />
                  <h1 className="text-xl">Total Debt</h1>
                </div>
                <h1 className="font-bold text-base sm:text-2xl text-center my-4">${formattedTotalDebt}</h1>
                {totalDebt <= 0 ? (
                  <h1 className="text-2xl text-center">Congratulations you are free of debt!</h1>
                ) : (
                  <h1 className="text-2xl text-center">One step closer to being free of debt!</h1>
                )}
              </div>
            </div>
            {debtItems.map((item, index) => {
              const IconComponent = debtIconMap[item.title] || FaFileInvoiceDollar;
              const colorClass = debtColorMap[item.title] || "text-blue-600";
              return (
                <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-center items-center gap-4">
                    <div className="flex-shrink-0">
                      <IconComponent className={`w-8 h-8 ${colorClass}`} />
                    </div>
                    <h1 className="text-xl">{item.title}</h1>
                  </div>
                  <p className="font-bold text-base sm:text-2xl text-center my-4">
                    ${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.currentAmount)}
                  </p>
                  <p className="text-md text-center">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resources Section */}
        <div className="w-full max-w-7xl mx-auto px-4">
          <h1 className="text-gray-500 text-xl my-4">Resources</h1>
          <div className="flex flex-col text-center bg-white p-10 gap-8 rounded-lg shadow-sm hover:shadow-md">
            <h1 className="text-2xl font-bold">User Resources</h1>
            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((col) => (
                <div key={col} className="flex flex-col space-y-4">
                  {financialResources
                    .filter((_, index) => index % 3 === col)
                    .map((item, index) => (
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
  );
};

export default Budget;
