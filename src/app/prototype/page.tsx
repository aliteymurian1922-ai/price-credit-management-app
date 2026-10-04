"use client";

import { useMemo, useState } from "react";

type Tab = "home" | "sales" | "customers" | "growth";
type Modal = null | "sale" | "ask" | "voice" | "scenario" | "weekly" | "opportunities";

const nav = [
  { id: "home" as const, label: "امروز", icon: "⌂" },
  { id: "sales" as const, label: "فروش", icon: "↗" },
  { id: "customers" as const, label: "مشتری‌ها", icon: "◎" },
  { id: "growth" as const, label: "رشد", icon: "✦" },
];

const week = [
  { day: "ش", value: 46 },
  { day: "ی", value: 58 },
  { day: "د", value: 51 },
  { day: "س", value: 72 },
  { day: "چ", value: 64 },
  { day: "پ", value: 88 },
  { day: "ج", value: 76 },
];

const opportunities = [
  { title: "برگرداندن ۳ مشتری قدیمی", amount: 12, meta: "زمان خرید مجددشان رسیده", tone: "lime", action: "ساخت لیست پیگیری" },
  { title: "وصول ۲ طلب سررسیدشده", amount: 6.5, meta: "احتمال وصول امروز بالاست", tone: "rose", action: "شروع پیگیری" },
  { title: "اصلاح قیمت قهوه ویژه", amount: 2.1, meta: "حاشیه سود ۶٪ افت کرده", tone: "amber", action: "بررسی قیمت" },
  { title: "فروش مکمل به ۸ مشتری", amount: 2.8, meta: "گرانولا کنار قهوه خوب جواب داده", tone: "sky", action: "دیدن مشتری‌ها" },
];

const customerRows = [
  { name: "کافه دنج", tag: "طلب فوری", value: "۸.۴ م", detail: "۳ روز از سررسید گذشته", tone: "rose" },
  { name: "فروشگاه بهار", tag: "در خطر ریزش", value: "۵.۱ م", detail: "۹ روز دیرتر از الگوی خرید", tone: "amber" },
  { name: "مارکت آفتاب", tag: "VIP", value: "۳.۷ م", detail: "ارزش خرید ۹۰ روزه: ۲۸ م", tone: "emerald" },
  { name: "خانه سبز", tag: "فرصت بازگشت", value: "۴.۶ م", detail: "احتمال خرید مجدد: ۸۱٪", tone: "sky" },
];

const products = [
  { name: "قهوه ویژه", sales: "۳۲.۴ م", margin: "۱۸٪", signal: "قیمت نیاز به بررسی دارد", tone: "amber" },
  { name: "گرانولا", sales: "۲۴.۱ م", margin: "۳۴٪", signal: "ستاره این هفته", tone: "emerald" },
  { name: "عسل طبیعی", sales: "۱۸.۸ م", margin: "۲۹٪", signal: "روند پایدار", tone: "emerald" },
  { name: "کره بادام", sales: "۹.۲ م", margin: "۱۲٪", signal: "سود پایین", tone: "rose" },
];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={"rounded-[28px] border border-stone-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(28,25,23,0.04)] " + className}>{children}</section>;
}

function Pill({ children, tone = "stone" }: { children: React.ReactNode; tone?: string }) {
  const colors: Record<string, string> = {
    stone: "bg-stone-100 text-stone-600",
    lime: "bg-lime-100 text-lime-800",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    sky: "bg-sky-50 text-sky-700",
  };
  return <span className={"inline-flex rounded-full px-2.5 py-1 text-[10px] font-black " + (colors[tone] || colors.stone)}>{children}</span>;
}

function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/35 p-3 backdrop-blur-sm sm:place-items-center" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[30px] bg-white p-5 shadow-2xl sm:p-6" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default function PrototypePage() {
  const [tab, setTab] = useState<Tab>("home");
  const [modal, setModal] = useState<Modal>(null);
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [done, setDone] = useState<number[]>([]);
  const [askText, setAskText] = useState("");
  const [askAnswer, setAskAnswer] = useState("");
  const [recording, setRecording] = useState(false);
  const [voiceParsed, setVoiceParsed] = useState(false);
  const [priceIncrease, setPriceIncrease] = useState(5);
  const [toast, setToast] = useState("");

  const completedCount = done.length;
  const opportunityTotal = useMemo(() => opportunities.reduce((sum, item) => sum + item.amount, 0), []);
  const projectedProfit = Math.round((31.2 + priceIncrease * 0.72) * 10) / 10;

  const toggleDone = (index: number) => {
    setDone((current) => current.includes(index) ? current.filter((x) => x !== index) : [...current, index]);
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 2400);
  };

  const ask = (question?: string) => {
    const q = question || askText;
    if (!q.trim()) return;
    setAskText(q);
    if (q.includes("سود")) {
      setAskAnswer("بیشترین فشار روی سود از «قهوه ویژه» و «کره بادام» آمده. هزینه خرید بالا رفته ولی قیمت فروش متناسب تغییر نکرده. اگر فقط قیمت قهوه ویژه ۵٪ اصلاح شود، سود ماهانه حدود ۲.۱ میلیون تومان بهتر می‌شود.");
    } else if (q.includes("مشتری") || q.includes("پیگیری")) {
      setAskAnswer("امروز اول «کافه دنج» را برای طلب ۸.۴ میلیونی پیگیری کن، بعد با «فروشگاه بهار» و «خانه سبز» تماس بگیر. این سه اقدام روی هم حدود ۱۴.۷ میلیون تومان اثر مالی بالقوه دارند.");
    } else {
      setAskAnswer("برای امروز سه اولویت داری: وصول طلب کافه دنج، برگرداندن مشتری‌های دیرکرده، و اصلاح حاشیه سود قهوه ویژه. اگر فقط همین سه کار انجام شود، اثر مالی بالقوه حدود ۲۰.۵ میلیون تومان است.");
    }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#f7f7f2] text-stone-900">
      <div className="mx-auto min-h-screen max-w-[1500px] lg:grid lg:grid-cols-[252px_1fr]">
        <aside className="hidden border-l border-white/10 bg-[#173c32] px-5 py-7 text-white lg:flex lg:flex-col">
          <div className="mb-9 flex items-center gap-3 px-2">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#d7ff69] text-xl font-black text-[#173c32]">ن</div>
            <div><div className="text-lg font-black">نبض</div><div className="text-xs text-emerald-100/65">دستیار رشد کسب‌وکار</div></div>
          </div>

          <nav className="space-y-2">
            {nav.map((item) => (
              <button key={item.id} onClick={() => setTab(item.id)} className={"flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-right text-sm transition " + (tab === item.id ? "bg-white text-[#173c32] shadow-lg" : "text-emerald-50/80 hover:bg-white/10")}>
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-black/5 text-lg">{item.icon}</span>
                <span className="font-bold">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-7 rounded-[24px] border border-white/10 bg-white/10 p-4">
            <div className="flex items-center justify-between"><span className="text-xs text-emerald-100/70">تمرکز امروز</span><span className="text-xs font-black text-[#d7ff69]">{completedCount}/۳</span></div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div style={{ width: (completedCount / 3) * 100 + "%" }} className="h-full rounded-full bg-[#d7ff69] transition-all" /></div>
            <p className="mt-3 text-[11px] leading-5 text-emerald-50/65">سه کار کوچک که بیشترین اثر مالی را دارند.</p>
          </div>

          <button onClick={() => setModal("ask")} className="mt-3 flex items-center gap-3 rounded-[22px] border border-white/10 bg-[#d7ff69] p-4 text-right text-[#173c32]">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#173c32] text-white">✦</span>
            <span><b className="block text-sm">از نبض بپرس</b><span className="text-[10px] opacity-70">جواب بر اساس داده کسب‌وکار</span></span>
          </button>

          <div className="mt-auto rounded-[24px] bg-black/10 p-4">
            <div className="mb-2 flex justify-between text-xs"><span className="text-emerald-100/70">هدف این ماه</span><b>۷۸٪</b></div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[78%] rounded-full bg-[#d7ff69]" /></div>
            <div className="mt-3 flex justify-between text-[10px] text-emerald-100/60"><span>۴۵۲ م فروش</span><span>هدف ۵۸۰ م</span></div>
          </div>
        </aside>

        <div className="pb-28 lg:pb-8">
          <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-[#f7f7f2]/92 px-4 py-3 backdrop-blur-xl sm:px-7 lg:px-10">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 lg:hidden"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#173c32] font-black text-[#d7ff69]">ن</div><span className="font-black">نبض</span></div>
                <div className="hidden lg:block"><p className="text-[11px] text-stone-400">شنبه، ۱۲ مهر</p><h1 className="text-lg font-black">صبح بخیر، علی 👋</h1></div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setModal("voice")} title="ثبت صوتی" className="grid h-10 w-10 place-items-center rounded-2xl border border-stone-200 bg-white text-sm shadow-sm">◉</button>
                <button onClick={() => setModal("ask")} title="از نبض بپرس" className="grid h-10 w-10 place-items-center rounded-2xl border border-stone-200 bg-white text-sm shadow-sm lg:hidden">✦</button>
                <button onClick={() => setModal("sale")} className="rounded-2xl bg-[#173c32] px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-emerald-950/10 sm:text-sm">+ ثبت فروش</button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-7 lg:px-10">
            {tab === "home" && (
              <div className="space-y-5">
                <section className="relative overflow-hidden rounded-[34px] bg-[#173c32] p-6 text-white sm:p-8">
                  <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-[#d7ff69]/12 blur-3xl" />
                  <div className="relative grid gap-7 xl:grid-cols-[1.25fr_.75fr] xl:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2"><Pill tone="lime">نبض امروز</Pill><span className="text-[11px] text-emerald-100/60">به‌روزرسانی ۱۰ دقیقه پیش</span></div>
                      <h2 className="mt-4 max-w-2xl text-2xl font-black leading-relaxed sm:text-3xl">امروز حدود <span className="text-[#d7ff69]">۲۳.۴ میلیون تومان</span> پول روی زمین داری.</h2>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50/70">چهار فرصت پیدا کردم. لازم نیست همه‌چیز را بررسی کنی؛ اول سه کاری را انجام بده که بیشترین اثر مالی دارند.</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <button onClick={() => setModal("opportunities")} className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#173c32]">دیدن فرصت‌های امروز</button>
                        <button onClick={() => setModal("ask")} className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white">✦ چرا این‌ها مهم‌اند؟</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2 rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur">
                        <div className="flex items-center justify-between"><span className="text-xs text-emerald-100/70">سلامت کسب‌وکار</span><span className="text-xs font-bold text-[#d7ff69]">خوب</span></div>
                        <div className="mt-2 flex items-end gap-2"><span className="text-5xl font-black text-[#d7ff69]">۸۲</span><span className="pb-1 text-xs text-emerald-100/60">از ۱۰۰</span></div>
                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[82%] rounded-full bg-[#d7ff69]" /></div>
                      </div>
                      <div className="rounded-[22px] bg-white/10 p-4"><span className="text-[10px] text-emerald-100/60">فروش</span><b className="mt-1 block text-lg">عالی ↑</b></div>
                      <div className="rounded-[22px] bg-white/10 p-4"><span className="text-[10px] text-emerald-100/60">نقدینگی</span><b className="mt-1 block text-lg text-amber-200">نیاز به توجه</b></div>
                    </div>
                  </div>
                </section>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    ["فروش امروز", "۱۸.۶ م", "↑ ۱۴٪", "از شنبه‌های معمول", "emerald"],
                    ["سود تقریبی", "۴.۲ م", "۲۲.۵٪", "حاشیه سود امروز", "stone"],
                    ["پول قابل وصول", "۲۷.۸ م", "۳ نفر", "دو مورد فوری", "rose"],
                    ["هدف ماه", "۷۸٪", "۶ روز", "۴۴ م تا پیش‌بینی هدف", "amber"],
                  ].map(([label, value, badge, note, tone]) => (
                    <Card key={label} className="!p-4">
                      <div className="flex items-start justify-between"><span className="text-xs font-bold text-stone-500">{label}</span><Pill tone={tone}>{badge}</Pill></div>
                      <div className="mt-3 text-2xl font-black">{value}</div><div className="mt-1 text-[11px] text-stone-400">{note}</div>
                    </Card>
                  ))}
                </div>

                <div className="grid gap-5 xl:grid-cols-[.82fr_1.18fr]">
                  <Card>
                    <div className="flex items-center justify-between">
                      <div><h3 className="font-black">سه کار امروز</h3><p className="mt-1 text-xs text-stone-400">بقیه چیزها فعلاً می‌توانند صبر کنند.</p></div>
                      <span className="text-xs font-black text-[#28745f]">{completedCount}/۳</span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {[
                        ["پیگیری کافه دنج", "۸.۴ م طلب، ۳ روز گذشته", "۸.۴ م", "rose"],
                        ["تماس با ۳ مشتری قدیمی", "احتمال خرید مجدد بالاست", "۱۲ م", "lime"],
                        ["بررسی قیمت قهوه ویژه", "حاشیه سود ۶٪ افت کرده", "۲.۱ م", "amber"],
                      ].map(([title, note, value, tone], i) => {
                        const isDone = done.includes(i);
                        return (
                          <button key={title} onClick={() => toggleDone(i)} className={"w-full rounded-2xl border p-4 text-right transition " + (isDone ? "border-emerald-200 bg-emerald-50/70 opacity-65" : "border-stone-200 hover:border-emerald-300")}>
                            <div className="flex items-center gap-3">
                              <span className={"grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-black " + (isDone ? "bg-emerald-600 text-white" : tone === "rose" ? "bg-rose-50 text-rose-700" : tone === "amber" ? "bg-amber-50 text-amber-700" : "bg-lime-100 text-lime-800")}>{isDone ? "✓" : i + 1}</span>
                              <div className="min-w-0 flex-1"><b className={"block text-sm " + (isDone ? "line-through" : "")}>{title}</b><p className="mt-1 truncate text-[11px] text-stone-400">{note}</p></div>
                              <b className="text-xs">{value}</b>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </Card>

                  <Card>
                    <div className="mb-6 flex items-center justify-between">
                      <div><h3 className="font-black">ریتم فروش</h3><p className="mt-1 text-xs text-stone-400">فقط چیزی که برای تصمیم گرفتن لازم داری</p></div>
                      <div className="flex rounded-xl bg-stone-100 p-1 text-[11px] font-bold">
                        <button onClick={() => setPeriod("week")} className={"rounded-lg px-3 py-1.5 " + (period === "week" ? "bg-white shadow-sm" : "text-stone-400")}>هفته</button>
                        <button onClick={() => setPeriod("month")} className={"rounded-lg px-3 py-1.5 " + (period === "month" ? "bg-white shadow-sm" : "text-stone-400")}>ماه</button>
                      </div>
                    </div>
                    <div className="flex h-44 items-end gap-2 sm:gap-4">
                      {week.map((item, i) => {
                        const v = period === "week" ? item.value : Math.min(96, item.value + (i % 2 ? 8 : 2));
                        return <div key={item.day} className="flex h-full flex-1 flex-col justify-end gap-2"><div className="group relative flex flex-1 items-end"><div style={{ height: v + "%" }} className={"w-full rounded-t-xl transition-all duration-500 " + (i === 5 ? "bg-[#173c32]" : "bg-[#dce8df] group-hover:bg-[#bcd0c1]")} /></div><span className="text-center text-[11px] text-stone-400">{item.day}</span></div>;
                      })}
                    </div>
                    <div className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-50 p-3 text-xs text-emerald-800"><span>↗</span><b>این هفته ۱۷٪ جلوتر از هفته قبل هستی.</b></div>
                  </Card>
                </div>

                <div className="grid gap-5 lg:grid-cols-3">
                  <button onClick={() => setModal("weekly")} className="rounded-[26px] border border-stone-200 bg-white p-5 text-right shadow-[0_8px_30px_rgba(28,25,23,0.04)] transition hover:-translate-y-0.5">
                    <div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-50 text-sky-700">▤</span><span className="text-xs text-stone-400">شنبه‌ها</span></div><b className="mt-4 block">گزارش مشاور هفتگی</b><p className="mt-2 text-xs leading-6 text-stone-400">این هفته چه شد و هفته بعد دقیقاً چه کار کنی.</p>
                  </button>
                  <button onClick={() => setModal("scenario")} className="rounded-[26px] border border-stone-200 bg-white p-5 text-right shadow-[0_8px_30px_rgba(28,25,23,0.04)] transition hover:-translate-y-0.5">
                    <div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-50 text-amber-700">↝</span><span className="text-xs text-stone-400">شبیه‌سازی</span></div><b className="mt-4 block">اگر قیمت‌ها تغییر کند چی؟</b><p className="mt-2 text-xs leading-6 text-stone-400">قبل از تصمیم، اثرش روی سود و فروش را ببین.</p>
                  </button>
                  <button onClick={() => setTab("growth")} className="rounded-[26px] border border-stone-200 bg-white p-5 text-right shadow-[0_8px_30px_rgba(28,25,23,0.04)] transition hover:-translate-y-0.5">
                    <div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-lime-100 text-lime-800">⌁</span><span className="text-xs text-stone-400">هم‌صنف‌ها</span></div><b className="mt-4 block">از بازار عقب نیستی؟</b><p className="mt-2 text-xs leading-6 text-stone-400">حاشیه سودت ۳٪ پایین‌تر از کسب‌وکارهای مشابه است.</p>
                  </button>
                </div>
              </div>
            )}

            {tab === "sales" && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm text-stone-400">فروش و سود، بدون جنگ با جدول‌ها</p><h2 className="mt-1 text-2xl font-black">چه چیزی واقعاً پول می‌سازد؟</h2></div><button onClick={() => setModal("scenario")} className="rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-black">↝ شبیه‌سازی قیمت</button></div>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card><span className="text-xs text-stone-400">فروش این هفته</span><div className="mt-2 text-3xl font-black">۱۲۸.۴ م</div><div className="mt-3 text-xs font-bold text-emerald-700">↑ ۱۷٪ نسبت به هفته قبل</div></Card>
                  <Card><span className="text-xs text-stone-400">میانگین هر خرید</span><div className="mt-2 text-3xl font-black">۱.۸ م</div><div className="mt-3 text-xs text-stone-500">هدف پیشنهادی: ۱.۹۵ م</div></Card>
                  <Card><span className="text-xs text-stone-400">فروش تکراری</span><div className="mt-2 text-3xl font-black">۶۴٪</div><div className="mt-3 text-xs text-emerald-700">↑ ۶٪ در ۳۰ روز</div></Card>
                </div>
                <Card className="!border-amber-200 !bg-amber-50/40">
                  <div className="flex gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-700">!</span><div><b className="text-sm">یک نشتی سود پیدا شد</b><p className="mt-1 text-xs leading-6 text-stone-500">فروش قهوه ویژه بالا رفته، اما حاشیه سودش از ۲۴٪ به ۱۸٪ رسیده. اصلاح قیمت ۵٪ می‌تواند حدود ۲.۱ میلیون تومان به سود ماهانه برگرداند.</p><button onClick={() => setModal("scenario")} className="mt-3 text-xs font-black text-amber-800">بررسی سناریو ←</button></div></div>
                </Card>
                <Card>
                  <div className="flex items-center justify-between"><div><h3 className="font-black">محصول‌ها از نگاه کسب‌وکار</h3><p className="mt-1 text-xs text-stone-400">فروش زیاد با سود زیاد یکی نیست. ظاهراً این کشف هنوز لازم است.</p></div><Pill tone="stone">۳۰ روز</Pill></div>
                  <div className="mt-5 divide-y divide-stone-100">
                    {products.map((p) => <div key={p.name} className="grid grid-cols-[1fr_auto] gap-3 py-4 sm:grid-cols-4 sm:items-center"><b className="text-sm">{p.name}</b><span className="text-xs text-stone-500">{p.sales} فروش</span><span className="text-xs font-black">{p.margin} سود</span><Pill tone={p.tone}>{p.signal}</Pill></div>)}
                  </div>
                </Card>
              </div>
            )}

            {tab === "customers" && (
              <div className="space-y-5">
                <div><p className="text-sm text-stone-400">مشتری‌ها را بشناس، نه اینکه فقط اسمشان را ذخیره کنی</p><h2 className="mt-1 text-2xl font-black">چه کسی امروز ارزش توجه دارد؟</h2></div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {customerRows.map((c) => <Card key={c.name} className="!p-4"><div className="flex items-center justify-between"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-stone-100 font-black">{c.name[0]}</div><Pill tone={c.tone}>{c.tag}</Pill></div><b className="mt-4 block">{c.name}</b><div className="mt-3 text-2xl font-black">{c.value}</div><p className="mt-1 text-[11px] leading-5 text-stone-400">{c.detail}</p><button onClick={() => showToast("برای " + c.name + " یک پیگیری ثبت شد")} className="mt-4 w-full rounded-xl bg-stone-100 py-2.5 text-xs font-black hover:bg-stone-200">ثبت پیگیری</button></Card>)}
                </div>
                <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
                  <Card>
                    <h3 className="font-black">رادار مشتری</h3><p className="mt-1 text-xs text-stone-400">نبض رفتار خرید را به چهار گروه قابل اقدام تبدیل می‌کند.</p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {[["وفادارها","۱۸ نفر","۶۸٪ فروش تکراری","emerald"],["در خطر ریزش","۷ نفر","۲۲.۶ م ارزش بالقوه","amber"],["فرصت بازگشت","۱۲ نفر","۴ نفر اولویت بالا","sky"],["بدهکارها","۵ نفر","۲۷.۸ م طلب باز","rose"]].map(([a,b,c,t]) => <button key={a} onClick={() => setModal("opportunities")} className="rounded-2xl border border-stone-200 p-4 text-right hover:border-emerald-300"><div className="flex justify-between"><b className="text-sm">{a}</b><Pill tone={t}>{b}</Pill></div><p className="mt-3 text-xs text-stone-400">{c}</p></button>)}
                    </div>
                  </Card>
                  <Card className="!bg-[#173c32] text-white">
                    <Pill tone="lime">پیشنهاد نبض</Pill><h3 className="mt-4 text-xl font-black leading-8">مشتری خوب را قبل از اینکه ناپدید شود پیدا کن.</h3><p className="mt-3 text-xs leading-6 text-emerald-50/70">«فروشگاه بهار» معمولاً هر ۲۱ روز خرید می‌کند. الان ۳۰ روز گذشته. بهترین زمان پیگیری همین امروز است.</p><button onClick={() => showToast("پیگیری فروشگاه بهار به کارهای امروز اضافه شد")} className="mt-5 rounded-2xl bg-white px-4 py-3 text-xs font-black text-[#173c32]">اضافه به کارهای امروز</button>
                  </Card>
                </div>
              </div>
            )}

            {tab === "growth" && (
              <div className="space-y-5">
                <div><p className="text-sm text-stone-400">از داده به تصمیم، از تصمیم به پول</p><h2 className="mt-1 text-2xl font-black">موتور رشد</h2></div>
                <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
                  <Card className="!border-lime-200 !bg-[#eaffb4]">
                    <div className="flex items-center justify-between"><Pill tone="emerald">هدف هوشمند</Pill><span className="text-xs font-black">۷۸٪</span></div><h3 className="mt-5 text-2xl font-black">هدف: ۵۸۰ میلیون فروش تا پایان ماه</h3><p className="mt-2 text-sm leading-7 text-stone-600">با روند فعلی به حدود ۵۳۶ میلیون می‌رسی. فاصله ۴۴ میلیونی را می‌شود به چند حرکت مشخص شکست.</p>
                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/60"><div className="h-full w-[78%] rounded-full bg-[#173c32]" /></div>
                    <div className="mt-5 grid gap-2 sm:grid-cols-3">{[["+۱۲ م","بازگرداندن مشتری"],["+۸.۲ م","فروش مکمل"],["+۲.۱ م","اصلاح قیمت"]].map(([v,l]) => <div key={l} className="rounded-2xl bg-white/65 p-3"><b className="text-sm">{v}</b><span className="mt-1 block text-[10px] text-stone-500">{l}</span></div>)}</div>
                  </Card>
                  <Card>
                    <h3 className="font-black">مقایسه با هم‌صنف‌ها</h3><p className="mt-1 text-xs text-stone-400">داده‌ها ناشناس و تجمیعی‌اند</p>
                    <div className="mt-5 space-y-5">
                      {[["بازگشت مشتری","۶۴٪","بهتر از ۶۸٪ هم‌صنف‌ها",68,"emerald"],["حاشیه سود","۲۲.۵٪","۳٪ پایین‌تر از میانگین",47,"amber"],["سرعت وصول","۸.۲ روز","بهتر از ۵۹٪ هم‌صنف‌ها",59,"sky"]].map(([a,b,c,v,t]) => <div key={a as string}><div className="flex items-end justify-between"><div><span className="text-xs text-stone-400">{a}</span><b className="mt-1 block">{b}</b></div><Pill tone={t as string}>{c}</Pill></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100"><div style={{ width: v + "%" }} className="h-full rounded-full bg-[#173c32]" /></div></div>)}
                    </div>
                  </Card>
                </div>
                <Card>
                  <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-black">آزمایش‌های رشد</h3><p className="mt-1 text-xs text-stone-400">کار کوچک، نتیجه اندازه‌گیری‌شده. نه بازاریابی با دود و آینه.</p></div><button onClick={() => showToast("آزمایش جدید به نمونه اضافه شد")} className="rounded-xl bg-stone-900 px-3 py-2 text-xs font-bold text-white">+ آزمایش جدید</button></div>
                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    {[["افزایش خرید دوم","پیام ۷ روز بعد از خرید","۲۳٪ تبدیل","emerald"],["فروش مکمل","گرانولا کنار قهوه","+۸.۲ م فروش","lime"],["وصول سریع‌تر","یادآوری قبل از سررسید","۲.۴ روز سریع‌تر","sky"]].map(([a,b,c,t]) => <div key={a} className="rounded-2xl border border-stone-200 p-4"><b className="text-sm">{a}</b><p className="mt-2 text-xs leading-6 text-stone-400">{b}</p><div className="mt-4 flex items-center justify-between"><Pill tone={t}>{c}</Pill><span className="text-[10px] text-stone-400">در حال اجرا</span></div></div>)}
                  </div>
                </Card>
                <div className="grid gap-5 md:grid-cols-2">
                  <button onClick={() => setModal("scenario")} className="rounded-[28px] bg-[#173c32] p-6 text-right text-white"><span className="text-xs text-[#d7ff69]">تصمیم قبل از اجرا</span><h3 className="mt-2 text-xl font-black">حالت «اگر چی؟»</h3><p className="mt-2 text-xs leading-6 text-emerald-50/70">قیمت، فروش یا وصول را تغییر بده و اثر تقریبی را ببین.</p></button>
                  <button onClick={() => setModal("weekly")} className="rounded-[28px] border border-stone-200 bg-white p-6 text-right"><span className="text-xs text-[#28745f]">هر هفته خودکار</span><h3 className="mt-2 text-xl font-black">گزارش مشاور نبض</h3><p className="mt-2 text-xs leading-6 text-stone-400">یک صفحه: چه شد، چرا شد، هفته بعد چه کار کنی.</p></button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <button onClick={() => setModal("ask")} className="fixed bottom-24 left-4 z-30 grid h-12 w-12 place-items-center rounded-2xl bg-[#d7ff69] font-black text-[#173c32] shadow-xl lg:hidden">✦</button>

      <nav className="fixed bottom-3 left-3 right-3 z-30 flex justify-around rounded-[24px] border border-stone-200 bg-white/95 p-2 shadow-2xl backdrop-blur lg:hidden">
        {nav.map((item) => <button key={item.id} onClick={() => setTab(item.id)} className={"flex min-w-16 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[10px] font-bold " + (tab === item.id ? "bg-[#173c32] text-white" : "text-stone-400")}><span className="text-base">{item.icon}</span><span>{item.label}</span></button>)}
      </nav>

      {toast && <div className="fixed bottom-24 left-1/2 z-[70] -translate-x-1/2 rounded-2xl bg-stone-900 px-4 py-3 text-xs font-bold text-white shadow-2xl lg:bottom-6">{toast}</div>}

      {modal === "opportunities" && (
        <ModalShell onClose={() => setModal(null)}>
          <div className="flex items-start justify-between"><div><Pill tone="lime">پول‌های روی زمین</Pill><h3 className="mt-3 text-2xl font-black">{opportunityTotal.toLocaleString("fa-IR")} میلیون تومان فرصت</h3><p className="mt-2 text-xs text-stone-400">بر اساس داده‌های همین کسب‌وکار، مرتب‌شده بر اساس اثر و فوریت.</p></div><button onClick={() => setModal(null)} className="grid h-9 w-9 place-items-center rounded-full bg-stone-100">×</button></div>
          <div className="mt-5 space-y-3">{opportunities.map((o, i) => <div key={o.title} className="rounded-2xl border border-stone-200 p-4"><div className="flex items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-stone-100 text-xs font-black">{i + 1}</span><div className="flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><b className="text-sm">{o.title}</b><Pill tone={o.tone}>+{o.amount.toLocaleString("fa-IR")} م</Pill></div><p className="mt-1 text-xs text-stone-400">{o.meta}</p><button onClick={() => { toggleDone(Math.min(i, 2)); showToast("به کارهای امروز اضافه شد"); }} className="mt-3 text-xs font-black text-[#28745f]">{o.action} ←</button></div></div></div>)}</div>
        </ModalShell>
      )}

      {modal === "ask" && (
        <ModalShell onClose={() => setModal(null)}>
          <div className="flex items-start justify-between"><div><div className="flex items-center gap-2"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#d7ff69] text-[#173c32]">✦</span><div><h3 className="font-black">از نبض بپرس</h3><p className="text-[11px] text-stone-400">جواب از روی داده‌های کسب‌وکار، نه حدس‌های فضایی</p></div></div></div><button onClick={() => setModal(null)} className="grid h-9 w-9 place-items-center rounded-full bg-stone-100">×</button></div>
          <div className="mt-5 flex flex-wrap gap-2">{["چرا سودم کمتر شده؟","امروز با کدام مشتری تماس بگیرم؟","سه کار مهم امروز چیست؟"].map((q) => <button key={q} onClick={() => ask(q)} className="rounded-full bg-stone-100 px-3 py-2 text-[11px] font-bold text-stone-600">{q}</button>)}</div>
          {askAnswer && <div className="mt-5 rounded-[24px] bg-[#f2f8f3] p-5"><div className="mb-2 text-xs font-black text-[#28745f]">پاسخ نبض</div><p className="text-sm leading-7 text-stone-700">{askAnswer}</p><div className="mt-4 flex gap-2"><button onClick={() => showToast("اقدام پیشنهادی به کارهای امروز اضافه شد")} className="rounded-xl bg-[#173c32] px-3 py-2 text-xs font-black text-white">تبدیل به اقدام</button><button onClick={() => setAskAnswer("")} className="rounded-xl bg-white px-3 py-2 text-xs font-bold">پاک کردن</button></div></div>}
          <div className="mt-5 flex gap-2 rounded-2xl border border-stone-200 p-2"><input value={askText} onChange={(e) => setAskText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()} placeholder="مثلاً چرا فروش این هفته بهتر شده؟" className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" /><button onClick={() => ask()} className="rounded-xl bg-[#173c32] px-4 py-2 text-xs font-black text-white">بپرس</button></div>
        </ModalShell>
      )}

      {modal === "voice" && (
        <ModalShell onClose={() => { setModal(null); setRecording(false); }}>
          <div className="flex items-start justify-between"><div><h3 className="text-lg font-black">ثبت صوتی</h3><p className="mt-1 text-xs text-stone-400">به‌جای فرم، همان‌طور که حرف می‌زنی ثبت کن.</p></div><button onClick={() => setModal(null)} className="grid h-9 w-9 place-items-center rounded-full bg-stone-100">×</button></div>
          {!voiceParsed ? <div className="mt-7 text-center"><button onClick={() => { setRecording(!recording); if (recording) setVoiceParsed(true); }} className={"mx-auto grid h-24 w-24 place-items-center rounded-full text-2xl transition " + (recording ? "animate-pulse bg-rose-500 text-white shadow-xl shadow-rose-200" : "bg-[#173c32] text-white")}>{recording ? "■" : "◉"}</button><b className="mt-4 block">{recording ? "در حال شنیدن..." : "برای شروع لمس کن"}</b><p className="mx-auto mt-3 max-w-sm text-xs leading-6 text-stone-400">{recording ? "«به احمدی سه میلیون و چهارصد جنس فروختم، دو میلیون کارت کشید، بقیه نسیه...»" : "نمونه تعاملی است؛ یک بار شروع و بار دوم توقف را بزن."}</p></div> :
          <div className="mt-6"><Pill tone="emerald">فهمیدم ✓</Pill><div className="mt-4 rounded-[24px] bg-stone-50 p-5"><div className="grid grid-cols-2 gap-4 text-sm"><div><span className="text-xs text-stone-400">مشتری</span><b className="mt-1 block">احمدی</b></div><div><span className="text-xs text-stone-400">مبلغ فروش</span><b className="mt-1 block">۳.۴ م</b></div><div><span className="text-xs text-stone-400">پرداخت کارت</span><b className="mt-1 block">۲ م</b></div><div><span className="text-xs text-stone-400">مانده نسیه</span><b className="mt-1 block text-rose-600">۱.۴ م</b></div></div></div><button onClick={() => { setModal(null); setVoiceParsed(false); showToast("فروش و مانده حساب با موفقیت ثبت شد"); }} className="mt-4 w-full rounded-2xl bg-[#173c32] py-4 text-sm font-black text-white">تأیید و ثبت</button></div>}
        </ModalShell>
      )}

      {modal === "scenario" && (
        <ModalShell onClose={() => setModal(null)}>
          <div className="flex items-start justify-between"><div><Pill tone="amber">اگر چی؟</Pill><h3 className="mt-3 text-xl font-black">اگر قیمت قهوه ویژه را تغییر بدهم؟</h3></div><button onClick={() => setModal(null)} className="grid h-9 w-9 place-items-center rounded-full bg-stone-100">×</button></div>
          <div className="mt-6 rounded-[24px] bg-stone-50 p-5"><div className="flex items-end justify-between"><span className="text-xs text-stone-500">افزایش قیمت</span><b className="text-3xl">{priceIncrease.toLocaleString("fa-IR")}٪</b></div><input type="range" min="0" max="15" value={priceIncrease} onChange={(e) => setPriceIncrease(Number(e.target.value))} className="mt-5 w-full accent-[#173c32]" /></div>
          <div className="mt-4 grid grid-cols-3 gap-2"><div className="rounded-2xl border border-stone-200 p-3"><span className="text-[10px] text-stone-400">سود ماهانه</span><b className="mt-1 block text-lg">{projectedProfit.toLocaleString("fa-IR")} م</b></div><div className="rounded-2xl border border-stone-200 p-3"><span className="text-[10px] text-stone-400">اثر بر فروش</span><b className="mt-1 block text-lg">{priceIncrease > 9 ? "−۴٪" : priceIncrease > 5 ? "−۲٪" : "≈ ثابت"}</b></div><div className="rounded-2xl border border-stone-200 p-3"><span className="text-[10px] text-stone-400">حاشیه سود</span><b className="mt-1 block text-lg">{(18 + priceIncrease * .72).toFixed(1)}٪</b></div></div>
          <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-xs leading-6 text-amber-900">این یک تخمین تصمیم‌یار بر اساس سابقه فروش است، نه پیشگویی با گوی بلورین. برای تغییر {priceIncrease.toLocaleString("fa-IR")}٪، ریسک افت فروش فعلاً پایین ارزیابی شده.</p>
          <button onClick={() => { setModal(null); showToast("سناریو برای بررسی قیمت ذخیره شد"); }} className="mt-4 w-full rounded-2xl bg-[#173c32] py-3.5 text-sm font-black text-white">ذخیره به‌عنوان اقدام</button>
        </ModalShell>
      )}

      {modal === "weekly" && (
        <ModalShell onClose={() => setModal(null)}>
          <div className="flex items-start justify-between"><div><Pill tone="sky">گزارش هفتگی</Pill><h3 className="mt-3 text-xl font-black">این هفته کسب‌وکارت چه گفت؟</h3><p className="mt-1 text-xs text-stone-400">۶ تا ۱۲ مهر</p></div><button onClick={() => setModal(null)} className="grid h-9 w-9 place-items-center rounded-full bg-stone-100">×</button></div>
          <div className="mt-5 grid grid-cols-3 gap-2"><div className="rounded-2xl bg-emerald-50 p-3"><span className="text-[10px] text-emerald-700">فروش</span><b className="mt-1 block">۱۲۸ م ↑</b></div><div className="rounded-2xl bg-amber-50 p-3"><span className="text-[10px] text-amber-700">سود</span><b className="mt-1 block">۳۱ م ↓</b></div><div className="rounded-2xl bg-rose-50 p-3"><span className="text-[10px] text-rose-700">طلب</span><b className="mt-1 block">۱۹ م</b></div></div>
          <div className="mt-5 rounded-[24px] bg-[#173c32] p-5 text-white"><span className="text-xs text-[#d7ff69]">جمع‌بندی مشاور</span><p className="mt-3 text-sm leading-7 text-emerald-50/85">فروش ۱۷٪ رشد کرده اما سود هم‌پای آن بالا نرفته. دلیل اصلی افت حاشیه سود دو محصول است. هم‌زمان ۴ مشتری قدیمی وارد محدوده ریزش شده‌اند.</p></div>
          <div className="mt-5"><b className="text-sm">سه اولویت هفته بعد</b><div className="mt-3 space-y-2">{["اصلاح قیمت قهوه ویژه","پیگیری ۴ مشتری در خطر ریزش","وصول ۱۹ میلیون طلب سررسیدشده"].map((x,i) => <div key={x} className="flex items-center gap-3 rounded-2xl border border-stone-200 p-3"><span className="grid h-7 w-7 place-items-center rounded-full bg-stone-100 text-[10px] font-black">{i+1}</span><span className="text-xs font-bold">{x}</span></div>)}</div></div>
        </ModalShell>
      )}

      {modal === "sale" && (
        <ModalShell onClose={() => setModal(null)}>
          <div className="flex items-center justify-between"><div><h3 className="text-lg font-black">ثبت سریع فروش</h3><p className="mt-1 text-xs text-stone-400">کمتر از ۱۰ ثانیه، چون زندگی کوتاه‌تر از فرم‌های اداری است.</p></div><button onClick={() => setModal(null)} className="grid h-9 w-9 place-items-center rounded-full bg-stone-100">×</button></div>
          <div className="mt-5 space-y-3"><button className="flex w-full items-center justify-between rounded-2xl border border-stone-200 p-4 text-sm"><span className="text-stone-400">مشتری</span><b>فروشگاه بهار</b></button><div className="rounded-2xl border-2 border-[#173c32] p-4"><label className="text-xs text-stone-400">مبلغ فروش</label><div className="mt-2 flex items-end gap-2"><input autoFocus inputMode="numeric" defaultValue="1850000" className="min-w-0 flex-1 bg-transparent text-2xl font-black outline-none" /><span className="text-xs text-stone-400">تومان</span></div></div><div className="grid grid-cols-3 gap-2">{["نقدی","کارت","نسیه"].map((x,i) => <button key={x} className={"rounded-xl py-3 text-xs font-bold " + (i === 1 ? "bg-[#eaffb4] text-[#173c32]" : "bg-stone-100 text-stone-500")}>{x}</button>)}</div><button onClick={() => { setModal(null); showToast("فروش ثبت شد؛ نبض شاخص‌ها را به‌روز کرد"); }} className="w-full rounded-2xl bg-[#173c32] py-4 text-sm font-black text-white">ثبت فروش ۱,۸۵۰,۰۰۰ تومان</button><button onClick={() => setModal("voice")} className="w-full rounded-2xl border border-stone-200 py-3 text-xs font-black text-stone-600">◉ به‌جایش صوتی بگو</button></div>
        </ModalShell>
      )}
    </main>
  );
}
