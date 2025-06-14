import NavBar from "@/components/NavBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full">
      <NavBar />
      <main className="flex-1 min-w-0 overflow-hidden bg-gray-50">
        <div className="h-full overflow-auto scrollbar-modern p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
