/**
 * We Designerz — Main JavaScript
 * Общие функции для всех страниц
 */

(function () {
  'use strict';

  /* ====================
     BURGER MENU
     ==================== */
  const burger = document.getElementById('burger');
  const nav = document.querySelector('.nav');
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav a');

  function toggleMenu(isOpen) {
    if (!burger || !nav || !header) return;

    burger.classList.toggle('open', isOpen);
    nav.classList.toggle('open', isOpen);
    header.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    toggleMenu(false);
  }

  if (burger && nav && header) {
    // Открытие/закрытие по клику на бургер
    burger.addEventListener('click', () => {
      const isOpen = !burger.classList.contains('open');
      toggleMenu(isOpen);
    });

    // Закрытие при клике на ссылку в меню
    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Закрытие при клике вне меню
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') &&
        !nav.contains(e.target) &&
        !burger.contains(e.target)) {
        closeMenu();
      }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  /* ====================
     LOGO SCROLL ANIMATION
     ==================== */
  let lastScroll = 0;
  let ticking = false;

  function handleScroll() {
    if (!header) return;

    const currentScroll = window.scrollY;

    // Добавляем/удаляем класс только если состояние изменилось
    const shouldBeScrolled = currentScroll > 100;
    const isScrolled = header.classList.contains('scrolled');

    if (shouldBeScrolled && !isScrolled) {
      header.classList.add('scrolled');
    } else if (!shouldBeScrolled && isScrolled) {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
    ticking = false;
  }

  // Throttle для производительности
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  /* ====================
     SMOOTH SCROLL
     ==================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  /* ====================
     DYNAMIC TEXT ANIMATION (Hero)
     ==================== */
  const words = document.querySelectorAll('.dynamic-text');

  if (words.length > 0) {
    let wordIndex = 0;

    function changeWord() {
      const currentWord = words[wordIndex];
      const nextIndex = (wordIndex + 1) % words.length;
      const nextWord = words[nextIndex];

      if (!currentWord || !nextWord) return;

      // Убираем текущее слово
      currentWord.classList.remove('active');
      currentWord.classList.add('exit');

      // Показываем новое слово
      nextWord.classList.remove('exit');
      nextWord.classList.add('active');

      // Очищаем класс exit после завершения анимации
      setTimeout(() => {
        currentWord.classList.remove('exit');
      }, 800);

      wordIndex = nextIndex;
    }

    // Запускаем смену слов каждые 2.5 секунды
    setInterval(changeWord, 2500);
  }

  /* ====================
     AUDIO PLAYERS (About page)
     ==================== */
  const audioBtns = document.querySelectorAll('.audio-btn');
  let currentAudio = null;
  let currentBtn = null;

  if (audioBtns.length > 0) {
    audioBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const audioSrc = btn.getAttribute('data-audio');

        if (!audioSrc) {
          console.warn('Audio button has no data-audio attribute:', btn);
          return;
        }

        // Если уже играет этот же аудио — ставим на паузу
        if (currentAudio && currentBtn === btn && !currentAudio.paused) {
          currentAudio.pause();
          btn.classList.remove('playing');
          btn.textContent = 'Послушать отзыв';
          return;
        }

        // Если играет другой аудио — останавливаем
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
          if (currentBtn) {
            currentBtn.classList.remove('playing');
            currentBtn.textContent = 'Послушать отзыв';
          }
        }

        // Создаём новое аудио с обработкой ошибок
        try {
          currentAudio = new Audio(audioSrc);
          currentBtn = btn;

          // Обработка успешного окончания
          currentAudio.addEventListener('ended', () => {
            btn.classList.remove('playing');
            btn.textContent = 'Послушать отзыв';
            currentAudio = null;
            currentBtn = null;
          });

          // Обработка ошибок загрузки
          currentAudio.addEventListener('error', (e) => {
            console.error('Audio loading error:', audioSrc, e);
            btn.classList.remove('playing');
            btn.textContent = 'Ошибка загрузки';
            currentAudio = null;
            currentBtn = null;

            // Возвращаем текст через 2 секунды
            setTimeout(() => {
              btn.textContent = 'Послушать отзыв';
            }, 2000);
          });

          // Пробуем воспроизвести
          const playPromise = currentAudio.play();

          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                btn.classList.add('playing');
                btn.textContent = 'Пауза';
              })
              .catch(error => {
                console.error('Audio play error:', error);
                btn.classList.remove('playing');
                btn.textContent = 'Ошибка воспроизведения';
                currentAudio = null;
                currentBtn = null;

                setTimeout(() => {
                  btn.textContent = 'Послушать отзыв';
                }, 2000);
              });
          }
        } catch (error) {
          console.error('Audio creation error:', error);
          btn.textContent = 'Ошибка';
          setTimeout(() => {
            btn.textContent = 'Послушать отзыв';
          }, 2000);
        }
      });
    });
  }

  /* ====================
     PROJECTS FILTER (Projects page)
     ==================== */
  const filterTags = document.querySelectorAll('.filter-tag');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterTags.length > 0 && projectCards.length > 0) {
    // Add transition styles to project cards
    projectCards.forEach(card => {
      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });

    filterTags.forEach(tag => {
      tag.addEventListener('click', () => {
        // Update active state
        filterTags.forEach(t => t.classList.remove('active'));
        tag.classList.add('active');

        const filter = tag.getAttribute('data-filter');
        if (!filter) return;

        // Filter projects
        projectCards.forEach(card => {
          const cardTags = card.getAttribute('data-tags');

          if (filter === 'all') {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else if (cardTags && cardTags.includes(filter)) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

})();
