import { writeFile } from 'fs/promises';

const main = async () => {
  const res = await fetch(
    'https://prod-team-4-1u3kkm05.REDACTED/api/openapi'
  );

  const json = await res.text();
  writeFile('openapi.json', json);
};

main();
