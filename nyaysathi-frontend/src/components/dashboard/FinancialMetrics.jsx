import React from 'react';
import Card from '../ui/Card';
import Graph from '../ui/Graph';
import { Button } from '../ui/Button';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

const barData = [
    { name: 'Collected', value: 300 },
    { name: 'Outstanding', value: 180 },
    { name: 'Target', value: 500 },
];

const metricBlocks = [
    { title: 'Today', total: 'INR 18,500', delta: '+8.2%' },
    { title: 'This Month', total: 'INR 2,46,000', delta: '+12.1%' },
    { title: 'This Year', total: 'INR 27,80,000', delta: '+16.4%' },
];

const FinancialMetrics = () => {
    const handleSavePdf = async () => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text('Nyaysathi Financial Metrics', 10, 20);
            let y = 35;
            metricBlocks.forEach((block) => {
                doc.setFontSize(12);
                doc.text(`${block.title}: ${block.total} (${block.delta})`, 10, y);
                y += 10;
            });
            const pdfBlob = doc.output('blob');
            const arrayBuffer = await pdfBlob.arrayBuffer();
            const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
            const res = await fetch('/api/pdfs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename: 'financial-metrics.pdf', data: base64 }),
            });
            if (!res.ok) throw new Error('Failed to save PDF');
            toast.success('Financial report saved as PDF');
        } catch {
            toast.error('Could not save PDF');
        }
    };

    return (
        <section className="mb-8 mt-8">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">Financial Metrics</h2>
                    <p className="text-sm text-slate-600">Revenue and billing performance snapshot.</p>
                </div>
                <Button variant="primary" onClick={handleSavePdf}>Save as PDF</Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                {metricBlocks.map((block) => (
                    <Card key={block.title} className="border border-slate-100 shadow-sm">
                        <div className="mb-1 text-sm text-slate-500">{block.title}</div>
                        <div className="text-2xl font-semibold text-slate-900">{block.total}</div>
                        <div className="mt-1 text-xs font-medium text-emerald-600">{block.delta} vs previous period</div>
                        <div className="mt-3 rounded-lg bg-slate-50 p-2">
                            <Graph
                                data={barData}
                                xKey="name"
                                yKeys={["value"]}
                                labels={["Amount"]}
                                type="bar"
                                colors={["#5B7BE8"]}
                            />
                        </div>
                    </Card>
                ))}
            </div>
        </section>
    );
};

export default FinancialMetrics;
