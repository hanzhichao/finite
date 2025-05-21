import {Tent} from "lucide-react";

export const NavHeader = () => {
  return (
    <div role="button" className="flex items-center text-sm p-3 w-full hover:bg-primary/5">
      <div className="gap-x-2 flex items-center max-w-[150px]">
        <div className="flex aspect-square size-8 items-center justify-center rounded-sm bg-sidebar-primary text-sidebar-primary-foreground">
          <Tent className="size-4" />
        </div>
        <div className="pt-1 flex flex-col gap-0.5 leading-none">
          <span className="font-semibold">Finite</span>
          <span className="text-xs text-muted-foreground">v0.01</span>
        </div>
      </div>
    </div>
  );
};
