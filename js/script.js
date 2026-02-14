document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Toggle hamburger animation
            const bars = mobileMenuBtn.querySelectorAll('.bar');
            if (mobileMenuBtn.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }
    
    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                mobileMenuBtn.click();
            }
        });
    });
    
    // Active navigation link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.add('active');
            } else {
                document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.remove('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animate elements on scroll
    const animateElements = document.querySelectorAll('.service-card, .about-image, .about-text, .contact-item');
    
    function checkIfInView() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial styles for animation
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', checkIfInView);
    window.addEventListener('load', checkIfInView);
    
    // Current year for copyright
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement && yearElement.textContent.includes('2025')) {
        const currentYear = new Date().getFullYear();
        if (currentYear !== 2025) {
            yearElement.textContent = yearElement.textContent.replace('2025', currentYear);
        }
    }
    
    // Vacation Popup
    initVacationPopup();
});

function getTodayString() {
    const now = new Date();
    return now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0');
}

function shouldShowPopup(config, today) {
    if (!config.enabled) return false;
    if (!config.vacationStart || !config.vacationEnd) return false;

    var dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(config.vacationStart) || !dateRegex.test(config.vacationEnd)) return false;
    if (config.vacationEnd < config.vacationStart) return false;

    var showFrom;
    if (config.showFrom && dateRegex.test(config.showFrom)) {
        showFrom = config.showFrom;
    } else {
        var parts = config.vacationStart.split('-');
        var startDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        startDate.setDate(startDate.getDate() - 14);
        showFrom = startDate.getFullYear() + '-' +
            String(startDate.getMonth() + 1).padStart(2, '0') + '-' +
            String(startDate.getDate()).padStart(2, '0');
    }

    return today >= showFrom && today <= config.vacationEnd;
}

function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function formatDateRange(startStr, endStr) {
    var startParts = startStr.split('-');
    var endParts = endStr.split('-');
    var startDate = new Date(Number(startParts[0]), Number(startParts[1]) - 1, Number(startParts[2]));
    var endDate = new Date(Number(endParts[0]), Number(endParts[1]) - 1, Number(endParts[2]));

    var startDay = startDate.getDate();
    var startMonth = startDate.getMonth() + 1;
    var startWeekday = startDate.toLocaleDateString('cs-CZ', { weekday: 'long' });

    var endDay = endDate.getDate();
    var endMonth = endDate.getMonth() + 1;
    var endYear = endDate.getFullYear();
    var endWeekday = endDate.toLocaleDateString('cs-CZ', { weekday: 'long' });

    var startFormatted = startDay + '.' + startMonth + '. (' + startWeekday + ')';
    var endFormatted = endDay + '.' + endMonth + '.' + endYear + ' (' + endWeekday + ')';

    if (startParts[0] !== endParts[0]) {
        startFormatted = startDay + '.' + startMonth + '.' + startParts[0] + ' (' + startWeekday + ')';
    }

    return startFormatted + ' až ' + endFormatted;
}

function renderPopup(config) {
    var container = document.getElementById('vacation-popup');
    if (!container) return;

    var dateRange = formatDateRange(config.vacationStart, config.vacationEnd);

    var substituteHtml = '';
    if (config.substituteDoctor && config.substituteDoctor.trim()) {
        substituteHtml =
            '<p>Akutní neodkladnou péči Vám po předchozí telefonické domluvě zajistí ' +
            escapeHtml(config.substituteDoctor) + '.</p>' +
            '<p>Pokud se obracíte na zastupující lékařku, mějte vždy k dispozici ' +
            'své rodné číslo, číslo pojišťovny, názvy a síly léků, které užíváte.</p>';
    }

    container.innerHTML =
        '<div class="popup-content" role="dialog" aria-modal="true">' +
            '<span class="close-popup" aria-label="Zavřít">&times;</span>' +
            '<h3>Dovolená</h3>' +
            '<p>Vážení pacienti,</p>' +
            '<p>dovoluji si Vás informovat, že ordinace bude z důvodu dovolené ' +
            'uzavřena ve dnech <strong>' + dateRange + '</strong>.</p>' +
            substituteHtml +
            '<p>Během dovolené se můžete s objednávkami obracet i na zdravotní sestru ' +
            'paní Macounovou na telefonu <a href="tel:+420725875487">725 875 487</a>.</p>' +
            '<p>Děkuji za pochopení.</p>' +
        '</div>';

    setTimeout(function() {
        container.classList.add('show');
    }, 500);

    var closeBtn = container.querySelector('.close-popup');

    function closePopup() {
        container.classList.remove('show');
        setTimeout(function() {
            container.style.display = 'none';
        }, 300);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closePopup);
    }

    container.addEventListener('click', function(e) {
        if (e.target === container) {
            closePopup();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && container.classList.contains('show')) {
            closePopup();
        }
    });
}

async function initVacationPopup() {
    try {
        var response = await fetch('vacation.json', { cache: 'no-cache' });
        if (!response.ok) return;
        var config = await response.json();

        if (!shouldShowPopup(config, getTodayString())) return;

        renderPopup(config);
    } catch (e) {
        // Silent failure — no popup is better than a broken page
    }
}