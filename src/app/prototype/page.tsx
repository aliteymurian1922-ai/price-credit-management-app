"use client";

import { useState } from "react";

type Tab = "home" | "sales" | "customers" | "growth";

const money = (n: number) => new Intl.NumberFormat("fa-IR").format(n);

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

const customers = [
  { name: "کافه دنج", amount: "۸.۴ م", note: "۳ روز از سررسید گذشته", tone: "rose" },
  { name: "فروشگاه بهار", amount: "۵.۱ م", note: "امروز پیگیری شود", tone: "amber" },
  { name: "مارکت آفتاب", amount: "۳.۷ م", note: "مشتری خوش‌حساب", tone: "emerald" },
];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={"rounded-[28px] border border-stone-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(28,25,23,0.04)] " + className}>{children}</section>;
}

export default function PrototypePage() {
  const [tab, setTab] = useState<Tab>("home");
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [saleOpen, setSaleOpen] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <main className="min-h-screen bg-[#f7f7f2] text-stone-900">
      <div className="mx-auto min-h-screen max-w-[1440px] lg:grid lg:grid-cols-[250px_1fr]">
        <aside className="hidden border-l border-stone-200 bg-[#173c32] px-5 py-7 text-white lg:flex lg:flex-col">
          <div className="mb-10 flex items-center gap-3 px-2">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#d7ff69] text-xl font-black text-[#173c32]">ن</div>
            <div>
              <div className="text-lg font-black">نبض</div>
              <div className="text-xs text-emerald-100/70">دستیار رشد کسب‌وکار</div>
            </div>
          </div>

          <nav className="space-y-2">
            {nav.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={"flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-right text-sm transition " + (tab === item.id ? "bg-white text-[#173c32] shadow-lg" : "text-emerald-50/80 hover:bg-white/10")}
              >
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-black/5 text-lg">{item.icon}</span>
                <span className="font-bold">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-[24px] bg-white/10 p-4">
            <div className="mb-2 text-xs text-emerald-100/70">هدف این ماه</div>
            <div className="mb-3 flex items-end justify-between">
              <span className="text-xl font-black">۷۸٪</span>
              <span className="text-[11px] text-emerald-100/70">۲۲٪ تا هدف</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[78%] rounded-full bg-[#d7ff69]" />
            </div>
          </div>
        </aside>

        <div className="pb-24 lg:pb-8">
          <header className="sticky top-0 z-20 border-b border-stone-200/70 bg-[#f7f7f2]/90 px-4 py-4 backdrop-blur-xl sm:px-7 lg:px-10">
            <div className="mx-auto flex max-w-6xl items-center justify-between">
              <div>
                <div className="flex items-center gap-2 lg:hidden">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#173c32] font-black text-[#d7ff69]">ن</div>
                  <span className="font-black">نبض</span>
                </div>
                <div className="hidden lg:block">
                  <p className="text-xs text-stone-500">شنبه، ۱۲ مهر</p>
                  <h1 className="text-xl font-black">صبح بخیر، علی 👋</h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-2xl border border-stone-200 bg-white px-3 py-2 text-xs font-bold text-stone-600">فروشگاه نمونه</button>
                <button onClick={() => setSaleOpen(true)} className="rounded-2xl bg-[#173c32] px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-emerald-950/10">
                  + ثبت سریع فروش
                </button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-7 lg:px-10">
            {tab === "home" && (
              <div className="space-y-5">
                <section className="relative overflow-hidden rounded-[32px] bg-[#173c32] p-6 text-white sm:p-8">
                  <div className="absolute -left-16 -top-20 h-64 w-64 rounded-full bg-[#d7ff69]/10 blur-2xl" />
                  <div className="relative grid gap-6 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
                    <div>
                      <span className="inline-flex rounded-full bg-[#d7ff69] px-3 py-1 text-xs font-black text-[#173c32]">نبض امروز</span>
                      <h2 className="mt-4 max-w-xl text-2xl font-black leading-relaxed sm:text-3xl">
                        فروش خوبه، ولی ۳ مشتری قدیمی این هفته خرید نکردن.
                      </h2>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-emerald-50/70">
                        اگر امروز با آن‌ها تماس بگیری، بر اساس سابقه خرید حدود ۱۲ میلیون تومان فروش قابل برگشت داری.
                      </p>
                      <button onClick={() => setTab("growth")} className="mt-5 rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#173c32]">
                        مشتری‌های پیشنهادی را ببین
                      </button>
                    </div>
                    <div className="rounded-[26px] border border-white/10 bg-white/10 p-5 backdrop-blur">
                      <div className="text-xs text-emerald-100/70">امتیاز سلامت کسب‌وکار</div>
                      <div className="mt-2 flex items-end gap-2">
                        <span className="text-5xl font-black text-[#d7ff69]">۸۲</span>
                        <span className="pb-1 text-sm text-emerald-100/60">از ۱۰۰</span>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px]">
                        <div className="rounded-2xl bg-white/10 p-3"><b className="block text-sm text-white">عالی</b>فروش</div>
                        <div className="rounded-2xl bg-white/10 p-3"><b className="block text-sm text-amber-200">متوسط</b>نقدینگی</div>
                        <div className="rounded-2xl bg-white/10 p-3"><b className="block text-sm text-white">خوب</b>وفاداری</div>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    ["فروش امروز", "۱۸.۶ م", "↑ ۱۴٪", "از میانگین شنبه‌ها"],
                    ["سود تقریبی", "۴.۲ م", "۲۲.۵٪", "حاشیه سود امروز"],
                    ["طلب قابل وصول", "۲۷.۸ م", "۳ نفر", "نیازمند پیگیری"],
                    ["هدف ماه", "۷۸٪", "۶ روز", "تا پایان ماه"],
                  ].map(([label, value, badge, note]) => (
                    <Card key={label} className="!p-4">
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-bold text-stone-500">{label}</span>
                        <span className="rounded-full bg-lime-100 px-2 py-1 text-[10px] font-black text-lime-800">{badge}</span>
                      </div>
                      <div className="mt-3 text-2xl font-black">{value}</div>
                      <div className="mt-1 text-[11px] text-stone-400">{note}</div>
                    </Card>
                  ))}
                </div>

                <div className="grid gap-5 xl:grid-cols-[1.3fr_.7fr]">
                  <Card>
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h3 className="font-black">ریتم فروش</h3>
                        <p className="mt-1 text-xs text-stone-400">نه فقط عدد، روندی که باید حواست بهش باشد</p>
                      </div>
                      <div className="flex rounded-xl bg-stone-100 p-1 text-[11px] font-bold">
                        <button onClick={() => setPeriod("week")} className={"rounded-lg px-3 py-1.5 " + (period === "week" ? "bg-white shadow-sm" : "text-stone-400")}>هفته</button>
                        <button onClick={() => setPeriod("month")} className={"rounded-lg px-3 py-1.5 " + (period === "month" ? "bg-white shadow-sm" : "text-stone-400")}>ماه</button>
                      </div>
                    </div>
                    <div className="flex h-48 items-end gap-2 sm:gap-4">
                      {week.map((item, i) => {
                        const v = period === "week" ? item.value : Math.min(96, item.value + (i % 2 ? 8 : 2));
                        return (
                          <div key={item.day} className="flex h-full flex-1 flex-col justify-end gap-2">
                            <div className="group relative flex flex-1 items-end">
                              <div style={{ height: `${v}%` }} className={"w-full rounded-t-xl transition-all duration-500 " + (i === 5 ? "bg-[#173c32]" : "bg-[#dce8df] group-hover:bg-[#bcd0c1]")} />
                            </div>
                            <span className="text-center text-[11px] text-stone-400">{item.day}</span>
                          </div>
                        );
                      })}
                    </div>
                  </Card>

                  <Card>
                    <div className="flex items-center justify-between">
                      <h3 className="font-black">کارهای پول‌ساز امروز</h3>
                      <span className="text-xs font-black text-[#28745f]">۳ کار</span>
                    </div>
                    <div className="mt-4 space-y-3">
                      <button onClick={() => setDone(!done)} className={"w-full rounded-2xl border p-4 text-right transition " + (done ? "border-emerald-200 bg-emerald-50 opacity-60" : "border-stone-200 hover:border-emerald-300")}>
                        <div className="flex gap-3">
                          <span className={"grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs " + (done ? "bg-emerald-600 text-white" : "bg-amber-100 text-amber-700")}>{done ? "✓" : "۱"}</span>
                          <div><b className="text-sm">پیگیری کافه دنج</b><p className="mt-1 text-[11px] leading-5 text-stone-400">۸.۴ میلیون طلب، ۳ روز گذشته</p></div>
                        </div>
                      </button>
                      <button onClick={() => setTab("growth")} className="w-full rounded-2xl border border-stone-200 p-4 text-right hover:border-emerald-300">
                        <div className="flex gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-lime-100 text-xs text-lime-800">۲</span><div><b className="text-sm">برگرداندن مشتری‌های غیرفعال</b><p className="mt-1 text-[11px] leading-5 text-stone-400">۳ مشتری با احتمال خرید بالا</p></div></div>
                      </button>
                      <button onClick={() => setTab("sales")} className="w-full rounded-2xl border border-stone-200 p-4 text-right hover:border-emerald-300">
                        <div className="flex gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sky-100 text-xs text-sky-700">۳</span><div><b className="text-sm">بررسی محصول کم‌سود</b><p className="mt-1 text-[11px] leading-5 text-stone-400">حاشیه سود «قهوه ویژه» افت کرده</p></div></div>
                      </button>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {tab === "sales" && (
              <div className="space-y-5">
                <div><p className="text-sm text-stone-400">فروش، بدون بوی فرم‌های حسابداری</p><h2 className="mt-1 text-2xl font-black">چه چیزی واقعاً پول می‌سازد؟</h2></div>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card><span className="text-xs text-stone-400">فروش این هفته</span><div className="mt-2 text-3xl font-black">۱۲۸.۴ م</div><div className="mt-3 text-xs font-bold text-emerald-700">↑ ۱۷٪ نسبت به هفته قبل</div></Card>
                  <Card><span className="text-xs text-stone-400">میانگین هر خرید</span><div className="mt-2 text-3xl font-black">۱.۸ م</div><div className="mt-3 text-xs text-stone-500">با ۹٪ ظرفیت رشد</div></Card>
                  <Card><span className="text-xs text-stone-400">فروش تکراری</span><div className="mt-2 text-3xl font-black">۶۴٪</div><div className="mt-3 text-xs text-stone-500">از مشتری‌های قبلی</div></Card>
                </div>
                <Card>
                  <h3 className="font-black">محصول‌ها از نگاه کسب‌وکار</h3>
                  <p className="mt-1 text-xs text-stone-400">فروش زیاد همیشه به معنی سود خوب نیست. بشر بالاخره باید این را روی یک داشبورد ببیند.</p>
                  <div className="mt-5 divide-y divide-stone-100">
                    {[
                      ["قهوه ویژه", "۳۲.۴ م فروش", "۱۸٪ سود", "نیاز به بررسی قیمت", "amber"],
                      ["گرانولا", "۲۴.۱ م فروش", "۳۴٪ سود", "ستاره این هفته", "green"],
                      ["عسل طبیعی", "۱۸.۸ م فروش", "۲۹٪ سود", "روند پایدار", "green"],
                      ["کره بادام", "۹.۲ م فروش", "۱۲٪ سود", "سود پایین", "rose"],
                    ].map(([name, sale, profit, status, tone]) => (
                      <div key={name} className="grid grid-cols-[1fr_auto] gap-3 py-4 sm:grid-cols-4 sm:items-center">
                        <b className="text-sm">{name}</b><span className="text-xs text-stone-500">{sale}</span><span className="text-xs font-bold">{profit}</span>
                        <span className={"w-fit rounded-full px-2.5 py-1 text-[10px] font-bold " + (tone === "green" ? "bg-emerald-50 text-emerald-700" : tone === "amber" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700")}>{status}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {tab === "customers" && (
              <div className="space-y-5">
                <div><p className="text-sm text-stone-400">CRM خیلی سبک، چون کسی حوصله CRM واقعی ندارد</p><h2 className="mt-1 text-2xl font-black">مشتری‌هایی که باید بشناسی</h2></div>
                <div className="grid gap-4 md:grid-cols-3">
                  {customers.map((c, i) => (
                    <Card key={c.name}>
                      <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-stone-100 font-black">{c.name[0]}</div><div><b>{c.name}</b><p className="mt-1 text-[11px] text-stone-400">{i === 2 ? "ارزشمند" : "طلب باز"}</p></div></div>
                      <div className="mt-5 text-2xl font-black">{c.amount}</div>
                      <div className={"mt-2 text-xs font-bold " + (c.tone === "rose" ? "text-rose-600" : c.tone === "amber" ? "text-amber-600" : "text-emerald-600")}>{c.note}</div>
                      <button className="mt-5 w-full rounded-xl bg-stone-100 py-2.5 text-xs font-black hover:bg-stone-200">مشاهده رابطه با مشتری</button>
                    </Card>
                  ))}
                </div>
                <Card>
                  <h3 className="font-black">تقسیم‌بندی هوشمند مشتری‌ها</h3>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[["وفادارها","۱۸ نفر","bg-emerald-50 text-emerald-700"],["در خطر ریزش","۷ نفر","bg-amber-50 text-amber-700"],["فرصت بازگشت","۱۲ نفر","bg-sky-50 text-sky-700"],["بدهکارها","۵ نفر","bg-rose-50 text-rose-700"]].map(([a,b,c])=><button key={a} className={"rounded-2xl p-4 text-right "+c}><b className="block text-sm">{a}</b><span className="mt-2 block text-xl font-black">{b}</span></button>)}
                  </div>
                </Card>
              </div>
            )}

            {tab === "growth" && (
              <div className="space-y-5">
                <div><p className="text-sm text-stone-400">اینجا فرق محصول با دفتر حساب مشخص می‌شود</p><h2 className="mt-1 text-2xl font-black">موتور رشد</h2></div>
                <div className="grid gap-5 lg:grid-cols-[1fr_.8fr]">
                  <Card className="!bg-[#eaffb4] !border-lime-200">
                    <span className="rounded-full bg-[#173c32] px-3 py-1 text-[10px] font-black text-white">فرصت پیشنهادی</span>
                    <h3 className="mt-5 text-2xl font-black leading-relaxed">۳ مشتری قدیمی احتمالاً آماده خرید دوباره‌اند.</h3>
                    <p className="mt-3 text-sm leading-7 text-stone-600">بر اساس فاصله بین خریدهای قبلی، زمان سفارش بعدی آن‌ها رسیده. ارزش تخمینی این فرصت حدود ۱۲ میلیون تومان است.</p>
                    <div className="mt-5 flex flex-wrap gap-2">{["کافه هفت","خانه سبز","ارگانیک مارکت"].map(x=><span key={x} className="rounded-xl bg-white/70 px-3 py-2 text-xs font-bold">{x}</span>)}</div>
                    <button className="mt-6 rounded-2xl bg-[#173c32] px-5 py-3 text-sm font-black text-white">ساخت لیست پیگیری</button>
                  </Card>
                  <Card>
                    <h3 className="font-black">پیش‌بینی پایان ماه</h3>
                    <div className="mt-5 text-4xl font-black">۵۳۶ م</div>
                    <p className="mt-2 text-xs text-stone-400">فروش احتمالی با روند فعلی</p>
                    <div className="mt-6 rounded-2xl bg-stone-50 p-4"><div className="flex justify-between text-xs"><span>هدف ماه</span><b>۵۸۰ م</b></div><div className="mt-3 h-3 overflow-hidden rounded-full bg-stone-200"><div className="h-full w-[92%] rounded-full bg-[#173c32]" /></div><p className="mt-3 text-[11px] leading-5 text-stone-500">با حدود ۴۴ میلیون فروش بیشتر به هدف می‌رسی.</p></div>
                  </Card>
                </div>
                <Card>
                  <div className="flex items-center justify-between"><div><h3 className="font-black">آزمایش‌های رشد</h3><p className="mt-1 text-xs text-stone-400">کارهای کوچک، نتیجه قابل اندازه‌گیری</p></div><button className="rounded-xl bg-stone-900 px-3 py-2 text-xs font-bold text-white">+ آزمایش جدید</button></div>
                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    {[["افزایش خرید دوم","ارسال پیام ۷ روز بعد از خرید","۲۳٪ تبدیل"],["فروش مکمل","پیشنهاد گرانولا کنار قهوه","+۸.۲ م فروش"],["وصول سریع‌تر","یادآوری دوستانه سررسید","۲.۴ روز سریع‌تر"]].map(([a,b,c])=><div key={a} className="rounded-2xl border border-stone-200 p-4"><b className="text-sm">{a}</b><p className="mt-2 text-xs leading-6 text-stone-400">{b}</p><span className="mt-4 inline-block rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700">{c}</span></div>)}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      <nav className="fixed bottom-3 left-3 right-3 z-30 flex justify-around rounded-[24px] border border-stone-200 bg-white/95 p-2 shadow-2xl backdrop-blur lg:hidden">
        {nav.map((item) => (
          <button key={item.id} onClick={() => setTab(item.id)} className={"flex min-w-16 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[10px] font-bold " + (tab === item.id ? "bg-[#173c32] text-white" : "text-stone-400")}>
            <span className="text-base">{item.icon}</span><span>{item.label}</span>
          </button>
        ))}
      </nav>

      {saleOpen && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/30 p-3 backdrop-blur-sm sm:place-items-center" onClick={() => setSaleOpen(false)}>
          <div className="w-full max-w-md rounded-[30px] bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between"><div><h3 className="text-lg font-black">ثبت سریع فروش</h3><p className="mt-1 text-xs text-stone-400">هدف: کمتر از ۱۰ ثانیه</p></div><button onClick={() => setSaleOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-stone-100">×</button></div>
            <div className="mt-5 space-y-3">
              <button className="flex w-full items-center justify-between rounded-2xl border border-stone-200 p-4 text-sm"><span className="text-stone-400">مشتری</span><b>فروشگاه بهار</b></button>
              <div className="rounded-2xl border-2 border-[#173c32] p-4"><label className="text-xs text-stone-400">مبلغ فروش</label><div className="mt-2 flex items-end gap-2"><input autoFocus inputMode="numeric" defaultValue="1850000" className="min-w-0 flex-1 bg-transparent text-2xl font-black outline-none" /><span className="text-xs text-stone-400">تومان</span></div></div>
              <div className="grid grid-cols-3 gap-2">{["نقدی","کارت","نسیه"].map((x,i)=><button key={x} className={"rounded-xl py-3 text-xs font-bold "+(i===1?"bg-[#eaffb4] text-[#173c32]":"bg-stone-100 text-stone-500")}>{x}</button>)}</div>
              <button onClick={() => setSaleOpen(false)} className="w-full rounded-2xl bg-[#173c32] py-4 text-sm font-black text-white">ثبت فروش ۱,۸۵۰,۰۰۰ تومان</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
