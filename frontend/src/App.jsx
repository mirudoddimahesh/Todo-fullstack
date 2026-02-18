import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, Calendar, CheckCircle2, Circle, Trophy, Mountain, Wifi, WifiOff, Mail, Cake, User, Activity, Save, X, RefreshCcw } from 'lucide-react';

// ============================================================================
// --- 1. CONNECTION CONFIGURATION ---
// ============================================================================
// CORRECT:
const API_URL = '/api/todos'; 

// INCORRECT (Delete this if you see it):
// const API_URL = 'http://localhost:8080/api/todos';

// ============================================================================
// --- 2. LOCAL STORAGE FALLBACK (Offline Mode) ---
// ============================================================================
const localStore = {
  get: () => JSON.parse(localStorage.getItem('todos') || '[]'),
  set: (todos) => localStorage.setItem('todos', JSON.stringify(todos)),
  add: (todo) => {
    const todos = localStore.get();
    const newTodo = { ...todo, id: Date.now(), createdAt: new Date().toISOString() };
    localStore.set([newTodo, ...todos]);
    return newTodo;
  },
  update: (id, updates) => {
    const todos = localStore.get().map(t => t.id === id ? { ...t, ...updates } : t);
    localStore.set(todos);
    return { id, ...updates };
  },
  delete: (id) => {
    const todos = localStore.get().filter(t => t.id !== id);
    localStore.set(todos);
    return true;
  }
};

// ============================================================================
// --- 3. SERVICE LAYER ---
// ============================================================================
const todoService = {
  getAll: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Backend error');
      return { data: await response.json(), mode: 'online' };
    } catch (error) {
      console.warn("❌ Connection Failed: Spring Boot backend is down.");
      return { data: localStore.get(), mode: 'offline' };
    }
  },

  create: async (todo, mode) => {
    if (mode === 'offline') return localStore.add(todo);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
      });
      if (!response.ok) throw new Error('Create failed');
      return await response.json();
    } catch (err) {
      return localStore.add(todo);
    }
  },

  update: async (id, fullTodoObject, mode) => {
    if (mode === 'offline') return localStore.update(id, fullTodoObject);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullTodoObject),
      });
      if (!response.ok) throw new Error('Update failed');
      return await response.json();
    } catch (err) {
      return localStore.update(id, fullTodoObject);
    }
  },

  delete: async (id, mode) => {
    if (mode === 'offline') return localStore.delete(id);
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
      return true;
    } catch (err) {
      return localStore.delete(id);
    }
  }
};

// ============================================================================
// --- 4. REACT COMPONENTS ---
// ============================================================================

const TodoItem = ({ todo, onToggle, onDelete, onUpdate, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.description || '');

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onUpdate(todo.id, { ...todo, title: editTitle, description: editDesc });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDesc(todo.description || '');
    setIsEditing(false);
  };

  return (
    <div 
      className={`group flex flex-col gap-3 p-4 rounded-xl border backdrop-blur-md transition-all duration-300 ease-out transform ${
        todo.completed 
          ? 'border-slate-700/50 bg-slate-900/40 opacity-60 scale-[0.99]' 
          : 'border-slate-700/50 bg-slate-800/60 shadow-lg shadow-black/10 hover:border-indigo-500/30 hover:-translate-y-0.5 hover:bg-slate-800/80'
      }`}
      style={{
        animation: `slideIn 0.3s ease-out forwards ${index * 0.05}s`,
        opacity: 0,
      }}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(todo.id, !todo.completed)}
          className={`mt-1 flex-shrink-0 transition-all duration-300 active:scale-90 ${
            todo.completed ? 'text-emerald-400 rotate-0' : 'text-slate-400 hover:text-indigo-400 hover:scale-110'
          }`}
        >
          {todo.completed ? <CheckCircle2 size={24} className="animate-bounce-short" /> : <Circle size={24} />}
        </button>

        <div className="flex-grow min-w-0">
          {isEditing ? (
            <div className="space-y-3 animate-in fade-in duration-200">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 text-slate-100 bg-slate-900/80 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600"
                placeholder="Task title"
                autoFocus
              />
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full px-3 py-2 text-sm text-slate-300 bg-slate-900/80 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none placeholder:text-slate-600"
                placeholder="Description..."
                rows={2}
              />
              <div className="flex gap-2 justify-end">
                <button onClick={handleCancel} className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 rounded-md">Cancel</button>
                <button onClick={handleSave} disabled={!editTitle.trim()} className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md">Save</button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className={`font-medium text-lg transition-all duration-300 ${todo.completed ? 'text-slate-500 line-through decoration-slate-600' : 'text-slate-100'}`}>{todo.title}</h3>
              {todo.description && <p className={`mt-1 text-sm ${todo.completed ? 'text-slate-600' : 'text-slate-400'}`}>{todo.description}</p>}
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Calendar size={12} />
                  {new Date(todo.createdAt || Date.now()).toLocaleDateString()}
                </span>
                {todo.id && typeof todo.id === 'number' && (
                   <span className="flex items-center gap-1 text-xs text-indigo-400/50" title="Database ID">
                     <Activity size={10} /> ID: {todo.id}
                   </span>
                )}
              </div>
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button onClick={() => setIsEditing(true)} className="p-2 text-slate-500 hover:text-indigo-400 rounded-lg"><Edit2 size={18} /></button>
            <button onClick={() => onDelete(todo.id)} className="p-2 text-slate-500 hover:text-rose-400 rounded-lg"><Trash2 size={18} /></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appMode, setAppMode] = useState('online');
  const [filter, setFilter] = useState('all');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDesc, setNewTodoDesc] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // --- USER PROFILE STATE ---
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {
      name: 'Web User',
      email: 'user@example.com',
      dob: '2000-01-01',
      role: 'Productivity Master'
    };
  });
  
  const [tempProfile, setTempProfile] = useState(userProfile);

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  const fetchTodos = async () => {
    setLoading(true);
    const { data, mode } = await todoService.getAll();
    setTodos(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    setAppMode(mode);
    setLoading(false);
  };

  const handleRetryConnection = async () => {
    setIsRetrying(true);
    // Add a small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const { data, mode } = await todoService.getAll();
    if (mode === 'online') {
      setTodos(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setAppMode('online');
      alert("✅ Success! Connected to Spring Boot Backend.");
    } else {
      setAppMode('offline');
      alert("❌ Connection failed!\n\nTo fix this:\n1. Open 'src/main/java/.../TodoApplication.java' in VS Code\n2. Click the small 'Run' button appearing above 'public static void main'\n3. Wait for the terminal to say 'Started TodoApplication'");
    }
    setIsRetrying(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    setIsSubmitting(true);
    const todoData = { title: newTodoTitle, description: newTodoDesc, completed: false };
    const createdTodo = await todoService.create(todoData, appMode);
    setTodos([createdTodo, ...todos]);
    setNewTodoTitle('');
    setNewTodoDesc('');
    setIsAdding(false);
    setIsSubmitting(false);
  };

  const handleUpdate = async (id, updates) => {
    const currentTodo = todos.find(t => t.id === id);
    if (!currentTodo) return;
    const fullUpdatedObject = { ...currentTodo, ...updates };
    setTodos(todos.map(t => t.id === id ? fullUpdatedObject : t));
    await todoService.update(id, fullUpdatedObject, appMode);
  };

  const handleDelete = async (id) => {
    setTodos(todos.filter(t => t.id !== id));
    await todoService.delete(id, appMode);
  };

  const handleProfileSave = () => {
    setUserProfile(tempProfile);
    setIsEditingProfile(false);
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;

  return (
    <div className="min-h-screen font-sans relative text-slate-100 selection:bg-indigo-500/30">
      <div className="fixed inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2564" alt="Abstract" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-[1px]" />
      </div>

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="relative z-10 py-8 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Status Bar */}
          <div className="flex justify-end">
            <button
              onClick={appMode === 'offline' ? handleRetryConnection : undefined}
              disabled={isRetrying}
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300 ${
                appMode === 'online' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-900/20 shadow-lg cursor-default' 
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-900/20 shadow-lg cursor-pointer hover:bg-rose-500/20 hover:scale-105 active:scale-95'
              }`}
            >
              {isRetrying ? (
                <RefreshCcw size={12} className="animate-spin" />
              ) : (
                appMode === 'online' ? <Wifi size={12} /> : <WifiOff size={12} />
              )}
              
              {isRetrying 
                ? 'Connecting...' 
                : (appMode === 'online' ? 'Spring Boot: Connected' : 'Disconnected (Click to Retry)')
              }
            </button>
          </div>

          {/* Header */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl shadow-indigo-900/20 border border-white/5">
            <div className="absolute inset-0">
              <img src="https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&q=80&w=2070" alt="Workspace" className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-indigo-900/40" />
            </div>
            <div className="relative p-8 space-y-2">
              <div className="flex items-center gap-3 text-indigo-300 mb-2">
                <Mountain size={20} className="text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300/80">Task Manager</span>
              </div>
              <h1 className="text-4xl font-bold text-white tracking-tight">Todo</h1>
              <p className="text-slate-300 max-w-lg text-lg">
                Clear your mind. You have <span className="font-bold text-white underline decoration-indigo-400 underline-offset-4">{activeCount}</span> pending {activeCount === 1 ? 'task' : 'tasks'} waiting for you.
              </p>
            </div>
          </div>

          {/* Add Task Form */}
          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-lg border border-slate-700/50 overflow-hidden transition-all duration-300 hover:border-slate-600 hover:bg-slate-800/80">
            {!isAdding ? (
              <button onClick={() => setIsAdding(true)} className="w-full p-4 flex items-center gap-3 text-slate-400 hover:text-slate-200 transition-all duration-200 text-left group">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-200"><Plus size={22} /></div>
                <span className="font-medium text-lg">Add a new task</span>
              </button>
            ) : (
              <form onSubmit={handleCreate} className="p-5 space-y-4 animate-in slide-in-from-top-2 duration-300">
                <input type="text" placeholder="What needs to be done?" className="w-full text-xl font-medium placeholder:text-slate-500 bg-transparent border-none focus:ring-0 p-0 text-white" value={newTodoTitle} onChange={(e) => setNewTodoTitle(e.target.value)} autoFocus />
                <textarea placeholder="Add details or context..." className="w-full text-slate-400 placeholder:text-slate-600 bg-transparent border-none focus:ring-0 p-0 resize-none text-base" rows={2} value={newTodoDesc} onChange={(e) => setNewTodoDesc(e.target.value)} />
                <div className="flex justify-end gap-3 pt-3 border-t border-slate-700/50">
                  <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 rounded-lg">Cancel</button>
                  <button type="submit" disabled={!newTodoTitle.trim() || isSubmitting} className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg flex items-center gap-2">
                    {isSubmitting ? <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span> : <Plus size={18} />}
                    {isSubmitting ? 'Adding...' : 'Add Task'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between border-b border-slate-800/50 pb-1">
            <div className="flex gap-8">
              {['all', 'active', 'completed'].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`pb-3 text-sm font-medium capitalize transition-all duration-300 relative ${filter === f ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>
                  {f} {filter === f && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full shadow-[0_-2px_10px_rgba(99,102,241,0.8)]" />}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="space-y-3 min-h-[300px]">
            {loading ? <div className="text-center py-12 text-slate-600 animate-pulse">Connecting to backend...</div> : filteredTodos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative mb-6 group">
                  <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-10 group-hover:opacity-20 rounded-full"></div>
                  <img src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=400&h=400" alt="Relax" className="relative w-40 h-40 object-cover rounded-full shadow-2xl border-4 border-slate-800 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute -bottom-2 -right-2 bg-slate-800 p-2 rounded-full border-4 border-slate-900"><Trophy className="text-yellow-400 w-6 h-6" /></div>
                </div>

                {/* --- PROFILE DETAILS SECTION --- */}
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-8 text-center w-full max-w-sm transform transition-all duration-300 shadow-xl relative group/profile">
                  
                  {/* Edit Toggle Button */}
                  <button 
                    onClick={() => {
                      setTempProfile(userProfile);
                      setIsEditingProfile(!isEditingProfile);
                    }}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title={isEditingProfile ? "Cancel" : "Edit Profile"}
                  >
                    {isEditingProfile ? <X size={18} /> : <Edit2 size={18} />}
                  </button>

                  <div className="flex flex-col items-center gap-1 mb-4">
                    {isEditingProfile ? (
                      <input 
                        type="text" 
                        value={tempProfile.name}
                        onChange={(e) => setTempProfile({...tempProfile, name: e.target.value})}
                        className="text-2xl font-bold text-white bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-center w-full focus:outline-none focus:border-indigo-500"
                        placeholder="Your Name"
                      />
                    ) : (
                      <h3 className="text-2xl font-bold text-white tracking-tight">{userProfile.name}</h3>
                    )}
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">All caught up!</span>
                  </div>
                  
                  <div className="space-y-3 w-full">
                    {/* Email */}
                    <div className="flex items-center gap-3 text-slate-400 bg-slate-900/50 p-2 rounded-lg">
                      <Mail size={16} className="text-indigo-400 flex-shrink-0" />
                      {isEditingProfile ? (
                        <input 
                          type="email" 
                          value={tempProfile.email}
                          onChange={(e) => setTempProfile({...tempProfile, email: e.target.value})}
                          className="bg-transparent border-none w-full text-sm text-white focus:ring-0 p-0"
                          placeholder="Email"
                        />
                      ) : (
                        <span className="text-sm truncate">{userProfile.email}</span>
                      )}
                    </div>
                    
                    {/* DOB */}
                    <div className="flex items-center gap-3 text-slate-400 bg-slate-900/50 p-2 rounded-lg">
                      <Cake size={16} className="text-rose-400 flex-shrink-0" />
                      {isEditingProfile ? (
                         <input 
                          type="date" 
                          value={tempProfile.dob}
                          onChange={(e) => setTempProfile({...tempProfile, dob: e.target.value})}
                          className="bg-transparent border-none w-full text-sm text-white focus:ring-0 p-0"
                        />
                      ) : (
                        <span className="text-sm">{new Date(userProfile.dob).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      )}
                    </div>

                    {/* Role */}
                    <div className="flex items-center gap-3 text-slate-400 bg-slate-900/50 p-2 rounded-lg">
                      <User size={16} className="text-sky-400 flex-shrink-0" />
                      {isEditingProfile ? (
                         <input 
                          type="text" 
                          value={tempProfile.role}
                          onChange={(e) => setTempProfile({...tempProfile, role: e.target.value})}
                          className="bg-transparent border-none w-full text-sm text-white focus:ring-0 p-0"
                          placeholder="Job Title"
                        />
                      ) : (
                        <span className="text-sm truncate">{userProfile.role}</span>
                      )}
                    </div>
                  </div>

                  {/* Save Actions */}
                  {isEditingProfile && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-end gap-2 animate-in fade-in">
                       <button 
                        onClick={() => setIsEditingProfile(false)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleProfileSave}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Save size={14} /> Save Profile
                      </button>
                    </div>
                  )}
                </div>
                {/* ------------------------------- */}

                <p className="text-slate-400 text-center max-w-xs mx-auto mb-6">You've cleared your list. Time to recharge.</p>
                
                <button 
                  onClick={() => setIsAdding(true)} 
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-95 flex items-center gap-2"
                >
                  <Plus size={18} />
                  Create New Task
                </button>
              </div>
            ) : filteredTodos.map((todo, index) => <TodoItem key={todo.id} todo={todo} index={index} onToggle={(id, status) => handleUpdate(id, { completed: status })} onDelete={handleDelete} onUpdate={handleUpdate} />)}
          </div>
        </div>
      </div>
    </div>
  );
}