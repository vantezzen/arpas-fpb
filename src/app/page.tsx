// app/page.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: 20 }}>
      <h1>AR Prototypes</h1>

      <p>Choose a prototype:</p>
      <ul className="grid gap-4">
        <li>
          <Button>
            <Link href="/wizard">Wizard</Link>
          </Button>
        </li>
        <li>
          <Button>
            <Link href="/puppet">Puppet</Link>
          </Button>
        </li>
        <li>
          <Button>
            <Link href="/sockets">Socket Benchmark</Link>
          </Button>
        </li>
      </ul>

      <p>Prototypes v1:</p>
      <ul className="grid gap-4">
        <li>
          <Button>
            <Link href="/proto/modeful-touch">Modeful + Touch</Link>
          </Button>
        </li>
        <li>
          <Button>
            <Link href="/proto/modeless-touch">Modeless + Touch</Link>
          </Button>
        </li>
      </ul>

      <p>Prototypes v0:</p>
      <ul className="grid gap-4 opacity-50">
        <li>
          <Button>
            <Link href="/ar/modeful-touch">Modeful + Touch</Link>
          </Button>
        </li>
        <li>
          <Button>
            <Link href="/ar/modeful-device">Modeful + Device (HOMER-S)</Link>
          </Button>
        </li>
        <li>
          <Button>
            <Link href="/ar/modeless-touch">Modeless + Touch</Link>
          </Button>
        </li>
        <li>
          <Button>
            <Link href="/ar/modeless-device">Modeless + Device (HOMER-S)</Link>
          </Button>
        </li>
      </ul>
    </main>
  );
}
