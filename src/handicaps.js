
//{name: 'extraLines'}
//{name: 'speedUp', maxTime: 10000}
//{name: 'blur', maxTime: 10000}
//{name: 'shake', maxTime: 10000}
//{name: 'reverse', maxTime: 5000}

function extraLines(grid){
	
	grid.splice(0, 4);
	grid.push(
			[8, 8, 8, 0, 0, 8, 8, 0, 8, 8],
			[0, 8, 8, 8, 0, 8, 0, 8, 8, 8],
			[8, 0, 8, 8, 8, 8, 8, 8, 0, 8],
			[8, 8, 0, 8, 8, 0, 8, 0, 8, 8]
	)
	return grid;
}

function shake(grid) {
    var notEmptyRow = [];
    grid.map(function(row, index) {
        if (row.some(function(cell){
            return cell > 0;
        }) ) {
        notEmptyRow.push(index);
        }    
    })
    notEmptyRow.forEach(function(notERow){
        var randomCol = Math.floor(Math.random()*9);
        grid[notERow][randomCol] = 0;
    })
    return grid;
}

module.exports = {
	extraLines: extraLines,
	shake: shake
}

