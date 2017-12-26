/*
  Basic Translation module
  Example init in 'app.jsx':
  ```
  import EN from 'translations/page.en.json';
  import FR from 'translations/page.fr.json';
  import { getLanguage, use } from 'utils/Translations';

  use(getLanguage() == 'en' ? EN : FR);
  ...
  ```

  .json files are key/value associations representing TRANSLATION_ID/<displayed value>

  Usage in any Component:
  ```
  import Inferno from 'inferno';
  import { tl } from 'utils/Translations'

  export default props =>
    <div className="Component">
      {tl('TRANSLATION_ID')}
    </div>
  ;
  ```
*/

const language =
  window.localStorage.getItem("lang") ||
  (window.navigator.userLanguage ||
    window.navigator.language ||
    window.navigator.browserLanguage ||
    window.navigator.systemLanguage)
    .split("-")[0]
    .toLowerCase();
const bank = {};

const setLanguage = lang => {
  window.localStorage.setItem("lang", lang.toLowerCase());
  window.location.reload();
};
const getLanguage = () => language;
const tl = (id, ...args) => {
  let str = bank[id];
  if (args) {
    args.forEach((arg, i) => {
      str = str.replace(new RegExp(`\\$${i + 1}`, "g"), arg);
    });
  }
  return str || id;
};
const use = translations => Object.assign(bank, translations);

export { setLanguage, getLanguage, tl, use };
