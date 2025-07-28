import React from 'react';
import Card from '../ui/Card';
import Graph from '../ui/Graph';
import { Button } from '../ui/Button';
import jsPDF from 'jspdf';

const barData = [
    { name: 'Actual', value: 300 },
    { name: 'Expected', value: 400 },
    { name: 'Target', value: 500 },
];

const metricTitles = ['Today', 'This Month', 'This Year'];

const FinancialMetrics = () => {
    const handleSavePdf = async () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Financial Metrics for Tanvi Shah', 10, 20);
        let y = 35;
        metricTitles.forEach((title, idx) => {
            doc.setFontSize(12);
            doc.text(`${title}:`, 10, y);
            barData.forEach((item, i) => {
                doc.text(`${item.name}: ${item.value}`, 20, y + 7 + i * 7);
            });
            y += 30;
        });
        const pdfBlob = doc.output('blob');
        const arrayBuffer = await pdfBlob.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        await fetch('/api/pdfs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: 'financial-metrics.pdf', data: base64 }),
        });
        alert('PDF saved!');
    };
    return (
        <>
            <div className="font-semibold text-xl mb-4 mt-8 flex items-center justify-between">
                Financial Metrics for Tanvi Shah
                <Button variant="primary" onClick={handleSavePdf}>Save as PDF</Button>
            </div>
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