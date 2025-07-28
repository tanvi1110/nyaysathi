import React from "react";
import clsx from "clsx";
import CircularProgress from "@mui/material/CircularProgress";

const variantStyles = {
    default: "bg-gray-500 hover:bg-gray-600 text-white",
    white: "bg-white hover:bg-gray-100 text-indigo-700 border border-indigo-700",
    primary: "bg-[#2A59D1] hover:bg-[#002D9F] text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300",
    outline: "bg-transparent border border-gray-400 text-gray-700 hover:bg-gray-100",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
    danger: "bg-red-600 hover:bg-red-700 text-white",
};

export const Button = ({
    variant = "default",
    loading = false,
    children,
    className,
    loaderIcon,
    ...props
}) => {
    return (
        <button
            className={clsx(
                "text-xs font-semibold px-4 py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-2",
                variantStyles[variant] || variantStyles.default,
                className
            )}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? (loaderIcon || <CircularProgress size={16} thickness={5} />) : children}
        </button>
    );
}; 