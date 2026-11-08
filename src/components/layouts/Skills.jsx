import { useState } from "react";

// 1. Tu arreglo unificado de tecnologías (puedes meter las 40 aquí directamente)
const listadoTecnologias = [
  {
    id: 1,
    iconoClass: "devicon-csharp-plain-wordmark",
    hoverColor: "hover:text-indigo-800",
    conceptos: "• POO • MVC • MVVM • CAPAS • INTERFAZ • FACTORY • SINGLETON • STRATEGY • CLEAN ARQ",
    textSize: "ssm:text-[10px]"
  },
  {
    id: 2,
    iconoClass: "devicon-dotnetcore-plain",
    hoverColor: "hover:text-indigo-800",
    conceptos: "• APIREST • ADO.NET • ASPX • WS • WCF • WPF • WINFORMS • XAMARIN • MAUI • DAPPER • JWT • SWAGGER",
    textSize: "ssm:text-[10px]"
  },
  {
    id: 3,
    iconoClass: "devicon-visualbasic-plain",
    hoverColor: "hover:text-indigo-800",
    conceptos: "• WINFORMS • ASPX • VBA",
    textSize: "ssm:text-[15px]"
  },
  {
    id: 4,
    iconoClass: "devicon-nodejs-plain-wordmark",
    hoverColor: "hover:text-green-400",
    conceptos: "• API • JWT • EXPRESS • PRISMA ORM • REVERSE PROXY",
    textSize: "ssm:text-[15px]"
  },
   {
    id: 5,
    iconoClass: "devicon-react-original-wordmark",
    hoverColor: "hover:text-blue-500",
    conceptos: "• HOOKS • COMPONENTS • REQUEST/RESPONSE • MAQUETACION • TANSTANK",
    textSize: "ssm:text-[10px]"
  },
  {
    id: 6,
    iconoClass: "devicon-angularjs-plain-wordmark",
    hoverColor: "hover:hover:text-red-900 ",
    conceptos: "• MVC • SCOPE • ROOTSCOPE • DIRECTIVAS",
    textSize: "ssm:text-[10px]"
  },
  {
    id: 7,
    iconoClass: "devicon-javascript-plain",
    hoverColor: "hover:text-yellow-300 ",
    conceptos: "REQUEST/RESPONSE • FUNCIONES • ESTRUCTURAS DE DATOS",
    textSize: "ssm:text-[15px]"
  },
  {
    id: 8,
    iconoClass: "devicon-bootstrap-plain-wordmark",
    hoverColor: "hover:text-indigo-900",
    conceptos: " ",
    textSize: "ssm:text-[15px]"
  },
   {
    id: 9,
    iconoClass: "devicon-microsoftsqlserver-plain-wordmark",
    hoverColor: "hover:text-red-900",
    conceptos: "• DML • DDL • STORE PROCEDURES • CURSORES • TABLAS TEMPORALES • TRIGGERS • SUBCONSULTAS • RESPALDOS",
    textSize: "ssm:text-[10px]"
  },
  {
    id: 10,
    iconoClass: "devicon-oracle-original",
    hoverColor: "hover:hover:text-red-900 ",
    conceptos: "• DML • DDL • STORE PROCEDURES • CURSORES • SUBCONSULTAS",
    textSize: "ssm:text-[10px]"
  },
  {
    id: 11,
    iconoClass: "devicon-sqlite-plain-wordmark",
    hoverColor: "hover:text-blue-500",
    conceptos: "• CONFIGURACION • DDL • DML",
    textSize: "ssm:text-[15px]"
  },
  {
    id: 12,
    iconoClass: "devicon-mongodb-plain-wordmark",
    hoverColor: "hover:text-green-300",
    conceptos: "• CRUD • FILTROS • DOCUMENTAL • CONFIGURACION EN DOCKER",
    textSize: "ssm:text-[10px]"
  },
   {
    id: 13,
    iconoClass: "devicon-docker-plain-wordmark",
    hoverColor: "hover:text-blue-400",
    conceptos: "• IMAGES • DOCKERFILES • VOLUMES • COMPOSE • CONFIGURACIONES",
    textSize: "ssm:text-[10px]"
  },
  {
    id: 14,
    iconoClass: "devicon-git-plain-wordmark",
    hoverColor: "hover:text-orange-900",
    conceptos: "• GITLAB • GITHUB • COMMIT • BRANCH • PUSH • PULL • CLONE • REBASE",
    textSize: "ssm:text-[10px]"
  },
  {
    id: 15,
    iconoClass: "devicon-azure-plain-wordmark",
    hoverColor: "hover:text-cyan-400",
    conceptos: "• DEVOPS • WEBAPPS • ACR • SERVICE BUS • APP SERVICES • KEY VAULT",
    textSize: "ssm:text-[15px]"
  },
  {
    id: 16,
    iconoClass: "devicon-amazonwebservices-plain-wordmark",
    hoverColor: "hover:text-yellow-400",
    conceptos: "• EC2 • BUCKET • AMPLIFY • NoSQL • SQL",
    textSize: "ssm:text-[15px]"
  },
  
];

const SkillsComponent = () => {
     const [flippedCards, setFlippedCards] = useState([]);

  const toggleFlip = (id) => {
    setFlippedCards((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 ssm:px-8">
      {/* 
        CLAVE: 
        - ssm:grid-cols-2 -> 2 columnas en pantallas muy pequeñas (teléfonos)
        - sm:grid-cols-3  -> 3 columnas en pantallas medianas cortas
        - md:grid-cols-4  -> 4 COLUMNAS EXACTAS en escritorio (crea filas automáticas de 4)
      */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8 justify-items-center">
        
        {listadoTecnologias.map((tech) => {
          const isFlipped = flippedCards.includes(tech.id);

          return (
            <div 
              key={tech.id} 
              className="w-64 h-50 ssm:w-40 ssm:h-40 sm:w-32 sm:h-32 sm:text-xs perspective-1000 cursor-pointer"
              onClick={() => toggleFlip(tech.id)}
            >
              <div className={`relative w-full h-full transition-transform duration-800 transform-3d ${
                isFlipped ? 'transform-[rotateY(180deg)]' : 'transform-[rotateY(0deg)]'
              }`}>
                
                {/* Cara Frontal */}
                <div className={`absolute w-full h-full bg-cyan-900 text-amber-200 ${tech.hoverColor} overflow-hidden shadow-amber-100 rounded-lg shadow-md flex items-center justify-center backface-hidden`}>
                  <i className={`${tech.iconoClass} md:text-8xl ssm:text-7xl`}></i>
                </div>
                
                {/* Cara Posterior */}
                <div className="absolute w-full h-full bg-teal-800 rounded-lg shadow-md flex items-center justify-center text-white transform rotate-y-180 backface-hidden">
                  <p className={`px-2 text-center ${tech.textSize} leading-relaxed`}>
                    {tech.conceptos}
                  </p>
                </div>

              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default SkillsComponent;