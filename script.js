(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  let language = 'es';
  const languageOverlay = $('#languageOverlay');
  const bookingOverlay = $('#bookingOverlay');
  const translate = (lang) => {
    language = lang;
    document.documentElement.lang = lang;
    $$('[data-es][data-en]').forEach((el) => { el.textContent = el.dataset[lang]; });
    $('#languageSwitch').textContent = lang === 'es' ? 'ES / EN' : 'EN / ES';
    const guestSelects = [$('#quickGuests'), $('#guests')];
    guestSelects.forEach((select) => {
      [...select.options].forEach((option) => {
        const count = Number(option.value);
        option.textContent = lang === 'es' ? `${count} ${count === 1 ? 'huésped' : 'huéspedes'}` : `${count} ${count === 1 ? 'guest' : 'guests'}`;
      });
    });
  };
  const openBooking = (stay) => {
    if (stay) $('#accommodation').value = stay;
    bookingOverlay.classList.add('show');
    document.body.classList.add('modal-open');
  };
  const closeBooking = () => {
    bookingOverlay.classList.remove('show');
    document.body.classList.remove('modal-open');
  };
  $('#languageSwitch').addEventListener('click', () => translate(language === 'es' ? 'en' : 'es'));
  $$('[data-language]').forEach((button) => button.addEventListener('click', () => {
    translate(button.dataset.language);
    languageOverlay.classList.remove('show');
    sessionStorage.setItem('bigday-language-selected', '1');
  }));
  if (!sessionStorage.getItem('bigday-language-selected')) languageOverlay.classList.add('show');
  $$('[data-open-booking]').forEach((button) => button.addEventListener('click', () => openBooking(button.dataset.stay)));
  $('#closeBooking').addEventListener('click', closeBooking);
  bookingOverlay.addEventListener('click', (event) => { if (event.target === bookingOverlay) closeBooking(); });
  $('#menuToggle').addEventListener('click', () => {
    const nav = $('#mainNav');
    nav.classList.toggle('open');
    $('#menuToggle').setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
  });
  $$('#mainNav a').forEach((link) => link.addEventListener('click', () => $('#mainNav').classList.remove('open')));
  const today = new Date();
  const iso = (date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate()+1);
  ['quickCheckin','checkin'].forEach((id) => { const el = document.getElementById(id); el.min = iso(today); });
  ['quickCheckout','checkout'].forEach((id) => { const el = document.getElementById(id); el.min = iso(tomorrow); });
  const syncDates = (fromIn, fromOut) => {
    const checkin = document.getElementById(fromIn).value;
    const checkout = document.getElementById(fromOut).value;
    if (checkin) {
      const next = new Date(`${checkin}T12:00:00`); next.setDate(next.getDate()+1);
      const out = document.getElementById(fromOut); out.min = iso(next);
      if (checkout && checkout <= checkin) out.value = iso(next);
    }
  };
  $('#quickCheckin').addEventListener('change', () => syncDates('quickCheckin','quickCheckout'));
  $('#checkin').addEventListener('change', () => syncDates('checkin','checkout'));
  $('#quickSearch').addEventListener('submit', (event) => {
    event.preventDefault();
    $('#checkin').value = $('#quickCheckin').value;
    $('#checkout').value = $('#quickCheckout').value;
    $('#guests').value = $('#quickGuests').value;
    openBooking();
  });
  $('#bookingForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = {
      entrada: $('#checkin').value,
      salida: $('#checkout').value,
      huespedes: $('#guests').value,
      alojamiento: $('#accommodation').value,
      nombre: $('#guestName').value.trim(),
      correo: $('#guestEmail').value.trim(),
      telefono: $('#guestPhone').value.trim()
    };
    if (fields.salida <= fields.entrada) {
      alert(language === 'es' ? 'La fecha de salida debe ser posterior a la fecha de entrada.' : 'Check-out must be after check-in.');
      return;
    }
    const subject = encodeURIComponent(language === 'es' ? 'Solicitud de reserva - Big Day Hotels' : 'Booking request - Big Day Hotels');
    const body = encodeURIComponent(`${language === 'es' ? 'Solicitud de reserva' : 'Booking request'}\n\n${Object.entries(fields).map(([key,value]) => `${key}: ${value}`).join('\n')}\n\n${language === 'es' ? 'Esta solicitud está pendiente de confirmación por parte del hotel.' : 'This request is pending confirmation by the hotel.'}`);
    window.location.href = `mailto:reservas@bigdayhotels.co?subject=${subject}&body=${body}`;
    $('#formMessage').textContent = language === 'es' ? 'Se abrirá tu correo para enviar la solicitud al hotel. La reserva queda pendiente de confirmación.' : 'Your email app will open to send the request. The booking remains pending confirmation.';
  });
})();
