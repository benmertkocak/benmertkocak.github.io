'use strict';

// Element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// Sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// Sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

// Auto-close sidebar functionality
let isMobile = () => window.innerWidth <= 768;

const handleSidebarClose = () => {
  if (sidebar.classList.contains("active")) {
    sidebar.classList.remove("active");
  }
};

// Close sidebar when clicking outside (mobile only)
document.addEventListener("click", (e) => {
  if (isMobile() && !sidebar.contains(e.target) && !sidebarBtn.contains(e.target)) {
    handleSidebarClose();
  }
});

// Close sidebar when scrolling starts (mobile only)
window.addEventListener("scroll", () => {
  if (isMobile()) {
    handleSidebarClose();
  }
});

// Close sidebar when scrolling main content (mobile only)
const mainContent = document.querySelector(".main-content");
if (mainContent) {
  mainContent.addEventListener("scroll", () => {
    if (isMobile()) {
      handleSidebarClose();
    }
  });
}

// Prevent sidebar from closing when clicking inside it
sidebar.addEventListener("click", (e) => {
  if (isMobile()) {
    e.stopPropagation();
  }
});

// Re-evaluate isMobile on window resize
window.addEventListener("resize", () => {
  isMobile = () => window.innerWidth <= 768;
});

// Custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });

  // Add event in all select items
  for (let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      elementToggleFunc(select);
      filterFunc(selectedValue);
    });
  }
}

// Filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  // GitHub repoları için özel filter varsa onu kullan
  if (typeof window.filterGitHubRepos === 'function') {
    window.filterGitHubRepos(selectedValue);
  } else {
    // Eski filter sistemi
    for (let i = 0; i < filterItems.length; i++) {
      if (selectedValue === "all") {
        filterItems[i].classList.add("active");
      } else if (selectedValue === filterItems[i].dataset.category) {
        filterItems[i].classList.add("active");
      } else {
        filterItems[i].classList.remove("active");
      }
    }
  }
}

// Add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// Contact form variables
const contactForm = document.querySelector("form[action*='formspree']");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// Success message element
const formMessage = document.querySelector(".form-message");

// Add event to all form input field
if (formInputs.length > 0) {
  for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", function () {
      // Check form validation
      if (contactForm.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  }
}

// Handle form submission
if (contactForm) {
  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(this);

    try {
      const response = await fetch(this.action, {
        method: this.method,
        body: formData,
        headers: {
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        // Hide form and show success message
        this.style.display = "none";
        if (formMessage) {
          formMessage.style.display = "block";
        }
        
        // Sidebar hizalamasını yeniden hesapla
        setTimeout(() => {
          if (window.innerWidth >= 1250 && typeof window.recalculateSidebarPosition === 'function') {
            window.recalculateSidebarPosition();
          }
        }, 100);
        
        // Bir kez daha kontrol et (animasyon bittikten sonra)
        setTimeout(() => {
          if (window.innerWidth >= 1250 && typeof window.recalculateSidebarPosition === 'function') {
            window.recalculateSidebarPosition();
          }
        }, 400);
      } else {
        alert("An error occurred while sending the message.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert("An error occurred while sending the message.");
    }
  });
}

// LOADING STATE CONTROL
document.addEventListener('DOMContentLoaded', function() {
  // Sayfa yüklenmeye başladığında loading class'ı ekle
  document.body.classList.add('loading');
});

// SCROLL POSITION RESET ON PAGE LOAD
window.addEventListener('load', function() {
  // Sayfa tamamen yüklendiğinde loading class'ını kaldır ve scroll'u sıfırla
  setTimeout(() => {
    document.body.classList.remove('loading');
    window.scrollTo(0, 0);
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, 50);
});

// Sayfa yenileme durumunda scroll pozisyonunu önle
window.addEventListener('beforeunload', function() {
  window.scrollTo(0, 0);
});

// PAGE NAVIGATION
document.addEventListener('DOMContentLoaded', function() {
  // Page navigation variables
  const navLinks = document.querySelectorAll('[data-nav-link]');
  const pages = document.querySelectorAll('[data-page]');
  
  // Add click event to each navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      // Get the page name from the button text
      const pageName = this.textContent.toLowerCase();
      
      // First, remove active class from all pages and links
      pages.forEach(page => {
        page.classList.remove('active');
      });
      
      navLinks.forEach(navLink => {
        navLink.classList.remove('active');
      });
      
      // Then, add active class to the clicked link
      this.classList.add('active');
      
      // Find the corresponding page and make it active
      const targetPage = document.querySelector(`[data-page="${pageName}"]`);
      if (targetPage) {
        targetPage.classList.add('active');
        
        // Reset scroll position for both window and main-content
        window.scrollTo({ top: 0, behavior: 'instant' });
        
        // Reset main-content scroll position for mobile
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
          mainContent.scrollTo({ top: 0, behavior: 'instant' });
        }
      } else {
        console.error(`Page with data-page="${pageName}" not found`);
      }
      
      // Close sidebar on mobile
      if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
      }
    });
  });
});


// =============================================
// DESKTOP PARALLAX - Sidebar & Main Content Alignment
// =============================================

(function() {
  let sidebar, mainContent;
  let sidebarHeight, mainContentHeight, maxTranslate;
  let currentTranslate = 0;
  let targetTranslate = 0;
  let animating = false;
  
  function init() {
    if (window.innerWidth < 1250) return;
    
    sidebar = document.querySelector('.sidebar');
    mainContent = document.querySelector('.main-content');
    
    if (!sidebar || !mainContent) return;
    
    // İlk yükleme: pozisyonu sıfırla
    currentTranslate = 0;
    targetTranslate = 0;
    sidebar.style.transform = 'translateY(0)';
    
    calculateDimensions();
    updateSidebar();
    startAnimation();
    
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    
    // Navbar click
    document.querySelectorAll('[data-nav-link]').forEach(link => {
      link.addEventListener('click', () => {
        currentTranslate = 0;
        targetTranslate = 0;
        sidebar.style.transform = 'translateY(0)';
        setTimeout(() => {
          calculateDimensions();
          updateSidebar();
        }, 150);
      });
    });
  }
  
  function calculateDimensions() {
    if (!sidebar || !mainContent) return;
    
    // Aktif article'ı bul
    const activeArticle = mainContent.querySelector('article.active');
    
    sidebarHeight = sidebar.offsetHeight;
    
    if (activeArticle) {
      // İlk olarak min-height'i temizle, gerçek yüksekliği ölç
      activeArticle.style.minHeight = '';
      const naturalHeight = activeArticle.offsetHeight;
      
      // Eğer article sidebar'dan kısa ise, article'ın yüksekliğini sidebar ile eşitle
      if (naturalHeight < sidebarHeight) {
        activeArticle.style.minHeight = `${sidebarHeight}px`;
        // Browser reflow için kısa bir bekleme
        activeArticle.offsetHeight; // Force reflow
        mainContentHeight = sidebarHeight;
        maxTranslate = 0; // Sidebar hareket etmemeli, zaten hizalılar
      } else {
        mainContentHeight = naturalHeight;
        maxTranslate = Math.max(0, mainContentHeight - sidebarHeight);
      }
    } else {
      mainContentHeight = mainContent.offsetHeight;
      maxTranslate = Math.max(0, mainContentHeight - sidebarHeight);
    }
  }
  
  // Global erişim için window'a ekle
  window.recalculateSidebarPosition = function() {
    // Pozisyonu sıfırla
    currentTranslate = 0;
    targetTranslate = 0;
    if (sidebar) {
      sidebar.style.transform = 'translateY(0)';
    }
    calculateDimensions();
    updateSidebar();
  };
  
  function updateSidebar() {
    if (window.innerWidth < 1250 || !sidebar) {
      targetTranslate = 0;
      return;
    }
    
    if (maxTranslate <= 0) {
      targetTranslate = 0;
      return;
    }
    
    // Scroll progress hesapla
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const maxScroll = documentHeight - windowHeight;
    
    if (maxScroll <= 0 || scrollTop <= 0) {
      targetTranslate = 0;
      return;
    }
    
    // Progress (0-1)
    const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
    
    // Target translateY
    targetTranslate = progress * maxTranslate;
  }
  
  // Smooth animation loop
  function startAnimation() {
    if (!animating) {
      animating = true;
      animate();
    }
  }
  
  function animate() {
    if (!sidebar || window.innerWidth < 1250) {
      animating = false;
      return;
    }
    
    // Lerp (Linear interpolation) - responsive geçiş
    const ease = 0.90; // Daha yüksek = daha responsive
    const diff = targetTranslate - currentTranslate;
    
    if (Math.abs(diff) > 0.1) {
      currentTranslate += diff * ease;
      sidebar.style.transform = `translateY(${currentTranslate}px)`;
    } else {
      currentTranslate = targetTranslate;
      sidebar.style.transform = `translateY(${currentTranslate}px)`;
    }
    
    requestAnimationFrame(animate);
  }
  
  function onScroll() {
    updateSidebar();
  }
  
  let resizeTimeout;
  function onResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      currentTranslate = 0;
      targetTranslate = 0;
      sidebar.style.transform = 'translateY(0)';
      calculateDimensions();
      updateSidebar();
    }, 150);
  }
  
  // Başlat
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      calculateDimensions();
      updateSidebar();
    }, 200);
  });
})();


// =============================================
// GITHUB REPOSITORIES INTEGRATION WITH PAGINATION
// =============================================

(function() {
  const GITHUB_USERNAME = 'benmertkocak';
  const GITHUB_API = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
  const REPOS_PER_PAGE = 6;
  
  let allRepos = [];
  let currentPage = 1;
  let currentFilter = 'all';
  
  async function fetchGitHubRepos() {
    try {
      const response = await fetch(`${GITHUB_API}?sort=stars&per_page=100`);
      
      if (!response.ok) {
        throw new Error('GitHub API request failed');
      }
      
      const repos = await response.json();
      
      // Fork olmayan ve "benmertkocak" ile başlamayan repoları filtrele ve yıldıza göre sırala
      allRepos = repos
        .filter(repo => !repo.fork && !repo.name.startsWith('benmertkocak'))
        .sort((a, b) => b.stargazers_count - a.stargazers_count);
      
      renderRepos(allRepos);
      
    } catch (error) {
      console.error('Error fetching GitHub repos:', error);
      document.getElementById('github-projects').innerHTML = `
        <li class="project-item active" style="text-align: center; padding: 40px;">
          <p style="color: var(--light-gray);">Repositories could not be loaded.</p>
        </li>
      `;
    }
  }
  
  function filterReposByCategory(category) {
    currentFilter = category;
    currentPage = 1;
    
    if (category === 'all') {
      renderRepos(allRepos);
      return;
    }
    
    const filtered = allRepos.filter(repo => {
      const repoCategory = getRepoCategory(repo);
      return repoCategory.toLowerCase() === category;
    });
    
    renderRepos(filtered);
  }
  
  // Global erişim için
  window.filterGitHubRepos = filterReposByCategory;
  
  function getRepoCategory(repo) {
    const repoName = repo.name.toLowerCase();
    const repoDesc = (repo.description || '').toLowerCase();
    
    // Machine Learning keywords - öncelikli
    const mlKeywords = [
      'machine-learning', 'machine_learning', 'machinelearning',
      'ml', 'model', 'neural', 'deep-learning', 'deeplearning',
      'regression', 'classification', 'clustering', 'prediction',
      'scikit', 'sklearn', 'tensorflow', 'keras', 'pytorch',
      'random-forest', 'decision-tree', 'svm', 'knn',
      'xgboost', 'lightgbm', 'gradient-boosting'
    ];
    
    // Data Science keywords
    const dsKeywords = [
      'data-science', 'data_science', 'datascience',
      'analysis', 'analytics', 'visualization', 'pandas',
      'numpy', 'matplotlib', 'seaborn', 'plotly',
      'jupyter', 'notebook', 'eda', 'exploratory'
    ];
    
    // Topic kontrolü - en spesifik
    if (repo.topics && repo.topics.length > 0) {
      if (repo.topics.some(t => mlKeywords.includes(t))) return 'Machine Learning';
      if (repo.topics.includes('data-science')) return 'Data Science';
      if (repo.topics.includes('python')) return 'Python';
    }
    
    // İsim ve description kontrolü
    if (mlKeywords.some(keyword => repoName.includes(keyword) || repoDesc.includes(keyword))) {
      return 'Machine Learning';
    }
    
    if (dsKeywords.some(keyword => repoName.includes(keyword) || repoDesc.includes(keyword))) {
      return 'Data Science';
    }
    
    // Language kontrolü
    if (repo.language) {
      if (repo.language === 'Jupyter Notebook') return 'Machine Learning';
      if (repo.language === 'Python') return 'Python';
    }
    
    return 'Python';
  }
  
  function renderRepos(repos) {
    const projectList = document.getElementById('github-projects');
    
    if (!repos || repos.length === 0) {
      projectList.innerHTML = `
        <li class="project-item active" style="text-align: center; padding: 40px;">
          <p style="color: var(--light-gray);">No repositories found.</p>
        </li>
      `;
      removePaginationControls();
      return;
    }
    
    // Pagination hesapla
    const totalPages = Math.ceil(repos.length / REPOS_PER_PAGE);
    const startIndex = (currentPage - 1) * REPOS_PER_PAGE;
    const endIndex = startIndex + REPOS_PER_PAGE;
    const currentRepos = repos.slice(startIndex, endIndex);
    
    // Temizle
    projectList.innerHTML = '';
    
    currentRepos.forEach(repo => {
      const category = getRepoCategory(repo);
      
      // Başlığı güzelleştir (underscore'ları space yap, başlıkları kısalt)
      let repoTitle = repo.name
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Çok uzun başlıkları kısalt (max 40 karakter)
      if (repoTitle.length > 40) {
        repoTitle = repoTitle.substring(0, 40) + '...';
      }
      
      const projectItem = `
        <li class="project-item active" data-filter-item data-category="${category.toLowerCase()}">
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
            <figure class="project-img" style="height: 200px;">
              <div class="project-item-icon-box">
                <ion-icon name="logo-github"></ion-icon>
              </div>
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23764ba2;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23grad)' width='400' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80' fill='rgba(255,255,255,0.8)'%3E%26lt;/%26gt;%3C/text%3E%3C/svg%3E" alt="${repo.name}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;">
            </figure>
            <h3 class="project-title" title="${repo.name}">${repoTitle}</h3>
            <p class="project-category">${category}</p>
            <div style="display: flex; gap: 15px; margin-top: 8px; font-size: 13px; color: var(--light-gray);">
              <span style="display: flex; align-items: center; gap: 4px;">
                <ion-icon name="star-outline"></ion-icon>
                ${repo.stargazers_count}
              </span>
              <span style="display: flex; align-items: center; gap: 4px;">
                <ion-icon name="git-branch-outline"></ion-icon>
                ${repo.forks_count}
              </span>
              ${repo.language ? `
                <span style="display: flex; align-items: center; gap: 4px;">
                  <ion-icon name="code-slash-outline"></ion-icon>
                  ${repo.language}
                </span>
              ` : ''}
            </div>
          </a>
        </li>
      `;
      
      projectList.insertAdjacentHTML('beforeend', projectItem);
    });
    
    // Pagination kontrollerini ekle/güncelle
    renderPaginationControls(repos.length, totalPages);
    
    // Sidebar parallax'ı yeniden hesapla
    if (window.innerWidth >= 1250) {
      setTimeout(() => {
        if (typeof window.recalculateSidebarPosition === 'function') {
          window.recalculateSidebarPosition();
        }
      }, 150);
      
      // Bir kez daha biraz sonra (render tamamlandıktan sonra)
      setTimeout(() => {
        if (typeof window.recalculateSidebarPosition === 'function') {
          window.recalculateSidebarPosition();
        }
      }, 400);
    }
    
    // Sayfanın üstüne scroll
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  function renderPaginationControls(totalRepos, totalPages) {
    // Mevcut kontrolü kaldır
    removePaginationControls();
    
    if (totalPages <= 1) return;
    
    const projectsSection = document.querySelector('.projects');
    if (!projectsSection) return;
    
    const paginationHTML = `
      <div class="pagination-controls" style="
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        margin-top: 40px;
        padding: 20px;
      ">
        <button id="prev-page" class="pagination-btn" 
          ${currentPage === 1 ? 'disabled' : ''}
          style="
            background: var(--border-gradient-onyx);
            color: var(--orange-yellow-crayola);
            border: none;
            padding: 12px 24px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
            ${currentPage === 1 ? 'opacity: 0.5; cursor: not-allowed;' : ''}
          ">
          <ion-icon name="chevron-back-outline"></ion-icon>
          Previous
        </button>
        
        <div style="color: var(--white-2); font-size: 15px; font-weight: 500;">
          Page ${currentPage} of ${totalPages}
        </div>
        
        <button id="next-page" class="pagination-btn"
          ${currentPage === totalPages ? 'disabled' : ''}
          style="
            background: var(--border-gradient-onyx);
            color: var(--orange-yellow-crayola);
            border: none;
            padding: 12px 24px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
            ${currentPage === totalPages ? 'opacity: 0.5; cursor: not-allowed;' : ''}
          ">
          Next
          <ion-icon name="chevron-forward-outline"></ion-icon>
        </button>
      </div>
    `;
    
    projectsSection.insertAdjacentHTML('beforeend', paginationHTML);
    
    // Event listeners
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          const filtered = currentFilter === 'all' ? allRepos : 
            allRepos.filter(repo => getRepoCategory(repo).toLowerCase() === currentFilter);
          renderRepos(filtered);
        }
      });
      
      // Hover effect
      if (currentPage > 1) {
        prevBtn.addEventListener('mouseenter', function() {
          this.style.background = 'var(--bg-gradient-yellow-1)';
        });
        prevBtn.addEventListener('mouseleave', function() {
          this.style.background = 'var(--border-gradient-onyx)';
        });
      }
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++;
          const filtered = currentFilter === 'all' ? allRepos : 
            allRepos.filter(repo => getRepoCategory(repo).toLowerCase() === currentFilter);
          renderRepos(filtered);
        }
      });
      
      // Hover effect
      if (currentPage < totalPages) {
        nextBtn.addEventListener('mouseenter', function() {
          this.style.background = 'var(--bg-gradient-yellow-1)';
        });
        nextBtn.addEventListener('mouseleave', function() {
          this.style.background = 'var(--border-gradient-onyx)';
        });
      }
    }
  }
  
  function removePaginationControls() {
    const existingControls = document.querySelector('.pagination-controls');
    if (existingControls) {
      existingControls.remove();
    }
  }
  
  function initializePortfolioFilters() {
    const filterBtns = document.querySelectorAll('[data-filter-btn]');
    
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const selectedValue = this.innerText.toLowerCase();
        
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        filterReposByCategory(selectedValue);
      });
    });
  }
  
  // Sayfa yüklendiğinde repoları çek ve filtreleri başlat
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      fetchGitHubRepos();
      initializePortfolioFilters();
    });
  } else {
    fetchGitHubRepos();
    initializePortfolioFilters();
  }
  
})();


// =============================================
// BLOG POSTS WITH PAGINATION (Medium Integration)
// =============================================

(function() {
  const POSTS_PER_PAGE = 4;
  const MEDIUM_USERNAME = 'benmertkocak'; // Medium kullanıcı adınız
  const USE_MEDIUM = true; // Medium'dan blog yazılarını çek
  
  // Local blog yazıları verisi (başlıklar ve lorem ipsum metinleri)
  const localBlogPosts = [
    // Sayfa 1
    {
      title: "Veri Bilimi ve Yapay Zeka'nın Geleceği",
      category: "Yapay Zeka",
      date: "18 Aralık 2024",
      excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
      title: "Machine Learning Modellerini Optimize Etme",
      category: "Machine Learning",
      date: "15 Aralık 2024",
      excerpt: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    },
    {
      title: "Python ile Veri Analizi: En İyi Uygulamalar",
      category: "Python",
      date: "12 Aralık 2024",
      excerpt: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
      title: "Deep Learning ve Neural Networks Temelleri",
      category: "Deep Learning",
      date: "10 Aralık 2024",
      excerpt: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium."
    },
    // Sayfa 2
    {
      title: "Apache Spark ile Büyük Veri İşleme",
      category: "Big Data",
      date: "8 Aralık 2024",
      excerpt: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit."
    },
    {
      title: "Natural Language Processing ile Metin Analizi",
      category: "NLP",
      date: "5 Aralık 2024",
      excerpt: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est qui dolorem ipsum."
    },
    {
      title: "Veri Görselleştirme: Matplotlib ve Seaborn",
      category: "Data Visualization",
      date: "3 Aralık 2024",
      excerpt: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum."
    },
    {
      title: "Flask ve FastAPI ile Model Deployment",
      category: "MLOps",
      date: "1 Aralık 2024",
      excerpt: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident."
    },
    // Sayfa 3
    {
      title: "Computer Vision ve Görüntü İşleme",
      category: "Computer Vision",
      date: "28 Kasım 2024",
      excerpt: "Quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Temporibus autem quibusdam et aut officiis."
    },
    {
      title: "Time Series Analysis ve Tahminleme",
      category: "Data Science",
      date: "25 Kasım 2024",
      excerpt: "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus."
    },
    {
      title: "Reinforcement Learning: Temel Kavramlar",
      category: "Machine Learning",
      date: "22 Kasım 2024",
      excerpt: "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus."
    },
    {
      title: "SQL ve NoSQL: Hangi Veritabanı?",
      category: "Database",
      date: "20 Kasım 2024",
      excerpt: "Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae."
    }
  ];
  
  let blogPosts = [];
  let currentPage = 1;
  let totalPages = 1;
  
  // Medium'dan blog yazılarını çek
  async function fetchMediumPosts() {
    const blogList = document.getElementById('blog-posts-list');
    if (blogList) {
      blogList.innerHTML = '<p style="text-align: center; color: var(--light-gray); padding: 40px;">Medium yazıları yükleniyor...</p>';
    }
    
    try {
      const RSS_URL = `https://medium.com/feed/@${MEDIUM_USERNAME}`;
      const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;
      
      const response = await fetch(API_URL);
      const data = await response.json();
      
      if (data.status === 'ok') {
        blogPosts = data.items.map(item => {
          // Görseli çek - Medium'da content içinde ilk img tag'i
          let thumbnail = item.thumbnail || '';
          if (!thumbnail && item.content) {
            const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch) {
              thumbnail = imgMatch[1];
            }
          }
          
          // Description'dan HTML temizle
          let excerpt = item.description || item.content || '';
          excerpt = excerpt.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
          
          return {
            title: item.title,
            category: item.categories && item.categories[0] || 'Blog',
            date: new Date(item.pubDate).toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            excerpt: excerpt,
            link: item.link,
            thumbnail: thumbnail
          };
        });
        
        totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE);
        
        // Başarılı yükleme mesajı
        const blogList = document.getElementById('blog-posts-list');
        if (blogList && blogPosts.length > 0) {
          blogList.innerHTML = `<p style="text-align: center; color: var(--orange-yellow-crayola); padding: 20px;">${blogPosts.length} Medium yazısı yüklendi ✓</p>`;
          setTimeout(() => renderBlogPosts(), 500);
        } else {
          renderBlogPosts();
        }
      } else {
        throw new Error('Medium RSS feed yüklenemedi');
      }
    } catch (error) {
      // Hata durumunda local verileri kullan
      const blogList = document.getElementById('blog-posts-list');
      if (blogList) {
        blogList.innerHTML = `<p style="text-align: center; color: var(--light-gray); padding: 20px;">Medium'dan yüklenemedi, yerel veriler kullanılıyor...</p>`;
      }
      blogPosts = localBlogPosts;
      totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE);
      setTimeout(() => renderBlogPosts(), 1000);
    }
  }
  
  // Blog sistemini başlat
  function initBlogPosts() {
    if (USE_MEDIUM) {
      fetchMediumPosts();
    } else {
      blogPosts = localBlogPosts;
      totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE);
      renderBlogPosts();
    }
  }
  
  function renderBlogPosts() {
    const blogList = document.getElementById('blog-posts-list');
    
    if (!blogList) return;
    
    // Temizle
    blogList.innerHTML = '';
    
    // Mevcut sayfa için post'ları hesapla
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const currentPosts = blogPosts.slice(startIndex, endIndex);
    
    // Her post için HTML oluştur
    currentPosts.forEach(post => {
      const postLink = post.link || '#';
      const postTarget = post.link ? '_blank' : '_self';
      const thumbnailHTML = post.thumbnail 
        ? `<img src="${post.thumbnail}" alt="${post.title}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;">` 
        : '<!-- Görsel placeholder - şimdilik boş -->';
      
      const postItem = `
        <li class="blog-post-item">
          <a href="${postLink}" target="${postTarget}" rel="noopener noreferrer">
            <figure class="blog-banner-box">
              ${thumbnailHTML}
            </figure>
            <div class="blog-content">
              <div class="blog-meta">
                <p class="blog-category">${post.category}</p>
                <span class="dot"></span>
                <time>${post.date}</time>
              </div>
              <h3 class="h3 blog-item-title">${post.title}</h3>
              <p class="blog-text">${post.excerpt}</p>
            </div>
          </a>
        </li>
      `;
      
      blogList.insertAdjacentHTML('beforeend', postItem);
    });
    
    // Pagination kontrollerini güncelle
    renderBlogPaginationControls();
    
    // Sidebar parallax'ı yeniden hesapla
    if (window.innerWidth >= 1250) {
      setTimeout(() => {
        if (typeof window.recalculateSidebarPosition === 'function') {
          window.recalculateSidebarPosition();
        }
      }, 150);
    }
    
    // Sayfanın üstüne scroll
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  function renderBlogPaginationControls() {
    const paginationContainer = document.getElementById('blog-pagination-controls');
    
    if (!paginationContainer) return;
    
    // Tek sayfa varsa pagination gösterme
    if (totalPages <= 1) {
      paginationContainer.innerHTML = '';
      return;
    }
    
    paginationContainer.innerHTML = `
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        margin-top: 40px;
        padding: 20px;
      ">
        <button id="blog-prev-btn" 
          ${currentPage === 1 ? 'disabled' : ''}
          style="
            background: var(--border-gradient-onyx);
            color: var(--orange-yellow-crayola);
            border: none;
            padding: 12px 24px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
            ${currentPage === 1 ? 'opacity: 0.5; cursor: not-allowed;' : ''}
          ">
          <ion-icon name="chevron-back-outline"></ion-icon>
          Önceki
        </button>
        
        <div style="color: var(--white-2); font-size: 15px; font-weight: 500;">
          Sayfa ${currentPage} / ${totalPages}
        </div>
        
        <button id="blog-next-btn"
          ${currentPage === totalPages ? 'disabled' : ''}
          style="
            background: var(--border-gradient-onyx);
            color: var(--orange-yellow-crayola);
            border: none;
            padding: 12px 24px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
            ${currentPage === totalPages ? 'opacity: 0.5; cursor: not-allowed;' : ''}
          ">
          Sonraki
          <ion-icon name="chevron-forward-outline"></ion-icon>
        </button>
      </div>
    `;
    
    // Event listeners ekle
    const prevBtn = document.getElementById('blog-prev-btn');
    const nextBtn = document.getElementById('blog-next-btn');
    
    if (prevBtn && currentPage > 1) {
      prevBtn.addEventListener('click', () => {
        currentPage--;
        renderBlogPosts();
      });
    }
    
    if (nextBtn && currentPage < totalPages) {
      nextBtn.addEventListener('click', () => {
        currentPage++;
        renderBlogPosts();
      });
    }
  }
  
  // İlk yükleme
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogPosts);
  } else {
    initBlogPosts();
  }
  
})();