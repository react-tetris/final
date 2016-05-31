function rotateRight(array){
    var n = array.length;
    var rotated = [];
    for (var i=0; i<n; i++){
        rotated[i]=[];
        for (var j=0; j<n; j++){
            rotated[i][j] = array[n-j-1][i]
        }
    }
    return rotated;
}