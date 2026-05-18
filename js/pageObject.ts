// Looks up elements by ID. Caches found elements. Errors if the element is not found.
function elementAccessor<T extends HTMLElement>(id: string): () => T {
  let element: T | undefined;
  return () => {
    if (element === undefined) {
      element = (document.getElementById(id) as T) ?? undefined;
    }
    if (!element) {
      throw new Error(`Element with id ${id} not found`);
    }
    return element;
  };
}

export const pageObject = {
  button: elementAccessor<HTMLButtonElement>('btn-generate'),
  crackTime: elementAccessor<HTMLSpanElement>('crack-time'),
  passwordField: elementAccessor<HTMLInputElement>('passphrase'),
  passphraseSelect: elementAccessor<HTMLSelectElement>('passphrase_select'),
};
