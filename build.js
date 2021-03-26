const fs = require("fs");
const core = require("@actions/core");

const { execSync } = require('child_process');

class BuildScully {
    docsDir = "docs"
    distDir = "dist"
    buildScully = `ng build --prod --base-href "/"`;
    deployScully = `yarn run scully -- --scanRoutes`;

    constructor() {
        this.fiveMinuteTimeout = 1000 * 60 * 5;
    }

    main() {
        try {
            fs.rmdirSync(this.docsDir, { recursive: true });

            execSync(this.buildScully, { timeout: this.fiveMinuteTimeout, stdio: 'inherit' });
            execSync(this.deployScully, { timeout: this.fiveMinuteTimeout, stdio: 'inherit' });

            fs.rmdirSync(this.distDir, { recursive: true });
        } catch (e) {
            core.setFailed(e.message);
        } finally {}
    }
}

new BuildScully().main();