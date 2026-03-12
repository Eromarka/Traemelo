export const Navbar = () => {
    return (
        <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <img src="/assets/logo.png" alt="Logo" className="h-6 w-auto" />
                <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4facfe] to-[#8E2DE2]">Traemelo</span>
            </div>
            <div className="flex items-center gap-4">
                {/* Aquí irán los iconos del carrito y perfil */}
            </div>
        </nav>
    );
};
