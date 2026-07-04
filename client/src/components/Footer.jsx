import {
  Briefcase,
  Camera,
  Code,
  Mail,
  MessageCircle,
  Send,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "AI Tools", href: "/ai" },
      { label: "Community", href: "/ai/community" },
      { label: "Pricing", href: "#pricing" },
      { label: "Dashboard", href: "/ai" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "Article Writer", href: "/ai/write-article" },
      { label: "Blog Titles", href: "/ai/blog-titles" },
      { label: "Image Generator", href: "/ai/generate-images" },
      { label: "Resume Review", href: "/ai/review-resume" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#home" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "Creations", href: "#creations" },
      { label: "Contact", href: "mailto:support@lexora.ai" },
    ],
  },
];

const socialLinks = [
  { label: "Facebook", Icon: MessageCircle, href: "https://facebook.com" },
  { label: "Twitter", Icon: Send, href: "https://x.com" },
  { label: "Instagram", Icon: Camera, href: "https://instagram.com" },
  { label: "LinkedIn", Icon: Briefcase, href: "https://linkedin.com" },
  { label: "GitHub", Icon: Code, href: "https://github.com" },
];

const FooterLink = ({ href, children }) => {
  if (href.startsWith("/") && !href.startsWith("//")) {
    return (
      <Link
        to={href}
        className="text-sm text-slate-500 transition hover:text-primary"
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className="text-sm text-slate-500 transition hover:text-primary"
    >
      {children}
    </a>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-slate-100 bg-white px-4 pt-16 pb-8 sm:px-10 lg:px-20 xl:px-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1.8fr]">
          <div>
            <Link to="/" className="inline-flex items-center">
              <img src={assets.logo} alt="Lexora AI" className="h-10 w-auto" />
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">
              Lexora AI brings writing, image generation, cleanup tools, and
              resume review into one focused workspace for modern creators.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Create smarter. Ship faster.
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold text-slate-950">
                  {group.title}
                </h3>
                <div className="mt-4 flex flex-col gap-3">
                  {group.links.map((link) => (
                    <FooterLink key={link.label} href={link.href}>
                      {link.label}
                    </FooterLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:gap-4">
            <span>
              &copy; {new Date().getFullYear()} Lexora AI. All rights
              reserved.
            </span>
            <a
              href="mailto:support@lexora.ai"
              className="inline-flex items-center gap-2 hover:text-primary"
            >
              <Mail className="h-4 w-4" />
              support@lexora.ai
            </a>
          </div>

          <div className="flex items-center gap-2">
            {socialLinks.map(({ label, Icon, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 text-slate-500 transition hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
