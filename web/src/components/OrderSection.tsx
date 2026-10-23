import { useEffect, useRef, useState, type FormEvent } from 'react';
import { services } from '../data/content';
import { siteConfig, hasContact } from '../config/site';
import { ORDER_EVENT } from '../lib/order';
import { IconAlert, IconArrow, IconCheck } from './Icons';
import Reveal from './Reveal';

type Values = {
  name: string;
  phone: string;
  service: string;
  size: string;
  notes: string;
};

type Errors = Partial<Record<keyof Values, string>>;

type Status = 'idle' | 'sending' | 'success' | 'error';

const SERVICE_OPTIONS = [...services.map((service) => service.title), 'سایر / مشاوره'];

const EMPTY_VALUES: Values = {
  name: '',
  phone: '',
  service: services[0].title,
  size: '',
  notes: '',
};

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

function normalizeDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit)));
}

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 3) {
    errors.name = 'نام خود را کامل وارد کنید.';
  }

  const digits = normalizeDigits(values.phone).replace(/[^\d]/g, '');
  if (digits.length < 10 || digits.length > 13) {
    errors.phone = 'شمارهٔ تماس معتبر وارد کنید؛ مثلاً ۰۹۱۲۳۴۵۶۷۸۹.';
  }

  if (!values.service) {
    errors.service = 'نوع سفارش را انتخاب کنید.';
  }

  return errors;
}

export default function OrderSection() {
  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [reference, setReference] = useState('');
  const [failure, setFailure] = useState('');
  const nameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const onRequest = (event: Event) => {
      const detail = (event as CustomEvent<{ service?: string }>).detail;
      setStatus((current) => (current === 'sending' ? current : 'idle'));
      if (detail?.service && SERVICE_OPTIONS.includes(detail.service)) {
        setValues((current) => ({ ...current, service: detail.service as string }));
      }
      window.setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 550);
    };

    window.addEventListener(ORDER_EVENT, onRequest);
    return () => window.removeEventListener(ORDER_EVENT, onRequest);
  }, []);

  const update = (key: keyof Values) => (value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending') return;

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus('idle');
      return;
    }

    setStatus('sending');
    setFailure('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          phone: normalizeDigits(values.phone).trim(),
          service: values.service,
          size: values.size.trim(),
          notes: values.notes.trim(),
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { reference?: string; error?: string }
        | null;

      if (!response.ok || !data?.reference) {
        throw new Error(data?.error || 'خطا در ثبت درخواست');
      }

      setReference(data.reference);
      setStatus('success');
      setValues({ ...EMPTY_VALUES, service: values.service });
    } catch (error) {
      setFailure(error instanceof Error ? error.message : 'خطای نامشخص');
      setStatus('error');
    }
  };

  return (
    <section className="order" id="order">
      <div className="container order__grid">
        <Reveal className="order__intro">
          <span className="eyebrow" dir="ltr">
            Order &amp; contact
          </span>
          <h2 className="display">سفارش چاپ را از همین‌جا شروع کنید</h2>
          <p className="lede">
            ابعاد، نوع کاغذ یا قاب و توضیح کوتاهی از تصویرتان را بنویسید. درخواست شما
            ثبت می‌شود و برای هماهنگی نهایی با شما تماس می‌گیریم.
          </p>

          <dl className="order__contact">
            <div className="order__contact-row">
              <dt>تلفن</dt>
              <dd className={hasContact('phone') ? '' : 'is-placeholder'}>
                {hasContact('phone') ? siteConfig.contact.phone : 'به‌زودی در همین بخش درج می‌شود'}
              </dd>
            </div>
            <div className="order__contact-row">
              <dt>ایمیل</dt>
              <dd className={hasContact('email') ? '' : 'is-placeholder'}>
                {hasContact('email') ? siteConfig.contact.email : 'به‌زودی در همین بخش درج می‌شود'}
              </dd>
            </div>
            <div className="order__contact-row">
              <dt>نشانی</dt>
              <dd className={hasContact('address') ? '' : 'is-placeholder'}>
                {hasContact('address') ? siteConfig.contact.address : 'به‌زودی در همین بخش درج می‌شود'}
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal className="order-card" delay={1}>
          <form className="form-grid" onSubmit={handleSubmit} noValidate>
            <div className={`field ${errors.name ? 'has-error' : ''}`}>
              <label htmlFor="order-name">نام و نام خانوادگی</label>
              <input
                id="order-name"
                ref={nameRef}
                type="text"
                autoComplete="name"
                placeholder="مثلاً سارا احمدی"
                value={values.name}
                onChange={(event) => update('name')(event.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'order-name-error' : undefined}
              />
              {errors.name && (
                <span className="field__error" id="order-name-error">
                  {errors.name}
                </span>
              )}
            </div>

            <div className={`field ${errors.phone ? 'has-error' : ''}`}>
              <label htmlFor="order-phone">شمارهٔ تماس</label>
              <input
                id="order-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
                placeholder="09xxxxxxxxx"
                value={values.phone}
                onChange={(event) => update('phone')(event.target.value)}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? 'order-phone-error' : undefined}
              />
              {errors.phone && (
                <span className="field__error" id="order-phone-error">
                  {errors.phone}
                </span>
              )}
            </div>

            <div className={`field ${errors.service ? 'has-error' : ''}`}>
              <label htmlFor="order-service">نوع سفارش</label>
              <select
                id="order-service"
                value={values.service}
                onChange={(event) => update('service')(event.target.value)}
              >
                {SERVICE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.service && <span className="field__error">{errors.service}</span>}
            </div>

            <div className="field">
              <label htmlFor="order-size">ابعاد و مشخصات</label>
              <input
                id="order-size"
                type="text"
                placeholder="مثلاً ۳۰×۴۰ سانتی‌متر، کاغذ مات"
                value={values.size}
                onChange={(event) => update('size')(event.target.value)}
              />
            </div>

            <div className="field field--full">
              <label htmlFor="order-notes">توضیحات</label>
              <textarea
                id="order-notes"
                rows={3}
                placeholder="تعداد چاپ، نوع کاغذ یا قاب، زمان تحویل مورد نظر…"
                value={values.notes}
                onChange={(event) => update('notes')(event.target.value)}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
                {status === 'sending' ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    در حال ارسال…
                  </>
                ) : (
                  <>
                    ارسال درخواست چاپ
                    <IconArrow />
                  </>
                )}
              </button>
              <p className="form-note">
                ارسال فرم فقط یک درخواست است؛ سفارش پس از تأیید ابعاد و قیمت نهایی می‌شود.
              </p>
            </div>
          </form>

          {status === 'success' && (
            <div className="form-feedback form-feedback--success" role="status">
              <IconCheck />
              <div>
                <strong>درخواست شما ثبت شد.</strong>
                کد پیگیری: <code>{reference}</code>
                <br />
                برای هماهنگی نهایی با شما تماس می‌گیریم.
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="form-feedback form-feedback--error" role="alert">
              <IconAlert />
              <div>
                <strong>ارسال درخواست انجام نشد.</strong>
                {failure === 'خطا در ثبت درخواست'
                  ? 'ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.'
                  : failure}
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
