import React, { useState, useRef } from 'react'
import { useInterview } from '../hooks/useInterview'
import { useNavigate } from 'react-router'


const Home = () => {
    const { loading, generateReport, reports, removeReport, getAtsResumePdfDirect } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const resumeInputRef = useRef()

    // ATS Resume section state
    const atsResumeInputRef = useRef()
    const [atsJobDescription, setAtsJobDescription] = useState("")
    const [atsLoading, setAtsLoading] = useState(false)
    const [atsFileName, setAtsFileName] = useState("No file selected")
    const [resumeFileName, setResumeFileName] = useState("No file selected")



    const navigate = useNavigate()

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0]
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        navigate(`/interview/${data._id}`)
    }

    const handleDownloadAtsResume = async () => {
        const resumeFile = atsResumeInputRef.current?.files?.[0]
        if (!resumeFile) {
            alert("Please upload a resume PDF first.")
            return
        }
        setAtsLoading(true)
        try {
            await getAtsResumePdfDirect({ resumeFile, jobDescription: atsJobDescription })
        } catch (error) {
            console.error(error)
        } finally {
            setAtsLoading(false)
        }
    }



    if (loading) {
        return (
            <main className='min-h-screen flex items-center justify-center bg-black leading-relaxed'>
                <div className='flex items-center gap-3 text-zinc-400'>
                    <svg className="animate-spin h-5 w-5 text-zinc-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className='text-sm font-medium'>Loading...</span>
                </div>
            </main>
        )
    }

    return (
        <main className='min-h-screen relative bg-[#050505] text-zinc-300 font-sans overflow-x-hidden selection:bg-purple-500/30 pb-20'>
            {/* Animated Background Mesh */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none flex justify-center">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px]"></div>
                <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-fuchsia-600/10 blur-[120px]"></div>
            </div>

            <div className='max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-12 relative z-10'>
                <header className='text-center space-y-4 pt-4 pb-6'>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4 text-xs font-medium text-zinc-300 tracking-wide uppercase">
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                        Workspace
                    </div>
                    <h1 className='text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40 pb-2'>
                        Auvora
                    </h1>
                    <p className='text-zinc-400 max-w-xl mx-auto text-sm leading-relaxed'>
                        A unified environment to optimize your resume and prepare for technical interviews. Tailor your profile for peak parsing.
                    </p>
                </header>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    
                    {/* 1. Action Plan Card */}
                    <div className='group relative rounded-3xl bg-white/[0.02] border border-white/[0.05] p-8 backdrop-blur-2xl hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-500 flex flex-col h-full shadow-2xl shadow-black/50'>
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none"></div>
                        
                        <div className="mb-8 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 shadow-inner">
                                <svg className="w-5 h-5 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h2 className='text-xl font-semibold text-zinc-100 tracking-tight'>Interview Action Plan</h2>
                            <p className='text-sm text-zinc-500 mt-2 leading-relaxed'>Craft a targeted preparation roadmap based on your profile and target role.</p>
                        </div>

                        <div className="space-y-6 flex-1 relative z-10">
                            <div className="space-y-2">
                                <label className='text-[11px] font-semibold text-zinc-400 uppercase tracking-widest'>Target Role</label>
                                <textarea
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder='Paste the full job description...'
                                    className='w-full rounded-2xl bg-black/40 border border-white/10 p-4 text-sm text-zinc-200 placeholder-zinc-600 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all resize-none min-h-[120px] outline-none shadow-inner'
                                />
                            </div>

                            <div className="space-y-2">
                                <label className='text-[11px] font-semibold text-zinc-400 uppercase tracking-widest flex items-center justify-between'>
                                    Base Resume
                                    <span className='text-[10px] text-zinc-600 normal-case tracking-normal'>(Required)</span>
                                </label>
                                <div className='flex items-center gap-3 w-full rounded-xl bg-black/40 border border-white/10 p-2 pl-3 transition-colors hover:border-white/20 group/input'>
                                    <span className="text-zinc-500 group-hover/input:text-zinc-400 transition-colors">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                    </span>
                                    <span className='text-sm text-zinc-400 truncate flex-1'>
                                        {resumeFileName !== "No file selected" ? resumeFileName : "No PDF selected"}
                                    </span>
                                    <button
                                        onClick={() => resumeInputRef.current.click()}
                                        className='px-4 py-2 bg-white text-black hover:bg-zinc-200 text-sm font-semibold rounded-lg transition-colors shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                                    >
                                        Browse
                                    </button>
                                    <input ref={resumeInputRef} hidden type="file" accept='.pdf' onChange={(e) => {
                                        if (e.target.files.length > 0) setResumeFileName(e.target.files[0].name)
                                    }} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className='text-[11px] font-semibold text-zinc-400 uppercase tracking-widest'>Profile Context <span className='text-zinc-600 normal-case tracking-normal italic'>(Optional)</span></label>
                                <textarea
                                    onChange={(e) => setSelfDescription(e.target.value)}
                                    placeholder='Specific areas you want to focus on...'
                                    className='w-full rounded-2xl bg-black/40 border border-white/10 p-4 text-sm text-zinc-200 placeholder-zinc-600 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all resize-none min-h-[80px] outline-none shadow-inner'
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleGenerateReport}
                            className="mt-8 w-full py-4 rounded-xl text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] relative z-10"
                        >
                            Generate Action Plan
                        </button>
                    </div>

                    {/* 2. ATS Enhancer Card */}
                    <div className='group relative rounded-3xl bg-white/[0.02] border border-white/[0.05] p-8 backdrop-blur-2xl hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-500 flex flex-col h-full shadow-2xl shadow-black/50'>
                        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none"></div>

                        <div className="mb-8 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 shadow-inner">
                                <svg className="w-5 h-5 text-fuchsia-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                            </div>
                            <h2 className='text-xl font-semibold text-zinc-100 tracking-tight'>ATS Optimizer</h2>
                            <p className='text-sm text-zinc-500 mt-2 leading-relaxed'>Refactor your existing format into a strictly structured, single-page ATS-compliant PDF.</p>
                        </div>

                        <div className="space-y-6 flex-1 flex flex-col relative z-10">
                            
                            {/* Interactive Dropzone */}
                            <div 
                                onClick={() => atsResumeInputRef.current.click()}
                                className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/10 bg-black/20 rounded-2xl p-8 hover:border-white/30 hover:bg-white/5 transition-all group/dropzone cursor-pointer min-h-[200px]"
                            >
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover/dropzone:scale-110 transition-transform duration-300 shadow-inner">
                                    <svg className="w-6 h-6 text-zinc-400 group-hover/dropzone:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-zinc-300 group-hover/dropzone:text-white transition-colors">Select PDF to optimize</span>
                                <p className='text-[11px] text-zinc-500 mt-2 text-center max-w-[200px] truncate px-4 uppercase tracking-wider'>
                                    {atsFileName !== "No file selected" ? atsFileName : "Max single file size: 5MB"}
                                </p>
                            </div>
                            <input
                                ref={atsResumeInputRef}
                                hidden
                                type="file"
                                accept='.pdf'
                                onChange={(e) => {
                                    if (e.target.files.length > 0) setAtsFileName(e.target.files[0].name)
                                }}
                            />

                        </div>

                        <button
                            onClick={handleDownloadAtsResume}
                            disabled={atsLoading}
                            className="mt-8 w-full py-4 rounded-xl text-sm font-semibold text-black bg-white hover:bg-zinc-200 border border-white transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white relative z-10"
                        >
                            {atsLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Restructuring PDF...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Generate ATS Resume
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Reports Section */}
                {reports.length > 0 && (
                    <div className='pt-12 relative z-10'>
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className='text-xs font-bold text-zinc-400 uppercase tracking-widest'>Recent Activity</h2>
                            <div className="h-px bg-white/10 flex-1"></div>
                        </div>
                        <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {reports.map((report) => {
                                const isHigh = report.matchScore >= 80;
                                const isMid = report.matchScore >= 60 && report.matchScore < 80;
                                return (
                                    <li
                                        key={report._id}
                                        className="relative bg-white/[0.02] border border-white/[0.05] hover:border-white/20 hover:bg-white/[0.04] rounded-2xl transition-all cursor-pointer flex flex-col group overflow-hidden backdrop-blur-sm shadow-xl shadow-black/20"
                                        onClick={() => navigate(`/interview/${report._id}`)}
                                    >
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeReport(report._id); }}
                                            className='absolute top-3 right-3 p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 z-10'
                                            title="Delete Plan"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                        
                                        <div className='p-6 flex-1 pr-12'>
                                            <h3 className='text-base font-semibold text-zinc-100 mb-2 line-clamp-2 leading-tight'>{report.title || 'Untitled Position'}</h3>
                                            <p className='text-xs text-zinc-500 flex items-center gap-1.5'>
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                {new Date(report.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="px-6 py-4 border-t border-white/[0.05] bg-black/20 flex items-center justify-between">
                                            <span className="text-xs font-semibold tracking-widest uppercase text-zinc-500">
                                                Match Score
                                            </span>
                                            <span className={`text-base font-bold ${isHigh ? 'text-emerald-400' : isMid ? 'text-amber-400' : 'text-zinc-500'}`}>
                                                {report.matchScore}%
                                            </span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </main>
    )
}

export default Home