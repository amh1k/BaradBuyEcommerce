import { Button } from "@/app/(app)/components/ui/button";
import { Input } from "@/app/(app)/components/ui/input";
import { Progress } from "@/app/(app)/components/ui/progress";

export default function Home() {
  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <Button variant={"elevated"}>I am a button</Button>
      </div>
      <div>
        <Input placeholder="hi there" />
      </div>
      <div>
        <Progress value={50} />
      </div>
    </div>
  );
}
