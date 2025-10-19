export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:overflow-hidden">
      <div className="flex-grow md:overflow-y-auto">{children}</div>
    </div>
  );
}
