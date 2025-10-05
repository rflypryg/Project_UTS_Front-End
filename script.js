document.addEventListener('DOMContentLoaded', () => {
    const searchBox = document.getElementById('searchBox');
    const cards = document.querySelectorAll('.card');
    const ANIMATION_DURATION_MS = 300; 
    
    const sortButtons = document.querySelectorAll('.sort-btn');
    const sortAZBtn = document.getElementById('sortAZ');
    const sortZABtn = document.getElementById('sortZA');
    const resetSortBtn = document.getElementById('resetSort');

    const contentSections = document.querySelectorAll('.section:not(#home)'); 
    const cardContainers = document.querySelectorAll('.container'); 
    
    const modal = document.getElementById('detailModal');
    const closeBtn = document.querySelector('.close-btn');
    const reviewForm = document.getElementById('reviewForm');
    const reviewsList = document.getElementById('reviewsList');
    
    let simulatedReviews = []; 
    
    const initialDOMOrder = {}; 
    cardContainers.forEach(container => {
        initialDOMOrder[container.parentNode.id] = Array.from(container.children);
    });

    let slideIndex = 0;

    function showSlides() {
        let slides = document.getElementsByClassName("mySlides");
        
        for (let i = 0; i < slides.length; i++) {
            slides[i].classList.remove('active'); 
        }
        
        slideIndex++;
        if (slideIndex > slides.length) {slideIndex = 1}
        
        slides[slideIndex-1].classList.add('active'); 
        
        setTimeout(showSlides, 5000); 
    }
    showSlides();


   

    const filterCards = (query) => {
        let firstMatch = null;
        cards.forEach(card => card.style.display = "flex"); 
        
        cards.forEach(card => {
            const text = card.innerText.toLowerCase();
            const isMatch = text.includes(query);

            if (isMatch) {
                card.classList.remove("hidden");
                if (!firstMatch) {
                    firstMatch = card;
                }
            } else {
                card.classList.add("hidden");
                
                setTimeout(() => {
                    if (card.classList.contains("hidden")) {
                        card.style.display = "none";
                    }
                }, ANIMATION_DURATION_MS); 
            }
        });

        return firstMatch;
    };

    searchBox.addEventListener('keyup', (e) => {
        const query = searchBox.value.toLowerCase();
        
        sortCards('default'); 
        
        const firstMatch = filterCards(query);

        if (e.key === "Enter" && firstMatch) {
            firstMatch.style.display = "flex"; 
            firstMatch.classList.remove("hidden");
            firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    });


  

    const sortCards = (direction) => {
        const activeSections = Array.from(contentSections).filter(section => section.style.display !== 'none');
        
        sortButtons.forEach(btn => btn.classList.remove('active'));
        if (direction === 'az') {
            sortAZBtn.classList.add('active');
        } else if (direction === 'za') {
            sortZABtn.classList.add('active');
        } else {
            resetSortBtn.classList.add('active');
        }

        activeSections.forEach(section => {
            const container = section.querySelector('.container');
            if (!container) return; 

            let cardArray = Array.from(container.children);
            
            if (direction === 'default') {
                const initialOrder = initialDOMOrder[section.id] || [];
                initialOrder.forEach(card => container.appendChild(card));
            } else {
                cardArray.sort((a, b) => {
                    const titleA = (a.querySelector('h3') ? a.querySelector('h3').innerText : '').toLowerCase();
                    const titleB = (b.querySelector('h3') ? b.querySelector('h3').innerText : '').toLowerCase();
                    
                    if (direction === 'az') {
                        return titleA.localeCompare(titleB);
                    } else if (direction === 'za') {
                        return titleB.localeCompare(titleA);
                    }
                    return 0;
                });
                
                cardArray.forEach(card => container.appendChild(card));
            }
        });
    };

    sortAZBtn.addEventListener('click', () => sortCards('az'));
    sortZABtn.addEventListener('click', () => sortCards('za'));
    resetSortBtn.addEventListener('click', () => sortCards('default'));


   

    function renderReviews(itemTitle) {
        reviewsList.innerHTML = '';
        const filteredReviews = simulatedReviews.filter(review => review.item === itemTitle);

        if (filteredReviews.length === 0) {
            reviewsList.innerHTML += '<p>Belum ada ulasan untuk topik ini.</p>';
            return;
        }

        filteredReviews.forEach(review => {
            const reviewElement = document.createElement('div');
            const star = '⭐'.repeat(review.rating);
            reviewElement.innerHTML = `
                <p><strong>${review.name}</strong> (${review.date})</p>
                <p>Rating: ${star}</p>
                <p>"${review.comment}"</p>
                <hr>
            `;
            reviewsList.appendChild(reviewElement);
        });
    }

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.getAttribute('data-title') || card.querySelector('h3').innerText;
            const image = card.getAttribute('data-image') || card.querySelector('img').src;
            const desc = card.getAttribute('data-desc') || card.querySelector('p').innerText;

            document.getElementById('modalTitle').innerText = title;
            document.getElementById('modalImage').src = image;
            document.getElementById('modalDescription').innerText = desc;
            
            renderReviews(title);

            modal.style.display = "block";
        });
    });

    closeBtn.onclick = () => { modal.style.display = "none"; }
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('reviewName').value;
        const rating = document.getElementById('reviewRating').value;
        const comment = document.getElementById('reviewComment').value;
        const itemTitle = document.getElementById('modalTitle').innerText;
        
        simulatedReviews.push({ 
            item: itemTitle, 
            name, 
            rating: parseInt(rating), 
            comment, 
            date: new Date().toLocaleDateString('id-ID')
        });
        
        reviewForm.reset();
        renderReviews(itemTitle);
        alert('Ulasan Anda telah dikirim!');
    });


   

    const navLinks = document.querySelectorAll('.navbar ul li a');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 150) { 
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });

    sortCards('default'); 
});