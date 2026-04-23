import { useState, useRef } from 'react';
import api, { generateContentFromVideo } from '../services/api';
import GeneratedContentCard from '../components/GeneratedContentCard';
import { Sparkles, Loader2, UploadCloud, FileVideo, X } from 'lucide-react';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const [videoTitle, setVideoTitle] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const fileInputRef = useRef(null);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!videoFile) {
            toast.error("Please upload a video or audio file first");
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await generateContentFromVideo(videoTitle, videoFile);
            setResult(response.data.content);
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
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 h-fit transition-colors duration-200">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 transition-colors">
                            <Sparkles className="h-6 w-6 text-red-600" />
                            Generate Content
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">Upload your video or audio to get AI-optimized content.</p>
                    </div>

                    <form onSubmit={handleGenerate} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Video Title (Optional)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200"
                                placeholder="E.g., How to Build a React App"
                                value={videoTitle}
                                onChange={(e) => setVideoTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Upload Video/Audio <span className="text-red-500">*</span></label>
                            
                            {!videoFile ? (
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-red-400 dark:hover:border-red-500 transition-all bg-white dark:bg-slate-800 group"
                                >
                                    <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-full mb-3 group-hover:bg-red-100 dark:group-hover:bg-red-500/20 transition-colors">
                                        <UploadCloud className="h-8 w-8 text-red-600 dark:text-red-400" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 transition-colors">Click to upload media</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">MP4, MP3, M4A up to 25MB</p>
                                </div>
                            ) : (
                                <div className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700 shadow-sm transition-colors">
                                    <div className="flex items-center space-x-3 overflow-hidden">
                                        <div className="p-2 bg-red-100 dark:bg-red-500/20 rounded-lg text-red-600 dark:text-red-400 shrink-0 transition-colors">
                                            <FileVideo className="h-6 w-6" />
                                        </div>
                                        <div className="truncate">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate transition-colors">{videoFile.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => setVideoFile(null)}
                                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors ml-2"
                                        title="Remove file"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            )}
                            
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".mp4,.mp3,.m4a"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        if (file.size > 25 * 1024 * 1024) {
                                            toast.error("File size must be less than 25MB");
                                            return;
                                        }
                                        setVideoFile(file);
                                    }
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !videoFile}
                            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Processing Video...
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
                        <div className="h-full flex flex-col items-center justify-center space-y-4 text-gray-400 dark:text-gray-500 min-h-[400px] border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl bg-gray-50/50 dark:bg-slate-800/50 px-6 text-center transition-colors duration-200">
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-2 transition-colors duration-200">
                                <Loader2 className="h-8 w-8 animate-spin text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-base font-medium text-gray-700 dark:text-gray-300">Uploading & Transcribing Video...</p>
                                <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">This may take up to 30 seconds depending on file size.</p>
                            </div>
                        </div>
                    ) : result ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 px-1 transition-colors">Generated Results</h2>
                            <GeneratedContentCard title="YouTube Title" content={result.generatedTitle} />
                            <GeneratedContentCard title="Description" content={result.generatedDescription} />
                            <GeneratedContentCard title="Caption for Shorts/Reels" content={result.generatedCaption} />
                            <GeneratedContentCard title="Hashtags" content={result.generatedHashtags} />
                            <GeneratedContentCard title="Summary" content={result.generatedSummary} />
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center space-y-4 text-gray-400 dark:text-gray-500 min-h-[400px] border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl bg-gray-50/50 dark:bg-slate-800/50 transition-colors duration-200">
                            <Sparkles className="h-12 w-12 text-gray-300 dark:text-gray-600 transition-colors" />
                            <p className="text-sm font-medium">Your generated content will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
