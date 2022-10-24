const input = document.getElementById("numbers");
const selectionSvg = d3.select("#selection-svg");
const bubbleSvg = d3.select("#bubble-svg");
const insertionSvg = d3.select("#insertion-svg");
const quickSvg = d3.select("#quick-svg");
const svgHeight = selectionSvg.attr("height");
const svgWidth = selectionSvg.attr("width");

const indices = { "selection": 0, "bubble": 1, "insertion": 2, "quick": 3};

const sorts = [ {"svg": selectionSvg, "arr": [], "start": 0, "svgID": "selection-svg"}, 
                {"svg": bubbleSvg, "arr": [], "start": 0, "svgID": "bubble-svg", "swapped": true},
                {"svg": insertionSvg, "arr": [], "start": 1, "svgID": "insertion-svg"}, 
                {"svg": quickSvg, "arr": [], "start": 0, "svgID": "quick-svg", "stack": [], "low": 0, "high": 0} ];

function displayArray(index) {
    var svg = sorts[index].svg;
    var arr = sorts[index].arr;
    var start = sorts[index].start;
    var svgID = sorts[index].svgID;
    var maxVal = Math.max(...arr);
    var scale = (svgHeight - 25)/maxVal;
    d3.selectAll("#" + svgID + " > *").remove();
    svg.selectAll("rect")
    .data(arr)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
        return 10 + 15 * i;
    })
    .attr("y", function(d, i) {
        return 200 - arr[i] * scale - 10;
    })
    .attr("width", 10)
    .attr("height", function(d, i) {
        return arr[i] * scale;
    })
    .attr("style", "fill: #e63946;")  //c26f75
    .on("mouseover", function (d, i) {
        d3.select(this).transition()
               .duration('50')
               .attr('opacity', '.5');
//        svg.append("text").text(d3.select(this).datum())
//        .attr("x", d3.select(this).attr("x"))
//        .attr("y", d3.select(this).attr("y"))
    })
    .on("mouseout", function(d, i) {
        d3.select(this).transition()
        .duration('50').attr('opacity', '1');
    });
    
    svg.selectAll("text").data(arr).enter().append("text").text(function(d, i) {
        return d;
    }).attr("x", function(d, i) {
        return 10 + 15 * i;
    })
    .attr("y", function(d, i) {
        return 200 - arr[i] * scale - 10;
    })
    .style("font-size", "14px");
    
    /*
    svg.append("line")
    .attr("x1", 8 + 15 * start)
    .attr("y1", svgHeight - 20)
    .attr("x2", 8 + 15 * start)
    .attr("y2", svgHeight)
    .attr("stroke", "#000000");
    svg.append("line")
    .attr("x1", 8 + 15 * (1 + start))
    .attr("y1", svgHeight - 20)
    .attr("x2", 8 + 15 * (1 + start))
    .attr("y2", svgHeight)
    .attr("stroke", "#000000");*/
    svg.append("line")
    .attr("x1", 8 + 15 * (start))
    .attr("y1", svgHeight - 3)
    .attr("x2", 8 + 15 * (1 + start))
    .attr("y2", svgHeight - 3)
    .attr("stroke", "#000000")
    .attr("stroke-width", "2px");

    if(index == indices["quick"]) {
        var low = sorts[index].low;
        var high = sorts[index].high;
        svg.append("line")
        .attr("x1", 8 + 15 * (low))
        .attr("y1", svgHeight - 1)
        .attr("x2", 8 + 15 * (start))
        .attr("y2", svgHeight - 1)
        .attr("stroke", "#0000FF")
        .attr("stroke-width", "4px");
        svg.append("line")
        .attr("x1", 8 + 15 * (1 + start))
        .attr("y1", svgHeight - 1)
        .attr("x2", 8 + 15 * (1 + high))
        .attr("y2", svgHeight - 1)
        .attr("stroke", "#FF0000")
        .attr("stroke-width", "4px");
    }
}

function processInput() {
    var regExp = /^[0-9 ]+$/;
    if(!regExp.test(input.value)) {
        window.alert("Please enter 1 or more numbers separated by spaces. Or use the default input by pressing Use Default.");
        return;
    }
    var nums = input.value.split(/[ ,]+/);
    nums = nums.filter(function (element) {
        return element != "";
    });
    nums = nums.map(function (element) {
        return parseInt(element, 10);
    });
    if(nums.length == 0) {
        window.alert("Please enter 1 or more numbers separated by spaces. Or use the default input by pressing Use Default.");
        return;
    }
    initializeSorts(nums);
}

function useDefaultInput() {
    var a = [10, 6, 12, 3, 1, 4, 2, 17, 1, 9, 5, 2, 15, 11, 3, 2, 7, 1, 9, 5, 7, 6, 5, 9, 8, 3, 15, 2, 6, 7, 3, 2, 14, 6, 8, 14, 6, 16];
    var b = [5, 16, 5, 16, 8, 16, 14, 1 ,4, 19, 18, 19, 3, 12 ,5 ,4 ,11 ,16 ,14 ,16 ,17 ,18 ,7 ,18, 5, 3, 18, 13, 8, 6, 4, 11, 3, 7, 15]
    initializeSorts(a);
}

function initializeSorts(array) {
    for(let i = 0; i < sorts.length; i++) {
        sorts[i].arr = array.slice();
        sorts[i].start = 0;
    }
    sorts[indices["insertion"]].start = 1;
    sorts[indices["quick"]].stack.push([0, array.length - 1]);
    sorts[indices["quick"]].low = 0;
    sorts[indices["quick"]].high = array.length - 1;
    for(let i = 0; i < sorts.length; i++) {
        displayArray(i);
    }
    var btns = document.getElementsByClassName("step-btn");
    Array.prototype.forEach.call(btns, function(btn) {
        btn.disabled = false;
    });
}

function stepSelectionSort(id) {
    var index = indices["selection"];
    var start = sorts[index].start;
    var arr = sorts[index].arr;
    if(start > arr.length - 2) {
        document.getElementById(id).disabled = true;
    }
    var min = arr[start];
    var minIndex = start;
    var end = arr.length - 1;
    for(let i = start + 1; i <= end; i++) {
        if(arr[i] < min) {
            min = arr[i];
            minIndex = i;
        }
    }
    arr[minIndex] = arr[start];
    arr[start] = min;
    start++;
    sorts[index].start = start;
    sorts[index].arr = arr;
    displayArray(index);
}

function stepBubbleSort(id) {
    var index = indices["bubble"];
    var start = sorts[index].start;
    var arr = sorts[index].arr;
    if(start == 0 && !sorts[index].swapped) {
        document.getElementById(id).disabled = true;
        return;
    }
    if(start == 0) {
        sorts[index].swapped = false;
    }
    if(arr[start] > arr[start + 1]) {
        sorts[index].swapped = true;
        let temp = arr[start];
        arr[start] = arr[start + 1];
        arr[start + 1] = temp;
    }
    start++;
    if(start > arr.length - 2) {
        start = 0;
    }
    sorts[index].start = start;
    sorts[index].arr = arr;
    displayArray(index);
}

function bigStepBubbleSort(id) {
    var index = indices["bubble"];
    var arr = sorts[index].arr;
    sorts[index].start = 0;
    var swap = false;
    for(let s = 0; s < arr.length - 1; s++) {
        if(arr[s] > arr[s + 1]) {
            swap = true;
            let temp = arr[s];
            arr[s] = arr[s + 1];
            arr[s + 1] = temp;
        }
    }
    if(!swap) {
        document.getElementById(id).disabled = true;
    }
    sorts[index].arr = arr;
    displayArray(index);
}


function stepInsertionSort(id) {
    var index = indices["insertion"];
    var start = sorts[index].start;
    var arr = sorts[index].arr;
    if(start == arr.length - 1) {
        document.getElementById(id).disabled = true;
    }
    var i = start;
    while(i >= 0 && arr[i] < arr[i-1]) {
        let temp = arr[i];
        arr[i] = arr[i-1];
        arr[i-1] = temp;
        i--;
    }
    start++;
    sorts[index].start = start;
    sorts[index].arr = arr;
    displayArray(index);
}

function stepQuickSort(id) {
    var index = indices["quick"];
    if(sorts[index].stack.length == 0) {
        document.getElementById(id).disabled = true;
        return;
    }
    var arr = sorts[index].arr;
    var top = sorts[index].stack.pop();
    if(top[0] < top[1]) {
        var pivot = partition(arr, top[0], top[1]);
        sorts[index].start = pivot;
        sorts[index].arr = arr;
        sorts[index].low = top[0];
        sorts[index].high = top[1];
        displayArray(index);
        sorts[index].stack.push([top[0], pivot - 1]);
        sorts[index].stack.push([pivot + 1, top[1]]);
    }
    else {
        stepQuickSort(id);
    }
}

/*
function quicksort(arr, low, high) {
    if(low < high) {
        var pivot = partition(arr, low, high);
        console.log("pivot: " + pivot);
        sorts[indices["quick"]].arr = arr;
        sorts[indices["quick"]].start = pivot;
        displayArray(indices["quick"]);
        setTimeout(() => { quicksort(arr, low, pivot - 1); }, 2000);
        setTimeout(() => { quicksort(arr, pivot + 1, high); }, 15000);
    }
}
*/
function partition(arr, low, high) {
    var pivot = arr[high];
    var i = low - 1;
    for(let j = low; j < high; j++) {
        if(arr[j] <= pivot) {
            i++;
            var temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    arr[high] = arr[i + 1];
    arr[i + 1] = pivot;
    return i + 1;
}


/*
function displayArray(arr) {
    svg.innerHTML = "";
    var maxVal = Math.max(...arr);
    var scale = (svgHeight - 20)/maxVal;
    var x, y, h, w = 10;
    for(var i = 0; i < arr.length; i++) {
        h = arr[i] * scale;
        x = 10 + 15 * i;
        y = 200 - h - 10;
        svg.innerHTML += `<rect x="${x}" y="${y}" width="${w}" height="${h}" style="fill: #e4a199;"></rect>`
    }
} */
