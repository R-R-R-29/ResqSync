import React, { useState } from 'react';
import { X, ShieldAlert, Heart, Wind, Brain } from 'lucide-react';
import { UX4GButton } from './common/UX4GButton';

export function TriageFormModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    tag_number: `RSQ-${Math.floor(1000 + Math.random() * 9000)}`,
    triage_category: 'immediate',
    patient_name: '',
    age: '',
    gender: 'Unknown',
    respiration_rate: '',
    pulse_rate: '',
    mental_status: 'Alert',
    injuries: '',
    field_unit_id: 'Chooralmala Relief Post • Sector 3'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const categories = [
    { id: 'immediate', label: 'RED • Immediate', active: 'bg-[#FDE3DF] text-[#C94336] border-[#FBCBC4] ring-2 ring-coral', dot: 'bg-[#D94343]' },
    { id: 'delayed', label: 'YELLOW • Delayed', active: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A] ring-2 ring-[#E5A33D]', dot: 'bg-[#E5A33D]' },
    { id: 'minor', label: 'GREEN • Minor', active: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0] ring-2 ring-[#4F9D69]', dot: 'bg-[#4F9D69]' },
    { id: 'expectant', label: 'BLACK • Expectant', active: 'bg-[#F3F1EF] text-ink border-outline ring-2 ring-ink', dot: 'bg-[#171717]' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
      <div className="bg-white border border-outline rounded-[28px] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#F3F1EF] bg-surface-secondary">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-coral flex items-center justify-center text-white shadow-sm">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-ink tracking-tight">Rapid Casualty Intake</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-ink-muted hover:text-ink hover:bg-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Triage Tag Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-secondary mb-2">
              Triage Status (START Protocol)
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setFormData({ ...formData, triage_category: cat.id })}
                  className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition flex items-center justify-center space-x-1.5 border ${
                    formData.triage_category === cat.id
                      ? `${cat.active} shadow-soft`
                      : 'bg-white text-ink border-outline hover:border-coral/50'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${cat.dot}`} />
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tag Number & Patient Info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Tag Identifier</label>
              <input
                type="text"
                value={formData.tag_number}
                onChange={(e) => setFormData({ ...formData, tag_number: e.target.value })}
                className="w-full bg-white border border-outline rounded-xl px-3.5 py-2 text-ink font-mono text-sm focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral-light"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Patient Name</label>
              <input
                type="text"
                placeholder="Unidentified"
                value={formData.patient_name}
                onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                className="w-full bg-white border border-outline rounded-xl px-3.5 py-2 text-ink text-sm focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral-light"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Estimated Age</label>
              <input
                type="number"
                placeholder="e.g. 34"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full bg-white border border-outline rounded-xl px-3.5 py-2 text-ink text-sm focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral-light"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full bg-white border border-outline rounded-xl px-3 py-2 text-ink text-sm focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral-light"
              >
                <option value="Unknown">Unknown</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Vitals Section */}
          <div className="pt-2 border-t border-[#F3F1EF]">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-secondary block mb-2">
              Primary Vitals Assessment
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="flex items-center space-x-1 text-[11px] text-ink font-semibold mb-1">
                  <Wind className="w-3 h-3 text-[#5C83B6]" />
                  <span>Resp (/min)</span>
                </label>
                <input
                  type="number"
                  placeholder="30+"
                  value={formData.respiration_rate}
                  onChange={(e) => setFormData({ ...formData, respiration_rate: e.target.value })}
                  className="w-full bg-white border border-outline rounded-xl px-2.5 py-1.5 text-ink text-sm focus:outline-none focus:border-coral"
                />
              </div>

              <div>
                <label className="flex items-center space-x-1 text-[11px] text-ink font-semibold mb-1">
                  <Heart className="w-3 h-3 text-coral" />
                  <span>Pulse (bpm)</span>
                </label>
                <input
                  type="number"
                  placeholder="110"
                  value={formData.pulse_rate}
                  onChange={(e) => setFormData({ ...formData, pulse_rate: e.target.value })}
                  className="w-full bg-white border border-outline rounded-xl px-2.5 py-1.5 text-ink text-sm focus:outline-none focus:border-coral"
                />
              </div>

              <div>
                <label className="flex items-center space-x-1 text-[11px] text-ink font-semibold mb-1">
                  <Brain className="w-3 h-3 text-[#92400E]" />
                  <span>Mental</span>
                </label>
                <select
                  value={formData.mental_status}
                  onChange={(e) => setFormData({ ...formData, mental_status: e.target.value })}
                  className="w-full bg-white border border-outline rounded-xl px-2 py-1.5 text-ink text-sm focus:outline-none focus:border-coral"
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
            <label className="block text-xs font-bold text-ink mb-1">Medical Assessment & Trauma Notes</label>
            <textarea
              rows="2"
              placeholder="e.g. Blunt chest trauma, compound femur fracture, severe bleeding..."
              value={formData.injuries}
              onChange={(e) => setFormData({ ...formData, injuries: e.target.value })}
              className="w-full bg-white border border-outline rounded-xl px-3.5 py-2 text-ink text-sm focus:outline-none focus:border-coral resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#F3F1EF]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-outline text-ink-secondary text-xs font-bold hover:bg-surface-secondary transition min-h-[42px]"
            >
              Cancel
            </button>
            <UX4GButton
              type="submit"
              variant="primary"
              size="md"
            >
              Commit Casualty Record
            </UX4GButton>
          </div>

        </form>
      </div>
    </div>
  );
}

export default TriageFormModal;
