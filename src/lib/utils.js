// excerpted from https://stackoverflow.com/questions/40710628/how-to-convert-snake-case-to-camelcase-in-my-app
export function snakeToCamel(str){
  return str.toLowerCase().replace(/([-_][a-z])/g, group =>
    group
      .toUpperCase()
      .replace('-', '')
      .replace('_', '')
  );
}

export function choiceAmong(choices, value){
  return choices.indexOf(value) >= 0;
}

export function boolean(value){
  return choiceAmong(["true", 1, "yes", "True", true], value);
}

