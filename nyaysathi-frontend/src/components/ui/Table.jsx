import React from 'react';

/**
 * columns: Array<{ Header: string, accessor: string, Cell?: (row) => ReactNode }>
 * data: Array<object>
 */
export default function Table({ columns, data }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border text-xs">
                <thead>
                    <tr className="bg-gray-100">
                        {columns.map(col => (
                            <th key={col.accessor || col.Header} className="border px-2 py-1">{col.Header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr key={row._id || i}>
                            {columns.map(col => (
                                <td key={col.accessor || col.Header} className="border px-2 py-1">
                                    {col.Cell ? col.Cell(row) : row[col.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 