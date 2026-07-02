export function onlyDigits(value) {
  return String(value).replace(/\D/g, "");
}

export function formatCpf(value) {
  return onlyDigits(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function hasSequence(value) {
  const normalized = onlyDigits(value);
  if (/\d{3,}/.test(normalized) && /(\d)\1{2,}/.test(normalized)) return true;

  const sequences = [
    "0123",
    "1234",
    "2345",
    "3456",
    "4567",
    "5678",
    "6789",
    "012",
    "123",
    "234",
    "345",
    "456",
    "567",
    "678",
    "789",
    "0987",
    "1098",
    "2109",
    "3210",
    "4321",
    "5432",
    "6543",
    "7654",
    "8765",
    "9876",
    "098",
    "109",
    "210",
    "321",
    "432",
    "543",
    "654",
    "765",
    "876",
    "987",
  ];

  return sequences.some((seq) => normalized.includes(seq));
}

export function isValidCpf(cpf) {
  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i += 1) sum += Number(cpf[i]) * (10 - i);
  let firstDigit = (sum * 10) % 11;
  if (firstDigit === 10) firstDigit = 0;
  if (firstDigit !== Number(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i += 1) sum += Number(cpf[i]) * (11 - i);
  let secondDigit = (sum * 10) % 11;
  if (secondDigit === 10) secondDigit = 0;
  return secondDigit === Number(cpf[10]);
}

export function checkPassword(value) {
  return {
    length: value.length >= 8,
    uppercase: /[A-Z]/.test(value),
    lowercase: /[a-z]/.test(value),
    number: /\d/.test(value),
    special: /[^A-Za-z0-9]/.test(value),
    sequence: !hasSequence(value),
  };
}

export function isStrongPassword(value) {
  return Object.values(checkPassword(value)).every(Boolean);
}
