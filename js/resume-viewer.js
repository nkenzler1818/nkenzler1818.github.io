(function () {
  function initResumeViewer() {
    var buttons = document.querySelectorAll('.resume-pdf-btn');
    if (!buttons.length) return;

    document.body.insertAdjacentHTML('beforeend',
      '<div id="resume-pdf-overlay" class="pdf-popup-overlay hidden">' +
        '<div class="pdf-popup-wrapper">' +
          '<div class="pdf-popup-content">' +
            '<iframe id="resume-pdf-frame" src="" class="pdf-popup-frame" title="Resume PDF"></iframe>' +
          '</div>' +
          '<button class="pdf-popup-close" id="resume-pdf-close" aria-label="Close PDF viewer">' +
            '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>'
    );

    var overlay = document.getElementById('resume-pdf-overlay');
    var frame = document.getElementById('resume-pdf-frame');
    var closeBtn = document.getElementById('resume-pdf-close');
    var resumeSrc = '../assets/docs/Kenzler_CV2026.pdf#view=FitH';

    function isIOS() {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }

    function openPdf() {
      if (isIOS()) {
        window.open(resumeSrc.split('#')[0], '_blank');
        return;
      }
      frame.src = resumeSrc;
      overlay.classList.remove('hidden');
      overlay.style.display = 'flex';
      requestAnimationFrame(function () { overlay.classList.add('active'); });
      document.body.style.overflow = 'hidden';
    }

    function closePdf() {
      overlay.classList.remove('active');
      setTimeout(function () {
        overlay.classList.add('hidden');
        overlay.style.display = 'none';
        frame.src = '';
      }, 250);
      document.body.style.overflow = '';
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        openPdf();
      });
    });

    closeBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      closePdf();
    });

    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) closePdf();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !overlay.classList.contains('hidden')) closePdf();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initResumeViewer);
  } else {
    initResumeViewer();
  }
}());
