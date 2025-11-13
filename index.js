const allPagesCheckbox = document.getElementById("all-pages");
const pageCheckboxes = document.querySelectorAll(".page-checkbox");

function setCheckboxState(checkbox, state) {
  checkbox.classList.remove(
    "hover-unchecked",
    "pressing-unchecked",
    "clicked-unchecked",
    "checked-out",
    "checked-hover",
    "checked-pressing"
  );
  if (state) {
    checkbox.classList.add(state);
  }
}

function handleCheckboxEvents(checkbox) {
  let isPressed = false;

  checkbox.addEventListener("mousedown", () => {
    isPressed = true;
    if (checkbox.checked) {
      setCheckboxState(checkbox, "checked-pressing");
    } else {
      setCheckboxState(checkbox, "pressing-unchecked");
    }
  });

  checkbox.addEventListener("mouseup", () => {
    isPressed = false;
    if (checkbox.checked) {
      setCheckboxState(checkbox, "checked-hover");
    } else {
      setCheckboxState(checkbox, "clicked-unchecked");
    }
  });

  checkbox.addEventListener("mouseover", () => {
    if (isPressed) {
      if (checkbox.checked) {
        setCheckboxState(checkbox, "checked-pressing");
      } else {
        setCheckboxState(checkbox, "pressing-unchecked");
      }
    } else {
      if (checkbox.checked) {
        setCheckboxState(checkbox, "checked-hover");
      } else {
        setCheckboxState(checkbox, "hover-unchecked");
      }
    }
  });

  checkbox.addEventListener("mouseout", () => {
    if (checkbox.checked) {
      setCheckboxState(checkbox, "checked-out");
    } else {
      setCheckboxState(checkbox, null);
    }
  });

  checkbox.addEventListener("click", () => {
    if (checkbox.checked) {
      setCheckboxState(checkbox, "checked-out");
    } else {
      setCheckboxState(checkbox, null);
    }
    updateAllPagesCheckbox();
  });
}

[allPagesCheckbox, ...pageCheckboxes].forEach(handleCheckboxEvents);

allPagesCheckbox.addEventListener("click", () => {
  const isChecked = allPagesCheckbox.indeterminate
    ? false
    : allPagesCheckbox.checked;
  pageCheckboxes.forEach((checkbox) => {
    checkbox.checked = !isChecked;
    setCheckboxState(checkbox, checkbox.checked ? "checked-out" : null);
  });
  allPagesCheckbox.checked = !isChecked;
  updateAllPagesCheckbox();
});

pageCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    updateAllPagesCheckbox();
  });
});

function updateAllPagesCheckbox() {
  const numChecked = [...pageCheckboxes].filter(
    (checkbox) => checkbox.checked
  ).length;
  allPagesCheckbox.checked = numChecked === pageCheckboxes.length;
  allPagesCheckbox.indeterminate =
    numChecked > 0 && numChecked < pageCheckboxes.length;
  if (allPagesCheckbox.indeterminate) {
    allPagesCheckbox.classList.add("intermediate");
  } else {
    allPagesCheckbox.classList.remove("intermediate");
  }
}
