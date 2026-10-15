"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

const links = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#about", label: "About" },
  { href: "/credentials", label: "Credentials" },
  { href: "/schedule", label: "Schedule" },
  { href: "/contact", label: "Contact" },
];

/** Must match the breakpoint where `.menu-toggle` is hidden in globals.css. */
const DESKTOP_QUERY = "(min-width: 1024px)";

type Props = { name: string; title: string; phone: { display: string; tel: string } | null };

/*
 * iOS Safari ignores `overflow: hidden` on <body> for touch scrolling, so the page is pinned
 * with `position: fixed` while the menu is open and the scroll position restored on close.
 */
let lockedScrollY = 0;

function lockPageScroll() {
  lockedScrollY = window.scrollY;
  const { style } = document.body;
  style.position = "fixed";
  style.top = `-${lockedScrollY}px`;
  style.left = "0";
  style.right = "0";
  style.width = "100%";
  document.documentElement.classList.add("menu-open");
  for (const el of document.querySelectorAll("#main, .site-footer")) el.setAttribute("inert", "");
}

function unlockPageScroll() {
  const { style } = document.body;
  style.position = "";
  style.top = "";
  style.left = "";
  style.right = "";
  style.width = "";
  document.documentElement.classList.remove("menu-open");
  for (const el of document.querySelectorAll("#main, .site-footer")) el.removeAttribute("inert");
  // Instant (not smooth) so the page doesn't visibly scroll back into place.
  window.scrollTo({ top: lockedScrollY, behavior: "instant" });
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <ul>
      {links.map((l) => (
        <li key={l.href}>
          <Link
            href={l.href}
            aria-current={l.href === pathname ? "page" : undefined}
            onClick={onNavigate ? () => onNavigate() : undefined}
          >
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Header({ name, title, phone }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const openMenu = useCallback(() => {
    lockPageScroll();
    setOpen(true);
  }, []);

  // Unlock synchronously (before any link navigation runs) so in-page anchors like /#services
  // scroll from the restored position instead of being overridden afterwards.
  const closeMenu = useCallback((returnFocus = false) => {
    unlockPageScroll();
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu(true);
    };
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onResize = () => mq.matches && closeMenu();

    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onResize);
    };
  }, [open, closeMenu]);

  // Safety net: never leave the page locked if the header unmounts while open.
  useEffect(
    () => () =>
      document.documentElement.classList.contains("menu-open") ? unlockPageScroll() : undefined,
    [],
  );

  return (
    <>
      <header className={`site-header${open ? " is-open" : ""}`}>
        <div className="container header-inner">
          <Link href="/" className="brand" onClick={open ? () => closeMenu() : undefined}>
            <span className="brand-mark" aria-hidden="true">
              IV
            </span>
            <span className="brand-text">
              <span className="brand-name">{name}</span>
              <span className="brand-role">{title}</span>
            </span>
          </Link>

          <nav className="site-nav" aria-label="Primary">
            <NavLinks pathname={pathname} />
            {phone ? (
              <a className="nav-phone" href={`tel:${phone.tel}`}>
                <Icon name="phone" size={18} />
                <span>{phone.display}</span>
              </a>
            ) : null}
            <Link href="/schedule" className="button nav-cta">
              Schedule Consultation
            </Link>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => (open ? closeMenu() : openMenu())}
          >
            <Icon name={open ? "close" : "menu"} size={24} />
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </header>

      {/* Full-screen sheet. Rendered outside <header> so no ancestor (e.g. backdrop-filter)
          can become its containing block and clip it. */}
      <div
        id="mobile-menu"
        ref={panelRef}
        className={`mobile-menu${open ? " is-open" : ""}`}
        hidden={!open}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeMenu(true);
        }}
      >
        <nav className="mobile-menu-inner" aria-label="Mobile">
          <NavLinks pathname={pathname} onNavigate={closeMenu} />
          <div className="mobile-menu-actions">
            <Link
              href="/schedule"
              className="button button-gold button-lg"
              onClick={() => closeMenu()}
            >
              <Icon name="calendar" size={18} /> Schedule Consultation
            </Link>
            {phone ? (
              <a className="button button-outline-light button-lg" href={`tel:${phone.tel}`}>
                <Icon name="phone" size={18} /> Call {phone.display}
              </a>
            ) : null}
          </div>
        </nav>
      </div>
    </>
  );
}
