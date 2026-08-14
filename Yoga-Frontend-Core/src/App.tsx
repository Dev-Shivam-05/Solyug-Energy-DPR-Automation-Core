import React, { useState, useEffect } from 'react';
import { CanvasContainer } from './components/3d/CanvasContainer';
import type { Exercise } from './types';

export default function App() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch exercises on load
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/exercises');
        const result = await response.json();
        if (result.success) {
          setExercises(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch exercises:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Filter exercises based on search query
  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (exercise.sanskritName && exercise.sanskritName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    exercise.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    exercise.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Intermediate':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Advanced':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 font-sans">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <CanvasContainer exercise={selectedExercise} />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 p-6 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">YogaFlow</h1>
              <p className="text-xs text-slate-400 tracking-wider">Premium Exercise Platform</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-white/80">
            <a href="#" className="hover:text-white transition">Exercises</a>
            <a href="#" className="hover:text-white transition">Workouts</a>
            <a href="#" className="hover:text-white transition">About</a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col md:flex-row h-full pt-24 pb-6 px-6 gap-6">
        {/* Left Sidebar - Exercise List */}
        <div className="w-full md:w-96 flex flex-col gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search exercises, poses, muscles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-lg shadow-black/20"
            />
          </div>

          {/* Exercise List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 pb-4">
            {loading ? (
              <div className="text-center py-12 text-white/60">
                <div className="w-10 h-10 mx-auto mb-4 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                Loading exercises...
              </div>
            ) : filteredExercises.length === 0 ? (
              <div className="text-center py-12 text-white/60">
                No exercises found
              </div>
            ) : (
              filteredExercises.map((exercise) => (
                <button
                  key={exercise._id}
                  onClick={() => setSelectedExercise(exercise)}
                  className={`w-full p-4 rounded-2xl text-left transition-all duration-300 border text-left ${
                    selectedExercise?._id === exercise._id
                      ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 border-purple-400/50 shadow-xl shadow-purple-500/20 transform scale-[1.02]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-black/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white">{exercise.name}</h3>
                        {exercise.isPopular && (
                          <div className="text-yellow-400">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {exercise.sanskritName && (
                        <p className="text-sm text-purple-300 mb-2 italic">{exercise.sanskritName}</p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(exercise.difficulty)}`}>
                          {exercise.difficulty}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-500/20 text-slate-300 border border-slate-500/30">
                          {exercise.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Exercise Details */}
        <div className="flex-1 flex items-center justify-center md:justify-end md:pl-8">
          {selectedExercise ? (
            <div className="w-full max-w-2xl bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl shadow-black/30 max-h-[calc(100vh-10rem)] overflow-y-auto">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">{selectedExercise.name}</h2>
                  {selectedExercise.sanskritName && (
                    <p className="text-purple-300 text-lg italic">{selectedExercise.sanskritName}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(selectedExercise.difficulty)}`}>
                    {selectedExercise.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-500/20 text-slate-300 border border-slate-500/30">
                    {selectedExercise.type}
                  </span>
                </div>
              </div>
              
              <p className="text-slate-200 mb-6 leading-relaxed">{selectedExercise.description}</p>
absolute inset-0 z-0 w-full h-full pointer-events-auto
              {/* Interaction Controls */}
              <div className="flex flex-wrap gap-3 mb-6">
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 rounded-xl text-white text-sm font-medium transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Replay
                </button>
                <button className="flex gap-2 px-4 py-2 text-sm font-medium text-white rounded-xl border transition-all itemsicenter bg-blue-s00/30 hover:bg-blue-600/50 border-blue-400/40">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Step-by-Step
                </button>
                <button className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-white rounded-xl border transition-all bg-green-600/30 hover:bg-green-600/50 border-green-400/40">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Slow Motion
                </button>
                <button className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-white rounded-xl border transition-all bg-yellow-600/30 hover:bg-yellow-600/50 border-yellow-400/40">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Highlight Muscles
                </button>
              </div>

              <div className="space-y-6">
                {/* Steps */}
                <div>
                  <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
                    <svg absolute top-6 left-6 z-20 pointer-events-none select-none animate-fade-in
                      <pflex gap-2 items-centerd" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Steps
                  </h3>font-sans font-light text-sky-500/30
                  <ol className="space-y-3">
                    {selectedExercise.steps.map((step, idx) => (
                      <li key={idx} className="text-slate-200 text-sm flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/30 text-purple-300 flex items-center justify-center text-xs font-semibold">
                          {idx + 1}
                      flex overflow-y-auto absolute inset-0 z-10 justify-start items-center p-6 w-full h-full pointer-events-none select-none
                        <span>{step}</span>
                      </lip-6 config-glass-card
                    ))}
                  </ol>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="text-lg font-semibold text-green-300 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Benefits
                  </h3>
                  <ul className="space-y-2">
                    {selectedExercise.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-slate-200 text-sm flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Muscles Worked */}
                <div>
                  <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Muscles Worked
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedExercise.musclesWorked.map((muscle, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-200 text-sm">
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sets & Reps / Duration */}
                {(selectedExercise.sets || selectedExercise.reps || selectedExercise.durationSeconds > 0) && (
                  <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-4">
                    {selectedExercise.durationSeconds > 0 && (
                      <div className="text-center">
                        <p className="text-xs text-slate-400 uppercase tracking-wider">Duration</p>
                        <p className="text-2xl font-bold text-white">{selectedExercise.durationSeconds}s</p>
                      </div>
                    )}
                    {selectedExercise.sets && (
                      <div className="text-center">
                        <p className="text-xs text-slate-400 uppercase tracking-wider">Sets</p>
                        <p className="text-2xl font-bold text-white">{selectedExercise.sets}</p>
                      </div>
                    )}
                    {selectedExercise.reps && (
                      <div className="text-center">
                        <p className="text-xs text-slate-400 uppercase tracking-wider">Reps</p>
                        <p className="text-2xl font-bold text-white">{selectedExercise.reps}</p>
                      </div>
                    )}
                    {selectedExercise.restSeconds && (
                      <div className="text-center">
                        <p className="text-xs text-slate-400 uppercase tracking-wider">Rest</p>
                        <p className="text-2xl font-bold text-white">{selectedExercise.restSeconds}s</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Precautions */}
                {selectedExercise.precautions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-300 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Precautions
                    </h3>
                    <ul className="space-y-2">
                      {selectedExercise.precautions.map((precaution, idx) => (
                        <li key={idx} className="text-slate-200 text-sm flex items-start gap-2">
                          <span className="text-yellow-400 mt-1">•</span>
                          {precaution}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Breathing Technique */}
                {selectedExercise.breathingTechnique && (
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-300 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                      Breathing Technique
                    </h3>
                    <p className="text-slate-200 text-sm">{selectedExercise.breathingTechnique}</p>
                  </div>
                )}

                {/* Start Button */}
                <button className="w-full mt-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transform hover:scale-[1.02] active:scale-[0.98]">
                  Start Practice
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-white/60 max-w-md">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-400/20 shadow-lg">
                <svg className="w-12 h-12 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to YogaFlow</h2>
              <p>Select an exercise from the list to view details and see the 3D visualization</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
