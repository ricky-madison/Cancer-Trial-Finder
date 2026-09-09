export class Wizard {
  /**
   * @param {object} opts
   * @param {NodeListOf<Element>} opts.stepEls - fieldset[data-step] elements, in order
   * @param {Element} opts.railList - the <ol> of rail steps
   * @param {Element} opts.btnBack
   * @param {Element} opts.btnNext
   * @param {Element} opts.btnSubmit
   * @param {(stepEl: Element) => boolean} opts.validateStep - return true if step is valid
   */
  constructor(opts) {
    this.steps = Array.from(opts.stepEls);
    this.railItems = Array.from(opts.railList.children);
    this.btnBack = opts.btnBack;
    this.btnNext = opts.btnNext;
    this.btnSubmit = opts.btnSubmit;
    this.validateStep = opts.validateStep || (() => true);
    this.current = 0;

    this.btnBack.addEventListener('click', () => this.go(this.current - 1));
    this.btnNext.addEventListener('click', () => {
      if (this.validateStep(this.steps[this.current])) {
        this.go(this.current + 1);
      }
    });
    this.railItems.forEach((li, i) => {
      li.addEventListener('click', () => {
        // Only allow jumping backward or to already-visited steps freely.
        if (i <= this.current) this.go(i);
      });
      li.style.cursor = 'pointer';
    });

    this.render();
  }

  go(index) {
    if (index < 0 || index >= this.steps.length) return;
    this.steps[this.current].hidden = true;
    this.current = index;
    this.steps[this.current].hidden = false;
    this.render();
    this.steps[this.current].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  render() {
    this.railItems.forEach((li, i) => {
      li.classList.toggle('is-active', i === this.current);
      li.classList.toggle('is-done', i < this.current);
    });
    this.btnBack.disabled = this.current === 0;
    const isLast = this.current === this.steps.length - 1;
    this.btnNext.hidden = isLast;
    this.btnSubmit.hidden = !isLast;
  }
}
