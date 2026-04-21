"use client";

export default function DashboardError({ error }: { error: Error }) {
  return (
    <div className="p-6 text-white">
      <h1 className="text-xl font-bold text-red-400 mb-2">Erro no Dashboard</h1>
      <pre className="bg-[#16213E] p-4 rounded text-sm text-red-300 whitespace-pre-wrap">
        {error.message}
        {process.env.NODE_ENV === "development" && "\n" + error.stack}
      </pre>
    </div>
  );
}
