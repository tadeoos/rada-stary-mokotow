// FAQ Accordion functionality
document.addEventListener('DOMContentLoaded', function () {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
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

  const form = document.getElementById("newsletterForm");
  const message = document.getElementById("newsletter-success-message");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // zapobiegamy przeładowaniu
    const formData = new FormData(form);
    fetch("https://script.google.com/macros/s/AKfycbzvH_m_BYNoFbofqCDB4GzRl9kbNtn1_4-eClUPQnJFPMcZokXY3EExewy8QEdkEVoY/exec", {
      method: "POST",
      body: formData,
    })
      .then(res => {
        if (res.ok) {
          form.reset(); // czyści formularz
          message.style.display = "block"; // pokazuje komunikat
        } else {
          alert("Coś poszło nie tak.");
        }
      })
      .catch(err => {
        console.error("Błąd:", err);
        alert("Błąd połączenia.");
      });
  });
});
