import React from 'react'
import { useState } from 'react';
import { useNavigate , Link } from 'react-router'
import { useAuth } from '../hooks/useAuth';

function Register() {
    const navigate = useNavigate();
    const {loading , handleRegister} = useAuth()
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

     const handleSubmit  = async (e)=>{
            e.preventDefault()
             await handleRegister({username,email,password})
           navigate("/")
    }
    if(loading){
        return(
            <main className='min-h-screen flex items-center justify-center bg-black'>
                <div className='flex items-center gap-3 text-zinc-400'>
                    <svg className="animate-spin h-5 w-5 text-zinc-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className='text-sm font-medium'>Creating account...</span>
                </div>
            </main>
        )
    }

  return (
    <main className="min-h-screen bg-black text-[#EDEDED] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-semibold text-white tracking-tight">Create a new account</h2>
            <p className="mt-2 text-center text-sm text-zinc-400">
                Already have an account?{' '}
                <Link to={"/login"} className="font-medium text-white hover:underline transition-all">
                    Sign in here
                </Link>
            </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-[#0A0A0A] py-8 px-4 sm:rounded-xl sm:px-10 border border-white/[0.08]">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-zinc-300">Username</label>
                        <div className="mt-2">
                            <input 
                                onChange={(e)=>{setUsername(e.target.value)}}
                                type="text" name="username" id="username" 
                                placeholder="Enter your username"
                                required
                                className="appearance-none block w-full px-3 py-2.5 bg-[#111] border border-white/[0.1] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white focus:border-white sm:text-sm transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-zinc-300">Email address</label>
                        <div className="mt-2">
                            <input 
                                onChange={(e)=>{setEmail(e.target.value)}}
                                type="email" name="email" id="email" 
                                placeholder="Enter email address"
                                required
                                className="appearance-none block w-full px-3 py-2.5 bg-[#111] border border-white/[0.1] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white focus:border-white sm:text-sm transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-zinc-300">Password</label>
                        <div className="mt-2">
                            <input 
                                onChange={(e)=>{setPassword(e.target.value)}}
                                type="password" name="password" id="password" 
                                placeholder="Create a password"
                                required
                                className="appearance-none block w-full px-3 py-2.5 bg-[#111] border border-white/[0.1] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white focus:border-white sm:text-sm transition-colors"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-semibold text-black bg-white hover:bg-zinc-200 focus:outline-none transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </main>
  )
}

export default Register