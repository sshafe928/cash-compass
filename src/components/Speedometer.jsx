import React, { useState, useEffect } from "react";

const Speedometer = ({ value, maxValue }) => {
    const percentage = (value / maxValue) * 100;
    const flooredPercentage = Math.floor(percentage);
    const targetAngle = (percentage / 100) * 180;
    const circumference = Math.PI * 50; 
    const targetProgress = (percentage / 100) * circumference;

    const [angle, setAngle] = useState(0);
    const [progress, setProgress] = useState(0);
    const [displayPercent, setDisplayPercent] = useState(0);


    useEffect(() => {
        const frames = 45;
        const angleIncrement = targetAngle / frames;
        const progressIncrement = targetProgress;
        const percentIncrement = flooredPercentage / frames;
        let currentAngle = 0;
        let currentProgress = 0;
        let currentPercent = 0;

        const animateBar = () => {
            if (currentProgress < targetProgress) {
                currentProgress += progressIncrement;
                setProgress(currentProgress); 
                requestAnimationFrame(animateBar);
            } else {
                setProgress(targetProgress);
            }
        };

        const animatePercent = () => {
            if (currentPercent < flooredPercentage) {
                currentPercent += percentIncrement;
                setDisplayPercent(Math.floor(currentPercent));
                requestAnimationFrame(animatePercent);
            } else {
                setDisplayPercent(flooredPercentage);
            }
        };

        const animateNeedle = () => {
            if (currentAngle < targetAngle) {
                currentAngle += angleIncrement;
                setAngle(currentAngle);
                requestAnimationFrame(animateNeedle);
            } else {
                setAngle(targetAngle);
            }
        }
        setTimeout(() => {
            animateNeedle();
            animatePercent();
            animateBar();
        }, 500);

    }, [targetAngle, targetProgress, flooredPercentage]);

    // Needle calculations
    const needleLength = 40;
    const radians = (angle * Math.PI) / 180;
    const x2 = 60 + needleLength * Math.cos(radians - Math.PI);
    const y2 = 50 + needleLength * Math.sin(radians - Math.PI);

    return (
        <div className="flex flex-col items-center">
            {/* SVG for the speedometer */}
            <svg width="130" height="100" viewBox="0 0 120 20">
                {/* Background semi-circle */}
                <path
                    d="M 10 50 A 50 50 0 0 1 110 50"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                    fill="none"
                />
                {/* Progress semi-circle */}
                <path
                    d="M 10 50 A 50 50 0 0 1 110 50"
                    stroke="#10b981"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s ease-out" }}
                />
                {/* Needle */}
                <line x1="60" y1="50" x2={x2} y2={y2} stroke="#10b981" strokeWidth="2" />
            </svg>

            {/* Labels */}
            <div className="flex justify-between w-full text-sm">
                <span className="text-gray-500 w-[30px] mr-[5px] text-center">0%</span>
                <div className="text-lg font-bold text-gray-700">{displayPercent}%</div>
                <span className="text-gray-500 w-[35px] text-center">100%</span>
            </div>

            {/* Value in the center */}
            <div className="text-center">
                <div className="text-sm text-gray-500">Target vs Achievement</div>
            </div>
        </div>
    );
};

export default Speedometer;
