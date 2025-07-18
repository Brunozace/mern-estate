import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import React from 'react'

const Header = () => {
    return (
        <header className='bg-slate-200 shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                <div className="h-16 flex items-center overflow-hidden">
                <Link to="/">
                    <img src="/logo.png" alt="Doble Gestión Propiedades Logo" className="h-80 scale-50 object-contain" />
                </Link>
                </div>
                <form className='bg-slate-100 p-3 rounded-lg flex items-center'>
                    <input type='text' placeholder='Buscar...' className='bg-transparent focus:outline-none w-24 sm:w-64' />
                    <FaSearch className='text-slate-600' />
                </form>
                <ul className='flex gap-4'>
                    <Link to="/">
                        <li className='hidden sm:inline text-slate-700 hover:underline'>Principal</li>
                    </Link>
                    <Link to="/about">
                        <li className='hidden sm:inline text-slate-700 hover:underline'>Sobre Nosotros</li>
                    </Link>
                    <Link to="/sign-in">
                        <li className='text-slate-700 hover:underline'>Iniciar Sesion</li>
                    </Link>
                </ul>
            </div>
        </header>
    )
}

export default Header
