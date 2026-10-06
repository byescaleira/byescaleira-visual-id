/* A apresentação: a abertura, as regras vivas, a API ao vivo e o Adicionar ao Claude. */
(() => {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");

  /* Abertura: a camada invertida é a cópia da de cima; a linha divide as duas. */
  const hero = document.getElementById("inicio");
  const base = document.getElementById("hero-base");
  const inv = document.getElementById("hero-inv");
  const seam = document.getElementById("seam");

  for (const node of base.childNodes) {
    const copy = node.cloneNode(true);
    if (copy.nodeType === 1) {
      copy.removeAttribute("id");
      copy.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
    }
    inv.appendChild(copy);
  }

  const baseFocusables = [...base.querySelectorAll("a, button")];
  const invFocusables = [...inv.querySelectorAll("a, button")];
  base.addEventListener("focusin", (e) => {
    const i = baseFocusables.indexOf(e.target);
    if (i > -1 && e.target.matches(":focus-visible")) invFocusables[i].classList.add("is-focus");
  });
  base.addEventListener("focusout", () => invFocusables.forEach((el) => el.classList.remove("is-focus")));

  let split = 50;
  let touched = false;
  const paintSplit = () => {
    hero.style.setProperty("--split", split + "%");
    seam.setAttribute("aria-valuenow", Math.round(split));
    seam.setAttribute("aria-valuetext", Math.round(split) + "% no tema atual");
  };
  const setSplit = (value) => {
    touched = true;
    split = Math.max(0, Math.min(100, value));
    hero.classList.remove("is-opening");
    paintSplit();
  };

  /* A linha descansa no meio do nome, para cortá-lo em qualquer largura. */
  const wordmark = document.getElementById("hero-title");
  const rest = () => {
    if (touched) return;
    const box = hero.getBoundingClientRect();
    const word = document.createRange();
    word.selectNodeContents(wordmark);
    const text = word.getBoundingClientRect();
    const middle = ((text.left + text.width * 0.55 - box.left) / box.width) * 100;
    split = Math.max(25, Math.min(75, middle));
    paintSplit();
  };
  rest();
  document.fonts.ready.then(rest);
  addEventListener("resize", rest);

  hero.addEventListener("animationend", () => hero.classList.remove("is-opening"));
  if (reduce.matches) hero.classList.remove("is-opening");

  const fromPointer = (e) => {
    const box = hero.getBoundingClientRect();
    setSplit(((e.clientX - box.left) / box.width) * 100);
  };

  seam.addEventListener("pointerdown", (e) => {
    seam.setPointerCapture(e.pointerId);
    seam.classList.add("is-dragging");
    fromPointer(e);
  });
  seam.addEventListener("pointermove", (e) => {
    if (seam.hasPointerCapture(e.pointerId)) fromPointer(e);
  });
  const stopDrag = () => seam.classList.remove("is-dragging");
  seam.addEventListener("pointerup", stopDrag);
  seam.addEventListener("pointercancel", stopDrag);

  seam.addEventListener("keydown", (e) => {
    const step = e.shiftKey ? 10 : 2;
    const keys = { ArrowLeft: split - step, ArrowDown: split - step, ArrowRight: split + step, ArrowUp: split + step, Home: 0, End: 100 };
    if (e.key in keys) {
      e.preventDefault();
      setSplit(keys[e.key]);
    }
  });

  /* Regra 1: o tema da página e os valores vivos dos tokens. */
  const themeButtons = document.querySelectorAll("[data-theme-set]");
  const paintSwatches = () => {
    const style = getComputedStyle(root);
    document.querySelectorAll("#swatches [data-token]").forEach((dd) => {
      dd.textContent = style.getPropertyValue(dd.dataset.token).trim();
    });
  };

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const theme = button.dataset.themeSet;
      if (theme === "auto") root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", theme);
      themeButtons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
      paintSwatches();
    });
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", paintSwatches);
  paintSwatches();

  /* Regra 2: filtro e seleção são tinta. */
  const pills = document.querySelectorAll("[data-filter]");
  const taskItems = document.querySelectorAll("#tasks li");
  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      pills.forEach((p) => p.setAttribute("aria-pressed", String(p === pill)));
      taskItems.forEach((li) => {
        li.hidden = pill.dataset.filter !== "todos" && li.dataset.state !== pill.dataset.filter;
      });
    });
  });
  const rows = document.querySelectorAll("#tasks .row");
  rows.forEach((row) => {
    row.addEventListener("click", () => rows.forEach((r) => r.setAttribute("aria-pressed", String(r === row))));
  });

  /* Regra 3: os sinais respondem a uma ação. */
  const approve = document.getElementById("approve");
  const fail = document.getElementById("fail");
  const notices = document.getElementById("notices");
  const progress = document.getElementById("progress");
  const warnNotice = notices.innerHTML;
  let busy = false;

  const run = (outcome) => {
    if (busy) return;
    busy = true;
    approve.disabled = true;
    fail.disabled = true;
    approve.innerHTML = '<span class="spinner" aria-hidden="true"></span>Aprovando 3 eventos';
    progress.classList.remove("is-running");
    void progress.offsetWidth;
    progress.classList.add("is-running");

    setTimeout(() => {
      progress.classList.remove("is-running");
      busy = false;
      fail.disabled = false;
      if (outcome === "ok") {
        notices.innerHTML = '<p class="notice ok"><strong>Aprovados.</strong> Os 3 eventos já estão na agenda.</p>';
        approve.textContent = "Recomeçar";
        approve.className = "btn btn-secondary";
        approve.dataset.done = "true";
      } else {
        notices.innerHTML = '<p class="notice danger"><strong>A agenda não respondeu.</strong> Nada foi aprovado. Tente de novo em 1 minuto.</p>';
        approve.textContent = "Tentar de novo";
      }
      approve.disabled = false;
    }, reduce.matches ? 300 : 1300);
  };

  approve.addEventListener("click", () => {
    if (approve.dataset.done) {
      delete approve.dataset.done;
      approve.className = "btn";
      approve.textContent = "Aprovar 3 eventos";
      notices.innerHTML = warnNotice;
      return;
    }
    run("ok");
  });
  fail.addEventListener("click", () => {
    delete approve.dataset.done;
    approve.className = "btn";
    run("erro");
  });

  /* Popovers: menu do parecer e dias do CLIO. */
  const popovers = [];
  const bindPopover = (button, pop) => {
    const close = (focusButton) => {
      pop.hidden = true;
      button.setAttribute("aria-expanded", "false");
      if (focusButton) button.focus();
    };
    const open = () => {
      popovers.forEach((p) => p.close(false));
      pop.hidden = false;
      button.setAttribute("aria-expanded", "true");
      (pop.querySelector('[aria-checked="true"]') || pop.querySelector("button")).focus();
    };
    button.addEventListener("click", () => (pop.hidden ? open() : close(false)));
    pop.addEventListener("keydown", (e) => {
      const items = [...pop.querySelectorAll("button")];
      const i = items.indexOf(document.activeElement);
      if (e.key === "Escape") { e.preventDefault(); close(true); }
      if (e.key === "ArrowDown") { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      if (e.key === "ArrowUp") { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
      if (e.key === "Tab") close(false);
    });
    pop.addEventListener("click", (e) => { if (e.target.closest("button")) close(true); });
    const entry = { button, pop, close };
    popovers.push(entry);
    return entry;
  };
  document.addEventListener("click", (e) => {
    popovers.forEach((p) => {
      if (!p.pop.hidden && !p.pop.contains(e.target) && !p.button.contains(e.target)) p.close(false);
    });
  });

  bindPopover(document.getElementById("menu-btn"), document.getElementById("menu"));

  /* Regra 5: a data é o destaque; clicar nela troca o dia. */
  const days = [
    { hero: "28.09", weekday: "Segunda", events: [
      { time: "09:00", title: "Prazo de contestação, caso de exemplo", who: "Ana Exemplo", data: "salvia" },
      { time: "11:30", title: "Reunião com o Cliente Teste", who: "Bruno Teste", data: "pavao" },
      { time: "16:00", title: "Protocolar a minuta simulada", who: "Clara Modelo", data: "tangerina" }
    ]},
    { hero: "29.09", weekday: "Terça", events: [
      { time: "10:00", title: "Audiência fictícia, sala 2", who: "Bruno Teste", data: "pavao" }
    ]},
    { hero: "30.09", weekday: "Quarta", events: [] }
  ];
  const dayButton = document.getElementById("day-btn");
  const dayMenu = document.getElementById("days");
  const support = document.getElementById("day-support");
  const agenda = document.getElementById("agenda");
  const plural = (n) => (n === 0 ? "nenhum prazo" : n === 1 ? "1 prazo" : n + " prazos");

  const renderDay = (index) => {
    const day = days[index];
    dayButton.textContent = day.hero;
    dayButton.setAttribute("aria-label", day.hero + ", " + day.weekday + ". Trocar o dia");
    support.innerHTML = "<strong>" + day.weekday + ",</strong> setembro. " + plural(day.events.length).replace(/^n/, "N");
    if (!day.events.length) {
      agenda.innerHTML = '<p class="empty">Nenhum prazo neste dia. Escolha outro dia na data.</p>';
    } else {
      agenda.innerHTML = day.events.map((ev, i) =>
        '<div class="agenda-row data-' + ev.data + '" style="animation-delay: ' + i * 40 + 'ms">' +
          '<span class="agenda-time">' + ev.time + "</span>" +
          '<span class="row-title">' + ev.title + "</span>" +
          '<span class="agenda-who"><span class="dot" aria-hidden="true"></span>' + ev.who + "</span>" +
        "</div>"
      ).join("");
    }
    dayMenu.innerHTML = days.map((d, i) =>
      '<button type="button" class="option" role="menuitemradio" aria-checked="' + (i === index) + '" data-day="' + i + '">' +
        "<span>" + d.weekday + ", " + d.hero + '</span><span class="muted">' + plural(d.events.length) + "</span>" +
      "</button>"
    ).join("");
  };

  dayMenu.addEventListener("click", (e) => {
    const option = e.target.closest("[data-day]");
    if (option) renderDay(Number(option.dataset.day));
  });
  bindPopover(dayButton, dayMenu);
  renderDay(0);

  /* Tipografia: o texto de teste em toda a escala. */
  const input = document.getElementById("specimen-input");
  const samples = document.querySelectorAll("#scale .sample");
  const reading = "A identidade é preto e branco. A cor só aparece quando informa: um sinal com palavras ou a cor que vem do próprio dado.";
  const paintSamples = () => {
    const text = input.value.trim() || "Escreva acima";
    samples.forEach((s) => { s.textContent = s.hasAttribute("data-serif") ? text + ". " + reading : text; });
  };
  input.addEventListener("input", paintSamples);
  paintSamples();

  /* Copiar: o botão confirma com o mesmo verbo e volta ao rótulo dele. */
  document.querySelectorAll("[data-copy]").forEach((button) => {
    const label = button.innerHTML;
    button.addEventListener("click", async () => {
      const text = (button.dataset.copyPrefix ?? "") + document.getElementById(button.dataset.copy).textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        button.innerHTML = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>Copiado';
        button.classList.add("copied");
      } catch {
        button.textContent = "Selecione e copie";
      }
      setTimeout(() => {
        button.innerHTML = label;
        button.classList.remove("copied");
      }, 2000);
    });
  });

  /* Adicionar ao Claude: o pedido que o botão deixa escrito no Claude Code (claude-cli://open?q=…). */
  const openCode = document.getElementById("open-code");
  if (openCode) {
    const prompt = [
      "Instale a identidade visual byescaleira no Claude Code. Rode no terminal, nesta ordem:",
      "claude plugin marketplace add byescaleira/byescaleira-visual-id",
      "claude plugin install byescaleira-visual-id@byescaleira-visual-id",
      "Depois, diga se deu certo e como chamar a skill.",
    ].join("\n");
    openCode.href = `claude-cli://open?q=${encodeURIComponent(prompt)}`;
  }

  /* Adicionar ao Claude: as abas. Setas trocam de aba, como pede o padrão de abas. */
  const tabs = [...document.querySelectorAll('.add-tabs [role="tab"]')];
  const selectTab = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectTab(tab, false));
    tab.addEventListener("keydown", (e) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (step) {
        e.preventDefault();
        selectTab(tabs[(i + step + tabs.length) % tabs.length], true);
      }
      if (e.key === "Home") selectTab(tabs[0], true);
      if (e.key === "End") selectTab(tabs[tabs.length - 1], true);
    });
  });

  /* A API ao vivo: cada escolha monta o endereço e mostra a resposta da API de verdade. */
  const live = { theme: "light", product: "", date: "" };
  const liveUrl = document.getElementById("live-url");
  const liveResult = document.getElementById("live-result");
  const liveSeason = document.getElementById("live-season");
  const liveProgress = document.getElementById("live-progress");
  const liveDate = document.getElementById("live-date");
  const SHOWN = ["paper", "ink", "ink-muted", "rule", "rule-strong", "accent", "warn", "danger", "ok"];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const brDate = (iso) => iso.split("-").reverse().join("/");
  let request = 0;

  const liveRun = async () => {
    const params = new URLSearchParams();
    if (live.product) params.set("product", live.product);
    params.set("season", "auto");
    if (live.date) params.set("date", live.date);
    const path = `/api/v1/themes/${live.theme}?${params}`;
    liveUrl.textContent = path;
    const mine = ++request;
    liveProgress.hidden = false;
    try {
      const res = await fetch(path);
      const theme = await res.json();
      if (mine !== request) return;
      if (!res.ok) {
        liveSeason.innerHTML = `<p class="notice danger">${esc(theme.error?.message ?? "A API respondeu com erro.")}</p>`;
        liveResult.innerHTML = "";
        return;
      }
      const rows = SHOWN.map((name) => [name, theme.color[name]]).concat(theme.dataColors.slice(0, 3).map((c) => [c.token, c.value]));
      const season = theme.season
        ? `<div class="live-season" style="--live-season: ${esc(theme.season.color)}"><span class="live-season-band"></span><span><span class="dot" aria-hidden="true"></span> <strong>${esc(theme.season.name)}</strong>, de ${brDate(theme.season.period.start)} a ${brDate(theme.season.period.end)}. season: ${esc(theme.season.color)}, só no fio do topo e no ponto ao lado do nome.</span></div>`
        : `<div class="live-season"><span>Nenhuma data especial neste dia. Experimente 20/12 ou o carnaval.</span></div>`;
      liveSeason.innerHTML = season;
      liveResult.innerHTML = rows
          .map(
            ([name, value], i) =>
              `<div class="swatch" style="animation-delay: ${i * 20}ms"><span class="chip" style="background: ${esc(value)}"></span><dt>${esc(name)}</dt><dd>${esc(value)}</dd></div>`,
          )
          .join("");
    } catch {
      if (mine === request) liveSeason.innerHTML = '<p class="notice danger">A API não respondeu. Confira a conexão e tente de novo.</p>';
    } finally {
      if (mine === request) liveProgress.hidden = true;
    }
  };

  if (liveResult) {
    // O dia começa no dia da página (?data=…), ou hoje.
    const pageDay = new URLSearchParams(location.search).get("data");
    const local = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    liveDate.value = /^\d{4}-\d{2}-\d{2}$/.test(pageDay ?? "") ? pageDay : local;
    live.date = liveDate.value;
    document.querySelectorAll("[data-live-theme]").forEach((b, _, all) =>
      b.addEventListener("click", () => {
        all.forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
        live.theme = b.dataset.liveTheme;
        liveRun();
      }),
    );
    document.querySelectorAll("[data-live-product]").forEach((b, _, all) =>
      b.addEventListener("click", () => {
        all.forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
        live.product = b.dataset.liveProduct;
        liveRun();
      }),
    );
    liveDate.addEventListener("change", () => {
      live.date = liveDate.value;
      liveRun();
    });
    // A resposta empurra a página: quem chegou por um link com âncora (#adicionar) volta para ela.
    liveRun().then(() => {
      if (location.hash.length > 1) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
    });
  }
})();
