import { Carousel } from "flowbite-react";
import ImgCase from '/CaseSolutions.png'
import ImgAmerican from '/lixil.jpeg'
import ImgNec from '/public/nec.png'
import ImgHir from '/public/hir.jpeg'

const listadoProyectos = [
  {
    id: 1,
    titulo: "Proyecto: Ferrovalle (13/09/2024 - 01/10/2025)",
    descripcion: "Actualizaciones al Sistema Web así como implementaciones para mejorar la eficiencia de procesos internos. Frontend en MVC, Backend Clean Arq. y Factory Pattern.",
    imagenUrl: ImgCase,
    altImg: "Logo Ferrovalle",
    tecnologias: ["csharp-plain", "angularjs-plain-wordmark", "microsoftsqlserver-plain", "dot-net-plain-wordmark"]
  },
  {
    id: 2,
    titulo: "Proyecto: SEMARNAT (13/09/2022 - 13/09/2024)",
    descripcion: "Migración de sistema interno desarrollado en Genexus a tecnologías OpenSource. Desarrollo de Backend (ApiRest) para la integración de una arquitectura de microservicios, Apoyo en Frontend.",
    imagenUrl: ImgCase,
    altImg: "Logo SEMARNAT",
    tecnologias: ["dotnetcore-plain", "react-original-wordmark", "oracle-original", "mongodb-plain-wordmark", "docker-plain-wordmark", "git-plain-wordmark", "nodejs-plain-wordmark", "csharp-plain"]
  },
  {
    id: 3,
    titulo: "Proyecto: Operación",
    descripcion: "Apartado para la administración de las certificaciones de los productos.",
    imagenUrl: ImgAmerican,
    altImg: "Logo Operación",
    tecnologias: ["csharp-plain", "xamarin-original-wordmark", "microsoftsqlserver-plain", "oracle-original"]
  },
  {
    id: 4,
    titulo: "Proyecto: Recursos Humanos",
    descripcion: "Sistema para registrar ideas de los empleados para apoyar los procesos en los que trabajan a diario, programas de premios, etc.",
    imagenUrl: ImgAmerican,
    altImg: "Logo Recursos Humanos",
    tecnologias: ["csharp-plain", "dot-net-plain-wordmark", "microsoftsqlserver-plain", "oracle-original"]
  },
  {
    id: 5,
    titulo: "Proyecto: Finanzas",
    descripcion: "Actualización a módulos de reportería del departamento de Finanzas con campos específicos y gráficas de apoyo.",
    imagenUrl: ImgAmerican,
    altImg: "Logo Finanzas",
    tecnologias: ["csharp-plain", "dot-net-plain-wordmark", "microsoftsqlserver-plain", "oracle-original"]
  },
  {
    id: 6,
    titulo: "Proyecto: Facturación",
    descripcion: "Implementación de Macros y reportes automatizados de estadística y probabilidad.",
    imagenUrl: ImgNec,
    altImg: "Logo Facturación",
    tecnologias: ["visualbasic-plain", "windows8-original", "microsoftsqlserver-plain"]
  },
  {
    id: 7,
    titulo: "Proyecto: Liquidación",
    descripcion: "Implementación de requerimiento a sistema legado para la simulación de liquidaciones.",
    imagenUrl: ImgHir,
    altImg: "Logo Facturación",
    tecnologias:["dotnetcore-plain", "react-original-wordmark", "docker-plain-wordmark", "git-plain-wordmark",  "csharp-plain"]
  },
  {
    id: 8,
    titulo: "Proyecto: Escrituración",
    descripcion: "Digitalización de proceso de escrituración aplicando Clean Architecuture, DDD, Micoservicios y trabajo en segundo plano.",
    imagenUrl: ImgHir,
    altImg: "Logo Facturación",
    tecnologias: ["dotnetcore-plain", "react-original-wordmark", "docker-plain-wordmark", "git-plain-wordmark",  "csharp-plain"]
  }
  ,
  {
    id: 9,
    titulo: "Proyecto: Onboarding",
    descripcion: "Implementación de Sistema de Onboarding para la captación de prospectos ademas de la integración con Salesforce",
    imagenUrl: ImgHir,
    altImg: "Logo Facturación",
    tecnologias:["dotnetcore-plain", "react-original-wordmark", "docker-plain-wordmark", "git-plain-wordmark",  "csharp-plain"]
  }
];

const JobsComponent = () =>{
    return(          
        <>
        {/* 1. PADRE: Ajustado para que el desborde de pantalla completa funcione de forma limpia */}
        <div className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 h-[540px] md:h-112.5 overflow-hidden">
            
            {/* 2. CAROUSEL: Quitamos el "theme" anterior si causaba este desfase extremo */}
            <Carousel 
                className="w-full h-full" 
                slide={true}
                slideInterval={3000}
                // Fuerza a que los items inactivos usen el sistema absoluto nativo de Flowbite
                theme={{ item: { base: "relative" } }}
            >
                {listadoProyectos.map((proyecto) => (
                    /* 3. HIJO DIRECTO: Eliminamos márgenes raros. Añadimos flex, items-center y justify-center */
                    <div 
                        key={proyecto.id} 
                        className="flex h-full w-full items-center justify-center px-4 md:px-12"
                    >
                        {/* 4. TU TARJETA INTERNA: Forzamos una altura exacta (h-[85%] o h-[90%]) 
                            para dejarle espacio abajo a los puntos indicadores de Flowbite sin que se encimen */}
                        <div className="w-full max-w-5xl h-[85%] flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-xl shadow-cyan-950/50  border border-cyan-800/30 backdrop-blur-xs transition-all duration-300 hover:border-cyan-500/40">
                            
                            {/* LADO IZQUIERDO: Imagen de la Empresa */}
                            <div className="w-full md:w-1/3 min-h-40 md:h-full relative bg-linear-to-r  flex items-center justify-center">
                                <img 
                                    src={proyecto.imagenUrl} 
                                    alt={proyecto.altImg} 
                                    className="w-full h-full object-contain mix-blend-multiply absolute inset-0" 
                                />
                            </div>

                            {/* LADO DERECHO: Información del Proyecto */}
                            <div className="w-full md:w-2/3 p-6 flex flex-col justify-between bg-linear-to-r from-emerald-950 via-emerald-800 to-cyan-700 h-full">
                                <div className="space-y-3"> {/* Agrega separación interna constante entre título y descripción */}
    
                                {/* TÍTULO MEJORADO: Más grande en pantallas medianas/grandes y con tracking ajustado */}
                                <h3 className="font-bold text-xl md:text-3xl text-cyan-400 tracking-tight leading-tight">
                                    {proyecto.titulo}
                                </h3>
                                
                                {/* DESCRIPCIÓN MEJORADA: Texto balanceado (text-base a text-lg), color más limpio y line-clamp controlado */}
                                <p className="text-emerald-100/90 text-base md:text-lg leading-relaxed line-clamp-3 md:line-clamp-5">
                                    {proyecto.descripcion}
                                </p>

                            </div>


                                {/* Listado de Tecnologías (Píldoras) */}
                                <div className="flex flex-wrap gap-2 text-cyan-300 pt-2 border-t border-emerald-800/30">
                                    {proyecto.tecnologias.map((tech, index) => (
                                        <span key={index} className="inline-block bg-cyan-950/50 rounded-full px-2 py-1 text-sm font-semibold border border-cyan-700/30">
                                            <i className={`devicon-${tech} text-3xl`}></i>
                                        </span>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </Carousel>
        </div>

        </>
    )
}

export default JobsComponent;