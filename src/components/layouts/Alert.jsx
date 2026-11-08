 import React, { useState } from 'react';

     const Alert = ({ message, type = 'info', onClose }) => {
       const [isVisible, setIsVisible] = useState(true);

       const handleClose = () => {
         setIsVisible(false);
         if (onClose) {
           onClose();
         }
       };

       if (!isVisible) return null;

       let bgColorClass;
       let textColorClass;

       switch (type) {
         case 'success':
           bgColorClass = 'bg-green-100 border-green-400 text-green-700';
           textColorClass = 'text-green-700';
           break;
         case 'warning':
           bgColorClass = 'bg-yellow-100 border-yellow-400 text-yellow-700';
           textColorClass = 'text-yellow-700';
           break;
         case 'error':
           bgColorClass = 'bg-red-100 border-red-400 text-red-700';
           textColorClass = 'text-red-700';
           break;
         default: // info
           bgColorClass = 'bg-blue-100 border-blue-400 text-blue-700';
           textColorClass = 'text-blue-700';
       }

       return (
         <div className={`p-4 border-l-4 ${bgColorClass} rounded-md shadow-md mb-4 flex justify-between items-center`} role="alert">
           <p className={`font-bold ${textColorClass}`}>{message}</p>
           {onClose && (
             <button
               onClick={handleClose}
               className={`ml-4 ${textColorClass} hover:opacity-75 focus:outline-none`}
             >
               &times;
             </button>
           )}
         </div>
       );
     };

     export default Alert;