import { cn } from '@/lib/utils';

const HeaderBox = ({ type = "title", title, subtext, user }: HeaderBoxProps) => {
  return (
    <div className="space-y-2">
      <h1 className={cn(
        "font-bold tracking-tight",
        "bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent",
        "text-2xl md:text-3xl lg:text-4xl"
      )}>
        {title}
        {type === 'greeting' && (
          <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent animate-gradient-x">
            &nbsp;{user}
          </span>
        )}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base font-medium">
        {subtext}
      </p>
    </div>
  )
}

export default HeaderBox