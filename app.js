(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* шапка */
  const top = $('#top');
  const mcta = document.querySelector('.mobile-cta');
  const onScroll = () => {
    top.classList.toggle('is-scrolled', window.scrollY > 8);
    if (mcta) mcta.classList.toggle('is-on', window.scrollY > 420);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* появление блоков */
  const items = $$('.sec__head, .compare, .project, .packs, .calc__panel, .calc__intro, .steps, .inout__col, .faq, .final__copy, .form');
  items.forEach((el) => el.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('is-in'));
  }

  /* калькулятор */
  const area = $('#area');
  const areaOut = $('#areaOut');
  const pack = $('#pack');
  const terrace = $('#terrace');
  const pile = $('#pile');
  const total = $('#total');
  const term = $('#term');
  const fmt = (n) => new Intl.NumberFormat('ru-RU').format(Math.round(n / 1000) * 1000) + ' ₽';

  const calc = () => {
    const a = Number(area.value);
    const p = Number(pack.value);
    let sum = a * p;
    if (terrace.checked) sum += 12 * 45000;
    sum += pile.checked ? 180000 : 420000;
    areaOut.textContent = a + ' м²';
    area.style.setProperty('--p', ((a - 40) / 80 * 100) + '%');
    total.textContent = fmt(sum);
    const days = a <= 50 ? 35 : a <= 80 ? 45 : 50;
    term.textContent = `срок ${days} дней · монтаж 3 дня`;
  };
  if (area) {
    ['input', 'change'].forEach((ev) => {
      area.addEventListener(ev, calc);
      pack.addEventListener(ev, calc);
      terrace.addEventListener(ev, calc);
      pile.addEventListener(ev, calc);
    });
    calc();
  }

  /* перенос площади в форму */
  const areaSel = $('#areaSel');
  $('#calcCta')?.addEventListener('click', () => {
    const a = Number(area.value);
    areaSel.value = a <= 50 ? 'до 50 м²' : a <= 80 ? '50–80 м²' : a <= 100 ? '80–100 м²' : 'больше 100 м²';
  });

  /* маска телефона */
  const phone = $('#phone');
  phone?.addEventListener('input', () => {
    let d = phone.value.replace(/\D/g, '');
    if (d.startsWith('8')) d = '7' + d.slice(1);
    if (!d.startsWith('7')) d = '7' + d;
    d = d.slice(0, 11);
    let out = '+7';
    if (d.length > 1) out += ' ' + d.slice(1, 4);
    if (d.length >= 5) out += ' ' + d.slice(4, 7);
    if (d.length >= 8) out += '-' + d.slice(7, 9);
    if (d.length >= 10) out += '-' + d.slice(9, 11);
    phone.value = out;
  });

  /* форма */
  const form = $('#leadForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#name');
    const consent = $('#consent');
    const note = $('#formNote');
    let ok = true;
    [[name, name.value.trim().length >= 2], [phone, phone.value.replace(/\D/g, '').length === 11], [consent, consent.checked]].forEach(([el, valid]) => {
      el.style.borderColor = valid ? '' : '#C0392B';
      if (!valid) ok = false;
    });
    if (!ok) {
      note.textContent = 'Проверьте имя, телефон и согласие на обработку данных.';
      note.style.color = '#C0392B';
      return;
    }
    note.textContent = 'Спасибо! Это демо-макет: в реальном сайте заявка ушла бы менеджеру, и мы бы перезвонили в рабочее время.';
    note.style.color = '';
    form.classList.add('is-sent');
    form.querySelector('button[type=submit]').textContent = 'Заявка отправлена';
    form.querySelector('button[type=submit]').disabled = true;
  });

  /* аккордеон: открыт один */
  $$('.faq details').forEach((d) => {
    d.addEventListener('toggle', () => {
      if (d.open) $$('.faq details').forEach((o) => { if (o !== d) o.open = false; });
    });
  });
})();
