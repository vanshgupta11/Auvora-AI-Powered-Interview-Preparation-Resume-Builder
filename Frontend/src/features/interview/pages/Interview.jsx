import React, { useState, useEffect } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { useNavigate, useParams } from 'react-router'



const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
]

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(false)
    return (
        <div className='bg-[#0A0A0A] rounded-xl border border-white/[0.08] overflow-hidden mb-4 transition-all duration-300 hover:border-white/[0.2] hover:shadow-[0_4px_20px_rgba(255,255,255,0.03)] hover:-translate-y-0.5 group'>
            <div 
                className='px-5 py-4 cursor-pointer flex items-start sm:items-center gap-4 hover:bg-white/[0.03] transition-colors' 
                onClick={() => setOpen(o => !o)}
            >
                <span className='bg-[#111] border border-white/[0.1] text-zinc-300 text-xs font-bold px-3 py-1 rounded-md whitespace-nowrap'>Q{index + 1}</span>
                <p className='text-zinc-100 font-medium text-sm flex-1 leading-relaxed'>{item.question}</p>
                <span className={`text-zinc-500 transition-transform duration-300 transform ${open ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className='px-5 pb-5 pt-3 border-t border-white/[0.05] bg-[#111] flex flex-col gap-5 animate-slide-down opacity-0' style={{ animationFillMode: 'forwards' }}>
                    <div className='space-y-2'>
                        <span className='inline-block bg-white/[0.05] border border-white/[0.1] text-zinc-300 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded'>Intention</span>
                        <p className='text-zinc-400 text-sm leading-relaxed'>{item.intention}</p>
                    </div>
                    <div className='space-y-2'>
                        <span className='inline-block bg-white text-black text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded'>Model Answer</span>
                        <p className='text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap'>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day, isFirst, isLast }) => {
    return (
        <div className="flex items-start">
            <div className="flex flex-col items-center mr-4">
                <div className={`w-4 h-4 rounded-full border-2 border-white/[0.3] transition-colors duration-300 ${day.isCompleted ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-[#0A0A0A] group-hover:border-white/[0.5]'}`}></div>
                {!isLast && <div className="w-px h-full bg-white/[0.1] group-hover:bg-white/[0.2] transition-colors duration-300"></div>}
            </div>
            <div className="pb-8 flex-1">
                <div className="bg-[#0A0A0A] rounded-xl border border-white/[0.08] p-5 relative overflow-hidden -mt-1 group hover:border-white/[0.2] hover:shadow-[0_4px_20px_rgba(255,255,255,0.02)] transition-all duration-300">
                    <div className='flex items-center gap-3 mb-4'>
                        <span className='bg-[#111] border border-white/[0.1] text-white text-xs font-bold px-3 py-1 rounded-md whitespace-nowrap'>Day {day.day}</span>
                        <h3 className='text-zinc-100 font-semibold text-base'>{day.focus}</h3>
                    </div>
                    <ul className='space-y-3'>
                        {day.tasks.map((task, i) => (
                            <li key={i} className='flex items-start gap-3 text-sm text-zinc-400'>
                                <span className='mt-2 w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0' />
                                <span className='leading-relaxed'>{task}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [ activeNav, setActiveNav ] = useState('technical')
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()
    const { handleLogout } = useAuth()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [ interviewId ])



    if (loading || !report) {
        return (
            <main className='min-h-screen flex items-center justify-center bg-black'>
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

    // High = emerald, Mid = amber, Low = red (styled for dark mode)
    const scoreColor =
        report.matchScore >= 80 ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20' :
            report.matchScore >= 60 ? 'text-amber-400 bg-amber-500/5 border-amber-500/20' : 'text-red-400 bg-red-500/5 border-red-500/20'


    return (
        <div className='min-h-screen bg-black text-[#EDEDED] flex justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans leading-relaxed'>
            <div className='max-w-7xl w-full flex flex-col lg:flex-row gap-8'>

                {/* ── Left Nav ── */}
                <nav className='lg:w-64 flex-shrink-0'>
                    <div className='bg-[#0A0A0A] rounded-xl border border-white/[0.08] p-5 sticky top-24'>
                        <div className="space-y-1.5">
                            <p className='text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 px-2'>Sections</p>
                            {NAV_ITEMS.map(item => (
                                <button
                                    key={item.id}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-300 ${activeNav === item.id ? 'bg-[#222] text-white shadow-[0_2px_10px_rgba(255,255,255,0.02)]' : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white hover:translate-x-1'}`}
                                    onClick={() => setActiveNav(item.id)}
                                >
                                    <span className={activeNav === item.id ? 'text-white' : 'text-zinc-500'}>{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/[0.08] space-y-3">
                            <button
                                onClick={() => { getResumePdf(interviewId) }}
                                className='w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-black rounded-md text-sm font-semibold transition-all duration-300 active:scale-95 hover:bg-zinc-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] group' >
                                <svg className="group-hover:-translate-y-0.5 transition-transform" height={"1rem"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
                                Tailored Resume
                            </button>

                            <button
                                onClick={handleLogout}
                                className='w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-transparent border border-red-500/20 text-red-500 rounded-md text-sm font-medium transition-all duration-300 active:scale-95 hover:bg-red-500/10 hover:border-red-500/30'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                                    <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>
                </nav>

                {/* ── Center Content ── */}
                <main className='flex-1 min-w-0'>
                    {activeNav === 'technical' && (
                        <section className="animate-slide-up opacity-0" style={{ animationFillMode: 'forwards' }}>
                            <div className='flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]'>
                                <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">Technical Questions</h2>
                                <span className='bg-white/[0.1] text-zinc-300 border border-white/[0.05] text-xs font-semibold px-3 py-1 rounded-md'>{report.technicalQuestions.length} questions</span>
                            </div>
                            <div className='flex flex-col'>
                                {report.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section className="animate-slide-up opacity-0" style={{ animationFillMode: 'forwards' }}>
                            <div className='flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]'>
                                <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">Behavioral Questions</h2>
                                <span className='bg-white/[0.1] text-zinc-300 border border-white/[0.05] text-xs font-semibold px-3 py-1 rounded-md'>{report.behavioralQuestions.length} questions</span>
                            </div>
                            <div className='flex flex-col'>
                                {report.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section className="animate-slide-up opacity-0" style={{ animationFillMode: 'forwards' }}>
                            <div className='flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]'>
                                <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">Preparation Road Map</h2>
                                <span className='bg-white/[0.1] text-zinc-300 border border-white/[0.05] text-xs font-semibold px-3 py-1 rounded-md'>{report.preparationPlan.length}-day plan</span>
                            </div>
                            <div className='flex flex-col'>
                                {report.preparationPlan.map((day, index) => (
                                    <RoadMapDay 
                                        key={day.day} 
                                        day={day} 
                                        isFirst={index === 0}
                                        isLast={index === report.preparationPlan.length - 1}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                {/* ── Right Sidebar ── */}
                <aside className='lg:w-80 flex-shrink-0'>
                    <div className='bg-[#0A0A0A] rounded-xl border border-white/[0.08] p-6 sticky top-24 flex flex-col gap-8'>
                        
                        {/* Match Score */}
                        <div className='flex flex-col items-center text-center'>
                            <p className='text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6'>Match Score</p>
                            <div className={`relative flex items-center justify-center w-32 h-32 rounded-full border-[6px] bg-[#111] hover:scale-105 transition-transform duration-500 cursor-default ${scoreColor.split(' ')[2]} shadow-[0_0_30px_-5px_inherit]`}>
                                <div className={`flex items-baseline ${scoreColor.split(' ')[0]}`}>
                                    <span className='text-4xl font-extrabold tracking-tighter'>{report.matchScore}</span>
                                    <span className='text-xl font-bold ml-0.5'>%</span>
                                </div>
                            </div>
                            <p className='text-sm text-zinc-400 font-medium mt-6'>Match potential for this role</p>
                        </div>

                        <div className='h-px bg-white/[0.08] w-full' />

                        {/* Skill Gaps */}
                        <div>
                            <p className='text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4'>Actionable Gaps</p>
                            <div className='flex flex-wrap gap-2'>
                                {report.skillGaps.map((gap, i) => (
                                    <span 
                                        key={i} 
                                        className={`px-3 py-1.5 border rounded-md text-xs font-medium hover:-translate-y-0.5 transition-transform cursor-default ${
                                            gap.severity === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' :
                                            gap.severity === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20' :
                                            'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20'
                                        }`}
                                    >
                                        {gap.skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default Interview