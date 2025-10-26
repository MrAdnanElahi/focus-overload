"use client";
import FocusOverload from "@/components/focus/FocusOverload";
import HistoryList from "@/components/focus/HistoryList";
export default function Page() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FocusOverload />
      <HistoryList />
    </div>
  );
}
