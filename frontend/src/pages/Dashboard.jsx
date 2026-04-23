import { useState } from 'react';
import api from '../services/api';
import GeneratedContentCard from '../components/GeneratedContentCard';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const [videoTitle, setVideoTitle] = useState('');
    const [transcript, setTranscript] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!transcript.trim()) {
            toast.error("Transcript is required");
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const { data } = await api.post('/content/generate', { videoTitle, transcript });
            setResult(data.data);
            toast.success("Content generated successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to generate content");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-indigo-600" />
                            Generate Content
                        </h2>
                        <p className="text-gray-500 mt-1">Paste your video transcript to get AI-optimized content.</p>
                    </div>

                    <form onSubmit={handleGenerate} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Video Title (Optional)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="E.g., How to Build a React App"
                                value={videoTitle}
                                onChange={(e) => setVideoTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Transcript <span className="text-red-500">*</span></label>
                            <textarea
                                required
                                rows={8}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                                placeholder="Paste your video transcript here..."
                                value={transcript}
                                onChange={(e) => setTranscript(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Generating Magic...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-5 w-5" />
                                    Generate Content
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Output Section */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4 text-gray-400 min-h-[400px] border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                            <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                            <p className="text-sm font-medium">Analyzing transcript and generating content...</p>
                        </div>
                    ) : result ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">Generated Results</h2>
                            <GeneratedContentCard title="YouTube Title" content={result.generatedTitle} />
                            <GeneratedContentCard title="Description" content={result.generatedDescription} />
                            <GeneratedContentCard title="Caption for Shorts/Reels" content={result.generatedCaption} />
                            <GeneratedContentCard title="Hashtags" content={result.generatedHashtags} />
                            <GeneratedContentCard title="Summary" content={result.generatedSummary} />
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center space-y-4 text-gray-400 min-h-[400px] border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                            <Sparkles className="h-12 w-12 text-gray-300" />
                            <p className="text-sm font-medium">Your generated content will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
