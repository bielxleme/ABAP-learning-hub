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
  EyeOff
} from 'lucide-react';
import { UserProfile } from '../types';
import { INITIAL_BADGES } from '../data/sapReference';

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
  '👩‍💻', '👨‍💻', '👩‍💼', '👨‍💼', '🚀', '⚡', '💻', '⭐'
];

export const SapLogonModal: React.FC<SapLogonModalProps> = ({
  currentProfile,
  onLogin,
  isOpen,
  canCancel = false,
  onClose,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('BLEME');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [displayName, setDisplayName] = useState('Bruna Leme');
  const [selectedAvatar, setSelectedAvatar] = useState('👩‍💻');
  const [savedProfiles, setSavedProfiles] = useState<UserProfile[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Load registered users directory from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_USERS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedProfiles(parsed);
          // Default to first user or currentProfile
          if (currentProfile) {
            setUsername(currentProfile.name);
          } else {
            setUsername(parsed[0].name);
            setDisplayName(parsed[0].name);
            setSelectedAvatar(parsed[0].avatar || '👩‍💻');
          }
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Default seed user if none exists
    const seedUser: UserProfile = {
      name: 'BLEME',
      avatar: '👩‍💻',
      xp: 150,
      level: 1,
      rankTitle: 'Estagiária ABAP (SE38)',
      streakDays: 2,
      lastActiveDate: new Date().toISOString(),
      completedQuestionIds: [],
      badges: ['badge_first_step'],
      soundEnabled: true,
    };
    setSavedProfiles([seedUser]);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify([seedUser]));
  }, [currentProfile]);

  if (!isOpen) return null;

  const saveUsersDirectory = (users: UserProfile[]) => {
    setSavedProfiles(users);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  };

  const selectedUserProfile = savedProfiles.find(
    (p) => p.name.toUpperCase() === username.trim().toUpperCase()
  );

  const handleSelectExistingUser = (profile: UserProfile) => {
    setUsername(profile.name);
    setDisplayName(profile.name);
    setSelectedAvatar(profile.avatar);
    setPassword('');
    setErrorMessage('');
  };

  const handleDeleteProfile = (e: React.MouseEvent, profileName: string) => {
    e.stopPropagation();
    if (savedProfiles.length <= 1) {
      setErrorMessage('Você deve manter ao menos um perfil ativo no sistema.');
      return;
    }
    const updated = savedProfiles.filter((p) => p.name !== profileName);
    saveUsersDirectory(updated);
    if (username === profileName && updated.length > 0) {
      setUsername(updated[0].name);
      setDisplayName(updated[0].name);
      setSelectedAvatar(updated[0].avatar);
      setPassword('');
    }
  };

  const handlePerformLogon = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanUsername = username.trim().toUpperCase();
    if (!cleanUsername) {
      setErrorMessage('Por favor, informe o nome de usuário (ex.: BLEME).');
      return;
    }

    if (mode === 'login') {
      const existing = savedProfiles.find((p) => p.name.toUpperCase() === cleanUsername);
      if (existing) {
        // If user has a password set, verify it
        if (existing.password) {
          if (!password) {
            setErrorMessage(`O usuário "${cleanUsername}" possui senha cadastrada. Digite sua senha.`);
            return;
          }
          if (existing.password !== password) {
            setErrorMessage('Senha de acesso incorreta. Verifique suas credenciais.');
            return;
          }
        } else if (password) {
          // If no previous password and user entered one now, save it!
          existing.password = password;
        }

        // Update lastActiveDate
        const updated: UserProfile = {
          ...existing,
          lastActiveDate: new Date().toISOString(),
        };
        const newList = savedProfiles.map((p) => (p.name.toUpperCase() === cleanUsername ? updated : p));
        saveUsersDirectory(newList);
        onLogin(updated);
      } else {
        setErrorMessage(`Usuário "${cleanUsername}" não encontrado. Crie uma nova conta ou selecione um perfil existente na lista.`);
      }
    } else {
      // Register new user
      const exists = savedProfiles.some((p) => p.name.toUpperCase() === cleanUsername);
      if (exists) {
        setErrorMessage(`O usuário "${cleanUsername}" já existe. Selecione a aba "Entrar" ou use outro identificador.`);
        return;
      }

      if (password && password !== confirmPassword) {
        setErrorMessage('As senhas informadas não coincidem. Por favor, confira a confirmação de senha.');
        return;
      }

      const newProfile: UserProfile = {
        name: cleanUsername,
        avatar: selectedAvatar,
        password: password.trim() || undefined,
        xp: 0,
        level: 1,
        rankTitle: 'Estagiária ABAP (SE38)',
        streakDays: 1,
        lastActiveDate: new Date().toISOString(),
        completedQuestionIds: [],
        badges: ['badge_first_step'],
        soundEnabled: true,
      };

      const updatedList = [newProfile, ...savedProfiles];
      saveUsersDirectory(updatedList);
      onLogin(newProfile);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#f0f4f8] text-slate-900 w-full max-w-xl rounded-lg shadow-2xl border-2 border-[#1b2a4a] overflow-hidden flex flex-col font-sans">
        {/* SAP GUI Logon Top Bar */}
        <div className="bg-[#1b2a4a] text-white px-4 py-2.5 flex items-center justify-between select-none border-b border-[#304875]">
          <div className="flex items-center space-x-2.5">
            <div className="w-5 h-5 bg-[#0070f2] rounded-xs flex items-center justify-center font-mono text-[10px] font-bold text-white shadow-xs">
              SAP
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm tracking-wide flex items-center gap-2">
                <span>SAP GUI Logon 7.70 - NetWeaver Server</span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded text-[10px] font-mono">
                  MANDANTE 100 FIXO
                </span>
              </div>
              <div className="text-[10px] text-blue-200">
                Sistema: PRD (Produção) | Mandante: {MANDANTE_FIXO} | Conexão Segura
              </div>
            </div>
          </div>

          {canCancel && onClose && (
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white px-2 py-0.5 rounded hover:bg-slate-700/50 text-xs"
            >
              Cancelar
            </button>
          )}
        </div>

        {/* Tab Selection: Entrar vs Criar Novo Usuário */}
        <div className="bg-[#e4ebf2] border-b border-slate-300 px-4 py-1.5 flex items-center space-x-2 text-xs">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
              setPassword('');
              setConfirmPassword('');
            }}
            className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
              mode === 'login'
                ? 'bg-[#0070f2] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Entrar com Perfil Existente</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage('');
              setPassword('');
              setConfirmPassword('');
            }}
            className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
              mode === 'register'
                ? 'bg-[#0070f2] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Criar Novo Usuário</span>
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handlePerformLogon} className="p-4 sm:p-5 space-y-4 bg-white text-xs sm:text-sm">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-300 rounded text-red-800 text-xs flex items-start gap-2">
              <span className="font-bold">Erro de Logon:</span> {errorMessage}
            </div>
          )}

          {/* Quick Select Saved Profiles when in 'login' mode */}
          {mode === 'login' && savedProfiles.length > 0 && (
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 text-xs flex items-center justify-between">
                <span>Perfis Registrados neste Dispositivo:</span>
                <span className="text-[10px] text-slate-400 font-normal">Clique para selecionar</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                {savedProfiles.map((p) => {
                  const isSelected = username.toUpperCase() === p.name.toUpperCase();
                  return (
                    <div
                      key={p.name}
                      onClick={() => handleSelectExistingUser(p)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-50 border-blue-500 shadow-2xs text-blue-900 ring-1 ring-blue-500'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className="text-lg">{p.avatar || '👩‍💻'}</span>
                        <div className="truncate">
                          <div className="font-bold font-mono text-xs flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {p.password ? (
                              <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-1 rounded flex items-center gap-0.5">
                                <Lock className="w-2.5 h-2.5" />
                                <span>Senha</span>
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-normal">Livre</span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Nível {p.level} • {p.xp} XP
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0070f2]" />}
                        {savedProfiles.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteProfile(e, p.name)}
                            title="Remover perfil"
                            className="p-1 text-slate-400 hover:text-red-600 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SAP Logon Parameters Box */}
          <div className="border border-slate-300 rounded-lg p-3 sm:p-4 bg-slate-50/60 space-y-3">
            <div className="text-xs font-bold text-slate-700 border-b border-slate-200 pb-1.5 flex items-center justify-between">
              <span>Dados de Autenticação NetWeaver</span>
              <div className="flex items-center space-x-2 text-[10px]">
                <span className="text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded font-mono font-bold">
                  Mandante Fixo: 100
                </span>
                <span className="text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">
                  Online
                </span>
              </div>
            </div>

            {/* Usuário */}
            <div>
              <label className="block text-slate-600 font-semibold text-xs mb-1">
                Usuário SAP (User ID):
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toUpperCase())}
                  className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono font-bold text-slate-900 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none uppercase"
                  placeholder="EX: BLEME, CONSULTOR"
                  required
                />
              </div>
            </div>

            {/* Senha (Login mode) */}
            {mode === 'login' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-600 font-semibold text-xs">
                    Senha de Acesso:
                  </label>
                  {selectedUserProfile?.password ? (
                    <span className="text-[10px] text-amber-700 font-medium flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-600" />
                      Este usuário exige senha
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">
                      (Opcional - caso queira cadastrar agora)
                    </span>
                  )}
                </div>
                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-8 pr-9 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                    placeholder={selectedUserProfile?.password ? 'Digite sua senha...' : 'Sem senha (ou digite para definir)'}
                    required={!!selectedUserProfile?.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                    title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Extra inputs for 'register' mode (Display Name, Avatar, Password) */}
            {mode === 'register' && (
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div>
                  <label className="block text-slate-600 font-semibold text-xs mb-1">
                    Nome Completo / Apelido do Perfil:
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="Ex: Bruna Leme"
                  />
                </div>

                {/* Senha e Confirmação de Senha */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-semibold text-xs mb-1">
                      Criar Senha (Opcional):
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-8 pr-8 py-1.5 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                        placeholder="Crie uma senha..."
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold text-xs mb-1">
                      Confirmar Senha:
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                        placeholder="Repita a senha..."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold text-xs mb-1">
                    Escolha seu Avatar:
                  </label>
                  <div className="flex items-center space-x-2 flex-wrap gap-1">
                    {AVATARS.map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setSelectedAvatar(av)}
                        className={`text-xl p-1.5 rounded-lg border transition-all ${
                          selectedAvatar === av
                            ? 'bg-blue-100 border-[#0070f2] scale-110 shadow-xs'
                            : 'bg-white border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Idioma e Mandante fixo info */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
              <div className="flex items-center space-x-1 text-slate-500">
                <Globe2 className="w-3.5 h-3.5" />
                <span>Idioma: <strong className="text-slate-700">PT-BR</strong></span>
              </div>
              <div className="text-[11px] text-blue-700 font-medium">
                Mandante configurado: <strong>100 (Produção)</strong>
              </div>
            </div>
          </div>

          {/* Educational Note */}
          <div className="bg-blue-50/70 border border-blue-200 rounded p-2.5 text-slate-600 text-xs flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              Seu progresso individual (XP, nível, quizzes completados, código SE38 e badges) fica salvo de forma independente para cada usuário neste dispositivo.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
              NetWeaver AS ABAP 7.50 / S/4HANA
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="submit"
                className="flex items-center space-x-2 px-5 py-2 bg-[#0070f2] hover:bg-blue-600 text-white rounded font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{mode === 'login' ? 'Fazer Logon no SAP (Enter)' : 'Criar Usuário e Entrar'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
