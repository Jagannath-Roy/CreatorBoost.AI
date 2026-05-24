import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api, { deleteContentHistory } from '../services/api';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const CopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
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

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { logout } = useContext(AuthContext);

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

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        try {
            await deleteContentHistory(itemToDelete);
            setHistory(prev => prev.filter(item => item._id !== itemToDelete));
            toast.success("Content deleted successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete content");
        } finally {
            setIsDeleting(false);
            setItemToDelete(null);
        }
    };

    if (loading) {
        return (
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
                <header className="flex items-center justify-between px-4 md:px-margin-lg h-16 border-b border-border-subtle bg-surface/80 backdrop-blur-md shrink-0">
                    <div className="flex items-center gap-8">
                        <Link className="text-headline-md font-headline-md font-bold text-on-surface" to="/">CreatorBoost.ai</Link>
                        <nav className="hidden sm:flex items-center gap-6">
                            <Link to="/dashboard" className="font-label-md text-label-md text-slate-gray hover:text-on-surface transition-colors">Dashboard</Link>
                            <Link to="/history" className="font-label-md text-label-md text-primary font-bold transition-colors">History</Link>
                        </nav>
                    </div>
                </header>
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="p-4 bg-surface-container-high rounded-full shadow-sm mb-4">
                        <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
                    </div>
                    <p className="text-on-surface font-medium">Loading History...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
            <header className="flex items-center justify-between px-4 md:px-margin-lg h-16 border-b border-border-subtle bg-surface/80 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-8">
                    <Link className="text-headline-md font-headline-md font-bold text-on-surface" to="/">CreatorBoost.ai</Link>
                    <nav className="hidden sm:flex items-center gap-6">
                        <Link to="/dashboard" className="font-label-md text-label-md text-slate-gray hover:text-on-surface transition-colors">Dashboard</Link>
                        <Link to="/history" className="font-label-md text-label-md text-primary font-bold transition-colors">History</Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={logout} className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md rounded-lg transition-colors border border-border-subtle flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        <span className="hidden sm:inline">Sign Out</span>
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-[1000px] mx-auto p-4 md:p-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                            <span className="material-symbols-outlined text-2xl">history</span>
                        </div>
                        <div>
                            <h2 className="font-headline-lg text-[24px] md:text-[28px] text-on-surface">My Content History</h2>
                            <p className="font-body-sm text-[14px] text-slate-gray mt-1">Review your previously generated AI content</p>
                        </div>
                    </div>

                    {/* Content */}
                    {history.length === 0 ? (
                        <div className="py-20 glass-card rounded-2xl flex flex-col items-center justify-center text-center">
                            <span className="material-symbols-outlined text-5xl text-border-subtle mb-4">history</span>
                            <h3 className="text-lg font-medium text-on-surface mb-2">No history yet</h3>
                            <p className="text-slate-gray mb-6 text-[14px]">Generate some content to see it here.</p>
                            <Link to="/dashboard" className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-label-md hover:scale-95 transition-transform glow-button">
                                Go to Dashboard
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {history.map((item) => (
                                <div key={item._id} className="glass-card rounded-2xl p-5 md:p-8 relative">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-border-subtle gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-on-surface">movie</span>
                                            </div>
                                            <div>
                                                <h3 className="font-label-lg text-[18px] text-on-surface">{item.videoTitle || "Untitled Video"}</h3>
                                                <div className="flex items-center text-xs text-slate-gray mt-1 gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                                    {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setItemToDelete(item._id)}
                                            className="p-2 text-slate-gray hover:text-error hover:bg-error/10 rounded-lg transition-colors shrink-0"
                                            title="Delete permanently"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </div>

                                    {/* Generated Fields Grid */}
                                    <div className="space-y-4">
                                        {item.generatedTitle && (
                                            <div className="bg-surface-container-low rounded-xl p-5 border border-border-subtle/50 relative group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[12px] md:text-[14px] text-primary uppercase font-bold tracking-wider">Video Title</span>
                                                    <CopyButton text={item.generatedTitle} />
                                                </div>
                                                <p className="font-headline-md text-[18px] text-on-surface">{item.generatedTitle}</p>
                                            </div>
                                        )}

                                        {item.generatedSummary && (
                                            <div className="bg-surface-container-low rounded-xl p-5 border border-border-subtle/50 relative group">
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="text-[12px] md:text-[14px] text-primary uppercase font-bold tracking-wider">Video Summary</span>
                                                    <CopyButton text={item.generatedSummary} />
                                                </div>
                                                <p className="font-body-md text-[14px] text-on-surface whitespace-pre-line">{item.generatedSummary}</p>
                                            </div>
                                        )}

                                        {item.generatedDescription && (
                                            <div className="bg-surface-container-low rounded-xl p-5 border border-border-subtle/50 relative group">
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="text-[12px] md:text-[14px] text-primary uppercase font-bold tracking-wider">Full Description</span>
                                                    <CopyButton text={item.generatedDescription} />
                                                </div>
                                                <p className="font-body-sm text-[14px] text-on-surface leading-relaxed whitespace-pre-line">{item.generatedDescription}</p>
                                            </div>
                                        )}

                                        {item.generatedTimestamps && (
                                            <div className="bg-surface-container-low rounded-xl p-5 border border-border-subtle/50 relative group">
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="text-[12px] md:text-[14px] text-primary uppercase font-bold tracking-wider">Video Timestamps</span>
                                                    <CopyButton text={item.generatedTimestamps} />
                                                </div>
                                                <p className="font-body-md text-[14px] text-on-surface whitespace-pre-line">{item.generatedTimestamps}</p>
                                            </div>
                                        )}

                                        {item.generatedCaption && (
                                            <div className="bg-surface-container-low rounded-xl p-5 border-l-4 border-l-secondary border-border-subtle/50 relative group">
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="text-[12px] md:text-[14px] text-secondary uppercase font-bold tracking-wider">Short-Form Caption</span>
                                                    <CopyButton text={item.generatedCaption} />
                                                </div>
                                                <p className="font-body-md text-[14px] text-on-surface italic whitespace-pre-line">{item.generatedCaption}</p>
                                            </div>
                                        )}

                                        {item.generatedHashtags && (
                                            <div className="bg-surface-container-low rounded-xl p-5 border border-border-subtle/50 relative group">
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="text-[12px] md:text-[14px] text-primary uppercase font-bold tracking-wider">Search Hashtags</span>
                                                    <CopyButton text={item.generatedHashtags} />
                                                </div>
                                                <p className="font-body-md text-[14px] text-on-surface whitespace-pre-line">{item.generatedHashtags}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Footer */}
                <footer className="flex flex-col sm:flex-row justify-between items-center w-full px-4 md:px-margin-lg py-3 border-t border-border-subtle bg-surface-dim shrink-0 gap-3 sm:gap-0 mt-8">
                    <p className="font-label-sm text-label-sm text-slate-gray">© 2026 CreatorBoost.ai. All rights reserved.</p>
                </footer>
            </div>

            {/* Delete Confirmation Modal */}
            {itemToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="glass-card w-full max-w-md rounded-2xl p-6 border border-border-subtle shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-4 mb-4 text-error">
                            <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-2xl">warning</span>
                            </div>
                            <h3 className="font-headline-sm text-xl text-on-surface">Delete Content?</h3>
                        </div>
                        <p className="text-slate-gray mb-6">
                            Are you sure you want to permanently delete this generated content? This action cannot be undone.
                        </p>
                        <div className="flex items-center justify-end gap-3">
                            <button 
                                onClick={() => setItemToDelete(null)}
                                disabled={isDeleting}
                                className="px-4 py-2 font-label-md text-label-md text-on-surface hover:bg-surface-container-high rounded-xl transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDeleteConfirm}
                                disabled={isDeleting}
                                className="px-4 py-2 font-label-md text-label-md bg-error text-white hover:bg-error/90 rounded-xl transition-colors glow-button flex items-center gap-2 disabled:opacity-50"
                            >
                                {isDeleting ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                        Delete Permanently
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default History;
