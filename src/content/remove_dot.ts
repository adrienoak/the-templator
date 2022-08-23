export function remove_dots(str: string) {
  return str.replace(/^_(?=\.)/, "");
}
