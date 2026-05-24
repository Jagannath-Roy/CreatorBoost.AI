import { useState, useRef, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { generateContentFromVideo } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const CopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button type="button" onClick={handleCopy} className="p-1.5 hover:bg-surface-variant rounded-lg transition-all" title="Copy">
            <span className={`material-symbols-outlined text-[18px] ${copied ? 'text-secondary' : 'text-slate-gray'}`}>
                {copied ? 'check' : 'content_copy'}
            </span>
        </button>
    );
};

const EmptyResultsPlaceholder = () => {
    const fields = [
        { label: 'Title', isSecondary: false },
        { label: 'Summary', isSecondary: false },
        { label: 'Full Description', isSecondary: false },
        { label: 'Video Timestamps', isSecondary: false },
        { label: 'Short-Form Caption (TikTok/Reels/Shorts)', isSecondary: true },
        { label: 'Hashtags', isSecondary: false }
    ];

    return (
        <div className="space-y-4">
            {fields.map((field, idx) => (
                <div key={idx} className={`glass-card rounded-xl p-6 relative border opacity-60 ${field.isSecondary ? 'border-l-4 border-l-secondary/40 border-border-subtle/40' : 'border-border-subtle/40'}`}>
                    <div className="flex justify-between items-start">
                        <span className={`text-[12px] md:text-[14px] uppercase font-bold tracking-wider ${field.isSecondary ? 'text-secondary/60' : 'text-primary/60'}`}>{field.label}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-slate-gray/50">
                        <span className="material-symbols-outlined text-[16px]">hourglass_empty</span>
                        <p className="font-body-sm text-[13px] italic">Awaiting media upload...</p>
                    </div>
                </div>
            ))}
            <LockedThumbnailCard />
        </div>
    );
};

const LockedThumbnailCard = () => (
    <div className="glass-card rounded-xl p-6 relative border border-border-subtle/40 bg-surface-container-low/30 overflow-hidden">
        {/* Clear Heading */}
        <div className="flex justify-between items-start mb-4 relative z-20">
            <span className="text-[12px] md:text-[14px] uppercase font-bold tracking-wider text-primary/80">Thumbnail</span>
        </div>

        {/* Dimmed background mock */}
        <div className="opacity-20 blur-[2px] pointer-events-none select-none relative z-0">
            <div className="h-32 bg-surface-container-high rounded-xl w-full flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-slate-gray">image</span>
            </div>
        </div>
        
        {/* Overlay lock */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/20 backdrop-blur-[1px] pt-8">
             <span className="material-symbols-outlined text-4xl text-on-surface mb-3">lock</span>
             <div className="inline-flex items-center px-4 py-1.5 bg-surface-container-highest text-on-surface font-label-sm rounded-full border border-border-subtle shadow-sm">
                 To be rolled out soon
             </div>
        </div>
    </div>
);

const LoadingResultsPlaceholder = () => {
    const fields = [
        { label: 'Video Title', isSecondary: false },
        { label: 'Video Summary', isSecondary: false },
        { label: 'Full Description', isSecondary: false },
        { label: 'Video Timestamps', isSecondary: false },
        { label: 'Short-Form Caption (TikTok/Reels/Shorts)', isSecondary: true },
        { label: 'Hashtags', isSecondary: false }
    ];

    return (
        <div className="space-y-4">
            {fields.map((field, idx) => (
                <SkeletonCard key={idx} label={field.label} isSecondary={field.isSecondary} />
            ))}
            <LockedThumbnailCard />
        </div>
    );
};

const SkeletonCard = ({ label, isSecondary }) => (
    <div className={`glass-card rounded-xl p-6 group relative border ${isSecondary ? 'border-l-4 border-l-secondary/50' : 'border-border-subtle/50'}`}>
        <div className="flex justify-between items-start mb-4">
            <span className={`text-[12px] md:text-[14px] uppercase font-bold tracking-wider ${isSecondary ? 'text-secondary/70' : 'text-primary/70'}`}>
                {label} <span className="animate-pulse">...</span>
            </span>
            <span className="material-symbols-outlined text-slate-gray/50 animate-spin">progress_activity</span>
        </div>
        <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-surface-container-high rounded-full w-3/4"></div>
            <div className="h-4 bg-surface-container-high rounded-full w-full"></div>
            <div className="h-4 bg-surface-container-high rounded-full w-5/6"></div>
        </div>
    </div>
);

const StaggeredResults = ({ result }) => {
    const [visibleStep, setVisibleStep] = useState(0);

    const stepsConfig = [
        { key: 'generatedTitle', label: 'Title', type: 'title' },
        { key: 'generatedSummary', label: 'Summary', type: 'summary' },
        { key: 'generatedDescription', label: 'Full Description', type: 'description' },
        { key: 'generatedTimestamps', label: 'Video Timestamps', type: 'timestamps' },
        { key: 'generatedCaption', label: 'Short-Form Caption (TikTok/Reels/Shorts)', type: 'caption', isSecondary: true },
        { key: 'generatedHashtags', label: 'Hashtags', type: 'hashtags' }
    ];

    const availableSteps = stepsConfig.filter(s => result[s.key]);

    useEffect(() => {
        setVisibleStep(0);
    }, [result]);

    useEffect(() => {
        if (visibleStep < availableSteps.length) {
            const timer = setTimeout(() => {
                setVisibleStep(prev => prev + 1);
            }, 1200); 
            return () => clearTimeout(timer);
        }
    }, [visibleStep, availableSteps.length]);

    const renderContent = (step, content) => {
        switch(step.type) {
            case 'title':
                return <p className="font-headline-md text-[20px] md:text-headline-md text-on-surface">{content}</p>;
            case 'summary':
                return <p className="font-body-md text-body-md text-on-surface whitespace-pre-line">{content}</p>;
            case 'description':
                return <p className="font-body-sm text-body-sm text-on-surface leading-relaxed whitespace-pre-line">{content}</p>;
            case 'caption':
                return <p className="font-body-md text-on-surface italic whitespace-pre-line">{content}</p>;
            case 'hashtags':
            case 'timestamps':
                return <p className="font-body-md text-on-surface whitespace-pre-line">{content}</p>;
            default:
                return <p>{content}</p>;
        }
    };

    return (
        <div className="space-y-4">
            {availableSteps.map((step, index) => {
                if (index < visibleStep) {
                    return (
                        <div key={step.key} className={`glass-card rounded-xl p-6 group relative animate-in fade-in slide-in-from-bottom-4 duration-500 ${step.isSecondary ? 'border-l-4 border-l-secondary' : ''}`}>
                            <div className={`flex justify-between items-start ${step.type === 'title' ? 'mb-2' : 'mb-4'}`}>
                                <span className={`text-[12px] md:text-[14px] uppercase font-bold tracking-wider ${step.isSecondary ? 'text-secondary' : 'text-primary'}`}>{step.label}</span>
                                <CopyButton text={result[step.key]} />
                            </div>
                            {renderContent(step, result[step.key])}
                        </div>
                    );
                } else {
                    return <SkeletonCard key={`skeleton-${step.key}`} label={step.label} isSecondary={step.isSecondary} />;
                }
            })}
            <LockedThumbnailCard />
        </div>
    );
};

const Dashboard = () => {
    const [videoTitle, setVideoTitle] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const { user, logout } = useContext(AuthContext);

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
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to generate content");
        } finally {
            setLoading(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (file) => {
        if (file.size > 25 * 1024 * 1024) {
            toast.error("File size must be less than 25MB");
            return;
        }
        setVideoFile(file);
    };

    return (
        <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
            {/* Top Nav */}
            <header className="flex items-center justify-between px-4 md:px-margin-lg h-16 border-b border-border-subtle bg-surface/80 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-8">
                    <span className="font-headline-sm text-headline-sm text-on-surface">CreatorBoost.ai</span>
                    <nav className="hidden sm:flex items-center gap-6">
                        <Link to="/dashboard" className="font-label-md text-label-md text-primary font-bold transition-colors">Dashboard</Link>
                        <Link to="/history" className="font-label-md text-label-md text-slate-gray hover:text-on-surface transition-colors">History</Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4 md:gap-6">
                    <span className="hidden sm:inline font-body-md text-body-md text-on-surface-variant">
                        Hello, <span className="text-on-surface font-medium">{user?.name || 'Creator'}</span>
                    </span>
                    <button onClick={logout} className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md rounded-xl border border-border-subtle transition-all active:scale-95">
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>

            {/* Dashboard Canvas */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-[1400px] mx-auto p-4 grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6">
                    {/* Left Column: Upload Area */}
                    <section className="xl:col-span-5">
                        <div className="space-y-3 xl:sticky xl:top-4 z-10">
                            <div className="p-4 md:p-5 glass-card rounded-xl">
                            <h2 className="font-headline-lg text-[22px] md:text-[24px] text-on-surface mb-1">1. Upload Your File</h2>
                            <p className="font-body-md text-[14px] text-slate-gray mb-3">Drop your video or audio file here. We support MP4, MP3, and M4A formats up to 25MB.</p>
                            
                            {/* Dropzone */}
                            {!videoFile ? (
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center transition-colors cursor-pointer group mb-4 ${isDragging ? 'border-primary bg-primary/5' : 'border-border-subtle bg-surface-container-low hover:border-primary/50'}`}
                                >
                                    <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-primary text-2xl">cloud_upload</span>
                                    </div>
                                    <p className="font-label-md text-label-md text-on-surface mb-1">Select a file or drag and drop</p>
                                    <p className="font-label-sm text-label-sm text-slate-gray">MP4, MP3, M4A (Max 25MB)</p>
                                </div>
                            ) : (
                                <div className="w-full flex items-center justify-between p-3 border border-border-subtle rounded-xl bg-surface-container-low shadow-sm transition-colors mb-5">
                                    <div className="flex items-center space-x-3 overflow-hidden">
                                        <div className="p-2 bg-primary/20 rounded-lg text-primary shrink-0 transition-colors">
                                            <span className="material-symbols-outlined">movie</span>
                                        </div>
                                        <div className="truncate">
                                            <p className="text-sm font-medium text-on-surface truncate transition-colors">{videoFile.name}</p>
                                            <p className="text-xs text-slate-gray transition-colors">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => setVideoFile(null)}
                                        className="p-2 text-slate-gray hover:text-error hover:bg-error/10 rounded-lg transition-colors ml-2"
                                        title="Remove file"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">close</span>
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
                                        handleFileSelect(e.target.files[0]);
                                    }
                                }}
                            />

                            {/* Form */}
                            <form className="space-y-4" onSubmit={handleGenerate}>
                                <div>
                                    <label className="block font-label-sm text-label-sm text-slate-gray mb-1 uppercase tracking-widest">Provide Context or a Hint  (Optional)</label>
                                    <textarea 
                                        className="w-full bg-surface-container-high border border-border-subtle rounded-xl p-3 font-body-sm text-body-sm text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none min-h-[60px]" 
                                        placeholder="Tell the AI what your video is about or who should watch it (e.g., 'A cooking video for beginners' or 'Focus on how to save time')."
                                        value={videoTitle}
                                        onChange={(e) => setVideoTitle(e.target.value)}
                                    ></textarea>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={loading || !videoFile}
                                    className="w-full py-2.5 bg-primary text-on-primary font-label-md text-label-md rounded-xl glow-button active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                                >
                                    {loading ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                            Processing Content...
                                        </>
                                    ) : (
                                        "Generate Content"
                                    )}
                                </button>
                            </form>
                        </div>
                        
                        {/* Extra Info Card */}
                        <div className="p-4 glass-card rounded-xl border-l-4 border-l-tertiary">
                            <div className="flex gap-3">
                                <span className="material-symbols-outlined text-tertiary">tips_and_updates</span>
                                <div>
                                    <h4 className="font-label-md text-label-md text-on-surface">Pro Tip</h4>
                                    <p className="font-body-sm text-[13px] text-slate-gray mt-1">Providing context helps our AI generate more accurate hooks and SEO-optimized hashtags for your specific niche.</p>
                                </div>
                            </div>
                        </div>
                        </div>
                    </section>

                    {/* Right Column: Results List */}
                    <section className="xl:col-span-7 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-widest">Generated Output</h3>
                        </div>

                        {loading ? (
                            <LoadingResultsPlaceholder />
                        ) : result ? (
                            <StaggeredResults result={result} />
                        ) : (
                            <EmptyResultsPlaceholder />
                        )}
                    </section>
                </div>
            </div>

            {/* Footer */}
            <footer className="flex flex-col sm:flex-row justify-between items-center w-full px-4 md:px-margin-lg py-3 border-t border-border-subtle bg-surface-dim shrink-0 gap-3 sm:gap-0 mt-2">
                <p className="font-label-sm text-label-sm text-slate-gray">© 2026 CreatorBoost.ai. All rights reserved.</p>
                <div className="flex gap-4 md:gap-6">
                    <Link className="font-label-sm text-label-sm text-slate-gray hover:text-on-surface transition-colors" to="#">Privacy Policy</Link>
                    <Link className="font-label-sm text-label-sm text-slate-gray hover:text-on-surface transition-colors" to="#">Terms of Service</Link>
                    <Link className="font-label-sm text-label-sm text-slate-gray hover:text-on-surface transition-colors" to="#">Contact</Link>
                </div>
            </footer>
        </main>
    );
};

export default Dashboard;
