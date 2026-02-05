import React, { useState } from "react";
import { Eye, EyeOff, ArrowRight, Github, Twitter, Linkedin, User, LogIn, UserPlus } from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { EnergyButton } from "./ui/EnergyButton";

interface AnimatedAuthFormProps {
  initialMode?: 'login' | 'register';
  onClose?: () => void;
}

const AnimatedAuthForm: React.FC<AnimatedAuthFormProps> = ({ initialMode = 'login', onClose }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // State 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Focus States
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isNameFocused, setIsNameFocused] = useState(false);
  
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Colors
  const activeColor = mode === 'login' ? '#FF8C42' : '#165B33';

  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (e.target.value) {
      setIsEmailValid(validateEmail(e.target.value));
    } else {
      setIsEmailValid(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitted(true);
    if (email && password && validateEmail(email)) {
       // Simulate login
       setTimeout(() => {
           if (onClose) onClose();
       }, 1000);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col font-sans bg-white dark:bg-zinc-900 transition-colors duration-300">
      
      <div className="relative z-10 flex flex-col h-full px-8 md:px-12 pt-10 pb-6">
        
        {/* HEADER */}
        <div className="text-center mb-6">
          <motion.h2 
            key={mode}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-heading font-black tracking-tight mb-2 text-gray-900 dark:text-white"
          >
            {mode === 'login' ? 'Willkommen zurück' : 'Mitglied werden'}
          </motion.h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {mode === 'login' ? 'Bitte melde dich an, um fortzufahren.' : 'Werde Teil der nachhaltigen Bewegung.'}
          </p>
        </div>

        {/* 
            TOGGLE BUTTONS (EnergyButton Style)
            Increased gap to 'gap-6' to separate them further.
        */}
        <div className="grid grid-cols-2 gap-6 mb-8">
           <EnergyButton
             variant="brand"
             glowIntensity={mode === 'login' ? 'high' : 'normal'}
             onClick={() => setMode('login')}
             className={cn(
                 "transition-all duration-300",
                 mode === 'login' 
                    ? "opacity-100 scale-105 z-10 ring-2 ring-brand-orange ring-offset-2 ring-offset-white dark:ring-offset-zinc-900" 
                    : "opacity-50 grayscale hover:grayscale-0 hover:opacity-100 scale-95"
             )}
             type="button"
           >
             <span className="flex items-center gap-2 text-sm uppercase tracking-wide font-bold">
                <LogIn className="w-4 h-4" /> Anmelden
             </span>
           </EnergyButton>

           <EnergyButton
             variant="rainbow"
             glowIntensity={mode === 'register' ? 'high' : 'normal'}
             onClick={() => setMode('register')}
             className={cn(
                 "transition-all duration-300",
                 mode === 'register' 
                    ? "opacity-100 scale-105 z-10 ring-2 ring-brand-green ring-offset-2 ring-offset-white dark:ring-offset-zinc-900" 
                    : "opacity-50 grayscale hover:grayscale-0 hover:opacity-100 scale-95"
             )}
             type="button"
           >
             <span className="flex items-center gap-2 text-sm uppercase tracking-wide font-bold">
                <UserPlus className="w-4 h-4" /> Registrieren
             </span>
           </EnergyButton>
        </div>

        {/* FORM */}
        <div className="flex-1 max-w-sm mx-auto w-full">
            <AnimatePresence mode="wait">
                <motion.form
                    key={mode}
                    initial={{ x: mode === 'login' ? -20 : 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: mode === 'login' ? 20 : -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    {mode === 'register' && (
                        <div 
                            className={cn(
                                "form-field", 
                                (isNameFocused || name) && "active"
                            )}
                            style={{ color: activeColor }}
                        >
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onFocus={() => setIsNameFocused(true)}
                                onBlur={() => setIsNameFocused(false)}
                                className="!bg-gray-50 dark:!bg-black/40 !border-gray-200 dark:!border-white/10 !text-gray-900 dark:!text-white focus:!bg-white dark:focus:!bg-black/60"
                                required
                            />
                            <label className="!text-gray-500 dark:!text-gray-400">Dein Name</label>
                        </div>
                    )}

                    <div 
                        className={cn(
                            "form-field", 
                            (isEmailFocused || email) && "active",
                            (!isEmailValid && email) && "border-red-500"
                        )}
                        style={{ color: activeColor }}
                    >
                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            onFocus={() => setIsEmailFocused(true)}
                            onBlur={() => setIsEmailFocused(false)}
                            className="!bg-gray-50 dark:!bg-black/40 !border-gray-200 dark:!border-white/10 !text-gray-900 dark:!text-white focus:!bg-white dark:focus:!bg-black/60"
                            required
                        />
                        <label className="!text-gray-500 dark:!text-gray-400">E-Mail Adresse</label>
                        {!isEmailValid && email && (
                            <span className="absolute right-0 -bottom-5 text-[10px] text-red-500">Ungültige E-Mail</span>
                        )}
                    </div>

                    <div 
                        className={cn(
                            "form-field", 
                            (isPasswordFocused || password) && "active"
                        )}
                        style={{ color: activeColor }}
                    >
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setIsPasswordFocused(true)}
                            onBlur={() => setIsPasswordFocused(false)}
                            className="!bg-gray-50 dark:!bg-black/40 !border-gray-200 dark:!border-white/10 !text-gray-900 dark:!text-white focus:!bg-white dark:focus:!bg-black/60"
                            required
                        />
                        <label className="!text-gray-500 dark:!text-gray-400">Passwort</label>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-4 text-gray-400 hover:text-brand-orange transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {mode === 'login' && (
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <label className="flex items-center gap-2 cursor-pointer hover:text-brand-orange transition-colors">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                    className="rounded border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-brand-orange focus:ring-0"
                                />
                                Merken
                            </label>
                            <a href="#" className="hover:text-brand-orange hover:underline">Vergessen?</a>
                        </div>
                    )}

                    {/* 
                        SUBMIT BUTTON 
                        Reverted to Standard Button (Not EnergyButton) 
                        Dynamic background based on mode.
                    */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full py-4 rounded-xl font-heading font-bold text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                            style={{ 
                                background: mode === 'login' 
                                    ? 'linear-gradient(135deg, #FF8C42 0%, #c4621b 100%)' 
                                    : 'linear-gradient(135deg, #165B33 0%, #0B2E1A 100%)' 
                            }}
                        >
                            {mode === 'login' ? 'Jetzt Einloggen' : 'Konto erstellen'} 
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>

                </motion.form>
            </AnimatePresence>
        </div>

        {/* FOOTER SOCIALS */}
        <div className="mt-auto">
             <div className="relative flex py-2 items-center mb-4">
                <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 dark:text-white/40 text-[10px] uppercase font-bold tracking-widest">Oder mit</span>
                <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
             </div>
             <div className="flex justify-center gap-4">
                {[Github, Twitter, Linkedin].map((Icon, i) => (
                    <button key={i} className="p-3 bg-gray-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/20 rounded-xl border border-gray-200 dark:border-white/10 transition-colors shadow-sm hover:shadow-md group">
                        <Icon className="w-5 h-5 text-gray-500 dark:text-white/70 group-hover:text-brand-orange dark:group-hover:text-white" />
                    </button>
                ))}
             </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedAuthForm;