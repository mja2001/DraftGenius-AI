import { DraftHeader } from "./DraftHeader";
import { TeamPanel } from "./TeamPanel";
import { ChampionSelector } from "./ChampionSelector";
import { RecommendationPanel } from "./RecommendationPanel";
import { AnalyticsPanel } from "./AnalyticsPanel";

export function DraftBoard() {
  return (
    <div className="flex flex-col h-screen bg-gradient-gaming" data-testid="draft-board">
      <DraftHeader />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Blue Team */}
        <aside className="w-72 xl:w-80 shrink-0 p-4 overflow-y-auto scrollbar-thin border-r border-border bg-card/30">
          <TeamPanel team="blue" />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Champion Selector - takes most space */}
          <div className="flex-1 p-4 overflow-hidden">
            <ChampionSelector />
          </div>
        </main>

        {/* Right Sidebar - Red Team + Panels */}
        <aside className="w-80 xl:w-96 shrink-0 flex flex-col border-l border-border bg-card/30 overflow-hidden">
          {/* Red Team Panel */}
          <div className="p-4 border-b border-border overflow-y-auto scrollbar-thin" style={{ maxHeight: '45%' }}>
            <TeamPanel team="red" />
          </div>

          {/* Recommendations */}
          <div className="flex-1 p-4 overflow-hidden border-b border-border" style={{ maxHeight: '27.5%' }}>
            <RecommendationPanel />
          </div>

          {/* Analytics */}
          <div className="flex-1 p-4 overflow-hidden" style={{ maxHeight: '27.5%' }}>
            <AnalyticsPanel />
          </div>
        </aside>
      </div>
    </div>
  );
}
