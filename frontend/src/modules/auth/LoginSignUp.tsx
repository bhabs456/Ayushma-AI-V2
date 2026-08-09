"use client";

import React, { useState } from 'react';
import { Mail, Lock, User, Shield, Briefcase, GraduationCap, Users } from 'lucide-react';

type FocusedField = "username" | "email" | "password" | "confirmPassword" | "firstName" | "lastName" | "phone" | null;
type Category = "Medical Student" | "Medical Professional" | "Common People";
type IconProps = React.SVGProps<SVGSVGElement>;

function GoogleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.06H12v3.9h5.38a4.6 4.6 0 0 1-2 3.01v2.53h3.23c1.9-1.75 2.99-4.32 2.99-7.38Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.97-.9 6.62-2.39l-3.23-2.53c-.9.6-2.04.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.05v2.61A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.39 13.91A6.02 6.02 0 0 1 6.08 12c0-.66.11-1.3.31-1.91V7.48H3.05A10 10 0 0 0 2 12c0 1.61.39 3.14 1.05 4.52l3.34-2.61Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.96c1.47 0 2.79.51 3.82 1.5l2.87-2.87A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.95 5.48l3.34 2.61C7.18 7.72 9.39 5.96 12 5.96Z"
      />
    </svg>
  );
}

export default function AuthPage({ defaultSignUp = false }: { defaultSignUp?: boolean }): React.ReactElement {
  const [isRightPanelActive, setIsRightPanelActive] = useState<boolean>(defaultSignUp);
  const [focusedField, setFocusedField] = useState<FocusedField>(null);
  
  // Sign In inputs
  const [signInEmail, setSignInEmail] = useState<string>('');
  const [signInPassword, setSignInPassword] = useState<string>('');

  // Sign Up inputs
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [category, setCategory] = useState<Category>('Common People');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignUpClick = (): void => setIsRightPanelActive(true);
  const handleSignInClick = (): void => setIsRightPanelActive(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/chat';
    }, 1500);
  };

  return (
    <main className="relative w-full h-screen min-h-screen bg-[#0b1120] flex items-center justify-center overflow-hidden font-sans select-none">
      
      {/* Background ambient glows */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[#3DD9B4]/5 blur-[130px] -top-1/4 -left-1/4 pointer-events-none z-0" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[#7C5CFF]/5 blur-[130px] -bottom-1/4 -right-1/4 pointer-events-none z-0" />
      
      {/* Faint grid mesh */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:60px_60px] z-0" />

      {/* Main slider frame occupying the entire viewport */}
      <div className="relative w-full h-full overflow-hidden bg-[#111827] z-10 flex">
        
        {/* SIGN UP CONTAINER */}
        <div
          className={`absolute  top-0 h-full transition-all duration-600 ease-in-out ${
            isRightPanelActive 
              ? 'left-0 w-full md:w-1/2 opacity-100 translate-x-0 md:translate-x-full z-50' 
              : 'left-0 w-full md:w-1/2 opacity-0 translate-x-0 z-10 pointer-events-none'
          }`}
        >
          <form 
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center px-[8%] md:px-[12%] py-6 h-full text-center bg-[#111827] text-[#E8ECF1] overflow-y-auto scrollbar-none scroll-smooth"
          >
            <h1 className="font-serif text-5xl italic font-normal leading-[1.1] text-[#E8ECF1] mb-3">Create Account</h1>
            
            {/* Improved vertical spacing (mb-8) between subtitle and Google Auth */}
            <p className="text-xs text-[#8896A7] pb-2 max-w-88 leading-relaxed">
              Join Ayushman AI for secure clinical diagnostics synthesis.
            </p>

            <button
              type="button"
              className="w-full max-w-sm h-11 border border-white/10 bg-black text-white hover:bg-neutral-900 rounded-lg flex items-center justify-center gap-2.5 text-sm font-medium transition-all hover:border-white/20 active:scale-[0.98] cursor-pointer"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 my-5 w-full max-w-sm justify-center text-[10px] text-[#8896A7] font-semibold uppercase tracking-wider">
              <span className="h-[1px] w-12 bg-white/10" />
              <span>or use email details</span>
              <span className="h-[1px] w-12 bg-white/10" />
            </div>

            {/* Input fields with improved horizontal spacing (pl-12) to prevent icon/text overlap and vertical gap (mb-4) */}
            <div className="flex gap-3.5 w-full max-w-sm mb-4">
              <div className="relative flex-1">
                <User className={`absolute top-1/2 left-3.5 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focusedField === 'firstName' ? 'text-[#3DD9B4]' : 'text-[#8896A7]'}`} />
                <input
                  type="text"
                  placeholder="First Name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onFocus={() => setFocusedField('firstName')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-[#0b1120] text-[#E8ECF1] border border-white/5 py-2.5 !pl-10 pr-4 rounded-lg outline-none text-sm placeholder-[#8896A7]/40 focus:border-[#3DD9B4]/50 focus:ring-1 focus:ring-[#3DD9B4]/10 transition-all"
                />
              </div>
              <div className="relative flex-1">
                <User className={`absolute top-1/2 left-3.5 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focusedField === 'lastName' ? 'text-[#3DD9B4]' : 'text-[#8896A7]'}`} />
                <input
                  type="text"
                  placeholder="Last Name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onFocus={() => setFocusedField('lastName')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-[#0b1120] text-[#E8ECF1] border border-white/5 py-2.5 !pl-10 pr-4 rounded-lg outline-none text-sm placeholder-[#8896A7]/40 focus:border-[#3DD9B4]/50 focus:ring-1 focus:ring-[#3DD9B4]/10 transition-all"
                />
              </div>
            </div>

            <div className="relative w-full max-w-sm mb-4">
              <Mail className={`absolute top-1/2 left-3.5 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focusedField === 'email' ? 'text-[#3DD9B4]' : 'text-[#8896A7]'}`} />
              <input
                type="email"
                placeholder="Work Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-[#0b1120] text-[#E8ECF1] border border-white/5 py-2.5 !pl-10 pr-4 rounded-lg outline-none text-sm placeholder-[#8896A7]/40 focus:border-[#3DD9B4]/50 focus:ring-1 focus:ring-[#3DD9B4]/10 transition-all"
              />
            </div>

            <div className="relative w-full max-w-sm mb-4">
              <Lock className={`absolute top-1/2 left-3.5 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focusedField === 'password' ? 'text-[#3DD9B4]' : 'text-[#8896A7]'}`} />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-[#0b1120] text-[#E8ECF1] border border-white/5 py-2.5 !pl-10 pr-4 rounded-lg outline-none text-sm placeholder-[#8896A7]/40 focus:border-[#3DD9B4]/50 focus:ring-1 focus:ring-[#3DD9B4]/10 transition-all"
              />
            </div>

            <div className="relative w-full max-w-sm mb-4">
              <Lock className={`absolute top-1/2 left-3.5 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focusedField === 'confirmPassword' ? 'text-[#3DD9B4]' : 'text-[#8896A7]'}`} />
              <input
                type="password"
                placeholder="Confirm password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-[#0b1120] text-[#E8ECF1] border border-white/5 py-2.5 !pl-10 pr-4 rounded-lg outline-none text-sm placeholder-[#8896A7]/40 focus:border-[#3DD9B4]/50 focus:ring-1 focus:ring-[#3DD9B4]/10 transition-all"
              />
            </div>

            <div className="relative w-full max-w-sm mb-4.5">
              <Mail className={`absolute top-1/2 left-3.5 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focusedField === 'phone' ? 'text-[#3DD9B4]' : 'text-[#8896A7]'}`} />
              <input
                type="text"
                placeholder="Phone Number (Optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-[#0b1120] text-[#E8ECF1] border border-white/5 py-2.5 !pl-10 pr-4 rounded-lg outline-none text-sm placeholder-[#8896A7]/40 focus:border-[#3DD9B4]/50 focus:ring-1 focus:ring-[#3DD9B4]/10 transition-all"
              />
            </div>

            {/* Category selector chips */}
            <div className="flex flex-col gap-2.5 w-full max-w-sm mb-6 text-left">
              <span className="text-[10px] font-bold text-[#8896A7] uppercase tracking-wider">Select category</span>
              <div className="grid grid-cols-3 gap-2.5">
                {(["Medical Student", "Medical Professional", "Common People"] as Category[]).map((cat) => {
                  const isSelected = category === cat;
                  const Icon = cat === "Medical Student" ? GraduationCap : cat === "Medical Professional" ? Briefcase : Users;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-2.5 px-1 flex flex-col items-center justify-center gap-1.5 rounded-lg border text-[10px] font-semibold transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-cyan-500/10 border-cyan-500 text-cyan-400 font-bold" 
                          : "bg-black/30 border-white/5 text-neutral-400 hover:text-white"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="text-center truncate w-full">{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full max-w-sm h-11 bg-gradient-to-r from-[#3DD9B4] to-[#2BC4A0] text-[#0b1120] text-xs font-semibold uppercase tracking-wider rounded-lg transition-all hover:brightness-110 active:scale-[0.98] cursor-pointer shadow-lg shadow-[#3DD9B4]/10"
            >
              Sign Up
            </button>

            <p className="md:hidden block pt-6 text-xs text-[#8896A7]">
              Already have an account?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); handleSignInClick(); }} className="text-[#3DD9B4] hover:underline font-semibold">
                Sign in here
              </a>
            </p>

            <div className="flex items-center gap-1.5 mt-6 text-[10px] uppercase tracking-widest text-[#8896A7] font-semibold">
              <Shield className="w-3.5 h-3.5 text-[#3DD9B4]" />
              <span>Clinical Encryption Secure</span>
            </div>
          </form>
        </div>

        {/* SIGN IN CONTAINER */}
        <div
          className={`absolute top-0 h-full transition-all duration-600 ease-in-out ${
            isRightPanelActive 
              ? 'left-0 w-full md:w-1/2 opacity-0 translate-x-0 md:translate-x-full z-10 pointer-events-none' 
              : 'left-0 w-full md:w-1/2 opacity-100 translate-x-0 z-30'
          }`}
        >
          <form 
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center px-[8%] md:px-[12%] py-6 h-full text-center bg-[#111827] text-[#E8ECF1] overflow-y-auto scrollbar-none scroll-smooth"
          >
            <h1 className="font-serif text-5xl italic font-normal leading-[1.1] text-[#E8ECF1] mb-3">Sign in</h1>
            
            {/* Improved vertical spacing (mb-8) between subtitle and Google Auth */}
            <p className="text-xs text-[#8896A7] py-2 max-w-[22rem] leading-relaxed">
              Enter clinical credentials to access your workspaces.
            </p>

            <button
              type="button"
              className="w-full max-w-sm h-11 border border-white/10 bg-black text-white hover:bg-neutral-900 rounded-lg flex items-center justify-center gap-2.5 text-sm font-medium transition-all hover:border-white/20 active:scale-[0.98] cursor-pointer"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 my-5 w-full max-w-sm justify-center text-[10px] text-[#8896A7] font-semibold uppercase tracking-wider">
              <span className="h-[1px] w-12 bg-white/10" />
              <span>or use account credentials</span>
              <span className="h-[1px] w-12 bg-white/10" />
            </div>

            {/* Input fields with improved horizontal spacing (pl-12) to prevent icon/text overlap and vertical gap (mb-4) */}
            <div className="relative w-full max-w-sm mb-4">
              <Mail className={`absolute top-1/2 left-3.5 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focusedField === 'email' ? 'text-[#3DD9B4]' : 'text-[#8896A7]'}`} />
              <input
                type="email"
                placeholder="Work Email"
                required
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-[#0b1120] text-[#E8ECF1] border border-white/5 py-3 !pl-10 pr-4 rounded-lg outline-none text-sm placeholder-[#8896A7]/40 focus:border-[#3DD9B4]/50 focus:ring-1 focus:ring-[#3DD9B4]/10 transition-all"
              />
            </div>

            <div className="relative w-full max-w-sm mb-4">
              <Lock className={`absolute top-1/2 left-3.5 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focusedField === 'password' ? 'text-[#3DD9B4]' : 'text-[#8896A7]'}`} />
              <input
                type="password"
                placeholder="Password"
                required
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-[#0b1120] text-[#E8ECF1] border border-white/5 py-3 !pl-10 pr-4 rounded-lg outline-none text-sm placeholder-[#8896A7]/40 focus:border-[#3DD9B4]/50 focus:ring-1 focus:ring-[#3DD9B4]/10 transition-all"
              />
            </div>

            <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-[#3DD9B4] hover:underline mb-4">
              Forgot your password?
            </a>

            <button
              type="submit"
              className="w-full max-w-sm h-11 bg-gradient-to-r from-[#3DD9B4] to-[#2BC4A0] text-[#0b1120] text-xs font-semibold uppercase tracking-wider rounded-lg transition-all hover:brightness-110 active:scale-[0.98] cursor-pointer shadow-lg shadow-[#3DD9B4]/10"
            >
              Sign In
            </button>

            <p className="md:hidden block pt-6 text-xs text-[#8896A7]">
              Don't have an account?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); handleSignUpClick(); }} className="text-[#3DD9B4] hover:underline font-semibold">
                Create account
              </a>
            </p>

            <div className="flex items-center gap-1.5 mt-8 text-[10px] uppercase tracking-widest text-[#8896A7] font-semibold">
              <Shield className="w-3.5 h-3.5 text-[#3DD9B4]" />
              <span>Workspace Session Encrypted</span>
            </div>
          </form>
        </div>

        {/* OVERLAY CONTAINER */}
        <div
          className={`hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-600 ease-in-out z-100 ${
            isRightPanelActive ? '-translate-x-full' : 'translate-x-0'
          }`}
        >
          <div
            className={`relative -left-full h-full w-[200%] bg-gradient-to-r from-[#3DD9B4] to-[#7C5CFF] text-white transition-transform duration-600 ease-in-out ${
              isRightPanelActive ? 'translate-x-1/2' : 'translate-x-0'
            }`}
          >
            {/* OVERLAY LEFT */}
            <div
              className={`absolute top-0 h-full w-1/2 flex flex-col items-center justify-center text-center px-14 transition-transform duration-600 ease-in-out ${
                isRightPanelActive ? 'translate-x-0' : '-translate-x-[20%]'
              }`}
            >
              <h1 className="font-serif text-5xl italic font-normal leading-[1.1] mb-4">Already Registered?</h1>
              <p className="text-sm font-light text-white/90 max-w-[24rem] leading-relaxed pb-6">
                To keep connected with us please login with your personal info.
              </p>
              <button
                onClick={handleSignInClick}
                className="border border-white bg-transparent text-white font-semibold py-3 px-12 rounded-full cursor-pointer hover:bg-white hover:text-[#0b1120] active:scale-95 transition-all text-xs uppercase tracking-wider"
              >
                Sign In
              </button>
            </div>

            {/* OVERLAY RIGHT */}
            <div
              className={`absolute top-0 right-0 h-full w-1/2 flex flex-col items-center justify-center text-center px-14 transition-transform duration-600 ease-in-out ${
                isRightPanelActive ? 'translate-x-[20%]' : 'translate-x-0'
              }`}
            >
              <h1 className="font-serif text-5xl italic font-normal leading-[1.1] mb-4">Hello, Friend!</h1>
              <p className="text-sm font-light text-white/90 max-w-[24rem] leading-relaxed pb-6">
                Enter your personal details and start journey with us.
              </p>
              <button
                onClick={handleSignUpClick}
                className="border border-white bg-transparent text-white font-semibold py-3 px-12 rounded-full cursor-pointer hover:bg-white hover:text-[#0b1120] active:scale-95 transition-all text-xs uppercase tracking-wider"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
