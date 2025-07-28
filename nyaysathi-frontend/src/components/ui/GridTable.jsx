import React from 'react';

/**
 * columns: Array<{ Header: string, accessor: string, Cell?: (row) => ReactNode }>
 * data: Array<object>
 */
export default function GridTable({ columns, data }) {
    return (
        <div className="overflow-x-auto">
            {/* Header */}
            <div className={`grid gap-2 text-left text-gray-500 text-sm border-b px-2 py-2 font-medium`} style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
                {columns.map(col => (
                    <div key={col.accessor || col.Header}>{col.Header}</div>
                ))}
            </div>
            {/* Rows */}
            <div className="divide-y">
                {data.map((row, i) => (
                    <div key={row._id || row.id || i} className={`grid gap-2 items-center px-2 py-3 hover:bg-gray-50`} style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
                        {columns.map(col => (
                            <div key={col.accessor || col.Header}>
                                {col.Cell ? col.Cell(row) : row[col.accessor]}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
} 