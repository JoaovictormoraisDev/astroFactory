gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

if(!reduced){gsap.timeline({defaults:{ease:'power3.out'}}).from('.nav>*',{y:-15,opacity:0,stagger:.08}).from('.hero-copy>*',{y:30,opacity:0,stagger:.09,duration:.7},'-.2').from('.scene-wrap',{scale:.88,opacity:0,duration:1},'-.7').from('.scene-label',{scale:.7,opacity:0,stagger:.12},'-.3');document.querySelectorAll('.section').forEach(s=>gsap.from(s.children,{scrollTrigger:{trigger:s,start:'top 78%'},y:45,opacity:0,stagger:.12,duration:.75,ease:'power3.out'}));gsap.to('.flower',{rotation:360,duration:24,repeat:-1,ease:'none'});gsap.to('.rings',{rotation:-360,duration:35,repeat:-1,ease:'none'});}
gsap.to({n:0},{n:1248,duration:reduced?0:1.7,delay:.7,ease:'power2.out',onUpdate(){document.querySelector('[data-value]').textContent=Math.round(this.targets()[0].n).toLocaleString('pt-BR')}});
addEventListener('pointermove',e=>gsap.to('.cursor-glow',{x:e.clientX,y:e.clientY,duration:.6}));
const API_URL = '/api';
const machineForm = document.querySelector('#machine-form');
const machineCard = document.querySelector('.machine-list');
const formStatus = machineForm.querySelector('.form-status');
const toast = document.querySelector('.toast');

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

function showToast(message, failed = false) {
  toast.textContent = message;
  toast.classList.toggle('error', failed);
  gsap.killTweensOf(toast);
  gsap.fromTo(toast, { y: 90 }, { y: 0, duration: .45, ease: 'back.out(1.6)', onComplete: () => gsap.to(toast, { y: 90, delay: 2.8 }) });
}

function renderMachines(machines) {
  machineCard.querySelectorAll('.machine-row, .api-message').forEach(element => element.remove());
  machineCard.setAttribute('aria-busy', 'false');
  if (!machines.length) {
    const empty = document.createElement('p');
    empty.className = 'api-message';
    empty.textContent = 'Nenhuma máquina cadastrada no banco de dados.';
    machineCard.append(empty);
    return;
  }
  machines.slice(0, 6).forEach((machine, index) => {
    const row = document.createElement('div');
    row.className = 'machine-row';
    const icon = document.createElement('span');
    icon.className = `machine-icon ${['cobalt', 'coral', 'green'][index % 3]}`;
    icon.textContent = machine.nome.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase();
    const description = document.createElement('p');
    const name = document.createElement('b');
    const details = document.createElement('small');
    name.textContent = machine.nome;
    details.textContent = `${machine.setor} · ${machine.tipo}`;
    description.append(name, details);
    const status = document.createElement('em');
    status.className = machine.status === 'Em operação' ? 'online' : 'attention';
    status.textContent = machine.status;
    const temperature = document.createElement('strong');
    temperature.textContent = machine.temperatura == null ? '—' : `${Number(machine.temperatura).toLocaleString('pt-BR')}°C`;
    row.append(icon, description, status, temperature);
    machineCard.append(row);
  });
  const health = machines.filter(machine => machine.status === 'Em operação').length / machines.length * 100;
  document.querySelector('.label-a b').textContent = `${health.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
}

async function loadMachines() {
  machineCard.setAttribute('aria-busy', 'true');
  try {
    renderMachines(await request('/maquinas'));
  } catch (error) {
    machineCard.setAttribute('aria-busy', 'false');
    machineCard.querySelectorAll('.machine-row, .api-message').forEach(element => element.remove());
    const message = document.createElement('p');
    message.className = 'api-message error';
    message.textContent = `Não foi possível carregar as máquinas: ${error.message}`;
    machineCard.append(message);
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
    showToast('Máquina conectada com sucesso ✓');
    await loadMachines();
  } catch (error) {
    formStatus.className = 'form-status error';
    formStatus.textContent = `Falha ao cadastrar: ${error.message}`;
    showToast('Não foi possível conectar a máquina', true);
  } finally {
    button.disabled = false;
    button.innerHTML = 'Conectar máquina <span>↗</span>';
  }
});

loadMachines();
