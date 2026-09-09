import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  Users,
  Search,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  Award,
  Sparkles,
  Printer,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  UserCheck,
} from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  getClassStudents,
  filterStudents,
  CLASS_METADATA,
  getClassInsights,
  generateWeeklyProgress,
} from '../../services';
import type { StudentSummary } from '../../types';

export const TeacherDashboard: React.FC = () => {
  const { profile, screeningIndicators, gamification, setScreen, setUserRole } = useProfile();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'needs_practice' | 'improving' | 'high_progress'
  >('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentSummary | null>(null);
  const [detailChartMetric, setDetailChartMetric] = useState<
    'overall' | 'reading' | 'spelling' | 'comprehension'
  >('overall');
  const [exportToast, setExportToast] = useState(false);

  // Retrieve student roster with live active child synchronized at the top
  const students = getClassStudents(profile, screeningIndicators, gamification);
  const filteredStudents = filterStudents(students, activeFilter, searchQuery);
  const classInsights = getClassInsights();

  // Class aggregates
  const totalStudents = students.length;
  const classAverage = Math.round(
    students.reduce((acc, s) => acc + s.overallScore, 0) / totalStudents
  );
  const needsPracticeCount = students.filter((s) => s.needsPractice).length;
  const highProgressCount = students.filter((s) => s.statusTag === 'high_progress').length;

  // Selected student progress data
  const selectedStudentProgress = selectedStudent
    ? generateWeeklyProgress(
        selectedStudent.isActiveChild
          ? screeningIndicators
          : [
              {
                skill: 'Reading Fluency',
                score: selectedStudent.readingScore,
                target: 85,
                fullMark: 100,
                status: selectedStudent.readingScore >= 75 ? 'strong' : 'developing',
              },
              {
                skill: 'Phonetic Spelling',
                score: selectedStudent.spellingScore,
                target: 70,
                fullMark: 100,
                status: selectedStudent.spellingScore >= 70 ? 'strong' : 'support_recommended',
              },
              {
                skill: 'Letter Recognition',
                score: selectedStudent.letterScore,
                target: 80,
                fullMark: 100,
                status: 'strong',
              },
              {
                skill: 'Story Comprehension',
                score: selectedStudent.comprehensionScore,
                target: 75,
                fullMark: 100,
                status: 'strong',
              },
            ],
        gamification.streakDays
      )
    : [];

  const handleExportSummary = () => {
    setExportToast(true);
    setTimeout(() => setExportToast(false), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-in fade-in duration-200">
      {/* 1. Teacher Header & Class Overview Stats */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-900/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-purple-500/30 text-purple-200 border border-purple-400/30 flex items-center gap-1">
                <Users className="w-3 h-3" />
                {t('teacher.header.badge') || 'Educator Portal'}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {CLASS_METADATA.className} • {CLASS_METADATA.academicYear}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {CLASS_METADATA.teacherName} — {t('teacher.header.title') || 'Classroom Reading Dashboard'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {t('teacher.header.subtitle') ||
                'Foundational literacy monitoring, screening indicators, and personalized intervention analytics.'}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-start md:justify-end">
            <button
              onClick={() => setUserRole('child')}
              className="px-4 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-400 active:scale-95 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <span>👦</span>
              <span>{t('teacher.header.previewAsStudent') || 'Preview Student View'}</span>
            </button>
          </div>
        </div>

        {/* 4 Key Stat Cards in Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-purple-800/40">
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="text-[11px] text-purple-200 font-bold uppercase">Total Students</div>
            <div className="text-2xl font-black text-white mt-1">{totalStudents}</div>
            <div className="text-[10px] text-purple-300 mt-0.5">100% active this term</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="text-[11px] text-purple-200 font-bold uppercase">Class Average</div>
            <div className="text-2xl font-black text-white mt-1">{classAverage}%</div>
            <div className="text-[10px] text-emerald-400 mt-0.5 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              <span>+6% this month</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="text-[11px] text-purple-200 font-bold uppercase">Needs Practice</div>
            <div className="text-2xl font-black text-amber-300 mt-1">{needsPracticeCount}</div>
            <div className="text-[10px] text-purple-300 mt-0.5">Targeted support queued</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="text-[11px] text-purple-200 font-bold uppercase">High Progress</div>
            <div className="text-2xl font-black text-emerald-300 mt-1">{highProgressCount}</div>
            <div className="text-[10px] text-purple-300 mt-0.5">Advanced readers</div>
          </div>
        </div>
      </div>

      {/* 2. Class Learning Insights Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>{t('teacher.insights.title') || 'Class Learning Insights'}</span>
          </h2>
          <span className="text-xs text-slate-500 font-bold hidden sm:inline">
            Aggregated pedagogical analytics
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {classInsights.map((insight) => (
            <div
              key={insight.id}
              className="bg-white rounded-3xl p-5 border-2 border-slate-200/90 shadow-xs hover:border-purple-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl p-2 bg-purple-50 rounded-2xl">{insight.icon}</span>
                  <span className="text-xs font-black text-purple-900 bg-purple-100/70 px-2.5 py-1 rounded-full">
                    {insight.metric}
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900 mb-1">{insight.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{insight.description}</p>
              </div>

              {insight.actionHint && (
                <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] font-bold text-teal-800 flex items-center gap-1">
                  <span>💡 Tip:</span>
                  <span className="text-slate-700 font-medium">{insight.actionHint}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Class Overview Student Roster Table & Search/Filter Controls */}
      <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Top Toolbar */}
        <div className="p-5 sm:p-6 border-b border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                {t('teacher.roster.title') || 'Student Roster & Skill Indicators'}
              </h2>
              <p className="text-xs text-slate-500">
                {t('teacher.roster.subtitle') ||
                  'Select any student to inspect skill trends and assign differentiated practice'}
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-purple-900 bg-purple-50 border border-purple-200">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>{t('teacher.roster.disclaimerPill') || 'Respectful Non-Medical Categorization'}</span>
            </span>
          </div>

          {/* Search bar & Filter Pills */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('teacher.roster.searchPlaceholder') || 'Search student name or focus area...'}
                className="w-full pl-9 pr-4 py-2 rounded-2xl bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold overflow-x-auto">
              {(
                [
                  { id: 'all', label: 'All Students' },
                  { id: 'needs_practice', label: 'Needs Additional Practice' },
                  { id: 'improving', label: 'Improving Steadily' },
                  { id: 'high_progress', label: 'High Progress' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    activeFilter === tab.id
                      ? 'bg-white text-purple-950 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-200">
                <th className="py-3.5 px-4 sm:px-6">Student</th>
                <th className="py-3.5 px-4">Reading</th>
                <th className="py-3.5 px-4">Spelling</th>
                <th className="py-3.5 px-4">Overall Progress</th>
                <th className="py-3.5 px-4">Last Active</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-bold">
                    No students found matching your search. Try another query!
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const isLiveStudent = student.isActiveChild;
                  return (
                    <tr
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className={`hover:bg-purple-50/40 transition-colors cursor-pointer group ${
                        isLiveStudent ? 'bg-teal-50/30 font-semibold' : ''
                      }`}
                    >
                      {/* Student Name & Avatar */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-105 transition-transform">
                            {student.avatarEmoji}
                          </div>
                          <div>
                            <div className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                              <span>{student.name}</span>
                              {isLiveStudent && (
                                <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full bg-teal-100 text-teal-900 border border-teal-300">
                                  Active Profile
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {student.grade} • Age {student.age}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Reading */}
                      <td className="py-4 px-4 font-bold text-slate-800">
                        <span className="text-sm font-black">{student.readingScore}%</span>
                      </td>

                      {/* Spelling */}
                      <td className="py-4 px-4 font-bold text-slate-800">
                        <span className="text-sm font-black">{student.spellingScore}%</span>
                      </td>

                      {/* Progress Bar */}
                      <td className="py-4 px-4 min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                student.overallScore >= 80
                                  ? 'bg-emerald-500'
                                  : student.overallScore >= 65
                                  ? 'bg-purple-600'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${student.overallScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-black text-slate-800 w-9 text-right">
                            {student.overallScore}%
                          </span>
                        </div>
                        <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                          ↑ {student.weeklyTrend}% this week
                        </div>
                      </td>

                      {/* Last Active */}
                      <td className="py-4 px-4 text-slate-600 text-xs font-semibold">
                        {t(student.lastActiveKey) || student.lastActive}
                      </td>

                      {/* Status Tag */}
                      <td className="py-4 px-4">
                        {student.statusTag === 'needs_practice' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                            <AlertCircle className="w-3 h-3 text-amber-700" />
                            <span>Needs Additional Practice</span>
                          </span>
                        ) : student.statusTag === 'high_progress' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            <span>High Progress</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-purple-100 text-purple-900 border border-purple-300">
                            <TrendingUp className="w-3 h-3 text-purple-700" />
                            <span>Improving Steadily</span>
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudent(student);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-black text-xs transition-colors border border-purple-200 cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>View Profile</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Student Detail Modal / Drawer */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setSelectedStudent(null)}
          />

          <div className="relative z-10 w-full max-w-3xl bg-white rounded-3xl shadow-2xl border-2 border-slate-200 max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-3xl shadow-md flex-shrink-0">
                  {selectedStudent.avatarEmoji}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-2xl font-black text-slate-900">
                      {selectedStudent.name}
                    </h3>
                    {selectedStudent.isActiveChild && (
                      <span className="px-2.5 py-0.5 text-xs font-black uppercase rounded-full bg-teal-100 text-teal-900 border border-teal-300">
                        Live Child Session
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {selectedStudent.grade} • Age {selectedStudent.age} • Overall Readiness: {selectedStudent.overallScore}%
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Non-Medical Terminology Notice */}
            <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-950 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-purple-700 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Educational Assessment Record: </strong>
                Indicators represent current observed practice performance in foundational reading and spelling. Not a clinical diagnosis.
              </span>
            </div>

            {/* 4 Detailed Skill Cards */}
            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
                Current Skill Mastery
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-bold">Reading Fluency</div>
                  <div className="text-2xl font-black text-teal-700 mt-1">
                    {selectedStudent.readingScore}%
                  </div>
                  <div className="text-[10px] text-teal-800 font-semibold mt-0.5">Pacing & Phonics</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-bold">Spelling Accuracy</div>
                  <div className="text-2xl font-black text-rose-700 mt-1">
                    {selectedStudent.spellingScore}%
                  </div>
                  <div className="text-[10px] text-rose-800 font-semibold mt-0.5">Phonetic Memory</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-bold">Letter Recognition</div>
                  <div className="text-2xl font-black text-amber-700 mt-1">
                    {selectedStudent.letterScore}%
                  </div>
                  <div className="text-[10px] text-amber-800 font-semibold mt-0.5">Shape Discrimination</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-bold">Comprehension</div>
                  <div className="text-2xl font-black text-purple-700 mt-1">
                    {selectedStudent.comprehensionScore}%
                  </div>
                  <div className="text-[10px] text-purple-800 font-semibold mt-0.5">Story Recall</div>
                </div>
              </div>
            </div>

            {/* Strengths & Practice Areas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <div className="text-xs font-black text-emerald-900 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Observed Strengths</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside">
                  {selectedStudent.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                <div className="text-xs font-black text-amber-900 flex items-center gap-1.5 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Areas for Additional Practice</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside">
                  {selectedStudent.focusAreas.map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 7-Day Progress Over Time Recharts Chart */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <span>7-Day Progression Curve</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">Student performance trend over last 7 sessions</p>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold p-1 bg-white rounded-xl border border-slate-200">
                  {(['overall', 'reading', 'spelling', 'comprehension'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setDetailChartMetric(m)}
                      className={`px-2.5 py-0.5 rounded-lg capitalize cursor-pointer ${
                        detailChartMetric === m ? 'bg-purple-600 text-white' : 'text-slate-600'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedStudentProgress} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                    <YAxis domain={[30, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Tooltip
                      formatter={(v: any) => [`${v}%`, 'Performance']}
                      contentStyle={{
                        backgroundColor: '#1e1b4b',
                        borderRadius: '0.75rem',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: 'bold',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey={
                        detailChartMetric === 'reading'
                          ? 'reading'
                          : detailChartMetric === 'spelling'
                          ? 'spelling'
                          : detailChartMetric === 'comprehension'
                          ? 'comprehension'
                          : 'reading'
                      }
                      stroke="#7C3AED"
                      strokeWidth={2.5}
                      fill="#C4B5FD"
                      fillOpacity={0.4}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recommended Targeted Practice Quests */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200">
              <h4 className="text-xs font-black text-slate-900 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-purple-600" />
                <span>Recommended Classroom / Home Practice</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎤</span>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Read Aloud Quest</div>
                      <div className="text-[10px] text-slate-400">Target: Fluency & Rhythm</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStudent(null);
                      setScreen('game-read-aloud');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] cursor-pointer"
                  >
                    Launch
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🧩</span>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Word Builder Puzzle</div>
                      <div className="text-[10px] text-slate-400">Target: Spelling patterns</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStudent(null);
                      setScreen('game-word-builder');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] cursor-pointer"
                  >
                    Launch
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="text-xs text-slate-500 font-medium">
                Student ID: <span className="font-mono">{selectedStudent.id}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportSummary}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Export Report (PDF)</span>
                </button>

                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Export Toast */}
      {exportToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div className="text-xs">
            <div className="font-bold">Student Summary Export Ready!</div>
            <div className="text-slate-400 text-[11px]">Downloaded clean non-medical screening & progress report.</div>
          </div>
        </div>
      )}
    </div>
  );
};
