console.log("GuideBuddy content script loaded");

/* -------------------------------
   Entry point
--------------------------------*/
function startGuide(steps) {
  let currentStep = 0;

  function next() {
    if (currentStep >= steps.length) {
      clearGuide();
      return;
    }

    const step = steps[currentStep];
    executeStep(step, () => {
      currentStep++;
      next();
    });
  }

  next();
}

/* -------------------------------
   Step execution
--------------------------------*/
function executeStep(step, onDone) {
  let element = null;

  switch (step.id) {
    case "new_note":
      element = findNewNoteButton();
      break;

    case "checklist":
      element = findChecklistButton();
      break;

    case "set_reminder":
      element = findReminderButton();
      break;

    case "change_color":
      element = findColorPaletteButton();
      break;

    default:
      console.warn("Unknown step:", step.id);
      onDone();
      return;
  }

  if (!element) {
    alert("GuideBuddy: Could not find element for this step.");
    return;
  }

  highlightElement(element);
  showInstruction(step.text);

  waitForUserClick(element, () => {
    removeHighlight();
    removeInstruction();
    onDone();
  });
}

/* -------------------------------
   Google Keep element finders
--------------------------------*/
function findNewNoteButton() {
  return document.querySelector('[aria-label="Take a note"]');
}

function findChecklistButton() {
  return document.querySelector('[aria-label="New list"]');
}

function findReminderButton() {
  return document.querySelector('[aria-label="Remind me"]');
}

function findColorPaletteButton() {
  return document.querySelector('[aria-label="Change color"]');
}

/* -------------------------------
   Highlight utilities
--------------------------------*/
let highlightedElement = null;

function highlightElement(element) {
  highlightedElement = element;
  element.style.outline = "3px solid #ff9800";
  element.style.borderRadius = "6px";
}

function removeHighlight() {
  if (highlightedElement) {
    highlightedElement.style.outline = "";
    highlightedElement = null;
  }
}

/* -------------------------------
   Instruction tooltip
--------------------------------*/
let instructionBox = null;

function showInstruction(text) {
  instructionBox = document.createElement("div");
  instructionBox.innerText = text;

  instructionBox.style.position = "fixed";
  instructionBox.style.bottom = "20px";
  instructionBox.style.left = "50%";
  instructionBox.style.transform = "translateX(-50%)";
  instructionBox.style.background = "#323232";
  instructionBox.style.color = "#fff";
  instructionBox.style.padding = "10px 16px";
  instructionBox.style.borderRadius = "8px";
  instructionBox.style.zIndex = "9999";
  instructionBox.style.fontSize = "14px";

  document.body.appendChild(instructionBox);
}

function removeInstruction() {
  if (instructionBox) {
    instructionBox.remove();
    instructionBox = null;
  }
}

/* -------------------------------
   Wait for user action
--------------------------------*/
function waitForUserClick(element, callback) {
  function handler() {
    element.removeEventListener("click", handler);
    callback();
  }
  element.addEventListener("click", handler);
}

/* -------------------------------
   Cleanup
--------------------------------*/
function clearGuide() {
  removeHighlight();
  removeInstruction();
  console.log("GuideBuddy: Guide completed");
}

/* -------------------------------
   Message listener
--------------------------------*/
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "START_GUIDE") {
    startGuide(message.steps);
  }
});
