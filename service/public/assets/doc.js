/*
 * A documentação funciona sem JavaScript: as páginas vêm prontas do servidor. Aqui ficam só os acréscimos:
 * a busca, o menu no celular, a seção atual em "Nesta página", os botões de copiar e o "Testar" da API.
 */
(() => {
  const nav = document.getElementById("docs-nav");
  const sections = document.getElementById("docs-sections");
  const results = document.getElementById("docs-results");
  const menuButton = document.querySelector(".docs-menu-button");

  /* ---------- Menu no celular ---------- */

  const setMenu = (open) => {
    if (!nav || !menuButton) return;
    nav.dataset.open = String(open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.textContent = open ? "Fechar" : "Menu";
  };
  menuButton?.addEventListener("click", () => setMenu(nav.dataset.open !== "true"));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav?.dataset.open === "true") {
      setMenu(false);
      menuButton.focus();
    }
  });

  /* ---------- Busca: sem acento e sem caixa, título primeiro ---------- */

  // No celular, a busca fica dentro do menu.
  if (nav && sections) {
    const label = document.createElement("label");
    label.className = "search docs-search-menu";
    label.innerHTML =
      '<span class="sr-only">Buscar na documentação</span><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input type="search" placeholder="Buscar" autocomplete="off">';
    nav.prepend(label);
  }
  const inputs = [...document.querySelectorAll("#doc-search, .docs-search-menu input")];

  const fold = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const esc = (s) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  let index = null;
  const loadIndex = async () => {
    if (!index) index = await fetch("/doc/search.json").then((r) => r.json()).catch(() => []);
    return index;
  };

  const search = async (query) => {
    const q = fold(query.trim());
    if (q.length < 2) {
      results.hidden = true;
      sections.hidden = false;
      return;
    }
    const pages = await loadIndex();
    const hits = [];
    for (const page of pages) {
      const inTitle = fold(page.title).includes(q);
      const at = fold(page.text).indexOf(q);
      if (!inTitle && at < 0) continue;
      const start = Math.max(0, at - 50);
      hits.push({
        ...page,
        score: inTitle ? 0 : 1,
        before: at < 0 ? page.text.slice(0, 110) : `${start > 0 ? "…" : ""}${page.text.slice(start, at)}`,
        match: at < 0 ? "" : page.text.slice(at, at + q.length),
        after: at < 0 ? "…" : `${page.text.slice(at + q.length, at + q.length + 70)}…`,
      });
    }
    hits.sort((a, b) => a.score - b.score);
    const shown = query.trim();
    results.innerHTML =
      `<p class="docs-results-count">${hits.length === 0 ? `Nada encontrado para "${esc(shown)}". Tente outra palavra.` : `${hits.length} ${hits.length === 1 ? "página" : "páginas"} com "${esc(shown)}"`}</p>` +
      `<ol>${hits
        .map(
          (h) =>
            `<li><a href="${h.url}${h.match ? `#:~:text=${encodeURIComponent(h.match)}` : ""}"><span class="docs-result-title">${esc(h.title)}</span><span class="docs-result-section">${esc(h.section)}</span><span class="docs-result-snippet">${esc(h.before)}${h.match ? `<mark>${esc(h.match)}</mark>` : ""}${esc(h.after)}</span></a></li>`,
        )
        .join("")}</ol>`;
    results.hidden = false;
    sections.hidden = true;
    if (window.matchMedia("(max-width: 860px)").matches) setMenu(true);
  };

  for (const input of inputs) {
    input.addEventListener("focus", loadIndex, { once: true });
    input.addEventListener("input", () => {
      for (const other of inputs) if (other !== input) other.value = input.value;
      search(input.value);
    });
  }
  document.addEventListener("keydown", (e) => {
    const typing = /^(input|textarea|select)$/i.test(document.activeElement?.tagName ?? "");
    if (e.key === "/" && !typing) {
      e.preventDefault();
      const visible = inputs.find((i) => i.offsetParent !== null);
      visible?.focus();
    }
  });

  /* ---------- Nesta página: a seção no topo da tela ---------- */

  const tocLinks = [...document.querySelectorAll(".docs-toc a")];
  if (tocLinks.length && "IntersectionObserver" in window) {
    const byId = new Map(tocLinks.map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
    const targets = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
    const mark = (id) => tocLinks.forEach((a) => (a === byId.get(id) ? a.setAttribute("aria-current", "location") : a.removeAttribute("aria-current")));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) mark(visible.target.id);
      },
      { rootMargin: "-72px 0px -70% 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    if (targets[0]) mark(targets[0].id);
  }

  /* ---------- Copiar comandos ---------- */

  document.addEventListener("click", async (e) => {
    const copy = e.target.closest("[data-copy]");
    if (!copy) return;
    const text = copy.parentElement?.querySelector("code")?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      copy.textContent = "Copiado";
    } catch {
      copy.textContent = "Selecione e copie";
    }
    setTimeout(() => (copy.textContent = "Copiar"), 1600);
  });

  /* ---------- Testar a API ---------- */

  for (const box of document.querySelectorAll("[data-try]")) {
    const input = box.querySelector("input");
    const button = box.querySelector("[data-try-run]");
    const out = box.querySelector("[data-try-result]");
    const run = async () => {
      const path = input.value.trim();
      if (!path.startsWith("/api/")) {
        out.hidden = false;
        out.innerHTML = '<p class="api-try-status danger">O endereço começa com /api/. Exemplo: /api/v1/themes/dark</p>';
        return;
      }
      button.disabled = true;
      out.hidden = false;
      out.innerHTML = '<div class="progress" aria-hidden="true"></div><p class="api-try-status">Enviando</p>';
      try {
        const res = await fetch(path, { headers: { Accept: "application/json, text/css, text/markdown, image/svg+xml" } });
        const type = res.headers.get("Content-Type") ?? "";
        let body = await res.text();
        if (type.includes("json")) body = JSON.stringify(JSON.parse(body), null, 2);
        const lines = body.split("\n");
        const cut = lines.length > 400 ? `${lines.slice(0, 400).join("\n")}\n…` : body;
        out.innerHTML = `<p class="api-try-status ${res.ok ? "ok" : "danger"}">${res.status} ${res.ok ? "OK" : "Erro"}, ${esc(type.split(";")[0])}</p><pre><code></code></pre>`;
        out.querySelector("code").textContent = cut;
      } catch {
        out.innerHTML = '<p class="api-try-status danger">A API não respondeu. Confira a conexão e tente de novo.</p>';
      } finally {
        button.disabled = false;
      }
    };
    button.addEventListener("click", run);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") run();
    });
  }
})();
