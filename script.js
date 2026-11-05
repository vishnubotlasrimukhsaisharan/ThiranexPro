const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  navigation?.classList.toggle("is-open", !isOpen);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  });
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.checkValidity()) {
    formStatus.textContent = "Please complete the required fields.";
    contactForm.querySelector(":invalid")?.focus();
    return;
  }
  formStatus.textContent = "Thanks — your message is ready to send. We’ll be in touch soon.";
  contactForm.reset();
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
