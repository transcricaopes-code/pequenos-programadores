(() => {
  'use strict';
  // Mantemos a mesma chave da primeira versão para preservar o progresso já salvo.
  const STORE_KEY = 'pequenosProgramadoresModulo1_v1';
  const defaultState = {
    name: 'programador', completed: {}, quizzes: {},
    steps: { aula1: 0, aula2: 0, aula3: 0, aula4: 0 },
    moduleDone: false, module2Done: false,
    characterName: '', storyPlace: '', storyMission: '', projectTitle: '', projectDescription: '',
    project2Title: '', project2Description: ''
  };
  let state = loadState();
  let currentView = 'inicio';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
      return {
        ...defaultState,
        ...saved,
        completed: { ...defaultState.completed, ...(saved.completed || {}) },
        quizzes: { ...defaultState.quizzes, ...(saved.quizzes || {}) },
        steps: { ...defaultState.steps, ...(saved.steps || {}) }
      };
    } catch {
      return { ...defaultState, completed: {}, quizzes: {}, steps: { ...defaultState.steps } };
    }
  }

  function saveState() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
    catch { showToast('Não foi possível salvar neste navegador.'); }
    updateProgress();
  }

  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2400);
  }

  function updateName() {
    const name = (state.name || 'programador').trim();
    $('#heroName').textContent = name;
    $('#nameButton').textContent = name.charAt(0).toUpperCase() || 'P';
    $('#certificateName').textContent = name === 'programador' ? 'Pequeno Programador' : name;
    $('#certificateName2').textContent = name === 'programador' ? 'Pequeno Programador' : name;
  }

  function isDone(key) { return !!state.completed[key]; }
  function quizDone(key) { return state.quizzes[key] === 'correct'; }
  function lesson1Done() { return isDone('l1mini') && ['q1','q2','q3','q4'].every(quizDone); }
  function lesson2Done() { return ['l2costume','l2click'].every(isDone) && quizDone('q5'); }
  function canOpenMission() { return lesson1Done() && lesson2Done(); }
  function canOpenAula3() { return !!state.moduleDone; }
  function lesson3Done() { return ['m2repeat','m2square'].every(isDone) && ['q6','q7'].every(quizDone); }
  function canOpenAula4() { return canOpenAula3() && lesson3Done(); }
  function lesson4Done() { return ['m2animation','m2forever'].every(isDone) && quizDone('q8'); }
  function canOpenMission2() { return canOpenAula4() && lesson4Done(); }

  function updateProgress() {
    const taskKeys = [
      'l1mini','l2costume','l2click','finalActor','finalBackdrop','finalMove','finalSay','finalInteraction',
      'm2repeat','m2square','m2animation','m2forever','m2finalRepeat','m2finalForever','m2finalWait','m2finalCustomize'
    ];
    const quizKeys = ['q1','q2','q3','q4','q5','q6','q7','q8'];
    const done = taskKeys.filter(isDone).length + quizKeys.filter(quizDone).length;
    const total = taskKeys.length + quizKeys.length;
    const pct = Math.round(done / total * 100);
    $('#overallPercent').textContent = pct + '%';
    $('#overallProgress').style.width = pct + '%';

    const l1 = (isDone('l1mini') ? 1 : 0) + ['q1','q2','q3','q4'].filter(quizDone).length;
    const l2 = ['l2costume','l2click'].filter(isDone).length + (quizDone('q5') ? 1 : 0);
    const l3 = ['m2repeat','m2square'].filter(isDone).length + ['q6','q7'].filter(quizDone).length;
    const l4 = ['m2animation','m2forever'].filter(isDone).length + (quizDone('q8') ? 1 : 0);
    $('#lesson1ProgressLabel').textContent = `${l1} de 5 itens`;
    $('#lesson2ProgressLabel').textContent = `${l2} de 3 itens`;
    $('#lesson3ProgressLabel').textContent = `${l3} de 4 itens`;
    $('#lesson4ProgressLabel').textContent = `${l4} de 3 itens`;

    setStatus('aula1', lesson1Done(), 'COMEÇAR');
    setStatus('aula2', lesson2Done(), lesson1Done() ? 'COMEÇAR' : 'BLOQUEADA');
    setStatus('missao', !!state.moduleDone, canOpenMission() ? 'COMEÇAR' : 'BLOQUEADA');
    setStatus('aula3', lesson3Done(), canOpenAula3() ? 'COMEÇAR' : 'BLOQUEADA');
    setStatus('aula4', lesson4Done(), canOpenAula4() ? 'COMEÇAR' : 'BLOQUEADA');
    setStatus('missao2', !!state.module2Done, canOpenMission2() ? 'COMEÇAR' : 'BLOQUEADA');

    $('#certificate').classList.toggle('hidden', !state.moduleDone);
    $('#certificate2').classList.toggle('hidden', !state.module2Done);
    $('#projectTitle').value = state.projectTitle || '';
    $('#projectDescription').value = state.projectDescription || '';
    $('#project2Title').value = state.project2Title || '';
    $('#project2Description').value = state.project2Description || '';
  }

  function setStatus(id, done, lockedLabel) {
    const el = $('#status-' + id);
    if (!el) return;
    el.textContent = done ? 'CONCLUÍDA' : lockedLabel;
    el.classList.toggle('done', done);
  }

  function syncControls() {
    $$('[data-task]').forEach(input => { input.checked = isDone(input.dataset.task); });
    $$('[data-quiz]').forEach(group => {
      const key = group.dataset.quiz;
      const selected = state.quizzes[key];
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
    updateName();
    updateProgress();
  }

  function navigate(view) {
    if (!$('#view-' + view)) return;
    if (view === 'aula2' && !lesson1Done()) { showToast('Complete a Aula 1 para liberar esta etapa.'); view = 'aula1'; }
    if (view === 'missao' && !canOpenMission()) { showToast('Conclua as duas aulas do Módulo 1 para liberar a missão.'); view = lesson1Done() ? 'aula2' : 'aula1'; }
    if (['aula3','aula4','missao2'].includes(view) && !canOpenAula3()) {
      showToast('Conclua o Módulo 1 para liberar o Módulo 2.');
      view = canOpenMission() ? 'missao' : (lesson1Done() ? 'aula2' : 'aula1');
    }
    if (view === 'aula4' && !canOpenAula4()) { showToast('Conclua os desafios da Aula 3 para liberar esta aula.'); view = 'aula3'; }
    if (view === 'missao2' && !canOpenMission2()) { showToast('Conclua as atividades das Aulas 3 e 4 para liberar o projeto.'); view = canOpenAula4() ? 'aula4' : 'aula3'; }

    currentView = view;
    $$('.view').forEach(el => el.classList.remove('active-view'));
    $('#view-' + view).classList.add('active-view');
    $$('.nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.view === view));
    const labels = {
      inicio: 'INÍCIO', aula1: 'AULA 1', aula2: 'AULA 2', missao: 'GRANDE MISSÃO',
      aula3: 'AULA 3', aula4: 'AULA 4', missao2: 'PROJETO DO MÓDULO 2', responsavel: 'GUIA DO RESPONSÁVEL'
    };
    $('#crumbCurrent').textContent = labels[view];
    $('#sidebar').classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (['aula1','aula2','aula3','aula4'].includes(view)) showStep(view, state.steps[view] || 0);
  }

  function stepCount(lesson) { return lesson === 'aula1' || lesson === 'aula3' ? 4 : 3; }
  function stepperId(lesson) { return lesson === 'aula1' ? 'stepper1' : lesson === 'aula2' ? 'stepper2' : lesson === 'aula3' ? 'stepper3' : 'stepper4'; }
  function controlNumber(lesson) { return ({ aula1: '1', aula2: '2', aula3: '3', aula4: '4' })[lesson]; }
  function controlPrefix(lesson) { return 'lesson' + controlNumber(lesson); }

  function showStep(lesson, step) {
    const max = stepCount(lesson);
    step = Math.max(0, Math.min(max - 1, step));
    state.steps[lesson] = step;
    saveState();
    const view = $('#view-' + lesson);
    $$('[data-step-panel]', view).forEach(panel => panel.classList.toggle('active-step', Number(panel.dataset.stepPanel) === step));
    const stepper = $('#' + stepperId(lesson));
    $$('.step-dot', stepper).forEach(dot => {
      const n = Number(dot.dataset.step);
      dot.classList.toggle('current', n === step);
      dot.classList.toggle('done', n < step);
    });
    const prefix = controlPrefix(lesson);
    $('#' + prefix + 'Prev').disabled = step === 0;
    $('#' + prefix + 'Next').textContent = step === max - 1 ? 'Concluir aula ✓' : 'Próxima etapa →';
    $('#' + prefix + 'StepText').textContent = `Etapa ${step + 1} de ${max}`;
  }

  function advance(lesson, direction) {
    const max = stepCount(lesson);
    const current = state.steps[lesson] || 0;
    if (direction > 0 && current === max - 1) {
      if (lesson === 'aula1' && !lesson1Done()) { showToast('Responda aos desafios e marque a mini missão para concluir a aula.'); return; }
      if (lesson === 'aula2' && !canOpenMission()) { showToast('Complete os desafios e marque as mini missões para concluir a aula.'); return; }
      if (lesson === 'aula3' && !canOpenAula4()) { showToast('Responda aos desafios e marque as mini missões da Aula 3.'); return; }
      if (lesson === 'aula4' && !canOpenMission2()) { showToast('Complete as mini missões da Aula 4 para liberar o projeto.'); return; }
      const nextView = ({ aula1: 'aula2', aula2: 'missao', aula3: 'aula4', aula4: 'missao2' })[lesson];
      showToast(({ aula1: 'Aula 1 concluída! A Aula 2 está liberada.', aula2: 'Aula 2 concluída! A grande missão está liberada.', aula3: 'Aula 3 concluída! A Aula 4 está liberada.', aula4: 'Aula 4 concluída! O projeto final está liberado.' })[lesson]);
      navigate(nextView);
      return;
    }
    showStep(lesson, current + direction);
  }

  function handleQuiz(button) {
    const group = button.closest('[data-quiz]');
    const key = group.dataset.quiz;
    if (state.quizzes[key]) return;
    const correct = button.dataset.answer === 'correct';
    if (correct) {
      state.quizzes[key] = 'correct';
      $$('.quiz-option', group).forEach(b => { b.disabled = true; if (b === button) b.classList.add('correct-selected'); });
      const feedback = $('#feedback-' + key);
      feedback.textContent = 'Muito bem! Você acertou. Continue investigando!';
      feedback.className = 'feedback good';
      showToast('Resposta correta! Conquista de aprendizagem registrada.');
    } else {
      button.classList.add('wrong-selected');
      const feedback = $('#feedback-' + key);
      feedback.textContent = 'Ainda não. Pense mais um pouco e tente outra opção.';
      feedback.className = 'feedback try';
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

  ['aula1','aula2','aula3','aula4'].forEach((lesson, i) => {
    const n = i + 1;
    const prefix = 'lesson' + n;
    $('#' + prefix + 'Prev').addEventListener('click', () => advance(lesson, -1));
    $('#' + prefix + 'Next').addEventListener('click', () => advance(lesson, 1));
    $$('#stepper' + n + ' .step-dot').forEach(dot => dot.addEventListener('click', () => showStep(lesson, Number(dot.dataset.step))));
  });

  $$('.quiz-option').forEach(button => button.addEventListener('click', () => handleQuiz(button)));
  $$('[data-task]').forEach(input => input.addEventListener('change', () => {
    state.completed[input.dataset.task] = input.checked;
    saveState();
    if (input.checked) showToast('Atividade registrada!');
  }));

  [
    ['characterName','characterName'],['storyPlace','storyPlace'],['storyMission','storyMission'],
    ['projectTitle','projectTitle'],['projectDescription','projectDescription'],
    ['project2Title','project2Title'],['project2Description','project2Description']
  ].forEach(([id, key]) => {
    $('#' + id).addEventListener('input', e => { state[key] = e.target.value; saveState(); });
  });

  $('#finishModule').addEventListener('click', () => {
    const required = ['finalActor','finalBackdrop','finalMove','finalSay','finalInteraction'];
    const missing = required.filter(key => !isDone(key));
    const feedback = $('#finalFeedback');
    if (missing.length) { feedback.textContent = `Antes de concluir, marque os itens que você já colocou no projeto. Faltam ${missing.length} item(ns) obrigatório(s).`; feedback.className = 'feedback try'; return; }
    state.moduleDone = true;
    saveState();
    feedback.textContent = 'Parabéns! Seu Módulo 1 foi concluído.';
    feedback.className = 'feedback good';
    $('#certificate').classList.remove('hidden');
    $('#certificate').scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('Módulo 1 concluído! Módulo 2 liberado.');
  });

  $('#finishModule2').addEventListener('click', () => {
    const required = ['m2finalRepeat','m2finalForever','m2finalWait','m2finalCustomize'];
    const missing = required.filter(key => !isDone(key));
    const feedback = $('#finalFeedback2');
    if (missing.length) { feedback.textContent = `Antes de concluir, marque os itens que você já colocou no projeto. Faltam ${missing.length} item(ns) obrigatório(s).`; feedback.className = 'feedback try'; return; }
    state.module2Done = true;
    saveState();
    feedback.textContent = 'Parabéns! Você concluiu o Módulo 2.';
    feedback.className = 'feedback good';
    $('#certificate2').classList.remove('hidden');
    $('#certificate2').scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('Módulo 2 concluído!');
  });

  $('#resetProgress').addEventListener('click', () => {
    if (!window.confirm('Tem certeza de que deseja apagar o progresso salvo neste navegador?')) return;
    localStorage.removeItem(STORE_KEY);
    state = { ...defaultState, completed: {}, quizzes: {}, steps: { ...defaultState.steps } };
    syncControls();
    $('#resetFeedback').textContent = 'Progresso reiniciado neste dispositivo.';
    $('#resetFeedback').className = 'feedback good';
    navigate('inicio');
  });

  syncControls();
})();
