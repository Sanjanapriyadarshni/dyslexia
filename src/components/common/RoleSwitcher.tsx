import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { useLanguage } from '../../context/LanguageContext';
import type { UserRole } from '../../types';
import { ChevronDown, Check } from 'lucide-react';

interface RoleOption {
  role: UserRole;
  labelKey: string;
  defaultLabel: string;
  emoji: string;
  badgeColor: string;
  badgeBg: string;
  descKey: string;
  defaultDesc: string;
}

const ROLES: RoleOption[] = [
  {
    role: 'child',
    labelKey: 'roles.child',
    defaultLabel: 'Child',
    emoji: '👦',
    badgeColor: 'text-teal-900',
    badgeBg: 'bg-teal-100 hover:bg-teal-200 border-teal-300',
    descKey: 'roles.childDesc',
    defaultDesc: 'Gamified quests & fun learning',
  },
  {
    role: 'parent',
    labelKey: 'roles.parent',
    defaultLabel: 'Parent',
    emoji: '👨‍👩‍👧',
    badgeColor: 'text-indigo-900',
    badgeBg: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300',
    descKey: 'roles.parentDesc',
    defaultDesc: 'Progress insights & home advice',
  },
  {
    role: 'teacher',
    labelKey: 'roles.teacher',
    defaultLabel: 'Teacher',
    emoji: '👩‍🏫',
    badgeColor: 'text-purple-900',
    badgeBg: 'bg-purple-100 hover:bg-purple-200 border-purple-300',
    descKey: 'roles.teacherDesc',
    defaultDesc: 'Class overview & student analytics',
  },
];

export const RoleSwitcher: React.FC<{ variant?: 'compact' | 'full' }> = ({ variant = 'compact' }) => {
  const { userRole, setUserRole } = useProfile();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const activeOption = ROLES.find((r) => r.role === userRole) || ROLES[0];

  const handleSelectRole = (role: UserRole) => {
    setUserRole(role);
    setIsOpen(false);
  };

  if (variant === 'full') {
    return (
      <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200 shadow-inner">
        {ROLES.map((opt) => {
          const isActive = userRole === opt.role;
          return (
            <button
              key={opt.role}
              onClick={() => handleSelectRole(opt.role)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <span className="text-base">{opt.emoji}</span>
              <span>{t(opt.labelKey) || opt.defaultLabel}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={t('roles.switchRole') || 'Switch Role'}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border-2 text-xs font-extrabold shadow-sm transition-all cursor-pointer ${activeOption.badgeBg} ${activeOption.badgeColor}`}
      >
        <span className="text-base leading-none">{activeOption.emoji}</span>
        <span className="font-black">{t(activeOption.labelKey) || activeOption.defaultLabel}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 opacity-70 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl border-2 border-slate-200 shadow-xl z-50 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-2 text-[11px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
              <span>{t('roles.switchRole') || 'Switch View & Role'}</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                Mock Demo
              </span>
            </div>

            <div className="mt-1 space-y-1">
              {ROLES.map((opt) => {
                const isSelected = userRole === opt.role;
                return (
                  <button
                    key={opt.role}
                    onClick={() => handleSelectRole(opt.role)}
                    className={`w-full px-3 py-2.5 rounded-2xl text-left transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-slate-100/90 text-slate-900 font-black ring-1 ring-slate-300'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-2xl p-1 bg-white rounded-xl shadow-xs border border-slate-100 flex-shrink-0">
                        {opt.emoji}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-black text-slate-800">
                          {t(opt.labelKey) || opt.defaultLabel}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium truncate">
                          {t(opt.descKey) || opt.defaultDesc}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-2 border-t border-slate-100 mt-2 bg-slate-50/70 -mx-2 -mb-2 text-[10px] text-slate-500 text-center font-medium">
              Same live student data shared across all views
            </div>
          </div>
        </>
      )}
    </div>
  );
};
