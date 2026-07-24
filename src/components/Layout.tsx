import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { AmbientBackground } from '@/components/motion/AmbientBackground'
import { PageTransition } from '@/components/motion/PageTransition'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AmbientBackground />
      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-paper-raised ring-1 ring-line" />
        </div>
      </div>
      <div className="relative z-10 flex w-full flex-col">
        <Header />
        <main className="flex-auto">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </div>
    </>
  )
}
