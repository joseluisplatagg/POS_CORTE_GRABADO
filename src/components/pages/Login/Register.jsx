import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUserTag, faMobileScreenButton, faEnvelope, faLock
 ,faHospitalUser, faCakeCandles } from '@fortawesome/free-solid-svg-icons';

export default function Register() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  // Estados del formulario
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    age: '',
    patientName: '',
    password: ''
  })

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Aquí ejecutarías tu mutación o petición fetch hacia el backend
      console.log('Datos enviados al servidor:', formData)
      
      // Tras el registro exitoso, rediriges al login o dashboard
      // navigate({ to: '/login' })
    } catch (error) {
      console.error('Error en el registro:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='pt-35 pb-10 flex flex-col items-center justify-center w-full max-w-md mx-auto'>
      <h2 className='text-2xl font-bold text-gray-800 mb-2'>Crear Cuenta</h2>
      <p className='text-sm text-gray-600 text-center mb-8 px-4'>
        Regístrate para gestionar tus citas médicas y el historial de tus pacientes.
      </p>

      {/* SECCIÓN 1: DATOS DE LA CUENTA (TUTOR / USUARIO) */}
      <div className='w-full flex flex-col gap-4 mb-6'>
        <span className='text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-1'>
          Datos del Usuario / Titular
        </span>

        {/* Nombres */}
        <div className='flex items-center w-full'>
          <FontAwesomeIcon className='pr-2 text-2xl text-emerald-900 w-8 text-center' icon={faUser} />
          <input 
            className='h-9 w-full border border-gray-300 hover:text-emerald-900 placeholder:text-emerald-900 rounded-md shadow-lg shadow-emerald-900/10 focus:outline-none focus:ring-1 focus:ring-emerald-900 focus:border-emerald-900 sm:text-sm px-3' 
            placeholder='Nombres' type='text' id='firstName' value={formData.firstName} onChange={handleChange} required 
          />
        </div>

        {/* Apellidos */}
        <div className='flex items-center w-full'>
          <FontAwesomeIcon className='pr-2 text-2xl text-emerald-900 w-8 text-center' icon={faUserTag} />
          <input 
            className='h-9 w-full border border-gray-300 hover:text-emerald-900 placeholder:text-emerald-900 rounded-md shadow-lg shadow-emerald-900/10 focus:outline-none focus:ring-1 focus:ring-emerald-900 focus:border-emerald-900 sm:text-sm px-3' 
            placeholder='Apellidos' type='text' id='lastName' value={formData.lastName} onChange={handleChange} required 
          />
        </div>

        {/* Teléfono Móvil */}
        <div className='flex items-center w-full'>
          <FontAwesomeIcon className='pr-2 text-2xl text-emerald-900 w-8 text-center' icon={faMobileScreenButton} />
          <input 
            className='h-9 w-full border border-gray-300 hover:text-emerald-900 placeholder:text-emerald-900 rounded-md shadow-lg shadow-emerald-900/10 focus:outline-none focus:ring-1 focus:ring-emerald-900 focus:border-emerald-900 sm:text-sm px-3' 
            placeholder='Teléfono Móvil' type='tel' id='mobile' value={formData.mobile} onChange={handleChange} required 
          />
        </div>

        {/* Correo Electrónico */}
        <div className='flex items-center w-full'>
          <FontAwesomeIcon className='pr-2 text-2xl text-emerald-900 w-8 text-center' icon={faEnvelope} />
          <input 
            className='h-9 w-full border border-gray-300 hover:text-emerald-900 placeholder:text-emerald-900 rounded-md shadow-lg shadow-emerald-900/10 focus:outline-none focus:ring-1 focus:ring-emerald-900 focus:border-emerald-900 sm:text-sm px-3' 
            placeholder='Correo Electrónico' type='email' id='email' value={formData.email} onChange={handleChange} required 
          />
        </div>

        {/* Contraseña de acceso */}
        <div className='flex items-center w-full'>
          <FontAwesomeIcon className='pr-2 text-2xl text-emerald-900 w-8 text-center' icon={faLock} />
          <input 
            className='h-9 w-full border border-gray-300 hover:text-emerald-900 placeholder:text-emerald-900 rounded-md shadow-lg shadow-emerald-900/10 focus:outline-none focus:ring-1 focus:ring-emerald-900 focus:border-emerald-900 sm:text-sm px-3' 
            placeholder='Contraseña de acceso' type='password' id='password' value={formData.password} onChange={handleChange} required 
          />
        </div>
      </div>

      {/* SECCIÓN 2: DATOS DEL PACIENTE */}
      <div className='w-full flex flex-col gap-4 mb-6'>
        <span className='text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-1'>
          Información del Paciente
        </span>

        {/* Nombre del Paciente */}
        <div className='flex items-center w-full'>
          <FontAwesomeIcon className='pr-2 text-2xl text-emerald-900 w-8 text-center' icon={faHospitalUser} />
          <input 
            className='h-9 w-full border border-gray-300 hover:text-emerald-900 placeholder:text-emerald-900 rounded-md shadow-lg shadow-emerald-900/10 focus:outline-none focus:ring-1 focus:ring-emerald-900 focus:border-emerald-900 sm:text-sm px-3' 
            placeholder='Nombre Completo del Paciente' type='text' id='patientName' value={formData.patientName} onChange={handleChange} required 
          />
        </div>

        {/* Edad del Paciente */}
        <div className='flex items-center w-full'>
          <FontAwesomeIcon className='pr-2 text-2xl text-emerald-900 w-8 text-center' icon={faCakeCandles} />
          <input 
            className='h-9 w-full border border-gray-300 hover:text-emerald-900 placeholder:text-emerald-900 rounded-md shadow-lg shadow-emerald-900/10 focus:outline-none focus:ring-1 focus:ring-emerald-900 focus:border-emerald-900 sm:text-sm px-3' 
            placeholder='Edad del Paciente' type='number' min='0' max='120' id='age' value={formData.age} onChange={handleChange} required 
          />
        </div>
      </div>

      {/* Botón de envío principal */}
      <button 
        className='mt-4 border rounded-full w-44 h-10 font-bold border-gray-300 text-white shadow-lg shadow-emerald-900 focus:outline-none focus:ring-emerald-900 focus:border-emerald-900 sm:text-sm bg-emerald-900 hover:text-emerald-900 hover:bg-white transition-colors cursor-pointer' 
        type='submit' 
        disabled={isLoading}
      >
        {isLoading ? 'Registrando...' : 'Finalizar Registro'}
      </button>

      {/* Enlace para regresar al login */}
      <div className='w-full flex justify-center items-center text-center mt-6'>
        <p className='text-sm text-gray-600 m-0 flex items-center gap-1 justify-center'>
          <span>¿Ya tienes una cuenta?</span>
          <button
            type='button'
            onClick={() => navigate({ to: '/login' })}
            className='font-bold text-emerald-900 hover:text-emerald-900 hover:underline bg-transparent border-none cursor-pointer focus:outline-none p-0 inline-block'
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </form>
  )
}
