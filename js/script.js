// ===== CONFIGURACIÓN INICIAL =====
// Esperamos a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== NAVEGACIÓN MÓVIL =====
    // Obtenemos referencias a los elementos del menú hamburguesa
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Función para alternar el menú móvil
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }
    
    // Event listener para el botón hamburguesa
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Cerrar el menú móvil al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // ===== NAVEGACIÓN SUAVE =====
    // Función para hacer scroll suave a las secciones
    function smoothScroll(target) {
        const element = document.querySelector(target);
        if (element) {
            const offsetTop = element.offsetTop - 80; // 80px para compensar la navegación fija
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
    
    // Event listeners para los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Previene el comportamiento por defecto del enlace
            
            const target = this.getAttribute('href');
            if (target.startsWith('#')) {
                smoothScroll(target);
            }
        });
    });
    
    // ===== FORMULARIO DE CONTACTO =====
    // Obtenemos referencia al formulario de contacto
    const contactForm = document.getElementById('contactForm');
    
    // Función para manejar el envío del formulario
    function handleFormSubmit(e) {
        e.preventDefault(); // Previene el envío por defecto del formulario
        
        // Obtenemos los valores de los campos del formulario
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const mensaje = document.getElementById('mensaje').value;
        
        // Validación básica de campos
        if (!nombre || !email || !mensaje) {
            alert('Por favor, completa todos los campos del formulario.');
            return;
        }
        
        // Validación básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, ingresa un correo electrónico válido.');
            return;
        }
        
        // Simulamos el envío del formulario
        console.log('Formulario enviado correctamente');
        console.log('Datos del formulario:', {
            nombre: nombre,
            email: email,
            mensaje: mensaje,
            fecha: new Date().toLocaleString()
        });
        
        // Mostramos mensaje de confirmación al usuario
        alert('¡Mensaje enviado correctamente! Te contactaré pronto.');
        
        // Limpiamos el formulario
        contactForm.reset();
    }
    
    // Event listener para el formulario de contacto
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // ===== EFECTOS DE SCROLL REVEAL ESTILO APPLE =====
    // Función para agregar efectos cuando los elementos son visibles
    function handleScrollEffects() {
        const elements = document.querySelectorAll('.experience-card, .project-card, .section-title, .section-subtitle');
        
        elements.forEach((element, index) => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 100;
            
            if (elementTop < window.innerHeight - elementVisible) {
                // Agregar delay escalonado para efecto cascada
                setTimeout(() => {
                    element.classList.add('active');
                }, index * 100);
            }
        });
    }
    
    // Función para agregar clase reveal a elementos
    function addRevealClass() {
        const elements = document.querySelectorAll('.experience-card, .project-card, .section-title, .section-subtitle');
        elements.forEach(element => {
            element.classList.add('reveal');
        });
    }
    
    // Inicializar clases reveal
    addRevealClass();
    
    // Event listener para el scroll con throttling
    let ticking = false;
    function updateScrollEffects() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScrollEffects();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', updateScrollEffects);
    
    // ===== EFECTOS EN BOTONES DE PROYECTOS =====
    // Obtenemos todos los botones "Ver más" de los proyectos
    const projectButtons = document.querySelectorAll('.project-btn');
    
    // Función para manejar el clic en los botones de proyecto
    function handleProjectButtonClick(e) {
        e.preventDefault();
        
        // Obtenemos el título del proyecto desde el botón
        const projectCard = e.target.closest('.project-card');
        const projectTitle = projectCard.querySelector('h3').textContent;
        
        // Simulamos la acción de "Ver más"
        console.log(`Ver más detalles del proyecto: ${projectTitle}`);
        alert(`Próximamente podrás ver más detalles sobre: ${projectTitle}`);
    }
    
    // Event listeners para los botones de proyecto
    projectButtons.forEach(button => {
        button.addEventListener('click', handleProjectButtonClick);
    });
    
    // ===== EFECTOS DE NAVEGACIÓN ACTIVA =====
    // Función para resaltar la sección activa en la navegación
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.offsetHeight;
            
            if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Event listener para actualizar el enlace activo
    window.addEventListener('scroll', updateActiveNavLink);
    
    // ===== EFECTOS DE HOVER EN TARJETAS =====
    // Función para agregar efectos de hover mejorados
    function addHoverEffects() {
        const cards = document.querySelectorAll('.experience-card, .project-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    // Inicializamos los efectos de hover
    addHoverEffects();
    
    // ===== ANIMACIÓN DE TEXTO TIPOWRITER ESTILO APPLE =====
    // Función para crear efecto de escritura en el título principal
    function typewriterEffect() {
        const titleElement = document.querySelector('.hero-title');
        if (!titleElement) return;
        
        const text = titleElement.textContent;
        titleElement.textContent = '';
        titleElement.style.opacity = '1';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                titleElement.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                // Agregar efecto de cursor parpadeante
                titleElement.style.borderRight = '2px solid #000';
                setTimeout(() => {
                    titleElement.style.borderRight = 'none';
                }, 1000);
            }
        }, 80);
    }
    
    // Ejecutamos el efecto typewriter después de un pequeño delay
    setTimeout(typewriterEffect, 800);
    
    // ===== EFECTOS DE PARTICULAS ESTILO APPLE =====
    // Función para crear un efecto visual sutil
    function createParticleEffect() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        // Creamos partículas flotantes más elegantes
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${2 + Math.random() * 3}px;
                height: ${2 + Math.random() * 3}px;
                background: rgba(0, 0, 0, 0.1);
                border-radius: 50%;
                opacity: 0.4;
                animation: float ${4 + Math.random() * 6}s ease-in-out infinite;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 2}s;
            `;
            
            hero.appendChild(particle);
        }
    }
    
    // Agregamos la animación CSS para las partículas
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { 
                transform: translateY(0px) translateX(0px) rotate(0deg); 
                opacity: 0.4;
            }
            25% { 
                transform: translateY(-15px) translateX(10px) rotate(90deg); 
                opacity: 0.6;
            }
            50% { 
                transform: translateY(-25px) translateX(-5px) rotate(180deg); 
                opacity: 0.3;
            }
            75% { 
                transform: translateY(-10px) translateX(-10px) rotate(270deg); 
                opacity: 0.5;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Inicializamos el efecto de partículas
    createParticleEffect();
    
    // ===== FUNCIÓN DE UTILIDAD PARA LOGS =====
    // Función para logging mejorado
    function log(message, data = null) {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] ${message}`, data || '');
    }
    
    // Log de inicialización
    log('Portafolio de Ian Anaya cargado correctamente');
    log('Todas las funcionalidades están activas');
    
    // ===== MANEJO DE ERRORES =====
    // Función para manejar errores de manera elegante
    window.addEventListener('error', function(e) {
        console.error('Error en la aplicación:', e.error);
        // En un entorno de producción, aquí podrías enviar el error a un servicio de monitoreo
    });
    
    // ===== FUNCIONALIDAD ADICIONAL =====
    // Función para copiar información de contacto al portapapeles
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Información copiada al portapapeles');
        }).catch(() => {
            // Fallback para navegadores que no soportan clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Información copiada al portapapeles');
        });
    }
    
    // Agregamos funcionalidad de copia a los elementos de contacto
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            const text = this.querySelector('p').textContent;
            copyToClipboard(text);
        });
    });
    
    // ===== INICIALIZACIÓN FINAL =====
    // Ejecutamos efectos iniciales
    handleScrollEffects();
    updateActiveNavLink();
    
    log('Inicialización completa del portafolio');
});

// ===== FUNCIONES GLOBALES =====
// Función para mostrar información adicional (puede ser llamada desde la consola)
function showPortfolioInfo() {
    console.log(`
    🚀 PORTAFOLIO DE IAN ANAYA - INGENIERO INDUSTRIAL
    
    📧 Email: ian.anaya@empresa.com
    📱 WhatsApp: +57 313 315 9634
    🌐 Sitio Web: www.iananaya.com
    
    💼 Experiencia:
    - Empresario y Líder Comercial (2020 - Presente)
    - Ingeniero Industrial (2023 - Presente)
    - Gerente Ejecutivo de Ventas (2018 - Presente)
    
    🛠️ Tecnologías y Habilidades:
    - CRM y Análisis de Datos
    - Optimización de Procesos
    - Gestión Empresarial
    - Liderazgo y Comunicación
    
    📈 Proyectos Destacados:
    1. Optimización de Procesos de Ventas
    2. Implementación de CRM
    3. Estrategias Comerciales Innovadoras
    `);
}

// Función para simular envío de email (para desarrollo)
function simulateEmailSend(recipient, subject, message) {
    console.log(`
    📧 EMAIL SIMULADO ENVIADO:
    
    Para: ${recipient}
    Asunto: ${subject}
    Mensaje: ${message}
    
    Fecha: ${new Date().toLocaleString()}
    Estado: Enviado correctamente ✅
    `);
}
