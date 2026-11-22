# LogicLab — 8:1 MUX & 1:8 DEMUX Simulator

An interactive, browser-based digital electronics simulator for learning how an **8-to-1 multiplexer** and a **1-to-8 demultiplexer** work.

## Live demo

After enabling GitHub Pages, add your published URL here.

## Features

- Switch between 8:1 MUX and 1:8 DEMUX.
- Toggle all eight MUX data inputs (D0–D7).
- Toggle the DEMUX data input.
- Control select lines S2, S1 and S0.
- See the selected channel and output update instantly.
- View a live SVG circuit diagram with highlighted signal paths.
- Read the truth tables for both circuits.
- Reset all inputs and select lines.
- Responsive layout for desktop and mobile.
- No account, database, API key, or build step required.

## Important design note: why there is no backend

This project is a digital logic simulator. Its calculations happen instantly in the browser using JavaScript, so a server-side backend is not necessary. This makes the project easy to host for free on **GitHub Pages**.

GitHub Pages hosts static websites (HTML, CSS and JavaScript). It does not run a Node.js/Express server. If a future version needs user accounts, saved projects shared across users, or a database, add a separate backend and host that backend on a service that supports Node.js.

## Logic

### 8:1 Multiplexer

A multiplexer selects one of eight data inputs and forwards it to one output.

- Inputs: D0, D1, D2, D3, D4, D5, D6, D7
- Select lines: S2, S1, S0
- Output: Y
- Number of channels: 2³ = 8

The select value is calculated as:

`n = 4 × S2 + 2 × S1 + S0`

The output is:

`Y = D[n]`

### 1:8 Demultiplexer

A demultiplexer routes one data input D to one of eight outputs.

- Input: D
- Select lines: S2, S1, S0
- Outputs: Y0 through Y7

For selected output n:

`Yn = D`

Every other output is 0.

The output vector is displayed in the order **Y7 Y6 Y5 Y4 Y3 Y2 Y1 Y0**.

## Project structure

```text
8-bit-mux-demux-simulator/
├── index.html
├── styles.css
├── script.js
├── README.md
├── LICENSE
├── .gitignore
└── assets/
    └── (reserved for additional project images)
```

## Run locally

### Option 1: simplest

1. Download or clone this repository.
2. Open `index.html` in a modern browser.

### Option 2: VS Code Live Server

1. Open the project folder in VS Code.
2. Install the **Live Server** extension (optional).
3. Right-click `index.html`.
4. Select **Open with Live Server**.

There is no `npm install` step and no server process to start.

## Deploy on GitHub Pages

1. Create a public repository on GitHub, for example `8-bit-mux-demux-simulator`.
2. Upload all project files and folders from this project.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Choose branch **main** and folder **/(root)**.
6. Click **Save**.
7. Wait for GitHub Pages to publish the site. The URL will look like:

   `https://YOUR-USERNAME.github.io/8-bit-mux-demux-simulator/`

8. Open the URL and test both simulator modes.

If you use a different repository name, your published URL will use that name.

## Test checklist

- [ ] MUX: set D0 = 1 and select 000. Output Y should be 1.
- [ ] MUX: set D7 = 1 and select 111. Output Y should be 1.
- [ ] MUX: set D7 = 1 and select 000. Output Y should remain 0 if D0 = 0.
- [ ] DEMUX: set D = 1 and select 101. Only Y5 should be 1.
- [ ] DEMUX: set D = 0. All outputs should be 0.
- [ ] Reset should set every input and select bit to 0.
- [ ] Check the site on a narrow/mobile browser width.

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- SVG for circuit visualization
- GitHub Pages for static hosting

## Author

Add your name, course, institution and academic session here before submission.

## License

MIT License. See [LICENSE](LICENSE).
