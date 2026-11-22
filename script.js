(() => {
  "use strict";

  const state = {
    mode: "mux",
    inputs: Array(8).fill(0),
    data: 0,
    select: [0, 0, 0] // [S2, S1, S0]
  };

  const $ = (id) => document.getElementById(id);
  const selectValue = () => (state.select[0] << 2) | (state.select[1] << 1) | state.select[2];
  const bits = () => state.select.join("");

  function makeToggle(label, value, onClick, extraClass = "") {
    const button = document.createElement("button");
    button.className = `bit-toggle ${extraClass}`.trim();
    button.type = "button";
    button.textContent = String(value);
    button.dataset.value = String(value);
    button.setAttribute("aria-label", `${label} is ${value}; toggle`);
    button.setAttribute("aria-pressed", String(Boolean(value)));
    button.addEventListener("click", onClick);
    return button;
  }

  function buildInputControls() {
    const grid = $("input-grid");
    grid.innerHTML = "";
    state.inputs.forEach((value, index) => {
      const cell = document.createElement("div");
      cell.className = "input-cell";
      const label = document.createElement("label");
      label.textContent = `D${index}`;
      const toggle = makeToggle(`Data input D${index}`, value, () => {
        state.inputs[index] = state.inputs[index] ? 0 : 1;
        render();
      });
      cell.append(label, toggle);
      grid.append(cell);
    });
  }

  function setMode(mode) {
    state.mode = mode;

    document.querySelectorAll(".mode-btn").forEach(button => {
        const active = button.dataset.mode === mode;
        button.classList.toggle("active", active);
        button.setAttribute("aria-selected", String(active));
    });

    const mux = mode === "mux";

    $("mux-controls").hidden = !mux;
    $("demux-controls").hidden = mux;

    $("mux-drawing").removeAttribute("hidden");
    $("demux-drawing").removeAttribute("hidden");

    $("mux-drawing").style.display = mux ? "inline" : "none";
    $("demux-drawing").style.display = mux ? "none" : "inline";

    $("mux-result").hidden = !mux;
    $("demux-result").hidden = mux;

    $("mux-table-wrap").hidden = !mux;
    $("demux-table-wrap").hidden = mux;

    $("control-title").textContent =
        mux ? "Set data inputs" : "Set data input";

    $("diagram-title").textContent = "Live circuit diagram";

    render();
}

  function renderMuxDiagram(selected) {
    const wires = $("mux-wires");
    const labels = $("mux-labels");
    wires.innerHTML = "";
    labels.innerHTML = "";
    for (let i = 0; i < 8; i++) {
      const y = 85 + i * 31;
      const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
      line.setAttribute("d", `M90 ${y} H250`);
      line.setAttribute("class", `wire ${i === selected ? "active" : ""}`);
      wires.append(line);
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", "55"); text.setAttribute("y", String(y + 4));
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("class", `svg-input ${i === selected ? "svg-highlight" : ""}`);
      text.textContent = `D${i}=${state.inputs[i]}`;
      labels.append(text);
    }
    const outputLine = document.querySelector("#mux-drawing .output-wire");
    outputLine.setAttribute("class", `wire output-wire ${state.inputs[selected] ? "active" : ""}`);
  }

  function renderDemuxDiagram(selected) {
    const wires = $("demux-wires");
    const labels = $("demux-labels");
    wires.innerHTML = ""; labels.innerHTML = "";
    for (let i = 0; i < 8; i++) {
      const y = 85 + i * 31;
      const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
      line.setAttribute("d", `M470 195 H520 V${y} H630`);
      line.setAttribute("class", `wire ${i === selected && state.data ? "active" : ""}`);
      wires.append(line);
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", "655"); text.setAttribute("y", String(y + 4));
      text.setAttribute("class", `svg-output ${i === selected && state.data ? "svg-highlight" : ""}`);
      text.textContent = `Y${i}=${i === selected ? state.data : 0}`;
      labels.append(text);
    }
  }

  function renderTables() {
    const muxBody = $("mux-table");
    const demuxBody = $("demux-table");
    muxBody.innerHTML = "";
    demuxBody.innerHTML = "";
    for (let i = 0; i < 8; i++) {
      const b = i.toString(2).padStart(3, "0").split("");
      const muxRow = document.createElement("tr");
      if (i === selectValue()) muxRow.className = "current-row";
      [ ...b, `D${i}`, String(state.inputs[i]) ].forEach(value => {
        const td = document.createElement("td"); td.textContent = value; muxRow.append(td);
      });
      muxBody.append(muxRow);

      const demuxRow = document.createElement("tr");
      if (i === selectValue()) demuxRow.className = "current-row";
      const vector = Array.from({length:8}, (_, j) => j === i ? state.data : 0).reverse().join("");
      [ ...b, String(state.data), `Y${i}`, vector ].forEach(value => {
        const td = document.createElement("td"); td.textContent = value; demuxRow.append(td);
      });
      demuxBody.append(demuxRow);
    }
  }

  function render() {
    const selected = selectValue();
    $("s2").textContent = state.select[0]; $("s1").textContent = state.select[1]; $("s0").textContent = state.select[2];
    [0,1,2].forEach(i => {
      const button = $(`s${2-i}`);
      button.dataset.value = String(state.select[i]);
      button.setAttribute("aria-pressed", String(Boolean(state.select[i])));
      button.setAttribute("aria-label", `Select bit S${2-i} is ${state.select[i]}; toggle`);
    });
    $("select-binary").textContent = bits();
    $("select-decimal").textContent = `Channel ${selected}`;

    if (state.mode === "mux") {
      buildInputControls();
      $("selected-input").textContent = `D${selected}`;
      $("mux-output").textContent = String(state.inputs[selected]);
      $("live-explanation").textContent = `Select bits ${bits()} equal decimal ${selected}. Therefore D${selected} (${state.inputs[selected]}) is connected to output Y.`;
      renderMuxDiagram(selected);
    } else {
      $("demux-data").textContent = String(state.data);
      $("demux-data").dataset.value = String(state.data);
      $("demux-data").setAttribute("aria-pressed", String(Boolean(state.data)));
      $("active-output").textContent = `Y${selected}`;
      const vector = Array.from({length:8}, (_, i) => i === selected ? state.data : 0).reverse().join("");
      $("demux-vector").textContent = vector;
      $("live-explanation").textContent = state.data
        ? `Input D = 1 is routed to output Y${selected}, selected by ${bits()}. All other outputs are 0.`
        : `Input D = 0. The selected output is Y${selected}, but every output remains 0.`;
      renderDemuxDiagram(selected);
    }
    renderTables();
  }

  document.querySelectorAll(".mode-btn").forEach(button => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });
  document.querySelectorAll(".select-toggle").forEach(button => {
    button.addEventListener("click", () => {
      const bitIndex = 2 - Number(button.dataset.select);
      state.select[bitIndex] = state.select[bitIndex] ? 0 : 1;
      render();
    });
  });
  $("demux-data").addEventListener("click", () => { state.data = state.data ? 0 : 1; render(); });
  $("reset-btn").addEventListener("click", () => {
    state.inputs = Array(8).fill(0);
    state.data = 0;
    state.select = [0,0,0];
    render();
  });

  render();
})();