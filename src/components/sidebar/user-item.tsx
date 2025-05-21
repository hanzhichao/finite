import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent,DropdownMenuItem,DropdownMenuSeparator,DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { ChevronsLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const UserItem = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div role="button" className="flex items-center text-sm p-3 w-full hover:bg-primary/5">
          <div className="gap-x-2 flex items-center max-w-[150px]">
            <Avatar className="h-5 w-5">
              <AvatarImage src="/favicon.ico" />
            </Avatar>
            <span className="text-start font-medium line-clamp-1">
              Kevin&apos;s Finite
            </span>
          </div>
          <ChevronsLeftRight className="rotate-90 ml-2 text-muted-foreground h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="start" alignOffset={11} forceMount>
        <div className="flex flex-col space-y-4 p-2">
          <p className="text-xs font-medium leading-none text-muted-foreground">
            superhin@126.com
          </p>
          <div className="flex items-center gap-p-2">
            <div className="rounded-md bg-secondary">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/favicon.ico" />
              </Avatar>
            </div>
            <div className="space-y-1">
              <p className="ml-2 text-sm line-clamp-1">
                Kevin&apos;s Finite
              </p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="w-full cursor-pointer text-muted-foreground">
          <Button>Log out</Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
