import { Trees } from "lucide-react";

interface HeaderProps {
  onLoginClick?: () => void;
  onUniversitiesClick?: () => void;
  onCompaniesClick?: () => void;
}

export function Header({ onLoginClick, onUniversitiesClick, onCompaniesClick }: HeaderProps) {
  return (
    <header className="w-full border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Trees className="w-7 h-7 text-primary" strokeWidth={1.5} />
          <span className="text-xl font-medium text-foreground">LuppoGrove</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </a>
          <button
            onClick={onUniversitiesClick}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            For Universities
          </button>
          <button
            onClick={onCompaniesClick}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            For Companies
          </button>
          <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </a>
        </nav>

        {/* Login Button */}
        <button 
          onClick={onLoginClick}
          className="px-5 py-2 rounded-lg border border-border bg-white hover:bg-muted hover:scale-[1.02] transition-all"
        >
          Log in
        </button>
      </div>
    </header>
  );
}