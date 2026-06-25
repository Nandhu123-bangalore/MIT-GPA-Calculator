/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Award, 
  BookOpen, 
  Table, 
  Info, 
  Sparkles,
  Sun,
  Moon,
  TrendingUp,
  ChevronDown,
  Check,
  Share2,
  Bookmark
} from 'lucide-react';
import { 
  calculateGPA, 
  MIT_GRADE_MAPPINGS, 
  Subject 
} from './gpaLogic';

// Default initial subject
const createEmptySubject = (): Subject => ({
  id: Math.random().toString(36).substring(2, 9),
  name: '',
  credits: '',
  grade: ''
});

// MIT Manipal Standard Semester Presets
const SEMESTER_PRESETS = [
  {
    name: "1st Year (Physics Group)",
    subjects: [
      { name: "Engineering Physics", credits: "4", grade: "9" },
      { name: "Engineering Mathematics I", credits: "4", grade: "10" },
      { name: "Basic Mechanical Engineering", credits: "3", grade: "8" },
      { name: "Basic Electrical Engineering", credits: "3", grade: "9" },
      { name: "Communication Skills", credits: "2", grade: "8" },
      { name: "Physics Lab", credits: "1", grade: "10" },
      { name: "Workshop Practice", credits: "1", grade: "9" }
    ]
  },
  {
    name: "1st Year (Chemistry Group)",
    subjects: [
      { name: "Engineering Chemistry", credits: "4", grade: "9" },
      { name: "Engineering Mathematics II", credits: "4", grade: "9" },
      { name: "Problem Solving using Computers", credits: "3", grade: "10" },
      { name: "Basic Electronics", credits: "3", grade: "8" },
      { name: "Environmental Studies", credits: "2", grade: "9" },
      { name: "Chemistry Lab", credits: "1", grade: "10" },
      { name: "Computer Programming Lab", credits: "1", grade: "9" }
    ]
  },
  {
    name: "Higher Semester Standard",
    subjects: [
      { name: "Core Course I", credits: "4", grade: "9" },
      { name: "Core Course II", credits: "4", grade: "8" },
      { name: "Core Course III", credits: "3", grade: "9" },
      { name: "Professional Elective I", credits: "3", grade: "8" },
      { name: "Open Elective I", credits: "3", grade: "7" },
      { name: "Core Lab I", credits: "1", grade: "10" },
      { name: "Minor Project", credits: "2", grade: "10" }
    ]
  }
];

export default function App() {
  // Dark mode toggle
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mit-gpa-dark-mode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  // Main state - prefilled with one empty subject
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mit-gpa-subjects');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
          console.error("Error restoring subjects:", e);
        }
      }
    }
    return [createEmptySubject()];
  });

  // Calculate live results matching the user's logic exactly
  const calculationResult = useMemo(() => calculateGPA(subjects), [subjects]);

  // Persist state in localStorage
  useEffect(() => {
    localStorage.setItem('mit-gpa-subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('mit-gpa-dark-mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Subject management
  const addSubject = () => {
    setSubjects([...subjects, createEmptySubject()]);
  };

  const removeSubject = (id: string) => {
    // Keep at least 1 subject row
    if (subjects.length === 1) {
      setSubjects([createEmptySubject()]);
    } else {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const updateSubject = (index: number, field: keyof Omit<Subject, 'id'>, value: string) => {
    const newSubjects = [...subjects];
    newSubjects[index][field] = value;
    setSubjects(newSubjects);
  };

  const clearAll = () => {
    setSubjects([createEmptySubject()]);
  };

  const loadPreset = (presetIndex: number) => {
    const preset = SEMESTER_PRESETS[presetIndex];
    const newSubjects = preset.subjects.map(s => ({
      id: Math.random().toString(36).substring(2, 9),
      name: s.name,
      credits: s.credits,
      grade: s.grade
    }));
    setSubjects(newSubjects);
  };

  // Human-like academic remarks based on cumulative GPA
  const academicStanding = useMemo(() => {
    const gpaVal = parseFloat(calculationResult.gpa);
    if (gpaVal >= 9.5) return { label: "Summa Cum Laude / Star Performer", color: "text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20", quote: "Absolute academic brilliance! You are performing in the top percentile of MIT Manipal." };
    if (gpaVal >= 9.0) return { label: "Outstanding / Dean's List Tier", color: "text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/20", quote: "Outstanding results! Keep maintaining this standard to qualify for the MAHE gold medal." };
    if (gpaVal >= 8.0) return { label: "First Class with Distinction", color: "text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/20", quote: "Excellent performance. This GPA opens doors to top-tier placements and global graduate studies." };
    if (gpaVal >= 6.5) return { label: "First Class Division", color: "text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20", quote: "A very solid and respectable standing. Try converting a few 8s to 9s in core courses next sem!" };
    if (gpaVal >= 5.0) return { label: "Second Class / Passing Standing", color: "text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20", quote: "You are clear of the threshold! Focus on credit-heavy core courses to gain momentum." };
    if (gpaVal > 0) return { label: "Needs Improvement", color: "text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20", quote: "Below the target. Try reaching out to professors for makeup marks or check credit weightage." };
    return { label: "Ready to Calculate", color: "text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20", quote: "Enter your course names, credit values, and grades to view real-time GPA." };
  }, [calculationResult.gpa]);

  // Dynamic feedback for the percentage ring
  const circleDasharray = 2 * Math.PI * 40; // r=40
  const percentageScore = (parseFloat(calculationResult.gpa) / 10) * 100;
  const strokeDashoffset = isNaN(percentageScore) ? circleDasharray : circleDasharray - (percentageScore / 100) * circleDasharray;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#0b0f19] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      
      {/* Background elegant gradient blobs */}
      <div className="absolute top-0 left-0 right-0 h-[400px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-100px] left-[10%] w-[350px] h-[350px] rounded-full bg-brand-blue/5 dark:bg-brand-blue/10 blur-[80px]" />
        <div className="absolute top-[-50px] right-[10%] w-[300px] h-[300px] rounded-full bg-brand-orange/5 dark:bg-brand-orange/10 blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 md:py-10">
        
        {/* Header / Navbar */}
        <header className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-light-blue dark:from-slate-900 dark:to-slate-800 shadow-md shadow-brand-blue/10 border border-slate-200/10">
              <GraduationCap className="h-6 w-6 text-brand-orange" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-widest font-semibold text-brand-orange font-display">MIT MANIPAL</span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="text-[10px] tracking-widest font-semibold text-slate-400 font-display">MAHE ACADEMICS</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight font-display text-slate-900 dark:text-white mt-0.5">
                GPA Calculator
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all text-slate-500 dark:text-slate-400"
              title="Toggle theme"
              id="theme-toggle"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </header>

        {/* Content Section */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Subjects Form (takes 7 cols) */}
          <section className="lg:col-span-7 space-y-6">
            
            {/* Quick Templates Loader Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#121826] border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-orange" />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-display">
                    Standard Semester Templates
                  </h3>
                </div>
                <span className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded font-medium">
                  Quick Load
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                Select your academic track to prefill common course configurations. You can fully edit them afterwards.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {SEMESTER_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadPreset(idx)}
                    className="flex flex-col items-start p-3 text-left rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-orange/40 dark:hover:border-brand-orange/40 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group"
                  >
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-orange transition-colors">
                      {preset.name}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">
                      {preset.subjects.length} subjects • {preset.subjects.reduce((sum, s) => sum + Number(s.credits), 0)} Credits
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Form list */}
            <div className="p-5 md:p-6 rounded-2xl bg-white dark:bg-[#121826] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-brand-orange" />
                  <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                    Academic Subjects List
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {subjects.length} Course{subjects.length !== 1 ? 's' : ''} added
                </span>
              </div>

              {/* Table Column Headers on Desktop */}
              <div className="hidden sm:grid grid-cols-12 gap-3 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-6">Course / Subject Name</div>
                <div className="col-span-2">Credits</div>
                <div className="col-span-2">Grade Point</div>
                <div className="col-span-1 text-right">Action</div>
              </div>

              {/* Animating course list */}
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {subjects.map((subject, index) => (
                    <motion.div
                      key={subject.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.18 }}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3 sm:p-2 rounded-xl bg-slate-50 dark:bg-[#182030] border border-slate-100 dark:border-slate-800/50 hover:shadow-xs hover:border-slate-200 dark:hover:border-slate-700/50 transition-all group"
                    >
                      {/* Course Number indicator */}
                      <div className="col-span-1 flex items-center justify-between sm:justify-center text-xs font-mono font-bold text-slate-400">
                        <span className="sm:hidden text-[10px] tracking-wider uppercase">Course Rank</span>
                        <span className="bg-slate-200/60 dark:bg-slate-800 h-6 w-6 rounded-full flex items-center justify-center text-[10px]">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Subject name input */}
                      <div className="col-span-1 sm:col-span-6">
                        <input
                          type="text"
                          placeholder="e.g. Computer Networks"
                          value={subject.name}
                          onChange={e => updateSubject(index, 'name', e.target.value)}
                          className="w-full text-sm bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/30 transition-all font-sans"
                        />
                      </div>

                      {/* Credits Input */}
                      <div className="col-span-1 sm:col-span-2">
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            max="10"
                            placeholder="Credits"
                            value={subject.credits}
                            onChange={e => updateSubject(index, 'credits', e.target.value)}
                            className="w-full text-sm bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-lg pl-3 pr-2 py-1.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/30 transition-all font-sans"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-400 uppercase pointer-events-none">
                            Cr
                          </span>
                        </div>
                      </div>

                      {/* Grade Selector */}
                      <div className="col-span-1 sm:col-span-2">
                        <div className="relative">
                          <select
                            value={subject.grade}
                            onChange={e => updateSubject(index, 'grade', e.target.value)}
                            className="w-full text-sm bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/30 transition-all font-sans appearance-none"
                          >
                            <option value="">Grade</option>
                            <option value="10">A+ (10)</option>
                            <option value="9">A (9)</option>
                            <option value="8">B (8)</option>
                            <option value="7">C (7)</option>
                            <option value="6">D (6)</option>
                            <option value="5">E (5)</option>
                            <option value="0">F/W (0)</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Delete Action */}
                      <div className="col-span-1 text-right sm:text-center mt-2 sm:mt-0">
                        <button
                          onClick={() => removeSubject(subject.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                          title="Remove course"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Control Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <button
                  onClick={addSubject}
                  className="flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200 text-white rounded-lg transition-all shadow-sm active:scale-95"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Subject
                </button>

                <button
                  onClick={clearAll}
                  className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-lg bg-white dark:bg-transparent transition-all active:scale-95"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset Form
                </button>
              </div>
            </div>

            {/* Human Grade Guidelines info Card */}
            <div className="p-4 rounded-xl bg-amber-500/5 border border-brand-orange/20 flex gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <Info className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">MIT Manipal Cumulative GPA Rules: </span>
                A 10-point credit system applies here. Total credits reflect the course weighting, and GPA is computed by multiplying individual grade points with credits, then dividing by cumulative course credits. Audited or non-credit courses should not be entered.
              </div>
            </div>

          </section>

          {/* Right Column: Results & Mapping Table (takes 5 cols) */}
          <section className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
            
            {/* Live Calculation Display Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-blue via-[#0d2e56] to-[#123e71] text-white p-6 shadow-md border border-slate-200/10">
              {/* Branding pattern overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(242,100,25,0.15),transparent_60%)] pointer-events-none" />
              
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-brand-orange" />
                  <span className="text-xs font-bold font-display uppercase tracking-wider text-slate-300">
                    Live Score Summary
                  </span>
                </div>
                <div className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-brand-orange text-white uppercase animate-pulse">
                  Real-time
                </div>
              </div>

              <div className="py-6 flex flex-col md:flex-row items-center justify-around gap-6">
                
                {/* SVG Progress Circle for GPA */}
                <div className="relative h-28 w-28 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background Track */}
                    <circle
                      cx="56"
                      cy="56"
                      r="40"
                      className="stroke-slate-700/50"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    {/* Active Track */}
                    <motion.circle
                      cx="56"
                      cy="56"
                      r="40"
                      className="stroke-brand-orange"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={circleDasharray}
                      initial={{ strokeDashoffset: circleDasharray }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-3xl font-extrabold font-display leading-none">
                      {calculationResult.gpa}
                    </span>
                    <span className="block text-[10px] text-slate-300 font-mono mt-0.5">
                      out of 10
                    </span>
                  </div>
                </div>

                {/* Primary Numeric Totals */}
                <div className="space-y-4 text-center md:text-left">
                  <div>
                    <span className="block text-[10px] uppercase font-semibold text-slate-300 tracking-wider">
                      Total Credits Registered
                    </span>
                    <span className="text-2xl font-black font-display text-white">
                      {calculationResult.totalCredits}
                    </span>
                    <span className="text-xs text-slate-400 ml-1.5">Credits</span>
                  </div>

                  <div>
                    <span className="block text-[10px] uppercase font-semibold text-slate-300 tracking-wider">
                      Cumulative Grade Points
                    </span>
                    <span className="text-2xl font-black font-display text-white">
                      {calculationResult.earnedPoints.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">/ {calculationResult.maxPointsPossible}</span>
                  </div>
                </div>

              </div>

              {/* Dynamic Academic Remark Panel */}
              <div className={`mt-2 p-4 rounded-xl border transition-all ${academicStanding.color}`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp className="h-3.5 w-3.5 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider font-display">
                    {academicStanding.label}
                  </span>
                </div>
                <p className="text-xs opacity-90 leading-relaxed font-sans">
                  {academicStanding.quote}
                </p>
              </div>
            </div>

            {/* MIT Manipal Grade Scale Table */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#121826] border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                <Table className="h-4 w-4 text-brand-orange" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-display">
                  Grade-to-Point Scale Reference
                </h3>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-12 text-[10px] font-bold text-slate-400 uppercase pb-1 px-1">
                  <div className="col-span-3">Grade</div>
                  <div className="col-span-3 text-center">Value</div>
                  <div className="col-span-6 text-right">Standard Definition</div>
                </div>

                {MIT_GRADE_MAPPINGS.map((map) => (
                  <div 
                    key={map.grade}
                    className="grid grid-cols-12 items-center text-xs py-1.5 px-2 rounded-lg border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
                  >
                    <div className="col-span-3">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${map.color}`}>
                        {map.grade}
                      </span>
                    </div>
                    <div className="col-span-3 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                      {map.points}
                    </div>
                    <div className="col-span-6 text-right text-slate-500 dark:text-slate-400">
                      {map.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </section>

        </main>

        {/* Brand/Academic Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-200/60 dark:border-slate-800/60 text-center text-xs text-slate-400 dark:text-slate-500 space-y-1.5">
          <p className="font-medium">
            🎓 MIT GPA Calculator — Specially crafted for MIT Manipal Students
          </p>
          <p className="font-mono text-[10px]">
            Based on the standard 10-point GPA grading scale • Maintain strict academic integrity.
          </p>
          <p className="text-[10px] pt-1">
            Made with ❤️ for MIT Manipal students by Nandhitha Chowdary
          </p>
        </footer>

      </div>
    </div>
  );
}
