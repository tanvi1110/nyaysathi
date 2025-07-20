import Summarizer from '@/src/components/Summarizer';
import Layout from '../../components/layout/Layout';
import Head from 'next/head';


export default function AISummarizerPage() {
    return (
        <Layout>
            <Head>
                <title>Nyaysathi | AI Summarizer</title>
            </Head>
            <main className="min-h-screen bg-gray-50 p-6">
                <Summarizer />
            </main>
        </Layout>
    );
} 