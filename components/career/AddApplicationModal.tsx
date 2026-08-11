"use client";

import { useState } from "react";
import { X, Briefcase, Plus } from "lucide-react";
import { createCareerApplication } from "@/lib/actions/career";

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddApplicationModal({ isOpen, onClose }: AddApplicationModalProps) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [country, setCountry] = useState("Germany");
  const [location, setLocation] = useState("Munich");
  const [workType, setWorkType] = useState<"REMOTE" | "HYBRID" | "ONSITE">("HYBRID");
  const [status, setStatus] = useState<"SAVED" | "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED" | "ACCEPTED">("SAVED");
  const [salary, setSalary] = useState("€65,000");
  const [visaSponsorship, setVisaSponsorship] = useState(true);
  const [jobUrl, setJobUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const countries = ["Austria", "Germany", "Italy", "Spain", "Poland", "Netherlands", "Ireland"];

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!company.trim() || !position.trim()) return;

    setLoading(true);
    await createCareerApplication({
      company: company.trim(),
      position: position.trim(),
      country,
      location: location.trim() || undefined,
      workType,
      status,
      salary: salary.trim() || undefined,
      visaSponsorship,
      jobUrl: jobUrl.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg glass-panel rounded-2xl border border-slate-700/80 shadow-2xl p-6 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Log Job Application</h3>
            <p className="text-xs text-slate-400">Track career opportunities across target EU countries.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company *</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Amazon, BMW, SAP..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Position *</label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. AWS Solutions Architect..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="SAVED">Saved</option>
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEW">Interviewing</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Work Type</label>
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="HYBRID">Hybrid</option>
                <option value="REMOTE">Remote</option>
                <option value="ONSITE">On-Site</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Salary</label>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. €65,000"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="visaSponsorship"
              checked={visaSponsorship}
              onChange={(e) => setVisaSponsorship(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <label htmlFor="visaSponsorship" className="text-xs text-slate-300 font-medium">
              Requires Visa Sponsorship / Relocation Support
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-600 disabled:opacity-50 text-xs font-semibold text-white transition-all shadow-md"
            >
              Save Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
