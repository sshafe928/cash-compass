import { useState, useEffect, useMemo } from "react";
import about1 from '../assets/images/aboutImage1.png'
import about2 from '../assets/images/aboutImage2.avif'
import about3 from '../assets/images/aboutImage3.avif'
import about4 from '../assets/images/aboutImage4.jpg'
import about5 from '../assets/images/aboutImage5.avif'
import image17 from '../assets/images/Screenshot__17_-removebg-preview.png'
import image18 from '../assets/images/Screenshot__18_-removebg-preview.png'
import image19 from '../assets/images/Screenshot__19_-removebg-preview.png'
import compassLogo from '../assets/images/compassLogo.png'

const About = () => {
    const images = useMemo(() => [about1, about2, about3, about4], []);
    const [visibleImages, setVisibleImages] = useState(images);

    // Function to update visible images based on screen width
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;

            if (width < 800) {
                setVisibleImages(images.slice(0, 1));
            } else if (width < 1024) {
                setVisibleImages(images.slice(0, 2));
            } else if (width < 1300) {
                setVisibleImages(images.slice(0, 3));
            } else {
                setVisibleImages(images);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [images]);

    const testimonials = [
        {
            name: "Maya K",
            school: "University of Michigan",
            quote: "CashCompass helped me realize where I was overspending and how I could adjust my habits. It's so easy to use, and I can track my income and expenses with just a few clicks. The search and filter options are perfect for finding specific transactions, and I love how I can update or delete anything if I make a mistake. It's truly a must-have for any student!",
            date: "December 15, 2023",
        },
        {
            name: "Emily R",
            school: "University of Texas",
            quote: "I used to struggle with budgeting, especially with everything I have going on. CashCompass has been a total game-changer! It's simple to use, and I can quickly see how much I've spent and saved. The categorization feature really helps me understand my spending habits, and the summaries make budgeting for the next month so much easier. I feel so much more in control of my finances now!",
            date: "January 3, 2024",
        },
        {
            name: "Daniel W",
            school: "UC Berkeley",
            quote: "I've tried so many finance apps, but none of them felt right for me as a student. CashCompass is different—it's straightforward, easy to navigate, and it helps me stay on top of everything from rent to groceries. I especially love the ability to track my spending by category. It's helped me save more money than I thought I could!",
            date: "January 15, 2024",
        },
    ];

return (
    <div className="flex min-h-screen bg-bg-gray flex-col">

        {/* HEADER WITH GALLERY */}
        <div className="bg-dark-blue w-full flex flex-col h-[500px]">
            <div className="flex flex-col text-center gap-6 mt-10">
                <div className="flex flex-col md:flex-row items-center justify-center">
                    <img className="w-[200px] md:w-[150px]" src={compassLogo} alt="logo" />
                    <h1 className="text-[50px] text-white font-semibold  relative inline-block after:block after:w-0 after:h-1 after:bg-white after:transition-all after:duration-500 hover:after:w-full relative inline-block after:block after:w-0 after:h-1 after:bg-white after:transition-all after:duration-500 hover:after:w-full">Cash Compass</h1>
                </div>
                <p className="text-lg text-white max-w-[650px] mx-auto px-6 bg-dark-blue">Take control of your finances with <span className="font-bold">Cash Compass</span>. 
                Track your spending, set budgets, and gain insights into your financial health—all in one place. 
                Start your journey towards smarter money management today!</p>
            </div>
            <div className="bg-dark-blue py-8">
                <div className="container mx-auto flex flex-wrap justify-center gap-4 px-4">
                    {visibleImages.map((src, index) => (
                    <img key={index} src={src} alt={`Gallery ${index + 1}`} className="rounded-lg shadow-md w-full max-w-[400px] md:max-w-[300px] object-cover"/>
                    ))}
                </div>
            </div>
        </div>

        {/* WELCOME AND INTRO */}
        <div className="flex flex-col gap-8 justify-center mx-auto w-[90%] sm:w-[80%] mt-80 sm:mt-72 md:mt-24">
            <div className="flex flex-col gap-4 text-center md:text-start">
                <p className="text-3xl text-dark-blue font-semibold">Welcome To Your Financial Tracker!</p>
                <p className="text-xl text-gray-900">Get started with us and make an account or login.</p>
            </div>
            <div className="flex gap-6 flex-col md:flex-row items-center">
                <div className="flex flex-row md:flex-col gap-4 pr-0 md:pr-4 h-full">
                    <button className="rounded-3xl w-[180px] h-[44px] sm:w-[220px] font-semibold text-white bg-dark-blue px-4 py-2 hover:bg-hl-blue hover:text-dark-blue">Login</button>
                    <button className="rounded-3xl w-[180px] h-[44px] sm:w-[220px] border-2 border-dark-blue text-dark-blue font-semibold px-4 py-2 hover:bg-gray-300">Create an Account</button>
                </div>
                <p className="text-md lg:text-lg text-gray-900 py-6 md:border-l border-dark-blue px-4 sm:px-10"><span className="font-semibold text-dark-blue">Cash Compass</span> is a simple financial tool designed to help students manage their money with ease. It lets you track income, expenses, and spending patterns while providing clear summaries and customizable categories. With features like search, filters, and easy updates, <span className="font-semibold text-dark-blue">Cash Compass</span> makes budgeting effortless and empowers better financial decisions.</p>
            </div>
        </div>

        {/* OUR STORY */}
        <div className="flex gap-6 flex-col md:flex-row items-center w-[90%] sm:w-[80%] mx-auto my-14">
            <img className="rounded-lg shadow-md w-full max-w-[400px] md:max-w-[300px] lg:max-w-[400px] object-cover" src={about5} alt="Money Savings" />
            <div className="flex flex-col gap-4">
                <h1 className="text-dark-blue font-semibold text-lg lg:text-2xl">Our Story:</h1>
                <p className="text-sm xl:text-base 2xl:text-lg">
                    <span className="font-semibold text-dark-blue">CashCompass</span> was created by a group of students who found themselves constantly frustrated with keeping track of their finances. Between class schedules, part-time jobs, and the general hustle of student life, they realized that there wasn't a tool that made managing finances both simple and effective. So, they set out to build one. After brainstorming, coding, and a lot of trial and error, <span className="font-semibold text-dark-blue">CashCompass</span> was born—designed to help students efficiently track their spending, income, and savings goals. Now, thousands of students use <span className="font-semibold text-dark-blue">CashCompass</span> to gain clarity and confidence in their financial decisions.
                </p>
            </div>
        </div>

        {/* ICONS */}
        <div className="flex flex-col gap-6 mx-auto">
            <h1 className="text-dark-blue font-semibold text-3xl text-center px-4">We help students save and plan for the future</h1>
            <div className="text-center px-4">
                <h2 className="text-xl font-semibold text-dark-blue">Smart Budgeting Tips for Students</h2>
                <p className="mt-4 text-lg max-w-3xl mx-auto">
                Managing your finances as a student can be challenging, but setting a budget and tracking your expenses can make a huge difference. 
                Start by categorizing your spending, setting saving goals, and cutting unnecessary expenses. Small changes, like making coffee at home 
                instead of buying it daily, can add up over time!
                </p>
            </div>
            <div className="flex gap-4 justify-evenly">
                <img className="max-w-[100px] max-h-[100px]" src={image18} alt="money icon" />
                <img className="max-w-[100px] max-h-[100px]" src={image17} alt="building icon" />
                <img className="max-w-[100px] max-h-[100px]" src={image19} alt="magnify icon" />
            </div>
        </div>

        {/* TESTIMONALS */}
        <section className="text-white py-10">
            <div className="text-center pb-10">
                <h1 className="text-3xl font-semibold text-dark-blue">Testimonials</h1>
            </div>
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-dark-blue text-gray-900 rounded-xl p-6 shadow-lg transition-transform transform hover:-translate-y-1">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-white">— {testimonial.name}</h3>
                            <span className="text-blue-500 font-medium">{testimonial.school}</span>
                        </div>
                        <div className="relative">
                            <p className="text-lg text-gray-100 italic mb-4">"{testimonial.quote}"</p>
                            <span className="text-gray-100 text-sm">{testimonial.date}</span>
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </section>
    </div>
    );
};

export default About;