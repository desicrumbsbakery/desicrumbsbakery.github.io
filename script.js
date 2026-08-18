const BUSINESS = {
  name: "Desi Crumbs",
  phone: "919327766522",
  location: "Surat, Gujarat, India"
};

let customer = {
  first: "",
  last: ""
};

let cart = [];
let pendingOrder = null;


/* =========================================================
   HELPERS
========================================================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const money = (n) =>
  `₹${Number(n).toLocaleString("en-IN")}`;

const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[c])
  );


/* =========================================================
   PRICES
========================================================= */

const CHEESECAKE_PRICES = {
  "Nutella": 139,
  "Oreo": 139,
  "Chocolate": 139,
  "Biscoff": 169,

  "Classic New York": null,
};


const BROWNIE_PRICES = {
  "Chocolate": 130,
  "Biscoff": 120,
  "Nutella": 130,
  "Nuts Brownie": null,
  "Millet / Sugar-Free Brownie": null,
  "Brownie Bites": 35
};


const COOKIE_PRICES = {
  "Chocolate Chip": 130,
  "Double Chocolate": 140,
  "Nutella": 140,
  "Healthy · Chocolate": 160,
  "Healthy · Double Chocolate": 170
};


/* =========================================================
   PRODUCT IMAGES
========================================================= */

const CHEESECAKE_IMAGES = {

  "Classic New York": {
    piece: "assets/newyork-cheesecake-piece.jpg",
    whole: "assets/newyork-cheesecake-cake.jpg",
    alt: "Classic New York cheesecake"
  },

  "Nutella": {
    piece: "assets/nutella-cheesecake-piece.jfif",
    whole: "assets/nutella-cheesecake-cake.jfif",
    alt: "Nutella cheesecake"
  },

  "Oreo": {
    piece: "assets/oreo-cheesecake-piece.jfif",
    whole: "assets/oreo-cheesecake-cake.jfif",
    alt: "Oreo cheesecake"
  },

  "Chocolate": {
    piece: "assets/chocolate-cheesecake-piece.jfif",
    whole: "assets/chocolate-cheesecake-cake.jfif",
    alt: "Chocolate cheesecake"
  },

  "Biscoff": {
    piece: "assets/lotus-cheeesecake-piece.jpg",
    whole: "assets/lotus-cheesecake-cake.jpg",
    alt: "Biscoff cheesecake"
  }

};


const BROWNIE_IMAGES = {

  "Chocolate":
    "assets/chocolate-brownies.jpg",

  "Biscoff":
    "assets/biscoff-brownie.jfif",

  "Nutella":
    "assets/nutella-brownie.jfif",

  "Nuts Brownie":
    "assets/nuts-browine.webp",

  "Millet / Sugar-Free Brownie":
    "assets/milet-sugarfree-brownies.jfif",

  "Brownie Bites":
    "assets/browine-bites.png"

};


const COOKIE_IMAGES = {

  "Chocolate Chip":
    "assets/choco-cookies.jpg",

  "Double Chocolate":
    "assets/cookies-dark-choc.jpg",

  "Nutella":
    "assets/nutella-cookie.jpg",

  "Healthy · Chocolate":
    "assets/healthy-chocolate-cookie.webp",

  "Healthy · Double Chocolate":
    "assets/healthy-doublechoco-cookie.jpg"

};


/* =========================================================
   IMPORTANT:
   CLEAN BROWNIE DROPDOWN
========================================================= */

function cleanBrownieDropdown() {

  const select = $("#brownieFlavour");

  if (!select) return;


  /*
    Remove Brownie Cake completely.
    This fixes the situation where Brownie Cake
    is still present in the HTML.
  */

  [...select.options].forEach(option => {

    const value = option.value.trim().toLowerCase();
    const text = option.textContent.trim().toLowerCase();

    if (
      value === "brownie cake" ||
      text === "brownie cake"
    ) {
      option.remove();
    }

  });


  /*
    Make sure Brownie Bites exists.
  */

  const hasBrownieBites = [...select.options].some(
    option =>
      option.value.trim().toLowerCase() === "brownie bites"
  );


  if (!hasBrownieBites) {

    const option = document.createElement("option");

    option.value = "Brownie Bites";
    option.textContent = "Brownie Bites";

    select.appendChild(option);
  }

}


/* =========================================================
   WHATSAPP
========================================================= */

function setWhatsAppLinks() {

  const url =
    `https://wa.me/${BUSINESS.phone}?text=` +
    encodeURIComponent(
      "Hi Desi Crumbs! I'd like to place an order."
    );


  [
    "headerWhatsApp",
    "heroWhatsApp",
    "footerWhatsApp",
    "storyWhatsApp",
    "tinWhatsApp"
  ].forEach(id => {

    const el = $("#" + id);

    if (el) {
      el.href = url;
    }

  });

}


/* =========================================================
   TOAST
========================================================= */

function toast(msg) {

  const t = $("#toast");

  if (!t) return;

  t.textContent = msg;

  t.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {

    t.classList.remove("show");

  }, 2600);

}


/* =========================================================
   NAVIGATION
========================================================= */

function openView(view) {

  $$(".view").forEach(v => {

    v.classList.toggle(
      "active",
      v.dataset.viewSection === view
    );

  });


  $$(".desktop-nav button,.mobile-nav button,[data-view]")
    .forEach(button => {

      button.classList.toggle(
        "current",
        button.dataset.view === view
      );

    });


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });


  const mobileNav = $("#mobileNav");
  const menuToggle = $("#menuToggle");

  if (mobileNav) {
    mobileNav.classList.remove("open");
  }

  if (menuToggle) {
    menuToggle.setAttribute(
      "aria-expanded",
      "false"
    );
  }

}


function initNavigation() {

  $$("[data-view]").forEach(button => {

    button.addEventListener(
      "click",
      () => openView(button.dataset.view)
    );

  });


  $$(".category-card").forEach(button => {

    button.addEventListener("click", () => {

      openView("menu");

      setTimeout(() => {

        activateMenu(
          button.dataset.menuJump
        );

      }, 80);

    });

  });


  const menuToggle = $("#menuToggle");

  if (menuToggle) {

    menuToggle.addEventListener("click", () => {

      const nav = $("#mobileNav");

      if (!nav) return;

      const open = nav.classList.toggle("open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(open)
      );

    });

  }


  const mobileCart = $("#mobileCart");

  if (mobileCart) {
    mobileCart.addEventListener(
      "click",
      openCart
    );
  }


  const footerCart = $("#footerCart");

  if (footerCart) {
    footerCart.addEventListener(
      "click",
      openCart
    );
  }

}


/* =========================================================
   WELCOME
========================================================= */

function initWelcome() {

  const form = $("#welcomeForm");

  if (!form) return;


  form.addEventListener("submit", e => {

    e.preventDefault();


    const first =
      $("#firstName")?.value.trim() || "";

    const last =
      $("#lastName")?.value.trim() || "";


    if (!first || !last) {

      $("#welcomeError").textContent =
        "Please enter both names.";

      return;
    }


    if (
      !/^[\p{L} .'-]{1,40}$/u.test(first) ||
      !/^[\p{L} .'-]{1,40}$/u.test(last)
    ) {

      $("#welcomeError").textContent =
        "Please use letters for your name.";

      return;
    }


    customer = {
      first,
      last
    };


    const customerName = $("#customerName");

    if (customerName) {
      customerName.textContent = esc(first);
    }


    $("#welcomeScreen")?.classList.add("hidden");

    document.body.classList.remove("lock");

  });


  document.body.classList.add("lock");


  setTimeout(() => {

    $("#firstName")?.focus();

  }, 150);

}


/* =========================================================
   MENU TABS
========================================================= */

function activateMenu(key) {

  $$(".menu-tab").forEach(button => {

    button.classList.toggle(
      "active",
      button.dataset.menuCategory === key
    );

  });


  $$(".menu-panel").forEach(panel => {

    panel.classList.toggle(
      "active",
      panel.dataset.menuPanel === key
    );

  });

}


function initMenuTabs() {

  $$(".menu-tab").forEach(button => {

    button.addEventListener(
      "click",
      () => activateMenu(
        button.dataset.menuCategory
      )
    );

  });

}


/* =========================================================
   CHEESECAKE
========================================================= */

function cheesecakeState() {

  const mode =
    $("#cheesecakeMode")?.value || "";

  const flavour =
    $("#cheesecakeFlavour")?.value || "";

  const qty =
    $("#cheesecakeQty")?.value || "";

  const size =
    $("#cheesecakeSize")?.value || "";


  return {
    mode,
    flavour,
    qty,
    size,
    price:
      CHEESECAKE_PRICES[flavour] ?? null
  };

}


function syncCheesecake() {

  const s = cheesecakeState();

  const piece =
    s.mode === "pieces";

  const whole =
    s.mode === "whole";


  $(".pieces-field")?.classList.toggle(
    "hidden",
    !piece
  );

  $(".size-field")?.classList.toggle(
    "hidden",
    !whole
  );


  const img =
    CHEESECAKE_IMAGES[s.flavour] || {};


  /*
    Piece selection = piece image
    Whole cake selection = whole cake image
  */

  let src;

  if (whole) {

    src =
      img.whole ||
      img.fallback ||
      "assets/mix-piecesof-cheesecakes-posters.jpg";

  } else {

    src =
      img.piece ||
      img.fallback ||
      "assets/mix-piecesof-cheesecakes-posters.jpg";

  }


  const preview = $("#cheesecakePreview");

  if (preview) {

    preview.src = src;

    preview.alt =
      img.alt || "Cheesecake";

  }


  const title =
    $("#cheesecakeTitle");

  if (title) {

    title.textContent =
      s.flavour
        ? `${s.flavour} Cheesecake`
        : "Cheesecake";

  }


  const imageTag =
    $("#cheesecakeImageTag");

  if (imageTag) {

    imageTag.textContent =
      whole
        ? "Whole cake preview"
        : "Piece preview";

  }


  const valid =
    !!s.flavour &&
    (
      (piece && Number(s.qty) >= 1) ||
      (whole && !!s.size)
    );


  const enquiry =
    valid &&
    (
      whole ||
      s.price === null
    );


  const priceElement =
    $("#cheesecakePrice");


  if (priceElement) {

    if (!s.flavour) {

      priceElement.textContent =
        "Choose flavour";

    } else if (!s.mode) {

      priceElement.textContent =
        "Choose format";

    } else if (whole) {

      priceElement.textContent =
        "Price on Enquiry";

    } else if (s.price) {

      priceElement.textContent =
        `${money(s.price)} / piece`;

    } else {

      priceElement.textContent =
        "Price on Enquiry";

    }

  }


  const button =
    $('[data-product="Cheesecake"] .add-btn');


  if (button) {

    button.disabled = !valid;

    button.textContent =
      enquiry
        ? "Enquire on WhatsApp"
        : "Add to Cart";

    button.dataset.enquiry =
      String(enquiry);

  }

}


/* =========================================================
   BROWNIES
========================================================= */

function brownieState() {

  const type =
    $("#brownieType")?.value || "";

  const flavour =
    $("#brownieFlavour")?.value || "";

  const qty =
    Number($("#brownieQty")?.value || 0);


  return {
    type,
    flavour,
    qty,
    price:
      BROWNIE_PRICES[flavour] ?? null
  };

}


/* =========================================================
   BROWNIE BITES PRICE CALCULATOR
========================================================= */

function brownieBitesTotal(quantity) {

  const qty = Number(quantity) || 0;

  const batches =
    Math.floor(qty / 3);

  const singles =
    qty % 3;


  return (
    batches * 90 +
    singles * 35
  );

}


function brownieBitesPriceText(quantity) {

  const qty = Number(quantity) || 0;

  if (qty <= 0) {

    return "₹35 / piece · ₹90 / 3-piece batch";

  }


  const batches =
    Math.floor(qty / 3);

  const singles =
    qty % 3;


  const total =
    brownieBitesTotal(qty);


  if (qty === 3) {

    return "₹90 / 3-piece batch";

  }


  if (qty < 3) {

    return `₹35 / piece · Total: ${money(total)}`;

  }


  if (singles === 0) {

    return `${batches} × 3-piece batch · Total: ${money(total)}`;

  }


  return `${batches} batch + ${singles} piece · Total: ${money(total)}`;

}


/* =========================================================
   BROWNIE UI
========================================================= */

function syncBrownie() {

  const s = brownieState();


  const src =
    BROWNIE_IMAGES[s.flavour] ||
    "assets/chocolate-brownies.jpg";


  const preview =
    $("#browniePreview");


  if (preview) {

    preview.src = src;

    preview.alt =
      s.flavour
        ? `${s.flavour} brownies`
        : "Chocolate brownies";

  }


  const title =
    $("#brownieTitle");


  if (title) {

    title.textContent =
      s.flavour ||
      "Chocolate Brownies";

  }


  const valid =
    !!s.type &&
    !!s.flavour &&
    s.qty >= 1;


  const enquiry =
    valid &&
    s.price === null;


  const priceElement =
    $("#browniePrice");


  if (priceElement) {

    if (!s.type || !s.flavour) {

      priceElement.textContent =
        "Choose texture & flavour";

    }

    else if (enquiry) {

      priceElement.textContent =
        "Price on Enquiry";

    }

    else if (
      s.flavour === "Brownie Bites"
    ) {

      priceElement.textContent =
        brownieBitesPriceText(s.qty);

    }

    else {

      priceElement.textContent =
        `${money(s.price)} / brownie`;

    }

  }


  const button =
    $('[data-product="Brownie Box"] .add-btn');


  if (button) {

    button.disabled = !valid;

    button.textContent =
      enquiry
        ? "Enquire on WhatsApp"
        : "Add to Cart";

    button.dataset.enquiry =
      String(enquiry);

  }

}


/* =========================================================
   COOKIES
========================================================= */

function cookieState() {

  const flavour =
    $("#cookieFlavour")?.value || "";

  const qty =
    Number($("#cookieQty")?.value || 0);


  return {
    flavour,
    qty,
    price:
      COOKIE_PRICES[flavour] ?? null
  };

}


function syncCookie() {

  const s = cookieState();


  const src =
    COOKIE_IMAGES[s.flavour] ||
    "assets/cookies-mixed.jpg";


  const preview =
    $("#cookiePreview");


  if (preview) {

    preview.src = src;

    preview.alt =
      s.flavour
        ? `${s.flavour} cookies`
        : "Assorted cookies";

  }


  const title =
    $("#cookieTitle");


  if (title) {

    title.textContent =
      s.flavour ||
      "Chocolate Chip Cookies";

  }


  /*
    Cookies must always be ordered
    in multiples of 3.
  */

  const valid =
    !!s.flavour &&
    Number.isInteger(s.qty) &&
    s.qty >= 3 &&
    s.qty % 3 === 0;


  const price =
    $("#cookiePrice");


  if (price) {

    if (!s.flavour) {

      price.textContent =
        "Choose flavour";

    } else {

      price.textContent =
        `${money(s.price)} / 3 cookies`;

    }

  }


  const button =
    $('[data-product="Cookie Box"] .add-btn');


  if (button) {

    button.disabled = !valid;

    button.textContent =
      "Add to Cart";

  }

}


/* =========================================================
   ADD ITEM
========================================================= */

function addItem(item) {

  cart.push(item);

  renderCart();

  toast(
    `${item.name} added to your cart.`
  );

}


/* =========================================================
   ADD CHEESECAKE
========================================================= */

function addCheesecake() {

  const s =
    cheesecakeState();


  const valid =
    !!s.flavour &&
    (
      (
        s.mode === "pieces" &&
        Number(s.qty) >= 1
      ) ||
      (
        s.mode === "whole" &&
        !!s.size
      )
    );


  if (!valid) {

    return toast(
      "Please complete the cheesecake options."
    );

  }


  /*
    Whole cakes are always enquiry.
    Cheesecake flavours without a piece price
    are also enquiry.
  */

  const enquiry =
    s.mode === "whole" ||
    s.price === null;


  if (enquiry) {

    pendingOrder = {

      type: "enquiry",

      enquiry: {

        name:
          `${s.flavour} Cheesecake`,

        details: [

          `Format: ${
            s.mode === "whole"
              ? "Whole cake"
              : "Pieces"
          }`,

          `Flavour: ${s.flavour}`,

          ...(s.mode === "whole"
            ? [`Size: ${s.size}`]
            : [`Quantity: ${s.qty}`])

        ],

        price:
          "Price on Enquiry"

      }

    };


    return openFeedback();

  }


  addItem({

    name:
      `${s.flavour} Cheesecake`,

    qty:
      Number(s.qty),

    details: [

      "Format: Pieces",

      `Flavour: ${s.flavour}`,

      `Quantity: ${s.qty}`

    ],

    unitPrice:
      s.price,

    total:
      s.price * Number(s.qty)

  });

}


/* =========================================================
   ADD BROWNIE
========================================================= */

function addBrownie() {

  const s =
    brownieState();


  if (
    !s.type ||
    !s.flavour ||
    s.qty < 1
  ) {

    return toast(
      "Please choose texture, flavour and quantity."
    );

  }


  /*
    Enquiry brownies:
    Nuts Brownie
    Millet / Sugar-Free Brownie
  */

  if (s.price === null) {

    pendingOrder = {

      type: "enquiry",

      enquiry: {

        name:
          `${s.flavour} Brownie`,

        details: [

          `Texture: ${s.type}`,

          `Flavour: ${s.flavour}`,

          `Quantity: ${s.qty}`

        ],

        price:
          "Price on Enquiry"

      }

    };


    return openFeedback();

  }


  /* -----------------------------------------
     BROWNIE BITES
     ₹35 / piece
     ₹90 / 3-piece batch
  ----------------------------------------- */

  if (
    s.flavour === "Brownie Bites"
  ) {

    const total =
      brownieBitesTotal(s.qty);


    addItem({

      name:
        "Brownie Bites",

      qty:
        s.qty,

      details: [

        `Texture: ${s.type}`,

        "Flavour: Brownie Bites",

        `Quantity: ${s.qty}`,

        "Pricing: ₹35/piece · ₹90/3-piece batch"

      ],

      unitPrice:
        35,

      total:
        total

    });


    return;

  }


  /* -----------------------------------------
     NORMAL BROWNIES
  ----------------------------------------- */

  addItem({

    name:
      `${s.flavour} Brownie`,

    qty:
      s.qty,

    details: [

      `Texture: ${s.type}`,

      `Flavour: ${s.flavour}`,

      `Quantity: ${s.qty}`

    ],

    unitPrice:
      s.price,

    total:
      s.price * s.qty

  });

}


/* =========================================================
   ADD COOKIES
========================================================= */

function addCookie() {

  const s =
    cookieState();


  if (
    !s.flavour ||
    !Number.isInteger(s.qty) ||
    s.qty < 3 ||
    s.qty % 3 !== 0
  ) {

    return toast(
      "Cookies must be ordered in multiples of 3: 3, 6, 9, 12…"
    );

  }


  addItem({

    name:
      `${s.flavour} Cookies`,

    qty:
      s.qty,

    details: [

      `Flavour: ${s.flavour}`,

      `Quantity: ${s.qty} (multiple of 3)`

    ],

    unitPrice:
      s.price,

    total:
      s.price * (s.qty / 3)

  });

}


/* =========================================================
   PRODUCT EVENTS
========================================================= */

function initProducts() {

  [
    "cheesecakeMode",
    "cheesecakeFlavour",
    "cheesecakeQty",
    "cheesecakeSize"
  ].forEach(id => {

    const element = $("#" + id);

    if (element) {

      element.addEventListener(
        "input",
        syncCheesecake
      );

      element.addEventListener(
        "change",
        syncCheesecake
      );

    }

  });


  [
    "brownieType",
    "brownieFlavour",
    "brownieQty"
  ].forEach(id => {

    const element = $("#" + id);

    if (element) {

      element.addEventListener(
        "input",
        syncBrownie
      );

      element.addEventListener(
        "change",
        syncBrownie
      );

    }

  });


  [
    "cookieFlavour",
    "cookieQty"
  ].forEach(id => {

    const element = $("#" + id);

    if (element) {

      element.addEventListener(
        "input",
        syncCookie
      );

      element.addEventListener(
        "change",
        syncCookie
      );

    }

  });


  const cheesecakeButton =
    $('[data-product="Cheesecake"] .add-btn');

  if (cheesecakeButton) {

    cheesecakeButton.addEventListener(
      "click",
      addCheesecake
    );

  }


  const brownieButton =
    $('[data-product="Brownie Box"] .add-btn');

  if (brownieButton) {

    brownieButton.addEventListener(
      "click",
      addBrownie
    );

  }


  const cookieButton =
    $('[data-product="Cookie Box"] .add-btn');

  if (cookieButton) {

    cookieButton.addEventListener(
      "click",
      addCookie
    );

  }


  /*
    IMPORTANT:
    Clean HTML dropdown BEFORE syncing brownie.
  */

  cleanBrownieDropdown();

  syncCheesecake();
  syncBrownie();
  syncCookie();

}


/* =========================================================
   CART
========================================================= */

function renderCart() {

  const cartCount =
    $("#cartCount");

  const mobileCartCount =
    $("#mobileCartCount");


  if (cartCount) {
    cartCount.textContent =
      cart.length;
  }


  if (mobileCartCount) {
    mobileCartCount.textContent =
      cart.length;
  }


  const cartBody =
    $("#cartBody");


  if (!cartBody) return;


  if (!cart.length) {

    cartBody.innerHTML = `
      <div class="empty-cart">
        <span>♡</span>
        <h3>Your cart is waiting.</h3>
        <p>
          Add favourites and we’ll prepare
          the order summary for WhatsApp.
        </p>
      </div>
    `;


    $("#cartTotal").textContent =
      "Total: —";


    $("#checkoutButton").disabled =
      true;


    return;

  }


  cartBody.innerHTML = cart
    .map((item, index) => `

      <div class="cart-item">

        <div class="cart-item-head">

          <h3>
            ${esc(item.name)}
          </h3>

          <button
            class="remove-item"
            data-i="${index}"
          >
            Remove
          </button>

        </div>

        <p>
          ${item.details
            .map(esc)
            .join(" · ")}
        </p>

        <p>
          <strong>Price:</strong>
          ${money(item.total)}
        </p>

      </div>

    `)
    .join("");


  $$(".remove-item").forEach(button => {

    button.addEventListener(
      "click",
      () => {

        cart.splice(
          Number(button.dataset.i),
          1
        );

        renderCart();

      }
    );

  });


  const total =
    cart.reduce(
      (sum, item) =>
        sum + item.total,
      0
    );


  $("#cartTotal").textContent =
    `Total: ${money(total)}`;


  validateOrderTime();

}


/* =========================================================
   24-HOUR ORDER RULE
========================================================= */

function minDate() {

  return new Date(
    Date.now() +
    24 * 60 * 60 * 1000
  );

}


function localDT(d) {

  const p =
    n => String(n).padStart(2, "0");


  return `${d.getFullYear()}-${p(
    d.getMonth() + 1
  )}-${p(
    d.getDate()
  )}T${p(
    d.getHours()
  )}:${p(
    d.getMinutes()
  )}`;

}


function validateOrderTime() {

  const input =
    $("#orderDateTime");


  if (!input) return;


  input.min =
    localDT(minDate());


  const ok =
    cart.length &&
    input.value &&
    new Date(input.value).getTime() >=
      Date.now() +
      24 * 60 * 60 * 1000;


  const error =
    $("#orderTimeError");


  if (error) {

    error.textContent =
      cart.length && !input.value
        ? "Choose your requested date and time."
        : (
            !ok && input.value
              ? "Please choose a time at least 24 hours from now."
              : ""
          );

  }


  const checkout =
    $("#checkoutButton");


  if (checkout) {

    checkout.disabled =
      !ok;

  }

}


/* =========================================================
   CART OPEN / CLOSE
========================================================= */

function openCart() {

  const cartElement =
    $("#cart");


  if (!cartElement) return;


  cartElement.classList.add("open");

  cartElement.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.classList.add("lock");

  validateOrderTime();

}


function closeCart() {

  const cartElement =
    $("#cart");


  if (!cartElement) return;


  cartElement.classList.remove("open");

  cartElement.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.classList.remove("lock");

}


/* =========================================================
   FEEDBACK
========================================================= */

function openFeedback() {

  const modal =
    $("#feedbackModal");


  if (!modal) return;


  modal.classList.remove("hidden");

  document.body.classList.add("lock");

}


/* =========================================================
   WHATSAPP MESSAGE
========================================================= */

function orderMessage() {

  /*
    ENQUIRY ORDER
  */

  if (
    pendingOrder?.type === "enquiry"
  ) {

    return `
Hi Desi Crumbs! I’d like to enquire about an order.

Customer Name: ${customer.first} ${customer.last}

Product: ${pendingOrder.enquiry.name}

${pendingOrder.enquiry.details.join("\n")}

Price: ${pendingOrder.enquiry.price}

Please confirm availability and the final price.
`.trim();

  }


  /*
    NORMAL CART ORDER
  */

  const date =
    new Date(
      pendingOrder.date
    ).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    );


  let message = `
Hi Desi Crumbs! I’d like to place an order.

Customer Name: ${customer.first} ${customer.last}

Order:
`;


  pendingOrder.items.forEach(
    (item, index) => {

      message += `

${index + 1}. ${item.name}
   ${item.details.join("\n   ")}
   Price: ${money(item.total)}
`;

    }
  );


  message += `

Requested Date/Time: ${date}

I understand the order is confirmed only after WhatsApp review.`;


  return message.trim();

}


/* =========================================================
   FINISH WHATSAPP
========================================================= */

function finishWhatsApp() {

  window.open(
    `https://wa.me/${BUSINESS.phone}?text=${encodeURIComponent(
      orderMessage()
    )}`,
    "_blank",
    "noopener"
  );


  $("#feedbackModal")
    ?.classList.add("hidden");


  closeCart();

}


/* =========================================================
   CART EVENTS
========================================================= */

function initCart() {

  $("#cartButton")
    ?.addEventListener(
      "click",
      openCart
    );


  $("#closeCart")
    ?.addEventListener(
      "click",
      closeCart
    );


  $("#cartBackdrop")
    ?.addEventListener(
      "click",
      closeCart
    );


  $("#orderDateTime")
    ?.addEventListener(
      "change",
      validateOrderTime
    );


  $("#checkoutButton")
    ?.addEventListener(
      "click",
      () => {

        if (
          !cart.length ||
          $("#checkoutButton").disabled
        ) {
          return;
        }


        pendingOrder = {

          type: "cart",

          items:
            JSON.parse(
              JSON.stringify(cart)
            ),

          date:
            $("#orderDateTime").value

        };


        openFeedback();

      }
    );

}


/* =========================================================
   FEEDBACK EVENTS
========================================================= */

function initFeedback() {

  $$(".feedback-actions button")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const message =
            button.dataset.feedback === "happy"
              ? "We’re so happy you enjoyed your experience! 💛"
              : "Thank you for the feedback — we’ll keep improving.";


          const feedbackMessage =
            $("#feedbackMessage");


          if (feedbackMessage) {

            feedbackMessage.textContent =
              message;

          }


          $("#continueWhatsApp")
            ?.classList.remove("hidden");

        }
      );

    });


  $("#continueWhatsApp")
    ?.addEventListener(
      "click",
      finishWhatsApp
    );

}


/* =========================================================
   CUSTOM CAKE
========================================================= */

function initCake() {

  const form =
    $("#cakeForm");


  if (!form) return;


  form.addEventListener(
    "submit",
    e => {

      e.preventDefault();


      const weight =
        $("#cakeWeight")?.value || "";

      const shape =
        $("#cakeShape")?.value || "";

      const flavour =
        $("#cakeFlavour")
          ?.value
          .trim() || "";

      const description =
        $("#cakeDescription")
          ?.value
          .trim() || "";


      if (
        !weight ||
        !shape ||
        !flavour
      ) {

        $("#cakeError").textContent =
          "Please choose a weight, shape and flavour.";

        return;

      }


      $("#cakeError").textContent = "";


      pendingOrder = {

        type: "enquiry",

        enquiry: {

          name:
            "Custom Celebration Cake",

          details: [

            `Weight: ${weight}`,

            `Shape: ${shape}`,

            `Flavour: ${flavour}`,

            ...(description
              ? [`Design notes: ${description}`]
              : [])

          ],

          price:
            "Price on Enquiry"

        }

      };


      openFeedback();

    }
  );

}


/* =========================================================
   GLOBAL
========================================================= */

function initGlobal() {

  const year =
    $("#year");


  if (year) {

    year.textContent =
      new Date().getFullYear();

  }


  setWhatsAppLinks();


  document.addEventListener(
    "keydown",
    e => {

      if (e.key === "Escape") {

        closeCart();

        $("#feedbackModal")
          ?.classList.add("hidden");

        document.body.classList.remove(
          "lock"
        );

      }

    }
  );

}


/* =========================================================
   START WEBSITE
========================================================= */

cleanBrownieDropdown();

initWelcome();

initNavigation();

initMenuTabs();

initProducts();

initCart();

initFeedback();

initCake();

initGlobal();

renderCart();