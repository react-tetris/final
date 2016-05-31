
function getTetLength(tet) {
	return tet.filter(function (row) {
		return row.some(function (block) {
			return block > 0;
		})
	}).length
}

function checkGameOver(grid) {
	if (grid[0].some(function (block) {
		return block > 0;
	})) {
		return true;
	} else {
		return false;
	}
}

function canMoveLeft(currGrid, currTet, currTetY, currTetX) {
	var tetLength = getTetLength(currTet);
	var floorCurrTetY = Math.floor(currTetY);
	var tetYMax = floorCurrTetY + tetLength;

	var leftCells = [];
	var canMove = true;

	if (floorCurrTetY < 0) {
		canMove = false;
	} else {
		currTet.forEach(function (row, rowIndex) {
			row.forEach(function (cell, cellIndex) {
				if (cell != 0 && (!currTet[rowIndex][cellIndex - 1] ? true : (currTet[rowIndex][cellIndex - 1] === 0 ? true : false))) {
					leftCells.push({ y: floorCurrTetY + rowIndex, x: currTetX + cellIndex })
				}
			});
		});
		leftCells.forEach(function (leftCell) {
			if (leftCell.x - 1 < 0 ? true : (currGrid[leftCell.y][leftCell.x - 1] != 0 ? true : false)) {
				canMove = false;
			}
		});
	}
	return canMove;
}

function canMoveRight(currGrid, currTet, currTetY, currTetX) {
	var tetLength = getTetLength(currTet);
	var floorCurrTetY = Math.floor(currTetY);
	var tetYMax = floorCurrTetY + tetLength;

	var rightCells = [];
	var canMove = true;

	if (floorCurrTetY < 0) {
		canMove = false;
	} else {
		currTet.forEach(function (row, rowIndex) {
			row.forEach(function (cell, cellIndex) {
				if (cell != 0 && (!currTet[rowIndex][cellIndex + 1] ? true : (currTet[rowIndex][cellIndex + 1] === 0 ? true : false))) {
					rightCells.push({ y: floorCurrTetY + rowIndex, x: currTetX + cellIndex })
				}
			});
		});
		rightCells.forEach(function (rightCell) {
			if (rightCell.x + 1 > 19 ? true : (currGrid[rightCell.y][rightCell.x + 1] != 0 ? true : false)) {
				canMove = false;
			}
		});
	}
	return canMove;
}


function canMoveDown(currGrid, currTet, currTetY, currTetX) {
	var tetLength = getTetLength(currTet);
	var floorCurrTetY = Math.floor(currTetY);
	var tetYMax = floorCurrTetY + tetLength;

	var bottomCells = [];
	var canMove = true;
	if (tetYMax > 0) {
		currTet.forEach(function (row, rowIndex) {
			row.forEach(function (cell, cellIndex) {
				if (cell != 0 && (!currTet[rowIndex + 1] ? true : (currTet[rowIndex + 1][cellIndex] === 0 ? true : false))) {
					bottomCells.push({ y: floorCurrTetY + rowIndex, x: currTetX + cellIndex });
				}
			});
		});
		bottomCells.forEach(function (bottomCell) {
			if (!currGrid[bottomCell.y + 1] || currGrid[bottomCell.y + 1][bottomCell.x] != 0) {
				canMove = false;
			}
		});
	}
	return canMove;
}

function getBottomMostPosition(currGrid, currTet, currTetY, currTetX){
	var tetLength = getTetLength(currTet);
	var canMove = true;
	var bottomMostY = currTetY;
	var floorCurrTetY = Math.floor(currTetY);
	var bottomCells = [];

	currTet.forEach(function(row, rowIndex){
		row.forEach(function(cell, cellIndex){
			if (cell != 0 && (!currTet[rowIndex + 1] ? true : (currTet[rowIndex + 1][cellIndex] === 0 ? true : false))) {
				bottomCells.push({ y: floorCurrTetY + rowIndex, x: currTetX + cellIndex, colHeight: rowIndex});
			}
		});
	});

	while(canMove){
		bottomCells.forEach(function(bottomCell){
			if(!currGrid[bottomCell.y+1] || currGrid[bottomCell.y+1][bottomCell.x] != 0){
				canMove = false;
				bottomMostY = bottomCell.y - bottomCell.colHeight;
			} else{
				bottomCell.y += 1;
			}
		});
	}
	return bottomMostY;
}

function mergeGrid(currGrid, currTet, currTetX, currTetY) {
	var tetLength = currTet.length;
	var relGridRow = 0;
	var relGridCol = 0;
	var newGrid = [];
	for (var row = 0; row < tetLength; row++) {
		for (var col = 0; col < tetLength; col++) {
			if (currTet[row][col] === 0) {
				continue;
			}
			relGridRow = Math.floor(currTetY) + row;
			relGridCol = currTetX + col;
			if (currGrid[relGridRow]) {
				currGrid[relGridRow][relGridCol] = currTet[row][col];
			}
		}
	}
	return currGrid;
}


function canRotate(currGrid, currTet, currTetY, currTetX) {
	var tetLength = currTet.length;
	var tetXMax = currTetX + getTetLength(currTet);
	var rotatedTet = rotateRight(currTet);
	var rotationAllowed = true;
	var relGridRow = 0;
	var relGridCol = 0;
	//only allow rotation once whole piece is on board
	if (currTetY < 0) {
		return true;
	}
	//check if whole tetrimino array is inside grid bounds
	//if yes can rotate
	else if (tetXMax > 19 && currTetX < 0) {
		return false;
	}
	//if tetrimino is in bounds, check if overlapping grid pieces are empty or full
	else {
		for (var row = 0; row < tetLength; row++) {
			for (var col = 0; col < tetLength; col++) {
				//if empty cell in tetrimino, doesnt matter
				if (rotatedTet[row][col] === 0) {
					continue;
				}
				relGridRow = Math.floor(currTetY) + row;
				relGridCol = currTetX + col;
				if (currGrid[relGridRow][relGridCol] != 0) {
					rotationAllowed = false;
				}
			}
		}
		return rotationAllowed;
	}
}

function clearLines(grid) {
	var fullRows = 0;
	grid.map(function (row, index) {
		if (row.every(function (cell) {
			return cell > 0
		})) {
			fullRows++;
			grid.splice(index, 1);
			grid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
		}
	});

	var gameOver = checkGameOver(grid);

	return { clearedGrid: grid, clearedLines: fullRows, gameOver: gameOver };
}

function rotateRight(array) {
    var n = array.length;
    var rotated = [];
	array.map(function (row, i) {
		rotated[i] = [];
		row.map(function (cell, j) {
			rotated[i][j] = array[n - j - 1][i]
		})
	})
    return rotated;
}

function getPoints(clearedLines){
	var points;
	switch (clearedLines){
		case 0:
			points = 0;
			break;
		case 1:
			points = 40;
			break;
		case 2:
			points = 100;
			break;
		case 3:
			points = 300;
			break;
		case 4:
			points = 800;
			break;
	}
	return points;
}

function combos(prevLines, currLines){
	if (!prevLines || prevLines === 0){
		return getPoints(currLines);
	}
	return getPoints(currLines)*1.5;
}



function getRandomBomb(handicapArr, clearedLines){
	var bombs = [
        {name: 'extraLines'},
        {name: 'speedUp', maxTime: 8000},
        {name: 'shake', maxTime: 2000},
        {name: 'reverse', maxTime: 5000},
        {name: 'blur', maxTime: 5000},
        {name: 'flip', maxTime: 8000},
		{name: 'troll', maxTime: 5000},
		// {name: 'cat', maxTime: 5000}
        ];
	var randomBomb = bombs[Math.floor(Math.random() * bombs.length)];

	if (clearedLines > 0){
        handicapArr.push(randomBomb);
	}
	return handicapArr;
}

module.exports = {
    getTetLength: getTetLength,
    checkGameOver: checkGameOver,
    canMoveLeft: canMoveLeft,
    canMoveRight: canMoveRight,
    canMoveDown: canMoveDown,
    getBottomMostPosition: getBottomMostPosition,
    mergeGrid: mergeGrid,
    canRotate: canRotate,
    clearLines: clearLines,
    rotateRight: rotateRight,
    getPoints: getPoints,
    combos: combos,
	getRandomBomb: getRandomBomb
}
