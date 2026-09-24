import React, { useState, useEffect } from 'react';
import { 
  User, 
  KeyRound, 
  Database, 
  ShieldCheck, 
  UserPlus, 
  LogIn, 
  Trash2, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Globe2,
  ChevronRight,
  Info,
  Lock,
  Eye,
  EyeOff,
  Mail,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { UserProfile, RpgRace } from '../types';
import { INITIAL_BADGES } from '../data/sapReference';
import { getRandomRpgRace, RPG_RACES, ALL_RPG_RACES } from '../data/rpgAvatars';

interface SapLogonModalProps {
  currentProfile: UserProfile | null;
  onLogin: (profile: UserProfile) => void;
  isOpen: boolean;
  canCancel?: boolean;
  onClose?: () => void;
}

const STORAGE_USERS_KEY = 'sap_abap_users_directory_v1';
const MANDANTE_FIXO = '100';

const AVATARS = [
  '👩‍💻', '👨‍💻', '👩‍💼', '👨‍💼', '🚀', '⚡', '💻', '⭐', '💎', '🔥'
];

export const SapLogonModal: React.FC<SapLogonModalProps> = ({
  currentProfile,
  onLogin,
  isOpen,
  canCancel = false,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'select' | 'create'>('select');
  const [selectedUsername, setSelectedUsername] = useState<string>('Convidado SAP');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [savedProfiles, setSavedProfiles] = useState<UserProfile[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Confirmation dialog state before logging in
  const [pendingLoginProfile, setPendingLoginProfile] = useState<UserProfile | null>(null);

  // In-app deletion confirmation state (replaces blocked window.confirm in iframe)
  const [userPendingDelete, setUserPendingDelete] = useState<string | null>(null);

  // New User Form States
  const [newUsername, setNewUsername] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newConfirmPassword, setNewConfirmPassword] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('bielxleme@gmail.com');
  const [isGoogleLinked, setIsGoogleLinked] = useState<boolean>(true);
  const [newAvatar, setNewAvatar] = useState<string>('👩‍💻');
  const [newRpgRace, setNewRpgRace] = useState<RpgRace>(() => getRandomRpgRace());

  // Load saved profiles from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_USERS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedProfiles(parsed);
          if (currentProfile) {
            setSelectedUsername(currentProfile.name);
          } else {
            setSelectedUsername(parsed[0].name);
          }
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Default initial user is Convidado SAP (Guest user)
    const defaultGuestUser: UserProfile = {
      name: 'Convidado SAP',
      avatar: '👤',
      rpgRace: 'guerreiro',
      xp: 0,
      level: 1,
      rankTitle: 'Visitante NetWeaver (Convidado)',
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
      completedQuestionIds: [],
      badges: [],
      soundEnabled: true,
      isGuest: true,
    };
    setSavedProfiles([defaultGuestUser]);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify([defaultGuestUser]));
  }, [currentProfile]);

  if (!isOpen) return null;

  const handleContinueAsGuest = () => {
    const guestUser: UserProfile = {
      name: 'Convidado SAP',
      avatar: '👤',
      rpgRace: 'guerreiro',
      xp: 0,
      level: 1,
      rankTitle: 'Visitante NetWeaver (Convidado)',
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
      completedQuestionIds: [],
      badges: [],
      soundEnabled: true,
      isGuest: true,
    };
    onLogin(guestUser);
    if (onClose) onClose();
  };

  const saveUsersDirectory = (users: UserProfile[]) => {
    setSavedProfiles(users);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  };

  const selectedProfile = savedProfiles.find(
    (p) => p.name.toUpperCase() === selectedUsername.trim().toUpperCase()
  );

  // Handle clicking on an existing user card in the list
  const handleCardClick = (profile: UserProfile) => {
    setSelectedUsername(profile.name);
    setPasswordInput('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Trigger login confirmation step
  const handleInitiateLogon = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const targetUser = savedProfiles.find(
      (p) => p.name.toUpperCase() === selectedUsername.trim().toUpperCase()
    );

    if (!targetUser) {
      setErrorMessage(`O usuário "${selectedUsername}" não foi encontrado. Selecione um usuário na lista ou crie um novo.`);
      return;
    }

    // Verify password if user has one configured
    if (targetUser.password) {
      if (!passwordInput) {
        setErrorMessage(`O usuário "${targetUser.name}" possui senha de proteção. Digite a senha para continuar.`);
        return;
      }
      if (targetUser.password !== passwordInput) {
        setErrorMessage('Senha de acesso incorreta para este usuário SAP.');
        return;
      }
    }

    // Open confirmation dialog
    setPendingLoginProfile(targetUser);
  };

  // Confirm and execute logon
  const handleConfirmLogon = () => {
    if (!pendingLoginProfile) return;

    const updatedProfile: UserProfile = {
      ...pendingLoginProfile,
      lastActiveDate: new Date().toISOString(),
    };

    const updatedList = savedProfiles.map((p) =>
      p.name.toUpperCase() === updatedProfile.name.toUpperCase() ? updatedProfile : p
    );

    saveUsersDirectory(updatedList);
    setPendingLoginProfile(null);
    onLogin(updatedProfile);
  };

  // Handle creating a new user with duplicate check
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanName = newUsername.trim().toUpperCase();

    if (!cleanName) {
      setErrorMessage('Por favor, informe o nome de usuário SAP (ex: DEV01, CONSULTOR).');
      return;
    }

    if (cleanName.length < 2) {
      setErrorMessage('O nome de usuário deve conter no mínimo 2 caracteres.');
      return;
    }

    // Strict duplicate check
    const alreadyExists = savedProfiles.some(
      (p) => p.name.toUpperCase() === cleanName
    );

    if (alreadyExists) {
      setErrorMessage(`O usuário SAP "${cleanName}" já existe neste dispositivo! Por favor, escolha outro nome ou selecione-o na lista de usuários.`);
      return;
    }

    if (newPassword && newPassword !== newConfirmPassword) {
      setErrorMessage('As senhas digitadas não coincidem. Por favor, confira a confirmação de senha.');
      return;
    }

    const initialBadges = ['badge_first_step'];
    if (isGoogleLinked || newEmail) {
      initialBadges.push('badge_account_linked');
    }

    const assignedRace: RpgRace = newRpgRace || getRandomRpgRace();

    const newUser: UserProfile = {
      name: cleanName,
      avatar: newAvatar,
      rpgRace: assignedRace,
      email: newEmail.trim() || undefined,
      googleLinked: isGoogleLinked,
      password: newPassword.trim() || undefined,
      xp: 0,
      level: 1,
      rankTitle: 'Estagiária ABAP (SE38)',
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
      completedQuestionIds: [],
      badges: initialBadges,
      soundEnabled: true,
    };

    const updatedList = [newUser, ...savedProfiles];
    saveUsersDirectory(updatedList);
    setSuccessMessage(`Usuário "${cleanName}" criado com sucesso no Mandante 100!`);

    // Switch to select tab and preselect new user
    setTimeout(() => {
      setSelectedUsername(cleanName);
      setActiveTab('select');
      setPendingLoginProfile(newUser);
    }, 600);
  };

  const executeDeleteUser = (usernameToDelete: string) => {
    // 1. Clean individual localStorage entries
    try {
      localStorage.removeItem(`sap_abap_user_${usernameToDelete}_profile`);
      localStorage.removeItem(`sap_abap_user_${usernameToDelete}_history`);
      localStorage.removeItem(`sap_abap_user_${usernameToDelete}_code`);
    } catch (e) {
      console.error('Failed to clear user data from localStorage', e);
    }

    // 2. Filter remaining profiles
    const remaining = savedProfiles.filter(
      (p) => p.name.toUpperCase() !== usernameToDelete.toUpperCase()
    );

    let nextProfile: UserProfile;

    if (remaining.length === 0) {
      const defaultGuest: UserProfile = {
        name: 'Convidado SAP',
        avatar: '👤',
        rpgRace: 'guerreiro',
        xp: 0,
        level: 1,
        rankTitle: 'Visitante NetWeaver (Convidado)',
        streakDays: 1,
        lastActiveDate: new Date().toISOString(),
        completedQuestionIds: [],
        badges: [],
        soundEnabled: true,
        isGuest: true,
      };
      saveUsersDirectory([defaultGuest]);
      setSelectedUsername(defaultGuest.name);
      nextProfile = defaultGuest;
    } else {
      saveUsersDirectory(remaining);
      if (selectedUsername.toUpperCase() === usernameToDelete.toUpperCase()) {
        setSelectedUsername(remaining[0].name);
        nextProfile = remaining[0];
      } else {
        const found = remaining.find((p) => p.name.toUpperCase() === selectedUsername.toUpperCase());
        nextProfile = found || remaining[0];
      }
    }

    // 3. If currently active user in App was the deleted user, switch active session
    if (currentProfile && currentProfile.name.toUpperCase() === usernameToDelete.toUpperCase()) {
      onLogin(nextProfile);
    }

    if (pendingLoginProfile?.name.toUpperCase() === usernameToDelete.toUpperCase()) {
      setPendingLoginProfile(null);
    }

    setUserPendingDelete(null);
    setSuccessMessage(`Usuário "${usernameToDelete}" foi excluído com sucesso do dispositivo.`);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#f0f4f8] text-slate-900 w-full max-w-xl rounded-lg shadow-2xl border-2 border-[#1b2a4a] overflow-hidden flex flex-col font-sans">
        {/* Top SAP GUI Header */}
        <div className="bg-[#1b2a4a] text-white px-4 py-2.5 flex items-center justify-between select-none border-b border-[#304875]">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 bg-[#0070f2] rounded flex items-center justify-center font-mono text-[11px] font-bold text-white shadow-xs">
              SAP
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm tracking-wide flex items-center gap-2">
                <span>SAP Logon 7.70 — Gerenciamento de Usuários</span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded text-[10px] font-mono">
                  MANDANTE 100
                </span>
              </div>
              <div className="text-[10px] text-blue-200">
                Sistema: PRD (Produção) | Conexão Segura NetWeaver
              </div>
            </div>
          </div>

          {canCancel && onClose && (
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white px-2 py-0.5 rounded hover:bg-slate-700/50 text-xs cursor-pointer"
            >
              Fechar
            </button>
          )}
        </div>

        {/* First-Screen Suggestion & Guest Access Banner */}
        <div className="bg-gradient-to-r from-[#102447] via-[#1b3668] to-[#0b5bb5] text-white p-3.5 px-4 border-b border-blue-600/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start space-x-2.5">
            <span className="text-xl shrink-0">💡</span>
            <div className="space-y-0.5">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span>Bem-vindo(a) ao SAP ABAP Learning Hub!</span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded font-sans">
                  Sugerido
                </span>
              </div>
              <p className="text-blue-100 text-[11px] leading-snug">
                Sugerimos criar seu usuário ou entrar com perfil existente para registrar seu XP, medalhas e RPG. Mas fique à vontade para continuar como Convidado!
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end shrink-0">
            <button
              type="button"
              onClick={handleContinueAsGuest}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>👤 Continuar como Convidado</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#e4ebf2] border-b border-slate-300 px-4 py-1.5 flex items-center space-x-2 text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('select');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'select'
                ? 'bg-[#0070f2] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Selecionar Usuário Salvo ({savedProfiles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('create');
              setErrorMessage('');
              setSuccessMessage('');
              setNewUsername('');
              setNewPassword('');
              setNewConfirmPassword('');
            }}
            className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'create'
                ? 'bg-[#0070f2] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Criar Novo Usuário SAP</span>
          </button>
        </div>

        {/* Alert Feedback Messages */}
        <div className="px-4 pt-3 space-y-2">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-300 rounded text-red-800 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Aviso SAP:</span> {errorMessage}
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-emerald-800 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Sucesso:</span> {successMessage}
              </div>
            </div>
          )}
        </div>

        {/* TAB 1: Select User & Logon */}
        {activeTab === 'select' && (
          <form onSubmit={handleInitiateLogon} className="p-4 sm:p-5 space-y-4 bg-white text-xs sm:text-sm">
            {/* Registered Users Cards */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 text-xs flex items-center justify-between">
                <span>Usuários Registrados neste Dispositivo:</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  Clique no usuário desejado para selecioná-lo
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                {savedProfiles.map((p) => {
                  const isSelected = selectedUsername.toUpperCase() === p.name.toUpperCase();

                  return (
                    <div
                      key={p.name}
                      onClick={() => handleCardClick(p)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-50 border-blue-500 shadow-xs text-blue-900 ring-2 ring-blue-500/40'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <span className="text-xl shrink-0">{p.avatar || '👩‍💻'}</span>
                        <div className="truncate space-y-0.5">
                          <div className="font-bold font-mono text-xs flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {p.googleLinked && (
                              <span className="text-[9px] bg-red-100 text-red-700 border border-red-200 px-1 rounded font-sans">
                                Google
                              </span>
                            )}
                            {p.password && (
                              <span className="text-[9px] text-amber-700 bg-amber-50 border border-amber-200 px-1 rounded flex items-center gap-0.5 font-sans">
                                <Lock className="w-2.5 h-2.5" />
                                Senha
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            Nível {p.level} • {p.xp} XP • {p.rankTitle}
                          </div>
                          {p.email && (
                            <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                              <Mail className="w-2.5 h-2.5" />
                              {p.email}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0070f2]" />}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUserPendingDelete(p.name);
                          }}
                          title={`Excluir perfil de "${p.name}"`}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected User Password Field */}
            {selectedProfile?.password && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-amber-900 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-600" />
                    <span>Senha de Acesso para {selectedProfile.name}:</span>
                  </label>
                  <span className="text-[10px] text-amber-700 font-medium">Obrigatória</span>
                </div>

                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-8 pr-9 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs focus:ring-1 focus:ring-blue-500 font-mono"
                    placeholder="Digite a senha deste usuário..."
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Logon Submit Button */}
            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleContinueAsGuest}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <span>👤 Continuar como Convidado</span>
              </button>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 hidden sm:inline">
                  Usuário: <strong className="text-slate-800 font-mono">{selectedUsername}</strong>
                </span>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0070f2] hover:bg-[#0863cb] text-white rounded font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Fazer Logon</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: Create New User */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreateUser} className="p-4 sm:p-5 space-y-3.5 bg-white text-xs sm:text-sm">
            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1">
                Nome de Usuário SAP (ID):
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value.toUpperCase())}
                  className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono font-bold text-slate-900 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none uppercase"
                  placeholder="EX: DEV01, BLEME, JUNIOR"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                O sistema verificará automaticamente se o nome já foi utilizado neste dispositivo.
              </p>
            </div>

            {/* Email & Google Link */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <label className="block text-slate-700 font-bold text-xs">
                Vínculo com Conta Google ou E-mail:
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
                  placeholder="exemplo@gmail.com"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGoogleLinked}
                    onChange={(e) => setIsGoogleLinked(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Vincular com Conta Google (bielxleme@gmail.com)</span>
                </label>
              </div>
            </div>

            {/* Password (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">
                  Senha (Opcional):
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-8 pr-8 py-1.5 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:ring-1 focus:ring-blue-500 font-mono"
                    placeholder="Criar senha..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">
                  Confirmar Senha:
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newConfirmPassword}
                    onChange={(e) => setNewConfirmPassword(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:ring-1 focus:ring-blue-500 font-mono"
                    placeholder="Repita a senha..."
                  />
                </div>
              </div>
            </div>

            {/* RPG Race Selection (Orc, Mago, Guerreiro, Elfo, Arqueiro, Espírito) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-700 font-bold text-xs">
                  Herói de RPG Inicial:
                </label>
                <button
                  type="button"
                  onClick={() => setNewRpgRace(getRandomRpgRace())}
                  className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                >
                  🎲 Escolher Aleatório
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {ALL_RPG_RACES.map((rKey) => {
                  const rMeta = RPG_RACES[rKey];
                  const isSelected = newRpgRace === rKey;

                  return (
                    <button
                      key={rKey}
                      type="button"
                      onClick={() => {
                        setNewRpgRace(rKey);
                        setNewAvatar(rMeta.iconEmoji);
                      }}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-100 border-blue-500 shadow-xs ring-2 ring-blue-500/50'
                          : 'bg-white hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <div className="text-xl">{rMeta.iconEmoji}</div>
                      <div className="text-[10px] font-bold truncate text-slate-800 mt-0.5">
                        {rMeta.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Avatar Selection */}
            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1">
                Ícone do Avatar:
              </label>
              <div className="flex items-center space-x-2 flex-wrap gap-1">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setNewAvatar(av)}
                    className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all ${
                      newAvatar === av
                        ? 'bg-blue-100 border-2 border-blue-500 scale-110 shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleContinueAsGuest}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <span>👤 Continuar como Convidado</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('select')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold cursor-pointer"
                >
                  Voltar à Lista
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Cadastrar e Salvar Usuário</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* CONFIRMATION MODAL OVERLAY: User Confirmation Before Logging In */}
        {pendingLoginProfile && (
          <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-xl shadow-2xl border-2 border-[#1b2a4a] p-5 max-w-sm w-full space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-2xl flex items-center justify-center mx-auto border border-blue-200 shadow-inner">
                {pendingLoginProfile.avatar || '👩‍💻'}
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900">
                  Confirmar Acesso SAP GUI
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Deseja realmente iniciar a sessão com o usuário{' '}
                  <strong className="text-blue-700 font-mono font-bold text-sm">
                    {pendingLoginProfile.name}
                  </strong>{' '}
                  no Mandante 100?
                </p>
                <div className="text-[11px] text-slate-500 pt-1">
                  Nível {pendingLoginProfile.level} • {pendingLoginProfile.rankTitle}
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setPendingLoginProfile(null)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleConfirmLogon}
                  className="px-4 py-2 bg-[#0070f2] hover:bg-[#0863cb] text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Confirmar e Entrar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* IN-APP CONFIRMATION MODAL: Delete User Profile (fixes blocked window.confirm in iframe) */}
        {userPendingDelete && (
          <div className="fixed inset-0 z-70 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-xl shadow-2xl border-2 border-red-500 p-5 max-w-sm sm:max-w-md w-full space-y-4">
              <div className="flex items-start space-x-3 text-red-600">
                <div className="p-2.5 bg-red-100 rounded-full shrink-0">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Confirmar Exclusão de Usuário
                  </h4>
                  <p className="text-xs text-red-600 font-semibold">
                    Esta ação é permanente e irreversível
                  </p>
                </div>
              </div>

              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs space-y-2 text-slate-700">
                <p>
                  Tem certeza de que deseja excluir o usuário SAP <strong className="font-mono bg-red-100 px-1.5 py-0.5 rounded text-red-900 font-bold">"{userPendingDelete}"</strong> deste dispositivo?
                </p>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Todo o histórico de exercícios, simulados, streak diário e código do editor vinculados a este usuário serão permanentemente removidos deste navegador.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setUserPendingDelete(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => executeDeleteUser(userPendingDelete)}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Sim, Excluir Definitivamente</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
