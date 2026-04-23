import { useState, useEffect } from 'react';
import api from '../services/api';
import GeneratedContentCard from '../components/GeneratedContentCard';
import { History as HistoryIcon, Loader2, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await api.get('/content/history');
                setHistory(data.data);
            } catch (error) {
                toast.error("Failed to fetch history");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <HistoryIcon className="h-8 w-8 text-indigo-600" />
                    My Content History
                </h2>
                <p className="text-gray-500 mt-2">View your previously generated AI content.</p>
            </div>

            {history.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <HistoryIcon className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No history yet</h3>
                    <p className="mt-1 text-gray-500">Generate some content to see it here.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {history.map((item) => (
                        <div key={item._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {item.videoTitle || "Untitled Video"}
                                    </h3>
                                    <div className="flex items-center text-sm text-gray-500 mt-2 gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <GeneratedContentCard title="YouTube Title" content={item.generatedTitle} />
                                <GeneratedContentCard title="Description" content={item.generatedDescription} />
                                <GeneratedContentCard title="Caption" content={item.generatedCaption} />
                                <GeneratedContentCard title="Hashtags" content={item.generatedHashtags} />
                                <div className="md:col-span-2">
                                    <GeneratedContentCard title="Summary" content={item.generatedSummary} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
