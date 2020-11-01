//defining some variables
let cursor = document.querySelector(".cursor");
let cursorText = cursor.querySelector("span");
let burgerMenu = document.querySelector(".burger-menu");
let controller;
let slideScene;
let pageScene;

function animateSlides() {
  //initializing controller
  controller = new ScrollMagic.Controller();

  //selecting elements
  const slides = document.querySelectorAll(".slide");
  const nav = document.querySelector(".nav-header");

  //looping through each slide class
  slides.forEach((slide, index, slides) => {
    const revealImg = slide.querySelector(".reveal-img");
    const img = slide.querySelector("img");
    const revealText = slide.querySelector(".reveal-text");
    //adding gsap - creating timeline
    const slideTl = gsap.timeline({
      defaults: { duration: 1, ease: "power2.inOut" },
    });

    slideTl.fromTo(revealImg, { x: "0%" }, { x: "100%" });
    slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, "-=1");
    slideTl.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.75");
    slideTl.fromTo(nav, { y: "-100%" }, { y: "0%" }, "-=0.75");

    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false,
    })
      .setTween(slideTl)
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "slide",
      })
      .addTo(controller);

    //adding new timeline
    const pageTl = gsap.timeline();
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    pageTl.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
    pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    pageTl.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");
    //create new scene
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "page",
        indent: 200,
      })
      .setPin(slide, { pushFollowers: false })
      .setTween(pageTl)
      .addTo(controller);
  });
}

function animateCursor(event) {
  cursor.style.top = event.pageY + "px";
  cursor.style.left = event.pageX + "px";
}

function activeCursor(event) {
  const item = event.target;

  if (item.id === "logo" || item.classList.contains("burger-menu")) {
    cursor.classList.add("nav-active");
  } else {
    cursor.classList.remove("nav-active");
  }

  if (item.classList.contains("explore")) {
    cursor.classList.add("explore-active");
    cursorText.innerText = "Tap";
    gsap.to(".title-swipe", 1, { y: "0%" });
  } else {
    cursor.classList.remove("explore-active");
    cursorText.innerText = "";
    gsap.to(".title-swipe", 1, { y: "100%" });
  }
}

function navToggle(event) {
  if (!event.target.classList.contains("active")) {
    event.target.classList.add("active");

    gsap.to(".line-1", 0.5, { rotate: "45", y: 5, background: "black" });
    gsap.to(".line-2", 0.5, { rotate: "-45", y: -5, background: "black" });
    gsap.to("#logo", 1, { color: "black" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(2500px at 100% -10%" });

    document.body.classList.add("hide");
  } else {
    event.target.classList.remove("active");

    gsap.to(".line-1", 0.5, { rotate: "0", y: 0, background: "white" });
    gsap.to(".line-2", 0.5, { rotate: "0", y: 0, background: "white" });
    gsap.to("#logo", 1, { color: "white" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 100% -10%" });

    document.body.classList.remove("hide");
  }
}

window.addEventListener("mousemove", animateCursor);
window.addEventListener("mouseover", activeCursor);
burgerMenu.addEventListener("click", navToggle);

animateSlides();
