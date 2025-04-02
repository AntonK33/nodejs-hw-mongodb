export function getEnvVar(key) {
  const value = process.env[key];  // Доступ к переменной окружения
  if (!value) {
    throw new Error(`Переменная окружения ${key} не найдена!`);  // Ошибка, если переменной нет
  }
  return value;  // Возвращаем значение переменной
}