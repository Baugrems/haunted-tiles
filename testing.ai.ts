export const testingScript=`
let turn = -1; // current turn mostly for turn 1
let board = []; // its the whole board with states
let curMoves = [];  // wild hold our positions
let enemyPos = [];  // will hold enemy positions

function main(gameState, side){
  	turn++;
  	const [rowSize, colSize] = gameState.boardSize;
	const myTeam = gameState.teamStates[side];
  	const otherSide = side === 'home' ? 'away' : 'home';
    const otherTeam = gameState.teamStates[otherSide];
    const possibleMoves = [];

    //first turn logic to set up empty board and stuff.
  	if (turn === 0) {
      for(let i = 0; i < rowSize; i++) {
        board.push([]);
        for(let j = 0; j < colSize; j++) {
          board[i].push(3);
        }
      }
      //first set of our team positions
      for(let i = 0; i < myTeam.length; i++) {
        curMoves.push(myTeam[i].coord);
      }
      //first set of enemy team positions
      for(let i = 0; i < otherTeam.length; i++) {
        enemyPos.push(otherTeam[i].coord);
      }

    // Logic for all other turns to update board and monster positions. both home and away team recorded.
  	} else {

        //records our team positions each turn
     	for(let i = 0; i < myTeam.length; i++) {
       		curMoves[i] = myTeam[i].coord;
        }

        //records enemy team positions each turn
        for(let i = 0; i < otherTeam.length; i++) {
            enemyPos[i] = otherTeam[i].coord;
        }

        //Updates entire board with status of tiles each turn. We can use board to check next moves, etc.
        for(let i = 0; i < rowSize; i++) {
            for(let j = 0; j < colSize; j++) {
              board[i][j] = gameState.tileStates[i][j];
            }
        }
    }

    //send console notes for how the board and locations look for monsters.
    var moves = ['none', 'none', 'none'];

    moves = makeMoves(gameState, myTeam, otherTeam);
    //moves = solvePaths(gameState, myTeam);
	  return moves;
}

function makeMoves(gameState, myTeam, otherTeam) {
    const [rowSize, colSize] = gameState.boardSize
    var moves = ['none', 'none', 'none'];
    for (let i = 0; i < myTeam.length; i++) {
        var possibleMoves = [];
        var row = myTeam[i].coord[0];
        var col = myTeam[i].coord[1];
        if (myTeam[i].isDead) {
            moves[i] = 'none';
            continue;
        }
        if (gameState.tileStates[row][col] > 1) {
            moves[i] = 'none';
            continue;
        }
        const canNorth = row > 0;
        const canSouth = row < rowSize - 1;
        const canWest = col > 0;
        const canEast = col < colSize - 1;

        if (canNorth && gameState.tileStates[row - 1][col] > 1) possibleMoves.push('north');
        if (canSouth && gameState.tileStates[row + 1][col] > 1)  possibleMoves.push('south');
        if (canWest && gameState.tileStates[row][col - 1] > 1) possibleMoves.push('west');
        if (canEast && gameState.tileStates[row][col + 1] > 1)  possibleMoves.push('east');
        if(possibleMoves.length == 0) possibleMoves.push('none');

        const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

        moves[i] = move;
    }
    return moves;
}

function solvePaths(gameState, myTeam) {

  let moves = ['none', 'none', 'none'];

  //Set up visited board for recursive pathfinding

  const [rowSize, colSize] = gameState.boardSize;

  let visited = [];
  for(let i = 0; i < rowSize; i++) {
    visited.push([]);
    for(let j = 0; j < colSize; j++) {
      visited[i].push(0);
    }
  }



  //iterate through team monsters to find longest path
  for (let i = 0; i < myTeam.length; i++) {
    let northCost = 0, southCost = 0, westCost = 0, eastCost = 0;
    let [row, col] = myTeam[i].coord;
    if (myTeam[i].isDead ) {
      continue;
    }
    // if (gameState.tileStates[row][col] > 1) {
    //   continue;
    // }
    let canNorth = (row > 0) && (gameState.tileStates[row - 1][col] > 1);
    let canSouth = (row < rowSize - 1) && (gameState.tileStates[row + 1][col] > 1);
    let canWest = (col > 0) && (gameState.tileStates[row][col - 1] > 1);
    let canEast = (col < colSize - 1) && (gameState.tileStates[row][col + 1] > 1);

    if (canNorth) {
      let visited = [];
      for(let i = 0; i < rowSize; i++) {
        visited.push([]);
        for(let j = 0; j < colSize; j++) {
          visited[i].push(0);
        }
      }
      northCost = 1 + recurseMoves(gameState, visited, row - 1, col);
    }
    if (canSouth) {
      let visited = [];
      for(let i = 0; i < rowSize; i++) {
        visited.push([]);
        for(let j = 0; j < colSize; j++) {
          visited[i].push(0);
        }
      }
      southCost = 1 + recurseMoves(gameState, visited, row + 1, col);
    }
    if (canEast) {
      let visited = [];
      for(let i = 0; i < rowSize; i++) {
        visited.push([]);
        for(let j = 0; j < colSize; j++) {
          visited[i].push(0);
        }
      }
      eastCost = 1 + recurseMoves(gameState, visited, row, col + 1);
    }
    if (canWest) {
      let visited = [];
      for(let i = 0; i < rowSize; i++) {
        visited.push([]);
        for(let j = 0; j < colSize; j++) {
          visited[i].push(0);
        }
      }
      westCost = 1 + recurseMoves(gameState, visited, row, col - 1);
    }


    console.log("Monster " + i, northCost, southCost, eastCost, westCost);


    //Calculate best path and send monster that way
    if (northCost >= southCost && northCost >= westCost && northCost >= eastCost) {
      moves[i] = 'north';
    } else if (southCost >= eastCost && southCost >= westCost) {
      moves[i] = 'south';
    } else if (westCost >= eastCost) {
      moves[i] = 'west';
    } else {
      moves[i] = 'east';
    }
    if ((northCost < 1 && southCost < 1) && (eastCost < 1 && westCost < 1)) {
      console.log(northCost, southCost, eastCost, westCost);
      moves[i] = 'none';
    }
  }
  return moves;
}

function recurseMoves(gameState, visited, row, col) {
  const [rowSize, colSize] = gameState.boardSize;

  let canNorth = (row > 0) && (gameState.tileStates[row - 1][col] > 1);
  let canSouth = (row < rowSize - 1) && (gameState.tileStates[row + 1][col] > 1);
  let canWest = (col > 0) && (gameState.tileStates[row][col - 1] > 1);
  let canEast = (col < colSize - 1) && (gameState.tileStates[row][col + 1] > 1);

  if (visited[row][col] == 1 || (!canWest && !canNorth && !canSouth && !canEast)) {
    return 0;
  }

  visited[row][col] = 1;

  //Recursively calls and counts the path cost in every possible direction.
  let northCost = 0, southCost = 0, westCost = 0, eastCost = 0;
  if (canNorth) {
    northCost = 1 + recurseMoves(gameState, visited, row - 1, col);
  }
  if (canSouth) {
    southCost = 1 + recurseMoves(gameState, visited, row + 1, col);
  }
  if (canEast) {
    eastCost = 1 + recurseMoves(gameState, visited, row, col + 1);
  }
  if (canWest) {
    westCost = 1 + recurseMoves(gameState, visited, row, col - 1);
  }

  //check which branch is bigger. No need to track the whole path, just the next step so this should be enough info for the main function
  if (northCost >= southCost && northCost >= westCost && northCost >= eastCost) {
    return northCost;
  } else if (southCost >= eastCost && southCost >= westCost) {
    return southCost;
  } else if (westCost >= eastCost) {
    return westCost;
  } else {
    return eastCost;
  }
}

`;