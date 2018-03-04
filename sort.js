//兼容交换数组的值
function swap(arr, current, previous) {
  let middleValue;
  middleValue = arr[current];
  arr[current] = arr[previous];
  arr[previous] = middleValue;
}

// 冒泡排序
function bubbleSort(arr) {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (arr[j] > arr[j+1]) {
        swap(arr, j, j+1);
        //[arr[j], arr[j+1]] = [arr[j+1], arr[j]];
      }
    }
  }
  return arr;
}

// 选择排序
function selectionSort(arr) {
  let len = arr.length, minIndex;
  for (let i = 0; i < len - 1; i++) {
    minIndex = i;
    for (let j = i; j < len; j++) {
      if (arr[minIndex] > arr[j]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      swap(arr, i, minIndex);
    }
  }
  return arr;
}

//插入排序
function insertionSort(arr) {
  let len = arr.length, temp, j;
  for (let i = 1; i < len; i++) {
    j = i;
    temp = arr[i];
    while(j > 0 && arr[j-1] > temp) {
      arr[j] = arr[j-1];
      j--;
    }
    arr[j] = temp;
  }
  return arr;
}

//归并排序
function merge(left, right) {
  const result = [], llen = left.length, rlen = right.length;
  let il = 0, ir = 0;
  while (il < llen && ir < rlen) {
    if (left[il] < right[ir]) {
      result.push(left[il++]);
    } else {
      result.push(right[ir++]);
    }
  }

  while (il < llen) {
    result.push(left[il++]);
  }

  while (ir < rlen) {
    result.push(right[ir++]);
  }

  return result;
}

function mergeSortRec(arr) {
  const len = arr.length;
  if (len === 1) {
    return arr;
  }

  const mid = Math.floor(len / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid, len);

  return merge(mergeSortRec(left), mergeSortRec(right));
}

function mergeSort(arr) {
  return mergeSortRec(arr);
}

//快速排序
function partition(arr, left, right) {
  const pivot = arr[Math.floor((left + right) / 2)]
  let i = left, j = right;

  while (i <= j) {
    while (arr[i] < pivot) {
      i++;
    }

    while (arr[j] > pivot) {
      j--;
    }
    if (i <= j) {
      swap(arr, i, j);
      i++;
      j--;
    }
  }

  return i;
};

function quick(arr, left, right) {
  const len = arr.length;
  let index;

  if (len > 1) {
    index = partition(arr, left, right);

    if (left < index - 1) {
      quick(arr, left, index - 1);
    }

    if (index < right) {
      quick(arr, index, right);
    }
  }
}

function quickSort(arr) {
  quick(arr, 0, arr.length - 1);
  return arr;
}

//二分搜索
function binarySearch(item, arr) {
  quickSort(arr);
  let low = 0, high = arr.length - 1, mid, element;
  while(low <= high) {
    mid = Math.floor((low + high) / 2);
    element = arr[mid];
    if (element < item) {
      low = mid + 1;
    } else if (element > item) {
      high = mid - 1;
    } else {
      return mid;
    }
  }
  
  return -1;  
}

//斐波那契数
function fibonacci(num) {
  if (num < 3) {
    return 1;
  }

  return (fibonacci(num-1) + fibonacci(num-2))
}

//数据结构

//栈
class Stack {
  constructor() {
    this.items = [];
  }

  push(item){
    this.items.push(item);
  }

  pop(){
    return this.items.pop();
  }

  peek(){
    const len = this.items.length;
    return this.items[len-1];
  }

  isEmpty(){
    const len = this.items.length;
    return len === 0;
  }

  clear(){
    this.items = [];
  }

  size(){
    return this.items.length;
  }
}

//转换进制
function baseConverter(decNumber, base){
  let remStack = [], rem, baseString = '', digits = '0123456789ABCDEF';
  while(decNumber > 0){
    rem = Math.floor(decNumber % base);
    remStack.push(rem);
    decNumber = Math.floor(decNumber / base);
  }
  while(remStack.length > 0){
    baseString += digits[remStack.pop()]
  }

  return baseString;
}

console.log(baseConverter(31, 16));
