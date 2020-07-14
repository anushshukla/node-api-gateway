import semver from 'semver';
import childProcess from 'child_process';
import packageJson from './package.json';

const exec = command => new Promise((resolve) => {
  childProcess.exec(command, (error, stdout, stderr) => {
    if (error) {
      return resolve([error]);
    }
    if (stderr) {
      return resolve([stderr]);
    }
    return resolve([null, stdout.trim()]);
  })
});

const checkVersions = async () => {
  const satisfies = semver.satisfies;
  const {
    engines: {
      node: nodeVersion,
      npm: npmVersion
    }
  } = packageJson;
  const hasValidNodeVersion = satisfies(process.version, nodeVersion);
  if (!hasValidNodeVersion) {
    console.error(
      `Required node version ${nodeVersion} not satisfied with current version ${process.version}.`
    );
    process.exit(1);
  }

  const command = 'npm -v';
  const [ error, currentNvmVersion ] = await exec(command);

  if (error) {
    console.error(`Fetching npm version failed`);
    process.exit(1);
  }

  const hasValidNpmVersion = satisfies(currentNvmVersion, npmVersion);
  if (!hasValidNpmVersion) {
    console.error(
      `Required nvm version ${npmVersion} not satisfied with current version ${currentNvmVersion}.`
    );
    process.exit(1);
  }

  console.log(`Required node version ${nodeVersion} and nvm version ${npmVersion} satisfies this project's requirements`);
}

checkVersions().catch(console.log);
