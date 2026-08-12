(function(){
  const data = [...(window.PLAYERS || [])];
  const tbody = document.getElementById('leaderboard-body');
  const search = document.getElementById('player-search');
  const status = document.getElementById('status-filter');
  const count = document.getElementById('player-count');
  const updated = document.getElementById('updated');
  const podium = document.getElementById('podium');

  const initials = name => name.split(/\s+/).slice(0,2).map(w => w[0]).join('').toUpperCase();
  const stateClass = s => (s || '').toLowerCase();
  const percent = p => Math.min(100, Math.round((p.score / Math.max(1,p.target))*100));

  function filtered() {
    const q = (search.value || '').trim().toLowerCase();
    const s = status.value;
    return data.filter(p => (!q || p.name.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q)) && (s === 'ALL' || p.status === s));
  }
  function renderPodium(rows) {
    const top = [...rows].sort((a,b)=>b.score-a.score).slice(0,3);
    podium.innerHTML = top.map((p,i)=>`<div class="podium-card"><div class="podium-place">#${i+1} · ${i===0?'LEADER':i===1?'RUNNER-UP':'THIRD'}</div><div class="mini-avatar" style="margin:12px auto 0">${initials(p.name)}</div><div class="podium-name">${p.name}</div><div class="podium-score">${p.score.toLocaleString()} pts · ${p.wins} wins</div></div>`).join('');
  }
  function render(){
    const rows = filtered().sort((a,b)=>b.score-a.score);
    count.textContent = `${rows.length} player${rows.length===1?'':'s'}`;
    tbody.innerHTML = rows.map((p,i)=>`<tr>
      <td><div class="player-cell"><div class="rank">#${i+1}</div><div class="mini-avatar">${initials(p.name)}</div><div><div class="player-name">${p.name}</div><div class="player-tag">${p.tag}</div></div></div></td>
      <td class="progress-cell"><div class="progress-meta"><span>${p.score.toLocaleString()} / ${p.target.toLocaleString()}</span><span>${percent(p)}%</span></div><div class="progress"><span style="width:${percent(p)}%"></span></div></td>
      <td>${p.rounds}</td><td>${p.wins}</td><td><span class="badge ${stateClass(p.status)}"><span>●</span>${p.status}</span></td>
    </tr>`).join('') || `<tr><td colspan="5" style="padding:35px;text-align:center;color:#858995">No players match your search.</td></tr>`;
    renderPodium(rows);
    if (document.body.classList.contains('motion-ready')) {
      requestAnimationFrame(() => {
        document.querySelectorAll('#leaderboard-body tr').forEach((row, i) => {
          row.style.transitionDelay = `${Math.min(i * 45, 360)}ms`;
          requestAnimationFrame(() => row.classList.add('row-visible'));
        });
        document.querySelectorAll('.podium-card').forEach((card, i) => {
          card.style.transitionDelay = `${i * 110}ms`;
        });
        // Re-observe the freshly-rendered podium cards after a search/filter.
        const cards = document.querySelectorAll('.podium-card');
        if (cards.length && window.__podiumObserver) cards.forEach(card => window.__podiumObserver.observe(card));
      });
    }
    const now = new Date(); updated.textContent = `Updated ${now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`;
  }
  search.addEventListener('input', render); status.addEventListener('change', render); render();
})();
