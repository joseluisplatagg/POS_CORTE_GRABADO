
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAstronaut } from '@fortawesome/free-solid-svg-icons';

const CardOpinion = (props) =>{

    return(
        <>
        <div className="relative -translate-x-1/250
                justify-center rounded-xl border border-white bg-white/45 py-4 px-6 shadow-lg shadow-black/55 
                saturate-100 backdrop-blur-xs h-auto w-64 p-3 ">
            <div className="flex flex-col items-center">
                <FontAwesomeIcon icon={faUserAstronaut} className='text-2xl text-cyan-500 font-extrabold'/> 
                <h5 className="mb-0.5 text-md pt-3 font-semibold tracking-tight text-heading">{props.nombre} </h5>
                <span className="text-xs text-justify text-black">{props.opinion}</span>
                <div className="flex items-center space-x-3 mb-6">
            {/* Añadimos suppressHydrationWarning aquí para que Next.js ignore las diferencias de animación del SVG entre servidor y cliente */}
            <div className="flex items-center space-x-1 rtl:space-x-reverse pt-2" suppressHydrationWarning>
                <svg className="w-5 h-5 animate-pulse items-center text-yellow-300" aria-hidden="true" xmlns="http://w3.org" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z"/></svg>
                <svg className="w-5 h-5 animate-pulse items-center text-yellow-300" aria-hidden="true" xmlns="http://w3.org" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z"/></svg>
                <svg className="w-5 h-5 animate-pulse items-center text-yellow-300" aria-hidden="true" xmlns="http://w3.org" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z"/></svg>
                <svg className="w-5 h-5 animate-pulse items-center text-yellow-300" aria-hidden="true" xmlns="http://w3.org" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z"/></svg>
                <svg className="w-5 h-5 animate-pulse items-center text-yellow-300" aria-hidden="true" xmlns="http://w3.org" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z"/></svg>
            </div>

            
        </div>
            </div>
        </div>
        </>
    )
}

export default CardOpinion;