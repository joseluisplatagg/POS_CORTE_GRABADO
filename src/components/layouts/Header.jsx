import React, {useState, useEffect} from 'react';
import { Link, Navigate, useNavigate } from '@tanstack/react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseChimney, faUsersViewfinder, faComputer, faPaperPlane
  , faArrowRightToBracket
  } from '@fortawesome/free-solid-svg-icons';
import logoImg from '../../../public/logo.png'

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

      setVisible(isVisible);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    /* CONTENEDOR FLOTANTE INVISIBLE: Controla la posición fija y la animación de ocultar */
    <div 
      className={`fixed top-0 left-0 right-0 z-50 w-full p-4 transition-transform duration-300 flex justify-center bg-transparent pointer-events-none
        ${visible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      {/* LA CÁPSULA OVALADA (Fondo Emerald 900 garantizado) */}
      {/* 
       */}
    </div>
  );
};

export default Header;