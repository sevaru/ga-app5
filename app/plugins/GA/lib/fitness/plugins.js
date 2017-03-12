import BasicReferenceFitness from './providers/BasicReferenceFitness';
import ClusterFitness from './providers/ClusterFitness';
import DirectionFitness from './providers/DirectionFitness';
import IntervalFitness from './providers/IntervalFitness';
import MagnitudeFitness from './providers/MagnitudeFitness';
import MelodyFitness from './providers/MelodyFitness';
import MelodyLineFitness from './providers/MelodyLineFitness';
import NoteSizePartialFitness from './providers/NoteSizePartialFitness';
import RhythmLineFitness from './providers/RhythmLineFitness';
import RodNoteFitness from './providers/RodNoteFitness';
import SignSequenceFitness from './providers/SignSequenceFitness';

export const plugins = [
    BasicReferenceFitness,
    ClusterFitness,
    DirectionFitness,
    IntervalFitness,
    MagnitudeFitness,
    MelodyFitness,
    MelodyLineFitness,
    NoteSizePartialFitness,
    RhythmLineFitness,
    RodNoteFitness,
    SignSequenceFitness
];