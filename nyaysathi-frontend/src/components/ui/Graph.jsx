import React from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Graph({ data, xKey, yKeys, labels, type = "bar", colors = [] }) {
    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                {type === "bar" ? (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={xKey} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {yKeys.map((key, idx) => (
                            <Bar key={key} dataKey={key} fill={colors[idx] || "#2A59D1"} name={labels[idx] || key} />
                        ))}
                    </BarChart>
                ) : (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={xKey} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {yKeys.map((key, idx) => (
                            <Line key={key} type="monotone" dataKey={key} stroke={colors[idx] || "#2A59D1"} name={labels[idx] || key} dot />
                        ))}
                    </LineChart>
                )}
            </ResponsiveContainer>
        </div>
    );
} 