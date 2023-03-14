import translations from './translations';


export default function customTranslate(template: any, replacements: any) {
  replacements = replacements || {};

  // Translate
  template = translations[template] || template;

  // Replace
  return template.replace(/{([^}]+)}/g, function (_: any, key: any) {
    console.log(key)
    return replacements[key] || '{' + key + '}';
  });
}
