import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { profile } from "@/content/profile";

export function Footer() {
  return (
    <footer className="site-footer container">
      <Link href="/" className="footer-name">
        Wajahat Naqvi<span>Full-Stack Developer</span>
      </Link>
      <p>© {new Date().getUTCFullYear()} · Built with intention.</p>
      <div className="footer-links">
        <a href={profile.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href="#top" aria-label="Back to top" className="back-top">
          <ArrowUp size={17} />
        </a>
      </div>
    </footer>
  );
}
