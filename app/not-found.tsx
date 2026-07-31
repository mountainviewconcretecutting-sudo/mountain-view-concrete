import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-4xl uppercase text-charcoal">Page Not Found</h1>
      <p className="mt-4 text-steel">The page you are looking for does not exist.</p>
      <Link href="/" className="btn-primary mt-6 inline-flex">
        Return Home
      </Link>
    </div>
  );
}
