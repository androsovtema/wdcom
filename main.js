/**
 * We Designerz — Main JavaScript
 * Общие функции для всех страниц
 */

/* global Audio */

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
    document.body.classList.toggle('menu-open', isOpen);
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
     TELEGRAM BUTTONS
     ==================== */
  const telegramBtns = document.querySelectorAll('.btn-start');
  telegramBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // If it's a button, open the link
      if (btn.tagName === 'BUTTON') {
        window.open('https://t.me/androsovart', '_blank');
      }
    });
  });

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

  /* ====================
     CAROUSEL INTERACTIVITY & PHYSICS
     ==================== */
  const carouselWrapper = document.querySelector('.carousel-wrapper');
  const carouselTrack = document.querySelector('.carousel-track');
  const carouselImages = document.querySelectorAll('.carousel-item img');

  if (carouselWrapper && carouselTrack && carouselImages.length > 0) {
    // 1. Появление изображений
    let loadedCount = 0;
    function markImageLoaded(img) {
      if (img && !img.classList.contains('loaded')) {
        img.classList.add('loaded');
        if (img.parentElement) img.parentElement.classList.add('loaded');
      }
    }
    carouselImages.forEach(img => {
      // Отключаем нативный drag & drop изображений
      img.addEventListener('dragstart', e => e.preventDefault());

      if (img.complete && img.naturalHeight !== 0) {
        markImageLoaded(img);
        loadedCount++;
      } else {
        img.addEventListener('load', () => { markImageLoaded(img); loadedCount++; }, { once: true });
        img.addEventListener('error', () => { markImageLoaded(img); loadedCount++; }, { once: true });
      }
    });

    // Запускаем карусель плавно
    setTimeout(() => {
      carouselImages.forEach(markImageLoaded);
      carouselWrapper.classList.add('loaded');
    }, 2000);

    // 2. Движение и физика
    let currentX = 0;
    let autoScrollingSpeed = 1; // px per frame
    let isDragging = false;
    let startX = 0;
    let currentDragX = 0;
    let dragVelocity = 0;
    let lastTime = performance.now();
    let lastDragX = 0;

    function updateCarousel(time) {
      if (!lastTime) lastTime = time;
      lastTime = time;

      // Ширина оригинального набора картинок (трек содержит дубли для бесконечности)
      const trackWidth = carouselTrack.scrollWidth / 2;

      if (isDragging) {
        // Движемся за курсором/пальцем
        const dx = currentDragX - lastDragX;
        currentX -= dx;

        // Вычисляем скорость
        dragVelocity = dx;
        lastDragX = currentDragX;
      } else {
        // Авто скролл + инерция
        currentX += autoScrollingSpeed - dragVelocity;
        dragVelocity *= 0.95; // затухание
        if (Math.abs(dragVelocity) < 0.1) dragVelocity = 0;
      }

      // Бесконечный цикл
      if (currentX >= trackWidth) {
        currentX -= trackWidth;
      } else if (currentX <= 0) {
        currentX += trackWidth;
      }

      // Вычисляем наклон в зависимости от скорости
      const currentSpeed = isDragging ? dragVelocity : (dragVelocity - autoScrollingSpeed);
      let skewAngle = currentSpeed * 0.3;
      skewAngle = Math.max(-10, Math.min(10, skewAngle));

      // Применяем трансформации (минус тк мы двигаем влево)
      carouselTrack.style.transform = `translateX(${-currentX}px) skewX(${skewAngle}deg)`;

      requestAnimationFrame(updateCarousel);
    }

    requestAnimationFrame(updateCarousel);

    // Обработчики мыши и тачпада
    let startY = 0;
    let isTouchMove = false;

    const startDrag = (e) => {
      isDragging = true;
      isTouchMove = e.type.includes('touch');
      startX = isTouchMove ? e.touches[0].pageX : e.pageX;
      startY = isTouchMove ? e.touches[0].pageY : e.pageY;
      currentDragX = startX;
      lastDragX = startX;
      dragVelocity = 0;
    };

    const onDrag = (e) => {
      if (!isDragging) return;

      if (isTouchMove) {
        const currentY = e.touches[0].pageY;
        const currentX = e.touches[0].pageX;

        const deltaX = Math.abs(currentX - startX);
        const deltaY = Math.abs(currentY - startY);

        // Значительное движение по горизонтали предотвращает вертикальный скролл страницы
        if (deltaX > deltaY && deltaX > 5) {
          if (e.cancelable) e.preventDefault();
        }

        currentDragX = currentX;
      } else {
        currentDragX = e.pageX;
      }
    };

    const stopDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      isTouchMove = false;
    };

    // Touch events - preventDefault requires non-passive event listeners for touchmove
    carouselTrack.addEventListener('touchstart', startDrag, { passive: true });
    window.addEventListener('touchmove', onDrag, { passive: false });
    window.addEventListener('touchend', stopDrag);
    window.addEventListener('touchcancel', stopDrag);

    // Mouse events
    carouselTrack.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);

    // Пауза при наведении
    carouselTrack.addEventListener('mouseenter', () => {
      autoScrollingSpeed = 0;
    });
    carouselTrack.addEventListener('mouseleave', () => {
      autoScrollingSpeed = 1;
      stopDrag();
    });
  }

  /* ====================
     CLIENTS LOGOS MARQUEE
     Плавная бегущая строка логотипов
     ==================== */
  const marqueeTrack = document.querySelector('.logos-marquee-track');
  if (marqueeTrack) {
    // Удаляем CSS-анимацию и делаем плавный скролл через JS
    marqueeTrack.style.animation = 'none';
    
    let position = 0;
    let speed = 0.5; // пикселей за кадр
    let isPaused = false;
    let rafId = null;
    
    // Получаем ширину оригинального контента (первые 10 элементов)
    const originalContentWidth = () => {
      const items = marqueeTrack.querySelectorAll('.logo-item');
      let width = 0;
      for (let i = 0; i < 10; i++) {
        if (items[i]) {
          width += items[i].offsetWidth + 80; // gap
        }
      }
      return width;
    };
    
    let contentWidth = originalContentWidth();
    
    function animate() {
      if (!isPaused) {
        position += speed;
        
        // Когда прошли половину (один полный набор), сбрасываем в 0
        if (position >= contentWidth) {
          position = 0;
        }
        
        marqueeTrack.style.transform = `translateX(-${position}px)`;
      }
      rafId = requestAnimationFrame(animate);
    }
    
    // Пауза при наведении
    marqueeTrack.addEventListener('mouseenter', () => {
      isPaused = true;
    });
    marqueeTrack.addEventListener('mouseleave', () => {
      isPaused = false;
    });
    
    // Обновляем ширину при ресайзе
    window.addEventListener('resize', () => {
      contentWidth = originalContentWidth();
    });
    
    // Запускаем анимацию
    animate();
  }

  /* ====================
     CLIENTS LOGOS PROTECTION
     Защита логотипов от скачивания
     ==================== */
  const clientLogos = document.querySelectorAll('.clients-logos .logo-item img');
  clientLogos.forEach(logo => {
    // Блокировка контекстного меню (правый клик)
    logo.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });
    // Блокировка drag & drop
    logo.addEventListener('dragstart', (e) => {
      e.preventDefault();
      return false;
    });
  });
})();
