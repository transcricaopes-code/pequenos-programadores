(() => {
  'use strict';
  const STORE_KEY = 'pequenosProgramadoresModulo1_v1';
  const defaultState = { name: 'programador', completed: {}, quizzes: {}, steps: { aula1: 0, aula2: 0 }, moduleDone: false, characterName: '', storyPlace: '', storyMission: '', projectTitle: '', projectDescription: '' };
  let state = loadState();
  let currentView = 'inicio';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function loadState() {
    try { return { ...defaultState, ...JSON.parse(localStorage.getItem(STORE_KEY) || '{}') }; }
    catch { return { ...defaultState }; }
  }
  function saveState() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
    catch { showToast('Não foi possível salvar neste navegador.'); }
    updateProgress();
  }
  function showToast(message) {
    const toast = $('#toast'); toast.textContent = message; toast.classList.add('show');
    window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2400);
  }
  function updateName() {
    const name = (state.name || 'programador').trim();
    $('#heroName').textContent = name;
    $('#nameButton').textContent = name.charAt(0).toUpperCase() || 'P';
    $('#certificateName').textContent = name === 'programador' ? 'Pequeno Programador' : name;
  }
  function taskCount() { return Object.values(state.completed).filter(Boolean).length; }
  function updateProgress() {
    const total = 13;
    const done = Math.min(taskCount(), total);
    const pct = Math.round(done / total * 100);
    $('#overallPercent').textContent = pct + '%';
    $('#overallProgress').style.width = pct + '%';
    const lesson1Done = ['l1mini'].every(k => !!state.completed[k]) && ['q1','q2','q3','q4'].every(k => state.quizzes[k] === 'correct');
    const lesson2Done = ['l2costume','l2click'].every(k => !!state.completed[k]) && state.quizzes.q5 === 'correct';
    setStatus('aula1', lesson1Done, 'COMEÇAR');
    setStatus('aula2', lesson1Done && lesson2Done, lesson1Done ? 'COMEÇAR' : 'BLOQUEADA');
    setStatus('missao', !!state.moduleDone, lesson2Done ? 'COMEÇAR' : 'BLOQUEADA');
    const l1 = ['l1mini'].filter(k => state.completed[k]).length + ['q1','q2','q3','q4'].filter(k => state.quizzes[k] === 'correct').length;
    const l2 = ['l2costume','l2click'].filter(k => state.completed[k]).length + (state.quizzes.q5 === 'correct' ? 1 : 0);
    $('#lesson1ProgressLabel').textContent = `${l1} de 5 itens`;
    $('#lesson2ProgressLabel').textContent = `${l2} de 3 itens`;
    $('#certificate').classList.toggle('hidden', !state.moduleDone);
    $('#projectTitle').value = state.projectTitle || '';
    $('#projectDescription').value = state.projectDescription || '';
  }
  function setStatus(id, done, lockedLabel) {
    const el = $('#status-' + id); if (!el) return;
    el.textContent = done ? 'CONCLUÍDA' : lockedLabel;
    el.classList.toggle('done', done);
  }
  function syncControls() {
    $$('[data-task]').forEach(input => { input.checked = !!state.completed[input.dataset.task]; });
    $$('[data-quiz]').forEach(group => {
      const key = group.dataset.quiz; const selected = state.quizzes[key];
      $$('.quiz-option', group).forEach(button => {
        button.disabled = !!selected;
        if (selected && button.dataset.answer === selected && selected === 'correct') button.classList.add('correct-selected');
      });
      const feedback = $('#feedback-' + key);
      if (feedback && selected) { feedback.textContent = 'Muito bem! Resposta correta.'; feedback.className = 'feedback good'; }
    });
    $('#characterName').value = state.characterName || '';
    $('#storyPlace').value = state.storyPlace || '';
    $('#storyMission').value = state.storyMission || '';
    updateName(); updateProgress();
  }
  function navigate(view) {
    if (!$('#view-' + view)) return;
    if (view === 'aula2' && !canOpenLesson2()) { showToast('Complete a Aula 1 para liberar esta etapa.'); view = 'aula1'; }
    if (view === 'missao' && !canOpenMission()) { showToast('Conclua as atividades das duas aulas para liberar a missão.'); view = canOpenLesson2() ? 'aula2' : 'aula1'; }
    currentView = view;
    $$('.view').forEach(el => el.classList.remove('active-view'));
    $('#view-' + view).classList.add('active-view');
    $$('.nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.view === view));
    const labels = { inicio: 'INÍCIO', aula1: 'AULA 1', aula2: 'AULA 2', missao: 'GRANDE MISSÃO', responsavel: 'GUIA DO RESPONSÁVEL' };
    $('#crumbCurrent').textContent = labels[view];
    $('#sidebar').classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'aula1') showStep('aula1', state.steps.aula1 || 0);
    if (view === 'aula2') showStep('aula2', state.steps.aula2 || 0);
  }
  function canOpenLesson2() {
    return ['l1mini'].every(k => !!state.completed[k]) && ['q1','q2','q3','q4'].every(k => state.quizzes[k] === 'correct');
  }
  function canOpenMission() {
    return canOpenLesson2() && ['l2costume','l2click'].every(k => !!state.completed[k]) && state.quizzes.q5 === 'correct';
  }
  function showStep(lesson, step) {
    const max = lesson === 'aula1' ? 4 : 3; step = Math.max(0, Math.min(max - 1, step));
    state.steps[lesson] = step; saveState();
    const view = $('#view-' + lesson);
    $$(`[data-step-panel]`, view).forEach(panel => panel.classList.toggle('active-step', Number(panel.dataset.stepPanel) === step));
    const stepper = $('#stepper' + (lesson === 'aula1' ? '1' : '2'));
    $$('.step-dot', stepper).forEach(dot => {
      const n = Number(dot.dataset.step); dot.classList.toggle('current', n === step); dot.classList.toggle('done', n < step);
    });
    const index = lesson === 'aula1' ? '1' : '2';
    $('#lesson' + index + 'Prev').disabled = step === 0;
    $('#lesson' + index + 'Next').textContent = step === max - 1 ? 'Concluir aula ✓' : 'Próxima etapa →';
    $('#lesson' + index + 'StepText').textContent = `Etapa ${step + 1} de ${max}`;
  }
  function advance(lesson, direction) {
    const max = lesson === 'aula1' ? 4 : 3; const current = state.steps[lesson] || 0;
    if (direction > 0 && current === max - 1) {
      if (lesson === 'aula1' && !canOpenLesson2()) { showToast('Responda aos desafios e marque a mini missão para concluir a aula.'); return; }
      if (lesson === 'aula2' && !canOpenMission()) { showToast('Complete os desafios e marque as duas mini missões.'); return; }
      showToast(lesson === 'aula1' ? 'Aula 1 concluída! A Aula 2 está liberada.' : 'Aula 2 concluída! A grande missão está liberada.');
      navigate(lesson === 'aula1' ? 'aula2' : 'missao'); return;
    }
    showStep(lesson, current + direction);
  }
  function handleQuiz(button) {
    const group = button.closest('[data-quiz]'); const key = group.dataset.quiz;
    if (state.quizzes[key]) return;
    const correct = button.dataset.answer === 'correct';
    if (correct) {
      state.quizzes[key] = 'correct';
      $$('.quiz-option', group).forEach(b => { b.disabled = true; if (b === button) b.classList.add('correct-selected'); });
      const feedback = $('#feedback-' + key); feedback.textContent = 'Muito bem! Você acertou. Continue investigando!'; feedback.className = 'feedback good';
      showToast('Resposta correta! +1 conquista de aprendizagem');
    } else {
      button.classList.add('wrong-selected');
      const feedback = $('#feedback-' + key); feedback.textContent = 'Ainda não. Pense mais um pouco e tente outra opção.'; feedback.className = 'feedback try';
      window.setTimeout(() => button.classList.remove('wrong-selected'), 700);
    }
    saveState();
  }

  $$('.nav-item').forEach(button => button.addEventListener('click', () => navigate(button.dataset.view)));
  $$('[data-go]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.go)));
  $('#menuToggle').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
  $('#nameButton').addEventListener('click', () => {
    const value = window.prompt('Como você quer ser chamado no curso?', state.name === 'programador' ? '' : state.name);
    if (value !== null && value.trim()) { state.name = value.trim().slice(0, 24); saveState(); updateName(); showToast('Nome atualizado!'); }
  });
  $('#lesson1Prev').addEventListener('click', () => advance('aula1', -1));
  $('#lesson1Next').addEventListener('click', () => advance('aula1', 1));
  $('#lesson2Prev').addEventListener('click', () => advance('aula2', -1));
  $('#lesson2Next').addEventListener('click', () => advance('aula2', 1));
  $$('#stepper1 .step-dot').forEach(dot => dot.addEventListener('click', () => showStep('aula1', Number(dot.dataset.step))));
  $$('#stepper2 .step-dot').forEach(dot => dot.addEventListener('click', () => showStep('aula2', Number(dot.dataset.step))));
  $$('.quiz-option').forEach(button => button.addEventListener('click', () => handleQuiz(button)));
  $$('[data-task]').forEach(input => input.addEventListener('change', () => {
    state.completed[input.dataset.task] = input.checked; saveState();
    if (input.checked) showToast('Atividade registrada!');
  }));
  [['characterName','characterName'],['storyPlace','storyPlace'],['storyMission','storyMission'],['projectTitle','projectTitle'],['projectDescription','projectDescription']].forEach(([id,key]) => {
    $('#' + id).addEventListener('input', e => { state[key] = e.target.value; saveState(); });
  });
  $('#finishModule').addEventListener('click', () => {
    const required = ['finalActor','finalBackdrop','finalMove','finalSay','finalInteraction'];
    const missing = required.filter(key => !state.completed[key]);
    const feedback = $('#finalFeedback');
    if (missing.length) { feedback.textContent = `Antes de concluir, marque os itens que você já colocou no projeto. Faltam ${missing.length} item(ns) obrigatório(s).`; feedback.className = 'feedback try'; return; }
    state.moduleDone = true; saveState(); feedback.textContent = 'Parabéns! Seu Módulo 1 foi concluído.'; feedback.className = 'feedback good';
    $('#certificate').classList.remove('hidden'); $('#certificate').scrollIntoView({ behavior: 'smooth', block: 'center' }); showToast('Módulo concluído! Conquista desbloqueada.');
  });
  $('#resetProgress').addEventListener('click', () => {
    if (!window.confirm('Tem certeza de que deseja apagar o progresso salvo neste navegador?')) return;
    localStorage.removeItem(STORE_KEY); state = { ...defaultState }; syncControls();
    $('#resetFeedback').textContent = 'Progresso reiniciado neste dispositivo.'; $('#resetFeedback').className = 'feedback good';
    navigate('inicio');
  });
  syncControls();
})();
