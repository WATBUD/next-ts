"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
//template {{domain}}/test-ui/CustomSwitch
export default function DynamicUIPage() {
  const params = useParams<{ name: string }>();
  const name = params?.name;

  if (!name) return null;

  const DynamicComponent = dynamic(
    () =>
      import(`@/components/custom-ui/${name}`).catch(() =>
        import("@/components/custom-ui/CustomSwitch")
      ),
    { ssr: false }
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>Component: {name}</h2>
      <DynamicComponent />
    </div>
  );
}
