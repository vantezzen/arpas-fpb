// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: 20 }}>
      <h1>AR Prototypes</h1>

      <p>Choose a prototype:</p>
      <ul>
        <li>
          <Link href="/wizard">Wizard</Link>
        </li>
        <li>
          <Link href="/puppet">Puppet</Link>
        </li>
      </ul>
      <p>Choose a prototype:</p>
      <ul>
        <li>
          <Link href="/ar/modeful-touch">Modeful + Touch</Link>
        </li>
        <li>
          <Link href="/ar/modeful-device">Modeful + Device (HOMER-S)</Link>
        </li>
        <li>
          <Link href="/ar/modeless-touch">Modeless + Touch</Link>
        </li>
        <li>
          <Link href="/ar/modeless-device">Modeless + Device (HOMER-S)</Link>
        </li>
      </ul>
      <p>Scan the corresponding QR code or just click the links above.</p>
    </main>
  );
}
