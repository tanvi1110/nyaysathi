import React from 'react';
import Card from './ui/Card';
import Graph from './ui/Graph';

const annualData = [
    { date: '01/01/23', Target: 1000, Actual: 900 },
    { date: '02/01/23', Target: 2000, Actual: 1200 },
    { date: '03/01/23', Target: 3000, Actual: 1800 },
    { date: '04/01/23', Target: 4000, Actual: 2100 },
    { date: '05/01/23', Target: 5000, Actual: 2500 },
    { date: '06/01/23', Target: 6000, Actual: 3000 },
    { date: '07/01/23', Target: 7000, Actual: 3500 },
    { date: '08/01/23', Target: 8000, Actual: 4000 },
    { date: '09/01/23', Target: 9000, Actual: 4500 },
    { date: '10/01/23', Target: 10000, Actual: 5000 },
    { date: '11/01/23', Target: 11000, Actual: 6000 },
    { date: '12/01/23', Target: 12000, Actual: 7000 },
];

const AnnualReport = () => {
    return (
        <Card className="w-full">
            <div className="font-semibold text-xl mb-2 text-center">Detailed Annual Report</div>
            <Graph
                data={annualData}
                xKey="date"
                yKeys={["Target", "Actual"]}
                labels={["Target", "Actual"]}
                type="line"
                colors={["#A3A3A3", "#2A59D1"]}
            />
        </Card>
    );
};

export default AnnualReport; 