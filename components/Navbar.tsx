
import React from 'react';
import { Link } from 'react-router-dom';
import { EiffelIcon } from './Icons';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center">
            <EiffelIcon />
            <span className="text-2xl font-extrabold tracking-tighter text-white">
              PARIS <span className="text-[#89CFF0]">3</span>
            </span>
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-xs font-bold tracking-widest hover:text-[#89CFF0] transition-colors">INÍCIO</Link>
            <Link to="/estoque" className="text-xs font-bold tracking-widest hover:text-[#89CFF0] transition-colors">ESTOQUE</Link>
            <a href="#contato" className="text-xs font-bold tracking-widest hover:text-[#89CFF0] transition-colors">CONTATO</a>

            <div className="w-[1px] h-4 bg-zinc-800 mx-2"></div>

            <Link to="/admin" className="text-zinc-600 hover:text-[#89CFF0] transition-colors" title="Área do Administrador">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </Link>

            <Link to="/estoque" className="bg-[#89CFF0] text-zinc-950 px-6 py-2 rounded-full font-bold text-sm hover:bg-[#78BFDF] transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(137,207,240,0.2)]">
              VER OFERTAS
            </Link>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <Link to="/admin" className="text-zinc-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </Link>
            <button className="text-white p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
