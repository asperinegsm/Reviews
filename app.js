const analyticsState = {
  opens: Number(localStorage.getItem("rf_demo_opens") || 0),
  ratings: Number(localStorage.getItem("rf_demo_ratings") || 0),
  platformClicks: Number(localStorage.getItem("rf_demo_platform_clicks") || 0),
  negatives: Number(localStorage.getItem("rf_demo_negatives") || 0),
};

function persistAnalytics() {
  localStorage.setItem("rf_demo_opens", String(analyticsState.opens));
  localStorage.setItem("rf_demo_ratings", String(analyticsState.ratings));
  localStorage.setItem("rf_demo_platform_clicks", String(analyticsState.platformClicks));
  localStorage.setItem("rf_demo_negatives", String(analyticsState.negatives));
}

function updateCounters() {
  const bindings = {
    opensCount: analyticsState.opens,
    ratingsCount: analyticsState.ratings,
    platformClicksCount: analyticsState.platformClicks,
    negativeCount: analyticsState.negatives,
  };

  Object.entries(bindings).forEach(([id, value]) => {
    const node = document.getElementById(id);
    if (node) node.textContent = String(value);
  });
}

function syncPreviewText(inputId, targetId) {
  const input = document.getElementById(inputId);
  const target = document.getElementById(targetId);

  if (!input || !target) return;

  const applyValue = () => {
    target.textContent = input.value.trim() || target.textContent;
  };

  input.addEventListener("input", applyValue);
  applyValue();
}

function renderStars() {
  const starPicker = document.getElementById("starPicker");
  if (!starPicker) return;

  const positiveThreshold = document.getElementById("positiveThreshold");
  const thresholdValue = document.getElementById("thresholdValue");
  const positiveBranch = document.getElementById("positiveBranch");
  const negativeBranch = document.getElementById("negativeBranch");

  let selectedRating = 0;

  const paint = () => {
    [...starPicker.children].forEach((button, index) => {
      button.classList.toggle("star-button--active", index < selectedRating);
    });
  };

  const onRate = (rating) => {
    selectedRating = rating;
    analyticsState.ratings += 1;
    persistAnalytics();
    updateCounters();
    paint();

    const threshold = Number(positiveThreshold?.value || 4);
    if (rating >= threshold) {
      positiveBranch?.classList.remove("flow-result--hidden");
      negativeBranch?.classList.add("flow-result--hidden");
    } else {
      negativeBranch?.classList.remove("flow-result--hidden");
      positiveBranch?.classList.add("flow-result--hidden");
    }
  };

  Array.from({ length: 5 }, (_, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "star-button";
    button.textContent = "★";
    button.setAttribute("aria-label", `Оценка ${index + 1}`);
    button.addEventListener("click", () => onRate(index + 1));
    starPicker.appendChild(button);
  });

  positiveThreshold?.addEventListener("input", () => {
    if (thresholdValue) {
      thresholdValue.textContent = positiveThreshold.value;
    }
    if (selectedRating > 0) {
      onRate(selectedRating);
    }
  });
}

function initPlatformTabs() {
  const tabs = document.querySelectorAll(".platform-tab");
  const feedback = document.getElementById("platformFeedback");
  const locationSelect = document.getElementById("locationSelect");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      analyticsState.platformClicks += 1;
      persistAnalytics();
      updateCounters();

      if (feedback) {
        feedback.textContent = `Клиент из локации “${locationSelect?.value || "не выбрана"}” будет перенаправлен на ${tab.dataset.platform}.`;
      }
    });
  });
}

function initNegativeFlow() {
  const button = document.getElementById("sendIssueButton");
  const issueText = document.getElementById("issueText");
  const phoneInput = document.getElementById("phoneInput");
  const locationSelect = document.getElementById("locationSelect");
  const telegramMessage = document.getElementById("telegramMessage");
  const issueFeedback = document.getElementById("issueFeedback");
  const companyName = document.getElementById("companyName");

  if (!button) return;

  button.addEventListener("click", () => {
    analyticsState.negatives += 1;
    persistAnalytics();
    updateCounters();

    const company = companyName?.value || "Компания";
    const message = `🚨 Новый негативный сигнал\n\nКомпания: ${company}\nЛокация: ${locationSelect?.value || "Не выбрана"}\nПроблема: ${issueText?.value || "Не указана"}\nТелефон: ${phoneInput?.value || "Не указан"}\n\nДействие: связаться с клиентом и проверить ситуацию.`;

    if (telegramMessage) {
      telegramMessage.textContent = message;
    }

    if (issueFeedback) {
      issueFeedback.textContent = "Сигнал сформирован. В боевой версии это сообщение уйдёт владельцу бизнеса в Telegram.";
    }
  });
}

function initDemoPage() {
  if (!document.body.querySelector(".demo-main")) return;

  analyticsState.opens += 1;
  persistAnalytics();
  updateCounters();

  syncPreviewText("companyName", "previewCompany");
  syncPreviewText("welcomeText", "previewWelcome");
  syncPreviewText("negativeText", "previewNegative");
  renderStars();
  initPlatformTabs();
  initNegativeFlow();
}

updateCounters();
initDemoPage();
