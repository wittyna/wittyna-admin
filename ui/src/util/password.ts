export function generatePassword(length = 8): string {
  const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialCharacters = '!@#$%^&*()-=_+[]{}|;:,.<>?/';

  const allCharacters: string =
    lowercaseLetters + uppercaseLetters + numbers + specialCharacters;
  let password = '';

  // Ensure that at least one character from each category is included
  password += getRandomCharacter(lowercaseLetters);
  password += getRandomCharacter(uppercaseLetters);
  password += getRandomCharacter(numbers);
  password += getRandomCharacter(specialCharacters);

  // Generate remaining characters
  for (let i = 4; i < length; i++) {
    const randomIndex: number = Math.floor(
      Math.random() * allCharacters.length
    );
    password += allCharacters.charAt(randomIndex);
  }

  // Shuffle the password string
  password = shuffleString(password);

  return password;
}

function getRandomCharacter(characters: string): string {
  const randomIndex: number = Math.floor(Math.random() * characters.length);
  return characters.charAt(randomIndex);
}

function shuffleString(string: string): string {
  const array: string[] = string.split('');
  for (let i: number = array.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}
