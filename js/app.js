// FAQ data - fallback if Google Sheets fails
const fallbackFAQ = [
  {
    question: "Czy podpisanie inicjatywy jest wiążące?",
    answer: "Podpis jest jedynie deklaracją poparcia dla utworzenia Osiedla Stary Mokotów. Nie wiąże się z żadnymi zobowiązaniami finansowymi ani innymi."
  },
  {
    question: "Kto może podpisać inicjatywę?",
    answer: "Każdy pełnoletni mieszkaniec Starego Mokotowa może podpisać inicjatywę. Wymagany jest tylko adres zamieszkania w naszej okolicy."
  },
  {
    question: "Ile podpisów jest potrzebnych?",
    answer: "Aby formalnie utworzyć Osiedle Stary Mokotów, potrzebujemy minimum 3000 podpisów, co stanowi 10% spisu wyborców. Im więcej podpisów zbierzemy, tym silniejszy mandat będzie miało nasze osiedle."
  },
  {
    question: "Jak będzie działać Rada Osiedla?",
    answer: "Rada Osiedla będzie wybierana przez mieszkańców w demokratycznych wyborach. Członkowie działają społecznie, bez wynagrodzenia, spotykają się regularnie i reprezentują interesy mieszkańców wobec władz dzielnicy."
  },
  {
    question: "Czy mogę zostać członkiem Rady Osiedla?",
    answer: "Tak! Po utworzeniu Osiedla odbędą się wybory do Rady Osiedla. Każdy mieszkaniec będzie mógł kandydować i głosować w powszechnych, równych i tajnych wyborach."
  },
];

// Load FAQ from Google Sheets
async function loadFAQFromSheet() {
  // Replace with your published Google Sheets CSV URL
  // Format: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv&gid=0
  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQkTsDlSG13XdlGMbaHnShakPBKbulFFundQmFz-jTNL-_DPCsSZi6T7-rxjOdp20OFp4fEjwwn_SdP/pub?gid=0&single=true&output=csv';

  try {
    const response = await fetch(SHEET_URL);
    const csvText = await response.text();

    // Parse CSV
    const lines = csvText.split('\n');
    const faqs = [];

    // Skip header row, start from index 1
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Simple CSV parsing (works if no commas in content)
      const parts = line.split(',');
      if (parts.length >= 2) {
        faqs.push({
          question: parts[0].trim().replace(/^"|"$/g, ''),
          answer: parts.slice(1).join(',').trim().replace(/^"|"$/g, '')
        });
      }
    }

    return faqs.length > 0 ? faqs : fallbackFAQ;
  } catch (error) {
    console.error('Error loading FAQ from Google Sheets:', error);
    return fallbackFAQ;
  }
}

// Render FAQ items
function renderFAQ(faqs) {
  const faqList = document.querySelector('.faq-list');
  if (!faqList) return;

  faqList.innerHTML = '';

  faqs.forEach(faq => {
    const faqItem = document.createElement('div');
    faqItem.className = 'faq-item';

    faqItem.innerHTML = `
      <button class="faq-question">${faq.question}</button>
      <div class="faq-answer">
        <p>${faq.answer}</p>
      </div>
    `;

    faqList.appendChild(faqItem);
  });

  // Initialize accordion functionality for new items
  initFAQAccordion();
}

// Initialize FAQ accordion functionality
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    // Remove old listeners by cloning
    const newQuestion = question.cloneNode(true);
    question.parentNode.replaceChild(newQuestion, question);

    newQuestion.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          otherAnswer.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      }
    });
  });
}

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', async function () {
  // Load and render FAQ
  const faqs = await loadFAQFromSheet();
  renderFAQ(faqs);

  // Newsletter form handling
  const form = document.getElementById("newsletterForm");
  const message = document.getElementById("newsletter-success-message");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(form);
      fetch("https://script.google.com/macros/s/AKfycbzvH_m_BYNoFbofqCDB4GzRl9kbNtn1_4-eClUPQnJFPMcZokXY3EExewy8QEdkEVoY/exec", {
        method: "POST",
        body: formData,
      })
        .then(res => {
          if (res.ok) {
            form.reset();
            if (message) {
              message.style.display = "block";
            } else {
              alert('Dziękujemy za zapisanie się!');
            }
          } else {
            alert("Coś poszło nie tak.");
          }
        })
        .catch(err => {
          console.error("Błąd:", err);
          alert("Błąd połączenia.");
        });
    });
  }
});
