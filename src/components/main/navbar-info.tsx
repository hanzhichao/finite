import {Info, CircleMinus, Plus} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {useMediaQuery} from "usehooks-ts";
import {useActiveNote} from "@/hooks/use-active-note";
import { Button } from "../ui/button";

export const NavbarInfo = () => {
  const properties = useActiveNote((store)=>store.properties)
  const addProperty = useActiveNote((store)=>store.addProperty)

  const onAddProperty = () => {
    addProperty("key", "value")
  }

  return (
    <Popover>
      <PopoverTrigger className="w-full">
        <div className="cursor-pointer hover:bg-accent px-2.5 py-2 rounded-md">
          <Info className="w-4 h-4"/>
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-42 " side="bottom">
        <div className="p-3">
        <div className="pl-1 pb-1 mb-1 text-sm text-muted-foreground border-b-1">Properties</div>
        {properties.map((property, index)=>(
          <div key={index} className="p-1 flex flex-1 gap-2 items-center justify-between">
            <div className="text-xs text-muted-foreground hover:bg-accent font-medium">
            <span className="pr-1">{property.key}</span>
            =
            <span className="pl-1">{property.value}</span>
            {/*<input name="value" type="text" className="pl-1" value={property.value} onChange={()=>{}}/>*/}
            </div>
            <CircleMinus className="w-4 h-4 text-muted-foreground hover:text-red-500"/>
          </div>

          ))}
          <Button variant="outline" size="sm" className="mt-1 w-full" onClick={()=> {onAddProperty()}}>
            <Plus className="w-4 h-4 text-muted-foreground"/>
            <span className="pl-1 text-xs text-muted-foreground">Add property</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
