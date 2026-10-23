/** Persian copy + structure for the homepage. */

export type Service = {
  id: string;
  title: string;
  latin: string;
  description: string;
  icon: 'photo' | 'frame' | 'id';
};

export const services: Service[] = [
  {
    id: 'photo',
    title: 'چاپ عکس',
    latin: 'PHOTO PRINT',
    description:
      'چاپ عکس روی کاغذهای فوتوگرافیک مخصوص لابراتوار، با تنظیم دستی رنگ و امکان انتخاب سطح براق، ساتن یا مات.',
    icon: 'photo',
  },
  {
    id: 'frame',
    title: 'چاپ روی شاسی و قاب',
    latin: 'CANVAS & FRAME',
    description:
      'عکس روی شاسی ضخیم و قاب‌های چوبی و فلزی؛ آمادهٔ نصب روی دیوار، بدون نیاز به کار اضافه.',
    icon: 'frame',
  },
  {
    id: 'id',
    title: 'چاپ عکس پرسنلی',
    latin: 'ID PHOTO',
    description:
      'عکس پرسنلی استاندارد برای گذرنامه، ویزا، مدارک تحصیلی و استخدامی، با برش و پس‌زمینهٔ مطابق ضوابط.',
    icon: 'id',
  },
];

export type Product = {
  id: string;
  title: string;
  tag: string;
  description: string;
  image: string;
  serviceId: string;
};

export const products: Product[] = [
  {
    id: 'fine-art',
    title: 'چاپ عکس دیجیتال',
    tag: 'چاپ تک و مجموعه',
    description:
      'تصویر شما با کیفیت کامل و رنگ‌های واقعی چاپ می‌شود؛ مناسب قاب‌کردن، هدیه و آرشیو شخصی.',
    image: '/media/still-1600.jpg',
    serviceId: 'photo',
  },
  {
    id: 'framed-print',
    title: 'قاب و شاسی آمادهٔ نصب',
    tag: 'آمادهٔ دیوار',
    description:
      'چاپ روی شاسی یا داخل قاب، با حاشیهٔ سفید گالری‌وار و پرداخت تمیز؛ از تحویل تا نصب، یک قدم.',
    image: '/media/framed-1000.jpg',
    serviceId: 'frame',
  },
  {
    id: 'print-box',
    title: 'جعبه و مجموعهٔ چاپی',
    tag: 'مجموعهٔ هدیه',
    description:
      'چند چاپ انتخابی در یک جعبهٔ نگهدارنده، برای مرور و هدیه دادن؛ هر تصویر با حاشیهٔ یکسان.',
    image: '/media/boxed-1200.jpg',
    serviceId: 'photo',
  },
];

export const aboutPoints = [
  {
    title: 'کنترل رنگ و پرداخت دستی',
    text: 'هر فایل پیش از چاپ از نظر روشنایی، کنتراست و دمای رنگ بازبینی می‌شود تا نتیجه همان چیزی باشد که در تصویر دیده‌اید.',
  },
  {
    title: 'کاغذ و مواد مخصوص چاپ عکس',
    text: 'کاغذهای فوتوگرافیک و شاسی‌های مقاوم، با جوهر ماندگار؛ برای چاپ‌هایی که سال‌ها روی دیوار می‌مانند.',
  },
  {
    title: 'تحویل با دقت و بسته‌بندی محافظ',
    text: 'چاپ‌ها لای کاغذ محافظ و در بسته‌بندی سخت تحویل داده می‌شوند تا لبه‌ها و سطح چاپ سالم بماند.',
  },
];

export const navLinks: { href: string; label: string; latin: string }[] = [
  { href: '#home', label: 'خانه', latin: 'HOME' },
  { href: '#services', label: 'خدمات', latin: 'SERVICES' },
  { href: '#products', label: 'محصولات', latin: 'PRODUCTS' },
  { href: '#about', label: 'دربارهٔ ما', latin: 'ABOUT' },
  { href: '#order', label: 'سفارش و تماس', latin: 'ORDER' },
];

/** Chapters displayed over the scroll-scrubbed sequence. */
export const cinematicChapters = [
  {
    index: '01',
    title: 'لحظه‌ای که ثبت شد، شایستهٔ دیده‌شدن است.',
    text: 'از فایل تا چاپ: تصویر شما روی کاغذ مخصوص، با جزئیاتی که در نگاه اول دیده نمی‌شود.',
  },
  {
    index: '02',
    title: 'هر جزئیات، همان‌قدر که در قاب دیده شد.',
    text: 'کنترل رنگ، بافت کاغذ و لبه‌های تمیز؛ همان چیزی که در لابراتوار چاپ شکل می‌گیرد.',
  },
  {
    index: '03',
    title: 'از تصویر تا اثر؛ ماندگار روی دیوار.',
    text: 'چاپ، شاسی و قاب در یک مسیر پیوسته، تا عکس‌هایتان بخشی از فضای زندگی شوند.',
  },
];
