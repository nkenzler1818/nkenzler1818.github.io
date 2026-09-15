// Sneak peek disclosure. Open without JS; the head guard collapses it before paint.
(() => {
    window.pcPreviewReady = true;
    const section = document.getElementById('pc-preview');
    const toggle = document.getElementById('pc-preview-toggle');
    const panel = document.getElementById('pc-preview-panel');
    if (!section || !toggle || !panel) {
        document.documentElement.classList.remove('pc-js');
        return;
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let settleTimer;
    const setOpen = (open) => {
        clearTimeout(settleTimer);
        section.classList.toggle('is-open', open);
        section.classList.remove('is-settled');
        toggle.setAttribute('aria-expanded', String(open));
        panel.inert = !open;
        // Let shadows and focus rings show once the panel has finished opening.
        if (open) settleTimer = setTimeout(() => section.classList.add('is-settled'), reduce.matches ? 0 : 560);
    };
    toggle.addEventListener('click', () => setOpen(!section.classList.contains('is-open')));
    setOpen(false);
})();

// Load the 3D engine and model only when a visitor chooses to explore.
(() => {
    const stage = document.getElementById('pc-preview-stage');
    const loadButton = document.getElementById('pc-preview-load');
    const resetButton = document.getElementById('pc-preview-reset');
    const status = document.getElementById('pc-preview-status');
    if (!stage || !loadButton || !resetButton || !status) return;

    const defaultOrbit = '-45deg 68deg auto';
    const modelURL = new URL('../assets/models/nathanael-pc-v45.glb', document.baseURI).href;
    let viewer;
    let attempt = 0;
    loadButton.hidden = false;

    loadButton.addEventListener('click', async () => {
        const currentAttempt = ++attempt;
        let finished = false;
        let timer;
        loadButton.disabled = true;
        loadButton.textContent = 'Loading preview...';
        status.textContent = 'Loading the interactive model.';
        stage.setAttribute('aria-busy', 'true');

        const fail = () => {
            if (finished || currentAttempt !== attempt) return;
            finished = true;
            clearTimeout(timer);
            viewer?.remove();
            stage.classList.remove('is-ready');
            stage.removeAttribute('aria-busy');
            resetButton.hidden = true;
            loadButton.hidden = false;
            loadButton.disabled = false;
            loadButton.textContent = 'Try 3D again';
            status.textContent = 'The 3D preview could not load. You can still enjoy the image above.';
        };

        timer = setTimeout(fail, 45000);
        try {
            // Pin the standalone bundle. A retry gets a fresh module request.
            if (!customElements.get('model-viewer')) {
                await import(`https://cdn.jsdelivr.net/npm/@google/model-viewer@4.3.1/dist/model-viewer.min.js?attempt=${currentAttempt}`);
            }
            if (finished || currentAttempt !== attempt) return;
            viewer = document.createElement('model-viewer');
            viewer.id = 'pc-model';
            const attributes = {
                src: currentAttempt === 1 ? modelURL : `${modelURL}?retry=${currentAttempt}`,
                alt: 'Interactive model of my PC. Use the arrow keys to look around.',
                'camera-controls': '',
                'disable-pan': '',
                'disable-zoom': '',
                'touch-action': 'pan-y',
                'camera-orbit': defaultOrbit,
                'min-camera-orbit': 'auto 0deg auto',
                'max-camera-orbit': 'auto 180deg auto',
                'field-of-view': '30deg',
                exposure: '1',
                'shadow-intensity': '0',
                'interaction-prompt': 'none'
            };
            for (const [name, value] of Object.entries(attributes)) viewer.setAttribute(name, value);
            viewer.addEventListener('load', () => {
                if (finished || currentAttempt !== attempt) return;
                clearTimeout(timer);
                stage.classList.add('is-ready');
                stage.removeAttribute('aria-busy');
                loadButton.hidden = true;
                resetButton.hidden = false;
                status.textContent = 'Drag left or right to look around, or use the arrow keys.';
            }, { once: true });
            viewer.addEventListener('poster-dismissed', () => {
                // Focus only once the viewer's keyboard surface becomes visible.
                viewer.shadowRoot?.querySelector('[tabindex="0"]')?.focus({ preventScroll: true });
            }, { once: true });
            viewer.addEventListener('error', fail);
            stage.appendChild(viewer);
        } catch (error) {
            fail();
        }
    });

    resetButton.addEventListener('click', () => {
        if (!viewer) return;
        viewer.cameraOrbit = defaultOrbit;
        // Reset without adding an unsolicited camera animation.
        viewer.jumpCameraToGoal();
    });
})();
