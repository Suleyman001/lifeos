import Sidebar from "@/components/shell/Sidebar";
import Header from "@/components/shell/Header";
import JournalEditor from "@/components/journal/JournalEditor";
import { getJournalEntries } from "@/lib/actions/journal";

export default async function JournalPage() {
  const entries = await getJournalEntries();

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Journal"
          subtitle="Daily, Weekly & Monthly structured reflection. Your thoughts stay local."
        />
        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <JournalEditor initialEntries={entries as any} />
        </main>
      </div>
    </div>
  );
}
