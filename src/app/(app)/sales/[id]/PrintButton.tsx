"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700 active:scale-95"
    >
      🖨️ چاپ
    </button>
  );
}
