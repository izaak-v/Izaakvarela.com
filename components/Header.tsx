"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";

const links = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#about", label: "About" },
  { href: "/credentials", label: "Credentials" },
  { href: "/schedule", label: "Schedule" },
  { href: "/contact", label: "Contact" },
];

type Props = { name: string; title: string; phone: { display: string; tel: string } | null };

export function Header({ name, title, phone }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.classList.add("menu-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  return (
    <header className={`site-header${open ? " is-open" : ""}`}>
      <div className="container header-inner">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            IV
          </span>
          <span className="brand-text">
            <span className="brand-name">{name}</span>
            <span className="brand-role">{title}</span>
          </span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? "close" : "menu"} size={22} />
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>

        <nav id="site-nav" className="site-nav" aria-label="Primary">
          <ul>
            {links.map((l) => {
              const current = l.href === pathname;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={current ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          {phone ? (
            <a className="nav-phone" href={`tel:${phone.tel}`}>
              <Icon name="phone" size={18} />
              <span>{phone.display}</span>
            </a>
          ) : null}
          <Link href="/schedule" className="button nav-cta" onClick={() => setOpen(false)}>
            Schedule Consultation
          </Link>
        </nav>
      </div>
    </header>
  );
}
