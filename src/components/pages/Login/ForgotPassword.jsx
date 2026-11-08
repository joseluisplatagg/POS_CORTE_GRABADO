
import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faEnvelope  } from '@fortawesome/free-solid-svg-icons';

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false) // Estado para controlar si ya se envió el correo
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Aquí harías tu petición fetch/axios o mutación de TanStack Query
      // await sendRecoveryEmail(email)
      setIsSent(true)
    } catch (error) {
      console.error("Error al enviar el correo", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Vista de éxito 
  if (isSent) {
    return (
      <div className='pt-55 pb-10 flex flex-col items-center justify-center w-full text-center max-w-sm mx-auto gap-4'>
        <FontAwesomeIcon className='text-5xl text-emerald-600 animate-bounce' icon={faPaperPlane} />
        <h2 className='text-xl font-bold text-gray-800'>¡Correo Enviado!</h2>
        <p className='text-sm text-gray-600'>
          Si la cuenta <strong>{email}</strong> existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña en unos minutos.
        </p>
        <button 
          onClick={() => navigate({ to: '/login' })}
          className='mt-4 border rounded-full w-40 h-10 font-bold border-emerald-900 text-emerald-900 bg-white hover:bg-emerald-50 transition-colors cursor-pointer'
        >
          Volver al Login
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='pt-35 pb-10 flex flex-col items-center justify-center w-full'>
      <h2 className='text-xl font-bold text-gray-800 mb-2'>Recuperar Contraseña</h2>
      <p className='text-sm text-gray-600 max-w-xs text-center mb-6'>
        Introduce tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
      </p>

      {/* Campo de Correo Electrónico */}
      <div className='flex items-center justify-center w-full max-w-sm'>
        <FontAwesomeIcon 
          className='pr-2 text-3xl text-emerald-900' 
          icon={faEnvelope}
        />
        <input 
          className='h-9 w-full border border-gray-300 hover:text-emerald-900 placeholder:text-emerald-900 rounded-md shadow-lg shadow-emerald-900 focus:outline-none focus:ring-emerald-900 focus:border-emerald-900 sm:text-sm' 
          placeholder='Correo Electrónico'
          type="email" 
          id='recoveryEmail'
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
      </div>

      {/* Botón de Enviar */}
      <button 
        className='mt-7 border rounded-full w-44 h-10 font-bold border-gray-300 text-white shadow-lg shadow-emerald-900 focus:outline-none focus:ring-emerald-900 focus:border-emerald-900 sm:text-sm bg-emerald-900 hover:text-emerald-900 hover:bg-white transition-colors cursor-pointer' 
        type="submit" 
        disabled={isLoading}
      >
        {isLoading ? 'Enviando...' : 'Enviar Instrucciones'}
      </button>

      {/* Enlace para volver atrás */}
      <div className='w-full max-w-sm flex justify-center items-center text-center mt-6'>
        <button
          type="button"
          onClick={() => navigate({ to: '/login' })}
          className='text-sm font-semibold text-emerald-900 hover:text-emerald-900 hover:underline bg-transparent border-none cursor-pointer focus:outline-none'
        >
          ← Regresar al inicio de sesión
        </button>
      </div>
    </form>
  )
}
