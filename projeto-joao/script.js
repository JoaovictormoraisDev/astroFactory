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
document.querySelector('form').addEventListener('submit', e => { e.preventDefault(); const button = e.currentTarget.querySelector('button'); button.innerHTML = 'Máquina conectada <span>✓</span>'; gsap.fromTo(button, { scale: .96 }, { scale: 1, duration: .35, ease: 'back.out(2)' }); });
