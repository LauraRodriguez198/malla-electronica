document.addEventListener("DOMContentLoaded", () => {
  const subjects = document.querySelectorAll(".subject");

  // Cargar desde localStorage
  const savedState = JSON.parse(localStorage.getItem("completedSubjects") || "[]");

  // Aplicar materias completadas desde el almacenamiento
  savedState.forEach(code => {
    const subject = document.querySelector(`.subject[data-code="${code}"]`);
    if (subject) {
      subject.classList.add("completed");
      unlockNext(subject.dataset.code);
    }
  });

  subjects.forEach(subject => {
    subject.addEventListener("click", () => {
      if (subject.classList.contains("locked")) return;

      subject.classList.toggle("completed");

      const code = subject.dataset.code;
      const completed = JSON.parse(localStorage.getItem("completedSubjects") || "[]");

      if (subject.classList.contains("completed")) {
        if (!completed.includes(code)) completed.push(code);
        unlockNext(code);
      } else {
        const index = completed.indexOf(code);
        if (index !== -1) completed.splice(index, 1);
        lockDependents(code);
      }

      localStorage.setItem("completedSubjects", JSON.stringify(completed));
    });
  });

  function unlockNext(completedCode) {
    document.querySelectorAll(`.subject.locked[data-prereq="${completedCode}"]`).forEach(subject => {
      const prereq = subject.dataset.prereq;
      const completed = JSON.parse(localStorage.getItem("completedSubjects") || "[]");
      if (completed.includes(prereq)) {
        subject.classList.remove("locked");
      }
    });
  }

  function lockDependents(removedCode) {
    const completed = JSON.parse(localStorage.getItem("completedSubjects") || "[]");

    document.querySelectorAll(`.subject[data-prereq="${removedCode}"]`).forEach(subject => {
      const dependentCode = subject.dataset.code;

      // Bloquear la materia
      subject.classList.add("locked");
      subject.classList.remove("completed");

      // Remover del almacenamiento
      const idx = completed.indexOf(dependentCode);
      if (idx !== -1) completed.splice(idx, 1);

      // Recursivamente bloquear dependientes de esta materia
      lockDependents(dependentCode);
    });

    localStorage.setItem("completedSubjects", JSON.stringify(completed));
  }
});
