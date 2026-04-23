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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{title}</h3>
                <button 
                    onClick={handleCopy}
                    className="text-gray-400 hover:text-indigo-600 transition-colors p-1 rounded-md hover:bg-indigo-50"
                    title="Copy to clipboard"
                >
                    {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
            </div>
            <div className="p-4 bg-white">
                <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
            </div>
        </div>
    );
};

export default GeneratedContentCard;
