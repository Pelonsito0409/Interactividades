
import React from 'react';

interface InfoCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, children, className }) => {
  return (
    <div className={`bg-slate-800 shadow-xl rounded-lg p-6 ${className || ''}`}>
      {title && <h3 className="text-xl font-semibold text-sky-400 mb-4">{title}</h3>}
      <div className="text-slate-300 space-y-2">
        {children}
      </div>
    </div>
  );
};

export default InfoCard;
    