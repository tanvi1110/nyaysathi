import React from "react";

export default function Card({ title, children, className = "" }) {
    return (
        <div className={`bg-white rounded-xl shadow-sm p-4 ${className}`}>
            {title && <div className="font-semibold text-lg mb-2">{title}</div>}
            {children}
        </div>
    );
} 