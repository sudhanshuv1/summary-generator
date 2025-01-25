import { SummaryProvider } from "@/context/SummaryProvider"
import { AuthButtons } from "@/components/AuthButtons"
import Link from "next/link"

export const metadata = {
  title: 'Dashboard',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SummaryProvider>
      <header className="bg-blue-600 text-white p-4 md:hidden">
        <nav className="container mx-auto flex flex-row justify-between items-center">
          <Link className="text-2xl font-bold mb-4 sm:mb-0" href="/">
            Summary Generator
          </Link>
          <div className="space-x-4 flex">
            <AuthButtons />
          </div>
        </nav>
      </header>
      <main className="flex flex-col min-w-[100vw] justify-center flex-grow container mx-auto p-4 items-center bg-[#2a2a42]">
        {children}
      </main>
      <footer className="md:hidden bg-blue-600 text-white p-4">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Summary Generator. All rights reserved.</p>
        </div>
      </footer>
    </SummaryProvider>
  )
}
