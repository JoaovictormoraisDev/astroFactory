(() => {
  const hub = document.querySelector('.integration-hub');
  if (!hub) return;
  const api = async (path, options = {}) => {
    const response = await fetch(`/api${path}`, options);
    const data = response.status === 204 ? null : await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.detalhes?.join('. ') || data.erro || `Erro HTTP ${response.status}`);
    return data;
  };
  const jsonOptions = (method, body) => ({ method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const dateValue = value => String(value || '').slice(0, 10);
  let machines = [];

  async function refresh() {
    try {
      const [m, p, o] = await Promise.all([api('/maquinas'), api('/producoes'), api('/ocorrencias')]);
      machines = m; renderMachines(m); renderProductions(p); renderOccurrences(o); renderMetrics(m, p, o);
      const select = document.querySelector('#production-form [name=maquina_id]');
      select.innerHTML = '<option value="">Selecione</option>' + m.map(x => `<option value="${x.id}">${escapeHtml(x.nome)}</option>`).join('');
    } catch (error) { document.querySelector('[data-global-feedback]').textContent = `Falha na integração: ${error.message}`; }
  }
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function renderMetrics(m, p, o) {
    const total = p.reduce((sum, x) => sum + Number(x.quantidade_produzida), 0);
    const avg = p.length ? p.reduce((sum, x) => sum + Number(x.produtividade), 0) / p.length : 0;
    document.querySelector('[data-kpi=machines]').textContent = m.length;
    document.querySelector('[data-kpi=operating]').textContent = m.filter(x => x.status === 'Em operação').length;
    document.querySelector('[data-kpi=production]').textContent = total.toLocaleString('pt-BR');
    document.querySelector('[data-kpi=risk]').textContent = o.filter(x => ['Alto','Crítico'].includes(x.nivel_risco)).length;
    document.querySelector('[data-kpi=productivity]').textContent = `${avg.toLocaleString('pt-BR',{maximumFractionDigits:1})}%`;
  }
  function renderMachines(items) {
    document.querySelector('[data-machine-table]').innerHTML = items.map(x => `<tr><td>${escapeHtml(x.nome)}</td><td>${escapeHtml(x.setor)}</td><td>${escapeHtml(x.status)}</td><td>${Number(x.consumo_energia).toLocaleString('pt-BR')} kWh</td><td class="row-actions"><button data-edit-machine="${x.id}">Editar</button><button class="danger" data-delete-machine="${x.id}">Excluir</button></td></tr>`).join('') || '<tr><td colspan="5">Nenhuma máquina cadastrada.</td></tr>';
  }
  function renderProductions(items) {
    document.querySelector('[data-production-table]').innerHTML = items.map(x => `<tr><td>${escapeHtml(x.produto)}</td><td>${escapeHtml(x.maquina_nome)}</td><td>${x.quantidade_produzida}/${x.quantidade_esperada}</td><td>${Number(x.produtividade).toLocaleString('pt-BR')}%</td><td class="row-actions"><button class="danger" data-delete-production="${x.id}">Excluir</button></td></tr>`).join('') || '<tr><td colspan="5">Nenhuma produção cadastrada.</td></tr>';
  }
  function renderOccurrences(items) {
    document.querySelector('[data-occurrence-table]').innerHTML = items.map(x => `<tr><td>${escapeHtml(x.tipo)}</td><td>${escapeHtml(x.local)}</td><td class="risk risk-${escapeHtml(x.nivel_risco)}">${escapeHtml(x.nivel_risco)}</td><td>${dateValue(x.data).split('-').reverse().join('/')}</td><td>${escapeHtml(x.medida_preventiva)}</td><td class="row-actions"><button class="danger" data-delete-occurrence="${x.id}">Excluir</button></td></tr>`).join('') || '<tr><td colspan="6">Nenhuma ocorrência registrada.</td></tr>';
  }
  document.querySelector('#production-form').addEventListener('submit', async event => {
    event.preventDefault(); const form = event.currentTarget; const feedback = form.querySelector('.form-feedback');
    try { await api('/producoes', jsonOptions('POST', Object.fromEntries(new FormData(form)))); form.reset(); feedback.textContent = 'Produção registrada com sucesso.'; await refresh(); }
    catch (error) { feedback.textContent = error.message; }
  });
  document.querySelector('#occurrence-form').addEventListener('submit', async event => {
    event.preventDefault(); const form = event.currentTarget; const feedback = form.querySelector('.form-feedback');
    try { await api('/ocorrencias', jsonOptions('POST', Object.fromEntries(new FormData(form)))); form.reset(); form.elements.data.valueAsDate = new Date(); feedback.textContent = 'Ocorrência registrada com sucesso.'; await refresh(); }
    catch (error) { feedback.textContent = error.message; }
  });
  hub.addEventListener('click', async event => {
    const button = event.target.closest('button'); if (!button) return;
    try {
      if (button.dataset.deleteMachine && confirm('Excluir esta máquina?')) await api(`/maquinas/${button.dataset.deleteMachine}`, { method:'DELETE' });
      if (button.dataset.deleteProduction && confirm('Excluir esta produção?')) await api(`/producoes/${button.dataset.deleteProduction}`, { method:'DELETE' });
      if (button.dataset.deleteOccurrence && confirm('Excluir esta ocorrência?')) await api(`/ocorrencias/${button.dataset.deleteOccurrence}`, { method:'DELETE' });
      if (button.dataset.editMachine) {
        const current = machines.find(x => String(x.id) === button.dataset.editMachine);
        const nome = prompt('Nome da máquina:', current.nome); if (nome === null) return;
        const status = prompt('Status (Em operação, Em manutenção, Parada ou Desativada):', current.status); if (status === null) return;
        await api(`/maquinas/${current.id}`, jsonOptions('PUT', { ...current, nome, status }));
      }
      await refresh();
      if (typeof loadMachines === 'function') loadMachines();
    } catch (error) { document.querySelector('[data-global-feedback]').textContent = error.message; }
  });
  document.querySelectorAll('input[type=date]').forEach(x => { if (!x.value) x.valueAsDate = new Date(); });
  refresh();
})();
