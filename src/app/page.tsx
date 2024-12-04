import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Link href="/puppet">
        <Button>Puppet</Button>
      </Link>

      <Link href="/wizard">
        <Button>Wizard</Button>
      </Link>
    </main>
  );
}
