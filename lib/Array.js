//数组元素上移
function upIndex(arr, index) {
  var temp;
  if (index < 1 || index > arr.length - 1) {
    return arr;
  }
  temp = arr[index - 1];
  arr = arr.copyWithin(index - 1, index, index + 1);//target, start, end
  arr[index] = temp;
  console.log(arr)
  return arr;
}

//数组元素下移
function downIndex(arr, index) {
  var temp;
  if (index < 0 || index > arr.length - 1) {
    return arr;
  }
  temp = arr[index + 1];
  arr = arr.copyWithin(index + 1, index, index + 1);
  arr[index] = temp;
  return arr;
}

//数组元素置顶
function topIndex(arr, index) {
  var temp;
  if (index >= arr.length || index < 1) {
    return arr;
  }
  temp = arr[index];
  arr.unshift(temp);
  arr.splice(index + 1, 1);
  return arr;
}

//数组元素置底
function bottomIndex(arr, index) {
  var temp;
  if (index >= arr.length - 1 || index < 0) {
    return arr;
  }
  temp = arr[index];
  arr.push(temp);
  arr.splice(index, 1);
  return arr;
}

//删除元素
function remove(arr, index){
  for (var i = 0; i < arr.length; i++) {
    var temp = arr[i];
    if (!isNaN(index)) {
      temp = i;
    }
    if (temp == index) {
      for (var j = i; j < arr.length; j++) {
        arr[j] = arr[j + 1];
      }
      arr.length = arr.length - 1;
    }
  }
  return arr;
}

module.exports = {
  upIndex: upIndex,
  downIndex: downIndex,
  topIndex: topIndex,
  bottomIndex: bottomIndex,
  remove: remove
}