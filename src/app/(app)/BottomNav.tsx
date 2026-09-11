"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "خانه", icon: "🏠" },
  { href: "/products", label: "کالاها", icon: "🏷️" },
  { href: "/sales/new", label: "فروش", icon: "➕", primary: true },
  { href: "/customers", label: "مشتریان", icon: "👥" },
  { href: "/settings", label: "تنظیمات", icon: "⚙️" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2">
        {items.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          if (item.primary) {
            return (
              <li key={item.href} className="relative flex flex-1 items-center justify-center">
                <Link
                  href={item.href}
                  className="-mt-6 flex h-14 w-14 flex-col items-center justify-center rounded-full bg-emerald-700 text-2xl text-white shadow-lg shadow-emerald-700/30 active:scale-95"
                >
                  {item.icon}
                </Link>
              </li>
            );
          }

          return (
            <li key={item.href} className="flex flex-1">
              <Link
                href={item.href}
                className={`flex w-full flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition ${
                  isActive ? "text-emerald-700" : "text-stone-400"
                }`}
              >
                <span className="text-xl leading-none">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
