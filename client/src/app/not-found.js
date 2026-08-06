import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <h2 className="text-4xl font-bold">404 - Not found</h2>

      <Link href="/">
        <Button>Return to home</Button>
      </Link>
    </div>
  );
}
