import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-brand-canvas">
      <header className="sticky top-0 z-10 border-b border-brand-gold/20 bg-brand-black">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gold font-bold text-brand-black">
              רפ
            </div>
            <div>
              <p className="text-sm font-bold leading-tight text-white">
                עמית רפאלי
              </p>
              <p className="text-xs leading-tight text-brand-gold/70">
                ניהול מתאמנים
              </p>
            </div>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
