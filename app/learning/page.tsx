import PlaceholderModule from "@/components/shell/PlaceholderModule";
import { BookOpen, Award, CheckCircle2 } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function LearningPage() {
  const learningItems = await prisma.learningItem.findMany({
    include: { territory: true },
  });

  return (
    <PlaceholderModule
      title="Learning Center"
      subtitle="German/Arabic vocabulary, IT certifications (AWS/Azure), programming & books."
      icon={BookOpen}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {learningItems.map((item) => (
          <div key={item.id} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-teal-400">{item.category}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                {item.status}
              </span>
            </div>

            <h4 className="text-base font-bold text-white">{item.title}</h4>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Progress</span>
                <span className="text-teal-400 font-bold">{item.progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-600 to-emerald-500 h-full rounded-full"
                  style={{ width: `${item.progressPercent}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-400">
              <span>Vocab Learned: <strong>{item.vocabLearned} / {item.targetVocab || 500}</strong></span>
              <span>Time: <strong>{item.timeSpentMinutes} mins</strong></span>
            </div>
          </div>
        ))}
      </div>
    </PlaceholderModule>
  );
}
