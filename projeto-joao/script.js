gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro.from('.topline > *', { y: -18, opacity: 0, duration: .65, stagger: .09 })
    .from('.hero-copy > *', { y: 35, opacity: 0, duration: .8, stagger: .1 }, '-=.25')
    .from('.orbit', { scale: .76, opacity: 0, duration: 1.15 }, '-=.85')
    .from('.satellite', { scale: .7, opacity: 0, stagger: .15, duration: .6 }, '-=.4');

  gsap.to('.orbit-lines', { rotation: 360, duration: 45, repeat: -1, ease: 'none' });
  gsap.to('.sat-a', { y: -10, duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  gsap.to('.sat-b', { y: 12, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  gsap.to('.pulse', { left: '86%', duration: 4, repeat: -1, ease: 'none' });

  document.querySelectorAll('.reveal:not(.hero)').forEach(section => {
    gsap.from(section, { scrollTrigger: { trigger: section, start: 'top 82%' }, y: 55, opacity: 0, duration: .9, ease: 'power3.out' });
  });

  const path = document.querySelector('.stroke');
  const length = path.getTotalLength();
  gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
  gsap.to(path, { scrollTrigger: { trigger: '.chart-card', start: 'top 80%' }, strokeDashoffset: 0, duration: 1.8, ease: 'power2.out' });
}

gsap.to({ value: 0 }, { value: 94.8, duration: reduceMotion ? 0 : 1.8, delay: reduceMotion ? 0 : .5, ease: 'power2.out', onUpdate() { document.querySelector('[data-count]').textContent = this.targets()[0].value.toFixed(1).replace('.', ','); } });

const clock = document.querySelector('.system b');
const updateClock = () => clock.textContent = new Date().toLocaleTimeString('pt-BR');
updateClock(); setInterval(updateClock, 1000);

const panel = document.querySelector('.command-panel');
const openCommand = () => { panel.setAttribute('aria-hidden', 'false'); gsap.to(panel, { autoAlpha: 1, y: 30, duration: .25 }); setTimeout(() => panel.querySelector('input').focus(), 250); };
const closeCommand = () => { panel.setAttribute('aria-hidden', 'true'); gsap.to(panel, { autoAlpha: 0, y: 0, duration: .2 }); };
document.querySelector('.command').addEventListener('click', openCommand);
panel.querySelector('button').addEventListener('click', closeCommand);
document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openCommand(); } if (e.key === 'Escape') closeCommand(); });

document.querySelector('.theme-dot').addEventListener('click', () => document.body.classList.toggle('high-glow'));
const API_URL = '/api';
const machineList = document.querySelector('[data-machine-list]');
const machineForm = document.querySelector('#machine-form');
const formStatus = machineForm.querySelector('.form-status');

function apiError(data, fallback) {
  if (Array.isArray(data?.detalhes) && data.detalhes.length) return data.detalhes.join('. ');
  return data?.erro || fallback;
}

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, options);
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new Error(apiError(data, `Erro HTTP ${response.status}`));
  return data;
}

function renderMachines(machines) {
  machineList.replaceChildren();
  machineList.setAttribute('aria-busy', 'false');
  if (!machines.length) {
    const empty = document.createElement('p');
    empty.className = 'api-message';
    empty.textContent = 'Nenhuma máquina cadastrada no banco de dados.';
    machineList.append(empty);
    return;
  }
  const line = document.createElement('div');
  line.className = 'line-path';
  machineList.append(line);
  machines.slice(0, 8).forEach((machine, index) => {
    const row = Math.floor(index / 4);
    const button = document.createElement('button');
    const isOperating = machine.status === 'Em operação';
    button.className = `machine ${isOperating ? 'active' : 'warning'}`;
    button.type = 'button';
    button.style.setProperty('--x', `${12 + (index % 4) * 25}%`);
    button.style.setProperty('--y', `${machines.length > 4 ? 28 + row * 44 : 50}%`);
    button.title = `${machine.nome} — ${machine.status}`;
    const indicator = document.createElement('i');
    const name = document.createElement('span');
    const detail = document.createElement('small');
    name.textContent = machine.nome;
    detail.textContent = machine.temperatura == null ? machine.status : `${Number(machine.temperatura).toLocaleString('pt-BR')}°C`;
    button.append(indicator, name, detail);
    machineList.append(button);
  });
  document.querySelector('.factory-top b').textContent = `${machines.length} NO BANCO`;
}

async function loadMachines() {
  machineList.setAttribute('aria-busy', 'true');
  try {
    renderMachines(await request('/maquinas'));
  } catch (error) {
    machineList.setAttribute('aria-busy', 'false');
    const message = document.createElement('p');
    message.className = 'api-message error';
    message.textContent = `Não foi possível carregar as máquinas: ${error.message}`;
    machineList.replaceChildren(message);
  }
}

machineForm.addEventListener('submit', async event => {
  event.preventDefault();
  const button = machineForm.querySelector('button[type="submit"]');
  const values = Object.fromEntries(new FormData(machineForm));
  const payload = { ...values, consumo_energia: values.consumo_energia || 0, temperatura: values.temperatura || null };
  button.disabled = true;
  button.textContent = 'Conectando...';
  formStatus.className = 'form-status loading';
  formStatus.textContent = 'Salvando no banco de dados...';
  try {
    const machine = await request('/maquinas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    machineForm.reset();
    machineForm.elements.consumo_energia.value = '0';
    formStatus.className = 'form-status success';
    formStatus.textContent = `${machine.nome} foi cadastrada e persistida com sucesso.`;
    await loadMachines();
    gsap.fromTo(button, { scale: .96 }, { scale: 1, duration: .35, ease: 'back.out(2)' });
  } catch (error) {
    formStatus.className = 'form-status error';
    formStatus.textContent = `Falha ao cadastrar: ${error.message}`;
  } finally {
    button.disabled = false;
    button.innerHTML = 'Conectar à rede <span>↗</span>';
  }
});

loadMachines();
