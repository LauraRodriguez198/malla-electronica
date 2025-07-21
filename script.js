document.querySelectorAll('.subject').forEach(subject => {
  subject.addEventListener('click', () => {
    subject.classList.toggle('completed');

    // Buscar materias que dependan de esta
    const code = subject.dataset.code;
    document.querySelectorAll('.subject.locked').forEach(dep => {
      if (dep.dataset.prereq === code) {
        const req = document.querySelector(`.subject[data-code="${code}"]`);
        if (req && req.classList.contains('completed')) {
          dep.classList.remove('locked');
        }
      }
    });
  });
});
