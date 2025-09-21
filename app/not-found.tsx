
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text px-4 text-center">
      <div className="bg-card p-8 rounded-2xl shadow-lg max-w-md w-full animate-fadeIn">
        <h1 className="text-6xl font-bold text-primary mb-4">404 </h1>
        <h2 className="text-2xl text-amber-300 font-semibold mb-2">Page Not Found</h2>
        <p className="text-white my-10">
          The resource you are looking for does not exist or has been removed.
        </p>

        <Link
          href="/"
          className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg bg-[var(--primary)] hover:bg-[var(--primaryHover)] text-white"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
