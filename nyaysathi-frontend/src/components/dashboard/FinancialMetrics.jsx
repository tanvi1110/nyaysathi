import React from 'react';
import Card from '../ui/Card';
import Graph from '../ui/Graph';

const barData = [
    { name: 'Actual', value: 300 },
    { name: 'Expected', value: 400 },
    { name: 'Target', value: 500 },
];

const metricTitles = ['Today', 'This Month', 'This Year'];

const FinancialMetrics = () => {
    return (
        <>
            <div className="font-semibold text-xl mb-4 mt-8">Financial Metrics for Tanvi Shah</div>
            <div className="flex gap-4 mb-8">
                {metricTitles.map((title, idx) => (
                    <Card key={title} className="flex-1">
                        <div className="font-medium mb-2 text-center">{title}</div>
                        <Graph
                            data={barData}
                            xKey="name"
                            yKeys={["value"]}
                            labels={["Value"]}
                            type="bar"
                            colors={["#A5B4FC"]}
                        />
                    </Card>
                ))}
            </div>
        </>
    );
};

export default FinancialMetrics; 