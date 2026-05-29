/**
 * SRE Portfolio Interactive Script
 * Anoop Puthan Veettil
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Modules
  initThemeToggle();
  initDashboardTelemetry();
  initTerminalShell();
  initTopologyVisualizer();
  initFloatingWidget();
});

/* ==========================================================================
   1. DASHBOARD METRICS: Live simulated telemetry to make dashboard feel alive
   ========================================================================== */
function initDashboardTelemetry() {
  const uptimeCard = document.getElementById('metric-uptime');
  const capacityEl = document.getElementById('capacity-value');
  
  if (!uptimeCard || !capacityEl) return;

  // Slowly simulate slightly shifting requests/uptime stats to indicate active tracking
  setInterval(() => {
    // Standard deviation in SLO logs
    const uptimeValues = ['99.999%', '99.998%', '99.999%', '100.000%', '99.999%'];
    const selectedUptime = uptimeValues[Math.floor(Math.random() * uptimeValues.length)];
    const valueEl = uptimeCard.querySelector('.metric-value');
    if (valueEl) {
      valueEl.textContent = selectedUptime;
    }
  }, 12000);

  // Subtle pulsing glow on metrics
  const cards = document.querySelectorAll('.metric-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-2px)';
      card.style.borderColor = 'var(--border-glow)';
      card.style.boxShadow = 'var(--shadow-glow)';
      card.style.transition = 'all 0.2s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.borderColor = 'var(--border-color)';
      card.style.boxShadow = 'var(--shadow-soft)';
    });
  });
}

/* ==========================================================================
   2. INTERACTIVE SRE TERMINAL: Retro CLI Command Parsing & Audio Synthesis
   ========================================================================== */
function initTerminalShell() {
  const input = document.getElementById('terminal-input');
  const screen = document.getElementById('terminal-screen');
  const audioToggle = document.getElementById('audio-toggle');
  
  if (!input || !screen) return;

  // Focus CLI when clicking terminal body
  const terminal = document.getElementById('console-terminal');
  if (terminal) {
    terminal.addEventListener('click', () => {
      input.focus();
    });
  }

  // Audio Toggle Switch
  let isMuted = false;
  if (audioToggle) {
    audioToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      isMuted = !isMuted;
      audioToggle.classList.toggle('muted', isMuted);
      audioToggle.setAttribute('title', isMuted ? 'Enable Key Press Sounds' : 'Mute Key Press Sounds');
    });
  }

  // Synthesized mechanical key sounds using Web Audio API (Zero external assets!)
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
  function playKeyClick() {
    if (isMuted) return;
    
    // Ensure Context is resumed
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Play click sound using highpass band noise synthesis
    const bufferSize = audioCtx.sampleRate * 0.05; // 50ms click
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000 + Math.random() * 800; // Mechanical spring click range
    filter.Q.value = 4;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    noise.start();
  }

  // Keydown Sound Trigger & Parser Activation
  input.addEventListener('keydown', (e) => {
    // Play clicking sound for normal character keys
    if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter') {
      playKeyClick();
    }

    if (e.key === 'Enter') {
      const command = input.value.trim();
      executeCommand(command);
      input.value = '';
    }
  });

  // Keep focus locked during CLI sessions
  document.addEventListener('keydown', () => {
    if (document.activeElement !== input && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      // Input only focuses if terminal is on screen
      const rect = terminal.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        input.focus();
      }
    }
  });

  // Command Execution Parser
  function executeCommand(rawCommand) {
    const command = rawCommand.toLowerCase().trim();
    
    // Create DOM echo of prompt
    const echoLine = document.createElement('div');
    echoLine.innerHTML = `<span class="terminal-prompt">visitor@anoop-sre:~$</span> ${escapeHTML(rawCommand)}`;
    
    const outputBlock = document.createElement('div');
    outputBlock.className = 'terminal-output-block';

    if (command === '') {
      screen.insertBefore(echoLine, input.closest('.terminal-input-line'));
      scrollToBottom();
      return;
    }

    switch (command) {
      case 'help':
        outputBlock.innerHTML = `
          <span class="text-accent">Available SRE Console Commands:</span><br>
          - <span class="command-highlight">about</span>      : Summary of Anoop's engineering role<br>
          - <span class="command-highlight">skills</span>     : Core tools, platforms, & scripting languages<br>
          - <span class="command-highlight">experience</span> : Vertical deployment timeline at Apple and others<br>
          - <span class="command-highlight">linkedin</span>   : Direct line to Anoop's LinkedIn Profile<br>
          - <span class="command-highlight">email</span>      : Direct mail contact link<br>
          - <span class="command-highlight">uptime</span>     : System reliability metrics<br>
          - <span class="command-highlight">clear</span>      : Clear SRE console screen logs<br>
          - <span class="command-highlight">sudo</span>       : Run as incident root commander
        `;
        break;

      case 'about':
        outputBlock.innerHTML = `
          Anoop Puthan Veettil is a <span class="text-accent">Production Engineer</span> at Meta Platforms (Content Integrity), 
          managing large-scale data pipelines and global compute infrastructure reliability. Former Senior SRE Tech Lead 
          at Apple Inc. with 20 years of experience across high-scale distributed environments (Kubernetes, Solr, DevOps).
        `;
        break;

      case 'skills':
        outputBlock.innerHTML = `
          <span class="text-accent">--- TECHNICAL SYSTEMS INVENTORY ---</span><br>
          • <span class="command-highlight">AI Agent Frameworks</span> : Langgraph, Langchain, LLM prompting, RAG pipelines<br>
          • <span class="command-highlight">Containers / Cloud</span>  : Kubernetes, Docker, On-prem clusters, AWS Cloud<br>
          • <span class="command-highlight">Observability & Logs</span>: Splunk SRE, Prometheus metrics, Grafana, OpenTelemetry, Hubble<br>
          • <span class="command-highlight">Data / Indexing</span>     : Apache Solr 8 Cluster Administration (3.5 PB scale), Redis, Postgres<br>
          • <span class="command-highlight">Code / Pipelines</span>   : Java 17, GoLang, Python 3, Bash, Helm, Spinnaker, Jenkins, Ansible
        `;
        break;

      case 'experience':
        outputBlock.innerHTML = `
          <span class="text-accent">--- DEPLOYMENT JOURNAL ---</span><br>
          • <span class="command-highlight">Meta Platforms [2026 - Present]</span>: Production Engineer (Content Integrity)<br>
            * Supports the Content Integrity team on pipeline health and SRE systems stability<br>
          • <span class="command-highlight">Apple Inc. [2017 - 2026]</span>: Senior SRE & SRE DRI Tech Lead<br>
            * Served as SRE DRI for critical Places and Maps Data ecosystems (300+ microservices)<br>
            * Developed K8s platform scaling systems, reducing cluster hardware footprints<br>
          • <span class="command-highlight">State Street IMS [2011 - 2017]</span>: DevOps Lead & Java Developer<br>
            * Created the first Jenkins CI build systems and automated database ETL pipelines<br>
          • <span class="command-highlight">Wellpoint Anthem [2010 - 2011]</span>: Java Developer & Tech Lead<br>
            * Coded spring batch database routines and enterprise store-front web APIs
        `;
        break;

      case 'linkedin':
        outputBlock.innerHTML = `
          Opening LinkedIn profile: <a href="https://www.linkedin.com/in/anoop-puthanveettil" target="_blank" class="command-highlight">linkedin.com/in/anoop-puthanveettil</a>...
        `;
        window.open('https://www.linkedin.com/in/anoop-puthanveettil', '_blank');
        break;

      case 'email':
        outputBlock.innerHTML = `
          Opening direct line: <a href="mailto:eee.anoop@gmail.com" class="command-highlight">eee.anoop@gmail.com</a>...
        `;
        window.location.href = 'mailto:eee.anoop@gmail.com';
        break;

      case 'uptime':
        outputBlock.innerHTML = `
          System: <span class="text-accent">Anoop SRE CLI Instance</span><br>
          SLO Status: Uptime nominal (100%)<br>
          Pagers: 0 Active Incidents<br>
          Solr Nodes status: Nominal. 3.5 Petabytes capacity active.
        `;
        break;

      case 'clear':
        // Wipe all previous screen lines
        const screenLines = screen.querySelectorAll('.terminal-log, .terminal-output-block, div:not(.terminal-input-line)');
        screenLines.forEach(line => line.remove());
        scrollToBottom();
        return;

      case 'sudo':
        outputBlock.innerHTML = `
          <span class="text-accent">[SUDO SYSTEM CONFIRMED]</span><br>
          Root clearance validated for Anoop. System availability locked at 100%. Pager duty automation successfully online! 🤖
        `;
        break;

      case 'theme':
        const toggleBtn = document.getElementById('theme-toggle-btn');
        if (toggleBtn) {
          toggleBtn.click();
          const isLight = document.documentElement.classList.contains('light-mode');
          outputBlock.innerHTML = `Theme toggled. Current environment state: <span class="text-accent">${isLight ? 'LIGHT' : 'DARK'} MODE</span>.`;
        } else {
          outputBlock.innerHTML = `Theme toggler interface not found.`;
        }
        break;

      default:
        outputBlock.innerHTML = `
          zsh: command not found: <span class="text-subtle">${escapeHTML(command)}</span>. 
          Type <span class="command-highlight">help</span> to view SRE shell commands.
        `;
    }

    // Append output to console
    screen.insertBefore(echoLine, input.closest('.terminal-input-line'));
    screen.insertBefore(outputBlock, input.closest('.terminal-input-line'));
    scrollToBottom();
  }

  // Scroll logic for CLI
  function scrollToBottom() {
    screen.scrollTop = screen.scrollHeight;
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
}

/* ==========================================================================
   3. SYSTEMS TOPOLOGY: Click events, Telemetry details, and Line pulses
   ========================================================================== */
function initTopologyVisualizer() {
  const nodes = document.querySelectorAll('.topo-node');
  const lines = document.querySelectorAll('.topo-line');
  const detailsPanel = document.getElementById('topo-details');
  const skillsTags = document.querySelectorAll('.skill-tag');
  
  if (nodes.length === 0 || !detailsPanel) return;

  const nodeTelemetry = {
    center: {
      tag: '[CORE SYSTEM CONTROLLER]',
      text: '<strong>Core SRE DRI & Architect Node:</strong> Owning SLA, release control, capacity automation, and operational performance metrics end-to-end across multiple global clusters and Petabyte data systems.'
    },
    meta: {
      tag: '[META CONTENT INTEGRITY]',
      text: '<strong>Meta Production Engineering (Remote):</strong> Supporting the Content Integrity team to ensure stability, performance, and SRE best practices across large-scale data pipelines and global compute infrastructure.'
    },
    places: {
      tag: '[PLACES PLATFORM METRICS]',
      text: '<strong>Places Cluster (20+ microservices):</strong> SLO Target: 99.999% availability. Designed and operationalized a tailored Kubernetes environment, maximizing resource density and cutting operational footprint.'
    },
    basemap: {
      tag: '[BASE MAP ECOSYSTEM]',
      text: '<strong>Base Map Services (300+ microservices):</strong> Architected unified Release Management automation. Highly skilled in active microservice troubleshooting and Java flight recorder profiling.'
    },
    solr: {
      tag: '[APACHE SOLR telemetry]',
      text: '<strong>Search & Index Platform Offering (35+ clusters):</strong> Telemetry state: Healthy. Managing 3.5 Petabytes of active, real-time search queries and logging indexes supporting global maps datasets.'
    },
    cicd: {
      tag: '[CI/CD PIPELINE STATUS]',
      text: '<strong>Deployment Automation pipelines:</strong> Real-time delivery using Helm Charts, Arches orchestration, and Spinnaker deployments. Auto-rollback rules configured for rapid MTTR reduction.'
    }
  };

  nodes.forEach(node => {
    // Click behavior
    node.addEventListener('click', () => {
      const targetNode = node.getAttribute('data-node');
      
      // Update nodes active status
      nodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');
      
      // Highlight lines linking active node
      lines.forEach(l => l.classList.remove('line-pulse'));
      const activeLine = document.getElementById(`line-${targetNode}`);
      if (activeLine) {
        activeLine.classList.add('line-pulse');
      }

      // Update Details Telemetry logs
      const telemetry = nodeTelemetry[targetNode];
      if (telemetry) {
        detailsPanel.innerHTML = `
          <div class="panel-tag">${telemetry.tag}</div>
          <div class="details-content">${telemetry.text}</div>
        `;
      }

      // Proactively highlight matching technical skill tags!
      skillsTags.forEach(tag => {
        const tagNode = tag.getAttribute('data-node');
        if (tagNode === targetNode || targetNode === 'center') {
          tag.classList.add('skill-highlight');
        } else {
          tag.classList.remove('skill-highlight');
        }
      });
    });

    // Handle accessibility keyboard activations
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        node.click();
      }
    });
  });

  // Enable highlight linking on skill tag clicks!
  skillsTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const nodeTarget = tag.getAttribute('data-node');
      if (nodeTarget) {
        const targetNodeEl = document.getElementById(`node-${nodeTarget}`);
        if (targetNodeEl) {
          targetNodeEl.click();
          // Scroll up slightly to visualizer if on mobile view
          if (window.innerWidth <= 1024) {
            document.getElementById('architecture').scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  });
}

/* ==========================================================================
   4. FLOATING SRE QUICK WIDGET: Contact drawers controls
   ========================================================================== */
function initFloatingWidget() {
  const widget = document.getElementById('sre-widget');
  const triggerBtn = document.getElementById('widget-trigger-btn');
  const cardPanel = document.getElementById('widget-card-panel');

  if (!widget || !triggerBtn || !cardPanel) return;

  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = widget.classList.toggle('expanded');
    
    // Accessibility focus updates
    triggerBtn.setAttribute('aria-expanded', isExpanded);
    cardPanel.setAttribute('aria-hidden', !isExpanded);
  });

  // Close widget when clicking outside
  document.addEventListener('click', (e) => {
    if (widget.classList.contains('expanded') && !widget.contains(e.target)) {
      widget.classList.remove('expanded');
      triggerBtn.setAttribute('aria-expanded', 'false');
      cardPanel.setAttribute('aria-hidden', 'true');
    }
  });

  // Handle ESC close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && widget.classList.contains('expanded')) {
      widget.classList.remove('expanded');
      triggerBtn.setAttribute('aria-expanded', 'false');
      cardPanel.setAttribute('aria-hidden', 'true');
      triggerBtn.focus();
    }
  });
}

/* ==========================================================================
   5. LIGHT / DARK THEME TOGGLE: Live color-scheme swap and storage
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  // Retrieve saved preference
  const savedTheme = localStorage.getItem('theme');
  
  // Dashboard defaults to dark mode first, only activating light mode if explicitly saved
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-mode');
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isLight = document.documentElement.classList.toggle('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}
