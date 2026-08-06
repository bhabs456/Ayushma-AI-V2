import {RippleEffect} from "@/components/Ripple_Effect";

export default function RippleEffectPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--void)] w-full relative overflow-hidden z-50">
      <RippleEffect />
    </div>
  );
}
