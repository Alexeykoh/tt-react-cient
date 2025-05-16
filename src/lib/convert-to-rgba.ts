export function convertToRgba(color: string, alpha: string): string {
  // Если цвет уже в rgba, можно просто заменить альфу
  if (color.startsWith("rgba")) {
    return color.replace(/rgba\(([^)]+),\s*[\d.]+\)/, `rgba($1, ${alpha})`);
  }
  // Если цвет в hex, преобразуем в rgba
  if (color.startsWith("#")) {
    let r, g, b;
    if (color.length === 7) {
      r = parseInt(color.slice(1, 3), 16);
      g = parseInt(color.slice(3, 5), 16);
      b = parseInt(color.slice(5, 7), 16);
    } else if (color.length === 4) {
      r = parseInt(color[1] + color[1], 16);
      g = parseInt(color[2] + color[2], 16);
      b = parseInt(color[3] + color[3], 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  // Если цвет в формате rgb, просто добавим alpha
  if (color.startsWith("rgb(")) {
    return color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
  }
  // Если формат неизвестен, возвращаем исходный цвет без изменений
  return color;
}
