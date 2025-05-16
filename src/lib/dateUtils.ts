export const formatDate = (dateString: string): string => {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Проверка на валидность даты
  if (isNaN(date.getTime())) return dateString;

  // Форматирование даты в формат "ДД.ММ.ГГГГ"
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};
