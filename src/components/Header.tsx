import { GraduationCap } from "lucide-react"

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  return (
    <div className="absolute top-4 sm:top-6 left-1/2 transform -translate-x-1/2 z-20 w-max">
      <div className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-xl px-4 sm:px-6 py-2 sm:py-3 shadow-xl">
        <h1 className="text-base sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
          <span className="text-sm sm:text-base">{title}</span>
        </h1>
      </div>
    </div>
  )
}
