import { useEffect } from 'react';
import { Check, AlertCircle, X } from 'lucide-react';

interface Props {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 4000 }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-[68px] left-1/2 -translate-x-1/2 z-[100] animate-toast-in">
      <div className={`flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-lg border text-sm font-medium max-w-md ${
        type === 'success'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
          : 'bg-red-50 border-red-200 text-red-800'
      }`}>
        {type === 'success'
          ? <Check className="w-4 h-4 flex-shrink-0" />
          : <AlertCircle className="w-4 h-4 flex-shrink-0" />
        }
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100 transition flex-shrink-0">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
