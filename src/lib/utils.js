import { clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (input) => {
  const formattedValue = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(input);
  return formattedValue;
}

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function getImageData(event) {
  // FileList is immutable, so we need to create a new one
  const dataTransfer = new DataTransfer();

  // Add newly uploaded images
  Array.from(event.target.files).forEach((image) =>
    dataTransfer.items.add(image)
  );

  const files = dataTransfer.files;
  const displayUrl = URL.createObjectURL(event.target.files[0]);

  return { files, displayUrl };
}


export function formatToFloat(input) {
  return input.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '');
}


export function deepEqual(a, b) {
  if (a === b) return true;

  if (typeof a !== typeof b || a == null || b == null) return false;

  if (typeof a === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;

    return keysA.every(key => deepEqual(a[key], b[key]));
  }

  return false;
}

export function arraysEqualDeep(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((val, index) => deepEqual(val, arr2[index]));
}


export const dateFormatter = date => {
  return format(date, "dd MMM");
}

export const createDateRangeWithValues = (startDate, endDate, data) => {
  const dateRange = []
  let currentDate = new Date(startDate)
  
  const dataMap = new Map();
  data.map(item => {
    dataMap.set(item.date, item.sum);
  })
  while (currentDate <= endDate) {
    const dateStr = format(currentDate, "yyyy-MM-dd")
    dateRange.push({
      date: new Date(currentDate),
      sum: dataMap.has(dateStr) ? dataMap.get(dateStr) : 0
    });
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return dateRange;
}