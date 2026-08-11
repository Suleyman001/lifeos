"use client";

import { useState } from "react";
import { Briefcase, Globe2, Plus, Building, CheckCircle2, MapPin, ArrowRight } from "lucide-react";
import { updateApplicationStatus } from "@/lib/actions/career";
import AddApplicationModal from "./AddApplicationModal";

interface Application {
  id: string;
  company: string;
  position: string;
  country: string;
  location: string | null;
  workType: string;
  status: string;
  salary: string | null;
  visaSponsorship: boolean;
  notes: string | null;
}

interface CareerPipelineProps {
  initialApplications: Application[];
}

export default function CareerPipeline({ initialApplications }: CareerPipelineProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("ALL");

  const countries = ["Austria", "Germany", "Italy", "Spain", "Poland", "Netherlands", "Ireland"];
  const statuses = ["SAVED", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

  const filteredApps = initialApplications.filter((a) => {
    if (selectedCountry === "ALL") return true;
    return a.country === selectedCountry;
  });

  async function handleStatusChange(id: string, newStatus: any) {
    await updateApplicationStatus(id, newStatus);
  }

  return (
    <div className="space-y-6">
      {/* Country Filter Pills */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedCountry("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
              selectedCountry === "ALL"
                ? "bg-cyan-700 text-white shadow-md"
                : "bg-slate-900 text-slate-400 border border-slate-800"
            }`}
          >
            All Countries
          </button>
          {countries.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCountry(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                selectedCountry === c
                  ? "bg-cyan-700 text-white shadow-md"
                  : "bg-slate-900 text-slate-400 border border-slate-800"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-xs font-bold text-white shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Log Application</span>
        </button>
      </div>

      {/* Kanban / Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {statuses.map((st) => {
          const colApps = filteredApps.filter((a) => a.status === st);

          return (
            <div key={st} className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3 min-h-[450px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold font-mono text-cyan-400">{st}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono">
                  {colApps.length}
                </span>
              </div>

              <div className="space-y-3">
                {colApps.map((app) => (
                  <div key={app.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{app.company}</h4>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-mono">
                        {app.country}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 font-medium">{app.position}</p>

                    {app.visaSponsorship && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-mono inline-block">
                        Visa Sponsor
                      </span>
                    )}

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">{app.salary || "N/A"}</span>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-slate-300 rounded px-1.5 py-0.5 text-[9px]"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <AddApplicationModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
