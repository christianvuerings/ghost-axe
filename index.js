/* global window, document */

class GhostAxe {
  contructor() {
    this.ghost = null;
  }

  setGhost(ghost) {
    this.ghost = ghost;
  }

  getGhost() {
    if (!this.ghost) {
      throw new Error("Please set your ghost instance with 'GhostAxe.setGhost'");
    }
    return this.ghost;
  }

  /**
   * Load the axe-core Accessibility library inside of ghost.js
   */
  async loadAxe() {
    await this.getGhost().injectScripts('node_modules/axe-core/axe.js');
  }

  /**
   * Get the a11y results
   */
  async getResults() {
    await this.getGhost().script(() => {
      window.axe.a11yCheck(document, (results) => {
        window.A11YRESULTS = results;
      });
    });

    return await this.getGhost().wait(async () =>
      await this.getGhost().script(() => window.A11YRESULTS)
    );
  }

  /**
   * Beautify the errors when there are any
   */
  beautifyErrors(results) {
    this.getGhost();
    return `
        A11Y Violations:
        ${JSON.stringify(results.violations, null, 4)}`;
  }
}

const ghostAxe = new GhostAxe();
export default ghostAxe;
