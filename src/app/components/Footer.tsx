import { Trees } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full py-12 border-t border-border bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Trees className="w-6 h-6 text-primary" strokeWidth={1.5} />
            <span className="text-lg font-medium text-foreground">LuppoGrove</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <a href="#privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
          </div>

          {/* Contact */}
          <div className="text-sm text-muted-foreground">
            <a href="mailto:contact@luppogrove.com" className="hover:text-foreground transition-colors">
              contact@luppogrove.com
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} LuppoGrove. All rights reserved.
        </div>
      </div>
    </footer>
  );
}