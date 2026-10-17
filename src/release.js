import metadata from '../package.json';

// Update package.json's version and releaseDate together for each published iteration.
export const VERSION=metadata.version;
export const RELEASE_DATE=metadata.releaseDate;
export const DISPLAY_DATE=RELEASE_DATE.replaceAll('-','.');
