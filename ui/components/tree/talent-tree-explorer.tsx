import { useState } from 'react';
import { RatedLoadout } from '@/lib/pvp';
import { TalentTree } from '@/lib/talents';
import { filterRatedLoadouts, LoadoutFilter } from '@/lib/loadout-filter';
import { Button, Flex, Stack, Tabs } from '@mantine/core';
import FilteringSubTree from './filtering-sub-tree';
import FilteringPvpTalentList from '@/components/pvp-talents/filtering-pvp-talent-list';
import InfoPanel from '../info-panel/info-panel';
import RatingsPlot from '../info-panel/ratings-plot';

interface TalentTreeExplorerProps {
  tree: TalentTree;
  leaderboard: RatedLoadout[];
};

export default function TalentTreeExplorer({
  tree,
  leaderboard
}: TalentTreeExplorerProps) {
  let [classFilters, setClassFilters] = useState<LoadoutFilter[]>([]);
  let [specFilters, setSpecFilters] = useState<LoadoutFilter[]>([]);
  let [pvpFilters, setPvpFilters] = useState<LoadoutFilter[]>([]);
  let [resetCount, setResetCount] = useState<number>(0);

  const loadouts = filterRatedLoadouts(leaderboard, [
    ...classFilters,
    ...specFilters,
    ...pvpFilters,
  ]);

  function reset() {
    setResetCount(resetCount + 1);
    setClassFilters([]);
    setSpecFilters([]);
    setPvpFilters([]);
  }

  return (
    <Flex
      justify="center"
      sx={theme => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          display: 'block'
        },
      })}
    >
      <Stack>
        <FilteringSubTree
          nodes={tree.classNodes}
          onFiltersChange={filters => setClassFilters(filters) }
          loadouts={loadouts}
          width={tree.classSize.width}
          height={tree.classSize.height}
          key={`class-${resetCount}`}
        />
        <FilteringSubTree
          nodes={tree.specNodes}
          onFiltersChange={filters => setSpecFilters(filters) }
          loadouts={loadouts}
          width={tree.specSize.width}
          height={tree.specSize.height}
          key={`spec-${resetCount}`}
        />
        <FilteringPvpTalentList
          talents={tree.pvpTalents}
          onFiltersChange={filters => setPvpFilters(filters) }
          loadouts={loadouts}
          key={`pvp-${resetCount}`}
        />
      </Stack>
      <InfoPanel>
        <RatingsPlot
          allRatings={leaderboard.map(loadout => loadout.rating)}
          filteredRatings={loadouts.map(loadout => loadout.rating)}
        />
        <Button onClick={reset}>Reset</Button>
      </InfoPanel>
    </Flex>
  );
}
