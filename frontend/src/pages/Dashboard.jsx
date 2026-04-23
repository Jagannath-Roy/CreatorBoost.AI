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
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-indigo-600" />
                            Generate Content
                        </h2>
                        <p className="text-gray-500 mt-1">Upload your video or audio to get AI-optimized content.</p>
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Video/Audio <span className="text-red-500">*</span></label>
                            
                            {!videoFile ? (
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-indigo-400 transition-colors bg-white group"
                                >
                                    <div className="p-3 bg-indigo-50 rounded-full mb-3 group-hover:bg-indigo-100 transition-colors">
                                        <UploadCloud className="h-8 w-8 text-indigo-600" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Click to upload media</p>
                                    <p className="text-xs text-gray-500">MP4, MP3, M4A up to 25MB</p>
                                </div>
                            ) : (
                                <div className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50 shadow-sm">
                                    <div className="flex items-center space-x-3 overflow-hidden">
                                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 shrink-0">
                                            <FileVideo className="h-6 w-6" />
                                        </div>
                                        <div className="truncate">
                                            <p className="text-sm font-medium text-gray-900 truncate">{videoFile.name}</p>
                                            <p className="text-xs text-gray-500">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => setVideoFile(null)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2"
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
                            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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
                        <div className="h-full flex flex-col items-center justify-center space-y-4 text-gray-400 min-h-[400px] border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 px-6 text-center">
                            <div className="p-4 bg-white rounded-full shadow-sm mb-2">
                                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-base font-medium text-gray-700">Uploading & Transcribing Video...</p>
                                <p className="text-sm mt-2 text-gray-500">This may take up to 30 seconds depending on file size.</p>
                            </div>
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
