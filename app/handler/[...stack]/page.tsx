import { StackHandler } from "@stackframe/stack";
import BackHomeButton from "@/components/BackHome";


export default function Handler() {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage:
          "url(/imgs/bg-home.png)",
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="bg-black/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
          <StackHandler fullPage={false} />
          <BackHomeButton />
        </div>
      </div>
    </div>

  );
}
