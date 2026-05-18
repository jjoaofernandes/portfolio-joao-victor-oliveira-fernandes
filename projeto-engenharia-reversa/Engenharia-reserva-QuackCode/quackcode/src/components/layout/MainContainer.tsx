import { ReactNode } from "react";

interface MainContainerProps {
  preview: ReactNode;
  options: ReactNode;
}

export function MainContainer({ preview, options }: MainContainerProps) {
  return (
    <main className="container mx-auto min-h-screen p-4 md:p-8 transition-colors">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Options Column (Left) */}
        <div className="lg:col-span-7 xl:col-span-7">
          <div className="rounded-sm bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 transition-colors">
            {options}
          </div>
        </div>

        {/* Preview Column (Right) */}
        <div className="lg:col-span-5 xl:col-span-5">
          <div className="sticky top-8 flex flex-col items-center">
            {preview}
          </div>
        </div>
      </div>
    </main>
  );
}


