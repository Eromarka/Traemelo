import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

// Lazy load pages
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Profile = lazy(() => import('./pages/Profile'));
const Cart = lazy(() => import('./pages/Cart').then(m => ({ default: m.Cart })));
const ProductDetails = lazy(() => import('./pages/ProductDetails').then(m => ({ default: m.ProductDetails })));
const BusinessDirectory = lazy(() => import('./pages/BusinessDirectory').then(m => ({ default: m.BusinessDirectory })));
const Notifications = lazy(() => import('./pages/Notifications').then(m => ({ default: m.Notifications })));
const SearchResults = lazy(() => import('./pages/SearchResults').then(m => ({ default: m.SearchResults })));
const Checkout = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const Splash = lazy(() => import('./pages/Splash').then(m => ({ default: m.Splash })));
const Onboarding = lazy(() => import('./pages/Onboarding').then(m => ({ default: m.Onboarding })));
const Orders = lazy(() => import('./pages/Orders').then(m => ({ default: m.Orders })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const Concierge = lazy(() => import('./pages/Concierge').then(m => ({ default: m.Concierge })));
const RegisterBusiness = lazy(() => import('./pages/RegisterBusiness').then(m => ({ default: m.RegisterBusiness })));
const Tracking = lazy(() => import('./pages/Tracking').then(m => ({ default: m.Tracking })));
const BusinessDashboard = lazy(() => import('./pages/BusinessDashboard').then(m => ({ default: m.BusinessDashboard })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AddProduct = lazy(() => import('./pages/AddProduct').then(m => ({ default: m.AddProduct })));
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MerchantRoute } from './components/auth/MerchantRoute';
import { AdminRoute } from './components/auth/AdminRoute';

const LoadingFallback = () => (
  <div className="min-h-screen aurora-bg flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg shadow-primary/20"></div>
  </div>
);



const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="w-full"
  >
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Splash /></PageWrapper>} />
          <Route path="/home" element={<ProtectedRoute><PageWrapper><Home /></PageWrapper></ProtectedRoute>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />

          <Route path="/profile" element={
            <ProtectedRoute>
              <PageWrapper>
                  <Profile />
              </PageWrapper>
            </ProtectedRoute>
          } />

          <Route path="/cart" element={<ProtectedRoute><PageWrapper><Cart /></PageWrapper></ProtectedRoute>} />
          <Route path="/product" element={<PageWrapper><ProductDetails /></PageWrapper>} />
          <Route path="/directory" element={<PageWrapper><BusinessDirectory /></PageWrapper>} />
          <Route path="/notifications" element={<ProtectedRoute><PageWrapper><Notifications /></PageWrapper></ProtectedRoute>} />
          <Route path="/search" element={<PageWrapper><SearchResults /></PageWrapper>} />
          <Route path="/orders" element={<ProtectedRoute><PageWrapper><Orders /></PageWrapper></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><PageWrapper><Checkout /></PageWrapper></ProtectedRoute>} />
          <Route path="/splash" element={<PageWrapper><Splash /></PageWrapper>} />
          <Route path="/onboarding" element={<PageWrapper><Onboarding /></PageWrapper>} />
          <Route path="/concierge" element={<ProtectedRoute><PageWrapper><Concierge /></PageWrapper></ProtectedRoute>} />
          <Route path="/register-business" element={<PageWrapper><RegisterBusiness /></PageWrapper>} />
          <Route path="/tracking/:orderId" element={<ProtectedRoute><PageWrapper><Tracking /></PageWrapper></ProtectedRoute>} />
          <Route path="/business/dashboard" element={<MerchantRoute><PageWrapper><BusinessDashboard /></PageWrapper></MerchantRoute>} />
          <Route path="/business/add-product" element={<MerchantRoute><PageWrapper><AddProduct /></PageWrapper></MerchantRoute>} />
          <Route path="/admin/dashboard" element={<AdminRoute><PageWrapper><AdminDashboard /></PageWrapper></AdminRoute>} />
          <Route path="*" element={<PageWrapper><Home /></PageWrapper>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <GlobalWidgets theme={theme} setTheme={setTheme} />
        <div className="min-h-screen aurora-bg font-inter overflow-x-hidden">
          <AnimatedRoutes />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

function GlobalWidgets({ theme, setTheme }: { theme: 'dark' | 'light', setTheme: (t: 'dark' | 'light') => void }) {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {/* WhatsApp Feedback Floating Button */}
      <button
        onClick={() => {
          const msg = encodeURIComponent("¡Hola Eduardo! Tengo un comentario/sugerencia sobre Traemelo: ");
          window.open(`https://wa.me/584247810500?text=${msg}`, '_blank');
        }}
        className="fixed bottom-36 right-6 z-[100] w-12 h-12 rounded-2xl bg-[#25D366]/20 backdrop-blur-xl flex items-center justify-center shadow-2xl border border-[#25D366]/40 active:scale-95 transition-all group overflow-hidden"
        aria-label="WhatsApp Feedback"
      >
        <div className="absolute inset-0 bg-[#25D366]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
          alt="WA" 
          className="w-6 h-6 drop-shadow-[0_0_8px_rgba(37,211,102,0.5)]" 
        />
        <div className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </div>
      </button>

      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="fixed bottom-20 right-6 z-[100] w-12 h-12 rounded-2xl glass-card-intense flex items-center justify-center shadow-lg border border-white/10 active:scale-95 transition-all"
        aria-label="Toggle theme"
      >
        <span className="material-symbols-outlined text-primary text-2xl">
          {theme === 'dark' ? 'light_mode' : 'dark_mode'}
        </span>
      </button>

      {profile?.role === 'admin' && (
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="fixed bottom-[13rem] right-6 z-[100] w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 border border-white/20 active:scale-95 transition-all"
          aria-label="Admin Dashboard"
        >
          <span className="material-symbols-outlined text-black text-2xl font-bold">
            admin_panel_settings
          </span>
        </button>
      )}
    </>
  );
}

export default App;
