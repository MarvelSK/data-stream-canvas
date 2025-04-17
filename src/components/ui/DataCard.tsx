
import { cn } from "@/lib/utils";

interface DataCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function DataCard({ 
  title, 
  children, 
  className,
  fullWidth = false
}: DataCardProps) {
  return (
    <div 
      className={cn(
        "data-card", 
        fullWidth ? "col-span-full" : "col-span-1", 
        className
      )}
    >
      <h3 className="mb-4 font-medium text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}
