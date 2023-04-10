export function findClosest(item, condition) {
    if (condition(item)) return item;
    if (item.parent) return findClosest(item.parent, condition);
    return null;
  }
  