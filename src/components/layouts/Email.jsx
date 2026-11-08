import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faCommentAlt, faPen } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
const Email = () =>{
    const [formData, setFormData] = useState({
            emailTo: '',
            subject: '',
            message: ''
            });
    

    const handleChange = (e) => {
    const { id, value } = e.target;
    
    setFormData((prevData) => ({
        ...prevData,
        [id]: value // Actualiza dinámicamente el campo según el 'id' del input (emailTo, subject o message)
    }));
    };

    const handleSubmit = async (e) => {
    // 1. Evita que la página se recargue (El comportamiento "normal" de HTML)
    e.preventDefault(); 

    // Opcional: Activar un estado de carga (loading) aquí
    
    };


    return (
        <form onSubmit={handleSubmit} className='pt-35 pb-10 flex flex-col items-center justify-center w-full max-w-md mx-auto'>
            <div className="mb-10">                
                <h2 className="text-3xl md:text-5xl font-black text-cyan-900 dark:text-emerald-900/70  mt-3 mb-4">
                ¡Envíanos un correo!
                </h2>
            </div>

            {/* SECCIÓN: DETALLES DEL MENSAJE */}
            <div className='w-full flex flex-col gap-4 mb-6'>
                <span className='text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-1'>
                Información del Correo
                </span>

                {/* Destinatario (Para) */}
                <div className='flex items-center w-full'>
                <FontAwesomeIcon className='pr-2 text-2xl text-emerald-900 w-8 text-center' icon={faEnvelope} />
                <input 
                    className='h-9 w-full border border-gray-300 hover:text-emerald-900 placeholder:text-emerald-900 rounded-md shadow-lg shadow-emerald-900/10 focus:outline-none focus:ring-1 focus:ring-emerald-900 focus:border-emerald-900 sm:text-sm px-3' 
                    placeholder='Correo Electronico' type='email' id='emailTo' value={formData.emailTo} onChange={handleChange} required 
                />
                </div>

                {/* Asunto */}
                <div className='flex items-center w-full'>
                <FontAwesomeIcon className='pr-2 text-2xl text-emerald-900 w-8 text-center' icon={faPen} />
                <input 
                    className='h-9 w-full border border-gray-300 hover:text-emerald-900 placeholder:text-emerald-900 rounded-md shadow-lg shadow-emerald-900/10 focus:outline-none focus:ring-1 focus:ring-emerald-900 focus:border-emerald-900 sm:text-sm px-3' 
                    placeholder='Asunto' type='text' id='subject' value={formData.subject} onChange={handleChange} required 
                />
                </div>

                {/* Mensaje (Textarea) */}
                <div className='flex items-start w-full'>
                <FontAwesomeIcon className='pr-2 pt-2 text-2xl text-emerald-900 w-8 text-center' icon={faCommentAlt} />
                <textarea 
                    className='w-full min-h-[120px] border border-gray-300 hover:text-emerald-900 placeholder:text-emerald-900 rounded-md shadow-lg shadow-emerald-900/10 focus:outline-none focus:ring-1 focus:ring-emerald-900 focus:border-emerald-900 sm:text-sm p-3 resize-none' 
                    placeholder='Escribe tu mensaje aquí...' id='message' value={formData.message} onChange={handleChange} required 
                />
                </div>
            </div>

            {/* Botón de envío */}
            <button 
                type='submit' 
                className='w-full h-10 bg-emerald-900 hover:bg-emerald-800 text-white font-medium rounded-md shadow-lg shadow-emerald-950/20 transition-colors duration-200 sm:text-sm'
            >
                Enviar Mensaje
            </button>
        </form>

    );
}

export default Email;