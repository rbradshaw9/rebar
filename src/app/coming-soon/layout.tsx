// Standalone layout for the coming-soon page — intentionally omits Nav, Footer,
// and all admin context providers so it renders as a clean, isolated page.
export default function ComingSoonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
