import { DraftProvider } from "@/lib/draft-context";
import { DraftBoard } from "@/components/draft";

export default function DraftPage() {
  return (
    <DraftProvider>
      <DraftBoard />
    </DraftProvider>
  );
}
