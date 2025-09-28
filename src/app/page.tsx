import LiveDetection from "@/components/LiveDetection";

export default function Home() {
  return (
    <div className="flex w-full flex-col items-center gap-10 py-10">
      <h1 className="text-5xl font-bold">Live Object Detection</h1>
      <LiveDetection />
    </div>
  );
}
