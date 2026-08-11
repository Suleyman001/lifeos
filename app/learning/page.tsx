import Sidebar from "@/components/shell/Sidebar";
import Header from "@/components/shell/Header";
import LearningCenter from "@/components/learning/LearningCenter";
import { getLearningData } from "@/lib/actions/learning";

export default async function LearningPage() {
  const { items } = await getLearningData();

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Learning Center"
          subtitle="German/Arabic vocabulary, IT certifications (AWS/Azure), programming & books."
        />
        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <LearningCenter items={items as any} />
        </main>
      </div>
    </div>
  );
}
