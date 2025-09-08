// app/(root)/loading.tsx
import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Image
        src="/assets/loading.gif"
        alt="Loading..."
        width={500}
        height={500}
      />
    </div>
  );
}