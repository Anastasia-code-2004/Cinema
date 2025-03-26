document.addEventListener("DOMContentLoaded", function() {
    // Чтение значений из hidden input
    const sliderDelay = document.getElementById("sliderDelay").value;

    // Чтение параметров сессии, переданных через template context
    const loop = document.getElementById("loop").value;
    const navs = document.getElementById("navs").value;
    const pags = document.getElementById("pags").value;
    const auto = document.getElementById("auto").value;
    const stopMouseHover = document.getElementById("stopMouseHover").value;

    class Slider {
        constructor(options) {
            this.slides = document.querySelectorAll(".slide");
            this.prevBtn = document.querySelector(".prev-btn");
            this.nextBtn = document.querySelector(".next-btn");
            this.pagination = document.querySelector(".pagination");
            this.slideNumber = document.querySelector(".slide-number");

            this.slideCount = this.slides.length;
            this.currentSlide = 0;
            this.isHovering = false;

            this.settings = {
                loop: options.loop ?? true,
                navs: options.navs ?? true,
                pags: options.pags ?? true,
                auto: options.auto ?? true,
                stopMouseHover: options.stopMouseHover ?? true,
                delay: options.delay ?? 5000
            };

            this.init();
        }

        init() {
            this.showSlide(this.currentSlide);
            if (this.settings.pags) this.createPagination();
            if (this.settings.auto) this.autoRotate();
            if (this.settings.stopMouseHover) this.handleHover();

            if (this.settings.navs) {
                this.prevBtn.addEventListener("click", () => this.showSlide(this.currentSlide - 1));
                this.nextBtn.addEventListener("click", () => this.showSlide(this.currentSlide + 1));
            } else {
                this.prevBtn.style.display = "none";
                this.nextBtn.style.display = "none";
            }

            // Обработчик кликов по слайдам для перехода на страницу новости
            this.slides.forEach(slide => {
                slide.addEventListener("click", () => {
                    const newsId = slide.getAttribute("data-id");
                    if (newsId) {
                        window.location.href = `/news/${newsId}/`; // относительно корня текущего сайта
                    }
                });
            });
        }

        showSlide(index) {
            if (this.settings.loop) {
                this.currentSlide = (index + this.slideCount) % this.slideCount;
            } else {
                this.currentSlide = Math.max(0, Math.min(index, this.slideCount - 1));
            }

            this.slides.forEach((slide, i) => {
                slide.style.display = (i === this.currentSlide) ? "block" : "none";
            });

            this.updatePagination();
            this.updateSlideNumber();
        }

        updateSlideNumber() {
            if (this.slideNumber) {
                this.slideNumber.textContent = `${this.currentSlide + 1} / ${this.slideCount}`;
            }
        }

        createPagination() {
            this.pagination.innerHTML = '';
            for (let i = 0; i < this.slideCount; i++) {
                const pageDot = document.createElement('span');
                pageDot.classList.add('pagination-dot');
                if (i === this.currentSlide) pageDot.classList.add('active');
                pageDot.addEventListener('click', () => this.showSlide(i));
                this.pagination.appendChild(pageDot);
            }
        }

        updatePagination() {
            if (this.pagination) {
                const dots = this.pagination.querySelectorAll(".pagination-dot");
                dots.forEach(dot => dot.classList.remove("active"));
                if (dots[this.currentSlide]) {
                    dots[this.currentSlide].classList.add("active");
                }
            }
        }

        autoRotate() {
            setInterval(() => {
                if (!this.isHovering) {
                    this.showSlide(this.currentSlide + 1);
                }
            }, this.settings.delay);
        }

        handleHover() {
            const sliderContainer = document.querySelector(".slider-container");
            sliderContainer.addEventListener("mouseenter", () => this.isHovering = true);
            sliderContainer.addEventListener("mouseleave", () => this.isHovering = false);
        }
    }

    // Инициализируем слайдер с переданными параметрами
    const slider = new Slider({
        loop: loop,
        navs: navs,
        pags: pags,
        auto: auto,
        stopMouseHover: stopMouseHover,
        delay: sliderDelay
    });
});
