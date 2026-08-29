const form = document.querySelector('#waitlist-form');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = document.querySelector('#form-status');
  const button = form.querySelector('button');
  if (status) status.textContent = 'Thanks — your note is saved locally for this demo. Nothing was submitted.';
  if (button) button.innerHTML = 'Preview requested <span aria-hidden="true">✓</span>';
});
