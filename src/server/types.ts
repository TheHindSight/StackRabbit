type Board = Array<Array<number>>;

type Placement = [number, number, number]; // [numRightRotations, numShifts]

type PieceArray = Array<Array<number>>;

type PieceId = "I" | "O" | "L" | "J" | "T" | "S" | "Z" | null;

interface SimParams {
  board: Board;
  initialX: number;
  initialY: number;
  framesAlreadyElapsed: number;
  gravity: number;
  doubleGravity: boolean;
  rotationsList: Array<PieceArray>;
  pieceId: PieceId;
  existingRotation: number;
  inputFrameTimeline: string;
  canFirstFrameShift: boolean;
}

interface UrlArguments {
  board: Board;
  secondBoard?: Board;
  currentPiece?: PieceId;
  nextPiece?: PieceId;
  level?: number;
  lines?: number;
  reactionTime?: number;
  inputFrameTimeline?: string;
  lookaheadDepth?: number; // Only used in Javascript queries
  playoutCount: number; // Only used in C++ queries
  playoutLength: number; // Only used in C++ queries
  pruningBreadth: number; // Only used in C++ queries
  arrWasReset?: boolean;
  existingXOffset?: number;
  existingYOffset?: number;
  existingRotation?: number;
  existingFramesElapsed?: number;
}

/* ----------- Move Search-Related Types ------------ */

type MoveSearchResult = [Array<PossibilityChain>, Array<PossibilityChain>]; // [bestMoves, prunedMoves]

interface SimState {
  x: number;
  y: number;
  frameIndex: number;
  arrFrameIndex: number; // Sometimes differs from overall frame index (during adjustments)
  rotationIndex: number;
}

interface LegalPlacementSimState extends SimState {
  hasAlreadyLocked: boolean;
}

interface DFSState extends SimState {
  inputSequence: string;
}

interface Possibility {
  placement: Placement;
  inputSequence: string;
  numLinesCleared: number;
  boardAfter: Board;
  inputCost: number;
  lockPositionEncoded: string;
}

interface PossibilityChain extends Possibility {
  totalValue: number;
  searchStateAfterMove: SearchState; // The search state after the current move
  partialValue?: number; // If it has subsequent moves, the value of just the line clears involved in this move
  innerPossibility?: PossibilityChain; // The subsequent move in the chain, or null if this is the end of the chain
  expectedValue?: number; // If hypothetical analysis has been done, the EV of this possibility chain.
}

interface SearchState {
  board: Board;
  currentPieceId: PieceId;
  nextPieceId: PieceId;
  level: number;
  lines: number;
  framesAlreadyElapsed: number;
  existingXOffset: number;
  existingYOffset: number;
  existingRotation: number;
  reactionTime: number;
  canFirstFrameShift: boolean;
}

interface PhantomPlacement {
  inputSequence: string;
  initialPlacement: Possibility;
  adjustmentSearchState: SearchState;
  possibleAdjustmentsLookup?: Array<Possibility>;
}

/* ------------ Messages for Worker Threads ------------ */

interface WorkerDataArgs {
  piece: PieceId;
  newSearchState: SearchState;
  inputFrameTimeline: string;
}

interface WorkerResponse {
  type: string;
  piece?: PieceId;
  result?: PossibilityChain;
}
