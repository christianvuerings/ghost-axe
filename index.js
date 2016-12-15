/* global window, document */

class GhostAxe {
  contructor() {
    this.ghost = null;
  }

  getGhost() {
    if (!this.ghost) {
      throw new Error("Please set your ghost instance with 'GhostAxe.init'");
    }
    return this.ghost;
  }

  /**
   * Initialize the ghostAxe library with the ghost instance
   * also injects the axe-core accessibility library
   */
  async init(ghost) {
    this.ghost = ghost;

    await this.getGhost().injectScripts('node_modules/axe-core/axe.js');
  }

  /**
   * Get the a11y results
   */
  async getResults() {
    await this.getGhost().script(() => {
      window.axe.run((err, results) => {
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
