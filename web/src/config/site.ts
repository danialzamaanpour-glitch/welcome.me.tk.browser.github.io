/**
 * Business details live here so real information can be dropped in later
 * without touching any component. Anything left as an empty string is
 * rendered as a clearly marked placeholder instead of invented data.
 */
export const siteConfig = {
  brand: {
    fa: 'دانیال چپ',
    latin: 'DANIAL CHAP',
    tagline: 'لابراتوار چاپ دیجیتال',
  },
  /** Fill these in to replace the placeholders across the site. */
  contact: {
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    instagram: '',
    telegram: '',
  },
  /** Shown as the working-hours line in the footer. */
  hours: '',
};

export type ContactKey = keyof typeof siteConfig.contact;

export const hasContact = (key: ContactKey) => Boolean(siteConfig.contact[key].trim());
