import { Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

const GeneratedContentCard = ({ title, content }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (content) {
            navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!content) return null;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 flex justify-between items-center transition-colors">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">{title}</h3>
                <button 
                    onClick={handleCopy}
                    className="text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1 rounded-md hover:bg-indigo-50 dark:hover:bg-slate-600"
                    title="Copy to clipboard"
                >
                    {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 transition-colors">
                <p className="text-gray-800 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
            </div>
        </div>
    );
};

export default GeneratedContentCard;
