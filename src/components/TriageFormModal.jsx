import React, { useState } from 'react';
import { X, ShieldAlert, Heart, Wind, Brain } from 'lucide-react';

export function TriageFormModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    tag_number: `TAG-${Math.floor(100000 + Math.random() * 900000)}`,
    triage_category: 'immediate',
    patient_name: '',
    age: '',
    gender: 'Unknown',
    respiration_rate: '',
    pulse_rate: '',
    mental_status: 'Alert',
    injuries: '',
    field_unit_id: 'UNIT-ALPHA'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const categories = [
    { id: 'immediate', label: 'IMMEDIATE', color: 'bg-resq-immediate hover:bg-red-600', ring: 'ring-resq-immediate' },
    { id: 'delayed', label: 'DELAYED', color: 'bg-resq-delayed hover:bg-amber-600 text-slate-950 font-bold', ring: 'ring-resq-delayed' },
    { id: 'minor', label: 'MINOR', color: 'bg-resq-minor hover:bg-emerald-600', ring: 'ring-resq-minor' },
    { id: 'expectant', label: 'EXPECTANT', color: 'bg-resq-expectant hover:bg-slate-700', ring: 'ring-slate-400' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-resq-dark border border-resq-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-resq-border bg-slate-900/60">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-resq-immediate" />
            <h2 className="text-lg font-bold text-white tracking-wide">Emergency Triage Intake</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Triage Tag Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Select Triage Category (START Protocol)
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setFormData({ ...formData, triage_category: cat.id })}
                  className={`py-3 px-2 rounded-xl text-xs font-black tracking-wider transition ${cat.color} ${
                    formData.triage_category === cat.id ? 'ring-4 ring-white shadow-lg scale-105' : 'opacity-70'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tag Number & Patient Info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tag Identifier</label>
              <input
                type="text"
                value={formData.tag_number}
                onChange={(e) => setFormData({ ...formData, tag_number: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Patient Name (or Blank)</label>
              <input
                type="text"
                placeholder="Unidentified"
                value={formData.patient_name}
                onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Estimated Age</label>
              <input
                type="number"
                placeholder="e.g. 34"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
              >
                <option value="Unknown">Unknown</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Vitals Section */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Primary Vitals Assessment
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="flex items-center space-x-1 text-[11px] text-slate-300 mb-1">
                  <Wind className="w-3 h-3 text-sky-400" />
                  <span>Resp (/min)</span>
                </label>
                <input
                  type="number"
                  placeholder="30+"
                  value={formData.respiration_rate}
                  onChange={(e) => setFormData({ ...formData, respiration_rate: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="flex items-center space-x-1 text-[11px] text-slate-300 mb-1">
                  <Heart className="w-3 h-3 text-rose-400" />
                  <span>Pulse (bpm)</span>
                </label>
                <input
                  type="number"
                  placeholder="110"
                  value={formData.pulse_rate}
                  onChange={(e) => setFormData({ ...formData, pulse_rate: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="flex items-center space-x-1 text-[11px] text-slate-300 mb-1">
                  <Brain className="w-3 h-3 text-purple-400" />
                  <span>Mental</span>
                </label>
                <select
                  value={formData.mental_status}
                  onChange={(e) => setFormData({ ...formData, mental_status: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-red-500"
                >
                  <option value="Alert">Alert</option>
                  <option value="Verbal">Verbal Resp</option>
                  <option value="Pain">Pain Resp</option>
                  <option value="Unresponsive">Unresponsive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Injuries Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Injury Assessment & Trauma Notes</label>
            <textarea
              rows="2"
              placeholder="e.g. Blunt chest trauma, compound femur fracture, severe bleeding..."
              value={formData.injuries}
              onChange={(e) => setFormData({ ...formData, injuries: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-resq-immediate hover:bg-red-600 text-white text-sm font-bold shadow-emergency-glow transition"
            >
              Commit Local Triage Record
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
