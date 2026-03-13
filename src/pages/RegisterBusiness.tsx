import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { localCategories } from '../data/localData';
import { useAuth } from '../contexts/AuthContext';

interface FormData {
    business_name: string;
    owner_name: string;
    category_id: string;
    phone: string;
    whatsapp: string;
    description: string;
    address: string;
    opening_time: string;
    closing_time: string;
    logo_url: string;
    email: string;
    password: string;
}

const INITIAL_FORM: FormData = {
    business_name: '',
    owner_name: '',
    category_id: '',
    phone: '',
    whatsapp: '',
    description: '',
    address: '',
    opening_time: '08:00',
    closing_time: '18:00',
    logo_url: '',
    email: '',
    password: '',
};

type Step = 1 | 2 | 3 | 4;

export const RegisterBusiness = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>(1);
    const [form, setForm] = useState<FormData>(INITIAL_FORM);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const { refreshProfile } = useAuth();

    const update = (field: keyof FormData, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const validateStep1 = () => {
        if (!form.email.trim() || !form.email.includes('@')) return 'Ingresa un email válido';
        if (form.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
        return '';
    };

    const validateStep2 = () => {
        if (!form.business_name.trim()) return 'Ingresa el nombre del negocio';
        if (!form.owner_name.trim()) return 'Ingresa tu nombre';
        if (!form.category_id) return 'Selecciona una categoría';
        return '';
    };

    const validateStep3 = () => {
        if (!form.phone.trim()) return 'Ingresa un número de teléfono';
        if (!form.address.trim()) return 'Ingresa la dirección del negocio';
        return '';
    };

    const handleNext = () => {
        const err = step === 1 ? validateStep1() : step === 2 ? validateStep2() : step === 3 ? validateStep3() : '';
        if (err) { setError(err); return; }
        setStep(prev => (prev + 1) as Step);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            console.log('🚀 Iniciando registro de:', form.business_name);

            // 1. Obtener o Crear el Usuario en Supabase Auth
            let userId: string | undefined;

            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
                options: { data: { full_name: form.owner_name } }
            });

            if (authError) {
                if (authError.message.includes('already registered')) {
                    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                        email: form.email,
                        password: form.password,
                    });
                    if (loginError) throw new Error('El correo ya existe. Si es tuyo, verifica la contraseña.');
                    userId = loginData.user?.id;
                } else {
                    throw authError;
                }
            } else {
                userId = authData.user?.id;
            }

            if (!userId) throw new Error("No se pudo identificar al usuario.");

            // 2. Guardar Datos del Dueño (Profile)
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: userId,
                    full_name: form.owner_name,
                    role: 'merchant',
                    business_name: form.business_name,
                    phone: form.phone
                });

            if (profileError) {
                console.error('Error Profile:', profileError);
                throw new Error("Error guardando perfil: " + profileError.message);
            }

            // 3. Guardar Datos del Negocio (Store)
            const { error: storeError } = await supabase
                .from('stores')
                .upsert({
                    user_id: userId,
                    name: form.business_name,
                    owner_name: form.owner_name,
                    category_id: form.category_id,
                    phone: form.phone,
                    whatsapp: form.whatsapp || form.phone,
                    description: form.description,
                    address: form.address,
                    opening_hours: `${form.opening_time} - ${form.closing_time}`,
                    status: 'pending',
                    is_active: true,
                    trial_ends_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
                }, { onConflict: 'user_id' });

            if (storeError) {
                console.error('Error Store:', storeError);
                throw new Error("Error guardando negocio: " + storeError.message);
            }

            // Actualizar rol localmente
            await refreshProfile();

            // 4. ÉXITO TOTAL
            setSubmitted(true);
            const msg = encodeURIComponent(`Hola Eduardo! Mi negocio *${form.business_name}* ya está en Traemelo.`);
            setTimeout(() => {
                window.open(`https://wa.me/584247810500?text=${msg}`, '_blank');
            }, 1000);

        } catch (err: any) {
            console.error('❌ Error:', err);
            setError(err.message || 'Error inesperado');
        } finally {
            setLoading(false);
        }
    };

    // Pantalla de éxito
    if (submitted) {
        return (
            <div className="min-h-screen aurora-bg flex flex-col items-center justify-center px-8 gap-8">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full" />
                    <div className="relative w-28 h-28 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            check_circle
                        </span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col items-center gap-3 text-center"
                >
                    <h1 className="text-white text-2xl font-black">¡Solicitud enviada!</h1>
                    <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                        Recibimos los datos de <span className="text-primary font-bold">{form.business_name}</span>. 
                        Te contactamos por WhatsApp en menos de 24 horas para activar tu perfil.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="w-full flex flex-col gap-3"
                >
                    <div className="glass-card rounded-2xl p-4 border border-primary/20 flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-2xl">schedule</span>
                        <div>
                            <p className="text-white font-bold text-sm">Activación en 24–48h</p>
                            <p className="text-white/40 text-xs">Tu perfil aparecerá en el directorio</p>
                        </div>
                    </div>
                    <div className="glass-card rounded-2xl p-4 border border-white/10 flex items-center gap-3">
                        <span className="material-symbols-outlined text-green-400 text-2xl">verified</span>
                        <div>
                            <p className="text-white font-bold text-sm">15 días gratis incluidos</p>
                            <p className="text-white/40 text-xs">Sin comisión durante tu período de prueba</p>
                        </div>
                    </div>
                </motion.div>

                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    onClick={() => navigate('/home')}
                    className="w-full py-4 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-sm"
                >
                    Volver al Inicio
                </motion.button>
            </div>
        );
    }

    const totalSteps = 4;
    const progress = (step / totalSteps) * 100;

    return (
        <div className="relative flex min-h-screen w-full flex-col aurora-bg overflow-x-hidden">
            {/* Fondo */}
            <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_80%_10%,rgba(255,183,77,0.08)_0%,transparent_50%)] pointer-events-none" />

            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center gap-4 px-5 pt-6 pb-4 backdrop-blur-3xl border-b border-white/5">
                <button
                    onClick={() => step === 1 ? navigate(-1) : setStep(prev => (prev - 1) as Step)}
                    className="flex size-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 active:scale-90 transition-all"
                >
                    <span className="material-symbols-outlined text-white text-xl">arrow_back_ios_new</span>
                </button>
                <div className="flex-1 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                             <img src="/assets/logo.png" alt="Logo" className="h-5 w-auto" />
                             <h1 className="text-white text-sm font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-[#4facfe] to-[#8E2DE2]">Register Business</h1>
                        </div>
                        <span className="text-white/30 text-[10px] font-bold">Paso {step}/{totalSteps}</span>
                    </div>
                    {/* Barra de progreso */}
                    <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                            className="h-full bg-primary rounded-full"
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        />
                    </div>
                </div>
            </header>

            <main className="flex-1 px-5 pt-8 pb-32 relative z-10">
                <AnimatePresence mode="wait">

                    {/* ── PASO 1: Cuenta de Usuario ── */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            className="flex flex-col gap-6"
                        >
                            <div>
                                <h2 className="text-white text-2xl font-black mb-1">Crea tu Cuenta</h2>
                                <p className="text-white/40 text-sm">Estos datos serán para tu acceso al panel</p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <Field label="Email de acceso *" icon="mail">
                                    <input
                                        type="email"
                                        placeholder="ejemplo@correo.com"
                                        value={form.email}
                                        onChange={e => update('email', e.target.value)}
                                        className="w-full bg-transparent text-white text-sm placeholder-white/20 outline-none"
                                    />
                                </Field>

                                <Field label="Contraseña *" icon="lock">
                                    <input
                                        type="password"
                                        placeholder="Mínimo 6 caracteres"
                                        value={form.password}
                                        onChange={e => update('password', e.target.value)}
                                        className="w-full bg-transparent text-white text-sm placeholder-white/20 outline-none"
                                    />
                                </Field>
                            </div>
                        </motion.div>
                    )}

                    {/* ── PASO 2: Datos del negocio ── */}
                    {step === 2 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            className="flex flex-col gap-6"
                        >
                            <div>
                                <h2 className="text-white text-2xl font-black mb-1">Tu Negocio</h2>
                                <p className="text-white/40 text-sm">Cuéntanos sobre tu establecimiento</p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <Field label="Nombre del negocio *" icon="storefront">
                                    <input
                                        type="text"
                                        placeholder="Ej: Ferretería El Martillo"
                                        value={form.business_name}
                                        onChange={e => update('business_name', e.target.value)}
                                        className="w-full bg-transparent text-white text-sm placeholder-white/20 outline-none"
                                    />
                                </Field>

                                <Field label="Tu nombre completo *" icon="person">
                                    <input
                                        type="text"
                                        placeholder="Ej: Carlos Rodríguez"
                                        value={form.owner_name}
                                        onChange={e => update('owner_name', e.target.value)}
                                        className="w-full bg-transparent text-white text-sm placeholder-white/20 outline-none"
                                    />
                                </Field>

                                <div className="flex flex-col gap-2">
                                    <label className="text-white/50 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-primary text-sm">category</span>
                                        Categoría *
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {localCategories.map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => update('category_id', cat.id)}
                                                className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left ${
                                                    form.category_id === cat.id
                                                        ? 'bg-primary/15 border-primary/50 shadow-[0_0_12px_rgba(255,183,77,0.15)]'
                                                        : 'bg-white/5 border-white/10'
                                                }`}
                                            >
                                                <span className={`material-symbols-outlined text-base ${form.category_id === cat.id ? 'text-primary' : 'text-white/30'}`}>
                                                    {cat.icon}
                                                </span>
                                                <span className={`text-[11px] font-bold leading-tight ${form.category_id === cat.id ? 'text-white' : 'text-white/40'}`}>
                                                    {cat.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Field label="Descripción breve" icon="description">
                                    <textarea
                                        placeholder="¿Qué ofreces? Ej: Venta de materiales de construcción al mayor y detal"
                                        value={form.description}
                                        onChange={e => update('description', e.target.value)}
                                        rows={3}
                                        className="w-full bg-transparent text-white text-sm placeholder-white/20 outline-none resize-none"
                                    />
                                </Field>
                            </div>
                        </motion.div>
                    )}

                    {/* ── PASO 3: Contacto y Ubicación ── */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            className="flex flex-col gap-6"
                        >
                            <div>
                                <h2 className="text-white text-2xl font-black mb-1">Contacto</h2>
                                <p className="text-white/40 text-sm">¿Cómo te encuentran los clientes?</p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <Field label="Teléfono principal *" icon="phone">
                                    <input
                                        type="tel"
                                        placeholder="+58 414 123 4567"
                                        value={form.phone}
                                        onChange={e => {
                                            let val = e.target.value;
                                            if (!val.startsWith('+58')) {
                                                val = '+58' + val.replace(/^\+?5?8?/, '');
                                            }
                                            update('phone', val);
                                        }}
                                        className="w-full bg-transparent text-white text-sm placeholder-white/20 outline-none"
                                    />
                                </Field>

                                <Field label="WhatsApp (si es diferente)" icon="chat">
                                    <input
                                        type="tel"
                                        placeholder="+58 412 765 4321"
                                        value={form.whatsapp}
                                        onChange={e => {
                                            let val = e.target.value;
                                            if (val && !val.startsWith('+58')) {
                                                val = '+58' + val.replace(/^\+?5?8?/, '');
                                            }
                                            update('whatsapp', val);
                                        }}
                                        className="w-full bg-transparent text-white text-sm placeholder-white/20 outline-none"
                                    />
                                </Field>

                                <Field label="Dirección del negocio *" icon="location_on">
                                    <textarea
                                        placeholder="Ej: Av. Principal de Pampatar, C.C. Sambil Local 14"
                                        value={form.address}
                                        onChange={e => update('address', e.target.value)}
                                        rows={2}
                                        className="w-full bg-transparent text-white text-sm placeholder-white/20 outline-none resize-none"
                                    />
                                </Field>

                                <div className="flex flex-col gap-2">
                                    <label className="text-white/50 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                                        Horario de atención
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="glass-card rounded-xl border border-white/10 p-3">
                                            <p className="text-white/30 text-[9px] uppercase font-bold mb-1">Apertura</p>
                                            <input
                                                type="time"
                                                value={form.opening_time}
                                                onChange={e => update('opening_time', e.target.value)}
                                                className="w-full bg-transparent text-white text-sm outline-none"
                                            />
                                        </div>
                                        <div className="glass-card rounded-xl border border-white/10 p-3">
                                            <p className="text-white/30 text-[9px] uppercase font-bold mb-1">Cierre</p>
                                            <input
                                                type="time"
                                                value={form.closing_time}
                                                onChange={e => update('closing_time', e.target.value)}
                                                className="w-full bg-transparent text-white text-sm outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── PASO 4: Revisión y confirmación ── */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            className="flex flex-col gap-6"
                        >
                            <div>
                                <h2 className="text-white text-2xl font-black mb-1">Confirmar</h2>
                                <p className="text-white/40 text-sm">Revisa los datos antes de enviar</p>
                            </div>

                            {/* Card resumen */}
                            <div className="glass-card rounded-3xl border border-white/10 overflow-hidden">
                                <div className="bg-primary/10 border-b border-white/5 p-5 flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary text-3xl">storefront</span>
                                    </div>
                                    <div>
                                        <p className="text-white font-black text-lg leading-tight">{form.business_name}</p>
                                        <p className="text-primary/80 text-xs font-bold">
                                            {localCategories.find(c => c.id === form.category_id)?.name || '—'}
                                        </p>
                                    </div>
                                </div>

                                <div className="divide-y divide-white/5">
                                    {[
                                        { icon: 'person', label: 'Propietario', value: form.owner_name },
                                        { icon: 'phone', label: 'Teléfono', value: form.phone },
                                        { icon: 'chat', label: 'WhatsApp', value: form.whatsapp || form.phone },
                                        { icon: 'location_on', label: 'Dirección', value: form.address },
                                        { icon: 'schedule', label: 'Horario', value: `${form.opening_time} – ${form.closing_time}` },
                                    ].map(item => (
                                        <div key={item.label} className="flex items-start gap-3 px-5 py-3.5">
                                            <span className="material-symbols-outlined text-white/30 text-base mt-0.5">{item.icon}</span>
                                            <div>
                                                <p className="text-white/30 text-[9px] font-bold uppercase tracking-wider">{item.label}</p>
                                                <p className="text-white text-sm font-medium mt-0.5">{item.value || '—'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Beneficios */}
                            <div className="glass-card rounded-2xl border border-primary/20 p-4">
                                <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-3">Lo que obtienes</p>
                                <div className="flex flex-col gap-2">
                                    {[
                                        '15 días gratis en el directorio',
                                        'Perfil con foto, horario y WhatsApp directo',
                                        'Alcance a toda la app de Traemelo',
                                        'Soporte prioritario por WhatsApp',
                                    ].map(benefit => (
                                        <div key={benefit} className="flex items-center gap-2.5">
                                            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                            <p className="text-white/70 text-xs">{benefit}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-5 flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20"
                        >
                            <span className="material-symbols-outlined text-red-400 text-base">error</span>
                            <p className="text-red-400 text-sm">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Botón fijo inferior */}
            <div className="fixed bottom-0 left-0 right-0 p-6 z-50">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={step < 4 ? handleNext : handleSubmit}
                    disabled={loading}
                    className="relative w-full py-4 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-sm shadow-xl disabled:opacity-60 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : step < 4 ? (
                        <>
                            Continuar
                            <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-base">send</span>
                            Enviar Solicitud
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
};

// Componente auxiliar para campos del formulario
const Field = ({ label, icon, children }: { label: string; icon: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-2">
        <label className="text-white/50 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-sm">{icon}</span>
            {label}
        </label>
        <div className="glass-card rounded-xl border border-white/10 px-4 py-3 focus-within:border-primary/40 transition-colors">
            {children}
        </div>
    </div>
);
