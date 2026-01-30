// ---------------- UI HANDLING ----------------

document.getElementById("guideBtn").addEventListener("click", handleSearchSubmit);

function handleSearchSubmit() {
  const task = document.getElementById("taskInput").value.trim();

  if (task === "") {
    alert("Please enter a task");
    return;
  }

  showLoadingState();

  // Simulating AI task understanding (prototype)
  setTimeout(() => {
    const steps = generateSteps(task);
    hideLoadingState();
    sendStepsToContentScript(steps);
    startStepDisplay(steps);
  }, 1000);
}

function showLoadingState() {
  document.getElementById("loading").classList.remove("hidden");
}

function hideLoadingState() {
  document.getElementById("loading").classList.add("hidden");
}

// ---------------- STEP DISPLAY ----------------

let currentStepIndex = 0;
let activeSteps = [];

function startStepDisplay(steps) {
  activeSteps = steps;
  currentStepIndex = 0;
  document.getElementById("stepBox").classList.remove("hidden");
  showCurrentStep(activeSteps[currentStepIndex]);
  updateStepProgress(currentStepIndex + 1, activeSteps.length);
}

function showCurrentStep(text) {
  document.getElementById("stepText").innerText = text;
}

function updateStepProgress(current, total) {
  document.getElementById("progressText").innerText =
    `Step ${current} of ${total}`;
}

// ---------------- COMMUNICATION ----------------

function sendStepsToContentScript(steps) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "START_GUIDE",
      steps: steps
    });
  });
}

// ---------------- PROTOTYPE STEP GENERATION ----------------

function generateSteps(taskText) {
  const task = taskText.toLowerCase();

  if (task.includes("new note")) {
    return [
      "Click on 'Take a note'",
      "Type your note content",
      "Note is saved automatically"
    ];
  }

  if (task.includes("checklist")) {
    return [
      "Click on 'New list'",
      "Enter checklist items",
      "Press Enter after each item"
    ];
  }

  if (task.includes("reminder")) {
    return [
      "Open the note",
      "Click on the Reminder icon",
      "Select date and time"
    ];
  }

  if (task.includes("color")) {
    return [
      "Open the note",
      "Click on the Color palette icon",
      "Choose a color"
    ];
  }

  // Default fallback
  return [
    "Open Google Keep",
    "Select the appropriate option",
    "Complete the task"
  ];
}
