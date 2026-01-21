import Link from 'next/link';

export async function Footer() {
  'use cache';
  const year = new Date().getFullYear();
  return (
    <footer className="w-full py-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="text-muted-foreground flex items-center justify-center space-x-4 text-sm">
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>
            <div className="h-4 w-px bg-gray-300" aria-hidden="true" />
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
          </div>
          <p className="text-muted-foreground text-sm">
            © {year} Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
